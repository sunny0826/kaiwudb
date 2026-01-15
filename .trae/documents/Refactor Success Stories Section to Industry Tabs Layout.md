我将重构 `#success-stories` 部分，实现基于行业的 Tab 切换导航和全新的布局结构。

### 1. 更新数据与逻辑 (`js/main.js`)

* **定义行业数据**：创建一个配置对象，映射行业标签（`物联网、能源电力、车联网、金属冶炼`）到其显示标题和解决方案描述。

* **重构** **`initSuccessStories`**：

  * 实现 **行业 Tab** 的动态渲染。

  * 实现 `renderIndustryContent(industryKey)` 以更新部分内容。

  * **左侧面板**：渲染行业标题和描述（按要求移除 `highlights` 统计数据部分）。

  * **右侧面板**：渲染 **案例卡片网格**（最多显示 3 个）。

  * **查看更多**：如果某行业的案例超过 3 个，添加"查看更多"按钮的显示逻辑。

* **清理废弃代码**：删除 `renderCaseList`, `renderCaseDetail`, `bindCaseCardEvents` 以及依赖于旧版列表-详情交互的移动端模态框逻辑。

### 2. 重构 HTML 结构 (`index.html`)

* **添加 Tab 容器**：在主要内容区域上方插入行业 Tab 的容器。

* **更新布局容器**：

  * 替换现有的 `case-detail-panel` 和 `case-list` 结构。

  * 创建两个独立的区域：

    * `.industry-solution`：用于左侧解决方案详情。

    * `.industry-case-grid`：用于右侧案例卡片网格。

### 3. 重构样式 (`css/success-stories.css`)

* **Tab 样式**：添加新行业 Tab 的样式（交互状态、间距）。

* **布局更新**：

  * 更新 `.success-stories-layout` 以支持新的 左侧（解决方案）/ 右侧（案例网格）布局。

  * 确保右侧网格采用响应式网格布局（移动端 1 列，桌面端最多 3 列）。

* **组件样式**：

  * 优化 `.industry-solution` 的可读性样式。

  * 设计 `.case-card-grid-item`（网格视图的新卡片样式），包含标题、Logo/缩略图和简要描述。

* **清理**：移除与旧版 `case-detail-highlights` 和列表-详情交互相关的 CSS 规则。

### 4. 验证

* 验证点击 Tab 能平滑切换内容。

* 确认每个行业最多显示 3 个案例。

* 检查 "highlights" `div` 和旧的交互代码是否已完全移除。

* 确保布局在移动端和桌面端的响应式表现正常。

