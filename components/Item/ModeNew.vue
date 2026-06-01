<template>
  <CustomLink :to="`/${item.path_v2}/`" class="mode-new-link">
    <div class="mode-new">
      <div>
        <div class="img-box">
          <NuxtImg
            v-if="item.cover"
            format="auto"
            fit="cover"
            width="140"
            :src="item.cover"
            :alt="item.cover_seo_alt"
            loading="lazy"
            class="img"
          />
          <img
            v-else
            src="/icon.png"
            :alt="item.cover_seo_alt"
            class="img"
          />
        </div>
        <div class="news-author">
          <div>{{ item.author && item.author.name }}</div>
        </div>
      </div>
      <div class="right-info">
        <p class="title">{{ item.name }}</p>
        <div class="tag">{{ item.seo_category_name || item.category_locale_name }}</div>
        <div class="date"> {{ item.updated_at }}</div>
      </div>
    </div>
  </CustomLink>
</template>

<script>
export default {
  name: "ModeNew",
  props: {
    item: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped lang="scss">
.mode-new-link {
  display: block;
  color: $font3;
  text-decoration: none;
  &:hover .title {
    color: $color1;
    text-decoration: underline;
  }
}
.mode-new {
  width: 100%;
  height: auto;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  gap: 10px;
  .img-box {
    flex-shrink: 0;
    width: 140px;
    height: 80px;
    overflow: hidden;
    &:hover .img {
      transform: scale(1.2);
    }
  }
  .img {
    width: 140px;
    height: 80px;
    object-fit: cover;
    transition: 0.6s;
  }
  .right-info {
    flex: 1;
    .title {
      line-height: 20px;
      font-size: 16px;
      margin-bottom: 4px;
      color: $font3;
      @include ellipsis(2);
      transition: color 0.2s;
    }
    .tag {
      width: fit-content;
      font-size: 14px;
      padding: 4px 6px;
      color: #000;
      background: $tagColor2;
    }
    .date {
      margin-top: 20px;
      font-size: 14px;
    }
  }
}
.news-author {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  font-size: 12px;
  @include author-icon(16px, 16px);
}
</style>
