<template>
  <div>
    <nuxt />
  </div>
</template>

<script>
export default {
  data() {
    return {
      maxScrollPercentage: 0
    };
  },
  mounted() {
    this.handleListenerScroll();
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
    }
  }
};
</script>
