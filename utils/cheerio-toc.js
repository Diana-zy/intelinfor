const cheerio = require("cheerio");
const GithubSlugger = require("github-slugger");

/**
 * 提取富文本标题 + 注入锚点（适配 cheerio 0.22.0，纯 CJS 版本）
 * @param {string} html - 原始富文本
 * @param {number[]} levels - 标题层级 [1,2,3]
 * @returns {object} { toc, htmlWithAnchor }
 */
exports.processHtmlWithToc = (html, levels = [1, 2, 3]) => {
  // 适配旧版 cheerio 的加载方式
  const $ = cheerio.load(html);
  const slugger = new GithubSlugger();
  const toc = [];
  const titleMap = {}; // 存储标题位置，用于排序

  // 遍历指定层级的标题
  levels.forEach((level) => {
    $(`h${level}`).each((i, el) => {
      const $el = $(el);
      const titleText = $el.text().trim();

      if (!titleText) return;

      // 生成唯一锚点 ID
      const anchorId = slugger.slug(titleText);
      $el.attr("id", anchorId);

      // 记录标题在页面中的位置（用于排序）
      titleMap[anchorId] = $el.index(`h${level}`);

      // 推入目录数据
      toc.push({
        id: anchorId,
        text: titleText,
        level,
        index: titleMap[anchorId]
      });
    });
  });

  // 按页面中标题出现顺序排序（保持原始顺序）
  toc.sort((a, b) => {
    return a.index - b.index;
  });

  // 移除 index 字段（无需传递到客户端）
  const cleanToc = toc.map(({ index, ...rest }) => rest);

  // 给所有表格加 class 并套滚动容器
  $("table").each((i, el) => {
    const $el = $(el);
    $el.addClass("table-container");
    $el.wrap('<div class="table-container-parent"></div>');
  });

  // 返回带锚点的 HTML 和目录
  return {
    toc: cleanToc,
    htmlWithAnchor: $.html()
  };
};

// 生成嵌套目录（逻辑不变）
exports.generateNestedToc = (flatToc) => {
  const nestedToc = [];
  const stack = [];
  flatToc.forEach((item) => {
    const node = { ...item, children: [] };
    while (stack.length && stack[stack.length - 1].level >= item.level) {
      stack.pop();
    }
    if (stack.length) {
      stack[stack.length - 1].children.push(node);
    } else {
      nestedToc.push(node);
    }
    stack.push(node);
  });
  return nestedToc;
};
