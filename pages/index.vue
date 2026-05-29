<template>
  <div class="page home-page">
    <Header />
    <h1 style="display: none">高齢者の暮らしとお金ガイド</h1>
    <main class="main">
      <div class="layout-left">
        <section v-swiper:mySwiper="swiperOption" class="swiper-box">
          <div class="swiper-wrapper">
            <item-swiper-rec
              v-for="(item, i) in recNews && recNews.list"
              :key="i"
              class="swiper-slide"
              :item="item"
              :index="i"
            />
          </div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
        </section>

        <h2 class="title-new-tag">Latest Articles</h2>
        <section class="news-box-new">
          <item-text-new
            v-for="(item, i) in trendingNews && trendingNews.list"
            :key="i"
            :item="item"
          />
        </section>

        <div
          v-for="(items, index) in categoryList"
          :key="(items.seo_category && items.seo_category.id) || index"
          class="category-box"
        >
          <h2 class="title-h2">{{ items.seo_category && items.seo_category.name }}</h2>
          <section>
            <div class="news-box-2">
              <news-item-2
                v-for="(item, i) in items && items.list"
                :key="i"
                :item="item"
                :index="i"
              />
            </div>
          </section>
        </div>
      </div>
      <div class="layout-right">
        <right-side-box
          :rec-news="(trendingNews && trendingNews.list) || []"
          :trending-news="(recNews && recNews.list) || []"
        />
      </div>
    </main>
    <FooterSeo />
  </div>
</template>

<script>
import { directive } from "vue-awesome-swiper";
import "swiper/css/swiper.min.css";

export default {
  directives: {
    swiper: directive
  },
  async asyncData({ $axios, env }) {
    try {
      const [recNewsResponse, trendingNewsResponse, allNewsResponse, categoryResponse] =
        await Promise.all([
          $axios.$get("/api/article/menu", {
            params: { site_id: env.SITE_ID, mod_id: "rec" }
          }).catch(() => null),
          $axios.$get("/api/article/get_all_articles", {
            params: { site_id: env.SITE_ID, size: 4, page: 1 }
          }).catch(() => null),
          $axios.$get("/api/article/menu", {
            params: { site_id: env.SITE_ID, mod_id: "all", page: 1, size: 4 }
          }).catch(() => null),
          $axios.$get("/api/article/get_all_seo_category", {
            params: { site_id: env.SITE_ID }
          }).catch(() => null)
        ]);

      const categoryItems = (categoryResponse && categoryResponse.list) || [];
      const category = categoryItems.map((item) =>
        $axios.$get("/api/article/get_seo_category_page", {
          params: {
            site_id: env.SITE_ID,
            seo_category_id: item.id,
            size: 4,
            page: 1
          }
        }).catch(() => null)
      );
      const list = await Promise.all(category);

      return {
        recNews: recNewsResponse,
        trendingNews: trendingNewsResponse,
        allNews: allNewsResponse,
        categoryList: list.filter((item) => item != null)
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      return {
        recNews: null,
        trendingNews: null,
        allNews: null,
        categoryList: []
      };
    }
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: "auto",
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      }
    };
  },
  head() {
    return {
      title: "高齢者ライフ | シニアの経済と暮らしを支える情報サイト",
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            "老後のお金や暮らしの不安を解消！保険、年金、相続の最新情報を専門家が解説します。後悔しないための準備を今すぐ始めましょう。"
        }
      ],
      script: [
        {
          type: "application/ld+json",
          json: {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "高齢者ライフ",
            url: "https://www.intelinfor.com/",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://www.intelinfor.com/search/?query={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  gap: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid #ececee;
}
.layout-left {
  flex: 1;
  min-width: 0;
}
.layout-right {
  width: 300px;
  flex-shrink: 0;
}
.category-box {
  display: flex;
  flex-direction: column;
  gap: 0px;
}
.swiper-box {
  position: relative;
  overflow: hidden;
  .swiper-button-prev {
    top: 209px;
    @include icon(50px, 50px, "icon-left.png");
    &:after {
      content: "";
    }
  }
  .swiper-button-next {
    top: 209px;
    @include icon(50px, 50px, "icon-right.png");
    &:after {
      content: "";
    }
  }
}
.news-box-2 {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}
.swiper-slide {
  overflow: hidden;
}
.news-box-new {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}
@media screen and (max-width: 750px) {
  .main {
    flex-direction: column;
    padding-bottom: vw(32);
    border-bottom: none;
  }
  .layout-right {
    width: 100%;
  }
  .swiper-box {
    margin-top: vw(32);
    width: 100%;
    .swiper-button-prev {
      top: vw(186);
      @include icon(vw(64), vw(64), "icon-left.png");
      &:after {
        content: "";
      }
    }
    .swiper-button-next {
      top: vw(186);
      @include icon(vw(64), vw(64), "icon-right.png");
      &:after {
        content: "";
      }
    }
  }
  .swiper-slide {
    width: 100%;
    height: vw(764);
  }
  .news-box-2 {
    gap: vw(28) vw(14);
  }
  .news-box-new {
    grid-template-columns: repeat(1, 1fr);
    gap: vw(20);
  }
}
</style>
