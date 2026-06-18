/**
 * 作者数据配置（按站点分组）
 *
 * 临时方案：因 /api/article/seo/getAuthor 接口未对外暴露，数据在此硬编码。
 * 待后端将接口暴露到外网后，删除此文件中的 name/avatar/intro 字段，
 * 改回 pages/author/_author.vue 中的 API 调用方式。
 * 详见 CLAUDE.md 待办事项。
 */

/**
 * 类目 ID → 作者 ID 映射（跨站点）
 * 用于文章/类目页面没有 author 字段时的备用查询。
 */
export const categoryAuthorMap = {
  // ===== intelinfor =====
  23: 3, // 年金・老後資金 → 鈴木 美和
  24: 3, // 相続・終活 → 鈴木 美和
  25: 3, // 保険 → 鈴木 美和
  26: 5, // 介護・高齢者支援 → 高橋 恒一郎
  27: 5, // 健康・暮らし → 高橋 恒一郎
  28: 5, // シニアの仕事 → 高橋 恒一郎

  // ===== seniorsbetter =====
  12: 10, // Medicare & Senior Benefits → Ryan Smith
  13: 10, // Senior Discounts & Savings → Ryan Smith
  14: 11, // Senior Health & Wellness → Dr. Lindsay Malzone
  15: 10, // Retirement Income & Planning → Ryan Smith
  16: 11, // Aging in Place & Long-Term Care → Dr. Lindsay Malzone

  // ===== hacksforhome =====
  7: 9,  // Pest Control → Barbara Bellesi Zito
  8: 12, // Outdoor Living → Jenny Clark
  9: 12, // Car Care & Maintenance → Jenny Clark
  10: 12, // Gardening & Lawn Care → Jenny Clark
  11: 9, // Housekeeping & Cleaning → Barbara Bellesi Zito

  // ===== worldoinfo =====
  17: 7,  // AI Wearables → Alice Knisley Matthias
  18: 8,  // AI Smart Home → Amanda Capritto
  19: 8,  // AI Companions & Toys → Amanda Capritto
  20: 7,  // AI Productivity → Alice Knisley Matthias
  21: 7,  // Buying Guides & Safety → Alice Knisley Matthias
  22: 8   // AI for Everyday Life → Amanda Capritto
};

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
    linkedin: "https://www.linkedin.com/in/ryan-smith-239827417/"
  },
  11: {
    name: "Dr. Lindsay Malzone",
    avatar: "",
    avatar_seo_alt: "Dr. Lindsay Malzone",
    intro: "",
    linkedin: "https://www.linkedin.com/in/dr-lindsay-malzone-818910417/"
  },

  // ===== hacksforhome 站点 =====
  9: {
    name: "Barbara Bellesi Zito",
    avatar: "",
    avatar_seo_alt: "Barbara Bellesi Zito",
    intro: "",
    linkedin: ""
  },
  12: {
    name: "Jenny Clark",
    avatar: "",
    avatar_seo_alt: "Jenny Clark",
    intro: "",
    linkedin: "https://www.linkedin.com/in/jenny-clark-84991b417/"
  }
};
