# Hero 轮播重构实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将首页 Hero 区域从静态内容重构为双 Banner 轮播组件（浅色/深色主题），支持自动播放和手动控制。

**Architecture:** 使用 CSS opacity 过渡实现淡入淡出效果，JavaScript 类封装轮播逻辑，保持与现有代码风格一致。

**Tech Stack:** 原生 HTML5 / CSS3 / Vanilla JavaScript（ES6+）

---

## Task 1: 添加 Hero 轮播 CSS 样式

**Files:**
- Modify: `css/style.css` (在 Hero 区域样式后添加轮播样式)

**Step 1: 添加轮播容器和幻灯片基础样式**

在 `css/style.css` 第 785 行 `.hero-content` 样式之前添加：

```css
/* Hero Carousel - 轮播容器 */
.hero-carousel {
    position: relative;
    width: 100%;
    min-height: 80vh;
    overflow: hidden;
}

/* 幻灯片 */
.hero-slide {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.6s ease-in-out, visibility 0.6s ease-in-out;
    z-index: 1;
}

.hero-slide.active {
    opacity: 1;
    visibility: visible;
    z-index: 2;
}

/* 背景层 */
.slide-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
}

.slide-background.light {
    background: linear-gradient(135deg, #E8F4FF 0%, #FFFFFF 100%);
}

.slide-background.dark {
    background: linear-gradient(135deg, #0A1628 0%, #1A2744 100%);
}

.bg-texture {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.3;
    position: absolute;
    top: 0;
    left: 0;
}
```

**Step 2: 添加 Hero 内容布局样式**

继续添加：

```css
/* Hero 内容布局 */
.hero-content {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
    padding: 120px 24px 80px;
    min-height: 80vh;
}

.hero-text {
    flex: 1;
    max-width: 600px;
}

.hero-graphics {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* 浅色主题文字样式 */
.hero-slide.light-theme .hero-text h1 {
    font-size: 3.5rem;
    font-weight: 800;
    color: #1A1A1A;
    margin-bottom: 16px;
    letter-spacing: -0.03em;
    line-height: 1.1;
}

.hero-slide.light-theme .hero-text .subtitle {
    font-size: 1.25rem;
    color: #666666;
    margin-bottom: 32px;
}

/* 深色主题文字样式 */
.hero-slide.dark-theme .hero-text h1 {
    font-size: 3.5rem;
    font-weight: 800;
    color: #FFFFFF;
    margin-bottom: 16px;
    letter-spacing: -0.03em;
    line-height: 1.1;
}

.hero-slide.dark-theme .hero-text .subtitle {
    font-size: 1.25rem;
    color: #B8C5D6;
    margin-bottom: 32px;
}

/* 深色主题按钮特殊样式 */
.hero-slide.dark-theme .btn-primary {
    background-color: #0056D2;
    border: 2px solid #FFFFFF;
}

.hero-slide.dark-theme .btn-primary:hover {
    background-color: #FFFFFF;
    color: #0056D2;
}
```

**Step 3: 添加图形元素和控制组件样式**

继续添加：

```css
/* KaiwuDB 卡片 (浅色版) */
.kaiwu-card {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 40px 60px;
    font-size: 2rem;
    font-weight: 800;
    color: #0056D2;
    box-shadow: 0 20px 60px rgba(0, 86, 210, 0.15);
    animation: float 3s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

/* 3D 几何元素容器 (深色版) */
.geo-3d-container {
    position: relative;
    width: 300px;
    height: 300px;
    perspective: 1000px;
}

.geo-shape {
    position: absolute;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    animation: rotate3d 20s linear infinite;
}

@keyframes rotate3d {
    from { transform: rotateY(0deg) rotateX(10deg); }
    to { transform: rotateY(360deg) rotateX(10deg); }
}

/* 轮播控制组件 */
.carousel-controls {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 16px;
}

.carousel-arrow {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(0, 0, 0, 0.1);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    color: #1A1A1A;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.carousel-arrow:hover {
    background: #FFFFFF;
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.carousel-indicators {
    display: flex;
    gap: 8px;
}

.indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
}

.indicator.active {
    background: #0056D2;
    transform: scale(1.2);
}
```

**Step 4: 添加响应式样式**

继续添加：

```css
/* 响应式 - 平板 */
@media (max-width: 1024px) {
    .hero-content {
        flex-direction: column;
        text-align: center;
    }

    .hero-text {
        max-width: 100%;
        margin-bottom: 40px;
    }

    .hero-graphics {
        width: 100%;
    }

    .hero-slide.light-theme .hero-text h1,
    .hero-slide.dark-theme .hero-text h1 {
        font-size: 2.5rem;
    }
}

/* 响应式 - 移动端 (仅显示文字) */
@media (max-width: 768px) {
    .hero-graphics {
        display: none;
    }

    .hero-content {
        padding: 80px 20px 60px;
        min-height: 60vh;
    }

    .hero-slide.light-theme .hero-text h1,
    .hero-slide.dark-theme .hero-text h1 {
        font-size: 2rem;
    }

    .hero-slide.light-theme .hero-text .subtitle,
    .hero-slide.dark-theme .hero-text .subtitle {
        font-size: 1rem;
    }

    .carousel-arrow {
        width: 40px;
        height: 40px;
    }

    .carousel-controls {
        bottom: 20px;
    }
}
```

**Step 5: 验证 CSS 添加成功**

预期结果: 文件已保存，样式已添加到 `css/style.css`

**Step 6: 提交 CSS 样式**

```bash
git add css/style.css
git commit -m "feat: add hero carousel base styles and animations"
```

---

## Task 2: 添加 HeroCarousel JavaScript 类

**Files:**
- Modify: `js/main.js` (在文件末尾添加轮播类)

**Step 1: 添加 HeroCarousel 类定义**

在 `js/main.js` 文件末尾（第 229 行之后）添加：

```javascript
/**
 * Hero 轮播组件
 * 支持自动播放、手动控制、淡入淡出过渡
 */
class HeroCarousel {
    constructor(container, options = {}) {
        this.container = container;
        this.slides = container.querySelectorAll('.hero-slide');
        this.indicators = container.querySelectorAll('.indicator');
        this.arrows = container.querySelectorAll('.carousel-arrow');

        this.currentIndex = 0;
        this.interval = options.interval || 5000;
        this.isPlaying = true;
        this.timer = null;

        this.init();
    }

    init() {
        this.showSlide(0);
        this.startAutoPlay();
        this.bindEvents();
    }

    showSlide(index) {
        // 移除所有激活状态
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.indicators.forEach(dot => dot.classList.remove('active'));

        // 激活当前幻灯片
        this.slides[index].classList.add('active');
        this.indicators[index].classList.add('active');
        this.currentIndex = index;
    }

    next() {
        const nextIndex = (this.currentIndex + 1) % this.slides.length;
        this.showSlide(nextIndex);
    }

    prev() {
        const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prevIndex);
    }

    goTo(index) {
        this.showSlide(index);
    }

    startAutoPlay() {
        this.timer = setInterval(() => this.next(), this.interval);
        this.isPlaying = true;
    }

    stopAutoPlay() {
        clearInterval(this.timer);
        this.isPlaying = false;
    }

    bindEvents() {
        // 箭头控制
        this.arrows.forEach(arrow => {
            arrow.addEventListener('click', () => {
                this.stopAutoPlay();
                if (arrow.classList.contains('next')) {
                    this.next();
                } else {
                    this.prev();
                }
                this.startAutoPlay();
            });
        });

        // 指示点控制
        this.indicators.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.stopAutoPlay();
                this.goTo(index);
                this.startAutoPlay();
            });
        });

        // 鼠标悬停暂停
        this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.container.addEventListener('mouseleave', () => {
            if (this.isPlaying) this.startAutoPlay();
        });

        // 页面可见性检测
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAutoPlay();
            } else if (this.isPlaying) {
                this.startAutoPlay();
            }
        });

        // 键盘控制
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.stopAutoPlay();
                this.prev();
                this.startAutoPlay();
            } else if (e.key === 'ArrowRight') {
                this.stopAutoPlay();
                this.next();
                this.startAutoPlay();
            }
        });
    }

    destroy() {
        this.stopAutoPlay();
        // 移除事件监听器（简化版，实际应保存引用后移除）
    }
}
```

**Step 2: 添加初始化代码**

在同一文件中，在 `DOMContentLoaded` 事件处理程序末尾（第 227 行 `loadComponent('footer-placeholder', 'components/footer.html');` 之后）添加：

```javascript
// 初始化 Hero 轮播
const heroCarousel = document.getElementById('heroCarousel');
if (heroCarousel) {
    new HeroCarousel(heroCarousel, { interval: 5000 });
}
```

**Step 3: 验证 JavaScript 添加成功**

预期结果: 文件已保存，HeroCarousel 类已定义并初始化

**Step 4: 提交 JavaScript 代码**

```bash
git add js/main.js
git commit -m "feat: add HeroCarousel class with auto-play and manual controls"
```

---

## Task 3: 修改 index.html Hero 区域为轮播结构

**Files:**
- Modify: `index.html` (替换第 18-72 行的 `.hero` section)

**Step 1: 替换 Hero 区域 HTML 结构**

将 `index.html` 第 18-72 行的整个 `<section class="hero">` 部分替换为：

```html
<!-- 首屏 Hero 轮播区域 -->
<section class="hero-carousel" id="heroCarousel">
    <!-- Banner 1: 浅色版 -->
    <div class="hero-slide light-theme active">
        <div class="slide-background light">
            <img src="img/banner-background1.jpg" alt="" class="bg-texture">
        </div>
        <div class="container">
            <div class="hero-content">
                <div class="hero-text">
                    <h1>新一代分布式多模数据库</h1>
                    <p class="subtitle">New Generation Distributed Multi-Model Database</p>
                    <a href="register.html" class="btn btn-primary">立即体验</a>
                </div>
                <div class="hero-graphics">
                    <div class="kaiwu-card">KaiwuDB</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Banner 2: 深色版 -->
    <div class="hero-slide dark-theme">
        <div class="slide-background dark">
            <img src="img/banner-background2.jpg" alt="" class="bg-texture">
        </div>
        <div class="container">
            <div class="hero-content">
                <div class="hero-text">
                    <h1>新一代分布式多模数据库</h1>
                    <p class="subtitle">New Generation Distributed Multi-Model Database</p>
                    <a href="register.html" class="btn btn-primary">立即体验</a>
                </div>
                <div class="hero-graphics">
                    <div class="geo-3d-container">
                        <div class="geo-shape">
                            <svg width="300" height="300" viewBox="0 0 300 300">
                                <defs>
                                    <linearGradient id="geoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" style="stop-color:#0056D2;stop-opacity:0.8" />
                                        <stop offset="100%" style="stop-color:#00A3FF;stop-opacity:0.6" />
                                    </linearGradient>
                                </defs>
                                <polygon points="150,30 270,90 270,210 150,270 30,210 30,90"
                                         fill="url(#geoGradient)"
                                         stroke="rgba(255,255,255,0.3)"
                                         stroke-width="2"/>
                                <polygon points="150,60 240,105 240,195 150,240 60,195 60,105"
                                         fill="none"
                                         stroke="rgba(255,255,255,0.2)"
                                         stroke-width="1"/>
                                <circle cx="150" cy="150" r="40" fill="rgba(255,255,255,0.1)"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 轮播控制组件 -->
    <div class="carousel-controls">
        <button class="carousel-arrow prev" aria-label="上一张">←</button>
        <div class="carousel-indicators">
            <button class="indicator active" aria-label="Banner 1"></button>
            <button class="indicator" aria-label="Banner 2"></button>
        </div>
        <button class="carousel-arrow next" aria-label="下一张">→</button>
    </div>
</section>
```

**Step 2: 验证 HTML 修改成功**

预期结果: Hero 区域已替换为轮播结构，包含两个幻灯片和控制组件

**Step 3: 提交 HTML 修改**

```bash
git add index.html
git commit -m "feat: replace hero section with carousel structure"
```

---

## Task 4: 测试和验证

**Files:**
- Test: 本地浏览器测试

**Step 1: 启动本地服务器**

```bash
python -m http.server 8000
```

预期结果: 服务器启动在 http://localhost:8000

**Step 2: 在浏览器中打开并验证**

访问 http://localhost:8000 并验证以下功能：

- [ ] 页面加载时第一个 Banner（浅色版）显示
- [ ] 5秒后自动切换到第二个 Banner（深色版）
- [ ] 两个 Banner 之间淡入淡出过渡流畅
- [ ] 点击左右箭头可以手动切换
- [ ] 点击底部指示点可以跳转到对应 Banner
- [ ] 鼠标悬停在轮播区域时暂停自动播放
- [ ] 鼠标离开后恢复自动播放
- [ ] 键盘左右箭头可以切换 Banner
- [ ] 移动端（宽度 < 768px）图形元素隐藏，仅显示文字
- [ ] CTA 按钮链接正确跳转到 register.html

**Step 3: 检查控制台错误**

打开浏览器开发者工具，检查：
- 无 JavaScript 错误
- 无 404 资源加载错误（背景图片正确加载）
- CSS 样式正确应用

**Step 4: 跨浏览器测试**

在以下浏览器中验证：
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (如果可用)

**Step 5: 响应式测试**

测试不同屏幕尺寸：
- [ ] 桌面版 (1920x1080)
- [ ] 平板 (768x1024)
- [ ] 移动端 (375x667)

**Step 6: 提交测试通过标记**

如果测试通过，添加最终提交：

```bash
git commit --allow-empty -m "test: hero carousel implementation verified and working"
```

---

## Task 5: 可选优化（根据需要）

**Files:**
- Modify: `css/style.css`, `js/main.js`

**Step 1: 添加触摸滑动支持（移动端）**

在 `HeroCarousel` 类的 `bindEvents()` 方法中添加：

```javascript
// 触摸滑动支持
let touchStartX = 0;
let touchEndX = 0;

this.container.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

this.container.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    this.handleSwipe();
}, { passive: true });

// 在类中添加 handleSwipe 方法
handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        this.stopAutoPlay();
        if (diff > 0) {
            this.next(); // 向左滑动，显示下一张
        } else {
            this.prev(); // 向右滑动，显示上一张
        }
        this.startAutoPlay();
    }
}
```

**Step 2: 添加加载状态优化**

在 CSS 中添加：

```css
.hero-carousel {
    /* 防止内容闪烁 */
    min-height: 600px;
}

.hero-slide {
    /* 添加淡入动画 */
    animation: slideFadeIn 0.8s ease-out;
}

@keyframes slideFadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

**Step 3: 提交优化代码**

```bash
git add css/style.css js/main.js
git commit -m "feat: add touch swipe support and loading animations"
```

---

## 完成清单

实施完成后，确认以下内容：

- [ ] CSS 样式已添加到 `css/style.css`
- [ ] HeroCarousel 类已添加到 `js/main.js`
- [ ] `index.html` Hero 区域已替换为轮播结构
- [ ] 背景图片文件存在于 `img/` 目录
- [ ] 所有功能测试通过
- [ ] 响应式设计在各尺寸正常工作
- [ ] 无控制台错误
- [ ] 代码已提交到 git

## 参考文档

- 设计文档: `docs/plans/2026-01-14-hero-carousel-refactor-design.md`
- 设计效果图: `design1.jpg`, `design2.jpg`
- 背景图片: `img/banner-background1.jpg`, `img/banner-background2.jpg`
