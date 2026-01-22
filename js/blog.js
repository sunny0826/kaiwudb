/**
 * 博客页面交互逻辑
 */

// 模拟博客数据
const blogPosts = [
    {
        id: 1,
        title: "KaiwuDB 2.2 发布：低延迟写入与多模融合升级",
        excerpt: "面向工业物联网场景优化写入链路，新增多模融合查询能力并提升集群弹性扩展效率。本文详细解读新版本核心特性与性能表现。",
        category: "news",
        categoryLabel: "产品动态",
        date: "2026-01-18",
        views: 3240,
        tags: ["版本发布", "多模数据库", "性能优化"],
        author: "KaiwuDB 团队",
        link: "/blog-detail.html"
    },
    {
        id: 2,
        title: "工业物联网时序数据写入优化实战",
        excerpt: "结合边缘采集链路与压缩策略，分享百万级设备写入的配置与观测方案。通过真实案例展示如何将写入性能提升 300%。",
        category: "practice",
        categoryLabel: "最佳实践",
        date: "2026-01-16",
        views: 2850,
        tags: ["时序数据", "写入优化", "IoT"],
        author: "林工",
        link: "/blog-detail.html"
    },
    {
        id: 3,
        title: "深入解析：分布式数据库的一致性协议",
        excerpt: "从 Raft 到 Paxos，深入剖析分布式数据库如何保证数据一致性。本文结合 KaiwuDB 架构，讲解共识算法在实际工程中的应用。",
        category: "technology",
        categoryLabel: "技术解析",
        date: "2026-01-14",
        views: 4120,
        tags: ["分布式", "一致性", "Raft"],
        author: "架构组",
        link: "/blog-detail.html"
    },
    {
        id: 4,
        title: "数字能源场景下的秒级告警体系搭建",
        excerpt: "基于 KaiwuDB 构建高并发告警链路，实现千万级测点秒级响应。探讨如何处理海量实时数据并触发精准告警。",
        category: "case",
        categoryLabel: "案例分享",
        date: "2026-01-12",
        views: 1980,
        tags: ["数字能源", "告警系统", "实时计算"],
        author: "行业方案组",
        link: "/blog-detail.html"
    },
    {
        id: 5,
        title: "KaiwuDB SQL 优化器技术内幕",
        excerpt: "SQL 优化器是数据库的大脑。本文揭秘 KaiwuDB 基于代价的优化器（CBO）的设计原理与实现细节。",
        category: "technology",
        categoryLabel: "技术解析",
        date: "2026-01-10",
        views: 3560,
        tags: ["SQL优化", "CBO", "内核技术"],
        author: "内核研发",
        link: "/blog-detail.html"
    },
    {
        id: 6,
        title: "多模数据建模在设备健康诊断中的应用",
        excerpt: "以设备健康为例，分享时序、关系与图数据协同建模的方法。展示多模数据库如何简化复杂业务逻辑。",
        category: "practice",
        categoryLabel: "最佳实践",
        date: "2026-01-08",
        views: 2100,
        tags: ["数据建模", "设备诊断", "多模融合"],
        author: "许工",
        link: "/blog-detail.html"
    },
    {
        id: 7,
        title: "智慧园区综合运维平台落地实践",
        excerpt: "通过多源数据融合与实时分析，实现园区能耗与设备状态联动管理。详细介绍系统架构与数据流转。",
        category: "case",
        categoryLabel: "案例分享",
        date: "2026-01-05",
        views: 1850,
        tags: ["智慧园区", "数据融合", "运维平台"],
        author: "行业方案组",
        link: "/blog-detail.html"
    },
    {
        id: 8,
        title: "KaiwuDB 在车联网 V2X 场景的探索",
        excerpt: "面对海量车端数据上报，如何实现高效存储与实时查询？本文分享 KaiwuDB 在车联网领域的解决方案。",
        category: "case",
        categoryLabel: "案例分享",
        date: "2026-01-03",
        views: 2340,
        tags: ["车联网", "V2X", "时空数据"],
        author: "汽车行业组",
        link: "/blog-detail.html"
    },
    {
        id: 9,
        title: "LSM-Tree 存储引擎优化指南",
        excerpt: "针对写多读少场景，LSM-Tree 是主流选择。本文介绍如何通过参数调优减少写放大，提升压缩率。",
        category: "technology",
        categoryLabel: "技术解析",
        date: "2025-12-30",
        views: 3890,
        tags: ["存储引擎", "LSM-Tree", "性能调优"],
        author: "存储组",
        link: "/blog-detail.html"
    },
    {
        id: 10,
        title: "社区 SIG 新增边缘智能小组",
        excerpt: "专注边缘智能与实时分析场景，欢迎社区伙伴加入共建。介绍小组规划与近期 Roadmap。",
        category: "news",
        categoryLabel: "产品动态",
        date: "2025-12-28",
        views: 1200,
        tags: ["开源社区", "边缘计算", "SIG"],
        author: "生态委员会",
        link: "/blog-detail.html"
    },
    {
        id: 11,
        title: "如何实现数据库跨云容灾",
        excerpt: "探讨混合云架构下的数据库容灾方案，确保业务连续性。",
        category: "practice",
        categoryLabel: "最佳实践",
        date: "2025-12-25",
        views: 1560,
        tags: ["容灾", "混合云", "高可用"],
        author: "运维专家",
        link: "/blog-detail.html"
    },
    {
        id: 12,
        title: "KaiwuDB 2.1 维护版发布说明",
        excerpt: "修复多项稳定性问题，提升边缘节点同步效率与安全审计能力。",
        category: "news",
        categoryLabel: "产品动态",
        date: "2025-12-20",
        views: 1100,
        tags: ["版本发布", "Bugfix"],
        author: "KaiwuDB 团队",
        link: "/blog-detail.html"
    }
];

// 状态管理
const state = {
    filter: {
        category: 'all',
        search: '',
    },
    sort: 'newest', // 'newest' | 'popular'
    pagination: {
        page: 1,
        pageSize: 5
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initBlog();
});

function initBlog() {
    bindEvents();
    renderSidebar();
    render();
}

function bindEvents() {
    // 分类切换
    const tabs = document.querySelectorAll('.blog-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            state.filter.category = tab.dataset.category;
            state.pagination.page = 1; // 重置页码
            render();
        });
    });

    // 搜索
    const searchInput = document.getElementById('blogSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            state.filter.search = e.target.value.trim().toLowerCase();
            state.pagination.page = 1;
            render();
        }, 300));
    }

    // 排序
    const sortBtns = document.querySelectorAll('.sort-btn');
    sortBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sortBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.sort = btn.dataset.sort;
            render();
        });
    });
}

// 核心渲染函数
function render() {
    const filteredPosts = getFilteredPosts();
    const sortedPosts = sortPosts(filteredPosts);
    const pagedPosts = paginatePosts(sortedPosts);

    renderList(pagedPosts);
    renderPagination(sortedPosts.length);
}

// 数据处理：筛选
function getFilteredPosts() {
    return blogPosts.filter(post => {
        const matchCategory = state.filter.category === 'all' || post.category === state.filter.category;
        const matchSearch = post.title.toLowerCase().includes(state.filter.search) || 
                          post.excerpt.toLowerCase().includes(state.filter.search) ||
                          post.tags.some(tag => tag.toLowerCase().includes(state.filter.search));
        return matchCategory && matchSearch;
    });
}

// 数据处理：排序
function sortPosts(posts) {
    return [...posts].sort((a, b) => {
        if (state.sort === 'popular') {
            return b.views - a.views;
        }
        // 默认按日期降序
        return new Date(b.date) - new Date(a.date);
    });
}

// 数据处理：分页
function paginatePosts(posts) {
    const start = (state.pagination.page - 1) * state.pagination.pageSize;
    return posts.slice(start, start + state.pagination.pageSize);
}

// 渲染列表
function renderList(posts) {
    const container = document.getElementById('blogListContainer');
    if (!container) return;

    if (posts.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--color-text-tertiary);">
                <i data-lucide="inbox" style="width: 48px; height: 48px; margin-bottom: 16px; opacity: 0.5;"></i>
                <p>没有找到相关文章</p>
            </div>
        `;
        if (window.lucide) lucide.createIcons();
        return;
    }

    container.innerHTML = posts.map(post => `
        <article class="blog-card">
            <div class="blog-meta-top">
                <span class="blog-category-tag">${post.categoryLabel}</span>
                <span class="meta-date">${post.date}</span>
            </div>
            <h2 class="blog-card-title">
                <a href="${post.link}">${highlightText(post.title, state.filter.search)}</a>
            </h2>
            <p class="blog-card-excerpt">${highlightText(post.excerpt, state.filter.search)}</p>
            <div class="blog-meta-bottom">
                <div class="meta-item">
                    <i data-lucide="user"></i>
                    <span>${post.author}</span>
                </div>
                <div class="meta-item">
                    <i data-lucide="eye"></i>
                    <span>${post.views}</span>
                </div>
                <div class="meta-item">
                    <i data-lucide="tag"></i>
                    <span>${post.tags.join(', ')}</span>
                </div>
            </div>
        </article>
    `).join('');

    if (window.lucide) lucide.createIcons();
}

// 关键词高亮辅助函数
function highlightText(text, keyword) {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, 'gi');
    return text.replace(regex, '<span style="color: var(--color-accent); font-weight: bold;">$1</span>');
}

// 渲染分页器
function renderPagination(totalItems) {
    const container = document.getElementById('blogPagination');
    if (!container) return;

    const totalPages = Math.ceil(totalItems / state.pagination.pageSize);
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = '';
    
    // 上一页
    html += `
        <button class="page-btn" 
            ${state.pagination.page === 1 ? 'disabled' : ''}
            onclick="changePage(${state.pagination.page - 1})">
            <i data-lucide="chevron-left"></i>
        </button>
    `;

    // 页码
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= state.pagination.page - 1 && i <= state.pagination.page + 1)) {
            html += `
                <button class="page-btn ${i === state.pagination.page ? 'active' : ''}" 
                    onclick="changePage(${i})">${i}</button>
            `;
        } else if (i === state.pagination.page - 2 || i === state.pagination.page + 2) {
            html += `<span style="display:flex;align-items:flex-end;padding:0 4px;color:var(--color-text-tertiary);">...</span>`;
        }
    }

    // 下一页
    html += `
        <button class="page-btn" 
            ${state.pagination.page === totalPages ? 'disabled' : ''}
            onclick="changePage(${state.pagination.page + 1})">
            <i data-lucide="chevron-right"></i>
        </button>
    `;

    container.innerHTML = html;
    if (window.lucide) lucide.createIcons();
}

// 全局翻页函数
window.changePage = function(page) {
    state.pagination.page = page;
    render();
    document.querySelector('.blog-list-column').scrollIntoView({ behavior: 'smooth' });
};

// 渲染侧边栏
function renderSidebar() {
    // 渲染热门文章
    const hotList = [...blogPosts].sort((a, b) => b.views - a.views).slice(0, 5);
    const hotContainer = document.getElementById('hotArticleList');
    if (hotContainer) {
        hotContainer.innerHTML = hotList.map((post, index) => `
            <li class="hot-article-item">
                <div class="hot-index">${index + 1}</div>
                <div class="hot-info">
                    <h4><a href="#">${post.title}</a></h4>
                    <div class="hot-meta">${post.views} 阅读</div>
                </div>
            </li>
        `).join('');
    }

    // 渲染标签云
    const allTags = blogPosts.reduce((acc, post) => {
        post.tags.forEach(tag => {
            acc[tag] = (acc[tag] || 0) + 1;
        });
        return acc;
    }, {});
    
    // 按频率排序
    const sortedTags = Object.keys(allTags).sort((a, b) => allTags[b] - allTags[a]).slice(0, 10);
    
    const tagContainer = document.getElementById('tagCloud');
    if (tagContainer) {
        tagContainer.innerHTML = sortedTags.map(tag => `
            <span class="tag-item" onclick="searchTag('${tag}')">${tag}</span>
        `).join('');
    }
}

// 标签点击搜索
window.searchTag = function(tag) {
    const input = document.getElementById('blogSearchInput');
    if (input) {
        input.value = tag;
        state.filter.search = tag.toLowerCase();
        state.pagination.page = 1;
        render();
    }
};

// 工具函数：防抖
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
