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

    // 7. 初始化成功案例
    initSuccessStories();
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

/**
 * ========================================
 * 成功案例 / Success Stories
 * ========================================
 */

/**
 * 案例数据
 */
const successCasesData = [
    {
        id: 1,
        customer: "重工集团",
        logo: "重工",
        scenario: "工业物联网",
        scenarioTag: "iot",
        summary: "针对重工制造场景，提供设备全生命周期管理解决方案，实现预测性维护与生产全流程监控。",
        highlights: [
            { icon: "📊", label: "1000+ 台设备接入" },
            { icon: "⚡", label: "毫秒级实时监控" },
            { icon: "🎯", label: "故障预测准确率 95%" },
            { icon: "📉", label: "运维成本降低 30%" }
        ],
        ctaLink: "products.html"
    },
    {
        id: 2,
        customer: "市大数据局",
        logo: "大数据",
        scenario: "数字能源",
        scenarioTag: "energy",
        summary: "为城市数字能源管理提供数据支撑，实现精准碳计量与能源调度优化。",
        highlights: [
            { icon: "🏙️", label: "覆盖 500+ 公共建筑" },
            { icon: "🌱", label: "碳计量精度 99.9%" },
            { icon: "⚡", label: "节能效率提升 25%" },
            { icon: "📈", label: "日均处理 10TB 数据" }
        ],
        ctaLink: "products.html"
    },
    {
        id: 3,
        customer: "电网能源",
        logo: "电网",
        scenario: "数字能源",
        scenarioTag: "energy",
        summary: "面向风电、光伏、电网等领域，高效处理海量测点数据，支持削峰填谷智能调度。",
        highlights: [
            { icon: "⚡", label: "接入 10000+ 测点" },
            { icon: "🔄", label: "数据采集频率 100Hz" },
            { icon: "📊", label: "调度响应时间 <100ms" },
            { icon: "🎯", label: "负荷预测准确率 96%" }
        ],
        ctaLink: "products.html"
    },
    {
        id: 4,
        customer: "超级工厂",
        logo: "工厂",
        scenario: "工业物联网",
        scenarioTag: "iot",
        summary: "为大型制造企业提供综合能源管理，实现生产用能优化与碳排放追踪。",
        highlights: [
            { icon: "🏭", label: "管理 50+ 生产线" },
            { icon: "⚡", label: "能耗降低 18%" },
            { icon: "🎯", label: "异常检测响应 <5s" },
            { icon: "📊", label: "月度能耗报告自动化" }
        ],
        ctaLink: "products.html"
    },
    {
        id: 5,
        customer: "智慧矿山",
        logo: "矿山",
        scenario: "智慧产业",
        scenarioTag: "smart-industry",
        summary: "赋能矿山安全生产监控，实现人员定位、设备监测与环境感知一体化。",
        highlights: [
            { icon: "⛰️", label: "覆盖 20km² 作业区" },
            { icon: "👷", label: "实时定位 500+ 人员" },
            { icon: "🚨", label: "危险预警准确率 98%" },
            { icon: "📡", label: "井下信号全覆盖" }
        ],
        ctaLink: "products.html"
    },
    {
        id: 6,
        customer: "智慧水务",
        logo: "水务",
        scenario: "智慧产业",
        scenarioTag: "smart-industry",
        summary: "通过管网压力、流量数据分析，实现漏损监测与智能调度，降低产销差。",
        highlights: [
            { icon: "💧", label: "管网长度 5000+ km" },
            { icon: "🔍", label: "漏损检测精度 95%" },
            { icon: "📉", label: "产销差降低 15%" },
            { icon: "⚡", label: "异常定位时间 <10min" }
        ],
        ctaLink: "products.html"
    }
];

/**
 * 当前选中的案例索引
 */
let currentCaseIndex = 0;

/**
 * 初始化成功案例功能
 */
function initSuccessStories() {
    const successStoriesSection = document.querySelector('.success-stories');
    if (!successStoriesSection) return;

    // 渲染案例列表
    renderCaseList();

    // 渲染初始案例详情
    renderCaseDetail(0);

    // 绑定案例卡片点击事件
    bindCaseCardEvents();

    // 检测移动端，添加模态框支持
    initMobileModal();
}

/**
 * 渲染案例列表
 */
function renderCaseList() {
    const caseListContainer = document.querySelector('.case-list');
    if (!caseListContainer) return;

    caseListContainer.innerHTML = successCasesData.map((caseItem, index) => `
        <div class="case-card ${index === 0 ? 'active' : ''}" data-case-id="${caseItem.id}" data-index="${index}">
            <div class="case-card-logo">${caseItem.logo}</div>
            <div class="case-card-content">
                <div class="case-card-name">${caseItem.customer}</div>
                <div class="case-card-scenario">${caseItem.scenario}</div>
            </div>
        </div>
    `).join('');
}

/**
 * 渲染案例详情
 * @param {number} index - 案例索引
 */
function renderCaseDetail(index) {
    const detailPanel = document.querySelector('.case-detail-panel');
    if (!detailPanel) return;

    const caseItem = successCasesData[index];
    if (!caseItem) return;

    // 重新触发动画
    detailPanel.style.animation = 'none';
    detailPanel.offsetHeight; // 触发重排
    detailPanel.style.animation = 'fadeInSlide 0.4s ease forwards';

    detailPanel.innerHTML = `
        <div class="case-detail-logo">${caseItem.logo}</div>
        <h2 class="case-detail-title">${caseItem.customer}</h2>
        <span class="case-detail-scenario" data-scenario-tag="${caseItem.scenarioTag}">${caseItem.scenario}</span>
        <p class="case-detail-summary">${caseItem.summary}</p>
        <div class="case-detail-highlights">
            ${caseItem.highlights.map(h => `
                <div class="highlight-item">
                    <span class="highlight-icon">${h.icon}</span>
                    <span class="highlight-text">${h.label}</span>
                </div>
            `).join('')}
        </div>
        <a href="${caseItem.ctaLink}" class="case-detail-cta">了解更多案例详情 →</a>
    `;
}

/**
 * 绑定案例卡片点击事件
 */
function bindCaseCardEvents() {
    const caseCards = document.querySelectorAll('.case-card');
    caseCards.forEach(card => {
        card.addEventListener('click', () => {
            const index = parseInt(card.dataset.index);
            switchToCase(index);
        });

        // 键盘支持
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const index = parseInt(card.dataset.index);
                switchToCase(index);
            }
        });
    });

    // 场景标签点击筛选
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('case-detail-scenario')) {
            const scenarioTag = e.target.dataset.scenarioTag;
            filterByScenario(scenarioTag);
        }
    });

    // 键盘方向键支持
    document.addEventListener('keydown', (e) => {
        const successStoriesSection = document.querySelector('.success-stories');
        if (!successStoriesSection) return;

        // 只在用户聚焦于案例区域时响应
        const activeCard = document.querySelector('.case-card.active');
        if (!activeCard) return;

        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            const nextIndex = (currentCaseIndex + 1) % successCasesData.length;
            switchToCase(nextIndex);
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            const prevIndex = (currentCaseIndex - 1 + successCasesData.length) % successCasesData.length;
            switchToCase(prevIndex);
        }
    });
}

/**
 * 切换到指定案例
 * @param {number} index - 案例索引
 */
function switchToCase(index) {
    if (index < 0 || index >= successCasesData.length) return;

    currentCaseIndex = index;

    // 更新卡片激活状态
    const caseCards = document.querySelectorAll('.case-card');
    caseCards.forEach((card, i) => {
        if (i === index) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });

    // 更新详情面板
    renderCaseDetail(index);
}

/**
 * 按场景筛选案例
 * @param {string} scenarioTag - 场景标签
 */
function filterByScenario(scenarioTag) {
    const filteredIndex = successCasesData.findIndex(c => c.scenarioTag === scenarioTag);
    if (filteredIndex !== -1) {
        switchToCase(filteredIndex);
    }
}

/**
 * 初始化移动端模态框
 */
function initMobileModal() {
    // 检查是否为移动端
    const isMobile = () => window.innerWidth < 768;

    // 为移动端创建模态框结构
    if (isMobile() && !document.querySelector('.case-detail-modal')) {
        const modal = document.createElement('div');
        modal.className = 'case-detail-modal';
        modal.innerHTML = `
            <button class="modal-close" aria-label="关闭">×</button>
            <div class="modal-content">
                <div class="case-detail-panel-inner"></div>
            </div>
        `;
        document.body.appendChild(modal);

        // 关闭按钮事件
        modal.querySelector('.modal-close').addEventListener('click', closeModal);

        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // ESC 键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // 移动端点击卡片打开模态框
    const caseCards = document.querySelectorAll('.case-card');
    caseCards.forEach((card, index) => {
        card.addEventListener('click', (e) => {
            if (isMobile()) {
                e.preventDefault();
                openModal(index);
            }
        });
    });
}

/**
 * 打开模态框
 * @param {number} index - 案例索引
 */
function openModal(index) {
    const modal = document.querySelector('.case-detail-modal');
    if (!modal) return;

    const caseItem = successCasesData[index];
    const contentInner = modal.querySelector('.case-detail-panel-inner');

    contentInner.innerHTML = `
        <div class="case-detail-logo">${caseItem.logo}</div>
        <h2 class="case-detail-title">${caseItem.customer}</h2>
        <span class="case-detail-scenario">${caseItem.scenario}</span>
        <p class="case-detail-summary">${caseItem.summary}</p>
        <div class="case-detail-highlights">
            ${caseItem.highlights.map(h => `
                <div class="highlight-item">
                    <span class="highlight-icon">${h.icon}</span>
                    <span class="highlight-text">${h.label}</span>
                </div>
            `).join('')}
        </div>
        <a href="${caseItem.ctaLink}" class="case-detail-cta">了解更多案例详情 →</a>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * 关闭模态框
 */
function closeModal() {
    const modal = document.querySelector('.case-detail-modal');
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// 监听窗口大小变化
window.addEventListener('resize', () => {
    const modal = document.querySelector('.case-detail-modal');
    if (window.innerWidth >= 768 && modal && modal.classList.contains('active')) {
        closeModal();
    }
});