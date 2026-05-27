<template>
  <div class="page">
    <Header />
    <main class="main">
      <div class="layout-left">
        <breadcrumb
          :info="{
            category_id: id,
            seo_category_name: categoryInfo?.seo_category?.name,
            category_locale_name: categoryInfo?.seo_category?.name,
            is_seo_category_on_site: true,
            seo_category_path: categoryPath
          }"
          is-category
        ></breadcrumb>
        <common-page-label
          :title="`「${capitalizeFirstLetter(categoryInfo?.seo_category?.name)}」の記事一覧`"
        />
        <div id="relatedsearches1"></div>
        <section>
          <InfiniteLoadList
            api-endpoint="/api/article/get_seo_category_page"
            :initial-page="2"
            :page-size="10"
            :showMore="true"
            :query="{
              seo_category_id: id
            }"
            :initial-items="categoryInfo?.list"
            class="news-box-4"
          >
            <template #default="{ items }">
              <news-item-4
                v-for="(item, index) in items"
                :key="index"
                :index="index"
                :item="item"
              />
            </template>
          </InfiniteLoadList>
        </section>
      </div>
      <div class="layout-right">
        <right-side-box :rec-news="trendingNews?.list" :trending-news="recNews?.list" />
      </div>
    </main>
    <FooterSeo />
  </div>
</template>

<script>
import { capitalizeFirstLetter } from "~/utils/utils";

export default {
  async asyncData({ $axios, params, env }) {
    const path = params.category;
    const lastDashIndex = path.lastIndexOf("-");
    const id = path.substring(lastDashIndex + 1, path.length);

    try {
      const [recNewsResponse, trendingNewsResponse, categoryInfoResponse] = await Promise.all([
        $axios.$get("/api/article/menu", {
          params: {
            site_id: env.SITE_ID,
            mod_id: "rec"
          }
        }).catch(() => null),
        $axios.$get("/api/article/get_all_articles", {
          params: {
            site_id: env.SITE_ID,
            size: 4,
            page: 1
          }
        }).catch(() => null),
        $axios.$get("/api/article/get_seo_category_page", {
          params: {
            site_id: env.SITE_ID,
            seo_category_id: id,
            size: 10,
            page: 1
          }
        }).catch(() => null)
      ]);
      return {
        recNews: recNewsResponse,
        trendingNews: trendingNewsResponse,
        categoryInfo: categoryInfoResponse,
        id,
        categoryPath: path
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      return {
        recNews: null,
        trendingNews: null,
        categoryInfo: null,
        id,
        categoryPath: path
      };
    }
  },
  head() {
    const category = this.categoryInfo && this.categoryInfo.seo_category;
    const categoryName = (category && category.name) || "";
    const categoryUrl = this.categoryPath
      ? `https://www.intelinfor.com/category/${this.categoryPath}/`
      : "https://www.intelinfor.com/";
    const seoTitle = (category && category.seo_title) || `「${categoryName}」の記事一覧 | 高齢者ライフ`;
    const seoDesc = (category && category.seo_desc) || `${categoryName}に関する最新記事の一覧です。老後の生活に役立つ情報を専門家が解説します。`;

    const itemListElements =
      this.categoryInfo?.list
        ?.filter((item) => item.path_v2)
        .map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `https://www.intelinfor.com/${item.path_v2}/`,
          name: item.name || ""
        })) || [];

    return {
      title: seoTitle,
      meta: [
        {
          hid: "description",
          name: "description",
          content: seoDesc
        },
        {
          hid: "og:title",
          property: "og:title",
          content: seoTitle
        },
        {
          hid: "og:description",
          property: "og:description",
          content: seoDesc
        },
        {
          hid: "og:url",
          property: "og:url",
          content: categoryUrl
        },
        {
          hid: "og:type",
          property: "og:type",
          content: "website"
        }
      ],
      script: [
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
                  name: "ホーム"
                }
              },
              {
                "@type": "ListItem",
                position: 2,
                item: {
                  "@id": categoryUrl,
                  name: categoryName
                }
              }
            ]
          }
        },
        ...(itemListElements.length
          ? [
              {
                type: "application/ld+json",
                json: {
                  "@context": "https://schema.org",
                  "@type": "ItemList",
                  itemListElement: itemListElements
                }
              }
            ]
          : [])
      ]
    };
  },
  data() {
    return {
      channelId: ""
    };
  },
  mounted() {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("channel")) {
      this.channelId = searchParams.get("channel");
    } else {
      this.channelId = this.categoryInfo?.seo_category?.channel || "";
    }
    this.$nextTick(() => {
      this.addAdSenseScript();
    });
  },
  methods: {
    capitalizeFirstLetter,
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

      const hiSource = window.getParam("hi_source");
      const hiPc = window.getParam("hi_pc");
      const resultsPageBaseUrl = window.getResultsPageUrl({
        channel: this.channelId,
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
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .news-box-4 {
  .load-list-content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px 28px;
    font-family: "Noto Sans JP", "Lucida Grande", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif;
  }
}
@media screen and (max-width: 750px) {
  ::v-deep .news-box-4 {
    padding-bottom: vw(32);
    .load-list-content {
      grid-template-columns: repeat(1, 1fr);
      gap: vw(52);
    }
  }
}
</style>
