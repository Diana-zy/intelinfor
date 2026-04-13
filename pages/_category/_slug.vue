<template>
  <div class="page">
    <AppHeader />
    <main class="main">
      <div class="layout-left">
        <breadcrumb
          :info="{
            category_id: id,
            seo_category_name: categoryInfo?.seo_category?.name,
            category_locale_name: categoryInfo?.seo_category?.name,
            is_seo_category_on_site: true,
            seo_category_path: slugPath
          }"
          is-category
        ></breadcrumb>
        <common-page-label
          :title="`「${capitalizeFirstLetter(categoryInfo?.seo_category?.name)}」Articles`"
        />
        <section>
          <InfiniteLoadList
            api-endpoint="/api/article/get_seo_category_page"
            :initial-page="2"
            :page-size="10"
            :show-more="false"
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
import Breadcrumb from "~/components/Breadcrumb";
import CommonPageLabel from "~/components/common/PageLabel";
import InfiniteLoadList from "~/components/InfiniteLoadList";
import NewsItem4 from "~/components/NewsItem4";
import RightSideBox from "~/components/RightSideBox";
import FooterSeo from "~/components/FooterSeo";
import AppHeader from "~/components/Header";
import { capitalizeFirstLetter } from "~/utils/utils";

export default {
  components: {
    AppHeader,
    Breadcrumb,
    InfiniteLoadList,
    NewsItem4,
    RightSideBox,
    FooterSeo,
    CommonPageLabel
  },
  async asyncData({ $axios, params, env }) {
    let id = "";
    const path = params.slug;
    const lastDashIndex = path.lastIndexOf("-");
    id = path.substring(lastDashIndex + 1, path.length);

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
        id,
        slugPath: path
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      return {
        recNews: null,
        trendingNews: null,
        categoryInfo: null,
        id,
        slugPath: path
      };
    }
  },
  head() {
    const categoryName = this.categoryInfo?.seo_category?.name || "";
    const categoryUrl = this.slugPath
      ? `https://www.intelinfor.com/category/${this.slugPath}/`
      : "https://www.intelinfor.com/";

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
      title: categoryName ? `${categoryName} - Intelinfor` : "Intelinfor",
      meta: [
        {
          hid: "description",
          name: "description",
          content: `Read the latest ${categoryName} articles on Intelinfor.`
        },
        {
          hid: "og:title",
          property: "og:title",
          content: categoryName ? `${categoryName} - Intelinfor` : "Intelinfor"
        },
        {
          hid: "og:url",
          property: "og:url",
          content: categoryUrl
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
                  name: "Home"
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
                  name: categoryName,
                  itemListElement: itemListElements
                }
              }
            ]
          : [])
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
