<template>
  <CustomLink class="news-style-2" :to="`/${item.path_v2}/`">
    <NuxtImg
      format="auto"
      fit="cover"
      width="380"
      height="214"
      :src="item && item.cover || ''"
      :alt="item && item.cover_seo_alt"
      loading="lazy"
      class="img"
    />
    <p
      v-if="item.seo_category_name || item.category_locale_name || item.category_name"
      class="category btn-tag"
      :style="{ background: colorList[index] }"
      >{{ item.seo_category_name || item.category_locale_name || item.category_name }}</p
    >
    <p class="title">{{ item && item.name }}</p>
    <div class="m-news-author pc-hidden-flex">
      <div>{{ item.author && item.author.name }}</div>
      <div>{{ item.updated_at }}</div>
    </div>
  </CustomLink>
</template>

<script>
export default {
  props: {
    item: { type: Object, required: true },
    index: { type: Number, default: 0 }
  },
  data() {
    return {
      colorList: ["#C6F3E2", "#C9CDF2", "#C0E8B2", "#D2F0FD", "#FDD8DE"]
    };
  }
};
</script>

<style lang="scss" scoped>
.news-style-2 {
  padding-right: 16px;
  .img {
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 8px 8px 8px 8px;
  }
  .category {
    display: inline-block;
    padding: 4px 8px;
    line-height: 18px;
    font-size: 13px;
    font-family: "hem";
    color: #000;
    background: $tagColor2;
    border-radius: 4px 4px 4px 4px;
    margin: 16px 0 0;
  }
  .title {
    margin-top: 10px;
    font-size: 16px;
    font-family: "se3";
    line-height: 22px;
    @include ellipsis(3);
    transition: color 0.2s;
  }
  &:hover {
    .title {
      color: $color1;
      text-decoration: underline;
    }
  }
}
@media screen and (max-width: 750px) {
  .news-style-2 {
    padding-right: 0;
    width: 100%;
    min-width: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .img {
      width: 100%;
      height: auto;
      object-fit: cover;
      border-radius: 0;
      margin-right: 0;
    }
    .category {
      font-size: vw(24);
      line-height: vw(44);
      padding: vw(8) vw(16);
      border-radius: 0;
      margin: vw(20) 0 0;
    }
    .title {
      margin-top: vw(16);
      font-size: vw(32);
      line-height: 1.5;
      min-height: vw(144);
      @include ellipsis(3);
    }
    .m-news-author {
      display: flex;
      justify-content: space-between;
      margin-top: auto;
      font-size: vw(26);
      font-weight: 300;
      padding-bottom: vw(10);
      @include author-icon(vw(26), vw(26));
      div:first-child {
        max-width: vw(300);
        @include ellipsis();
      }
      div:last-child {
        max-width: vw(300);
        font-size: vw(26);
        @include ellipsis();
      }
    }
  }
}
</style>
