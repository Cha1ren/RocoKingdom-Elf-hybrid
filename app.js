// ============================================================
// app.js — 网站的核心逻辑
// 你不需要修改这个文件！所有配置请在 config.json 中完成。
// ============================================================

// 用于记录用户当前的选择
let selectedFirst = null;   // 第一张图片的 id
let selectedSecond = null;  // 第二张图片的 id
let siteConfig = null;      // 从 config.json 读取的配置

// ——————————————————————————————————————
// 页面加载完毕后，读取配置文件并初始化
// ——————————————————————————————————————
document.addEventListener("DOMContentLoaded", () => {
  fetch("config.json")
    .then(response => {
      if (!response.ok) throw new Error("无法读取 config.json，请检查文件是否存在。");
      return response.json();
    })
    .then(config => {
      siteConfig = config;
      initSite();
    })
    .catch(err => {
      document.body.innerHTML = `
        <div style="text-align:center; padding:60px; font-family:sans-serif;">
          <h2 style="color:#e53e3e;">⚠️ 配置文件加载失败</h2>
          <p style="color:#666; margin-top:15px;">${err.message}</p>
          <p style="color:#999; margin-top:10px; font-size:0.9em;">
            提示：直接双击 index.html 打开时，浏览器安全限制可能导致此错误。<br>
            请按照教程使用 VS Code 的 Live Server 预览，或直接上传到 GitHub Pages 后查看。
          </p>
        </div>`;
    });
});

// ——————————————————————————————————————
// 初始化网站：填充标题、渲染图片网格
// ——————————————————————————————————————
function initSite() {
  // 设置网站标题和副标题
  document.title = siteConfig.siteTitle || "图片配对网站";
  document.getElementById("page-title").textContent = siteConfig.siteTitle || "图片配对网站";
  document.getElementById("site-title").textContent = siteConfig.siteTitle || "图片配对网站";
  document.getElementById("site-subtitle").textContent = siteConfig.siteSubtitle || "";

  // 渲染两个选择网格
  renderGrid("grid-first", "first");
  renderGrid("grid-second", "second");

  // 绑定"查看结果"按钮
  document.getElementById("confirm-btn").addEventListener("click", showResult);

  // 绑定"重新选择"按钮
  document.getElementById("reset-btn").addEventListener("click", resetAll);
}

// ——————————————————————————————————————
// 渲染图片网格
// containerId: 容器的 id
// role: "first" 或 "second"（区分两个选择区）
// ——————————————————————————————————————
function renderGrid(containerId, role) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  siteConfig.selectableImages.forEach(img => {
    const card = document.createElement("div");
    card.className = "image-card";
    card.dataset.id = img.id;
    card.dataset.role = role;

    card.innerHTML = `
      <img src="${img.file}" alt="${img.label}" loading="lazy" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><rect fill=%22%23eee%22 width=%22200%22 height=%22200%22/><text x=%2250%%22 y=%2250%%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23aaa%22 font-size=%2216%22>${img.label}</text></svg>'">
      <div class="card-label">${img.label}</div>
    `;

    card.addEventListener("click", () => onCardClick(card, img.id, role));
    container.appendChild(card);
  });
}

// ——————————————————————————————————————
// 处理图片卡片点击事件
// ——————————————————————————————————————
function onCardClick(card, imgId, role) {
  if (card.classList.contains("disabled")) return;

  if (role === "first") {
    // 取消上一个选中
    clearSelection("grid-first");
    selectedFirst = imgId;
    card.classList.add("selected");
  } else {
    clearSelection("grid-second");
    selectedSecond = imgId;
    card.classList.add("selected");
  }

  // 更新对面网格的禁用状态（防止选同一张）
  updateDisabledState();
  updateConfirmButton();
}

// ——————————————————————————————————————
// 清除某个网格内所有卡片的选中状态
// ——————————————————————————————————————
function clearSelection(gridId) {
  document.querySelectorAll(`#${gridId} .image-card`).forEach(c => {
    c.classList.remove("selected");
  });
}

// ——————————————————————————————————————
// 当两边都有选择后，禁用对方网格中相同 id 的卡片
// ——————————————————————————————————————
function updateDisabledState() {
  // 先解除所有禁用
  document.querySelectorAll(".image-card").forEach(c => c.classList.remove("disabled"));

  // 如果第一个选了 X，则第二个网格里的 X 禁用
  if (selectedFirst) {
    document.querySelectorAll(`#grid-second .image-card`).forEach(c => {
      if (c.dataset.id === selectedFirst) c.classList.add("disabled");
    });
  }

  // 如果第二个选了 Y，则第一个网格里的 Y 禁用
  if (selectedSecond) {
    document.querySelectorAll(`#grid-first .image-card`).forEach(c => {
      if (c.dataset.id === selectedSecond) c.classList.add("disabled");
    });
  }
}

// ——————————————————————————————————————
// 根据选择情况更新按钮和提示文字
// ——————————————————————————————————————
function updateConfirmButton() {
  const btn = document.getElementById("confirm-btn");
  const hint = document.getElementById("selection-hint");

  if (selectedFirst && selectedSecond) {
    btn.disabled = false;
    const label1 = getLabelById(selectedFirst);
    const label2 = getLabelById(selectedSecond);
    hint.textContent = `已选择：${label1} + ${label2}`;
  } else if (selectedFirst) {
    btn.disabled = true;
    hint.textContent = `已选第一个：${getLabelById(selectedFirst)}，请继续选择第二个`;
  } else if (selectedSecond) {
    btn.disabled = true;
    hint.textContent = `已选第二个：${getLabelById(selectedSecond)}，请继续选择第一个`;
  } else {
    btn.disabled = true;
    hint.textContent = "请先选择两张不同的图片";
  }
}

// ——————————————————————————————————————
// 根据 id 获取图片的展示标签
// ——————————————————————————————————————
function getLabelById(id) {
  const img = siteConfig.selectableImages.find(i => i.id === id);
  return img ? img.label : id;
}

// ——————————————————————————————————————
// 查找匹配规则（顺序不限，A+B 和 B+A 效果相同）
// ——————————————————————————————————————
function findRule(id1, id2) {
  return siteConfig.rules.find(rule =>
    (rule.input1 === id1 && rule.input2 === id2) ||
    (rule.input1 === id2 && rule.input2 === id1)
  );
}

// ——————————————————————————————————————
// 展示结果
// ——————————————————————————————————————
function showResult() {
  const rule = findRule(selectedFirst, selectedSecond);
  const resultSection = document.getElementById("result-section");
  const resultImage = document.getElementById("result-image");
  const resultMessage = document.getElementById("result-message");
  const loadingSpinner = document.getElementById("loading-spinner");

  if (rule) {
    resultMessage.textContent = rule.message || "找到结果！";

    // 显示加载动画，隐藏结果图片
    loadingSpinner.style.display = "flex";
    resultImage.style.display = "none";

    // 设置图片地址，开始加载
    resultImage.src = rule.result;

    // 图片加载成功
    resultImage.onload = function() {
      loadingSpinner.style.display = "none";
      resultImage.style.display = "block";
    };

    // 图片加载失败
    resultImage.onerror = function() {
      loadingSpinner.style.display = "none";
      resultImage.style.display = "none";
      resultMessage.textContent = (rule.message || "") + "（提示：结果图片文件未找到，请检查图片路径是否正确）";
    };
  } else {
    resultMessage.textContent = siteConfig.defaultMessage || "没有找到对应的结果图片，请换个组合试试~";
    loadingSpinner.style.display = "none";
    resultImage.style.display = "none";
  }

  resultSection.style.display = "block";
  resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ——————————————————————————————————————
// 重置所有选择
// ——————————————————————————————————————
function resetAll() {
  selectedFirst = null;
  selectedSecond = null;

  document.querySelectorAll(".image-card").forEach(c => {
    c.classList.remove("selected", "disabled");
  });

  document.getElementById("confirm-btn").disabled = true;
  document.getElementById("selection-hint").textContent = "请先选择两张不同的图片";
  document.getElementById("result-section").style.display = "none";

  // 平滑滚动回顶部
  window.scrollTo({ top: 0, behavior: "smooth" });
}
