import TerserPlugin from "terser-webpack-plugin";
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";

export default {
  target: "static",
  ssr: true,
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
    trailingSlash: true,
    extendRoutes(routes, resolve) {
      routes.push({
        name: "category-detail",
        path: "/:category/:detail",
        component: resolve(__dirname, "pages/detail/_detail.vue")
      });
    }
  },
  head: {
    title: "高齢者ライフ | シニアの経済と暮らしを支える情報サイト",
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
          "老後のお金や暮らしの不安を解消！保険、年金、相続の最新情報を専門家が解説します。"
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
          "老後のお金や暮らしの不安を解消！保険、年金、相続の最新情報を専門家が解説します。後悔しないための準備を今すぐ始めましょう。"
      }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "preload",
        as: "font",
        href: "/fonts/heb.woff2",
        type: "font/woff2",
        crossorigin: true
      }
    ],
    noscript: [{ innerHTML: "This site requires JavaScript to be enabled." }]
  },
  image: {
    provider: "cloudflare",
    cloudflare: {
      baseURL: "https://bunchthings.com"
    },
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    }
  },
  plugins: [
    { src: "~/plugins/vue-infinite-scroll", ssr: false },
    "~/plugins/axios",
    "~/plugins/global-data",
    "~/plugins/nav-data",
    { src: "~/plugins/web-vitals", ssr: false }
  ],
  components: true,
  buildModules: [
    "@nuxtjs/style-resources",
    "@nuxt/image",
    "@nuxtjs/pwa",
    "@nuxtjs/google-fonts"
  ],
  css: ["@/assets/css/fonts.css", "@/assets/css/reset.css", "@/assets/css/common.scss"],
  styleResources: {
    scss: ["~/assets/css/_mixins.scss"]
  },
  modules: ["@nuxtjs/axios"],
  hooks: {
    "generate:done"(generator) {
      const nodePath = require("path");
      const fs = require("fs");
      const hostname = "https://intelinfor.com";
      const today = new Date().toISOString().split("T")[0];
      const routes = [...generator.generatedRoutes].filter(
        (r) => r && typeof r === "string" && !r.includes(":")
      );
      const urlEntries = routes
        .map(
          (r) =>
            `  <url>\n    <loc>${hostname}${r}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`
        )
        .join("\n");
      const xml =
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        urlEntries +
        `\n</urlset>`;
      const outputPath = nodePath.join(generator.options.generate.dir, "sitemap.xml");
      fs.writeFileSync(outputPath, xml, "utf8");
    }
  },
  pwa: {
    manifest: {
      name: "Intelinfor",
      short_name: "Intelinfor",
      description:
        "We are committed to delivering you the latest developments in various fields, including politics, economy, technology, culture, sports, and more.!",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#000000"
    },
    icon: {
      source: "./static/icon.png",
      fileName: "icon.png",
      sizes: [32, 64, 120, 144, 152, 192, 512]
    },
    workbox: {
      runtimeCaching: [
        {
          urlPattern: "^https://bunchthings.com/.*",
          handler: "CacheFirst",
          method: "GET",
          strategyOptions: {
            cacheName: "images-cache",
            cacheExpiration: {
              maxEntries: 100,
              maxAgeSeconds: 2592000
            }
          }
        },
        {
          urlPattern: "^https://api\\.tapmygame\\.com/.*",
          handler: "NetworkFirst",
          method: "GET",
          strategyOptions: {
            cacheName: "api-cache",
            cacheExpiration: {
              maxEntries: 50,
              maxAgeSeconds: 3600
            }
          }
        }
      ]
    }
  },
  build: {
    parallel: true,
    cache: true,
    html: {
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    },
    extractCSS: {
      ignoreOrder: true
    },
    optimization: {
      runtimeChunk: "single",
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
            priority: 20
          },
          vue: {
            test: /[\\/]node_modules[\\/](vue|nuxt)[\\/]/,
            name: "vue",
            priority: 21,
            chunks: "all"
          },
          styles: {
            name: "styles",
            test: /\.(css|vue)$/,
            chunks: "all",
            enforce: true
          },
          common: {
            minChunks: 2,
            priority: 10,
            reuseExistingChunk: true
          }
        }
      },
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true
            },
            output: {
              comments: false
            },
            ecma: 6
          },
          extractComments: false
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            map: { inline: false },
            discardComments: { removeAll: true }
          }
        })
      ]
    },
    analyze: {
      analyzerMode: "disabled",
      generateStatsFile: false
    }
  },
  purgeCSS: {
    whitelistPatterns: [/^swiper-container/, /^swiper-wrapper/, /^nuxt/]
  },
  loading: {
    color: "#3B8070",
    height: "2px"
  },
  telemetry: false
};
