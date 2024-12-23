
// 找到 id 为 "welcome-to-mkdocs" 的元素
const element = document.getElementById("welcome-to-mkdocs");

if (element) {
  // 创建新的 div 元素
  const newDiv = document.createElement("h1");
  newDiv.id = "dynamic-welcome"; // 设置新的 id
  newDiv.textContent = "hello testtesttest"; // 设置新的内容

  // 替换旧的元素
  element.replaceWith(newDiv);
} else {
  console.error('Element with id "welcome-to-mkdocs" not found!');
}

function joinUrl (base, path) {
  if (path.substring(0, 1) === "/") {
    // path starts with `/`. Thus it is absolute.
    return path;
  }
  if (base.substring(base.length-1) === "/") {
    // base ends with `/`
    return base + path;
  }
  return base + "/" + path;
}

// 加载 search_index.json
fetch("/search/search_index.json")
  .then((response) => response.json())
  .then((searchIndex) => {
    console.log("Original search index:", searchIndex);

    // 动态替换的内容
    const dynamicContent = {
      id: "dynamic-welcome",
      title: "Dynamic Content Title",
      body: "hello testtesttest", // 替换后的内容
      location: "#welcome-to-mkdocs", // 链接到具体页面的锚点
    };

    // 将动态内容添加到索引中
    searchIndex.docs.push(dynamicContent);

    const fs = require('fs');
    fs.writeFileSync("/search/search_index.json", JSON.stringify(searchIndex));
    console.log("Updated search index:", searchIndex);

    // 使用新的索引重新初始化搜索引擎
    initializeSearchEngine(searchIndex);
  })
  .catch((error) => {
    console.error("Failed to load search index:", error);
  });

// 初始化搜索引擎（示例，基于 Lunr.js）
function initializeSearchEngine(searchIndex) {
  const lunrIndex = lunr(function () {
    this.ref("id"); // 唯一标识符
    this.field("title"); // 搜索标题
    this.field("body"); // 搜索正文

    searchIndex.docs.forEach((doc) => {
      this.add(doc);
    });
  });
}