<template>
  <div class="page">
    <Header />
    <main class="main">
      <div class="layout-left">
        <breadcrumb
          :info="{
            category_id: id,
            category_locale_name: categoryInfo?.seo_category?.name
          }"
          isCategory
        ></breadcrumb>
        <common-page-label
          :title="`「${capitalizeFirstLetter(categoryInfo?.seo_category?.name)}」Articles`"
        />
        <section>
          <InfiniteLoadList
            api-endpoint="/api/article/get_seo_category_page"
            :initial-page="2"
            :page-size="10"
            :showMore="false"
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
    const path = params.slug;
    const lastDashIndex = path.lastIndexOf("-");
    const id = path.substring(lastDashIndex + 1, path.length);

    try {
      const [recNewsResponse, trendingNewsResponse, categoryInfoResponse] = await Promise.all([
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
        $axios.$get("/api/article/get_seo_category_page", {
          params: {
            site_id: env.SITE_ID,
            seo_category_id: id,
            size: 10,
            page: 1
          }
        })
      ]);
      // console.log(categoryInfoResponse, "categoryInfoResponse");
      // 返回多个接口的数据
      return {
        recNews: recNewsResponse,
        trendingNews: trendingNewsResponse,
        categoryInfo: categoryInfoResponse,
        id
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      return {
        recNews: null,
        trendingNews: null,
        categoryInfo: null,
        id
      };
    }
  },
  head() {
    const itemListElements = this.categoryInfo?.list?.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://www.intelinfor.com/${item.path_v2}/`
    })) || [];

    return {
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
                  name: "Home"
                }
              },
              {
                "@type": "ListItem",
                position: 2,
                item: {
                  "@id": `https://www.intelinfor.com/category/${this.id}/`,
                  name: this.categoryInfo?.seo_category?.name || ""
                }
              }
            ]
          }
        },
        {
          type: "application/ld+json",
          json: {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: itemListElements
          }
        }
      ]
    };
  },
  methods: {
    capitalizeFirstLetter
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
