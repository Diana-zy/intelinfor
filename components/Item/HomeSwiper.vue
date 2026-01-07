<template>
  <CustomLink class="news-style-1" :to="`/detail/${item.path}/`">
    <NuxtImg
      format="auto"
      fit="cover"
      width="366"
      height="244"
      :src="item.cover"
      :alt="item.name"
      loading="lazy"
      class="img m-hidden"
    />
    <NuxtImg
      format="auto"
      fit="cover"
      width="491"
      height="275"
      :src="item.cover"
      :alt="item.name"
      loading="lazy"
      class="img pc-hidden"
    />
    <p class="title">{{ item.name }}</p>
    <!-- <p class="desc">{{ item.first_paragraph }}</p> -->
  </CustomLink>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.news-style-1 {
  transition: border-color 0.2s;
  height: 288px;
  .img {
    width: 282px;
    height: 188px;
  }
  .title {
    font-size: 18px;
    line-height: 24px;
    @include ellipsis(3);
    margin: 6px 8px 4px;
    transition: color 0.2s;
  }
  // .desc {
  //   @include ellipsis(2);
  //   color: rgba($font1, 0.6);
  //   line-height: 19px;
  //   height: 38px;
  //   margin: 0px 8px 11px;
  // }
  &:hover {
    border-color: $color1;
    .title {
      color: $color1;
      text-decoration: underline;
    }
  }
  .pc-hidden {
    display: none;
  }
  .m-hidden {
    display: block;
  }
}
@media screen and (max-width: 750px) {
  .news-style-1 {
    height: vw(552);
    .img {
      width: 100%;
      height: vw(344);
    }
    .title {
      font-size: vw(40);
      line-height: vw(56);
      margin: vw(16) vw(16) vw(8);
      font-weight: 500;
    }
    // .desc {
    //   font-size: vw(24);
    //   line-height: vw(32);
    //   height: vw(64);
    //   margin: 0 vw(16) vw(16);
    // }
    &:hover {
      border-color: $color1;
      .title {
        color: $color1;
      }
    }
    .pc-hidden {
      display: block;
    }
    .m-hidden {
      display: none;
    }
  }
}
</style>
