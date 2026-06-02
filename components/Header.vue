<template>
  <header class="header">
    <div class="header-top">
      <CustomLink to="/" class="logo"></CustomLink>
      <div class="search-box m-hidden-block">
        <input v-model="input" placeholder="ウェブ検索" class="search" @keyup.enter="search" />
        <i v-show="input != ''" class="icon-clear" @click="clear"></i>
        <i class="icon-search" @click="search"></i>
      </div>
    </div>
    <div class="menu">
      <div class="category">
        <ul class="dropdown">
          <li
            v-for="(item, i) in (navData && navData.list || []).slice(0, 6)"
            :key="i"
            class="dropdown-item"
            @mouseenter="onCategoryEnter(item)"
            @mouseleave="onCategoryLeave"
          >
            <CustomLink :to="`/category/${item.path}/`">{{ item.name }}</CustomLink>
            <div v-if="activeCategory === item.path" class="dropdown-panel" @mouseenter="onPanelEnter" @mouseleave="onCategoryLeave">
              <div v-if="loadingCategory === item.path" class="dropdown-loading">読み込み中...</div>
              <template v-else-if="categoryArticles[item.path]">
                <CustomLink
                  v-for="(article, ai) in categoryArticles[item.path]"
                  :key="ai"
                  :to="`/${article.path_v2}/`"
                  class="dropdown-article"
                >{{ article.name }}</CustomLink>
                <CustomLink :to="`/category/${item.path}/`" class="dropdown-more">もっと見る →</CustomLink>
              </template>
            </div>
          </li>
        </ul>
      </div>

      <div class="search-m-box pc-hidden-flex">
        <i class="icon-search-m" :class="{ 'show-close': showSearch }" @click="handleOpenSearch"></i>
        <div class="pc-hidden-block">
          <div class="icon-sidebar" :class="{ 'show-close': isSidebarOpen }" @click="toggleSidebar"></div>
        </div>
        <transition name="opacity">
          <div class="mask" @click="handleClickMask" v-show="isSidebarOpen || showSearch">
            <transition name="slide">
              <div class="menu-nav-list" v-show="isSidebarOpen">
                <ul>
                  <li v-for="item in (navData && navData.list || [])">
                    <CustomLink :to="`/category/${item.path}/`">{{ item.name }}</CustomLink>
                  </li>
                </ul>
              </div>
            </transition>
            <transition name="slide">
              <div class="menu-nav-list" v-show="showSearch">
                <div class="search-box-nav" @click.stop="handleClick">
                  <input
                    v-model="input"
                    placeholder="ウェブ検索"
                    class="search-nav"
                    @keyup.enter="search"
                  />
                  <i v-show="input != ''" class="icon-clear-nav" @click="clear"></i>
                  <i class="icon-search-nav" @click="search"></i>
                </div>
              </div>
            </transition>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script>
import { simulateAFSSearch } from "~/utils/utils";

export default {
  props: {
    categories: { type: Array, default: () => [] }
  },
  data() {
    return {
      input: "",
      deferredPrompt: null,
      showInstallButton: false,
      isSidebarOpen: false,
      showSearch: false,
      navData: this.$root.$options.navData || this.$navData || { list: [] },
      activeCategory: null,
      loadingCategory: null,
      categoryArticles: {},
      leaveTimer: null
    };
  },
  mounted() {
    this.input = this.$route.query.query || "";
    if ("serviceWorker" in navigator && "PushManager" in window) {
      if (window.deferredPrompt) {
        this.deferredPrompt = window.deferredPrompt;
        this.showInstallButton = true;
      } else {
        window.addEventListener("beforeinstallprompt", (e) => {
          e.preventDefault();
          this.deferredPrompt = e;
          this.showInstallButton = true;
        });
      }
    }
  },
  methods: {
    handleOpenSearch() {
      this.isSidebarOpen = false;
      this.showSearch = !this.showSearch;
      if (this.showSearch) {
        document.body.classList.add("no-scroll");
      } else {
        document.body.classList.remove("no-scroll");
      }
    },
    handleClickMask() {
      this.showSearch = false;
      this.isSidebarOpen = false;
      document.body.classList.remove("no-scroll");
    },
    search() {
      if (this.input.length < 1) {
        this.$globalMethod.showNotification({
          message: "Please enter at least 1 character",
          type: "warning"
        });
        return;
      }
      simulateAFSSearch(this.input);
    },
    toggleSidebar() {
      this.showSearch = false;
      this.isSidebarOpen = !this.isSidebarOpen;
      if (this.isSidebarOpen) {
        document.body.classList.add("no-scroll");
      } else {
        document.body.classList.remove("no-scroll");
      }
    },
    closeSidebar() { this.isSidebarOpen = false; },
    handleClick() {},
    clear() { this.input = ""; },
    async onCategoryEnter(item) {
      clearTimeout(this.leaveTimer);
      this.activeCategory = item.path;
      if (!this.categoryArticles[item.path]) {
        this.loadingCategory = item.path;
        try {
          const lastDash = item.path.lastIndexOf("-");
          const id = item.path.substring(lastDash + 1);
          const res = await this.$axios.$get("/api/article/get_seo_category_page", {
            params: { seo_category_id: id, page: 1, page_size: 3, site_id: process.env.SITE_ID }
          });
          this.$set(this.categoryArticles, item.path, res && res.list ? res.list.slice(0, 3) : []);
        } catch (e) {
          this.$set(this.categoryArticles, item.path, []);
        } finally {
          this.loadingCategory = null;
        }
      }
    },
    onPanelEnter() {
      clearTimeout(this.leaveTimer);
    },
    onCategoryLeave() {
      this.leaveTimer = setTimeout(() => { this.activeCategory = null; }, 150);
    }
  }
};
</script>
<style lang="scss" scoped>
.header {
  position: relative;
  max-width: 1200px;
  height: 157px;
  margin-bottom: 0px;
  z-index: 11;
  .header-top {
    width: 100%;
    height: 76px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    .logo {
      display: block;
      width: 300px;
      height: 70px;
      background-image: url("~/assets/images/logo.png");
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      margin-right: 56px;
    }
  }
}
.menu {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .category {
    width: 100%;
    overflow: visible;
    font-size: 16px;
    line-height: 72px;
    cursor: pointer;
    position: relative;
    z-index: 2;
    .dropdown {
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      justify-content: space-between;
      list-style: none;
      padding: 0;
      margin: 0;
    }
    li {
      white-space: nowrap;
      a { display: block; width: 100%; height: 100%; }
    }
  }
}
.search-box {
  position: absolute;
  top: 14px;
  right: 0;
  width: 360px;
  height: 48px;
  border-radius: 8px;
  border: 1px solid $font3;
  padding-left: 16px;
  padding-right: 60px;
}
.search {
  position: absolute;
  top: 0;
  left: 16px;
  width: 80%;
  height: 100%;
  font-family: "hem";
  &::placeholder { font-family: "hem"; color: rgba($font1, 0.4); }
}
.icon-clear {
  position: absolute;
  right: 56px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  background-image: url("~/assets/images/icon-clear.png");
  width: 16px;
  height: 16px;
  background-size: cover;
}
.icon-search {
  position: absolute;
  right: -1px;
  top: -1px;
  display: block;
  cursor: pointer;
  border-radius: 0 8px 8px 0;
  background-color: $color1;
  @include btn-img(48px, 48px, "icon-search.png");
  background-size: 24px 24px;
}
.dropdown-item {
  position: relative;
  &:hover > a { color: $color1; }
}
.dropdown-panel {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  min-width: 260px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 6px 24px rgba(0,0,0,0.12);
  padding: 12px 0;
  z-index: 100;
  margin-top: 2px;
}
.dropdown-loading {
  padding: 12px 16px;
  font-size: 13px;
  color: #999;
}
.dropdown-article {
  display: block;
  padding: 10px 16px;
  font-size: 14px;
  line-height: 1.4;
  color: $font3;
  text-decoration: none;
  @include ellipsis(2);
  &:hover { color: $color1; background: rgba($color1, 0.06); }
}
.dropdown-more {
  display: block;
  margin: 8px 16px 0;
  padding-top: 8px;
  border-top: 1px solid rgba($font3, 0.15);
  font-size: 13px;
  color: $color1;
  text-decoration: none;
  &:hover { text-decoration: underline; }
}
@media screen and (max-width: 1100px) {
  .search-box { width: 240px; }
}
@media screen and (max-width: 750px) {
  .header {
    width: 100%;
    padding: 0 vw(32);
    max-width: 100vw;
    height: vw(114);
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: vw(2) solid rgba($font3, 0.35);
    z-index: 11;
    .header-top {
      height: 100%;
      justify-content: start;
      .logo { width: vw(420); height: vw(80); background-image: url("~/assets/images/logo.png"); background-size: contain; background-repeat: no-repeat; background-position: left center; margin-right: 0; }
    }
  }
  .menu-nav-list {
    position: absolute;
    top: 0;
    left: 0;
    padding: vw(40) vw(32);
    height: auto;
    width: 100vw;
    transition: all 0.6s;
    overflow: hidden;
    background-color: #fff;
    z-index: 12;
    font-size: vw(32);
    li { padding: vw(16) 0; line-height: vw(48); border-bottom: vw(2) solid rgba($font3, 0.2); }
    a { display: inline-block; width: 100%; }
  }
  .category { display: none; }
  .icon-sidebar { @include icon(vw(48), vw(48), "icon-sidebar.png"); cursor: pointer; }
  .menu { height: 100%; width: auto; }
  .search-m-box { width: auto; height: vw(64); display: flex; align-items: center; gap: vw(20); }
  .search {
    position: relative; width: 100%; height: 100%; font-family: "hem";
    &::placeholder { font-family: "hem"; color: rgba($font1, 0.4); }
  }
  .icon-clear {
    position: absolute; right: vw(100); top: 50%; transform: translateY(-50%);
    cursor: pointer; background-image: url("~/assets/images/icon-clear.png");
    width: vw(28); height: vw(28); background-size: cover;
  }
  .icon-search-m {
    top: 0; right: 0; position: relative; display: block;
    @include icon(vw(48), vw(48), "icon-search4.png");
    cursor: pointer;
  }
  .search-box-nav {
    position: relative; width: 100%; height: vw(80); display: flex; flex-wrap: nowrap;
    .search-nav {
      width: 100%; border: vw(2) solid $font3; border-radius: vw(12); padding-left: vw(32);
    }
    .icon-clear-nav {
      position: absolute; right: vw(100); top: 50%; transform: translateY(-50%);
      cursor: pointer; background-image: url("~/assets/images/icon-clear.png");
      width: vw(28); height: vw(28); background-size: cover;
    }
    .icon-search-nav {
      position: absolute; right: vw(16); top: 50%; transform: translateY(-50%);
      display: block; cursor: pointer;
      @include icon(vw(48), vw(48), "icon-search.png");
    }
  }
  .show-close { @include icon(vw(48), vw(48), "icon-close.png"); }
  .mask {
    position: absolute; top: vw(114); left: 0; width: 100vw; height: 100vh;
    z-index: 10; background: rgba(#111, 0.7); overflow: hidden; pointer-events: all;
  }
}
</style>
