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
    console.log("init taboola pixel:", pixelId);
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
      `tb_tfa_script_${pixelId}`
    );
  },
  outbrain: function (pixelId) {
    /** DO NOT MODIFY THIS CODE**/
    !(function (_window, _document) {
      var OB_ADV_ID = pixelId;
      if (_window.obApi) {
        var toArray = function (object) {
          return Object.prototype.toString.call(object) === "[object Array]" ? object : [object];
        };
        _window.obApi.marketerId = toArray(_window.obApi.marketerId).concat(toArray(OB_ADV_ID));
        return;
      }
      var api = (_window.obApi = function () {
        api.dispatch ? api.dispatch.apply(api, arguments) : api.queue.push(arguments);
      });
      api.version = "1.1";
      api.loaded = true;
      api.marketerId = OB_ADV_ID;
      api.queue = [];
      var tag = _document.createElement("script");
      tag.async = true;
      tag.src = "//amplify.outbrain.com/cp/obtp.js";
      tag.type = "text/javascript";
      var script = _document.getElementsByTagName("script")[0];
      script.parentNode.insertBefore(tag, script);
    })(window, document);

    if (window.location.pathname.startsWith("/detail")) {
      window.obApi("track", "PAGE_VIEW");
    }
  },
  facebook: function (pixelId) {
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", pixelId);
    window.fbq("track", "PageView");
  }
};

(function () {
  const channelId = getParam("channel");
  const channelFilterArr = ["5373731044", "3936510380"];

  const source = getParam("hi_source");
  let pixelId = getParam("hi_pc");
  // 如果渠道为tiktok，则使用固定fafeed的pixelId
  if (source === "tiktok") {
    pixelId = "D0FCRBRC77U0DNP5P7HG";
  }
  // 如果渠道为taboola，则同步初始化tiktok（intelinfor自身的pixelId）和outbrain像素
  // if (source === "taboola") {
  //   initPixels.tiktok("D20SUKBC77U6OAPOSJUG");
  //   initPixels.outbrain("005abb05c321e7c2a3cced47f0e2e7efe6");
  // }
  // 如果渠道为outbrain，则同步初始化tiktok（intelinfor自身的pixelId）和taboola新账户（BVSIor - Smsinfor - RSOC - SC）像素和facebook
  if (source === "outbrain") {
    initPixels.tiktok("D20SUKBC77U6OAPOSJUG");
    initPixels.taboola("1920852");
    initPixels.taboola("1934078");
    // initPixels.facebook("1875563969657075");
    // 如果渠道为outbrain且channelId符合要求，则同步初始化outbrain账户2的像素
    if (channelId && channelFilterArr.includes(channelId)) {
      pixelId !== "00e782a5a22314cf4f685590099163011b" &&
        initPixels.outbrain("00e782a5a22314cf4f685590099163011b");
      pixelId !== "00519bec6e0d4630b1d1fd83cbf79ffd3a" &&
        initPixels.outbrain("00519bec6e0d4630b1d1fd83cbf79ffd3a");
      pixelId !== "008ed880efbdc725aa027160a7991f406e" &&
        initPixels.outbrain("008ed880efbdc725aa027160a7991f406e");
    }
  }
  if (source && initPixels[source]) initPixels[source](pixelId);
})();

function trackEventToPixel(eventKey) {
  const eventNameObj = {
    // 触发词条
    D_C_AC: {
      taboola: "lead",
      tiktok: "Lead",
      outbrain: "Lead",
      facebook: "Lead"
    },
    // 点击词条
    T_AC_MSG: {
      taboola: "add_to_wishlist",
      tiktok: "AddToWishlist",
      outbrain: "Add to cart",
      facebook: "AddToWishlist"
    },
    // 请求广告
    Q_AR: {
      taboola: "view_content",
      tiktok: "ViewContent",
      outbrain: "Content view",
      facebook: "ViewContent"
    },
    // 触发广告
    C_AR: {
      taboola: "start_checkout",
      tiktok: "Download",
      outbrain: "Download",
      facebook: "InitiateCheckout"
    },
    // 点击广告
    T_AR: {
      taboola: "make_purchase",
      tiktok: "Purchase",
      outbrain: "Registration",
      facebook: "Purchase"
    }
  };

  const source = getParam("hi_source"),
    eventName = eventNameObj[eventKey][source];
  let pixelId = getParam("hi_pc");
  if (source === "tiktok") {
    pixelId = "D0FCRBRC77U0DNP5P7HG";
  }
  if (source && pixelId && eventName) {
    if (source === "taboola") {
      if (pixelId === "1900126" && eventName === "make_purchase") {
        window._tfa.push({
          notify: "event",
          name: eventName,
          id: pixelId,
          revenue: window.purchaseValue || 0.3
        });

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "Push_Tb_Purchase_Revenue",
          apiRevenue: window.purchaseValue || "unknown",
          actualRevenue: window.purchaseValue || 0.3
        });
      } else {
        window._tfa.push({ notify: "event", name: eventName, id: pixelId });
      }
    } else if (source === "tiktok") {
      window.ttq?.track?.(eventName);
      if (eventName === "Purchase") {
        window.ttq?.track?.("InitiateCheckout");
      }
    } else if (source === "outbrain") {
      window.obApi?.("track", eventName);
      // 如果渠道为outbrain，则同步推送事件给tiktok和taboola
      window.ttq?.track?.(eventNameObj[eventKey].tiktok);
      window._tfa.push({ notify: "event", name: eventNameObj[eventKey].taboola, id: 1920852 });
      window._tfa.push({ notify: "event", name: eventNameObj[eventKey].taboola, id: 1934078 });
      // window.fbq?.("track", eventNameObj[eventKey].facebook);
    } else if (source === "facebook") {
      window.fbq?.("track", eventName);
    }
  }
}

// 封装构建URL的公用函数
function getResultsPageUrl(queryParams) {
  let url = `${window.location.origin}/search/?afs`;
  for (let [key, value] of Object.entries(queryParams)) {
    if (value) {
      url += `&${key}=${value}`;
    }
  }
  return url;
}
