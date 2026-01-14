# Hero 区域轮播重构设计方案

**日期**: 2026-01-14
**设计师**: Claude Code
**状态**: 待实现

## 概述

将 KaiwuDB 官网首页 Hero 区域重构为双 Banner 轮播组件，提供两种视觉风格（浅色/深色）的动态切换，增强视觉吸引力和品牌表现力。

## 设计要求

- 两个设计方案作为轮播切换的两个版本
- 自动播放（5秒间隔）+ 手动控制
- 淡入淡出过渡效果
- 移动端仅显示文字内容，隐藏图形元素

## 架构设计

### HTML 结构

```html
<section class="hero-carousel" id="heroCarousel">
  <!-- Banner 1: 浅色版 -->
  <div class="hero-slide active">
    <div class="slide-background light">
      <img src="img/banner-background1.jpg" alt="" class="bg-texture">
    </div>
    <div class="container">
      <div class="hero-content">
        <div class="hero-text">
          <h1>新一代分布式多模数据库</h1>
          <p class="subtitle">New Generation Distributed Multi-Model Database</p>
          <a href="#" class="btn btn-primary">立即体验</a>
        </div>
        <div class="hero-graphics">
          <div class="kaiwu-card">KaiwuDB</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Banner 2: 深色版 -->
  <div class="hero-slide">
    <div class="slide-background dark">
      <img src="img/banner-background2.jpg" alt="" class="bg-texture">
    </div>
    <div class="container">
      <div class="hero-content">
        <div class="hero-text">
          <h1>新一代分布式多模数据库</h1>
          <p class="subtitle">New Generation Distributed Multi-Model Database</p>
          <a href="#" class="btn btn-primary">立即体验</a>
        </div>
        <div class="hero-graphics">
          <!-- 3D 几何元素 -->
        </div>
      </div>
    </div>
  </div>

  <!-- 控制组件 -->
  <button class="carousel-arrow prev" aria-label="上一张">←</button>
  <button class="carousel-arrow next" aria-label="下一张">→</button>
  <div class="carousel-indicators">
    <button class="indicator active" aria-label="Banner 1"></button>
    <button class="indicator" aria-label="Banner 2"></button>
  </div>
</section>
```

### CSS 架构

**容器层级**：
- `.hero-carousel`: 固定高度 500-600px，`position: relative`
- `.hero-slide`: `position: absolute`，默认 `opacity: 0`，`.active` 时 `opacity: 1`
- 过渡时间：600-800ms `ease-in-out`

**Banner 1（浅色版）样式**：
```css
.slide-background.light {
  background: linear-gradient(135deg, #E8F4FF 0%, #FFFFFF 100%);
}

.hero-text h1 {
  color: #1A1A1A;
}

.hero-text .subtitle {
  color: #666666;
}

.btn-primary {
  background: #0056D2;
  box-shadow: 0 4px 12px rgba(0, 86, 210, 0.3);
}

.kaiwu-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  animation: float 3s ease-in-out infinite;
}
```

**Banner 2（深色版）样式**：
```css
.slide-background.dark {
  background: linear-gradient(135deg, #0A1628 0%, #1A2744 100%);
}

.hero-text h1 {
  color: #FFFFFF;
}

.hero-text .subtitle {
  color: #B8C5D6;
}

.btn-primary {
  border: 2px solid #FFFFFF;
}
```

**响应式处理**：
```css
@media (max-width: 768px) {
  .hero-graphics {
    display: none;
  }

  .hero-content {
    text-align: center;
  }

  .hero-text h1 {
    font-size: 32px;
  }

  .hero-text .subtitle {
    font-size: 16px;
  }
}
```

### JavaScript 交互逻辑

```javascript
class HeroCarousel {
  constructor(container) {
    this.slides = container.querySelectorAll('.hero-slide');
    this.indicators = container.querySelectorAll('.indicator');
    this.arrows = container.querySelectorAll('.carousel-arrow');
    this.currentIndex = 0;
    this.interval = 5000;
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
    this.slides.forEach(slide => slide.classList.remove('active'));
    this.indicators.forEach(dot => dot.classList.remove('active'));

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
        if (arrow.classList.contains('next')) this.next();
        else this.prev();
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
    const container = this.slides[0].parentElement;
    container.addEventListener('mouseenter', () => this.stopAutoPlay());
    container.addEventListener('mouseleave', () => this.startAutoPlay());

    // 页面可见性
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.stopAutoPlay();
      else if (this.isPlaying) this.startAutoPlay();
    });

    // 键盘控制（可选）
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
}
```

## 文件修改清单

### 需要修改的文件

1. **index.html**
   - 替换现有 `.hero` section 为新的 `.hero-carousel` 结构
   - 添加两个 `.hero-slide` 及控制组件

2. **css/style.css**
   - 添加 `.hero-carousel` 相关样式
   - 添加 `.hero-slide` 过渡动画
   - 添加浅色/深色主题样式
   - 添加响应式断点
   - 添加控制组件样式（箭头、指示点）

3. **js/main.js**
   - 添加 `HeroCarousel` 类定义
   - 在 DOMContentLoaded 事件中初始化轮播

### 新增文件

无需新增文件，所有代码整合到现有文件中。

## 实现优先级

1. **高优先级**：核心 HTML 结构 + CSS 基础样式 + JavaScript 轮播逻辑
2. **中优先级**：响应式适配、动画效果优化
3. **低优先级**：键盘控制、高级动画效果

## 测试要点

- [ ] 两个 Banner 能正确切换
- [ ] 自动播放功能正常（5秒间隔）
- [ ] 手动控制（箭头、指示点）正常工作
- [ ] 鼠标悬停时暂停播放
- [ ] 页面失焦/隐藏时暂停播放
- [ ] 移动端图形元素正确隐藏
- [ ] 过渡动画流畅无卡顿
- [ ] 无障碍性（ARIA 标签、键盘导航）

## 设计参考

- 设计效果图: `design1.jpg`（浅色版）、`design2.jpg`（深色版）
- 背景图: `img/banner-background1.jpg`、`img/banner-background2.jpg`
