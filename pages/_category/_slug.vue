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
            <div id="relatedsearches1"> </div>
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
          <section v-if="newInfo && newInfo.related_articles && newInfo.related_articles.length">
            <h3 class="title-h2">Related Articles</h3>
            <div class="related-articles">
              <news-item-5
                v-for="(item, i) in newInfo.related_articles"
                :key="i"
                :item="item"
              >
              </news-item-5>
            </div>
          </section>
        </div>
      </div>
      <div class="layout-right">
        <right-side-box :rec-news="trendingNews" :trending-news="recNews" />
      </div>
    </main>
    <footer-seo :info="newInfo || {}" />
  </div>
</template>

<script>
import Breadcrumb from "~/components/Breadcrumb";
import AppHeader from "~/components/Header";
import NewsItem5 from "~/components/NewsItem5";
import RightSideBox from "~/components/RightSideBox";
import FooterSeo from "~/components/FooterSeo";
import { shuffleArray } from "~/utils/utils";
import { processHtmlWithToc, generateNestedToc } from "~/utils/cheerio-toc.js";

export default {
  components: {
    AppHeader,
    Breadcrumb,
    NewsItem5,
    RightSideBox,
    FooterSeo
  },
  async asyncData({ $axios, params, env }) {
    const slug = params.slug;
    const lastDashIndex = slug.lastIndexOf("-");
    const id = slug.substring(lastDashIndex + 1, slug.length);

    const [recNewsResponse, trendingNewsResponse, data, allResponse] = await Promise.all([
      $axios.$get("/api/article/menu", {
        params: {
          site_id: env.SITE_ID,
          mod_id: "rec"
        }
      }),
      $axios.$get("/api/article/get_all_articles", {
        params: {
          site_id: env.SITE_ID,
          size: 4,
          page: 1
        }
      }),
      $axios.$get("/api/article/detail", {
        params: {
          site_id: env.SITE_ID,
          article_id: id,
          related_num: 3
        }
      }),
      $axios.$get("/api/article/menu", {
        params: {
          site_id: env.SITE_ID,
          mod_id: "all",
          page: 1,
          size: 20
        }
      })
    ]);

    data.content = data.content.replace(/font-family:\s*['"\s]?\u5b8b\u4f53['"\s]?;/g, "");
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

    const newInfo = {
      ...data,
      faqs: articleFaqs,
      author: data.author || { name: "" },
      first_paragraph: data.first_paragraph,
      seo_desc: data.seo_desc
    };

    const recNews = shuffleArray(recNewsResponse?.list || []);
    const trendingNews = shuffleArray(trendingNewsResponse?.list || []);

    return {
      newInfo,
      toc,
      htmlWithAnchor,
      articleFaqs,
      recNews,
      trendingNews
    };
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
          hid: "og:image",
          property: "og:image",
          content: `https://bunchthings.com/cdn-cgi/image/w=600,f=auto,fit=cover/${this.newInfo?.cover}`
        },
        {
          hid: "og:type",
          property: "og:type",
          content: "article"
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
            headline: this.newInfo?.seo_title || "",
            description: this.newInfo?.seo_desc || "",
            datePublished: this.newInfo?.updated_at || "",
            dateModified: this.newInfo?.updated_at || "",
            author: [
              {
                "@type": "Person",
                name: this.newInfo?.author?.name || ""
              }
            ],
            publisher: {
              "@type": "NewsMediaOrganization",
              name: "Intelinfor",
              url: "https://www.intelinfor.com"
            },
            image: [
              `https://bunchthings.com/cdn-cgi/image/w=600,f=auto,fit=cover/${this.newInfo?.cover || ""}`
            ]
          }
        }
      ]
    };
  },
  mounted() {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("channel")) {
      this.channelId = searchParams.get("channel");
    } else {
      this.channelId = this.newInfo?.channel || "";
      if (this.channelId !== "") {
        searchParams.set("channel", this.channelId);
        const newUrl = `${window.location.origin}${window.location.pathname}?${searchParams.toString()}`;
        window.history.replaceState({}, "", newUrl);
      }
    }
    setTimeout(() => {
      this.newInfo?.no_entry !== 1 && this.addAdSenseScript();
    }, 0);
  },
  methods: {
    scrollToAnchor(id) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    addAdSenseScript() {
      const searchParams = new URLSearchParams(window.location.search);
      let terms = searchParams.has("terms") ? searchParams.get("terms") : "";
      terms = terms.replace(/[\uff0c]/g, ",");
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
        ivt: false,
        adtest: "off"
      };

      // eslint-disable-next-line no-undef
      _googCsa("relatedsearch", adSenseConfig, {
        container: "relatedsearches1",
        relatedSearches: 10,
        adLoadedCallback: function (loaded, response, isExperimentVariant, callbackOptions) {
          if (response) {
            window.trackEventToPixel("D_C_AC");
            window.pushEventParamsToGtm("C_AC");
            window.setCookie("query_ad", 1);
            try {
              let numberOfKeys = 0;
              let concatenatedKeys = "miss";
              if (callbackOptions && callbackOptions.termPositions) {
                const keys = Object.keys(callbackOptions.termPositions);
                numberOfKeys = keys.length;
                concatenatedKeys = keys.join(",");
              }
              // eslint-disable-next-line no-undef
              dataLayer.push({
                event: "C_AC_IN",
                num: numberOfKeys,
                key1: numberOfKeys,
                key2: concatenatedKeys
              });
            } catch (e) {
              console.log(e);
            }
          }
        }
      });
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
