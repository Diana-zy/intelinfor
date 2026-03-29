import TerserPlugin from "terser-webpack-plugin";
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";

export default {
  target: "static",
  server: {
    host: "0.0.0.0"
  },
  env: {
    SITE_ID: process.env.SITE_ID
  },
  generate: {
    crawler: false,
    concurrency: 1,
    interval: 2000,
    async routes() {
      try {
        const pathData = await fetch(
          `${process.env.PROD_API_URL}/api/article/get_all_path_v2?site_id=${process.env.SITE_ID}`,
          { timeout: 5000 }
        );
        const path = await pathData.json();
        const categoryPaths = path.data.seo_category.map((item) => `/category/${item}/`);
        const detailPaths = path.data.detail.map((item) => `/${item}/`);
        const urls = [...categoryPaths, ...detailPaths];
        return urls;
      } catch (error) {
        // Fallback: Skip dynamic routes during static generation if API unavailable
        console.warn("API fetch failed, using root-only routes for testing:", error.message);
        return [];
      }
    }
  },
  axios: {
    baseURL:
      process.env.NODE_ENV === "production" ? process.env.PROD_API_URL : process.env.TEST_API_URL
  },
  router: {
    trailingSlash: true
  },
  head: {
    title: "Intelinfor - world news in the palm of your hand!",
    meta: [
      {
        name: "version",
        content: process.env.APP_VERSION || "1.0"
      },
      {
        name: "viewport",
        content:
          "width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,minimal-ui"
      },
      {
        name: "apple-mobile-web-app-capable",
        content: "yes"
      },
      {
        name: "mobile-web-app-capable",
        content: "yes"
      },
      {
        hid: "description",
        name: "description",
        content:
          "We are committed to delivering the latest developments in various fields such as politics, economy, technology, culture and sports!"
      },
      {
        hid: "keywords",
        name: "keywords",
        content: "Frontier news, news IT K news, sports news, fashion news, car news, health news"
      },
      {
        hid: "og:site_name",
        property: "og:site_name",
        content: "Intelinfor"
      },
      {
        property: "twitter:site_name",
        content: "Intelinfor"
      },
      {
        hid: "twitter:description",
        name: "twitter:description",
        content:
          "We are committed to delivering the latest developments in various fields such as politics, economy, technology, culture and sports!"
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  image: {
    provider: "cloudflare",
    cloudflare: {
      baseURL: "https://bunchthings.com"
    }
  },
  plugins: [
    { src: "~/plugins/vue-infinite-scroll", ssr: false },
    "~/plugins/axios",
    "~/plugins/global-data",
    "~/plugins/nav-data"
  ],
  components: true,
  buildModules: ["@nuxtjs/style-resources", "@nuxt/image", "@nuxtjs/pwa", "@nuxtjs/sitemap"],
  css: ["@/assets/css/fonts.css", "@/assets/css/reset.css", "@/assets/css/common.scss"],
  styleResources: {
    scss: ["~/assets/css/_mixins.scss"]
  },
  modules: ["@nuxtjs/axios"],
  sitemap: {
    hostname: "https://intelinfor.com/"
  },
  pwa: {
    manifest: {
      name: "Intelinfor",
      short_name: "Intelinfor",
      description:
        "We are committed to delivering you the latest developments in various fields, including politics, economy, technology, culture, sports, and more.!"
    },
    icon: {
      source: "./static/icon.png", // 应用图标路径
      fileName: "icon.png", // 生成的图标名称
      sizes: [32, 64, 120, 144, 152, 192, 512] // 自定义生成的图标尺寸
    }
  },
  build: {
    html: {
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    },
    extractCSS: {
      ignoreOrder: true
    },
    optimization: {
      splitChunks: {
        chunks: "all",
        automaticNameDelimiter: ".",
        name: true,
        minSize: 10000,
        maxSize: 244000,
        cacheGroups: {
          vendor: {
            name: "vendors",
            test: /[\\/]node_modules[\\/]/,
            chunks: "all",
            maxSize: 244000,
            priority: -10
          },
          styles: {
            name: "styles",
            test: /\.(css|vue)$/,
            chunks: "all",
            enforce: true
          }
        }
      },
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true
            },
            output: {
              comments: false
            }
          }
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            map: { inline: false },
            discardComments: { removeAll: true }
          }
        })
      ]
    }
  },
  purgeCSS: {
    whitelistPatterns: [/^swiper-container/, /^swiper-wrapper/] // 忽略swiper样式
  }
};
