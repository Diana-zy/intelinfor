<template>
  <div class="page">
    <Header />
    <main class="main">
      <div id="afscontainer1"> </div>
      <div id="relatedsearches1"> </div>
      <h3 class="title-h3">検索結果</h3>
      <section class="news-box-3">
        <news-item-3 v-for="(item, i) in news" :key="i" :item="item"> </news-item-3>
      </section>
    </main>
    <Footer />
  </div>
</template>

<script>
export default {
  data() {
    return {
      news: [],
      input: "",
      channelId: ""
    };
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
            params: {
              site_id: process.env.SITE_ID,
              qdh: this.channelId
            }
          });
          window.purchaseValue = purchaseValueResponse.ygz;
        }

        const response = await this.$axios.$post("/api/article/search", {
          site_id: process.env.SITE_ID,
          key: this.input
        });
        this.news = response.list
          .filter(item => item.seo_category_path)
          .map(item => ({
            ...item,
            path_v2: `${item.seo_category_path}/${item.path_v2.replace(/^\//, "")}`
          }));
      } catch (error) {
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

      const rsblock1 = (() => {
        const baseConfig = {
          container: "relatedsearches1",
          relatedSearches: 5,
          adLoadedCallback: adLoadedCallback("C_AC", { query: queryString })
        };
        return baseConfig;
      })();

      // eslint-disable-next-line no-undef
      _googCsa("ads", adSenseConfig, adblock1, rsblock1);
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  padding-bottom: 32px;
  border-bottom: 1px solid #ececee;
}
.title-h3 {
  color: rgba($font3, 0.6);
}
@media screen and (max-width: 750px) {
  .main {
    padding-bottom: vw(32);
    border-bottom: vw(2) solid #ececee;
  }
}
</style>
