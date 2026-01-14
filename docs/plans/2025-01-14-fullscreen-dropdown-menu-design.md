# 全屏下拉菜单设计方案

**日期**: 2025-01-14
**项目**: KaiwuDB 官网导航栏优化

## 概述

优化导航栏下拉菜单，实现下拉菜单横向占满整个页面宽度，同时保持内容布局合理美观。

## 需求

- 下拉菜单横向占满整个屏幕宽度
- 内容布局合理，不显得空旷
- 产品菜单保持三列布局
- 其他下拉菜单使用多列网格布局（2-3列灵活调整）
- 下拉菜单与导航栏之间无缝连接

## 实现方案

### 方案选择

采用 **方案一：fixed 定位 + viewport 宽度**

**理由**：
- 实现简单，代码改动最小
- 性能好，不需要复杂的 JavaScript 计算
- 响应式友好，自动适应不同屏幕尺寸
- 可以精确控制列数和间距

---

## 第一部分：整体架构设计

### 核心定位策略

使用 `position: fixed` 配合 `width: 100vw` 实现全屏宽度。

**关键 CSS**:
```css
.dropdown-menu {
    position: fixed;
    left: 0;
    right: 0;
    width: 100vw;
    top: [导航栏底部动态计算];
}
```

**关键点**：
1. **顶部定位**: 动态获取导航栏实际高度（包括可关闭的通知栏）
2. **z-index**: 保持 `z-index: 1002`
3. **内容容器**: 内部使用 `.container` 约束内容宽度为 1200px

### JavaScript 辅助逻辑

```javascript
function updateDropdownTop() {
    const navbar = document.querySelector('.navbar');
    const navbarHeight = navbar.offsetHeight;
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.style.top = navbarHeight + 'px';
    });
}

// 在 hover 时和窗口 resize 时调用
```

---

## 第二部分：CSS 样式和布局设计

### 基础下拉菜单样式

```css
.dropdown-menu {
    position: fixed;
    left: 0;
    right: 0;
    width: 100vw;
    background-color: #FFFFFF;
    border-top: 1px solid rgba(0,0,0,0.08);
    box-shadow: 0 12px 32px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04);
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
    z-index: 1002;
}
```

**变化**：
- 移除 `transform: translateY()` 动画，改用 `opacity` 和 `visibility`
- 添加 `border-top` 替代原有的 `border`
- 移除 `border-radius`

### 内容容器约束

```css
.dropdown-menu .container {
    max-width: var(--container-width);
    margin: 0 auto;
    padding: 24px 32px;
}
```

### 产品菜单三列布局

```css
.product-mega-menu .container {
    display: flex;
    gap: 0;
}

.product-col {
    flex: 1;
    padding: 0 24px;
}
```

### 其他菜单网格布局

```css
.mega-menu-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 4px;
}

.community-dropdown .mega-menu-list {
    grid-template-columns: repeat(3, 1fr);
}
```

---

## 第三部分：响应式处理方案

### 断点策略

```css
@media (max-width: 1024px) {
    .dropdown-menu {
        position: absolute;
        width: auto;
        min-width: 280px;
        left: auto;
        right: 0;
    }

    .mega-menu-list {
        grid-template-columns: 1fr;
    }
}
```

### 移动端处理

```css
@media (max-width: 768px) {
    .dropdown-menu {
        display: none;
    }
}
```

### JavaScript 响应式处理

```javascript
window.addEventListener('resize', debounce(updateDropdownTop, 100));
window.addEventListener('scroll', throttle(updateDropdownTop, 50));
```

---

## 第四部分：交互和动画效果

### 显示/隐藏动画

```css
.dropdown-menu {
    opacity: 0;
    visibility: hidden;
    transform: translateY(-8px);
    transition: opacity 0.2s ease,
                transform 0.2s ease,
                visibility 0s linear 0.2s;
}

.nav-item:hover .dropdown-menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
    transition: opacity 0.2s ease,
                transform 0.2s ease,
                visibility 0s;
}
```

### 菜单项悬停效果

```css
.dropdown-item {
    transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-item:hover {
    background-color: var(--color-bg-secondary);
    transform: translateX(4px);
}
```

### 无缝连接优化

```css
.navbar {
    border-bottom: 1px solid transparent;
    transition: border-bottom-color 0.2s;
}

.navbar.has-dropdown-open {
    border-bottom-color: rgba(0,0,0,0.08);
}
```

### JavaScript 状态管理

```javascript
document.querySelectorAll('.nav-item.has-dropdown').forEach(item => {
    item.addEventListener('mouseenter', () => {
        document.querySelector('.navbar').classList.add('has-dropdown-open');
        updateDropdownTop();
    });
    item.addEventListener('mouseleave', () => {
        document.querySelector('.navbar').classList.remove('has-dropdown-open');
    });
});
```

---

## 文件修改清单

### 1. `css/style.css`
- 修改 `.dropdown-menu` 基础样式
- 添加响应式断点处理
- 更新 `.product-mega-menu` 布局
- 添加 `.mega-menu-list` 网格布局
- 更新悬停动画效果

### 2. `js/main.js`
- 添加 `updateDropdownTop()` 函数
- 添加窗口 resize 和 scroll 事件监听
- 添加导航栏状态管理

### 3. `components/navbar.html`
- 为下拉菜单添加 `.container` 包装器（如需要）

---

## 实施注意事项

1. **工具函数**: 需要实现 `debounce` 和 `throttle` 工具函数
2. **性能优化**: scroll 事件使用 throttle 避免过度触发
3. **通知栏处理**: 当通知栏关闭时，需要重新计算下拉菜单位置
4. **测试**: 在不同屏幕尺寸下测试下拉菜单显示效果
