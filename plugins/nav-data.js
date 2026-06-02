export default async function ({ $axios, env }, inject) {
  try {
    const data = await $axios.$get("/api/article/get_all_seo_category", {
      params: {
        site_id: env.SITE_ID
      }
    });
    inject("navData", data);
  } catch (error) {
    console.error("Failed to fetch navigation data:", error);
    inject("navData", { list: [] });
  }
}
