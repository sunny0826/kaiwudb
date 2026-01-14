# 分享评论页面功能实现计划

该计划旨在通过生成带有评论数据的 URL 来实现“分享给别人”的功能。由于是纯静态页面，我们将使用 **Base64 编码** 将评论数据压缩并附加在 URL 的 Hash 或 Query 参数中。

## 1. 功能设计 (UI/UX)
*   **入口**: 在右下角的协作工具栏中增加一个 "分享链接" 按钮（图标：Link/Share）。
*   **交互**: 
    *   点击按钮 -> 将当前所有评论序列化并压缩。
    *   生成形如 `http://.../index.html#comments=eyJ...` 的链接。
    *   自动复制到剪贴板，并提示 "链接已复制，可直接发送给他人"。
*   **接收方**:
    *   打开链接 -> 页面加载时自动检测 URL 中的 `comments` 参数。
    *   解析并覆盖/合并当前的评论数据。
    *   自动开启评论模式并展示 Pins。

## 2. 技术实现方案

### 2.1 数据压缩 (Compression)
为了避免 URL 过长，使用 `LZString` 或原生的 `btoa` (Base64) 进行编码。鉴于不引入外部库，我们将使用原生的 `btoa` + `encodeURIComponent` 组合。
*   **编码**: `JSON.stringify` -> `btoa` (Base64) -> `encodeURIComponent` (URL Safe)。
*   **解码**: `decodeURIComponent` -> `atob` -> `JSON.parse`。

### 2.2 核心逻辑扩展 (`js/comments.js`)
1.  **`shareLink()`**: 
    *   获取 `this.comments`。
    *   执行编码流程。
    *   构造新 URL (`window.location.origin + window.location.pathname + '#share=' + encodedData`)。
    *   写入剪贴板 (`navigator.clipboard.writeText`)。
    *   显示 Toast 提示。
2.  **`loadFromUrl()`**:
    *   在 `init()` 中调用。
    *   检查 `window.location.hash` 是否包含 `share=`。
    *   如果存在，解码数据，更新 `this.comments`，保存到 LocalStorage，并清除 Hash (可选，保持 URL 干净)。

## 3. 实施步骤

### Phase 1: 扩展工具栏 UI
1.  在 `renderToolbar` 方法中添加 "分享" 按钮 HTML。
2.  在 `css/comments.css` 中添加 Toast 提示的样式。

### Phase 2: 实现分享逻辑
1.  实现 `generateShareUrl()` 方法：数据序列化与 URL 构造。
2.  实现 `copyToClipboard()` 辅助方法。
3.  实现 `showToast(message)` 用于反馈。

### Phase 3: 实现接收逻辑
1.  在 `CommentSystem` 构造函数或 `init` 方法中增加 URL 参数解析逻辑。
2.  实现数据恢复与自动渲染。

请确认是否执行此计划？