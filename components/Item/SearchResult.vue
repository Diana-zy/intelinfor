<template>
  <CustomLink class="item" :to="`/${item.path_v2}/`">
    <p class="title">{{ item.name }}</p>
    <p class="path">{{ formattedPath }}</p>
    <p class="desc">{{ item.first_paragraph }}</p>
  </CustomLink>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    formattedPath() {
      const origin = process.client ? window.location.origin : 'https://intelinfor.com';
      return `${origin}/${this.item.path_v2}/`;
    }
  }
};
</script>

<style lang="scss" scoped>
.item {
  display: block;
  border-bottom: 1px solid #ececee;
  margin-bottom: 24px;
  color: rgba($font3, 0.6);
  .title {
    font-family: "hem";
    font-size: 22px;
    line-height: 29px;
    color: $font3;
  }
  .path {
    line-height: 19px;
    margin-top: 8px;
    margin-bottom: 16px;
  }
  .desc {
    line-height: 19px;
    margin-bottom: 24px;
    @include ellipsis(7);
  }
  &:hover {
    .title {
      color: $color1;
      text-decoration: underline;
    }
  }
}
</style>
