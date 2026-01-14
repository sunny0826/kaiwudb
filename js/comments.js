/**
 * 评论协作系统 (Comment System)
 * 实现元素高亮、评论打点、LocalStorage存储及导入导出
 */

class CommentSystem {
    constructor() {
        this.isCommentMode = false;
        this.comments = [];
        this.activeElement = null;
        this.isAdding = false;
        this.isCollapsed = localStorage.getItem('kwdb_toolbar_collapsed') !== 'false';
        this.nextId = 1;

        this.init();
    }

    init() {
        this.loadComments();
        this.renderToolbar();
        this.bindEvents();
        this.loadFromUrl(); // Check for shared data
        this.renderPins();
    }

    // --- 1. 数据管理 ---

    loadComments() {
        const stored = localStorage.getItem('kwdb_comments');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                // 简单的版本检查
                this.comments = data.comments || [];
                // 找出最大的 ID 以便后续递增
                const maxId = this.comments.reduce((max, c) => Math.max(max, parseInt(c.id)), 0);
                this.nextId = maxId + 1;
            } catch (e) {
                console.error('Failed to load comments:', e);
                this.comments = [];
            }
        }
    }

    saveComments() {
        const data = {
            version: "1.0",
            timestamp: Date.now(),
            comments: this.comments
        };
        localStorage.setItem('kwdb_comments', JSON.stringify(data));
    }

    getPageId() {
        return window.location.pathname.replace(/^\//, '') || 'index.html';
    }

    // --- 2. UI 渲染 ---

    renderToolbar() {
        const toolbar = document.createElement('div');
        toolbar.className = `comment-toolbar ${this.isCollapsed ? 'collapsed' : ''}`;
        toolbar.innerHTML = `
            <button class="toolbar-btn" id="btn-toggle-collapse" data-tooltip="${this.isCollapsed ? '展开工具栏 (F)' : '折叠工具栏 (F)'}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="${this.isCollapsed ? 'M9 18l6-6-6-6' : 'M15 18l-6-6 6-6'}"></path>
                </svg>
            </button>
            <div class="toolbar-content">
                <div class="toolbar-separator"></div>
                <button class="toolbar-btn" id="btn-toggle-mode" data-tooltip="评论模式 (C)">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                </button>
                <div class="toolbar-separator"></div>
                <button class="toolbar-btn" id="btn-export" data-tooltip="导出数据">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                </button>
                <button class="toolbar-btn" id="btn-import" data-tooltip="导入数据">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                </button>
                <div class="toolbar-separator"></div>
                <button class="toolbar-btn" id="btn-share" data-tooltip="分享链接">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                </button>
            </div>
            <input type="file" id="import-file-input" accept=".json">
        `;
        document.body.appendChild(toolbar);

        // 绑定 Toolbar 事件
        document.getElementById('btn-toggle-collapse').addEventListener('click', () => this.toggleCollapse());
        document.getElementById('btn-toggle-mode').addEventListener('click', () => this.toggleMode());
        document.getElementById('btn-export').addEventListener('click', () => this.exportData());
        document.getElementById('btn-import').addEventListener('click', () => document.getElementById('import-file-input').click());
        document.getElementById('import-file-input').addEventListener('change', (e) => this.importData(e));
        document.getElementById('btn-share').addEventListener('click', () => this.shareLink());
    }

    toggleCollapse() {
        this.isCollapsed = !this.isCollapsed;
        localStorage.setItem('kwdb_toolbar_collapsed', this.isCollapsed);
        
        const toolbar = document.querySelector('.comment-toolbar');
        const btn = document.getElementById('btn-toggle-collapse');
        
        if (this.isCollapsed) {
            toolbar.classList.add('collapsed');
            btn.setAttribute('data-tooltip', '展开工具栏 (F)');
            btn.querySelector('path').setAttribute('d', 'M9 18l6-6-6-6'); // Chevron right
        } else {
            toolbar.classList.remove('collapsed');
            btn.setAttribute('data-tooltip', '折叠工具栏 (F)');
            btn.querySelector('path').setAttribute('d', 'M15 18l-6-6 6-6'); // Chevron left
        }
    }

    renderPins() {
        // 清除旧 Pins
        document.querySelectorAll('.comment-pin').forEach(el => el.remove());

        const currentPage = this.getPageId();
        
        this.comments.forEach(comment => {
            // 兼容旧数据：如果没有 page 字段，默认属于首页
            const commentPage = comment.page || 'index.html';
            
            if (commentPage !== currentPage) return;

            const target = document.querySelector(comment.selector);
            if (target) {
                this.createPinElement(target, comment);
            } else {
                // 尝试用坐标定位（后备方案，如果元素找不到）
                // 暂时略过，假设静态页面结构稳定
            }
        });
    }

    createPinElement(target, comment) {
        const pin = document.createElement('div');
        pin.className = 'comment-pin';
        pin.innerHTML = `<span>${comment.id}</span>`;
        
        // 计算绝对位置
        const rect = target.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        // 相对元素位置 + 元素绝对位置
        const top = rect.top + scrollTop + (comment.position.y * rect.height);
        const left = rect.left + scrollLeft + (comment.position.x * rect.width);
        
        pin.style.top = `${top}px`;
        pin.style.left = `${left}px`;
        
        pin.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showCommentDetail(comment, pin);
        });

        document.body.appendChild(pin);
    }

    // --- 3. 交互逻辑 ---

    bindEvents() {
        // 快捷键 C (模式切换) 与 F (折叠切换)
        document.addEventListener('keydown', (e) => {
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

            const key = e.key.toLowerCase();
            if (key === 'c') {
                this.toggleMode();
            } else if (key === 'f') {
                this.toggleCollapse();
            }
            
            if (e.key === 'Escape') {
                this.exitMode();
                this.closePopover();
            }
        });

        // 鼠标高亮与点击
        document.addEventListener('mouseover', (e) => {
            if (!this.isCommentMode || this.isAdding) return;
            if (e.target.closest('.comment-toolbar') || e.target.closest('.comment-pin') || e.target.closest('.comment-popover')) return;

            this.highlightElement(e.target);
        });

        document.addEventListener('click', (e) => {
            if (!this.isCommentMode) return;
            
            // 如果点击的是工具栏或已有 Pin，不处理
            if (e.target.closest('.comment-toolbar') || e.target.closest('.comment-pin') || e.target.closest('.comment-popover')) return;

            e.preventDefault();
            e.stopPropagation();

            if (this.activeElement) {
                this.startAddComment(this.activeElement, e);
            }
        }, true); // Capture phase to prevent default links
    }

    toggleMode() {
        this.isCommentMode = !this.isCommentMode;
        const btn = document.getElementById('btn-toggle-mode');
        
        if (this.isCommentMode) {
            btn.classList.add('active');
            document.body.style.cursor = 'crosshair';
        } else {
            this.exitMode();
        }
    }

    exitMode() {
        this.isCommentMode = false;
        this.isAdding = false;
        document.getElementById('btn-toggle-mode').classList.remove('active');
        document.body.style.cursor = 'default';
        this.removeHighlight();
        this.closePopover();
    }

    highlightElement(el) {
        if (this.activeElement === el) return;
        this.removeHighlight();
        
        this.activeElement = el;
        el.classList.add('comment-highlight');
    }

    removeHighlight() {
        if (this.activeElement) {
            this.activeElement.classList.remove('comment-highlight');
            this.activeElement = null;
        }
    }

    // --- 4. 评论操作 ---

    startAddComment(target, event) {
        this.isAdding = true;
        
        // 计算点击位置相对于元素的百分比
        const rect = target.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        this.showInputPopover(event.pageX, event.pageY, { target, x, y });
    }

    showInputPopover(pageX, pageY, context) {
        this.closePopover();

        const popover = document.createElement('div');
        popover.className = 'comment-popover';
        popover.style.top = `${pageY + 10}px`;
        popover.style.left = `${pageX + 10}px`;
        
        popover.innerHTML = `
            <div class="comment-header">添加评论 #${this.nextId}</div>
            <textarea class="comment-textarea" placeholder="输入评论内容..."></textarea>
            <div class="comment-actions">
                <button class="comment-btn btn-cancel">取消</button>
                <button class="comment-btn btn-submit">发送</button>
            </div>
        `;

        document.body.appendChild(popover);

        // Focus
        popover.querySelector('textarea').focus();

        // Bind
        popover.querySelector('.btn-cancel').addEventListener('click', () => {
            this.closePopover();
            this.isAdding = false;
        });

        popover.querySelector('.btn-submit').addEventListener('click', () => {
            const content = popover.querySelector('textarea').value;
            if (content.trim()) {
                this.addComment(context, content);
                this.closePopover();
                this.isAdding = false;
            }
        });
    }

    showCommentDetail(comment, pinEl) {
        this.closePopover();

        const rect = pinEl.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        const popover = document.createElement('div');
        popover.className = 'comment-popover';
        popover.style.top = `${rect.bottom + scrollTop + 10}px`;
        popover.style.left = `${rect.left + scrollLeft}px`;

        popover.innerHTML = `
            <div class="comment-header">
                <span>#${comment.id}</span>
                <span>${new Date(comment.timestamp).toLocaleTimeString()}</span>
            </div>
            <div class="comment-view-content">${this.escapeHtml(comment.content)}</div>
            <div class="comment-view-actions">
                <button class="btn-delete">删除</button>
            </div>
        `;

        document.body.appendChild(popover);

        popover.querySelector('.btn-delete').addEventListener('click', () => {
            this.deleteComment(comment.id);
            this.closePopover();
        });
    }

    closePopover() {
        const existing = document.querySelector('.comment-popover');
        if (existing) existing.remove();
    }

    addComment(context, content) {
        const selector = this.generateSelector(context.target);
        
        const newComment = {
            id: this.nextId.toString(),
            page: this.getPageId(),
            selector: selector,
            content: content,
            timestamp: Date.now(),
            author: "User",
            position: { x: context.x, y: context.y }
        };

        this.comments.push(newComment);
        this.nextId++;
        this.saveComments();
        this.createPinElement(context.target, newComment);
    }

    deleteComment(id) {
        this.comments = this.comments.filter(c => c.id !== id);
        this.saveComments();
        this.renderPins();
    }

    // --- 5. 工具方法 ---

    generateSelector(el) {
        if (el.id) return `#${el.id}`;
        if (el.tagName === 'BODY') return 'body';

        // 针对文档页等复杂结构，优先使用 data-id 或更稳定的属性
        // 这里简单增强一下，防止 path 过于脆弱
        let path = [];
        let current = el;
        
        while (current.parentElement) {
            let tag = current.tagName.toLowerCase();
            if (current.id) {
                path.unshift(`#${current.id}`);
                break; // 找到 ID 即可停止，作为锚点
            } else {
                let siblings = Array.from(current.parentElement.children).filter(e => e.tagName === current.tagName);
                if (siblings.length > 1) {
                    let index = siblings.indexOf(current) + 1;
                    path.unshift(`${tag}:nth-of-type(${index})`);
                } else {
                    path.unshift(tag);
                }
            }
            current = current.parentElement;
        }
        return path.join(' > ');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // --- 6. 导入导出与分享 ---

    exportData() {
        const data = JSON.stringify({
            version: "1.0",
            source: window.location.href,
            comments: this.comments
        }, null, 2);

        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `kwdb-comments-${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                this.mergeComments(data.comments);
            } catch (err) {
                console.error(err);
                this.showToast('文件解析失败');
            }
            event.target.value = '';
        };
        reader.readAsText(file);
    }

    mergeComments(newComments) {
        if (!Array.isArray(newComments)) return;

        if (newComments.length > 0) {
            // 简单的 ID 重置逻辑，防止冲突
            newComments.forEach(c => {
                c.id = (this.nextId++).toString();
                this.comments.push(c);
            });
            
            this.saveComments();
            this.renderPins();
            this.showToast(`成功导入 ${newComments.length} 条评论`);
        }
    }

    shareLink() {
        if (this.comments.length === 0) {
            this.showToast('当前没有评论可分享');
            return;
        }

        try {
            const data = JSON.stringify(this.comments);
            // Base64 Encode (Handle UTF-8)
            const encoded = btoa(encodeURIComponent(data).replace(/%([0-9A-F]{2})/g,
                function toSolidBytes(match, p1) {
                    return String.fromCharCode('0x' + p1);
            }));
            
            const url = new URL(window.location.href);
            url.hash = `share=${encoded}`;
            
            this.copyToClipboard(url.toString());
        } catch (e) {
            console.error('Share failed:', e);
            this.showToast('生成链接失败');
        }
    }

    loadFromUrl() {
        const hash = window.location.hash;
        if (hash.includes('share=')) {
            try {
                const encoded = hash.split('share=')[1];
                // Base64 Decode
                const json = decodeURIComponent(atob(encoded).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                
                const sharedComments = JSON.parse(json);
                if (Array.isArray(sharedComments) && sharedComments.length > 0) {
                    if (confirm(`收到 ${sharedComments.length} 条分享评论。是否加载？`)) {
                        this.mergeComments(sharedComments);
                        // 自动开启评论模式
                        if (!this.isCommentMode) this.toggleMode();
                    }
                }
                // 清理 URL
                history.replaceState(null, null, ' ');
            } catch (e) {
                console.error('Load shared data failed:', e);
            }
        }
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('链接已复制，快去分享吧！');
        }, () => {
            this.showToast('复制失败，请手动复制 URL');
        });
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'comment-toast';
        toast.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// 初始化
new CommentSystem();
