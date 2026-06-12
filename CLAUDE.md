# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ 待办事项

### [待办] 作者接口对外暴露
- 当前状态：`/api/article/seo/getAuthor?id=` 仅内网可用（`api.tapmygame.com` 返回 404）
- 临时方案：作者数据硬编码在 `config/author-links.js`，作者页直接读配置文件
- 后续改动：后端将接口暴露到外网后，修改 `pages/author/_author.vue` 的 `mounted()` 函数，改回 API 调用方式（参考注释中的代码），同时清空 `config/author-links.js` 中的冗余字段

### [待办] 发布日期区分（datePublished vs dateModified）
- 当前 NewsArticle Schema 中 `datePublished` 和 `dateModified` 都使用 `updated_at`
- 后端需在 `/api/article/detail` 响应中新增 `create_time` 字段（文章首次入库时间，更新后不变）
- 前端改动：`pages/detail/_detail.vue` 第 287 行，将 `datePublished` 改为 `this.newInfo?.create_time || this.newInfo?.updated_at`

## Project Overview

This is **Intelinfor**, a Nuxt.js 2 static site for a news/content website. It generates SEO-optimized static pages for articles, categories, and search.

This project uses the **koureishalife layout and component structure** with a two-column layout (left content + right sidebar).

## Build Commands

```bash
# Development
npm run dev           # Start dev server on 0.0.0.0

# Build & Deploy
npm run build         # Build for production
npm run generate      # Generate static site
npm run go            # Increment version in .env, then generate static site

# Code Quality
npm run lint          # Run ESLint + Prettier checks
npm run lint:js       # ESLint only (.js, .vue)
npm run lint:prettier # Prettier check only
npm run lint:fix      # Auto-fix both ESLint and Prettier issues
```

## Architecture

### Framework & Target
- **Nuxt.js 2.15.8** with `target: 'static'` - generates pre-rendered HTML
- **Vue 2.7** with Options API (no Composition API)
- **Swiper 5** for carousels
- **Cheerio** for HTML parsing (TOC generation)
- **Github Slugger** for anchor ID generation

### Page Structure
Pages use dynamic routes with underscore prefixes:
- `pages/index.vue` - Homepage with swiper rec, trending articles, and category sections
- `pages/category/_category.vue` - Category listing with infinite scroll
- `pages/detail/_detail.vue` - Article detail (legacy `/detail/...` URLs)
- `pages/_category/_slug.vue` - Article detail (new `/{category}/{slug}/` URLs)
- `pages/search/index.vue` - Search results with AdSense

All routes have `trailingSlash: true` enforced.

### Layout Structure
Two-column layout used across all pages:
```vue
<main class="main">
  <div class="layout-left">   <!-- Main content -->
  <div class="layout-right">  <!-- Sidebar (hidden on mobile) -->
</main>
```

### Data Flow

1. **Navigation Data**: Injected via `plugins/nav-data.js` at app startup - fetches all categories from `/api/article/get_all_category`
2. **Page Data**: Each page uses `asyncData()` to fetch server-side during generation
   - Homepage: Fetches rec, trending, all articles, and SEO categories
   - Category: Fetches `/api/article/get_seo_category_page`
   - Detail: Fetches `/api/article/detail` with TOC processing
3. **Infinite Load**: `InfiniteLoadList.vue` component handles client-side pagination with "Load More" button

### Global State
`plugins/global-data.js` injects:
- `$globalData` - Vue.observable with `isNavigationVisible`, `notification`
- `$globalMethod` - `toggleNavigation()`, `showNotification({message, type})`, `hideNotification()`

### Styling
- **SCSS** with global mixins in `assets/css/_mixins.scss`
- Key mixins: `vw($size)` for mobile responsive (750px base), `ellipsis($lines)`, `icon()`, `bg()`, `btn-img()`, `author-icon()`
- SCSS variables: `$color1` (#f96606), `$tagColor1`, `$tagColor2`, `$tagColor3`, etc.
- Global CSS: `fonts.css`, `reset.css`, `common.scss`
- Style resources module makes `_mixins.scss` available to all components

### Image Handling
- Uses `@nuxt/image` with Cloudflare provider (`https://bunchthings.com`)
- Component: `<NuxtImg format="auto" fit="cover" />`

### Environment Variables
Required in `.env`:
- `SITE_ID` - Site identifier for API calls (e.g., "intelinfor")
- `TEST_API_URL` / `PROD_API_URL` - API base URLs
- `APP_VERSION` - Auto-incremented by `npm run go`

### Static Generation
`nuxt.config.js` `generate.routes()` fetches all paths from `/api/article/get_all_path_v2` and generates:
- Category routes: `/category/{path}/`
- Detail routes: `/{path_v2}/` (includes category slug)

## Key Conventions

### URL Path Extraction
Dynamic routes extract IDs from slug (format: `...-id`):
```js
const lastDashIndex = path.lastIndexOf("-");
const id = path.substring(lastDashIndex + 1);
```

New URL structure uses `path_v2` from API which includes category slug.

### Query Parameter Preservation
Search/category links preserve existing query params via `generateCustomPath()` in `utils/utils.js` and append `from` parameter for tracking.

### TOC Generation
Article detail pages use `utils/cheerio-toc.js` to:
1. Parse HTML content with Cheerio
2. Extract headings (h2, h3) and generate anchor IDs
3. Build nested table of contents
4. Inject anchor IDs back into HTML

### Ads Integration
- Ad placeholders at `#afscontainer1` and `#relatedsearches1`
- AdSense script loading handled in search page
- Google Ads components: `GoogleAd.vue`, `GoogleAdPreload.vue`, `GoogleAdSmall.vue`

### FAQ Section
Article detail pages display FAQ data from API (`newInfo.faqs`) or fallback defaults for SEO/GEO optimization.

## Component Inventory

### Layout Components
- `Header.vue` - Top navigation with search, category dropdown, mobile sidebar
- `FooterSeo.vue` - Site footer with social links
- `Sidebar.vue` - Mobile navigation drawer

### Content Components
- `Breadcrumb.vue` - Navigation breadcrumb
- `RightSideBox.vue` - Sidebar with categories, latest, and featured articles
- `common/PageLabel.vue` - Page title component

### Article Components
- `NewsItem2.vue` - Grid article card with colored category tag
- `NewsItem4.vue` - Large article card with author info
- `NewsItem5.vue` - Related article card

### Item Components (in `components/Item/`)
- `SwiperRec.vue` - Hero carousel slide item
- `TextNew.vue` - Text list item (PC/Mobile responsive)
- `ModeNew.vue` - Sidebar article item with thumbnail
- `SearchResult.vue` - Search result item

### Utility Components
- `InfiniteLoadList.vue` - Infinite scroll with "Load More" button
- `CustomLink.vue` - Custom link component
- `Loading.vue` - Loading spinner
- `Notification.vue` - Toast notification

## File Locations

| Purpose | Path |
|---------|------|
| API config | `plugins/axios.js` |
| Global state | `plugins/global-data.js` |
| Nav data | `plugins/nav-data.js` |
| Utilities | `utils/utils.js`, `utils/storage.js` |
| TOC processing | `utils/cheerio-toc.js` |
| SCSS mixins | `assets/css/_mixins.scss` |
| Item components | `components/Item/*.vue` |
| Common components | `components/common/*.vue` |
| Version bump | `utils/env.js` |
