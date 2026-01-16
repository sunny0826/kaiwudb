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
                    initScenariosDropdownPanel();
                    initCasesDropdownPanel();
                    initConsultationLogic();
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

    // 8. 初始化社区板块
    initCommunitySection();
    
    // 9. 初始化技术创新 Tab (New Feature)
    initTechInnovationTabs();

    // 10. 初始化 Lucide 图标
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

/**
 * ========================================
 * 技术创新 Tab 功能 (Tech Innovation Tabs)
 * ========================================
 */
function initTechInnovationTabs() {
    const section = document.getElementById('section-tech-innovation');
    if (!section) return;

    const tabBtns = section.querySelectorAll('.tech-tab-btn');
    const tabPanels = section.querySelectorAll('.tech-tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;

            // Update Buttons
            tabBtns.forEach(b => {
                const isActive = b.dataset.tab === targetTab;
                b.classList.toggle('active', isActive);
                b.setAttribute('aria-selected', isActive);
            });

            // Update Panels
            tabPanels.forEach(panel => {
                const isActive = panel.dataset.tab === targetTab;
                panel.classList.toggle('active', isActive);
                
                // For accessibility
                if (isActive) {
                    panel.style.visibility = 'visible';
                    panel.style.opacity = '1';
                } else {
                    panel.style.visibility = 'hidden';
                    panel.style.opacity = '0';
                }
            });
        });
    });
}

/**
 * ========================================
 * 社区板块功能 (Community Section)
 * ========================================
 */

let currentFeedPage = 0;
const FEED_PAGE_SIZE = 2; // 每次加载 2 条

/**
 * 初始化社区板块
 */
function initCommunitySection() {
    const section = document.getElementById('community-section');
    if (!section) return;

    // 1. 初始化数字动画
    initStatsCounter();

    // 2. 加载初始动态
    loadMoreFeed();

    // 3. 绑定加载更多按钮
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            loadMoreBtn.classList.add('loading');
            // 模拟网络延迟
            setTimeout(() => {
                loadMoreFeed();
                loadMoreBtn.classList.remove('loading');
            }, 800);
        });
    }
}

/**
 * 统计数字滚动动画
 */
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const endValue = parseInt(target.getAttribute('data-target'));
                animateValue(target, 0, endValue, 2000);
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        
        // 格式化数字 (每3位加逗号)
        obj.innerHTML = value.toLocaleString();
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            // 确保显示加号
            obj.innerHTML = end.toLocaleString() + '+';
        }
    };
    window.requestAnimationFrame(step);
}

/**
 * 加载更多动态
 */
function loadMoreFeed() {
    const grid = document.getElementById('communityFeedGrid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (!grid) return;

    const start = currentFeedPage * FEED_PAGE_SIZE;
    const end = start + FEED_PAGE_SIZE;
    const items = communityFeedData.slice(start, end);

    if (items.length === 0) {
        if (loadMoreBtn) {
            loadMoreBtn.textContent = "没有更多内容了";
            loadMoreBtn.disabled = true;
        }
        return;
    }

    items.forEach(item => {
        const card = createFeedCard(item);
        grid.appendChild(card);
    });

    // 重新初始化图标
    if (typeof lucide !== 'undefined') {
        lucide.createIcons({
            attrs: {
                class: 'lucide-icon'
            }
        });
    }

    currentFeedPage++;

    // 检查是否还有更多
    if (currentFeedPage * FEED_PAGE_SIZE >= communityFeedData.length) {
        if (loadMoreBtn) {
            loadMoreBtn.style.display = 'none';
        }
    }
}

/**
 * 创建动态卡片 HTML
 */
function createFeedCard(item) {
    const article = document.createElement('article');
    article.className = 'feed-card';
    article.innerHTML = `
        <div class="feed-meta">
            <span class="feed-tag">${item.tag}</span>
            <time class="feed-date">${item.date}</time>
        </div>
        <h4 class="feed-content-title">${item.title}</h4>
        <p class="feed-excerpt">${item.excerpt}</p>
        <div class="feed-footer">
            <div class="feed-author">
                <div class="author-avatar">${item.author[0]}</div>
                <span>${item.author}</span>
            </div>
            <div class="feed-interactions">
                <button class="interaction-btn like-btn" onclick="toggleLike(this)">
                    <i data-lucide="heart" size="16"></i>
                    <span>${item.likes}</span>
                </button>
                <button class="interaction-btn comment-btn">
                    <i data-lucide="message-square" size="16"></i>
                    <span>${item.comments}</span>
                </button>
            </div>
        </div>
    `;
    return article;
}

/**
 * 点赞交互 (全局暴露给 onclick)
 */
window.toggleLike = function(btn) {
    const countSpan = btn.querySelector('span');
    let count = parseInt(countSpan.textContent);
    
    if (btn.classList.contains('active')) {
        btn.classList.remove('active');
        count--;
        const icon = btn.querySelector('svg');
        if (icon) icon.setAttribute('fill', 'none');
    } else {
        btn.classList.add('active');
        count++;
        const icon = btn.querySelector('svg');
        if (icon) icon.setAttribute('fill', 'currentColor');
        
        // 简单的点赞动画
        btn.style.transform = 'scale(1.2)';
        setTimeout(() => btn.style.transform = 'scale(1)', 200);
    }
    
    countSpan.textContent = count;
};

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
 * 解决方案下拉框介绍面板功能
 */
const scenarioContent = {
    default: {
        title: "深耕行业，赋能未来",
        description: "KaiwuDB 针对不同行业场景提供定制化解决方案，实现数据价值最大化。",
        highlights: ["工业级稳定性，PB 级扩展", "毫秒级响应，实时分析", "原生 AI 驱动，智能预测"]
    },
    iot: {
        title: "物联网解决方案",
        description: "针对工业物联网海量设备、高并发写入场景，提供设备全生命周期管理，实现预测性维护与生产全流程监控。",
        highlights: ["百万级 TPS 写入", "边缘计算支持", "多协议解析"]
    },
    energy: {
        title: "能源电力解决方案",
        description: "面向新能源发电、智能电网等领域，支持削峰填谷智能调度与精准碳计量，助力能源结构转型。",
        highlights: ["源网荷储一体化", "分钟级调度预测", "多维碳足迹分析"]
    },
    automotive: {
        title: "车联网解决方案",
        description: "针对车辆实时监控、远程诊断、智慧交通等场景，提供 V2X 数据处理与车辆状态分析能力。",
        highlights: ["低延迟数据交换", "车辆实时状态分析", "云边端协同架构"]
    },
    metallurgy: {
        title: "金属冶炼解决方案",
        description: "服务于钢铁、有色金属等冶炼企业，实现生产全流程数字化监控、质量追溯与工艺参数优化。",
        highlights: ["生产线数字化孪生", "全生命周期质量监控", "AI 辅助工艺优化"]
    },
    tobacco: {
        title: "智慧烟草解决方案",
        description: "赋能烟草行业数字化转型，实现生产全流程精益化管理，提升生产效率与产品质量。",
        highlights: ["精益化生产管理", "设备故障自动诊断", "全链条质量追溯"]
    }
};

/**
 * 初始化解决方案下拉框面板功能
 */
function initScenariosDropdownPanel() {
    const scenariosDropdown = document.querySelector('.scenarios-dropdown');
    if (!scenariosDropdown) return;

    const panelContent = scenariosDropdown.querySelector('.industry-panel-content');
    if (!panelContent) return;

    const scenarioItems = scenariosDropdown.querySelectorAll('[data-scenario]');

    // 内容更新函数
    function updatePanelContent(scenarioKey) {
        const content = scenarioContent[scenarioKey] || scenarioContent.default;

        panelContent.classList.add('fade-out');

        setTimeout(() => {
            const titleEl = panelContent.querySelector('.industry-title');
            if (titleEl) titleEl.textContent = content.title;

            const descEl = panelContent.querySelector('.industry-description');
            if (descEl) descEl.textContent = content.description;

            const highlightsEl = panelContent.querySelector('.industry-highlights');
            if (highlightsEl) {
                highlightsEl.innerHTML = content.highlights.map(h => `<li>${h}</li>`).join('');
            }

            panelContent.classList.remove('fade-out');
        }, 300);
    }

    scenarioItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const scenarioKey = item.dataset.scenario;
            if (scenarioKey) {
                updatePanelContent(scenarioKey);
            }
        });
    });

    const navItem = scenariosDropdown.closest('.nav-item');
    if (navItem) {
        navItem.addEventListener('mouseleave', () => {
            setTimeout(() => {
                updatePanelContent('default');
            }, 200);
        });
    }
}

/**
 * 初始化 1v1 咨询点击逻辑
 */
function initConsultationLogic() {
    const btn = document.getElementById('btn-consultation');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        // 模拟触发在线客服弹窗
        alert('正在为您连接 1v1 专属技术顾问，请稍候...');
        
        // 点击后自动收起下拉菜单
        const dropdown = btn.closest('.dropdown-menu');
        if (dropdown) {
            dropdown.style.opacity = '0';
            dropdown.style.visibility = 'hidden';
            setTimeout(() => {
                dropdown.style.opacity = '';
                dropdown.style.visibility = '';
            }, 300);
        }
    });
}

/**
 * ========================================
 * 客户案例下拉框行业价值面板功能
 * ========================================
 */

/**
 * 行业内容数据
 */
const industryContent = {
    default: {
        title: "赋能千行百业数字化转型",
        description: "KaiwuDB 作为分布式多模融合数据库，为各行业客户提供一站式数据存储、管理与分析的基座，助力企业实现数字化转型。",
        highlights: ["多模融合，一库多用", "分布式架构，弹性扩展", "AI 智能优化，越用越快"]
    },
    iot: {
        title: "物联网行业",
        description: "针对工业物联网海量设备、高并发写入场景，提供设备全生命周期管理解决方案，实现预测性维护与生产全流程监控。",
        highlights: ["百万级 TPS 写入", "毫秒级实时查询", "智能数据压缩"]
    },
    energy: {
        title: "能源电力行业",
        description: "面向新能源发电、智能电网、数字能源等领域，高效处理海量测点数据，支持削峰填谷智能调度与精准碳计量。",
        highlights: ["源网荷储一体化", "发电预测与负荷调度", "碳计量数据管理"]
    },
    automotive: {
        title: "车联网行业",
        description: "针对车辆实时监控、远程诊断、智慧交通等场景，提供 V2X 数据处理与车辆状态分析能力。",
        highlights: ["V2X 实时数据交互", "车辆状态实时监控", "智慧交通管理"]
    },
    metallurgy: {
        title: "金属冶炼行业",
        description: "服务于钢铁、有色金属等冶炼企业，实现生产全流程数字化监控、质量追溯与工艺参数优化。",
        highlights: ["生产全流程监控", "质量追溯体系", "工艺参数优化"]
    }
};

/**
 * 初始化客户案例下拉框面板功能
 */
function initCasesDropdownPanel() {
    const casesDropdown = document.querySelector('.cases-dropdown');
    if (!casesDropdown) return;

    const panelContent = casesDropdown.querySelector('.industry-panel-content');
    if (!panelContent) return;

    const industryItems = casesDropdown.querySelectorAll('[data-industry]');

    // 内容更新函数（带淡入淡出）
    function updatePanelContent(industryKey) {
        const content = industryContent[industryKey] || industryContent.default;

        // 淡出
        panelContent.classList.add('fade-out');

        // 等待淡出动画完成后更新内容并淡入
        setTimeout(() => {
            // 更新标题
            const titleEl = panelContent.querySelector('.industry-title');
            if (titleEl) titleEl.textContent = content.title;

            // 更新描述
            const descEl = panelContent.querySelector('.industry-description');
            if (descEl) descEl.textContent = content.description;

            // 更新亮点列表
            const highlightsEl = panelContent.querySelector('.industry-highlights');
            if (highlightsEl) {
                highlightsEl.innerHTML = content.highlights.map(h => `<li>${h}</li>`).join('');
            }

            // 淡入
            panelContent.classList.remove('fade-out');
        }, 300);
    }

    // 为每个行业项添加鼠标悬停事件
    industryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const industryKey = item.dataset.industry;
            if (industryKey) {
                updatePanelContent(industryKey);
            }
        });
    });

    // 下拉框关闭时重置为默认内容
    const navItem = casesDropdown.closest('.nav-item');
    if (navItem) {
        navItem.addEventListener('mouseleave', () => {
            // 延迟重置，避免鼠标移出时闪烁
            setTimeout(() => {
                updatePanelContent('default');
            }, 200);
        });
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

    // 默认打开第一个手风琴项
    if (headers.length > 0) {
        const firstHeader = headers[0];
        const firstContent = firstHeader.nextElementSibling;
        // 只有在没有 active 类时才设置
        if (!firstHeader.classList.contains('active')) {
            firstHeader.classList.add('active');
            firstHeader.setAttribute('aria-expanded', 'true');
        }
        if (firstContent.hidden) {
            firstContent.hidden = false;
        }
        // 使用 setTimeout 确保 DOM 渲染后再设置 maxHeight
        setTimeout(() => {
            if (!firstContent.style.maxHeight) {
                firstContent.style.maxHeight = firstContent.scrollHeight + 'px';
            }
        }, 0);
    }

    headers.forEach(header => {
        // 点击事件
        header.addEventListener('click', () => {
            toggleAccordion(header);
        });

        // 鼠标悬停事件 - 自动展开
        header.addEventListener('mouseenter', () => {
            const isActive = header.classList.contains('active');
            if (!isActive) {
                toggleAccordion(header);
            }
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

        // 更新右侧视觉图形
        const index = header.dataset.index;
        const visualShape = document.querySelector('#advantagesVisual .abstract-shape');
        if (visualShape && index) {
            // 移除所有 state-X 类
            visualShape.className = 'abstract-shape advantages-shape';
            // 添加新的 state 类
            visualShape.classList.add(`state-${index}`);
        }
    }
}

/**
 * ========================================
 * 成功案例 / Success Stories
 * ========================================
 */

/**
 * 行业分类配置
 */
const industryTabsConfig = [
    { 
        key: 'iot', 
        label: '工业物联网', 
        title: '工业物联网解决方案', 
        desc: '针对重工制造场景，提供设备全生命周期管理解决方案，实现预测性维护与生产全流程监控。' 
    },
    { 
        key: 'energy', 
        label: '数字能源', 
        title: '数字能源解决方案', 
        desc: '面向新能源发电、智能电网等领域，高效处理海量测点数据，支持削峰填谷智能调度与精准碳计量。' 
    },
    { 
        key: 'smart-industry', 
        label: '智慧产业', 
        title: '智慧产业解决方案', 
        desc: '赋能矿山、水务等传统产业数字化转型，实现安全生产监控与精细化运营管理。' 
    }
];

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
        ctaLink: "products.html"
    },
    {
        id: 2,
        customer: "市大数据局",
        logo: "大数据",
        scenario: "数字能源",
        scenarioTag: "energy",
        summary: "为城市数字能源管理提供数据支撑，实现精准碳计量与能源调度优化。",
        ctaLink: "products.html"
    },
    {
        id: 3,
        customer: "电网能源",
        logo: "电网",
        scenario: "数字能源",
        scenarioTag: "energy",
        summary: "面向风电、光伏、电网等领域，高效处理海量测点数据，支持削峰填谷智能调度。",
        ctaLink: "products.html"
    },
    {
        id: 4,
        customer: "超级工厂",
        logo: "工厂",
        scenario: "工业物联网",
        scenarioTag: "iot",
        summary: "为大型制造企业提供综合能源管理，实现生产用能优化与碳排放追踪。",
        ctaLink: "products.html"
    },
    {
        id: 5,
        customer: "智慧矿山",
        logo: "矿山",
        scenario: "智慧产业",
        scenarioTag: "smart-industry",
        summary: "赋能矿山安全生产监控，实现人员定位、设备监测与环境感知一体化。",
        ctaLink: "products.html"
    },
    {
        id: 6,
        customer: "智慧水务",
        logo: "水务",
        scenario: "智慧产业",
        scenarioTag: "smart-industry",
        summary: "通过管网压力、流量数据分析，实现漏损监测与智能调度，降低产销差。",
        ctaLink: "products.html"
    },
    {
        id: 7,
        customer: "智能制造",
        logo: "制造",
        scenario: "工业物联网",
        scenarioTag: "iot",
        summary: "构建数字孪生工厂，实时映射生产线状态，大幅缩短新产品试制周期。",
        ctaLink: "products.html"
    },
    {
        id: 8,
        customer: "光伏电站",
        logo: "光伏",
        scenario: "数字能源",
        scenarioTag: "energy",
        summary: "集中管理分布式光伏逆变器数据，提升发电效率与运维响应速度。",
        ctaLink: "products.html"
    },
    {
        id: 9,
        customer: "智慧园区",
        logo: "园区",
        scenario: "智慧产业",
        scenarioTag: "smart-industry",
        summary: "集成安防、能耗、停车等多系统数据，打造绿色高效的智慧园区管理平台。",
        ctaLink: "products.html"
    }
];

/**
 * 初始化成功案例功能
 */
function initSuccessStories() {
    const container = document.querySelector('.success-stories');
    if (!container) return;

    renderIndustryTabs();
    
    // 默认显示第一个行业
    if (industryTabsConfig.length > 0) {
        switchIndustryTab(industryTabsConfig[0].key);
    }

    // 为案例卡片添加事件委托 (支持点击跳转和无障碍操作)
    const gridContainer = document.querySelector('.industry-case-grid');
    if (gridContainer) {
        gridContainer.addEventListener('click', (e) => {
            const card = e.target.closest('.case-card-grid-item');
            const link = e.target.closest('a');
            
            // 如果点击的是链接本身，让链接原生行为处理，不触发卡片逻辑
            if (link) return;

            if (card) {
                const url = card.dataset.href;
                if (url && url !== '#') {
                    // 支持 Ctrl/Cmd + 点击在新标签页打开
                    if (e.ctrlKey || e.metaKey) {
                        window.open(url, '_blank');
                    } else {
                        window.location.href = url;
                    }
                }
            }
        });

        gridContainer.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const card = e.target.closest('.case-card-grid-item');
                if (card) {
                    e.preventDefault();
                    const url = card.dataset.href;
                    if (url && url !== '#') {
                        window.location.href = url;
                    }
                }
            }
        });
    }
}

/**
 * 渲染行业 Tab
 */
function renderIndustryTabs() {
    const tabsContainer = document.querySelector('.industry-tabs');
    if (!tabsContainer) return;

    tabsContainer.innerHTML = industryTabsConfig.map((tab, index) => `
        <button class="industry-tab-btn ${index === 0 ? 'active' : ''}" 
                data-industry="${tab.key}">
            ${tab.label}
        </button>
    `).join('');

    // 绑定点击事件
    tabsContainer.querySelectorAll('.industry-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // 更新选中状态
            tabsContainer.querySelectorAll('.industry-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 切换内容
            switchIndustryTab(btn.dataset.industry);
        });
    });
}

/**
 * 切换行业 Tab 内容
 * @param {string} key - 行业 Key
 */
function switchIndustryTab(key) {
    const config = industryTabsConfig.find(c => c.key === key);
    if (!config) return;

    // 1. 更新左侧解决方案面板
    const solutionContainer = document.querySelector('.industry-solution');
    if (solutionContainer) {
        // 简单的淡入淡出效果
        solutionContainer.style.opacity = '0';
        solutionContainer.style.transform = 'translateY(10px)';
        solutionContainer.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            solutionContainer.innerHTML = `
                <h3 class="industry-solution-title">${config.title}</h3>
                <p class="industry-solution-desc">${config.desc}</p>
                <img src="img/diagram.png" alt="${config.title}架构图" class="industry-solution-img" onerror="this.style.display='none'">
                <a href="products.html" class="industry-solution-cta">了解详情 <i data-lucide="arrow-right" size="16"></i></a>
            `;
            
            solutionContainer.style.opacity = '1';
            solutionContainer.style.transform = 'translateY(0)';
        }, 300);
    }

    // 2. 更新右侧案例网格
    const gridContainer = document.querySelector('.industry-case-grid');
    if (gridContainer) {
        const filteredCases = successCasesData.filter(c => c.scenarioTag === key);
        const displayCases = filteredCases.slice(0, 3); // 最多显示 3 个
        const hasMore = filteredCases.length > 3;

        gridContainer.style.opacity = '0';
        gridContainer.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
            let html = displayCases.map(item => `
                <div class="case-card-grid-item" 
                     data-href="${item.ctaLink || '#'}" 
                     role="button" 
                     tabindex="0" 
                     aria-label="查看 ${item.customer} 的案例详情">
                    <div class="case-card-header">
                        <div class="case-card-logo">${item.logo}</div>
                        <div class="case-card-title">${item.customer}</div>
                        <a href="${item.ctaLink || '#'}" class="case-card-link" tabindex="-1">查看详情 <i data-lucide="arrow-right" size="14"></i></a>
                    </div>
                    <p class="case-card-desc">${item.summary}</p>
                </div>
            `).join('');

            if (hasMore) {
                html += `
                    <div class="view-more-container">
                        <a href="products.html" class="view-more-btn">查看更多 ${config.label} 案例</a>
                    </div>
                `;
            } else if (displayCases.length === 0) {
                 html = `<div style="grid-column: 1/-1; text-align: center; color: #999; padding: 40px;">暂无相关案例</div>`;
            }

            gridContainer.innerHTML = html;
            
            // 为新生成的卡片绑定点击事件 (使用委托更佳，但在切换Tab时重新绑定也行)
            // 这里我们采用事件委托的方式在 initSuccessStories 中绑定
            
            gridContainer.style.opacity = '1';
            // 重新渲染 Lucide 图标
            if (window.lucide) {
                window.lucide.createIcons();
            }
        }, 300);
    }
}