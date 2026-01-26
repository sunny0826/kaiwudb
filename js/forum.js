/**
 * 论坛页面交互逻辑
 */

// 模拟论坛数据
const forumPosts = [
    {
        id: 1,
        title: "KaiwuDB 2.0 安装过程中报错 'init failed' 如何解决？",
        excerpt: "在 CentOS 7.9 环境下安装 KaiwuDB 2.0，执行初始化命令时报错，日志显示权限不足，但我已经使用了 root 用户。",
        author: "李明",
        avatar: "", // 空字符串将使用默认头像
        date: "2026-01-22 10:30",
        category: "installation",
        tags: ["安装部署", "报错"],
        views: 125,
        replies: 3,
        votes: 5,
        url: "http://localhost:8000/forum-detail.html",
        solved: false
    },
    {
        id: 2,
        title: "如何使用 Java SDK 进行批量写入？",
        excerpt: "现在的写入速度有点慢，想问下有没有批量写入的最佳实践示例代码？",
        author: "张伟",
        avatar: "",
        date: "2026-01-21 15:45",
        category: "development",
        tags: ["Java", "SDK", "性能优化"],
        views: 340,
        replies: 8,
        votes: 12,
        url: "http://localhost:8000/forum-detail.html",
        solved: true
    },
    {
        id: 3,
        title: "时序数据压缩率问题咨询",
        excerpt: "我们现在的场景是每秒 10 万点写入，想了解一下 KaiwuDB 的默认压缩算法是什么？是否支持自定义压缩级别？",
        author: "TechLead_Wang",
        avatar: "",
        date: "2026-01-20 09:15",
        category: "usage",
        tags: ["压缩", "存储引擎"],
        views: 560,
        replies: 5,
        votes: 8,
        url: "http://localhost:8000/forum-detail.html",
        solved: true
    },
    {
        id: 4,
        title: "RESTful API 是否支持聚合查询？",
        excerpt: "文档里只看到了基础的 CRUD 接口，想问下通过 HTTP 接口能不能直接执行 SUM/AVG 等聚合操作？",
        author: "Frontend_Dev",
        avatar: "",
        date: "2026-01-19 14:20",
        category: "development",
        tags: ["API", "聚合查询"],
        views: 210,
        replies: 2,
        votes: 3,
        url: "http://localhost:8000/forum-detail.html",
        solved: false
    },
    {
        id: 5,
        title: "集群扩容后数据平衡需要多久？",
        excerpt: "3 节点扩容到 5 节点，数据量大概 2TB，想预估一下 Rebalance 的时间。",
        author: "Ops_Master",
        avatar: "",
        date: "2026-01-18 11:00",
        category: "installation",
        tags: ["集群", "运维"],
        views: 450,
        replies: 6,
        votes: 7,
        url: "http://localhost:8000/forum-detail.html",
        solved: true
    },
    {
        id: 6,
        title: "SQL 语法：关于 Window Function 的支持情况",
        excerpt: "目前版本支持哪些窗口函数？Rank, Dense_Rank 支持吗？",
        author: "DataAnalyst",
        avatar: "",
        date: "2026-01-17 16:30",
        category: "usage",
        tags: ["SQL", "窗口函数"],
        views: 180,
        replies: 1,
        votes: 2,
        url: "http://localhost:8000/forum-detail.html",
        solved: false
    },
    {
        id: 7,
        title: "建议增加 Rust 语言的官方 SDK",
        excerpt: "现在的项目中使用了 Rust，希望能有官方支持的 Driver，目前用 Postgres 的驱动有一些兼容性问题。",
        author: "Rustacean",
        avatar: "",
        date: "2026-01-16 10:00",
        category: "suggestion",
        tags: ["Rust", "SDK", "功能建议"],
        views: 890,
        replies: 15,
        votes: 45,
        solved: false
    },
    {
        id: 8,
        title: "Dashboard 监控面板偶尔加载不出来",
        excerpt: "访问 8080 端口的 Dashboard，有时候会白屏，刷新几次才好。",
        author: "Tester_01",
        avatar: "",
        date: "2026-01-15 13:45",
        category: "bug",
        tags: ["Dashboard", "Bug"],
        views: 150,
        replies: 4,
        votes: 1,
        solved: true
    }
];

// 状态管理
const state = {
    filter: 'latest', // 'latest' | 'hot' | 'unsolved' | 'solved'
    search: '',
    pagination: {
        page: 1,
        pageSize: 5
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initForum();
});

function initForum() {
    bindEvents();
    renderSidebar();
    render();
}

function bindEvents() {
    // Tab 切换
    const tabs = document.querySelectorAll('.forum-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            state.filter = tab.dataset.filter;
            state.pagination.page = 1;
            render();
        });
    });

    // 搜索
    const searchInput = document.getElementById('forumSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            state.search = e.target.value.trim().toLowerCase();
            state.pagination.page = 1;
            render();
        }, 300));
    }
}

// 核心渲染函数
function render() {
    const filteredPosts = getFilteredPosts();
    const sortedPosts = sortPosts(filteredPosts);
    const pagedPosts = paginatePosts(sortedPosts);

    renderList(pagedPosts);
    renderPagination(sortedPosts.length);
}

// 数据筛选
function getFilteredPosts() {
    return forumPosts.filter(post => {
        // 搜索过滤
        const matchSearch = post.title.toLowerCase().includes(state.search) || 
                          post.excerpt.toLowerCase().includes(state.search) ||
                          post.tags.some(tag => tag.toLowerCase().includes(state.search));
        
        if (!matchSearch) return false;

        // Tab 过滤
        if (state.filter === 'unsolved') return !post.solved;
        if (state.filter === 'solved') return post.solved;
        
        return true;
    });
}

// 数据排序
function sortPosts(posts) {
    return [...posts].sort((a, b) => {
        if (state.filter === 'hot') {
            // 热门：综合 浏览量、回复数、点赞数
            const scoreA = a.views * 0.1 + a.replies * 2 + a.votes * 1;
            const scoreB = b.views * 0.1 + b.replies * 2 + b.votes * 1;
            return scoreB - scoreA;
        }
        // 默认按日期降序
        return new Date(b.date) - new Date(a.date);
    });
}

// 分页处理
function paginatePosts(posts) {
    const start = (state.pagination.page - 1) * state.pagination.pageSize;
    return posts.slice(start, start + state.pagination.pageSize);
}

// 渲染列表
function renderList(posts) {
    const container = document.getElementById('forumPostList');
    if (!container) return;

    if (posts.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px; color: var(--color-text-tertiary);">
                <i data-lucide="message-square-off" style="width: 48px; height: 48px; margin-bottom: 16px; opacity: 0.5;"></i>
                <p>没有找到相关帖子</p>
                <button class="btn btn-primary" onclick="openAskModal()" style="margin-top: 16px;">
                    发起提问
                </button>
            </div>
        `;
        if (window.lucide) lucide.createIcons();
        return;
    }

    container.innerHTML = posts.map(post => `
        <div class="forum-post-item" onclick="window.open('${post.url}', '_blank')">
            ${post.solved ? '<span class="status-badge solved"><i data-lucide="check-circle-2" class="icon-xs"></i> 已解决</span>' : ''}
            <div class="post-content">
                <h3 class="post-title">
                    <a href="${post.url}" target="_blank">${highlightText(post.title, state.search)}</a>
                </h3>
                <p class="post-excerpt">${highlightText(post.excerpt, state.search)}</p>
                
                <div class="post-footer">
                    <div class="post-stats-info">
                        <div class="stat-item" title="点赞">
                            <i data-lucide="thumbs-up" class="stat-icon"></i>
                            <span>${post.votes}</span>
                        </div>
                        <div class="stat-item ${post.replies > 0 ? 'highlight' : ''}" title="回复">
                            <i data-lucide="message-square" class="stat-icon"></i>
                            <span>${post.replies}</span>
                        </div>
                        <div class="stat-item" title="浏览">
                            <i data-lucide="eye" class="stat-icon"></i>
                            <span>${post.views}</span>
                        </div>
                    </div>

                    <div class="post-meta-info">
                        <div class="post-tags">
                            ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
                        </div>
                        <div class="meta-divider"></div>
                        <div class="post-author">
                            ${post.avatar ? `<img src="${post.avatar}" class="author-avatar" alt="${post.author}">` : '<i data-lucide="user" class="icon-sm"></i>'}
                            <span>${post.author}</span>
                        </div>
                        <div class="meta-divider"></div>
                        <span class="post-date">${post.date}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    if (window.lucide) lucide.createIcons();
}

// 渲染分页器
function renderPagination(totalItems) {
    const container = document.getElementById('forumPagination');
    if (!container) return;

    const totalPages = Math.ceil(totalItems / state.pagination.pageSize);
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = `
        <button class="page-btn" 
            ${state.pagination.page === 1 ? 'disabled' : ''}
            onclick="changePage(${state.pagination.page - 1})">
            <i data-lucide="chevron-left"></i>
        </button>
    `;

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

// 渲染侧边栏
function renderSidebar() {
    // 渲染热门标签
    const allTags = forumPosts.reduce((acc, post) => {
        post.tags.forEach(tag => {
            acc[tag] = (acc[tag] || 0) + 1;
        });
        return acc;
    }, {});
    
    const sortedTags = Object.keys(allTags).sort((a, b) => allTags[b] - allTags[a]).slice(0, 10);
    
    const tagContainer = document.getElementById('tagCloud');
    if (tagContainer) {
        tagContainer.innerHTML = sortedTags.map(tag => `
            <span class="tag-item" onclick="searchTag('${tag}')">${tag}</span>
        `).join('');
    }

    // 渲染热门话题
    const hotList = [...forumPosts].sort((a, b) => b.replies - a.replies).slice(0, 5);
    const hotTopicContainer = document.getElementById('hotTopicList');
    if (hotTopicContainer) {
        hotTopicContainer.innerHTML = hotList.map(post => `
            <li><a href="#">${post.title}</a></li>
        `).join('');
    }
}

// 全局函数
window.changePage = function(page) {
    state.pagination.page = page;
    render();
    document.querySelector('.forum-post-list').scrollIntoView({ behavior: 'smooth' });
};

window.searchTag = function(tag) {
    const input = document.getElementById('forumSearchInput');
    if (input) {
        input.value = tag;
        state.search = tag.toLowerCase();
        state.pagination.page = 1;
        render();
    }
};

window.openAskModal = function() {
    const modal = document.getElementById('askModal');
    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
};

window.closeAskModal = function() {
    const modal = document.getElementById('askModal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
};

window.submitPost = function() {
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    
    if (!title || !content) {
        alert('请填写标题和内容');
        return;
    }

    alert('发布成功！(模拟)');
    closeAskModal();
    // In a real app, you would send data to server and re-fetch posts
};

window.toggleLinkStyle = function(e) {
    e.preventDefault();
    document.body.classList.toggle('no-link-highlight');
    const isNoHighlight = document.body.classList.contains('no-link-highlight');
    e.target.textContent = isNoHighlight ? '恢复链接高亮' : '取消链接高亮';
    
    // 动态添加或移除样式
    let styleTag = document.getElementById('no-link-style');
    if (isNoHighlight) {
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'no-link-style';
            styleTag.textContent = `
                a { text-decoration: none !important; }
                .post-title a { color: inherit !important; }
            `;
            document.head.appendChild(styleTag);
        }
    } else {
        if (styleTag) {
            styleTag.remove();
        }
    }
};

window.editorUnlink = function() {
    // 模拟编辑器去除链接功能
    const textarea = document.getElementById('postContent');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    
    // 简单的 Markdown 链接去除逻辑 [text](url) -> text
    const linkRegex = /\[(.*?)\]\(.*?\)/;
    if (linkRegex.test(selectedText)) {
        const newText = selectedText.replace(linkRegex, '$1');
        textarea.setRangeText(newText, start, end, 'select');
    } else {
        alert('请选择包含 Markdown 链接的文本');
    }
};

// 辅助函数
function highlightText(text, keyword) {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, 'gi');
    return text.replace(regex, '<span style="color: var(--color-accent); font-weight: bold;">$1</span>');
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
