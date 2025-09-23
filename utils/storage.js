// utils/storage.js
export default {
  /**
   * 保存数据到 localStorage
   * @param {string} key - 存储的键
   * @param {any} value - 要存储的值
   */
  setItem(key, value) {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error("Error setting item in localStorage", error);
    }
  },

  /**
   * 从 localStorage 获取数据
   * @param {string} key - 存储的键
   * @returns {any} - 获取的值
   */
  getItem(key) {
    try {
      const serializedValue = localStorage.getItem(key);
      return serializedValue ? JSON.parse(serializedValue) : null;
    } catch (error) {
      console.error("Error getting item from localStorage", error);
      return null;
    }
  },

  /**
   * 从 localStorage 移除数据
   * @param {string} key - 存储的键
   */
  removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing item from localStorage", error);
    }
  },

  /**
   * 清空所有 localStorage 数据
   */
  clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage", error);
    }
  },

  /* Cookie 操作 */
  getMainDomain() {
    const url = window.location.hostname; // 获取当前主机名
    const parts = url.split("."); // 按点分割
    if (parts.length > 2) {
      // 当主机名有子域时，取最后两个部分
      return parts.slice(-2).join("."); // 返回主域名
    }
    return url; // 没有子域时直接返回当前主机名
  },

  setCookie(name, value, daysToExpire = 1) {
    const date = new Date();
    date.setTime(date.getTime() + daysToExpire * 24 * 60 * 60 * 1000); // 设置过期时间为指定的天数之后
    const expires = "; expires=" + date.toUTCString(); // 转换为GMT格式的字符串
    document.cookie =
      name + "=" + (value || "") + expires + "; path=/; domain=" + this.getMainDomain(); // 设置cookie
  },

  // 获取cookie
  getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },

  // 清除cookie
  clearCookie(name) {
    this.setCookie(name, "", -1);
  }
};
