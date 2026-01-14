document.addEventListener('DOMContentLoaded', () => {
    // 简单的 TOC 滚动监听高亮
    const headings = document.querySelectorAll('h2, h3');
    const tocLinks = document.querySelectorAll('.toc-link');

    window.addEventListener('scroll', () => {
        let current = '';
        headings.forEach(heading => {
            const sectionTop = heading.offsetTop;
            if (scrollY >= sectionTop - 100) {
                // 这里简单模拟，实际需给 heading 加 id 并匹配
                // 暂时仅演示交互框架
            }
        });
    });

    // 移动端 Sidebar 切换逻辑（复用主站的 hamburger，但需要适配）
    // 此处预留接口
});
