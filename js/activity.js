/**
 * Activity Page Logic
 */

// Mock Data
const activities = [
    {
        id: 1,
        title: "KaiwuDB 2026 开发者大会 - 上海站",
        date: "2026-01-28 14:00-17:00",
        startDate: "2026-01-28",
        endDate: "2026-01-28",
        location: "上海 · 浦东新区张江高科",
        type: "offline",
        status: "registering", // registering, ongoing, ended
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        tags: ["开发者大会", "线下"]
    },
    {
        id: 2,
        title: "KaiwuDB 核心技术揭秘：时序引擎优化实践",
        date: "2026-01-30 19:30-21:00",
        startDate: "2026-01-30",
        endDate: "2026-01-30",
        location: "线上直播",
        type: "online",
        status: "ongoing",
        image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        tags: ["技术直播", "线上"]
    },
    {
        id: 3,
        title: "数据库性能调优实战训练营",
        date: "2026-01-15 09:00-17:00",
        startDate: "2026-01-15",
        endDate: "2026-01-15",
        location: "北京 · 海淀区中关村",
        type: "offline",
        status: "ended",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        tags: ["实战训练", "线下"]
    },
    {
        id: 4,
        title: "开源社区贡献者交流会",
        date: "2026-02-05 20:00-21:30",
        startDate: "2026-02-05",
        endDate: "2026-02-05",
        location: "线上会议",
        type: "online",
        status: "registering",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        tags: ["社区活动", "线上"]
    },
    {
        id: 5,
        title: "KaiwuDB + IoT 场景应用案例分享",
        date: "2026-01-10 14:00-16:00",
        startDate: "2026-01-10",
        endDate: "2026-01-10",
        location: "深圳 · 南山区科技园",
        type: "offline",
        status: "ended",
        image: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        tags: ["案例分享", "线下"]
    },
    {
        id: 6,
        title: "Rust 语言在数据库内核中的应用",
        date: "2026-02-12 19:00-20:30",
        startDate: "2026-02-12",
        endDate: "2026-02-12",
        location: "线上直播",
        type: "online",
        status: "registering",
        image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        tags: ["技术分享", "Rust"]
    },
    {
        id: 7,
        title: "春节假期技术研修周",
        date: "2026-01-22 - 2026-01-27",
        startDate: "2026-01-22",
        endDate: "2026-01-27",
        location: "线上",
        type: "online",
        status: "registering",
        image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        tags: ["自学", "线上", "多日活动"]
    }
];

// State Management
const activityState = {
    filter: 'all', // all, online, offline
    status: 'all',
    resource: 'all',
    currentDate: new Date('2026-01-28'), // Simulate current date based on context
    calendarDate: new Date('2026-01-28') // Date for calendar view navigation
};

document.addEventListener('DOMContentLoaded', () => {
    initActivityPage();
});

function initActivityPage() {
    renderCalendar();
    renderActivities();
    bindEvents();
}

function renderCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    if (!calendarGrid) return;

    const viewDate = activityState.calendarDate;
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth(); // 0-based

    // Update Month Title
    const monthTitle = document.querySelector('.month-title');
    if (monthTitle) {
        monthTitle.textContent = `${year}年${month + 1}月`;
    }

    // Days in current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // First day of the week (0=Sun, 1=Mon, ...)
    const firstDayIndex = new Date(year, month, 1).getDay();

    let html = '';

    // Empty slots for days before the 1st
    for (let i = 0; i < firstDayIndex; i++) {
        html += `<div class="day-cell empty"></div>`;
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = (dateStr === formatDate(activityState.currentDate));
        
        // Find events for this day
        const dayEvents = activities.filter(a => {
            if (a.startDate && a.endDate) {
                return dateStr >= a.startDate && dateStr <= a.endDate;
            }
            return a.date.startsWith(dateStr);
        });
        const hasEvent = dayEvents.length > 0;
        
        // Determine event position classes (start, middle, end)
        let eventPosClass = '';
        if (hasEvent) {
            // Use the first event to determine style if multiple events exist
            const evt = dayEvents[0];
            if (evt.startDate && evt.endDate) {
                if (evt.startDate === evt.endDate) {
                    // Single day event, no special start/end class needed, just has-event
                } else if (dateStr === evt.startDate) {
                    eventPosClass = 'event-start';
                } else if (dateStr === evt.endDate) {
                    eventPosClass = 'event-end';
                } else {
                    eventPosClass = 'event-middle';
                }
            }
        }
        
        // Tooltip content
        let tooltipAttr = '';
        if (hasEvent) {
            const eventTitles = dayEvents.map(e => `• ${e.title}`).join('\n');
            tooltipAttr = `data-tooltip="${eventTitles}"`;
        }
        
        html += `
            <div class="day-cell ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''} ${eventPosClass}" 
                 onclick="selectDate('${dateStr}')"
                 ${tooltipAttr}>
                ${day}
                ${hasEvent ? '<span class="event-dot"></span>' : ''}
            </div>
        `;
    }

    calendarGrid.innerHTML = html;
}

// Helper to format Date to YYYY-MM-DD
function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function renderActivities() {
    const container = document.getElementById('activityList');
    if (!container) return;

    // Filter Logic
    const filtered = activities.filter(item => {
        if (activityState.filter !== 'all' && item.type !== activityState.filter) return false;
        if (activityState.status !== 'all' && item.status !== activityState.status) return false;
        return true;
    });

    container.innerHTML = filtered.map(item => {
        let statusLabel = '';
        let btnText = '立即报名';
        let btnClass = '';
        
        switch(item.status) {
            case 'registering': 
                statusLabel = '报名中'; 
                break;
            case 'ongoing': 
                statusLabel = '进行中'; 
                btnText = '进入直播';
                break;
            case 'ended': 
                statusLabel = '已结束'; 
                btnText = '查看回放';
                btnClass = 'disabled';
                break;
        }

        // Use SVG instead of img
        const svgContent = getEventSVG(item.id, item.title);

        return `
            <div class="activity-card" onclick="window.location.href='activity-detail.html?id=${item.id}'" style="cursor: pointer;">
                <div class="activity-image-wrapper">
                    ${svgContent}
                    <div class="activity-status-badge status-${item.status}">${statusLabel}</div>
                </div>
                <div class="activity-content">
                    <h3 class="activity-title">${item.title}</h3>
                    <div class="activity-tags">
                        ${item.tags.map(t => `<span class="activity-tag">${t}</span>`).join('')}
                    </div>
                    <div class="activity-meta">
                        <div class="meta-item">
                            <i data-lucide="calendar" class="meta-icon"></i>
                            <span>${item.date}</span>
                        </div>
                        <div class="meta-item">
                            <i data-lucide="map-pin" class="meta-icon"></i>
                            <span>${item.location}</span>
                        </div>
                    </div>
                    <div class="activity-action">
                        <button class="btn-activity ${btnClass}">${btnText}</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    if (window.lucide) lucide.createIcons();
}

function bindEvents() {
    // Filter Tabs
    const filters = document.querySelectorAll('.filter-item');
    filters.forEach(f => {
        f.addEventListener('click', () => {
            filters.forEach(el => el.classList.remove('active'));
            f.classList.add('active');
            activityState.filter = f.dataset.filter;
            renderActivities();
        });
    });

    // Calendar selection placeholder
    window.selectDate = (dateStr) => {
        console.log('Selected date:', dateStr);
        // Simple visual feedback
        const cells = document.querySelectorAll('.day-cell');
        cells.forEach(c => c.classList.remove('today'));
        // Find cell with matching text content (simplified)
        // In real app, we would re-render or use data attributes
        const day = new Date(dateStr).getDate();
        const target = Array.from(cells).find(c => c.textContent.trim() == day);
        if (target) target.classList.add('today');
    };
}

function getEventSVG(id, title) {
    const colors = [
        ['#1677FF', '#4096ff'], // Blue
        ['#00C853', '#69F0AE'], // Green
        ['#FFB300', '#FFE082'], // Amber
        ['#722ED1', '#B37FEB'], // Purple
        ['#F5222D', '#FF7875'], // Red
        ['#FA8C16', '#FFC069'], // Orange
    ];
    const color = colors[id % colors.length];
    
    return `
    <svg class="activity-image" width="400" height="225" viewBox="0 0 400 225" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="225" fill="${color[0]}" fill-opacity="0.1"/>
        <circle cx="${(id * 70) % 400}" cy="${(id * 40) % 225}" r="80" fill="${color[1]}" fill-opacity="0.2"/>
        <path d="M0 225 L400 180 V225 Z" fill="${color[0]}" fill-opacity="0.1"/>
        <text x="20" y="200" font-family="Arial" font-size="60" fill="${color[0]}" fill-opacity="0.1" font-weight="bold">${id}</text>
    </svg>
    `;
}
