// 模拟点击链接
export function simulateAFSSearch(value) {
  const targetPath = "/search/";

  const url = generateCustomPath(targetPath);

  const link = document.createElement("a");
  link.href = `${url}&query=${value}`;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generateCustomPath(url) {
  const targetPath = url;
  const currentParams = new URLSearchParams(window.location.search);
  const currentPathname = window.location.pathname;

  // 定义路径与类型的映射关系
  const pathTypeMappings = [
    { pattern: /^\/category\/[\w-]+\/$/, type: "category-detail" },
    { pattern: /^\/category\/$/, type: "category" },
    { pattern: /^\/detail\/.*/, type: "detail" },
    { pattern: /^\/$/, type: "home" }
  ];

  // 查找匹配的路径类型
  const matchedPathType = pathTypeMappings.find((mapping) => mapping.pattern.test(currentPathname));
  const from = matchedPathType ? matchedPathType.type : currentPathname.replaceAll("/", "");

  // 删除不需要的查询参数
  currentParams.delete("from");
  if (currentPathname === "/search/" || currentPathname === "/content/") {
    currentParams.delete("text");
    currentParams.delete("query");
  }

  // 生成新的查询参数字符串
  const queryString = currentParams.toString();
  return `${targetPath}?${queryString}${queryString ? "&" : ""}from=${encodeURIComponent(from)}`;
}


// 校验邮箱格式
export function validateEmail(email) {
  // 使用正则表达式验证邮箱格式
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// 在数组中随机取值
export function getRandomValueFromArray(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

// 重新排序
export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // 生成一个随机索引，范围是 [0, i]
    [array[i], array[j]] = [array[j], array[i]]; // 交换当前位置和随机位置的元素
  }
  return array;
}

// 首字母大写
export function capitalizeFirstLetter(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
