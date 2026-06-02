<!--右侧边栏-->
<template>
  <div class="right-sider">
    <div class="category-box">
      <div class="right-title"> カテゴリー</div>
      <div class="category-content">
        <custom-link
          v-for="(item, i) in navData.list"
          :key="i"
          :to="`/category/${item.path}/`"
          class="category-item"
          >{{ item.name }}</custom-link
        >
      </div>
    </div>
    <div class="new-box">
      <h2 class="title-h2"> 新着記事 </h2>
      <div class="new-content">
        <item-mode-new v-for="(item, i) in recNews" :key="i" :item="item"></item-mode-new>
        <p v-if="recNews.length === 0" class="empty-message">No articles found</p>
      </div>
    </div>
    <div class="rec-box">
      <h2 class="title-h2"> イチオシ記事 </h2>
      <div class="rec-content">
        <item-mode-new v-for="(item, i) in trendingNews" :key="i" :item="item"></item-mode-new>
        <p v-if="trendingNews.length === 0" class="empty-message">No articles found</p>
      </div>
    </div>
  </div>
</template>

<script>
import CustomLink from "./CustomLink";
import { capitalizeFirstLetter } from "~/utils/utils";

export default {
  name: "RightSideBox",
  components: { CustomLink },
  props: {
    recNews: { type: Array, default: () => [] },
    trendingNews: { type: Array, default: () => [] }
  },
  data() {
    return {
      navData: this.$root.$options.navData || this.$navData || { list: [] }
    };
  },
  methods: {
    capitalizeFirstLetter
  }
};
</script>

<style scoped lang="scss">
.right-sider {
  .right-title {
    background: #FAF7F2;
    border-top: 1px solid #E6DFD5;
    border-bottom: 1px solid #E6DFD5;
    line-height: 45px;
    margin-bottom: 20px;
    font-weight: 600;
    font-size: 16px;
    display: block;
    color: #2C2A29;
    padding-left: 12px;
  }
  .category-box {
    width: 100%;
    margin-bottom: 20px;
    .category-content {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      .category-item {
        border: 1px solid rgba(#000, 0.65);
        padding: 6px 10px;
        font-size: 12px;
        color: #000;
        border-radius: 20px;
      }
    }
  }
  .new-box {
    width: 100%;
    margin-bottom: 20px;
    .new-content {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
  }
  .rec-box {
    width: 100%;
    .rec-content {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
  }
  .empty-message {
    color: #999;
    font-size: 14px;
    text-align: center;
    padding: 20px;
  }
}
</style>
