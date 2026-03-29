<template>
  <footer class="footer" :class="{ sm: ['de'].indexOf(lang) !== -1 }">
    <div class="footer-info">
      <div class="icon-logo">
        <img :src="icon" alt="" />
      </div>
      <div class="website-info">
        <div>Intelinfor is committed to delivering comprehensive world news and information across various domains including politics, economics, technology, culture, and sports.</div>
        <div>We provide the latest global developments with a focus on accurate reporting and in-depth analysis to help you stay informed about important events worldwide.</div>
      </div>
      <div class="link-info">
        <ul>
          <li class="link-item">
            <CustomLink :to="'/cookies.html'" target="_blank">Privacy Policy</CustomLink>
          </li>
          <li class="link-item">
            <CustomLink :to="'/eula.html'" target="_blank">Terms of Use</CustomLink>
          </li>
          <li class="link-item">
            <a href="mailto:service@intelinfor.com">Contact Us</a>
          </li>
        </ul>
      </div>
      <div class="link-info link-info-social">
        <div class="m-hidden-block">Related Services:</div>
        <ul>
          <li class="link-item">
            <span @click="handleClick('twitter')">X (Twitter)</span>
          </li>
          <li class="link-item">
            <span data-name="facebook" @click="handleClick('facebook')">Facebook</span>
          </li>
        </ul>
      </div>
      <div class="bottom-info">Intelinfor.com</div>
    </div>
    <Notification v-if="showNotification" :message="notificationMessage" />
  </footer>
</template>

<script>
import { validateEmail } from "~/utils/utils";

export default {
  props: {
    lang: {
      type: String,
      default: "en"
    },
    channelId: {
      type: String,
      default: ""
    },
    info: {
      type: Object
    }
  },
  data() {
    return {
      input: "",
      icon: require("@/assets/images/logo.png")
    };
  },
  computed: {
    showNotification() {
      return this.$globalData.notification.show;
    },
    notificationMessage() {
      return this.$globalData.notification.message;
    }
  },
  methods: {
    async submitEmail() {
      if (validateEmail(this.input)) {
        await this.$axios.$post("/api/game/subscribe", {
          site_id: process.env.SITE_ID,
          email: this.input
        });
        this.$globalMethod.showNotification({
          message: "Thank you for subscribing!",
          type: "success"
        });
      } else {
        this.$globalMethod.showNotification({
          message: "Please enter a valid email address",
          type: "warning"
        });
      }
    },
    handleClick(type) {
      if (window.location.pathname.includes("/detail")) {
        let url;
        switch (type) {
          case "facebook":
            url = `https://www.facebook.com/sharer/sharer.php?u=${
              window.location.origin + window.location.pathname
            }&t=${this.info?.name || "Article"}`;
            window.open(url);
            break;
          case "twitter":
            url = `https://twitter.com/intent/tweet?url=${
              window.location.origin + window.location.pathname
            }&text=${this.info?.name || "Check this out"}`;
            window.open(url);
            break;
        }
      } else {
        let url;
        switch (type) {
          case "facebook":
            url = `https://www.facebook.com/intelinfor/`;
            window.open(url, "_blank");
            break;
          case "twitter":
            url = `https://x.com/intelinfor`;
            window.open(url, "_blank");
            break;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.footer {
  position: relative;
  margin-top: 32px;
  color: rgba(#000, 0.65);
  .icon-logo {
    width: 212px;
    height: 32px;
    margin-bottom: 20px;
    img {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }
  .website-info {
    font-size: 16px;
    line-height: 21px;
    margin-bottom: 10px;
    div:first-child {
      margin-bottom: 28px;
    }
  }
  .link-item {
    cursor: pointer;
  }
  .link-info {
    display: flex;
    align-items: center;
    li {
      padding: 8px 0;
      display: inline-block;
      margin-right: 20px;
    }
  }
  .bottom-info {
    margin-top: 72px;
    transform: translateX(calc((1200px - 100vw) / 2));
    left: 0;
    width: 100vw;
    height: 44px;
    font-size: 14px;
    text-align: center;
    line-height: 44px;
    color: #fff;
    background: #fd9a25;
  }
}
@media screen and (max-width: 1100px) {
  .footer {
    .bottom-info {
      transform: none;
      width: 100vw;
    }
  }
}
@media screen and (max-width: 750px) {
  .footer {
    position: relative;
    margin-top: vw(32);
    .icon-logo {
      margin-left: vw(32);
      width: vw(320);
      height: vw(48);
    }
    .website-info {
      padding: 0 vw(32);
      line-height: 1.5;
      font-size: vw(28);
      div:first-child {
        margin-bottom: vw(24);
      }
    }
    .link-info {
      padding: vw(48) vw(32) 0;
      ul,
      .link-item {
        width: 100%;
      }
      li {
        padding: 0;
        display: block;
        line-height: vw(66);
        font-size: vw(24);
        color: rgba(#000, 0.65);
        border-bottom: vw(1) solid rgba($font3, 0.35);
      }
    }
    .link-info-social {
      padding-top: 0;
    }
    .bottom-info {
      transform: none;
      width: 100%;
      height: vw(70);
      font-size: vw(28);
      line-height: vw(70);
      margin-top: vw(64);
    }
  }
}
</style>
