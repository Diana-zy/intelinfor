<template>
  <div class="page">
    <Header />
    <main>
      <div class="layout-left">
        <common-page-label :title="`&quot;${input}&quot; Search Results`" />
        <div id="afscontainer1"> </div>
        <div id="relatedsearches1"> </div>
        <h3 class="title-h3">{{ searchTitle }}</h3>
        <section>
          <item-search-result v-for="(item, i) in searchResultNews" :key="i" :item="item">
          </item-search-result>
        </section>
      </div>
      <div class="layout-right">
        <right-side-box :rec-news="(trendingNews && trendingNews.list) || []" :trending-news="(recNews && recNews.list) || []" />
      </div>
    </main>
    <FooterSeo />
  </div>
</template>

<script>
export default {
  async asyncData({ $axios, env }) {
    try {
      const [recNewsResponse, trendingNewsResponse] = await Promise.all([
        $axios.$get("/api/article/menu", {
          params: { site_id: env.SITE_ID, mod_id: "rec" }
        }).catch(() => null),
        $axios.$get("/api/article/get_all_articles", {
          params: { site_id: env.SITE_ID, size: 4, page: 1 }
        }).catch(() => null)
      ]);
      return {
        recNews: recNewsResponse,
        trendingNews: trendingNewsResponse
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      return { recNews: null, trendingNews: null };
    }
  },
  data() {
    return {
      searchResultNews: [],
      input: "",
      channelId: "",
      isShowResults: false
    };
  },
  computed: {
    searchTitle() {
      return this.isShowResults
        ? `Found ${this.searchResultNews.length} results for "${this.input}"`
        : "Loading search results...";
    }
  },
  mounted() {
    window.handleRequestAdByChannel("first", 3, true);

    const searchParams = new URLSearchParams(window.location.search);
    this.channelId = searchParams.has("channel") ? searchParams.get("channel") : "";
    if (searchParams.has("from") && searchParams.get("from") === "detail") {
      window.fromDetailId = window.getCookie("SEO_detail");
    }
    window.setCookie("SEO_detail", "");

    this.input = this.$route.query.query || "";
    this.input && this.addAdSense();
    this.input && this.searchNews();
  },
  methods: {
    addAdSense() {
      setTimeout(() => {
        if (window.handleRequestAdByChannel("", "", true)) {
          window.trackEventToPixel("Q_AR");
          window.pushEventParamsToGtm("Q_AR");
          this.addAdSenseScript();
        }
      }, 0);
    },
    async searchNews() {
      try {
        if (this.channelId) {
          const purchaseValueResponse = await this.$axios.$get("/api/common/qdhzhygz", {
            params: { site_id: process.env.SITE_ID, qdh: this.channelId }
          });
          window.purchaseValue = purchaseValueResponse.ygz;
        }

        const response = await this.$axios.$post("/api/article/search", {
          site_id: process.env.SITE_ID,
          key: this.input
        });
        this.searchResultNews = (response.list || [])
          .filter(item => item.seo_category_path)
          .map(item => ({
            ...item,
            path_v2: `${item.seo_category_path}/${item.path_v2.replace(/^\//, "")}`
          }));
        this.isShowResults = true;
      } catch (error) {
        this.isShowResults = true;
        console.error("Error fetching data:", error);
      }
    },
    addAdSenseScript() {
      const queryString = this.input;
      const channelId = window.getParam("channel");
      const from = window.getParam("from");
      const hiSource = window.getParam("hi_source");
      const hiPc = window.getParam("hi_pc");
      const resultsPageBaseUrl = window.getResultsPageUrl({
        channel: channelId,
        from,
        hi_source: hiSource,
        hi_pc: hiPc
      });
      const adSenseConfig = {
        channel: channelId,
        pubId: "partner-pub-1853000876464912",
        query: queryString,
        styleId: "7223178098",
        adsafe: "low",
        ivt: false,
        resultsPageBaseUrl,
        resultsPageQueryParam: "query"
      };

      const adLoadedCallback =
        (eventName, additionalData = {}) =>
        (loaded, response) => {
          if (response) {
            // eslint-disable-next-line no-undef
            dataLayer.push({ event: eventName, ...additionalData });
          }
        };

      const adblock1 = {
        container: "afscontainer1",
        number: 8,
        adLoadedCallback: (loaded, e) => {
          if (e) {
            window.trackEventToPixel("C_AR");
            window.pushEventParamsToGtm("C_AR");
            const hi_user_source = window.getValueByURLOrCookie("hi_source");
            if (hi_user_source === "unknown") {
              window.dataLayer.push({
                event: "Detail_C_AR_C_SEO",
                SEO_detail: window.fromDetailId || ""
              });
            }
            try {
              const element = document.getElementById("master-1");
              const height = parseFloat(element.style.height);
              const result = Math.round(height / 456);
              // eslint-disable-next-line no-undef
              dataLayer.push({ event: "C_AR_IN", num: result, query: queryString });
            } catch (error) {
              console.error(error);
            }
          } else {
            // eslint-disable-next-line no-undef
            dataLayer.push({ event: "FF_AR", query: queryString });
          }
        }
      };

      const rsblock1 = {
        container: "relatedsearches1",
        relatedSearches: 5,
        adLoadedCallback: adLoadedCallback("C_AC", { query: queryString })
      };

      // eslint-disable-next-line no-undef
      _googCsa("ads", adSenseConfig, adblock1, rsblock1);
    }
  }
};
</script>

<style lang="scss" scoped>
main {
  padding-bottom: 32px;
  border-bottom: 1px solid #ececee;
}
.title-h3 {
  color: $font4;
}
@media screen and (max-width: 750px) {
  main {
    padding-bottom: vw(32);
    border-bottom: vw(2) solid #ececee;
  }
}
</style>
