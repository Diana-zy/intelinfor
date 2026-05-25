const cheerio = require("cheerio");
const GithubSlugger = require("github-slugger");

/**
 * 提取富文本标题 + 注入锚点（适配 cheerio 0.22.0，纯 CJS 版本）
 * @param {string} html - 原始富文本
 * @param {number[]} levels - 标题层级 [1,2,3]
 * @returns {object} { toc, htmlWithAnchor }
 */
exports.processHtmlWithToc = (html, levels = [1, 2, 3]) => {
  const $ = cheerio.load(html);
  const slugger = new GithubSlugger();
  const toc = [];
  const titleMap = {};

  levels.forEach((level) => {
    $(`h${level}`).each((i, el) => {
      const $el = $(el);
      const titleText = $el.text().trim();

      if (!titleText) return;

      const anchorId = slugger.slug(titleText);
      $el.attr("id", anchorId);

      titleMap[anchorId] = $el.index(`h${level}`);

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

  const cleanToc = toc.map(({ index, ...rest }) => rest);

  // 给表格套滚动容器，确保宽表格在移动端可横向滚动
  $(`table`).each((i, el) => {
    const $el = $(el);
    if (
      !$el.parent().hasClass("table-container-parent") &&
      !$el.parent().hasClass("table-scroll-wrapper")
    ) {
      $el.addClass("table-container");
      $el.wrap('<div class="table-container-parent"></div>');
    }
  });

  return {
    toc: cleanToc,
    htmlWithAnchor: $.html()
  };
};

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
