# KaiwuDB优势区域设计文档

**创建日期：** 2026-01-14
**位置：** `index.html` - 在"为什么选择我们" section 后新增
**设计参考：** design.jpg

---

## 概述

在首页 "为什么选择我们" section 下方新增 "KaiwuDB的优势" section，采用手风琴（抽屉式）交互方式展示5个核心优势点，右侧配合抽象视觉元素保持页面设计一致性。

---

## HTML 结构

```html
<!-- KaiwuDB的优势 -->
<section class="kaiwu-advantages" id="kaiwu-advantages">
    <div class="container">
        <h2 class="section-title">KaiwuDB的优势</h2>

        <div class="advantages-layout">
            <!-- 左侧：手风琴列表 -->
            <div class="advantages-accordion">
                <!-- 5个可折叠项目 -->
                <div class="accordion-item">
                    <button class="accordion-header" aria-expanded="true">
                        <span class="accordion-title">多模融合，一库多用</span>
                        <span class="accordion-icon">▼</span>
                    </button>
                    <div class="accordion-content">
                        <div class="accordion-inner">
                            <p>KaiwuDB 采用创新的多模融合架构，在单一数据库中同时支持时序、关系、图等多种数据模型，打破传统多库集成的复杂性。</p>
                            <p>无论是工业物联网的海量时序数据，还是业务系统的关系型数据，亦或是知识图谱的关联查询，都能在一个数据库中高效处理，大幅简化技术栈，降低运维成本。</p>
                        </div>
                    </div>
                </div>

                <div class="accordion-item">
                    <button class="accordion-header" aria-expanded="false">
                        <span class="accordion-title">高性能分布式架构</span>
                        <span class="accordion-icon">▼</span>
                    </button>
                    <div class="accordion-content" hidden>
                        <div class="accordion-inner">
                            <p>基于分布式存储架构，支持弹性水平扩展，轻松应对PB级数据规模。</p>
                            <p>采用智能分片与负载均衡技术，实现毫秒级查询响应，满足工业物联网场景下高并发写入与实时查询的严苛要求。</p>
                        </div>
                    </div>
                </div>

                <div class="accordion-item">
                    <button class="accordion-header" aria-expanded="false">
                        <span class="accordion-title">AI智能优化引擎</span>
                        <span class="accordion-icon">▼</span>
                    </button>
                    <div class="accordion-content" hidden>
                        <div class="accordion-inner">
                            <p>内置AI优化引擎，通过机器学习算法自动分析访问模式，动态调整索引策略与查询计划。</p>
                            <p>数据库越用越懂业务，持续优化性能表现，同时提供异常检测与智能告警能力，让运维更省心。</p>
                        </div>
                    </div>
                </div>

                <div class="accordion-item">
                    <button class="accordion-header" aria-expanded="false">
                        <span class="accordion-title">企业级安全可靠</span>
                        <span class="accordion-icon">▼</span>
                    </button>
                    <div class="accordion-content" hidden>
                        <div class="accordion-inner">
                            <p>多副本容灾机制，确保数据零丢失，支持跨机房部署与异地容灾。</p>
                            <p>端到端加密传输与存储，细粒度权限控制，完整审计日志，满足等保、行业合规等安全要求。</p>
                        </div>
                    </div>
                </div>

                <div class="accordion-item">
                    <button class="accordion-header" aria-expanded="false">
                        <span class="accordion-title">开源开放生态</span>
                        <span class="accordion-icon">▼</span>
                    </button>
                    <div class="accordion-content" hidden>
                        <div class="accordion-inner">
                            <p>遵循 Apache 2.0 开源协议，代码开放透明，支持社区共建。</p>
                            <p>提供丰富的生态工具集成，兼容主流 BI、ETL 平台，降低技术门槛，加速数字化转型进程。</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 右侧：抽象图形 -->
            <div class="advantages-visual">
                <div class="abstract-shape advantages-shape"></div>
            </div>
        </div>
    </div>
</section>
```

**插入位置：** `index.html` 第140行后

---

## CSS 样式

新增样式添加到 `css/style.css`：

```css
/* ========================================
   KaiwuDB 优势区域
   ======================================== */

.kaiwu-advantages {
    padding: 5rem 0;
    background: var(--color-bg-primary);
}

/* 两列布局 */
.advantages-layout {
    display: grid;
    grid-template-columns: 3fr 2fr;  /* 60% : 40% */
    gap: 4rem;
    align-items: start;
}

/* 手风琴容器 */
.advantages-accordion {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

/* 手风琴项目 */
.accordion-item {
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

/* 手风琴头部 */
.accordion-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    background: #F8F9FA;
    border: none;
    border-bottom: 1px solid #E5E7EB;
    font-size: 16px;
    font-weight: 500;
    color: #374151;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
}

.accordion-header:hover {
    background: #F3F4F6;
}

.accordion-header:focus {
    outline: 2px solid #0056D2;
    outline-offset: 2px;
}

/* 激活状态 */
.accordion-header.active {
    background: #EEF2FF;
    color: #0056D2;
    border-left: 3px solid #0056D2;
    border-bottom: none;
    font-weight: 600;
}

/* 箭头图标 */
.accordion-icon {
    transition: transform 0.3s ease;
    font-size: 12px;
}

.accordion-header.active .accordion-icon {
    transform: rotate(180deg);
}

/* 手风琴内容区 */
.accordion-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-in-out;
}

.accordion-inner {
    padding: 1.5rem;
    color: #4B5563;
    line-height: 1.7;
}

.accordion-inner p {
    margin-bottom: 1rem;
}

.accordion-inner p:last-child {
    margin-bottom: 0;
}

/* 右侧视觉区域 */
.advantages-visual {
    display: flex;
    align-items: center;
    justify-content: center;
}

.advantages-shape {
    width: 280px;
    height: 280px;
    border-color: #0056D2;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .advantages-layout {
        grid-template-columns: 1fr;
        gap: 2rem;
    }

    .advantages-visual {
        display: none;
    }

    .kaiwu-advantages {
        padding: 3rem 0;
    }

    .accordion-header {
        padding: 0.875rem 1.25rem;
        font-size: 15px;
    }

    .accordion-inner {
        padding: 1.25rem;
    }
}
```

---

## JavaScript 交互逻辑

在 `js/main.js` 中添加以下代码：

```javascript
/**
 * 初始化 KaiwuDB 优势区域手风琴功能
 */
function initAdvantagesAccordion() {
    const accordion = document.querySelector('.advantages-accordion');
    if (!accordion) return;

    const headers = accordion.querySelectorAll('.accordion-header');

    headers.forEach(header => {
        // 点击事件
        header.addEventListener('click', () => {
            toggleAccordion(header);
        });

        // 键盘事件 (Enter/Space)
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleAccordion(header);
            }
        });
    });
}

/**
 * 切换手风琴状态
 */
function toggleAccordion(header) {
    const isActive = header.classList.contains('active');
    const content = header.nextElementSibling;
    const accordion = header.closest('.advantages-accordion');
    const allHeaders = accordion.querySelectorAll('.accordion-header');

    // 收起所有其他项
    allHeaders.forEach(h => {
        if (h !== header && h.classList.contains('active')) {
            h.classList.remove('active');
            h.setAttribute('aria-expanded', 'false');
            const otherContent = h.nextElementSibling;
            otherContent.style.maxHeight = null;
            otherContent.hidden = true;
        }
    });

    // 切换当前项
    if (isActive) {
        // 收起
        header.classList.remove('active');
        header.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = null;
        content.hidden = true;
    } else {
        // 展开
        header.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
        content.hidden = false;
        content.style.maxHeight = content.scrollHeight + 'px';
    }
}
```

**调用时机：** 在 DOMContentLoaded 事件中调用

```javascript
document.addEventListener('DOMContentLoaded', () => {
    // ... 现有初始化代码 ...
    initAdvantagesAccordion();
});
```

---

## 设计要点

### 交互行为
- **默认状态**：第一项默认展开
- **手风琴模式**：同时只能展开一项
- **平滑动画**：使用 `max-height` 过渡实现
- **键盘访问**：支持 Tab、Enter、Space 操作
- **ARIA 属性**：正确设置 `aria-expanded` 和 `hidden`

### 视觉一致性
- 复用现有 `.abstract-shape` 样式
- 使用品牌色 `#0056D2` 作为强调色
- 间距与周边 section 保持一致
- 阴影效果与现有卡片统一

### 响应式设计
- **桌面端（>768px）**：两列布局
- **移动端（≤768px）**：单列布局，隐藏右侧图形
- 平板/移动端保持相同的交互体验

---

## 实现检查清单

- [ ] HTML 结构插入 `index.html`
- [ ] CSS 样式添加到 `css/style.css`
- [ ] JavaScript 函数添加到 `js/main.js`
- [ ] 初始化函数在 DOMContentLoaded 中调用
- [ ] 测试桌面端交互（点击展开/收起）
- [ ] 测试移动端响应式布局
- [ ] 测试键盘访问性
- [ ] 验证 ARIA 属性正确性
- [ ] 跨浏览器测试（Chrome, Safari, Firefox, Edge）

---

## 参考文件

- 设计参考：`design.jpg`
- 主样式文件：`css/style.css`
- 主脚本文件：`js/main.js`
- 页面文件：`index.html`
- 设计指南：`DESIGN_GUIDE.md`
