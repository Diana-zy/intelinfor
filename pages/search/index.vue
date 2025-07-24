<template>
  <div class="page">
    <Header />
    <main class="main">
      <div id="afscontainer1"> </div>
      <div id="relatedsearches1"> </div>
      <h3 class="title-h3">Web Results</h3>
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
      news: [], // 新闻列表
      input: "", // 搜索输入
      channelId: "" // 频道 ID
    };
  },
  mounted() {
    if (window.getDetailIsClickAc()) {
      window.dataLayer.push({
        event: "S_PL"
      });
    }

    const searchParams = new URLSearchParams(window.location.search);
    this.channelId = searchParams.has("channel") ? searchParams.get("channel") : "";

    this.input = this.$route.query.query || "";
    this.input && this.addAdSense();
    this.input && this.searchNews();
  },
  methods: {
    addAdSense() {
      setTimeout(() => {
        window._tfa = window._tfa || [];
        window._tfa.push({ notify: "event", name: "view_content", id: 1887948 });
        if (window?.ttq?.track) {
          window.ttq?.track?.("ViewContent");
        } else {
          window.taskList = window.taskList || [];
          window.taskList.push("ViewContent");
        }
        window.pushEventParamsToGtm("Q_AR");
        this.addAdSenseScript();
      }, 0);
    },
    async searchNews() {
      try {
        const response = await this.$axios.$post("/api/article/search", {
          site_id: process.env.SITE_ID,
          key: this.input
        });

        this.news = response.list;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },

    addAdSenseScript() {
      const queryString = this.input;
      const searchParams = new URLSearchParams(window.location.search);

      // 获取 URL 查询参数的工具函数
      const getParam = (key) => (searchParams.has(key) ? searchParams.get(key) : "");

      const from = getParam("from");
      const channelId = getParam("channel");

      // 配置 AdSense 参数
      const adSenseConfig = {
        channel: channelId,
        pubId: "partner-pub-1853000876464912",
        query: queryString,
        styleId: "7223178098",
        adsafe: "low",
        ivt: false,
        resultsPageBaseUrl: `${window.location.origin}/search/?afs&channel=${channelId}${
          from ? `&from=${from}` : ""
        }`,
        resultsPageQueryParam: "query"
      };

      // AdSense 加载回调函数
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
            window._tfa = window._tfa || [];
            window._tfa.push({ notify: "event", name: "start_checkout", id: 1887948 });
            if (window?.ttq?.track) {
              window.ttq?.track?.("Download");
            } else {
              window.taskList = window.taskList || [];
              window.taskList.push("Download");
            }
            window.pushEventParamsToGtm("C_AR");
            if (window.getDetailIsClickAc()) {
              window.dataLayer.push({
                event: "C_AR_C"
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

      // 根据来源配置 rsblock1
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
