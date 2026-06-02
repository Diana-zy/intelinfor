<template>
  <CustomLink class="news-style-2" :to="`/detail/${item.path}/`">
    <NuxtImg
      format="auto"
      fit="cover"
      width="236"
      height="156"
      :src="item.cover"
      :alt="item.name"
      loading="lazy"
      class="img"
    />
    <p class="category">{{ capitalizeFirstLetter(item.category_locale_name) }}</p>
    <p class="title">{{ item.name }}</p>
  </CustomLink>
</template>

<script>
import { capitalizeFirstLetter } from "~/utils/utils";
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },

  methods: {
    capitalizeFirstLetter
  }
};
</script>

<style lang="scss" scoped>
.news-style-2 {
  padding-right: 16px;
  .img {
    width: 240px;
    height: 160px;
    border-radius: 8px 8px 8px 8px;
    float: right;
    margin-left: 16px;
  }
  .category {
    display: inline-block;
    padding: 1px 4px;
    line-height: 16px;
    font-size: 12px;
    font-family: "hem";
    color: $color1;
    background: rgba($color1, 0.2);
    border-radius: 4px 4px 4px 4px;
    margin: 16px 0 10px;
  }
  .title {
    font-size: 16px;
    font-family: "Noto Sans JP", "Lucida Grande", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif;
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
@media screen and (max-width: 1100px) {
  .news-style-2 {
    width: 100%;
  }
}
@media screen and (max-width: 750px) {
  .news-style-2 {
    padding-right: 0;
    border-bottom: vw(2) solid #ececee;
    height: vw(182);
    // position: relative;
    // &::after {
    //   content: "";
    //   position: absolute;
    //   right: left;
    //   bottom: 0;
    //   width: calc(100% - vw(236));
    //   height: vw(2);
    //   background: #ececee;
    // }
    .img {
      width: vw(236);
      height: vw(156);
      border-radius: vw(16);
      margin-right: 0;
      margin-left: 10px;
    }
    .category {
      display: none;
    }
    .title {
      margin: 0 0 vw(32);
      font-size: vw(30);
      line-height: vw(44);
    }
  }
}
</style>
