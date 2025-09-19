<template>
  <div>
    <nuxt />
  </div>
</template>

<script>
import Storage from "@/utils/storage";
export default {
  data() {
    return {
      maxScrollPercentage: 0
    };
  },
  mounted() {
    this.handleListenerScroll();
    // 判断用户是否使用vpn
    this.getUserIsVpn();
  },
  methods: {
    handleListenerScroll() {
      const self = this;
      window.addEventListener("scroll", (e) => {
        // 获取当前滚动位置
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

        // 获取文档总高度（减去视口高度得到可滚动高度）
        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
        // 计算滚动百分比（0-100）
        const currentScrollPercentage =
          scrollHeight > clientHeight
            ? Math.min(100, (scrollTop / (scrollHeight - clientHeight)) * 100).toFixed(0) // 确保不超过100%
            : 0;
        if (Number(currentScrollPercentage) > Number(self.maxScrollPercentage)) {
          self.maxScrollPercentage = currentScrollPercentage;
        }
      });
      window.addEventListener("beforeunload", () => {
        // window.dataLayer.push({
        //   event: "scroll_depth" + "_" + this.handleFormat(this.maxScrollPercentage),
        //   hi_depth: this.handleFormat(this.maxScrollPercentage)
        // });
        window.dataLayer.push({
          event: "scroll_depth",
          hi_depth: this.handleFormat(this.maxScrollPercentage)
        });
      });
    },
    handleFormat(val) {
      if (val === 0) {
        return "0%";
      } else if (val <= 20 && val > 0) {
        return "1_20%";
      } else if (val >= 80) {
        return "81_100%";
      } else {
        return `${Math.floor(val / 20) * 2}1_${Math.floor(val / 20) * 2 + 2}0%`;
      }
    },
    async getUserIsVpn() {
      const badNetworkArr = [
        "is_datacenter", // 托管提供商
        "is_tor", // TOR 出口节点
        "is_proxy", // 代理服务器出口节点
        "is_vpn", // VPN 出口节点
        "is_abuser", // 链接到已参与滥用行为的 IP 地址
        "is_crawler" // 爬虫
      ];

      const isQueriedVpn = Storage.getCookie("hi_vpn_queried");
      if (isQueriedVpn !== null) return;
      try {
        const res = await fetch("https://api.ipapi.is/?key=f9f124f6b4cbd81c24cb");
        const data = await res.json();
        if (data?.ip) {
          const trackKeyArr = [];
          badNetworkArr.forEach((item) => {
            if (data[item] === true) {
              trackKeyArr.push(item);
            }
          });
          Storage.setCookie("hi_vpn_queried", "ok");
          window.dataLayer.push({
            event: "Page_View_First_Network",
            bad_network: trackKeyArr.join("|")
          });
        }
      } catch (e) {
        console.log("error");
      }
    }
  }
};
</script>
