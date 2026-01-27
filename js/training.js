document.addEventListener('DOMContentLoaded', () => {
    // 课程数据
    const courses = [
        {
            id: 1,
            title: "KWDB 数据库基础入门",
            desc: "了解分布式多模数据库的基本概念、架构原理及应用场景。",
            level: "初级",
            duration: "2小时",
            tags: ["基础", "理论"],
            category: "basic",
            cover: "basic-1" // Use generated SVG or color
        },
        {
            id: 2,
            title: "SQL 语言进阶与优化",
            desc: "深入掌握 SQL 高级语法，学习查询优化技巧，提升数据库性能。",
            level: "中级",
            duration: "4小时",
            tags: ["SQL", "开发"],
            category: "dev",
            cover: "dev-1"
        },
        {
            id: 3,
            title: "KWDB 集群部署与运维",
            desc: "学习如何部署高可用集群，掌握日常运维、监控与故障排查技能。",
            level: "高级",
            duration: "6小时",
            tags: ["运维", "部署"],
            category: "ops",
            cover: "ops-1"
        },
        {
            id: 4,
            title: "时序数据处理实战",
            desc: "基于 IoT 场景，实战演练海量时序数据的写入、查询与分析。",
            level: "中级",
            duration: "3小时",
            tags: ["IoT", "实战"],
            category: "dev",
            cover: "dev-2"
        },
        {
            id: 5,
            title: "数据库迁移指南",
            desc: "从 MySQL/PostgreSQL 迁移到 KWDB 的完整流程与注意事项。",
            level: "中级",
            duration: "3小时",
            tags: ["迁移", "实战"],
            category: "ops",
            cover: "ops-2"
        },
        {
            id: 6,
            title: "KWDB 内核原理剖析",
            desc: "深入源码层面，解析分布式事务、存储引擎等核心技术原理。",
            level: "专家",
            duration: "8小时",
            tags: ["内核", "原理"],
            category: "kernel",
            cover: "kernel-1"
        },
        {
            id: 7,
            title: "云原生数据库架构设计",
            desc: "探讨 Kubernetes 环境下的数据库部署与架构设计最佳实践。",
            level: "高级",
            duration: "5小时",
            tags: ["云原生", "架构"],
            category: "arch",
            cover: "arch-1"
        },
        {
            id: 8,
            title: "大数据分析与 AI 融合",
            desc: "利用 KWDB 进行数据分析，并结合 AI 算法挖掘数据价值。",
            level: "高级",
            duration: "4小时",
            tags: ["分析", "AI"],
            category: "dev",
            cover: "dev-3"
        }
    ];

    const courseGrid = document.getElementById('courseGrid');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // 生成 SVG 封面
    function getCourseCover(type, id) {
        const colors = {
            basic: ['#E6F7FF', '#1890FF'],
            dev: ['#F6FFED', '#52C41A'],
            ops: ['#FFF7E6', '#FA8C16'],
            kernel: ['#F9F0FF', '#722ED1'],
            arch: ['#E6FFFB', '#13C2C2']
        };
        const [bg, fg] = colors[type] || colors.basic;
        
        return `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 300 160'%3E%3Crect width='300' height='160' fill='${encodeURIComponent(bg)}'/%3E%3Ctext x='50%25' y='50%25' dy='.3em' text-anchor='middle' font-family='sans-serif' font-weight='bold' font-size='24' fill='${encodeURIComponent(fg)}' fill-opacity='0.2'%3EKWDB Training%3C/text%3E%3Ccircle cx='${(id*30)%300}' cy='${(id*20)%160}' r='20' fill='${encodeURIComponent(fg)}' fill-opacity='0.1'/%3E%3Cpath d='M0 160 L300 120 V160 Z' fill='${encodeURIComponent(fg)}' fill-opacity='0.1'/%3E%3C/svg%3E`;
    }

    // 渲染课程列表
    function renderCourses(filter = 'all') {
        if (!courseGrid) return;
        
        const filteredData = filter === 'all' 
            ? courses 
            : courses.filter(c => c.category === filter);

        courseGrid.innerHTML = filteredData.map(course => `
            <div class="course-card" onclick="window.location.href='#'">
                <div class="course-cover">
                    <img src="${getCourseCover(course.category, course.id)}" alt="${course.title}">
                </div>
                <div class="course-content">
                    <div class="course-tags">
                        ${course.tags.map(tag => `<span class="course-tag">${tag}</span>`).join('')}
                    </div>
                    <h3 class="course-title">${course.title}</h3>
                    <div class="course-info">
                        <div class="course-level">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                            </svg>
                            ${course.level}
                        </div>
                        <div class="course-duration">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            ${course.duration}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // 绑定筛选事件
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderCourses(btn.dataset.filter);
        });
    });

    // 初始化
    renderCourses();
});
