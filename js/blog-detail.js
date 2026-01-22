document.addEventListener('DOMContentLoaded', () => {
    initTOC();
    initScrollProgress();
    initInteractions();
    
    // 初始化 Lucide 图标 (以防 main.js 执行顺序问题或异步内容)
    if (window.lucide) {
        window.lucide.createIcons();
    }
});

/**
 * 初始化目录 (TOC)
 * 自动从文章内容生成 H2, H3 目录
 */
function initTOC() {
    const articleContent = document.getElementById('articleContent');
    const tocList = document.getElementById('tocList');
    
    if (!articleContent || !tocList) return;
    
    // 获取所有 H2, H3 标题
    const headings = articleContent.querySelectorAll('h2, h3');
    
    if (headings.length === 0) {
        tocList.innerHTML = '<li>暂无目录</li>';
        return;
    }
    
    headings.forEach((heading, index) => {
        // 如果标题没有 ID，自动生成一个
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }
        
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;
        link.className = 'toc-link';
        link.dataset.target = heading.id;
        
        // 根据层级设置缩进样式 (通过 CSS 控制，这里只加类名)
        if (heading.tagName === 'H3') {
            link.style.paddingLeft = '28px';
            link.style.fontSize = '0.85rem';
        }
        
        const li = document.createElement('li');
        li.appendChild(link);
        tocList.appendChild(li);
        
        // 平滑滚动点击事件
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // 减去导航栏高度的偏移量
                const offsetTop = targetElement.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // 更新 URL hash 但不跳转
                history.pushState(null, null, `#${targetId}`);
                
                // 手动设置激活状态
                document.querySelectorAll('.toc-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
    
    // 滚动监听 (Scroll Spy)
    const observerCallback = (entries) => {
        // 找到当前视口中可见的第一个标题，或者距离视口顶部最近的标题
        // 这里使用简单的滚动位置判断更准确
    };
    
    // 使用 scroll 事件监听来处理高亮，比 IntersectionObserver 更适合 TOC
    window.addEventListener('scroll', throttle(() => {
        let currentId = '';
        
        headings.forEach(heading => {
            const headingTop = heading.offsetTop;
            const scrollY = window.scrollY;
            
            // 激活阈值：标题进入视口上方 120px 处
            if (scrollY >= headingTop - 150) {
                currentId = heading.id;
            }
        });
        
        // 如果页面在顶部，取消所有激活，或者激活第一个（视需求）
        if (window.scrollY < 200 && headings.length > 0) {
            currentId = headings[0].id; 
        }

        if (currentId) {
            document.querySelectorAll('.toc-link').forEach(link => {
                link.classList.remove('active');
                if (link.dataset.target === currentId) {
                    link.classList.add('active');
                }
            });
        }
    }, 100));
}

/**
 * 初始化阅读进度条
 */
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgressBar');
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        
        progressBar.style.width = `${scrollPercent}%`;
    });
}

/**
 * 初始化交互功能 (点赞、评论等)
 */
function initInteractions() {
    // 模拟点赞
    const likeBtns = document.querySelectorAll('.share-btn[aria-label="点赞"], .action-btn:first-child');
    
    likeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
            const countEl = this.querySelector('.count') || this.innerText.match(/\d+/);
            
            // 简单的数字变化动画
            if (this.classList.contains('active')) {
                // 如果是按钮内的文字
                if (this.innerText.includes('点赞')) {
                    const num = parseInt(this.innerText.match(/\d+/)[0]);
                    this.innerHTML = `<i data-lucide="thumbs-up"></i> 点赞 (${num + 1})`;
                } else {
                     // 侧边栏按钮
                     const badge = this.querySelector('.count');
                     if (badge) badge.textContent = parseInt(badge.textContent) + 1;
                }
                
                // 添加颜色变化
                this.style.color = 'var(--color-accent)';
                this.style.borderColor = 'var(--color-accent)';
            } else {
                if (this.innerText.includes('点赞')) {
                    const num = parseInt(this.innerText.match(/\d+/)[0]);
                    this.innerHTML = `<i data-lucide="thumbs-up"></i> 点赞 (${num - 1})`;
                } else {
                     const badge = this.querySelector('.count');
                     if (badge) badge.textContent = parseInt(badge.textContent) - 1;
                }
                this.style.color = '';
                this.style.borderColor = '';
            }
            
            if (window.lucide) window.lucide.createIcons();
        });
    });
    
    // 模拟评论提交
    const submitBtn = document.querySelector('.submit-btn');
    const textarea = document.querySelector('.editor-wrapper textarea');
    const commentList = document.querySelector('.comment-list');
    
    if (submitBtn && textarea && commentList) {
        submitBtn.addEventListener('click', () => {
            const content = textarea.value.trim();
            if (!content) {
                alert('请输入评论内容');
                return;
            }
            
            // 创建新评论 DOM
            const newComment = document.createElement('div');
            newComment.className = 'comment-item';
            newComment.innerHTML = `
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" alt="当前用户" class="user-avatar">
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="username">我</span>
                        <span class="time">刚刚</span>
                    </div>
                    <p>${escapeHtml(content)}</p>
                    <div class="comment-actions">
                        <button><i data-lucide="thumbs-up" style="width:14px;"></i> 0</button>
                        <button>删除</button>
                    </div>
                </div>
            `;
            
            // 插入到列表顶部
            commentList.insertBefore(newComment, commentList.firstChild);
            
            // 清空输入框
            textarea.value = '';
            
            // 更新 Lucide
            if (window.lucide) window.lucide.createIcons();
        });
    }
}

// 简单的防抖/节流函数
function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    }
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
