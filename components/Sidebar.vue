<template>
  <div>
    <div v-if="isOpen" class="overlay" @click="closeSidebar"></div>
    <div class="sidebar" :class="{ 'sidebar-hidden': !isOpen }">
      <div class="close" @click="closeSidebar"></div>

      <div class="search-box">
        <input
          v-model="input"
          placeholder="Search..."
          class="search"
          name="search"
          @keyup.enter="search"
        />
        <i v-show="input != ''" class="icon-clear" @click="clear"></i>
        <i class="icon-search" @click="search"></i>
      </div>

      <h2 class="title-h2">Category</h2>
      <ul class="categories">
        <li v-for="(item, i) in navData.list" :key="i">
          <CustomLink :to="`/category/${item.path}/`">{{
            capitalizeFirstLetter(item.name)
          }}</CustomLink>
        </li>
      </ul>
      <div v-if="showInstallButton" class="download" @click="installPWA"
        ><i class="icon-download" />Download</div
      >
    </div>
  </div>
</template>

<script>
import { simulateAFSSearch, capitalizeFirstLetter } from "~/utils/utils";

export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    navData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      showInstallButton: false,
      input: ""
    };
  },
  mounted() {
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
    closeSidebar() {
      this.$emit("close");
    },
    clear() {
      this.input = "";
    }
  }
};
</script>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 40;
}
.sidebar {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: vw(670);
  background: #fff;
  transition: transform 0.3s ease;
  z-index: 50;
  &::before {
    content: "";
    display: block;
    width: 100%;
    height: vw(2);
    background: #ececee;
    position: absolute;
    top: vw(96);
  }
}
.sidebar-hidden {
  transform: translateX(100%);
}
.close {
  position: absolute;
  top: vw(24);
  right: vw(46);
  @include icon(vw(48), vw(48), "icon-close.png");
}
.title-h2 {
  margin-left: vw(46);
}
.categories {
  li a {
    font-family: "se3";
    font-size: vw(32);
    height: vw(80);
    display: flex;
    align-items: center;
    padding-left: vw(46);
    cursor: pointer;
    &:hover {
      background: rgba($color1, 0.2);
      color: $color1;
      text-decoration: underline;
    }
  }
}
.search-box {
  display: block;
  visibility: visible;
  position: relative;
  max-width: vw(578);
  height: vw(80);
  box-shadow: 0 0 vw(16) 0 rgba(0, 0, 0, 0);
  border-radius: vw(8);
  border: vw(2) solid $font3;
  margin: vw(144) auto 0;
  padding-left: vw(20);
  padding-right: vw(192);
}
.search {
  width: 100%;
  height: 100%;
  font-family: "hem";
  &::placeholder {
    font-family: "her";
    color: rgba($font1, 0.4);
  }
}
.icon-search {
  position: absolute;
  right: vw(-2);
  top: vw(-2);
  display: block;
  background: $color1;
  border-radius: 0 vw(8) vw(8) 0;
  @include btn-img(vw(128), vw(80), "icon-search.png");
  background-size: vw(48) vw(48);
}
.icon-clear {
  position: absolute;
  right: vw(160);
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  background-image: url("~/assets/images/icon-clear.png");
  width: vw(28);
  height: vw(28);
  background-size: cover;
}

.words-container {
  margin-top: vw(24);
  width: 100%;
  overflow: hidden;
}

.marquee {
  display: flex;
  overflow: hidden;
  user-select: none;
  gap: vw(32);
}

.marquee-group {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: vw(32);
  min-width: 100%;
  animation: scrollLeft 50s linear infinite;
}
.hot-words {
  font-family: "hem";
  font-size: 12px;
  line-height: 16px;
  color: rgba(23, 23, 23, 0.6);
  text-align: left;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.icon-arrow {
  @include icon(12px, 12px, "icon-arrow.png");
}

@keyframes scrollLeft {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-100% - vw(32)));
  }
}

.download {
  position: absolute;
  bottom: 0;
  margin-top: auto;
  width: 100%;
  height: vw(96);
  font-size: vw(32);
  color: #f96606;
  line-height: vw(40);
  text-align: left;
  @include center;
  border-top: vw(2) solid rgba(23, 23, 23, 0.1);
}
.icon-download {
  @include icon(vw(40), vw(40), "icon-download.png");
  margin-right: vw(12);
}
</style>
