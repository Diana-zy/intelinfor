<template>
  <div class="page">
    <AppHeader />
    <main class="main">
      <div class="layout-left">
        <div class="page-layout">
          <breadcrumb :info="newInfo"></breadcrumb>
          <article v-if="newInfo" class="article">
            <h1 class="article-title">{{ newInfo.name }}</h1>
            <div class="news-author">
              <div>{{ newInfo.author?.name }}</div>
              <div>{{ newInfo.updated_at }}</div>
            </div>
            <div class="news-detail first_paragraph">{{ newInfo.first_paragraph }}</div>

            <!-- 文章摘要框 - SEO+GEO 优化 -->
            <div v-if="newInfo.seo_desc" class="article-summary">
              <div class="summary-icon">📋</div>
              <div class="summary-content">
                <h3 class="summary-title">Article Summary</h3>
                <p class="summary-text">{{ newInfo.seo_desc }}</p>
              </div>
            </div>

            <div id="relatedsearches1"> </div>
            <aside v-if="toc.length" class="toc-container">
              <h3 class="toc-title">Table of Contents</h3>
              <nav class="toc-nav">
                <ul class="toc-list">
                  <li
                    v-for="item in toc"
                    :key="item.id"
                    :class="['toc-item', `toc-level-${item.level}`]"
                    @click="scrollToAnchor(item.id)"
                  >
                    {{ item.text }}
                  </li>
                </ul>
              </nav>
            </aside>
            <NuxtImg
              format="auto"
              fit="cover"
              width="600"
              :src="newInfo.cover"
              :alt="newInfo.cover_seo_alt"
              class="article-img"
              preload
            />
            <!-- eslint-disable vue/no-v-html -->
            <div class="news-detail" v-html="htmlWithAnchor"></div>
            <!--eslint-enable-->

            <!-- FAQ 区块 - GEO 优化 -->
            <section v-if="articleFaqs && articleFaqs.length" class="faq-section">
              <h2 class="faq-title">Related Questions</h2>
              <div class="faq-list">
                <div v-for="(faq, index) in articleFaqs" :key="index" class="faq-item">
                  <h3 class="faq-question">{{ faq.question }}</h3>
                  <p class="faq-answer">{{ faq.answer }}</p>
                </div>
              </div>
            </section>
          </article>
          <section v-if="newInfo?.related_articles?.length">
            <h3 class="title-h2">Related Articles</h3>
            <div class="related-articles">
              <news-item-5 v-for="(item, i) in newInfo.related_articles" :key="i" :item="item">
              </news-item-5>
            </div>
          </section>
        </div>
      </div>
      <div class="layout-right">
        <right-side-box :rec-news="trendingNews?.list" :trending-news="recNews?.list" />
      </div>
    </main>
    <footer-seo :info="newInfo || {}" />
  </div>
</template>

<script>
import Breadcrumb from "../../components/Breadcrumb";
import AppHeader from "../../components/Header";
import NewsItem5 from "../../components/NewsItem5";
import RightSideBox from "../../components/RightSideBox";
import FooterSeo from "../../components/FooterSeo";
import { shuffleArray } from "../../utils/utils";
import { processHtmlWithToc, generateNestedToc } from "../../utils/cheerio-toc.js";

export default {
  components: {
    Breadcrumb,
    AppHeader,
    NewsItem5,
    RightSideBox,
    FooterSeo
  },
  async asyncData({ $axios, params, env }) {
    const path = params.detail;
    const lastDashIndex = path.lastIndexOf("-");
    const id = path.substring(lastDashIndex + 1, path.length);

    try {
      // 串行请求 API，避免并发触发限流
      // 首先获取详情数据（最重要）
      let data = null;
      try {
        data = await $axios.$get("/api/article/detail", {
          params: {
            site_id: env.SITE_ID,
            article_id: id,
            related_num: 3
          }
        });
      } catch (detailError) {
        console.error(`Failed to fetch detail for ID ${id}:`, detailError);
        return {
          newInfo: null,
          all: null,
          floatArray: [],
          toc: [],
          id,
          htmlWithAnchor: "",
          recNews: null,
          trendingNews: null,
          articleFaqs: []
        };
      }

      // 如果详情数据为空，直接返回
      if (!data?.content) {
        console.warn(`No content found for ID ${id}`);
        return {
          newInfo: null,
          all: null,
          floatArray: [],
          toc: [],
          id,
          htmlWithAnchor: "",
          recNews: null,
          trendingNews: null,
          articleFaqs: []
        };
      }

      // 并行获取其他数据（非关键）
      const [recNewsResponse, trendingNewsResponse, allResponse] = await Promise.all([
        $axios
          .$get("/api/article/menu", {
            params: {
              site_id: env.SITE_ID,
              mod_id: "rec"
            }
          })
          .catch(() => null),
        $axios
          .$get("/api/article/get_all_articles", {
            params: {
              site_id: env.SITE_ID,
              size: 4,
              page: 1
            }
          })
          .catch(() => null),
        $axios
          .$get("/api/article/menu", {
            params: {
              site_id: env.SITE_ID,
              mod_id: "all",
              page: 1,
              size: 20
            }
          })
          .catch(() => null)
      ]);

      // 处理文章内容
      data.content = data.content.replace(/font-family:\s*['"]? 宋体 ['"]?;/g, "");
      data.content = data.content.replace(/<\/h4><p><br><br>|<br><br><\/p><h4>/g, (match) => {
        return match.includes("</h4><p>") ? "</h4><p>" : "</p><h4>";
      });

      const { toc: flatToc, htmlWithAnchor } = processHtmlWithToc(data.content, [2]);
      const toc = generateNestedToc(flatToc);

      const articleFaqs = data.faqs || [
        {
          question: "Would you like to know more about this topic?",
          answer:
            "Our website provides comprehensive information on various global news topics. You can find more related articles in our categories."
        },
        {
          question: "How can I stay updated with the latest news?",
          answer:
            "You can subscribe to our newsletter and follow our social media channels to receive the latest updates on global news and developments."
        },
        {
          question: "Where can I find more information?",
          answer:
            "You can explore our category pages and search feature to find more articles related to your interests."
        }
      ];

      return {
        newInfo: data,
        all: allResponse,
        floatArray: shuffleArray(allResponse?.list?.slice() || []),
        toc,
        id,
        htmlWithAnchor,
        recNews: recNewsResponse,
        trendingNews: trendingNewsResponse,
        articleFaqs
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      return {
        newInfo: null,
        all: null,
        floatArray: [],
        toc: [],
        id,
        htmlWithAnchor: "",
        recNews: null,
        trendingNews: null,
        articleFaqs: []
      };
    }
  },
  data() {
    return {
      channelId: ""
    };
  },
  head() {
    return {
      title: this.newInfo?.name ? this.newInfo.name + " - Intelinfor" : "Intelinfor",
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.newInfo?.seo_desc
        },
        {
          hid: "og:title",
          property: "og:title",
          content: this.newInfo?.seo_title
        },
        {
          hid: "og:description",
          property: "og:description",
          content: this.newInfo?.seo_desc
        },
        {
          hid: "og:url",
          property: "og:url",
          content: this.newInfo?.path_v2
            ? `https://www.intelinfor.com/${this.newInfo.path_v2}/`
            : "https://www.intelinfor.com/"
        },
        {
          hid: "og:locale",
          property: "og:locale",
          content: this.newInfo?.language
        },
        {
          hid: "og:image",
          property: "og:image",
          content: `https://bunchthings.com/cdn-cgi/image/w=600,f=auto,fit=cover/${this.newInfo?.cover}`
        },
        {
          hid: "og:type",
          property: "og:type",
          content: "article"
        },
        {
          hid: "twitter:image",
          property: "twitter:image",
          content: `https://bunchthings.com/cdn-cgi/image/w=600,f=auto,fit=cover/${this.newInfo?.cover}`
        },
        {
          hid: "twitter:title",
          property: "twitter:title",
          content: this.newInfo?.seo_title
        },
        {
          hid: "twitter:description",
          property: "twitter:description",
          content: this.newInfo?.seo_desc
        },
        {
          hid: "twitter:url",
          property: "twitter:url",
          content: this.newInfo?.path_v2
            ? `https://www.intelinfor.com/${this.newInfo.path_v2}/`
            : "https://www.intelinfor.com/"
        },
        {
          hid: "twitter:locale",
          property: "twitter:locale",
          content: this.newInfo?.language
        }
      ],
      script: [
        {
          type: "application/ld+json",
          json: {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: (this.articleFaqs || []).map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer
              }
            }))
          }
        },
        {
          type: "application/ld+json",
          json: {
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            articleBody: this.newInfo?.content_text || "",
            articleSection: `Home, ${
              this.newInfo?.seo_category_name || this.newInfo?.category_locale_name || ""
            }, ${this.newInfo?.name || ""}`,
            headline: this.newInfo?.seo_title || "",
            description: this.newInfo?.seo_desc || "",
            datePublished: this.newInfo?.updated_at || "",
            dateModified: this.newInfo?.updated_at || "",
            author: [
              {
                "@type": "Person",
                name: this.newInfo?.author?.name || "",
                description: this.newInfo?.author?.intro || "",
                image: `https://bunchthings.com/${this.newInfo?.author?.avatar || ""}`
              }
            ],
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": this.newInfo?.path_v2
                ? `https://www.intelinfor.com/${this.newInfo.path_v2}/`
                : "https://www.intelinfor.com/"
            },
            publisher: {
              "@type": "NewsMediaOrganization",
              name: "Intelinfor",
              url: "https://www.intelinfor.com",
              publishingPrinciples: "https://www.intelinfor.com/us/"
            },
            image: [
              `https://bunchthings.com/cdn-cgi/image/f=auto,fit=cover/${this.newInfo?.cover || ""}`,
              `https://bunchthings.com/cdn-cgi/image/w=600,f=auto,fit=cover/${
                this.newInfo?.cover || ""
              }`
            ]
          }
        },
        {
          type: "application/ld+json",
          json: {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                item: {
                  "@id": "https://www.intelinfor.com/",
                  name: "Home"
                }
              },
              ...(this.newInfo?.seo_category_path
                ? [
                    {
                      "@type": "ListItem",
                      position: 2,
                      item: {
                        "@id": `https://www.intelinfor.com/category/${this.newInfo.seo_category_path}/`,
                        name:
                          this.newInfo?.seo_category_name ||
                          this.newInfo?.category_locale_name ||
                          ""
                      }
                    }
                  ]
                : []),
              {
                "@type": "ListItem",
                position: this.newInfo?.seo_category_path ? 3 : 2,
                item: {
                  "@id": this.newInfo?.path_v2
                    ? `https://www.intelinfor.com/${this.newInfo.path_v2}/`
                    : "https://www.intelinfor.com/",
                  name: this.newInfo?.name || ""
                }
              }
            ]
          }
        }
      ]
    };
  },

  mounted: function () {
    this.handleCreateTableParentDom();
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("channel")) {
      this.channelId = searchParams.get("channel");
    } else {
      this.channelId = this.newInfo?.channel || "";
      if (this.channelId !== "") {
        searchParams.set("channel", this.channelId);
        const newUrl = `${window.location.origin}${
          window.location.pathname
        }?${searchParams.toString()}`;
        window.history.replaceState({}, "", newUrl);
      }
    }
    setTimeout(() => {
      this.handleAdsScript();
    }, 0);
  },
  methods: {
    scrollToAnchor(anchorId) {
      const target = document.getElementById(anchorId);
      if (!target) return;
      const navbarHeight = 60;
      const targetTop = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      window.scrollTo({
        top: targetTop,
        behavior: "smooth"
      });
      window.history.pushState({}, "", `#${anchorId}`);
    },
    handleAdsScript() {
      if (this.newInfo?.no_entry !== 1) {
        this.addAdSenseScript();
      }
    },
    addAdSenseScript() {
      const searchParams = new URLSearchParams(window.location.search);
      let terms = searchParams.has("terms") ? searchParams.get("terms") : "";
      terms = terms.replace(/[，]/g, ",");
      let headline = searchParams.has("headline") ? searchParams.get("headline") : "";
      if (headline === "{title}" || headline === "{{ad_title}}") {
        headline = "";
      }

      const paramKeys = [];
      for (const param of searchParams) {
        paramKeys.push(param[0]);
      }
      const ignoredPageParams = paramKeys.join(",");

      const channelId = window.getParam("channel");
      const hiSource = window.getParam("hi_source");
      const hiPc = window.getParam("hi_pc");
      const resultsPageBaseUrl = window.getResultsPageUrl({
        channel: channelId,
        from: "detail",
        hi_source: hiSource,
        hi_pc: hiPc
      });
      const adSenseConfig = {
        channel: this.channelId,
        pubId: "partner-pub-1853000876464912",
        styleId: "7223178098",
        adsafe: "low",
        ignoredPageParams,
        relatedSearchTargeting: "content",
        resultsPageBaseUrl,
        resultsPageQueryParam: "query",
        terms: terms || this.newInfo?.terms,
        referrerAdCreative: headline || terms || this.newInfo?.referrer_ad_creative,
        ivt: false
      };

      // eslint-disable-next-line no-undef
      _googCsa("relatedsearch", adSenseConfig, {
        container: "relatedsearches1",
        relatedSearches: 10,
        adLoadedCallback: function (loaded, response, isExperimentVariant, callbackOptions) {
          if (response) {
            window.trackEventToPixel("D_C_AC");
            window.pushEventParamsToGtm("C_AC");
            window.handleRequestAdByChannel("query_ad", 1);
          }
        }
      });
    },
    handleCreateTableParentDom() {
      const tables = document.querySelectorAll(".news-detail table");
      if (tables.length) {
        tables.forEach((table) => {
          const parentDiv = document.createElement("div");
          parentDiv.className = "table-container";
          table.parentNode.insertBefore(parentDiv, table);
          parentDiv.appendChild(table);
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.page-layout {
  width: 100%;
}

.article {
  line-height: 19px;
  font-family: "hem";
  padding-bottom: 32px;
  border-bottom: 1px solid #ececee;
  min-height: calc(100vh - 72px - 56px - 64px);
}

.article-title {
  font-size: 26px;
  font-family: "hem";
  line-height: 30px;
  margin-bottom: 24px;
}

.news-author {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
}

.article-summary {
  display: flex;
  gap: 12px;
  margin: 20px 0;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 4px;
  border-left: 4px solid #fd9a25;

  .summary-icon {
    font-size: 24px;
    flex-shrink: 0;
  }

  .summary-content {
    flex: 1;

    .summary-title {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 8px;
      color: #333;
    }

    .summary-text {
      font-size: 14px;
      line-height: 1.6;
      color: #666;
      margin: 0;
    }
  }
}

.toc-container {
  margin: 20px 0;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 4px;

  .toc-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 12px;
    color: #333;
  }

  .toc-nav {
    .toc-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .toc-item {
      font-size: 14px;
      line-height: 1.8;
      cursor: pointer;
      color: #0066cc;
      transition: color 0.2s;

      &:hover {
        color: #fd9a25;
      }

      &.toc-level-2 {
        margin-left: 16px;
      }

      &.toc-level-3 {
        margin-left: 32px;
      }
    }
  }
}

.article-img {
  width: 100%;
  margin: 20px 0;
}

.news-detail {
  p {
    text-indent: 1em;
    line-height: 1.6;
  }
}

.first_paragraph {
  text-indent: 1em;
  font-size: 14px;
  line-height: 19px;
}

.faq-section {
  margin: 32px 0;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 4px;

  .faq-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 16px;
    color: #333;
  }

  .faq-list {
    .faq-item {
      margin-bottom: 16px;

      .faq-question {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 8px;
        color: #333;
      }

      .faq-answer {
        font-size: 14px;
        line-height: 1.6;
        color: #666;
        margin: 0;
      }
    }
  }
}

.title-h2 {
  font-size: 18px;
  font-weight: bold;
  margin: 24px 0 16px 0;
  color: #333;
}

.related-articles {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media screen and (max-width: 750px) {
  .article {
    line-height: vw(38);
    padding-bottom: vw(32);
    border-bottom: vw(2) solid #ececee;
    min-height: calc(100vh - vw(304));
  }

  .article-title {
    font-size: vw(40);
    line-height: vw(56);
    margin-bottom: vw(32);
  }

  .article-summary {
    .summary-icon {
      font-size: vw(32);
    }

    .summary-content {
      .summary-title {
        font-size: vw(28);
      }

      .summary-text {
        font-size: vw(24);
      }
    }
  }

  .toc-container {
    .toc-title {
      font-size: vw(32);
    }

    .toc-item {
      font-size: vw(28);

      &.toc-level-2 {
        margin-left: vw(32);
      }

      &.toc-level-3 {
        margin-left: vw(64);
      }
    }
  }

  .first_paragraph {
    font-size: vw(32);
    color: rgba(23, 23, 23, 0.8);
    line-height: vw(44);
  }

  .title-h2 {
    margin-top: vw(74);
    margin-bottom: vw(32);
  }

  .related-articles {
    grid-template-columns: repeat(1, 1fr);
    gap: vw(32);
  }
}
</style>
