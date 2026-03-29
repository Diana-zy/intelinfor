/**
 * Web Vitals性能监控插件
 * 监控Core Web Vitals指标并上报到分析服务
 */

export default (ctx) => {
  if (process.client && typeof window !== 'undefined') {
    // 动态导入web-vitals库（只在客户端加载）
    Promise.all([
      import('web-vitals').then(module => {
        const {
          getCLS,
          getFID,
          getFCP,
          getLCP,
          getTTFB,
          getCFT,
          getINP
        } = module;

        // 性能指标收集器
        const vitals = {};

        // 累积布局移动 (CLS)
        getCLS(metric => {
          vitals.CLS = metric.value;
          vitals.CLSRating = metric.rating;
          logVital('CLS', metric);
        });

        // 首次输入延迟 (FID)
        if (getFID) {
          getFID(metric => {
            vitals.FID = metric.value;
            vitals.FIDRating = metric.rating;
            logVital('FID', metric);
          });
        }

        // 下一次交互延迟 (INP)
        if (getINP) {
          getINP(metric => {
            vitals.INP = metric.value;
            vitals.INPRating = metric.rating;
            logVital('INP', metric);
          });
        }

        // 首次内容绘制 (FCP)
        getFCP(metric => {
          vitals.FCP = metric.value;
          vitals.FCPRating = metric.rating;
          logVital('FCP', metric);
        });

        // 最大内容绘制 (LCP)
        getLCP(metric => {
          vitals.LCP = metric.value;
          vitals.LCPRating = metric.rating;
          logVital('LCP', metric);
        });

        // 首字节时间 (TTFB)
        getTTFB(metric => {
          vitals.TTFB = metric.value;
          vitals.TTFBRating = metric.rating;
          logVital('TTFB', metric);
        });

        // 累积首次输入延迟 (CFT)
        if (getCFT) {
          getCFT(metric => {
            vitals.CFT = metric.value;
            logVital('CFT', metric);
          });
        }

        // 保存到window对象以供外部访问
        if (typeof window !== 'undefined') {
          window.__VITALS__ = vitals;
        }

        // 监控性能指标的函数
        function logVital(name, metric) {
          const roundedValue = Math.round(metric.value * 100) / 100;
          const rating = metric.rating || 'unknown';

          // 输出到控制台（开发环境）
          if (process.env.NODE_ENV === 'development') {
            console.log(
              `%c${name}: ${roundedValue}ms (${rating})`,
              `color: ${getRatingColor(rating)}; font-weight: bold;`
            );
          }

          // 上报到分析服务（如果配置）
          reportVital(name, roundedValue, rating, metric);
        }

        function getRatingColor(rating) {
          switch (rating) {
            case 'good':
              return '#05B344'; // 绿色
            case 'needs-improvement':
              return '#FA7B10'; // 橙色
            case 'poor':
              return '#FA4649'; // 红色
            default:
              return '#666'; // 灰色
          }
        }

        // 上报性能数据到分析服务
        function reportVital(name, value, rating, metric) {
          // 如果页面有Google Analytics
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'web_vital', {
              metric_name: name,
              metric_value: value,
              metric_rating: rating,
              metric_delta: metric.delta,
              metric_id: metric.id
            });
          }

          // 如果有自定义的上报端点
          if (process.env.VITALS_ENDPOINT) {
            // 使用sendBeacon确保数据上报成功
            const data = JSON.stringify({
              name,
              value,
              rating,
              url: window.location.href,
              timestamp: new Date().toISOString()
            });
            navigator.sendBeacon(process.env.VITALS_ENDPOINT, data);
          }

          // 输出告警（如果指标不良）
          if (rating === 'poor') {
            console.warn(`⚠️ ${name}指标表现不良: ${value}ms`);
          }
        }
      })
    ]).catch(err => {
      console.warn('Web Vitals库加载失败:', err);
    });

    // 监控长任务 (Long Tasks)
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.warn(`长任务检测: ${Math.round(entry.duration)}ms`, entry);
          }
        });
        observer.observe({ entryTypes: ['longtask'] });
        // 保存observer引用以防内存泄漏
        window.__longTaskObserver = observer;
      } catch (e) {
        // 某些浏览器可能不支持longtask监控
        console.debug('Long Tasks监控不支持');
      }
    }

    // 监控首次加载时间
    if (window.performance && window.performance.timing) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const timing = window.performance.timing;
          const navigationStart = timing.navigationStart;
          const pageLoadTime = timing.loadEventEnd - navigationStart;

          console.log(`📊 页面加载总时间: ${pageLoadTime}ms`);
          console.log(`  - 可交互时间(TTI): ${timing.domInteractive - navigationStart}ms`);
          console.log(`  - DOM解析: ${timing.domLoading - navigationStart}ms`);
          console.log(`  - 资源加载: ${timing.loadEventStart - navigationStart}ms`);

          // 上报到Google Analytics
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'page_load_time', {
              load_time: Math.round(pageLoadTime),
              tti: Math.round(timing.domInteractive - navigationStart)
            });
          }
        }, 0);
      });
    }

    // 内存监控 (仅Chrome)
    if (performance && performance.memory) {
      setInterval(() => {
        const memory = performance.memory;
        const usedJSHeapSize = Math.round(memory.usedJSHeapSize / 1048576); // 转换为MB
        const totalJSHeapSize = Math.round(memory.totalJSHeapSize / 1048576);

        if (usedJSHeapSize > 100) {
          console.warn(`⚠️ 内存使用过高: ${usedJSHeapSize}MB / ${totalJSHeapSize}MB`);
        }
      }, 10000); // 每10秒检查一次
    }
  }
};
