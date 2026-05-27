<template>
  <footer class="footer" :class="{ sm: ['de'].indexOf(lang) !== -1 }">
    <div class="copyright">
      <div class="copyright-content">
        <div class="copyright-content-1">
          <CustomLink
            :to="`/eula${['ja', 'ko', 'zh_TW'].indexOf(lang) === -1 ? '' : '-' + lang}.html`"
            target="_blank"
          >
            {{ eulaText[lang] }}
          </CustomLink>
          <CustomLink
            :to="`/privacy${['ja', 'ko', 'zh_TW'].indexOf(lang) === -1 ? '' : '-' + lang}.html`"
            target="_blank"
          >
            {{ privacyText[lang] }} </CustomLink
          ><CustomLink
            :to="`/cookies${['ja', 'ko', 'zh_TW'].indexOf(lang) === -1 ? '' : '-' + lang}.html`"
            target="_blank"
          >
            {{ cookiesText[lang] }}
          </CustomLink>
          <a href="mailto:service@intelinfor.com">
            {{ contactText[lang] }}
          </a>
        </div>
        <span>
          {{ copyRightText1[lang] }}
          ©&nbsp; 2026 Intelinfor &nbsp;
          {{ copyRightText2[lang] }}
        </span>
      </div>
    </div>
    <div
      v-if="
        [
          '6177096425',
          '4864014757',
          '3220867814',
          '2237851416',
          '7483019796',
          '2713908844',
          '4162823514',
          '9633145189'
        ].indexOf(channelId) != -1
      "
      class="special-info copyright"
    >
      <p>運营会社: HongKong Himobi Co.,Limited</p>
      <p>運営責任者: lisa</p>
      <p>住所: Room 1003, 10/F, Tower 1, Lippo Centre, 89 Queensway, Admiralty, Hong Kong</p>
      <p>連絡先: service@yahonews7.com</p>
      <p>電話番号: +852-51027376</p>
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
      default: "ja"
    },
    channelId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      input: "",
      eulaText: {
        en: "Terms of Service",
        ja: "利用規約",
        ko: "서비스 약관",
        zh_TW: "服務條款",
        de: "Nutzungsbedingungen",
        pt: "Termos de Serviço", // 葡萄牙语
        es: "Términos de Servicio", // 西班牙语
        fr: "Conditions d'utilisation", // 法语
        th: "ข้อกำหนดการให้บริการ", // 泰语
        id: "Ketentuan Layanan" // 印度尼西亚语
      },
      privacyText: {
        en: "Privacy Policy",
        ja: "プライバシーポリシー",
        ko: "개인 정보 정책",
        zh_TW: "隱私政策",
        de: "Datenschutzrichtlinie",
        pt: "Política de Privacidade", // 葡萄牙语
        es: "Política de Privacidad", // 西班牙语
        fr: "Politique de Confidentialité", // 法语
        th: "นโยบายความเป็นส่วนตัว", // 泰语
        id: "Kebijakan Privasi" // 印度尼西亚语
      },
      cookiesText: {
        en: "Cookies Policy",
        ja: "クッキーポリシー",
        ko: "쿠키 정책",
        zh_TW: "Cookie 政策",
        de: "Cookie-Richtlinie",
        pt: "Política de Cookies", // 葡萄牙语
        es: "Política de Cookies", // 西班牙语
        fr: "Politique de Cookies", // 法语
        th: "นโยบายคุกกี้", // 泰语
        id: "Kebijakan Cookie" // 印度尼西亚语
      },
      contactText: {
        en: "Contact",
        ja: "お問い合わせ",
        ko: "연락하다",
        zh_TW: "聯絡",
        de: "Kontakt",
        pt: "Contato", // 葡萄牙语
        es: "Contacto", // 西班牙语
        fr: "Contact", // 法语
        th: "ติดต่อ", // 泰语
        id: "Kontak" // 印度尼西亚语
      },
      copyRightText1: {
        en: "Copyright",
        ja: "著作権",
        ko: "모든 권리 보유",
        zh_TW: "Copyright",
        de: "Urheberrecht",
        pt: "Direitos Autorais", // 葡萄牙语
        es: "Derechos de Autor", // 西班牙语
        fr: "Droits d'Auteur", // 法语
        th: "ลิขสิทธิ์", // 泰语
        id: "Hak Cipta" // 印度尼西亚语
      },
      copyRightText2: {
        en: "All rights reserved",
        ja: "無断複写・転載を禁じます",
        ko: "저작권",
        zh_TW: "All rights reserved",
        de: "Alle Rechte vorbehalten",
        pt: "Todos os direitos reservados", // 葡萄牙语
        es: "Todos los derechos reservados", // 西班牙语
        fr: "Tous droits réservés", // 法语
        th: "สงวนลิขสิทธิ์", // 泰语
        id: "Semua hak dilindungi" // 印度尼西亚语
      }
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
          message: "ご登録ありがとうございます！",
          type: "success"
        });
      } else {
        this.$globalMethod.showNotification({
          message: "有効なメールアドレスを入力してください",
          type: "warning"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.footer {
  position: relative;
  margin-top: 32px;
}
.special-info {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding-bottom: 1em;
  p {
    margin-right: 2em;
    line-height: 1.5;
  }
}
.subscription {
  display: flex;
  justify-content: space-between;
  flex-flow: row-reverse;
  padding-top: 32px;
  padding-bottom: 16px;
}
.introduction {
  color: $font1;
  line-height: 19px;
  a {
    font-family: "hem";
    color: $font1;
  }
}
.subscription-content {
  min-width: 390px;
  margin-left: 40px;
  .text {
    color: $font1;
    font-family: "hem";
    font-size: 20px;
    line-height: 20px;
    margin-bottom: 16px;
  }
  .box-submit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    background: #f5f5f5;
    border-radius: 8px;
  }
  .email {
    width: 240px;
    padding-left: 16px;
    color: $font1;
    font-family: "hem";
    &::placeholder {
      font-family: "her";
      color: rgba($font1, 0.4);
    }
  }
  .submit {
    width: 122px;
    height: 40px;
    background: $color1;
    border-radius: 8px;
    @include center;
    font-size: 16px;
    color: #fff;
    font-family: "hem";
    cursor: pointer;
  }
}
.copyright-content-1 {
  display: flex;
  flex-wrap: nowrap;
}
.copyright {
  display: flex;
  align-items: center;
  height: 56px;
  position: relative;
  z-index: 1;
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100vw;
    height: 100%;
    background: #f1f1f1;
    z-index: -1;
  }
  .copyright-content {
    width: 100%;
    height: 56px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: $font1;
    a {
      color: $font1;
      flex-shrink: 0;
      white-space: nowrap;
      &::after {
        content: "|";
        margin-left: 9px;
        margin-right: 9px;
        opacity: 0.4;
      }
      &:last-child {
        &::after {
          content: "";
        }
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .footer {
    margin-top: vw(32);
    &.sm {
      transform: scale(0.85);
    }
  }
  .special-info {
    font-size: vw(24);
  }
  .subscription {
    display: block;
    padding-top: 0;
    padding-bottom: vw(16);
  }
  .introduction {
    color: rgba($font1, 0.6);
    font-size: vw(24);
    line-height: vw(32);
    margin-top: vw(32);
  }
  .subscription-content {
    min-width: 100%;
    margin-left: 0;
    .text {
      font-size: vw(28);
      line-height: vw(38);
      margin-bottom: vw(16);
    }
    .box-submit {
      display: block;
      height: auto;
      background: none;
    }
    .email {
      width: 100%;
      padding-left: vw(16);
      font-size: vw(24);
      height: vw(80);
      background: #f1f1f1;
      border-radius: vw(16);
      margin-bottom: vw(16);
    }
    .submit {
      width: vw(208);
      height: vw(80);
      border-radius: vw(16);
      font-size: vw(28);
    }
  }
  .copyright {
    height: auto;
    padding-bottom: vw(32);
    &:before {
      display: none;
    }
    .copyright-content {
      height: auto;
      flex-direction: column;
      font-size: vw(21);
      line-height: vw(48);
      a {
        &::after {
          margin-left: vw(8);
          margin-right: vw(8);
        }
      }
    }
  }
}
</style>
