<template>
  <div class="optimized-image" :style="containerStyle">
    <!-- 占位符（blur-up效果） -->
    <img
      v-if="placeholder"
      :src="placeholder"
      class="placeholder-image"
      :style="placeholderStyle"
      aria-hidden="true"
    />

    <!-- 主要图片（响应式） -->
    <img
      v-show="imageLoaded"
      :src="computedSrc"
      :srcset="computedSrcset"
      :sizes="computedSizes"
      :alt="alt"
      :width="width"
      :height="height"
      class="main-image"
      :class="{ loaded: imageLoaded }"
      @load="onImageLoad"
      @error="onImageError"
    />

    <!-- 加载中指示器 -->
    <div v-if="!imageLoaded && showLoadingSpinner" class="loading-spinner">
      <div class="spinner"></div>
    </div>

    <!-- WebP支持的Picture元素（可选） -->
    <picture v-if="useWebP && !noPicture" style="display: none;">
      <source :srcset="computedWebPSrc" type="image/webp" />
      <img :src="computedSrc" :alt="alt" />
    </picture>
  </div>
</template>

<script>
export default {
  name: 'OptimizedImage',
  props: {
    // 基础图片URL
    src: {
      type: String,
      required: true
    },
    // 图片宽度
    width: {
      type: [Number, String],
      default: undefined
    },
    // 图片高度
    height: {
      type: [Number, String],
      default: undefined
    },
    // 替代文本
    alt: {
      type: String,
      default: 'Image'
    },
    // 占位符URL（模糊图片）
    placeholder: {
      type: String,
      default: null
    },
    // 是否启用懒加载
    lazy: {
      type: Boolean,
      default: true
    },
    // 加载阈值（使用Intersection Observer）
    threshold: {
      type: Number,
      default: 0.1
    },
    // 预加载margin
    rootMargin: {
      type: String,
      default: '50px'
    },
    // 是否显示加载动画
    showLoadingSpinner: {
      type: Boolean,
      default: true
    },
    // 响应式宽度列表（用于srcset）
    widths: {
      type: Array,
      default: () => [320, 640, 960, 1280, 1920]
    },
    // 设备像素比
    pixelRatio: {
      type: Number,
      default: 2
    },
    // 是否使用WebP格式
    useWebP: {
      type: Boolean,
      default: true
    },
    // 是否禁用picture元素
    noPicture: {
      type: Boolean,
      default: false
    },
    // 是否为背景图片
    background: {
      type: Boolean,
      default: false
    },
    // Cloudflare Image优化参数
    cfParams: {
      type: Object,
      default: () => ({
        quality: 80,
        format: 'auto'
      })
    },
    // 自定义尺寸字符串（sizes属性）
    sizes: {
      type: String,
      default: '(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px'
    }
  },
  data() {
    return {
      imageLoaded: false,
      hasError: false,
      observerSupported: false,
      intersectionObserver: null
    };
  },
  computed: {
    // 计算主要图片源
    computedSrc() {
      return this.buildImageUrl(this.src);
    },
    // 计算WebP源
    computedWebPSrc() {
      return this.buildImageUrl(this.src, 'webp');
    },
    // 计算Srcset（多分辨率）
    computedSrcset() {
      if (!this.widths || this.widths.length === 0) {
        return '';
      }

      return this.widths
        .map((width) => {
          const url = this.buildImageUrl(this.src, 'auto', width);
          return `${url} ${width}w`;
        })
        .join(', ');
    },
    // 计算Sizes属性
    computedSizes() {
      return this.sizes;
    },
    // 容器样式
    containerStyle() {
      if (this.width && this.height) {
        const ratio = this.height / this.width;
        return {
          aspectRatio: this.width / this.height,
          position: 'relative',
          overflow: 'hidden'
        };
      }
      return {
        position: 'relative',
        overflow: 'hidden'
      };
    },
    // 占位符样式
    placeholderStyle() {
      return {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        filter: 'blur(10px)',
        opacity: this.imageLoaded ? 0 : 1,
        transition: 'opacity 0.3s ease-out',
        position: 'absolute',
        top: 0,
        left: 0
      };
    }
  },
  watch: {
    src() {
      this.resetImage();
    }
  },
  mounted() {
    // 检查浏览器支持
    this.observerSupported = 'IntersectionObserver' in window;

    if (this.lazy && this.observerSupported) {
      this.setupIntersectionObserver();
    } else if (!this.lazy) {
      // 如果不使用懒加载，直接标记为已加载
      this.imageLoaded = true;
    }

    // 监控Web Vitals中的LCP
    if (this.isLargestContent()) {
      this.$nuxt.$once('hook:mounted', () => {
        this.reportLCPCandidate();
      });
    }
  },
  beforeDestroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  },
  methods: {
    // 使用Intersection Observer实现懒加载
    setupIntersectionObserver() {
      const options = {
        root: null,
        rootMargin: this.rootMargin,
        threshold: this.threshold
      };

      this.intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.imageLoaded = true;
            this.intersectionObserver.unobserve(entry.target);
          }
        });
      }, options);

      this.$nextTick(() => {
        const img = this.$el.querySelector('.main-image');
        if (img) {
          this.intersectionObserver.observe(img);
        }
      });
    },
    // 构建Cloudflare优化的图片URL
    buildImageUrl(url, format = 'auto', width = null) {
      if (!url) return '';

      // 如果已经是Cloudflare Image URL，直接使用
      if (url.includes('bunchthings.com')) {
        const params = new URLSearchParams();
        params.set('quality', this.cfParams.quality || 80);
        params.set('format', format);

        if (width) {
          params.set('width', width);
          params.set('dpr', this.pixelRatio);
        }

        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}${params.toString()}`;
      }

      return url;
    },
    // 图片加载完成
    onImageLoad() {
      this.imageLoaded = true;
      this.hasError = false;
      this.$emit('loaded');
    },
    // 图片加载失败
    onImageError() {
      this.hasError = true;
      this.$emit('error');
      console.warn(`图片加载失败: ${this.src}`);
    },
    // 重置图片状态
    resetImage() {
      this.imageLoaded = false;
      this.hasError = false;

      if (this.lazy && this.observerSupported) {
        this.setupIntersectionObserver();
      } else if (!this.lazy) {
        this.imageLoaded = true;
      }
    },
    // 判断是否是较大的内容（可能影响LCP）
    isLargestContent() {
      // 如果宽度大于viewport的50%，认为是较大内容
      const width = typeof this.width === 'string' ? parseInt(this.width) : this.width;
      return width && width > window.innerWidth / 2;
    },
    // 上报LCP候选图片
    reportLCPCandidate() {
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];

            if (window.__VITALS__) {
              window.__VITALS__.LCPElement = this.src;
            }
          });

          observer.observe({ type: 'largest-contentful-paint', buffered: true });
        } catch (e) {
          // 某些浏览器可能不支持
        }
      }
    }
  }
};
</script>

<style scoped lang="scss">
.optimized-image {
  position: relative;
  width: 100%;
  background-color: #f0f0f0;

  .placeholder-image,
  .main-image {
    width: 100%;
    height: auto;
    display: block;
  }

  .main-image {
    &.loaded {
      animation: fadeInImage 0.3s ease-out;
    }
  }

  .loading-spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      border-top-color: #333;
      animation: spin 0.8s linear infinite;
    }
  }
}

@keyframes fadeInImage {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
