/**
 * 作者数据配置（按站点分组）
 *
 * 临时方案：因 /api/article/seo/getAuthor 接口未对外暴露，数据在此硬编码。
 * 待后端将接口暴露到外网后，删除此文件中的 name/avatar/intro 字段，
 * 改回 pages/author/_author.vue 中的 API 调用方式。
 * 详见 CLAUDE.md 待办事项。
 */

export const authorData = {
  // ===== intelinfor 站点 =====
  3: {
    name: "鈴木 美和",
    avatar: "https://bunchthings.com/tag/undefined/1767771646500.webp",
    avatar_seo_alt: "鈴木 美和",
    intro:
      "鈴木 美和大切な家族がこれからも健やかに、安心して毎日を過ごすための「備え」を研究しています。保険の難しい話を、家族に相談するような親しみやすい言葉で、一つひとつ丁寧にお伝えしていきます。",
    linkedin: "https://www.linkedin.com/in/%E7%BE%8E%E5%92%8C-%E9%88%B4%E6%9C%A8-507967415/"
  },
  5: {
    name: "高橋 恒一郎",
    avatar: "https://bunchthings.com/tag/undefined/1767771742970.webp",
    avatar_seo_alt: "高橋 恒一郎",
    intro:
      "高橋 恒一郎組織での経験を活かし、定年後の働き方や社会との繋がり方について提案しています。人生の後半戦をいかに豊かに、自分らしく歩んでいくか。新しい一歩を後押しするような情報を発信していきます。",
    linkedin: ""
  },

  // ===== 美国站点 =====
  7: {
    name: "Alice Knisley Matthias",
    avatar: "https://bunchthings.com/common/1767512645407.png",
    avatar_seo_alt: "Alice Knisley Matthias",
    intro: "",
    linkedin: "https://www.linkedin.com/in/alice-knisley-matthias-169033416/"
  },
  8: {
    name: "Amanda Capritto",
    avatar: "",
    avatar_seo_alt: "Amanda Capritto",
    intro: "",
    linkedin: "https://www.linkedin.com/in/amanda-capritto-a61039416/"
  },
  10: {
    name: "Ryan Smith",
    avatar: "",
    avatar_seo_alt: "Ryan Smith",
    intro: "",
    linkedin: ""
  },
  11: {
    name: "Dr. Lindsay Malzone",
    avatar: "",
    avatar_seo_alt: "Dr. Lindsay Malzone",
    intro: "",
    linkedin: ""
  }
};
