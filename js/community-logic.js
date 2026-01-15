/**
 * ========================================
 * 社区板块功能 (Community Section)
 * ========================================
 */

// 模拟社区动态数据
const communityFeedData = [
    {
        id: 1,
        title: "KaiwuDB 2.0 版本核心特性深度解析",
        excerpt: "本文详细介绍了 KaiwuDB 2.0 在多模融合架构、分布式事务处理及 AI 智能优化等方面的重大突破...",
        tag: "技术解读",
        date: "2025-12-28",
        author: "技术团队",
        likes: 128,
        comments: 45
    },
    {
        id: 2,
        title: "如何基于 KaiwuDB 构建千万级设备监控平台",
        excerpt: "实战分享：某大型制造企业如何利用 KaiwuDB 解决海量时序数据写入与实时查询难题，实现降本增效。",
        tag: "最佳实践",
        date: "2025-12-25",
        author: "解决方案架构师",
        likes: 96,
        comments: 32
    },
    {
        id: 3,
        title: "社区开发者贡献指南 v1.0 发布",
        excerpt: "欢迎加入 KaiwuDB 开源社区！本文档旨在帮助开发者快速上手，参与代码贡献与文档完善。",
        tag: "社区公告",
        date: "2025-12-20",
        author: "社区运营",
        likes: 256,
        comments: 88
    },
    {
        id: 4,
        title: "KaiwuDB 在数字能源领域的应用探索",
        excerpt: "探讨分布式数据库如何赋能虚拟电厂、储能管理等新兴场景，助力双碳目标实现。",
        tag: "行业应用",
        date: "2025-12-15",
        author: "能源行业专家",
        likes: 150,
        comments: 40
    },
    {
        id: 5,
        title: "Rust 语言在数据库内核开发中的实践",
        excerpt: "分享 KaiwuDB 团队在使用 Rust 重构核心组件过程中的经验教训与性能优化技巧。",
        tag: "技术分享",
        date: "2025-12-10",
        author: "内核开发工程师",
        likes: 312,
        comments: 67
    },
    {
        id: 6,
        title: "KaiwuDB 荣获 2025 年度最佳开源数据库奖",
        excerpt: "感谢社区开发者的支持，KaiwuDB 在本次年度评选中脱颖而出，我们将继续前行！",
        tag: "新闻动态",
        date: "2025-12-05",
        author: "KaiwuDB",
        likes: 520,
        comments: 120
    }
];

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
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span>${item.likes}</span>
                </button>
                <button class="interaction-btn comment-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
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
    } else {
        btn.classList.add('active');
        count++;
        
        // 简单的点赞动画
        btn.style.transform = 'scale(1.2)';
        setTimeout(() => btn.style.transform = 'scale(1)', 200);
    }
    
    countSpan.textContent = count;
};
