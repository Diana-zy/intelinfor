<template>
  <header class="header">
    <CustomLink to="/" class="logo"></CustomLink>
    <div class="menu">
      <div v-if="showInstallButton" class="pwa-download" @click="installPWA">
        <i class="icon-pwa"></i>
      </div>

      <div class="category"
        >カテゴリー
        <ul class="dropdown">
          <li v-for="(item, i) in navData.list" :key="i"
            ><CustomLink :to="`/category/${item.path}/`">{{
              capitalizeFirstLetter(item.locale_name.ja)
            }}</CustomLink></li
          >
        </ul>
      </div>

      <div class="search-box">
        <!-- <transition name="slide"> -->
        <input v-model="input" placeholder="ウェブ検索" class="search" @keyup.enter="search" />
        <!-- </transition> -->
        <i v-show="input != ''" class="icon-clear" @click="clear"></i>
        <i class="icon-search" @click="search"></i>
      </div>

      <!-- <CustomLink to="/us/" class="contact">Contact Us</CustomLink> -->

      <div class="pc-hidden">
        <div class="icon-sidebar" @click="toggleSidebar"> </div>
        <Sidebar :is-open="isSidebarOpen" :nav-data="navData" @close="closeSidebar" />
      </div>
    </div>
  </header>
</template>

<script>
import { simulateAFSSearch, capitalizeFirstLetter } from "~/utils/utils";

export default {
  props: {
    categories: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      input: "",
      searchInput: "",
      deferredPrompt: null,
      showInstallButton: false,
      isSidebarOpen: false,
      navData: this.$root.$options.navData || this.$navData
    };
  },
  mounted() {
    this.input = this.$route.query.query || "";
    // 判断是否支持 PWA
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
    capitalizeFirstLetter,
    search() {
      if (this.input.length < 1) {
        this.$globalMethod.showNotification({
          message: "Please enter at least 1 characters",
          type: "warning"
        });
        return;
      }
      simulateAFSSearch(this.input);
    },
    installPWA() {
      if (this.deferredPrompt) {
        this.deferredPrompt.prompt();
        this.deferredPrompt.userChoice.then(() => {
          this.deferredPrompt = null;
        });
      }
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    closeSidebar() {
      this.isSidebarOpen = false;
    },
    clear() {
      this.input = "";
    }
    // 清空热词
  }
};
</script>
<style lang="scss">
.home-page .search-box {
  display: none;
}
@media screen and (max-width: 750px) {
  .home-page .logo {
    width: vw(250) !important;
    background-image: url("~/assets/images/logo.png") !important;
  }
}
</style>

<style lang="scss" scoped>
.toggle-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.toggle-button:hover {
  background-color: #0056b3;
}
.header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  height: 72px;
  margin-bottom: 32px;
  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100vw;
    height: 1px;
    background-color: #ececee;
    transform: translateX(-50%);
    left: 50%;
  }
}
.logo {
  width: 166px;
  height: 40px;
  @include bg("logo.png");
  margin-right: 56px;
}
.menu {
  display: flex;
  align-items: center;
}
.pwa-download {
  width: 32px;
  height: 32px;
  background: rgba($color1, 0.2);
  border-radius: 850%;
  @include center;
  font-family: "hem";
  color: $font2;
}
.icon-pwa {
  @include icon(20px, 20px, "icon-pwa.png");
}
.search-box {
  position: relative;
  width: 380px;
  height: 48px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0);
  border-radius: 8px;
  border: 1px solid $font3;
  margin: 0 0 0 24px;
  padding-left: 16px;
  padding-right: 120px;
}
.search {
  position: absolute;
  top: 0;
  left: 16px;
  width: 60%;
  height: 100%;
  font-family: "hem";
  &::placeholder {
    font-family: "hem";
    color: rgba($font1, 0.4);
  }
}
.icon-clear {
  position: absolute;
  right: 94px;
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
  border-radius: 0 8px 8px 0;
  background-color: $color1;
  @include btn-img(64px, 48px, "icon-search.png");
  background-size: 32px 32px;
}
.category {
  width: 100px;
  height: 72px;
  font-size: 16px;
  line-height: 72px;
  font-family: "hem";
  text-align: right;
  cursor: pointer;
  position: relative;
  z-index: 2;
  // &:hover {
  //   color: $color1;
  // }
}

.category:hover .dropdown,
.dropdown:hover {
  display: block;
}

.dropdown {
  display: none;
  position: absolute;
  top: 54px;
  right: 34px;
  transform: translateX(50%);
  box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.12);
  border-radius: 8px 8px 8px 8px;
  background: #fff;
  overflow: hidden;
}

.dropdown li {
  font-size: 16px;
  font-family: "hem";
  line-height: 40px;
  text-align: left;
  cursor: pointer;
  white-space: nowrap;
  a {
    display: block;
    width: 100%;
    height: 100%;
    padding: 0 16px;
  }
}

.dropdown li:hover {
  background: rgba($color1, 0.2);
  color: $color1;
}
.contact {
  width: 116px;
  height: 72px;
  line-height: 72px;
  font-size: 16px;
  font-family: "hem";
  color: $font1;
  text-align: right;
  cursor: pointer;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
}

.slide-enter {
  opacity: 0;
  transform: translateY(40%);
}

.slide-leave-to {
  transform: translateY(-40%);
  opacity: 0;
}
@media screen and (max-width: 1100px) {
  .contact {
    display: none;
  }
  .logo {
    margin-right: 60px;
  }
  .pwa-download {
    width: 40px;
    height: 40px;
    span {
      display: none;
    }
    i {
      margin-right: 0;
    }
  }
  .category {
    margin-left: 24px;
    width: auto;
    .dropdown {
      top: 64px;
      right: 0;
      transform: none;
    }
  }
}
@media screen and (max-width: 750px) {
  .header {
    width: 100%;
    padding: 0;
    max-width: 100vw;
    height: vw(96);
    margin-bottom: vw(48);
    &::after {
      height: vw(2);
    }
  }
  .contact,
  .category {
    display: none;
  }
  .logo {
    width: vw(60);
    height: vw(60);
    @include bg("icon-logo-m.png");
    margin-right: 0;
  }
  .pwa-download {
    display: none;
    span {
      display: none;
    }
  }
  .icon-pwa {
    @include icon(vw(48), vw(48), "icon-pwa2.png");
    margin-right: 0;
  }
  .icon-sidebar {
    @include icon(vw(48), vw(48), "icon-sidebar.png");
    cursor: pointer;
  }
  .pc-hidden {
    margin-left: auto;
  }
  .search-box {
    max-width: vw(304);
    height: vw(64);
    box-shadow: 0 0 vw(16) 0 rgba(0, 0, 0, 0);
    border-radius: vw(8);
    border: vw(2) solid $font3;
    margin: 0 vw(24) 0 0;
    padding-left: vw(20);
    padding-right: vw(166);
  }
  .search {
    width: 46%;
    height: 100%;
    font-family: "hem";
    &::placeholder {
      font-family: "hem";
      color: rgba($font1, 0.4);
    }
  }
  .icon-clear {
    position: absolute;
    right: vw(100);
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    background-image: url("~/assets/images/icon-clear.png");
    width: vw(28);
    height: vw(28);
    background-size: cover;
  }
  .icon-search {
    position: absolute;
    right: vw(-2);
    top: vw(-2);
    display: block;
    border-radius: 0 vw(8) vw(8) 0;
    @include btn-img(vw(80), vw(64), "icon-search.png");
    background-size: vw(48) vw(48);
  }
}
</style>
