/**
 * HTTP缓存策略配置
 * 用于优化静态资源和API缓存
 */

// Cloudflare缓存规则
export const cloudflareRules = [
  {
    // HTML文件：不缓存，每次检查更新
    pattern: '*.html',
    cacheControl: 'public, max-age=0, must-revalidate',
    browserCacheTTL: 0
  },
  {
    // 静态资源（JS/CSS/字体）：长期缓存
    pattern: '_nuxt/*',
    cacheControl: 'public, max-age=31536000, immutable',
    browserCacheTTL: 31536000 // 1年
  },
  {
    // 图片：长期缓存，但可能需要更新
    pattern: 'images/*',
    cacheControl: 'public, max-age=2592000, stale-while-revalidate=31536000',
    browserCacheTTL: 2592000 // 30天
  },
  {
    // 字体：非常长期的缓存
    pattern: 'fonts/*',
    cacheControl: 'public, max-age=31536000, immutable',
    browserCacheTTL: 31536000 // 1年
  },
  {
    // Service Worker：不缓存
    pattern: 'sw.js',
    cacheControl: 'public, max-age=0, must-revalidate',
    browserCacheTTL: 0
  },
  {
    // PWA manifest：可缓存但需要检查
    pattern: '*.json',
    cacheControl: 'public, max-age=3600',
    browserCacheTTL: 3600 // 1小时
  },
  {
    // API路由：不缓存
    pattern: '/api/*',
    cacheControl: 'public, max-age=0, must-revalidate',
    browserCacheTTL: 0
  }
];

// 浏览器缓存策略
export const browserCachePolicy = {
  // 短期缓存（热资源）
  shortTerm: {
    maxAge: 3600, // 1小时
    sMaxAge: 86400 // CDN 1天
  },
  // 中期缓存（重要资源）
  mediumTerm: {
    maxAge: 86400, // 1天
    sMaxAge: 604800 // CDN 1周
  },
  // 长期缓存（不经常变化）
  longTerm: {
    maxAge: 31536000, // 1年
    sMaxAge: 31536000 // CDN 1年
  }
};

// 资源预加载配置
export const preloadConfig = {
  // 关键路径资源
  critical: [
    {
      href: '/fonts/heb.woff2',
      as: 'font',
      type: 'font/woff2',
      crossorigin: true
    }
  ],
  // 高优先级资源
  high: [
    {
      href: '/_nuxt/static/manifest.js',
      as: 'script'
    }
  ],
  // DNS预查询
  dns: [
    'https://api.tapmygame.com',
    'https://bunchthings.com',
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com'
  ],
  // 预连接
  preconnect: [
    {
      href: 'https://bunchthings.com',
      crossorigin: true
    },
    {
      href: 'https://www.google-analytics.com'
    }
  ]
};

// Service Worker缓存策略
export const serviceworkerConfig = {
  // 缓存名称
  cacheName: 'intelinfor-v1',

  // 需要缓存的资源
  precache: [
    '/',
    '/index.html',
    '/_nuxt/manifest.js',
    '/favicon.ico'
  ],

  // 运行时缓存规则
  runtimeCache: [
    // 图片缓存（30天）
    {
      urlPattern: 'https://bunchthings.com/.*',
      handler: 'CacheFirst',
      options: {
        cacheName: 'images-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 2592000
        }
      }
    },
    // API缓存（1小时）
    {
      urlPattern: 'https://api.tapmygame.com/.*',
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        networkTimeoutSeconds: 5,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 3600
        }
      }
    },
    // Google Analytics（24小时）
    {
      urlPattern: 'https://www.google-analytics.com/.*',
      handler: 'NetworkFirst',
      options: {
        cacheName: 'ga-cache',
        expiration: {
          maxAgeSeconds: 86400
        }
      }
    },
    // 其他资源（缓存优先）
    {
      urlPattern: '.*',
      handler: 'CacheFirst',
      options: {
        cacheName: 'default-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 604800
        }
      }
    }
  ]
};

// 性能预算配置
export const performanceBudget = {
  // JavaScript大小限制（KB）
  js: {
    maxSize: 200,
    warning: 150
  },
  // CSS大小限制（KB）
  css: {
    maxSize: 50,
    warning: 40
  },
  // 首屏加载时间限制（秒）
  fcp: {
    maxTime: 2.5,
    warning: 1.5
  },
  // 最大内容绘制限制（秒）
  lcp: {
    maxTime: 2.5,
    warning: 1.5
  },
  // 交互延迟限制（毫秒）
  inp: {
    maxTime: 100,
    warning: 50
  },
  // 累积布局移动限制
  cls: {
    maxValue: 0.1,
    warning: 0.05
  },
  // 总加载时间限制（秒）
  loadTime: {
    maxTime: 3,
    warning: 2
  },
  // 页面大小限制（KB）
  pageSize: {
    maxSize: 5000,
    warning: 3000
  }
};

// 导出默认配置
export default {
  cloudflareRules,
  browserCachePolicy,
  preloadConfig,
  serviceworkerConfig,
  performanceBudget
};
