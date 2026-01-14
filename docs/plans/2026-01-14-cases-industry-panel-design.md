# 客户案例下拉框行业价值展示面板设计

**日期**: 2026-01-14
**状态**: 设计完成
**优先级**: 中

## 概述

在导航栏的客户案例下拉框中增加左侧行业价值展示面板，当鼠标悬停在行业链接上时，动态展示 KaiwuDB 在该行业的价值和解决方案。

## 需求目标

1. 提升用户体验：让用户在选择行业前就能了解 KaiwuDB 在该行业的价值
2. 增强产品营销：突出各行业解决方案的核心优势
3. 保持设计一致性：与现有导航栏风格保持统一

## 架构设计

### 布局结构

```
┌─────────────────────────────────────────────────────┐
│  客户案例下拉框 (cases-dropdown-layout)              │
├──────────────┬──────────────────────────────────────┤
│              │                                       │
│  左侧面板    │        右侧行业列表                   │
│  (320px)     │       (flex: 1)                      │
│              │                                       │
│  行业价值    │   ▶ 物联网 (data-industry="iot")      │
│  展示区域    │       重工集团                         │
│              │       大数据中心                       │
│              │       纸业                             │
│              │                                       │
│              │   ▶ 能源电力 (data-industry="energy") │
│              │       江西电建                         │
│              │       ...                             │
└──────────────┴──────────────────────────────────────┘
```

### 响应式设计

| 屏幕尺寸 | 左侧面板 | 右侧列表 |
|---------|---------|---------|
| ≥1024px | 显示 | 显示 |
| 768-1023px | 隐藏 | 占满宽度 |
| <768px | 隐藏 | 移动端样式 |

## 数据结构

```javascript
const industryContent = {
  default: {
    title: "赋能千行百业数字化转型",
    description: "KaiwuDB 作为分布式多模融合数据库...",
    highlights: ["多模融合，一库多用", "分布式架构，弹性扩展", "AI 智能优化，越用越快"]
  },
  iot: {
    title: "物联网行业",
    description: "针对工业物联网海量设备、高并发写入...",
    highlights: ["百万级 TPS 写入", "毫秒级实时查询", "智能数据压缩"]
  },
  energy: {
    title: "能源电力行业",
    description: "面向新能源发电、智能电网...",
    highlights: ["源网荷储一体化", "发电预测与负荷调度", "碳计量数据管理"]
  },
  automotive: {
    title: "车联网行业",
    description: "针对车辆实时监控、远程诊断...",
    highlights: ["V2X 实时数据交互", "车辆状态实时监控", "智慧交通管理"]
  },
  metallurgy: {
    title: "金属冶炼行业",
    description: "服务于钢铁、有色金属等冶炼企业...",
    highlights: ["生产全流程监控", "质量追溯体系", "工艺参数优化"]
  }
};
```

## HTML 结构

```html
<div class="dropdown-menu cases-dropdown">
    <div class="container">
        <div class="cases-dropdown-layout">
            <!-- 左侧面板 -->
            <div class="cases-industry-panel">
                <div class="industry-panel-content">
                    <h3 class="industry-title">...</h3>
                    <p class="industry-description">...</p>
                    <ul class="industry-highlights">
                        <li>...</li>
                    </ul>
                </div>
            </div>

            <!-- 右侧列表 -->
            <div class="cases-industry-list">
                <div class="mega-menu-list">
                    <a href="#" class="dropdown-item has-submenu" data-industry="iot">
                        <!-- 现有内容 -->
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>
```

## CSS 样式

### 关键样式

```css
/* 布局容器 */
.cases-dropdown-layout {
    display: flex;
    gap: 0;
    min-height: 320px;
}

/* 左侧面板 */
.cases-industry-panel {
    width: 320px;
    flex-shrink: 0;
    padding: 32px 24px;
    background: rgba(255, 255, 255, 0.95);
    border-right: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 12px 0 0 12px;
    backdrop-filter: blur(10px);
}

/* 淡入淡出动画 */
.industry-panel-content {
    opacity: 1;
    transition: opacity 0.3s ease;
}

.industry-panel-content.fade-out {
    opacity: 0;
}
```

## JavaScript 交互

### 交互流程

```
1. 下拉框打开 → 显示默认内容
2. 鼠标悬停行业项 → 触发淡出动画 (0.3s)
3. 更新内容 → 触发淡入动画
4. 子菜单悬停 → 保持当前内容不变
```

### 核心函数

```javascript
function initCasesDropdownPanel() {
    // 初始化
    const casesDropdown = document.querySelector('.cases-dropdown');
    const panelContent = casesDropdown.querySelector('.industry-panel-content');
    const industryItems = casesDropdown.querySelectorAll('[data-industry]');

    // 内容更新函数（带淡入淡出）
    function updatePanelContent(industryKey) {
        panelContent.classList.add('fade-out');
        setTimeout(() => {
            // 更新 DOM
            panelContent.classList.remove('fade-out');
        }, 300);
    }

    // 事件监听
    industryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            updatePanelContent(item.dataset.industry);
        });
    });
}
```

## 文件修改清单

| 文件 | 修改内容 |
|------|---------|
| `/components/navbar.html` | 调整客户案例下拉框结构，添加左侧面板 HTML |
| `/css/navigation-enhanced.css` | 添加 `.cases-dropdown-layout`、`.cases-industry-panel` 等样式 |
| `/js/main.js` | 添加 `initCasesDropdownPanel()` 函数及数据对象 |

## 实施检查清单

- [ ] 修改 `navbar.html` 客户案例下拉框结构
- [ ] 添加 CSS 样式到 `navigation-enhanced.css`
- [ ] 实现 JavaScript 交互逻辑
- [ ] 在各行业链接上添加 `data-industry` 属性
- [ ] 测试淡入淡出动画效果
- [ ] 验证响应式断点（平板/移动端隐藏）
- [ ] 确认子菜单悬停不触发内容更新
- [ ] 测试键盘导航可访问性
- [ ] 跨浏览器测试（Chrome、Safari、Firefox）
- [ ] 移动端真机测试

## 未来扩展

1. **国际化支持**：添加中英文切换
2. **动态内容加载**：从 CMS/API 获取内容
3. **点击展开**：移动端可考虑点击展开行业介绍
4. **视觉增强**：添加行业图标或背景图
