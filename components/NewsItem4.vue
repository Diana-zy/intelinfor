<template>
  <CustomLink class="news-style-4" :to="`/detail/${item.path}/`">
    <NuxtImg
      format="auto"
      fit="cover"
      width="328"
      height="218"
      :src="item.cover"
      :alt="item.name"
      loading="lazy"
      class="img"
    />
    <p class="category">{{ capitalizeFirstLetter(item.category_locale_name) }}</p>
    <p class="title">{{ item.name }}</p>
    <!-- <p class="desc">
      {{ item.first_paragraph }}
    </p> -->
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
.news-style-4 {
  position: relative;
  padding-right: 344px;
  margin-bottom: 24px;
  height: 243px;
  &::after {
    content: "";
    position: absolute;
    right: left;
    bottom: 0;
    // width: calc(100% - 344px);
    width: 100%;
    height: 1px;
    background: rgba($font1, 0.1);
  }
  .img {
    position: absolute;
    right: 0;
    top: 0;
    width: 328px;
    height: 218px;
    border-radius: 8px 8px 8px 8px;
    float: right;
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
    margin: 16px 0 12px;
  }
  .title {
    width: 846px;
    font-size: 24px;
    font-family: "se3";
    line-height: 32px;
    @include ellipsis(2);
    transition: color 0.2s;
  }
  // .desc {
  //   color: rgba($font1, 0.6);
  //   line-height: 19px;
  //   font-family: "hem";
  //   @include ellipsis(5);
  // }
  &:hover {
    .title {
      color: $color1;
      text-decoration: underline;
    }
  }
}
@media screen and (max-width: 750px) {
  .news-style-4 {
    padding-right: vw(258);
    margin-bottom: vw(32);
    height: vw(194);
    &::after {
      width: 100%;
      height: vw(2);
    }
    .img {
      width: vw(242);
      height: vw(160);
      border-radius: vw(16);
    }
    .category {
      padding: 0 vw(8);
      height: vw(40);
      line-height: vw(40);
      font-size: vw(24);
      border-radius: vw(8);
      margin: 0 0 vw(6);
    }
    .title {
      width: vw(396);
      font-size: vw(28);
      line-height: vw(38);
      margin-bottom: 0;
      @include ellipsis(3);
    }
    // .desc {
    //   display: none;
    // }
    &:hover {
      .title {
        color: $color1;
      }
    }
  }
}
</style>
