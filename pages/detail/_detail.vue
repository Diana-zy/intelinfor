<template>
  <div class="page">
    <Header />
    <article class="article">
      <h1 class="article-title" style="">{{ newInfo.name }}</h1>
      <div class="news-detail first_paragraph">{{ newInfo.first_paragraph }}</div>
      <div id="relatedsearches1"> </div>
      <NuxtImg
        format="auto"
        fit="cover"
        width="600"
        :src="newInfo.cover"
        :alt="newInfo.name"
        class="article-img"
        preload
      />
      <!-- eslint-disable vue/no-v-html -->
      <!-- <div class="news-detail" v-html="newInfo.content"></div> -->
      <div class="news-detail">
        <template v-for="(item, index) in contentItems">
          <div v-if="item.type === 'content'" :key="`content-${index}`" v-html="item.content"></div>
          <div v-else id="relatedsearches2" :key="`relatedsearch-${index}`"></div>
        </template>
      </div>
    </article>
    <Footer :lang="newInfo.language" :channel-id="newInfo.channel || ''" />
  </div>
</template>

<script>
export default {
  async asyncData({ $axios, params, env }) {
    const path = params.detail;
    const lastDashIndex = path.lastIndexOf("-");
    const id = path.substring(lastDashIndex + 1, path.length);

    const [data] = await Promise.all([
      $axios.$get("/api/article/detail", {
        params: {
          site_id: env.SITE_ID,
          article_id: id
        }
      })
    ]);
    data.content = data.content.replace(/font-family:\s*['"]?宋体['"]?;/g, "");
    data.content = data.content.replace(/<\/h4><p><br><br>|<br><br><\/p><h4>/g, (match) => {
      return match.includes("</h4><p>") ? "</h4><p>" : "</p><h4>";
    });

    return { newInfo: data };
  },
  data() {
    return {
      channelId: "",
      splitTextCount: 400,
      isAdAdded: false
    };
  },
  head() {
    return {
      htmlAttrs: {
        lang: this.newInfo.language
      },
      title: this.newInfo.name + " - Intelinfor",
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.newInfo.first_paragraph
        },
        {
          hid: "keywords",
          name: "keywords",
          content: this.newInfo.terms
        },
        {
          hid: "og:title",
          property: "og:title",
          content: this.newInfo.name
        },
        {
          hid: "og:description",
          property: "og:description",
          content: this.newInfo.first_paragraph
        },
        {
          hid: "og:url",
          property: "og:url",
          content: `https://intelinfor.com/detail/${this.newInfo.path}/`
        },
        {
          hid: "og:locale",
          property: "og:locale",
          content: this.newInfo.language
        },
        {
          hid: "og:image",
          property: "og:image",
          content: this.newInfo.cover
        },
        {
          hid: "og:type",
          property: "og:type",
          content: "article"
        }
      ],
      script: [
        {
          // 使用 innerHTML 插入 JavaScript 代码
          innerHTML: `
            window._megoaa = window._megoaa || [];
            window._megoaa.push({ type: 'event', name: 'need-clickbutton', acid: '29941', pxd: '1163021562772978'});
          `,
          type: "text/javascript"
        }
      ],
      __dangerouslyDisableSanitizers: ["script"] // 禁用清理，允许插入内联 JavaScript
    };
  },
  computed: {
    contentItems() {
      const self = this;
      const parts = this.newInfo.content.split(/(<p[^>]*>.*?<\/p>)/gs);
      let charCount = 0;
      const items = [];

      parts.forEach((part, index) => {
        // 如果是最后一个段落，并且广告还没有添加，则插入到倒数第二段
        if (parts.length - 1 === index && !self.isAdAdded) {
          items.push({
            type: "ad"
          });
          self.isAdAdded = true;
        }

        if (!part.trim()) return; // 跳过空字符串

        // 添加内容
        items.push({
          type: "content",
          content: part
        });

        // 如果不是p标签，不计算字符数和插入广告
        if (!part.startsWith("<p")) return;

        if (self.isAdAdded) return;
        // 计算纯文本长度
        const textContent = part.replace(/<[^>]+>/g, "");
        charCount += textContent.length;

        if (charCount >= self.splitTextCount) {
          items.push({
            type: "ad"
          });
          // 是否已经push过广告
          self.isAdAdded = true;
        }
      });

      return items;
    }
  },
  mounted: function () {
    // 获取 URL 查询参数
    const searchParams = new URLSearchParams(window.location.search);
    // AdSense 配置参数
    if (searchParams.has("channel")) {
      this.channelId = searchParams.get("channel");
    } else {
      this.channelId = this.newInfo.channel || "";
      if (this.channelId !== "") {
        searchParams.set("channel", this.channelId);
        const newUrl = `${window.location.origin}${
          window.location.pathname
        }?${searchParams.toString()}`;
        window.history.replaceState({}, "", newUrl);
      }
    }

    setTimeout(() => {
      this.newInfo.no_entry !== 1 && this.addAdSenseScript();
    }, 0);
  },
  methods: {
    addAdSenseScript() {
      // 获取 URL 查询参数
      const searchParams = new URLSearchParams(window.location.search);
      let terms = searchParams.has("terms") ? searchParams.get("terms") : "";
      terms = terms.replace(/[，]/g, ",");
      // 获取Url携带的headline参数
      let headline = searchParams.has("headline") ? searchParams.get("headline") : "";
      const errorHeadlines = [
        "{title}",
        "{{ad_title}}",
        "%7B%7Bad_title%7D%7D",
        "%257B%257Bad_title%257D%257D"
      ];
      if (errorHeadlines.includes(headline)) {
        headline = "";
        // 单独对以下两个渠道号，有问题的headline进行替换
        const editHeadlineChannels = {
          5373731044:
            "Don’t Let Payment Issues Disrupt Your Service – Update Now! Your Card Payment Has Failed?",
          6554482555:
            "Manage money easy: digital bank accounts. Tired of in-branch waits? Go digital!",
          1015215411:
            "Bright teeth, no enamel harm! Want a bright smile safely? Try enamel whitening toothpaste",
          2740480180:
            "Pro movers do packing, transport. Choose right, relocate worry-free. Moving home/business? Trust pro movers.",
          8715124928:
            "Use corporate gas cards: save money. Corporate gas cards: cut costs, boost efficiency, plus employee perks.",
          1028206592:
            "For lung cancer—understand it, catch signs early, access support. Fight lung cancer better",
          1427398519:
            "Bundles bring convenience, cost cuts, and hassle-free single billing. Need essential internet + phone for home or small business?"
        };
        const channelId = window.getParam("channel");
        if (editHeadlineChannels[channelId]) {
          headline = editHeadlineChannels[channelId];
          window.dataLayer.push({
            event: "Headline_Replace",
            headline
          });
        }
      }

      const paramKeys = [];
      // 遍历查询参数并将其添加到 paramKeys 数组中
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
        terms: terms || this.newInfo.terms,
        referrerAdCreative: headline || terms || this.newInfo.referrer_ad_creative,
        ivt: false
      };

      // 初始化 _googCsa 并加载相关搜索广告
      // eslint-disable-next-line no-undef
      _googCsa(
        "relatedsearch",
        adSenseConfig,
        {
          container: "relatedsearches1", // 广告容器 ID
          relatedSearches: 5, // 相关搜索广告数量
          adLoadedCallback: function (loaded, response, isExperimentVariant, callbackOptions) {
            if (response) {
              window.trackEventToPixel("D_C_AC");

              window.pushEventParamsToGtm("C_AC");
              try {
                let numberOfKeys = 0;
                let concatenatedKeys = "miss";
                if (callbackOptions.termPositions) {
                  const keys = Object.keys(callbackOptions.termPositions);
                  numberOfKeys = keys.length;
                  concatenatedKeys = keys.join(",");
                }

                const element = document.getElementById("master-1");
                const height = parseFloat(element.style.height);
                const result = Math.round(height / 105);

                // eslint-disable-next-line no-undef
                dataLayer.push({
                  event: "C_AC_IN",
                  queryNum: 5,
                  num: result,
                  key1: numberOfKeys,
                  key2: concatenatedKeys
                }); // 事件推送到 dataLayer
              } catch (e) {
                console.log(e);
              }
            }
          }
        },
        {
          container: "relatedsearches2", // 广告容器 ID
          relatedSearches: 5, // 相关搜索广告数量
          adLoadedCallback: function (loaded, response, isExperimentVariant, callbackOptions) {
            if (response) {
              // eslint-disable-next-line no-undef
              dataLayer.push({ event: "C_AC_SECOND" }); // 事件推送到 dataLayer
              try {
                let numberOfKeys = 0;
                let concatenatedKeys = "miss";
                if (callbackOptions.termPositions) {
                  const keys = Object.keys(callbackOptions.termPositions);
                  numberOfKeys = keys.length;
                  concatenatedKeys = keys.join(",");
                }
                const element = document.getElementById("relatedsearches2");
                const height = parseFloat(element.clientHeight);
                const result = Math.round(height / 105);

                // eslint-disable-next-line no-undef
                dataLayer.push({
                  event: "C_AC_IN_SECOND",
                  queryNum: 5,
                  num: result,
                  key1: numberOfKeys,
                  key2: concatenatedKeys
                }); // 事件推送到 dataLayer
              } catch (e) {
                console.log(e);
              }
            }
          }
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.article-img {
  width: 100%;
  margin-bottom: 1em;
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
.news-detail {
  p {
    text-indent: 1em;
  }
}
.read-more {
  line-height: 4;
}
.hide {
  display: none;
  &.show {
    display: block;
  }
}
.first_paragraph {
  text-indent: 1em;
  font-size: 14px;
  line-height: 19px;
}
.google-ad-preload {
  margin-bottom: 4px;
}
.news-box-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

@media screen and (max-width: 1100px) {
  .news-box-2 {
    display: flex;
    flex-wrap: wrap;
  }
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
  .article-desc {
    margin-bottom: vw(48);
  }
  .first_paragraph {
    font-size: vw(32);
    color: rgba(23, 23, 23, 0.8);
    line-height: vw(44);
  }
  .google-ad-preload {
    margin-bottom: vw(10);
  }
  .title-h2-margin {
    margin-top: vw(74);
    margin-bottom: vw(32);
  }
  .news-box-2 {
    gap: vw(32);
  }
}
</style>
