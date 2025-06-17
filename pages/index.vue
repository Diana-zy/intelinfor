<template>
  <div class="page home-page">
    <Header />
    <main class="main">
      <section class="home-search">
        <div class="search-group">
          <input
            v-model="input"
            placeholder="ウェブ検索"
            class="search"
            name="search"
            @keyup.enter="search"
          />
          <i v-show="input != ''" class="icon-clear" @click="clear"></i>
          <i class="icon-search" @click="search"></i>
        </div>
        <!-- <div class="rec">人気の選択</div>
        <div class="words-container">
          <div class="marquee">
            <div v-for="count in 2" :key="count" class="marquee-group">
              <div
                v-for="(word, index) in hotWords"
                :key="index"
                class="hot-words"
                @click="clickWord(word)"
                >{{ word }}</div
              >
            </div>
          </div>
        </div> -->
      </section>

      <section v-swiper:mySwiper="swiperOption" class="swiper-box">
        <div class="swiper-wrapper">
          <news-item-1 v-for="(item, i) in recNews.list" :key="i" class="swiper-slide" :item="item">
          </news-item-1>
        </div>
      </section>

      <h2 class="title-h2">トレンド</h2>
      <section class="news-box-2">
        <news-item-2 v-for="(item, i) in trendingNews.list" :key="i" :item="item"> </news-item-2>
      </section>

      <h2 class="title-h2">すべての記事</h2>
      <section>
        <InfiniteScrollList
          api-endpoint="/api/article/menu"
          :initial-page="2"
          :page-size="8"
          mod-id="all"
          :initial-items="allNews.list"
          class="news-box-2"
        >
          <template #default="{ items }">
            <news-item-2 v-for="(item, i) in items" :key="i" :item="item"> </news-item-2>
          </template>
        </InfiniteScrollList>
      </section>
    </main>
    <Footer />
  </div>
</template>

<script>
import { directive } from "vue-awesome-swiper";
import "swiper/css/swiper.min.css";
import { simulateAFSSearch } from "~/utils/utils";

export default {
  directives: {
    swiper: directive
  },
  async asyncData({ $axios, env }) {
    try {
      // 并行处理多个异步请求
      const [recNewsResponse, trendingNewsResponse, allNewsResponse] = await Promise.all([
        $axios.$get("/api/article/menu", {
          params: {
            site_id: env.SITE_ID,
            mod_id: "rec"
          }
        }),
        $axios.$get("/api/article/menu", {
          params: {
            site_id: env.SITE_ID,
            mod_id: "trending",
            size: 30
          }
        }),
        $axios.$get("/api/article/menu", {
          params: {
            site_id: env.SITE_ID,
            mod_id: "all",
            page: 1,
            size: 8
          }
        })
      ]);

      // 返回多个接口的数据
      return {
        recNews: recNewsResponse,
        trendingNews: trendingNewsResponse,
        allNews: allNewsResponse
      };
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: "auto",
        autoplay: {
          delay: 3000
        }
      },
      input: ""
    };
  },

  methods: {
    search() {
      if (this.input.length < 1) {
        this.$globalMethod.showNotification({
          message: "Please enter at least 1 characters",
          type: "warning"
        });
        return;
      }
      try {
        // eslint-disable-next-line no-undef
        bge("event", "ec_register", { configId: "904803718856417024" });
      } catch (error) {
        console.error("Error tracking search event:", error);
      }

      simulateAFSSearch(this.input);
    },
    clear() {
      this.input = "";
    }
    // clickWord(words) {
    //   simulateAFSSearch(words);
    // }
  }
};
</script>
<style lang="scss" scoped>
.main {
  padding-bottom: 32px;
  border-bottom: 1px solid #ececee;
}

.home-search {
  width: 100%;
  height: 315px;
  background-image: url("~/assets/images/bg-pc.webp");
  background-size: cover;
  margin-bottom: 32px;
  background-position: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  .search-group {
    position: relative;
  }
  .search {
    margin-top: 110px;
    width: 560px;
    height: 48px;
    background: #ffffff;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0);
    border-radius: 4px 4px 4px 4px;
    padding-left: 16px;
    padding-right: 126px;
    &::placeholder {
      color: rgba($font1, 0.6);
    }
  }
  .icon-search {
    display: block;
    position: absolute;
    right: -1px;
    top: 110px;
    width: 64px;
    height: 48px;
    cursor: pointer;
    border-radius: 0 4px 4px 0;
    background-color: $color1;
    background-image: url("~/assets/images/icon-search.png");
    background-size: 30px;
    background-repeat: no-repeat;
    background-position: center;
  }
  .icon-clear {
    position: absolute;
    right: 76px;
    top: 122px;
    cursor: pointer;
    background-image: url("~/assets/images/icon-clear.png");
    width: 24px;
    height: 24px;
    background-size: cover;
  }

  .words-container {
    margin-top: 24px;
    width: 560px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
  }

  .marquee {
    display: flex;
    overflow: hidden;
    user-select: none;
    gap: 12px;
  }

  .marquee-group {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
    gap: 12px;
    min-width: 100%;
    animation: scrollLeft 40s linear infinite;
  }
  .marquee:nth-child(even) {
    margin-left: calc(vw(176) / -2);
  }
  .hot-words {
    background: rgba(23, 23, 23, 0.35);
    border-radius: 4px 4px 4px 4px;
    padding: 6px 8px;
    font-family: "se3";
    font-size: 12px;
    color: #ffffff;
    text-align: left;
    cursor: pointer;
  }
}

.swiper-slide {
  width: 282px;
  border-radius: 16px 16px 16px 16px;
  border: 1px solid rgba(23, 23, 23, 0.1);
  margin-right: 24px;
  overflow: hidden;
}
.news-box-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.rec {
  display: none;
}

@keyframes scrollLeft {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-100% - vw(16)));
  }
}
@media screen and (max-width: 1100px) {
  .news-box-2 {
    display: flex;
    flex-wrap: wrap;
  }
}
@media screen and (max-width: 750px) {
  .main {
    padding-bottom: vw(32);
    border-bottom: none;
  }

  .home-search {
    width: 100vw;
    height: vw(392);
    background-image: url("~/assets/images/bg-m.webp");
    margin-bottom: vw(48);
    margin-left: vw(-46);
    margin-top: vw(-48);
    .search {
      margin-top: vw(66);
      width: vw(658);
      height: vw(80);
      box-shadow: 0 0 vw(16) 0 rgba(0, 0, 0, 0);
      border-radius: vw(8);
      padding-left: vw(34);
      padding-right: vw(210);
    }
    .icon-search {
      top: vw(66);
      width: vw(128);
      height: vw(80);
      border-radius: 0 vw(8) vw(8) 0;
      background-size: vw(48);
    }
    .icon-clear {
      top: vw(90);
      right: vw(144);
      width: vw(32);
      height: vw(32);
    }
    .words-container {
      margin-top: vw(16);
      width: 100%;
    }
  }

  .rec {
    margin-top: vw(24);
    display: inline-block;
    text-align: center;
    font-family: "hem";
    font-size: 12px;
    color: #ffffff;
  }
  .swiper-box {
    width: 100vw;
    margin-left: vw(-46);
    padding-left: vw(32);
  }
  .swiper-slide {
    width: vw(614);
    border-radius: vw(16);
    border: vw(2) solid #ececee;
    margin-right: vw(32);
  }
  .news-box-2 {
    gap: vw(32);
  }
}
</style>
