/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
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
