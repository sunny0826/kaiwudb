/**
 * ========================================
 * 社区板块功能 (Community Section)
 * ========================================
 */

// 常量定义
const FEED_PAGE_SIZE = 2;
const ANIMATION_DURATION = 2000;
const SIMULATED_NETWORK_DELAY = 800;
const LIKE_ANIMATION_DURATION = 200;
const LIKE_SCALE = 1.2;

let currentFeedPage = 0;

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
            setTimeout(() => {
                loadMoreFeed();
                loadMoreBtn.classList.remove('loading');
            }, SIMULATED_NETWORK_DELAY);
        });
    }

    // 4. 绑定点赞按钮（事件委托）
    const feedGrid = document.getElementById('communityFeedGrid');
    if (feedGrid) {
        feedGrid.addEventListener('click', handleFeedInteraction);
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
                animateValue(target, 0, endValue, ANIMATION_DURATION);
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
                <button class="interaction-btn like-btn" aria-label="点赞">
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
 * 处理动态卡片交互（点赞/评论）
 */
function handleFeedInteraction(event) {
    const btn = event.target.closest('.interaction-btn');
    if (!btn) return;

    if (btn.classList.contains('like-btn')) {
        toggleLike(btn);
    } else if (btn.classList.contains('comment-btn')) {
        // 评论功能可在此扩展
        console.log('评论功能待实现');
    }
}

/**
 * 切换点赞状态
 */
function toggleLike(btn) {
    const countSpan = btn.querySelector('span');
    let count = parseInt(countSpan.textContent);

    if (btn.classList.contains('active')) {
        btn.classList.remove('active');
        count--;
    } else {
        btn.classList.add('active');
        count++;
        btn.style.transform = `scale(${LIKE_SCALE})`;
        setTimeout(() => btn.style.transform = 'scale(1)', LIKE_ANIMATION_DURATION);
    }

    countSpan.textContent = count;
}
