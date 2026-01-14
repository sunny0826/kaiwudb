/**
 * 页面交互逻辑
 * 包含：Tab切换、导航吸顶、汉堡菜单、顶部通知栏、组件加载
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. 初始化通用逻辑 (Initial Common Logic)
    const initCommon = () => {
        // 应用场景 Tab 切换 (Tab Switching)
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // 移除所有激活状态
                tabBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                tabPanels.forEach(p => p.classList.remove('active'));

                // 激活当前点击的 Tab
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');
                
                const panelId = btn.getAttribute('aria-controls');
                const panel = document.getElementById(panelId);
                if (panel) {
                    panel.classList.add('active');
                }
            });
        });

        // 平滑滚动 (Smooth Scroll for Anchor Links)
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href !== "#") {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({
                            behavior: 'smooth'
                        });
                        // 移动端点击后关闭菜单
                        const navbar = document.querySelector('.navbar');
                        if (navbar) navbar.classList.remove('nav-active');
                    }
                }
            });
        });
    };

    // 2. 初始化导航栏逻辑 (Initial Navbar Logic)
    const initNavbarLogic = () => {
        // 工具函数：debounce 和 throttle
        const debounce = (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        };

        const throttle = (func, limit) => {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        };

        // 更新下拉菜单位置
        const updateDropdownTop = () => {
            const navbar = document.querySelector('.navbar');
            if (!navbar) return;

            const navbarHeight = navbar.offsetHeight;
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.style.top = navbarHeight + 'px';
            });
        };

        // 顶部通知栏关闭逻辑
        const notification = document.getElementById('top-notification');
        const closeBtn = document.querySelector('.notification-close');

        if (closeBtn && notification) {
            closeBtn.addEventListener('click', () => {
                notification.style.display = 'none';
                // 通知栏关闭后，更新下拉菜单位置
                setTimeout(updateDropdownTop, 100);
            });
        }

        // 导航栏滚动吸顶效果
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                // 滚动时更新下拉菜单位置
                updateDropdownTop();
            });
        }

        // 下拉菜单 hover 状态管理
        const navItemsWithDropdown = document.querySelectorAll('.nav-item.has-dropdown');
        navItemsWithDropdown.forEach(item => {
            item.addEventListener('mouseenter', () => {
                if (navbar) navbar.classList.add('has-dropdown-open');
                updateDropdownTop();
            });
            item.addEventListener('mouseleave', () => {
                if (navbar) navbar.classList.remove('has-dropdown-open');
            });
        });

        // 窗口 resize 时更新下拉菜单位置
        window.addEventListener('resize', debounce(updateDropdownTop, 100));

        // 移动端菜单切换 (Mobile Menu Toggle)
        const hamburger = document.querySelector('.hamburger');
        if (hamburger) {
            hamburger.addEventListener('click', (e) => {
                e.stopPropagation();
                const navbarEl = document.querySelector('.navbar');
                hamburger.classList.toggle('active');
                if (navbarEl) navbarEl.classList.toggle('mobile-menu-active');
            });
        }

        // 移动端下拉菜单切换 (Mobile Dropdown Toggle)
        const navItems = document.querySelectorAll('.nav-item.has-dropdown');
        navItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            if (link) {
                link.addEventListener('click', (e) => {
                    if (window.innerWidth <= 767) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // 关闭其他已打开的菜单
                        navItems.forEach(otherItem => {
                            if (otherItem !== item) {
                                otherItem.classList.remove('active');
                            }
                        });
                        
                        item.classList.toggle('active');
                    }
                });
            }
        });

        // 点击页面其他区域关闭移动端菜单
        document.addEventListener('click', (e) => {
            const navbarEl = document.querySelector('.navbar');
            const hamburger = document.querySelector('.hamburger');
            if (navbarEl && navbarEl.classList.contains('mobile-menu-active') && 
                !navbarEl.contains(e.target) && !hamburger.contains(e.target)) {
                navbarEl.classList.remove('mobile-menu-active');
                hamburger.classList.remove('active');
            }
        });

        // 监听屏幕尺寸变化，重置状态
        window.addEventListener('resize', () => {
            if (window.innerWidth > 767) {
                const navbarEl = document.querySelector('.navbar');
                const hamburger = document.querySelector('.hamburger');
                if (navbarEl) navbarEl.classList.remove('mobile-menu-active');
                if (hamburger) hamburger.classList.remove('active');
                document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
            }
        });
    };

    // 3. 加载组件 (Load Components)
    const loadComponent = async (placeholderId, componentPath) => {
        const placeholder = document.getElementById(placeholderId);
        if (!placeholder) return;

        // 判断当前页面深度，计算根目录路径
        const isInDocs = window.location.pathname.includes('/docs/');
        const rootPath = isInDocs ? '../' : '';

        try {
            const response = await fetch(`${rootPath}${componentPath}`);
            if (response.ok) {
                const html = await response.text();
                placeholder.innerHTML = html;
                
                // 动态调整组件中的链接
                if (isInDocs) {
                    placeholder.querySelectorAll('[data-nav-link]').forEach(link => {
                        const href = link.getAttribute('href');
                        if (href && !href.startsWith('http') && !href.startsWith('mailto') && !href.startsWith('#')) {
                            link.setAttribute('href', '../' + href);
                        }
                    });
                }

                // 如果是加载导航栏，初始化其逻辑
                if (placeholderId === 'navbar-placeholder') {
                    initNavbarLogic();
                }
            }
        } catch (error) {
            console.error(`Error loading component (${componentPath}):`, error);
        }
    };

    // 4. 执行初始化 (Execute Initialization)
    initCommon();
    loadComponent('navbar-placeholder', 'components/navbar.html');
    loadComponent('footer-placeholder', 'components/footer.html');

    // 5. 初始化 Hero 轮播
    const heroCarousel = document.getElementById('heroCarousel');
    if (heroCarousel) {
        new HeroCarousel(heroCarousel, { interval: 10000 });
    }

    // 6. 初始化 KaiwuDB 优势区域手风琴
    initAdvantagesAccordion();
});

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

/**
 * ========================================
 * KaiwuDB 优势区域手风琴功能
 * ========================================
 */

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
 * @param {HTMLElement} header - 被点击的手风琴头部元素
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
