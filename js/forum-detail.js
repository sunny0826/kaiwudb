/**
 * 论坛详情页交互逻辑
 */

document.addEventListener('DOMContentLoaded', () => {
    initForumInteractions();
});

function initForumInteractions() {
    // 1. 点赞功能
    const likeBtns = document.querySelectorAll('.like-btn');
    likeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 切换状态
            this.classList.toggle('active');
            
            // 更新计数
            const countSpan = this.querySelector('span');
            if (countSpan) {
                let count = parseInt(this.getAttribute('data-count') || '0');
                if (this.classList.contains('active')) {
                    count++;
                    this.style.color = '#FF4757';
                    this.querySelector('i').style.fill = '#FF4757';
                } else {
                    this.style.color = '';
                    this.querySelector('i').style.fill = 'none';
                }
                countSpan.textContent = count;
            }
            
            // 简单的动画效果
            const icon = this.querySelector('i');
            icon.style.transform = 'scale(1.2)';
            setTimeout(() => {
                icon.style.transform = 'scale(1)';
            }, 200);
        });
    });

    // 2. 收藏功能
    const bookmarkBtn = document.querySelector('.bookmark-btn');
    if (bookmarkBtn) {
        bookmarkBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            const icon = this.querySelector('i');
            if (this.classList.contains('active')) {
                this.style.color = 'var(--color-accent)';
                icon.style.fill = 'var(--color-accent)';
                this.innerHTML = `<i data-lucide="bookmark" style="fill: var(--color-accent)"></i> 已收藏`;
            } else {
                this.style.color = '';
                icon.style.fill = 'none';
                this.innerHTML = `<i data-lucide="bookmark"></i> 收藏`;
            }
            if (window.lucide) lucide.createIcons();
        });
    }

    // 3. 回复滚动
    const replyBtns = document.querySelectorAll('.reply-btn');
    const replyEditor = document.querySelector('.quick-reply-area');
    
    replyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // 如果是楼层回复，可以在这里添加 "@username" 到编辑器
            // const postItem = btn.closest('.post-item');
            // const username = postItem.querySelector('.username').textContent;
            
            if (replyEditor) {
                replyEditor.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const textarea = replyEditor.querySelector('textarea');
                if (textarea) {
                    textarea.focus();
                    // textarea.value = `@${username} `;
                }
            }
        });
    });

    // 4. 加载更多
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            const originalText = this.textContent;
            this.textContent = '加载中...';
            this.disabled = true;
            
            // 模拟加载延迟
            setTimeout(() => {
                this.textContent = '没有更多回复了';
                // 实际项目中这里会 fetch 新数据并 append 到 .post-list
            }, 1000);
        });
    }

    // 5. 提交回复
    const submitBtn = document.querySelector('.submit-reply-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            const textarea = document.querySelector('.reply-editor-container textarea');
            if (!textarea || !textarea.value.trim()) {
                alert('请输入回复内容');
                return;
            }

            // 模拟提交成功
            const content = textarea.value;
            const postList = document.querySelector('.post-list');
            
            // 创建新回复节点 (简化版)
            const newPost = document.createElement('article');
            newPost.className = 'post-item';
            newPost.style.animation = 'fadeIn 0.5s ease';
            newPost.innerHTML = `
                <div class="post-avatar">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser" alt="Me">
                </div>
                <div class="post-content-wrapper">
                    <div class="post-meta">
                        <span class="username">我</span>
                        <span class="publish-time">刚刚</span>
                    </div>
                    <div class="post-body">
                        <p>${escapeHtml(content)}</p>
                    </div>
                    <div class="post-actions">
                        <button class="action-btn like-btn" data-count="0">
                            <i data-lucide="heart"></i>
                            <span>0</span>
                        </button>
                        <button class="action-btn reply-btn">
                            <i data-lucide="message-circle"></i>
                            回复
                        </button>
                    </div>
                </div>
            `;
            
            postList.appendChild(newPost);
            
            // 清空编辑器
            textarea.value = '';
            
            // 重新初始化图标和事件
            if (window.lucide) lucide.createIcons();
            
            // 滚动到新回复
            newPost.scrollIntoView({ behavior: 'smooth' });
        });
    }
}

// 工具函数：转义 HTML 防止 XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
