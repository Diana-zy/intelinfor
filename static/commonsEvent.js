function getMainDomain() {
  const url = window.location.hostname;
  const parts = url.split(".");
  if (parts.length > 2) {
    return parts.slice(-2).join(".");
  }
  return url;
}

function setCookie(name, value, daysToExpire = 1) {
  const date = new Date();
  date.setTime(date.getTime() + daysToExpire * 24 * 60 * 60 * 1000);
  const expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + (value || "") + expires + "; path=/; domain=" + getMainDomain();
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function setSessionStorageItem(key, value) {
  try {
    const serializedValue = JSON.stringify(value);
    sessionStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error("Error setting item in sessionStorage", error);
  }
}

function getSessionStorageItem(key) {
  try {
    const serializedValue = sessionStorage.getItem(key);
    return serializedValue ? JSON.parse(serializedValue) : null;
  } catch (error) {
    console.error("Error getting item from sessionStorage", error);
    return null;
  }
}

function removeSessionStorageItem(key) {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing item from sessionStorage", error);
  }
}

// eslint-disable-next-line no-unused-vars
function getDetailIsClickAc() {
  const cipherData = getCookie("hi_act_chain");
  if (cipherData) {
    const decoded = JSON.parse(atob(cipherData));
    if (Date.now() - decoded.timestamp < 3600000) {
      return true;
    }
  }
  return false;
}

window.addEventListener("blur", () => {
  const activeElement = document.activeElement;
  const src = activeElement.getAttribute("src");
  if (src && src.includes("afs/ads?")) {
    if (!activeElement.getAttribute("title") && location.pathname.startsWith("/detail")) {
      const cipherText = btoa(
        JSON.stringify({
          timestamp: Date.now()
        })
      );
      setCookie("hi_act_chain", cipherText);
    }
  }
});

function getOutbrainSiteId() {
  const searchParams = new URLSearchParams(window.location.search);
  const source = searchParams.get("hi_source"); // 渠道
  const campaignId = searchParams.get("campaign_id"); // 渠道的广告id
  const siteId = searchParams.get("site_id"); // 渠道的子渠道id
  const siteName = searchParams.get("site_name"); // 渠道的子渠道name
  if (source === "outbrain" && siteId) {
    const outbrainSiteData = {
      ob_campaign: campaignId || "unknown",
      ob_site: siteId || "unknown",
      ob_sitename: siteName || "unknown"
    };
    setSessionStorageItem("outbrainSiteData", outbrainSiteData);

    window.dataLayer.push({
      event: "Page_View_Site",
      ob_campaign: campaignId || "unknown",
      ob_site: siteId || "unknown",
      ob_sitename: siteName || "unknown",
      hi_ip: window.youknowwho_ip || "unknown",
      hi_country: window.youknowwho_ip_country || "unknown",
      hi_language: navigator.languages.join("|") || navigator.language || "unknown"
    });
  } 
  // 链接未携带site_id参数，则取sessionStorage中保存的site_id参数
  else if (source === "outbrain" && !siteId && getSessionStorageItem("outbrainSiteData")) {
    const outbrainSiteData = getSessionStorageItem("outbrainSiteData");
    window.dataLayer.push({
      event: "Page_View_Site",
      ob_campaign: outbrainSiteData.ob_campaign,
      ob_site: outbrainSiteData.ob_site,
      ob_sitename: outbrainSiteData.ob_sitename,
      hi_ip: window.youknowwho_ip || "unknown",
      hi_country: window.youknowwho_ip_country || "unknown",
      hi_language: navigator.languages.join("|") || navigator.language || "unknown"
    });
  }
}

// eslint-disable-next-line no-unused-vars
function pushEventParamsToGtm(eventName) {
  const searchParams = new URLSearchParams(window.location.search);
  const ttclid = searchParams.get("ttclid");
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    hi_country: window.youknowwho_ip_country || "unknown",
    hi_ip: window.youknowwho_ip || "unknown",
    hi_ttclid: ttclid || window.getCookie("hi_ttclid") || "unknown"
  });
}
