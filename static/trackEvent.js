/* eslint-disable no-unused-vars */
/* eslint-disable no-sequences */
/* eslint-disable prefer-const */
/* eslint-disable one-var */
/* eslint-disable no-var */
/* eslint-disable no-unused-expressions */
function getParam(queryKey) {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.has(queryKey) ? searchParams.get(queryKey).trim() : "";
  } catch (c) {
    return "";
  }
}
const initPixels = {
  tiktok: function (b) {
    !(function (w, d, t) {
      w.TiktokAnalyticsObject = t;
      var ttq = (w[t] = w[t] || []);
      (ttq.methods = [
        "page",
        "track",
        "identify",
        "instances",
        "debug",
        "on",
        "off",
        "once",
        "ready",
        "alias",
        "group",
        "enableCookie",
        "disableCookie",
        "holdConsent",
        "revokeConsent",
        "grantConsent"
      ]),
        (ttq.setAndDefer = function (t, e) {
          t[e] = function () {
            t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
          };
        });
      for (let i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
      (ttq.instance = function (t) {
        for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++)
          ttq.setAndDefer(e, ttq.methods[n]);
        return e;
      }),
        (ttq.load = function (e, n) {
          let r = "https://analytics.tiktok.com/i18n/pixel/events.js",
            o = n && n.partner;
          (ttq._i = ttq._i || {}),
            (ttq._i[e] = []),
            (ttq._i[e]._u = r),
            (ttq._t = ttq._t || {}),
            (ttq._t[e] = +new Date()),
            (ttq._o = ttq._o || {}),
            (ttq._o[e] = n || {});
          n = document.createElement("script");
          (n.type = "text/javascript"), (n.async = !0), (n.src = r + "?sdkid=" + e + "&lib=" + t);
          e = document.getElementsByTagName("script")[0];
          e.parentNode.insertBefore(n, e);
        });

      ttq.load(b);
      if (w.location.pathname.startsWith("/detail")) {
        ttq.page();
      }
    })(window, document, "ttq");
  },
  taboola: function (pixelId) {
    window._tfa = window._tfa || [];
    window._tfa.push({
      notify: "event",
      name: "page_view",
      id: pixelId
    });
    !(function (t, f, a, x) {
      if (!document.getElementById(x)) {
        t.async = 1;
        t.src = a;
        t.id = x;
        f.parentNode.insertBefore(t, f);
      }
    })(
      document.createElement("script"),
      document.getElementsByTagName("script")[0],
      `//cdn.taboola.com/libtrc/unip/${pixelId}/tfa.js`,
      "tb_tfa_script"
    );
  }
};

(function () {
  const source = getParam("hi_source"),
    pixelId = getParam("hi_pc");
  if (source && initPixels[source]) initPixels[source](pixelId);
})();

function trackEventToPixel(eventKey) {
  const eventNameObj = {
    // 触发词条
    D_C_AC: {
      taboola: "lead",
      tiktok: "Lead"
    },
    // 点击词条
    T_AC_MSG: {
      taboola: "add_to_wishlist",
      tiktok: "AddToWishlist"
    },
    // 请求广告
    Q_AR: {
      taboola: "view_content",
      tiktok: "ViewContent"
    },
    // 触发广告
    C_AR: {
      taboola: "start_checkout",
      tiktok: "Download"
    },
    // 点击广告
    T_AR: {
      taboola: "make_purchase",
      tiktok: "Purchase"
    },
    // 点击广告2
    T_AR_2: {
      taboola: "",
      tiktok: "ClickButton"
    }
  };

  const source = getParam("hi_source"),
    pixelId = getParam("hi_pc"),
    eventName = eventNameObj[eventKey][source];
  if (source && pixelId && eventName) {
    if (source === "taboola") {
      window._tfa.push({ notify: "event", name: eventName, id: pixelId });
    } else if (source === "tiktok") {
      window.ttq?.track?.(eventName);
    }
  }
}

// 封装构建URL的公用函数
function getResultsPageUrl(queryParams) {
  let url = `${window.location.origin}/search/?afs`;
  for (const [key, value] of Object.entries(queryParams)) {
    if (value) {
      url += `&${key}=${value}`;
    }
  }
  return url;
}
