document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});

const themeColors = {
    blue: '#0056D2',
    blueLight: '#60a5fa',
    purple: '#7c3aed',
    purpleLight: '#a78bfa',
    green: '#10b981',
    greenLight: '#34d399',
    orange: '#f59e0b',
    red: '#ef4444',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    gridLine: '#E5E7EB'
};

const charts = {};
const leadsState = {
    data: [],
    filteredData: [],
    currentPage: 1,
    itemsPerPage: 10,
    filters: {
        search: '',
        version: '',
        status: ''
    }
};

function initDashboard() {
    // Initialize empty charts
    charts.trend = echarts.init(document.getElementById('trend-chart'));
    charts.source = echarts.init(document.getElementById('source-chart'));
    charts.region = echarts.init(document.getElementById('region-chart'));
    charts.device = echarts.init(document.getElementById('device-chart'));
    charts.version = echarts.init(document.getElementById('version-chart'));
    charts.completion = echarts.init(document.getElementById('completion-chart'));

    // Initial Data Load (30 days default)
    updateDashboard(30);

    // Leads Data
    initLeadsData();
    initLeadsExport();
    initLeadsInteractions();

    // Event Listeners
    initDateRangePicker();
    initExportButton();
    
    // Global Resize
    window.addEventListener('resize', () => {
        Object.values(charts).forEach(c => c && c.resize());
    });
}

function initDateRangePicker() {
    // Calculate default date range (last 30 days)
    const today = new Date();
    const last30Days = new Date();
    last30Days.setDate(today.getDate() - 29); // 30 days including today

    flatpickr("#date-picker-wrapper", {
        mode: "range",
        wrap: true,
        locale: "zh",
        dateFormat: "Y-m-d",
        defaultDate: [last30Days, today],
        maxDate: "today",
        showMonths: 2,
        onReady: function(selectedDates, dateStr, instance) {
            // Create shortcut container
            const shortcutContainer = document.createElement("div");
            shortcutContainer.className = "flatpickr-shortcuts";
            
            const shortcuts = [
                { label: "最近 7 天", days: 7 },
                { label: "最近 30 天", days: 30 },
                { label: "最近 90 天", days: 90 },
                { label: "最近 1 年", days: 365 }
            ];

            shortcuts.forEach(s => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "flatpickr-shortcut-btn";
                btn.innerText = s.label;
                btn.addEventListener("click", () => {
                    const end = new Date();
                    const start = new Date();
                    start.setDate(end.getDate() - (s.days - 1));
                    
                    instance.setDate([start, end], true);
                    // Hide calendar after selection
                    instance.close();
                });
                shortcutContainer.appendChild(btn);
            });

            // Append to calendar
            instance.calendarContainer.prepend(shortcutContainer);
            instance.calendarContainer.classList.add("has-shortcuts");
        },
        onChange: function(selectedDates, dateStr, instance) {
            if (selectedDates.length === 2) {
                const start = selectedDates[0];
                const end = selectedDates[1];
                const diffTime = Math.abs(end - start);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
                
                updateDashboard(diffDays);
            }
        }
    });
}

function initExportButton() {
    const btn = document.querySelector('.header-controls .btn');
    if(btn) {
        btn.addEventListener('click', () => {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i data-lucide="loader" class="lucide-spin"></i> 导出中...';
            btn.disabled = true;
            lucide.createIcons();
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                lucide.createIcons();
                // Simulate download
                const link = document.createElement('a');
                link.href = '#';
                link.download = 'kaiwudb-stats-report.csv';
                link.click();
            }, 1500);
        });
    }
}

function updateDashboard(days) {
    updateKPIs(days);
    updateTrendChart(days);
    updateSourceChart();
    updateRegionChart();
    updateDeviceChart();
    updateVersionChart();
    updateCompletionChart();
}

function updateKPIs(days) {
    // Mock KPI updates based on days
    const multiplier = days / 30;
    
    // Total Downloads
    const totalDownloads = Math.floor(12845 * multiplier * (0.95 + Math.random() * 0.1));
    
    // Community Downloads (approx 85-90% of total)
    const communityDownloads = Math.floor(totalDownloads * (0.85 + Math.random() * 0.05));
    
    // Enterprise Applications (rest, maybe slightly different count if it's applications vs downloads, but let's scale it)
    const enterpriseApps = Math.floor(842 * multiplier * (0.9 + Math.random() * 0.2));
    
    // Completion Rate (Static-ish)
    const completionRate = (98 + Math.random()).toFixed(1) + '%';

    document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = totalDownloads.toLocaleString();
    document.querySelector('.stat-card:nth-child(2) .stat-value').textContent = communityDownloads.toLocaleString();
    document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = enterpriseApps.toLocaleString();
    document.querySelector('.stat-card:nth-child(4) .stat-value').textContent = completionRate;
}

function updateTrendChart(days) {
    const dates = Array.from({length: days}, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (days - 1 - i));
        return `${d.getMonth()+1}/${d.getDate()}`;
    });
    
    const visits = Array.from({length: days}, () => Math.floor(Math.random() * 500) + 1000);
    const downloads = visits.map(v => Math.floor(v * (0.2 + Math.random() * 0.1)));

    const option = {
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: themeColors.gridLine,
            textStyle: { color: themeColors.textPrimary },
            padding: 12
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: dates,
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { color: themeColors.textSecondary }
        },
        yAxis: {
            type: 'value',
            splitLine: {
                lineStyle: { type: 'dashed', color: themeColors.gridLine }
            },
            axisLabel: { color: themeColors.textSecondary }
        },
        series: [
            {
                name: '下载量',
                type: 'line',
                smooth: true,
                showSymbol: false,
                data: downloads,
                lineStyle: { width: 3, color: themeColors.blue },
                itemStyle: { color: themeColors.blue },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(0, 86, 210, 0.2)' },
                        { offset: 1, color: 'rgba(0, 86, 210, 0)' }
                    ])
                }
            }
        ]
    };
    charts.trend.setOption(option);
}

function updateSourceChart() {
    // Randomize slightly
    const data = [
        { value: 40 + Math.random()*10, name: '直接访问', itemStyle: { color: themeColors.blue } },
        { value: 25 + Math.random()*10, name: '搜索引擎', itemStyle: { color: themeColors.green } },
        { value: 15 + Math.random()*5, name: '外部链接', itemStyle: { color: themeColors.purple } },
        { value: 10 + Math.random()*5, name: '社交媒体', itemStyle: { color: themeColors.orange } }
    ];

    const option = {
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: themeColors.gridLine,
            formatter: '{b}: {d}%'
        },
        legend: {
            bottom: '0%',
            left: 'center',
            icon: 'circle',
            itemGap: 15,
            textStyle: { color: themeColors.textSecondary, fontSize: 12 }
        },
        series: [{
            name: '下载来源',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '40%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 8,
                borderColor: '#fff',
                borderWidth: 2
            },
            label: { show: false },
            data: data
        }]
    };
    charts.source.setOption(option);
}

function updateRegionChart() {
    const data = [3200, 2800, 2400, 1800, 1200].map(v => Math.floor(v * (0.9 + Math.random() * 0.2)));
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: themeColors.gridLine,
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '3%',
            containLabel: true
        },
        xAxis: { type: 'value', show: false },
        yAxis: {
            type: 'category',
            data: ['北京', '上海', '广东', '浙江', '江苏'],
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { color: themeColors.textSecondary }
        },
        series: [{
            name: '用户数',
            type: 'bar',
            data: data,
            barWidth: 16,
            itemStyle: {
                borderRadius: [0, 4, 4, 0],
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: themeColors.blue },
                    { offset: 1, color: themeColors.blueLight }
                ])
            },
            label: {
                show: true,
                position: 'right',
                color: themeColors.textSecondary
            }
        }]
    };
    charts.region.setOption(option);
}

function updateDeviceChart() {
    const option = {
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: themeColors.gridLine,
            formatter: '{b}: {c} ({d}%)'
        },
        series: [
            {
                name: '终端类型',
                type: 'pie',
                selectedMode: 'single',
                radius: [0, '40%'],
                center: ['50%', '50%'],
                label: { position: 'inner', fontSize: 10, color: '#fff' },
                labelLine: { show: false },
                data: [
                    { value: 850, name: 'PC端', itemStyle: { color: themeColors.blue } },
                    { value: 150, name: '移动端', itemStyle: { color: themeColors.green } }
                ]
            },
            {
                name: '操作系统',
                type: 'pie',
                radius: ['55%', '75%'],
                center: ['50%', '50%'],
                itemStyle: {
                    borderRadius: 4,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: { show: false },
                data: [
                    { value: 450, name: 'Linux (x86)', itemStyle: { color: themeColors.blue } },
                    { value: 300, name: 'Linux (ARM)', itemStyle: { color: themeColors.blueLight } },
                    { value: 80, name: 'macOS', itemStyle: { color: themeColors.purple } },
                    { value: 20, name: 'Windows', itemStyle: { color: themeColors.purpleLight } },
                    { value: 100, name: 'Android', itemStyle: { color: themeColors.green } },
                    { value: 50, name: 'iOS', itemStyle: { color: themeColors.greenLight } }
                ]
            }
        ]
    };
    charts.device.setOption(option);
}

function updateVersionChart() {
    const option = {
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: themeColors.gridLine,
        },
        legend: {
            bottom: '0%',
            left: 'center',
            icon: 'circle',
            itemGap: 15,
            textStyle: { color: themeColors.textSecondary, fontSize: 12 }
        },
        series: [{
            name: '版本',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '40%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 8,
                borderColor: '#fff',
                borderWidth: 2
            },
            label: { show: false },
            data: [
                { value: 1048, name: 'v3.0.0', itemStyle: { color: themeColors.blue } },
                { value: 735, name: 'v2.1.0', itemStyle: { color: themeColors.purple } },
                { value: 580, name: 'v2.0.3', itemStyle: { color: themeColors.purpleLight } },
                { value: 484, name: 'v1.0.0', itemStyle: { color: themeColors.textSecondary } }
            ]
        }]
    };
    charts.version.setOption(option);
}

function updateCompletionChart() {
    const option = {
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: themeColors.gridLine,
        },
        legend: {
            bottom: '0%',
            left: 'center',
            icon: 'circle',
            itemGap: 15,
            textStyle: { color: themeColors.textSecondary, fontSize: 12 }
        },
        series: [{
            name: '状态',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '40%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 8,
                borderColor: '#fff',
                borderWidth: 2
            },
            label: { show: false },
            data: [
                { value: 985, name: '下载成功', itemStyle: { color: themeColors.green } },
                { value: 10, name: '网络中断', itemStyle: { color: themeColors.orange } },
                { value: 5, name: '用户取消', itemStyle: { color: themeColors.textSecondary } }
            ]
        }]
    };
    charts.completion.setOption(option);
}
// Leads Management
function initLeadsData() {
    // Generate mock records
    const versions = ['Enterprise v3.0', 'KAT v1.2', 'Enterprise v2.0', 'KAT v2.0 Beta'];
    const statuses = ['Pending', 'Approved', 'Contacted', 'Rejected'];
    const data = [];
    
    for(let i=0; i<45; i++) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 60));
        
        data.push({
            date: date.toISOString().split('T')[0],
            phone: '1' + Math.floor(3000000000 + Math.random() * 6999999999),
            email: `user${Math.floor(Math.random()*1000)}@company${Math.floor(Math.random()*10)}.com`,
            version: versions[Math.floor(Math.random() * versions.length)],
            status: statuses[Math.floor(Math.random() * statuses.length)]
        });
    }
    // Sort by date desc
    data.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    leadsState.data = data;
    applyLeadsFilters();
}

function applyLeadsFilters() {
    let result = leadsState.data;

    // Filter by Search (Phone or Email)
    if (leadsState.filters.search) {
        const term = leadsState.filters.search.toLowerCase();
        result = result.filter(item => 
            item.phone.includes(term) || 
            item.email.toLowerCase().includes(term)
        );
    }

    // Filter by Version
    if (leadsState.filters.version) {
        result = result.filter(item => item.version === leadsState.filters.version);
    }

    // Filter by Status
    if (leadsState.filters.status) {
        result = result.filter(item => item.status === leadsState.filters.status);
    }

    leadsState.filteredData = result;
    leadsState.currentPage = 1;
    renderLeadsTable();
}

function renderLeadsTable() {
    const tbody = document.querySelector('#leads-table tbody');
    if(!tbody) return;
    
    // Pagination Logic
    const start = (leadsState.currentPage - 1) * leadsState.itemsPerPage;
    const end = start + leadsState.itemsPerPage;
    const pageData = leadsState.filteredData.slice(start, end);
    const total = leadsState.filteredData.length;

    // Render Rows
    if (total === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 32px; color: #6b7280;">暂无符合条件的数据</td></tr>';
    } else {
        tbody.innerHTML = pageData.map(lead => `
            <tr>
                <td>${lead.date}</td>
                <td>${lead.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</td>
                <td>${lead.email}</td>
                <td><span class="badge badge-blue">${lead.version}</span></td>
                <td>
                    <span class="badge ${lead.status === 'Approved' ? 'badge-green' : (lead.status === 'Pending' ? 'badge-orange' : 'badge-blue')}">
                        ${lead.status}
                    </span>
                </td>
            </tr>
        `).join('');
    }

    // Update Pagination Info
    const startDisplay = total === 0 ? 0 : start + 1;
    const endDisplay = Math.min(end, total);
    
    const startEl = document.getElementById('leads-start');
    if(startEl) startEl.textContent = startDisplay;
    
    const endEl = document.getElementById('leads-end');
    if(endEl) endEl.textContent = endDisplay;
    
    const totalEl = document.getElementById('leads-total');
    if(totalEl) totalEl.textContent = total;
    
    const pageEl = document.getElementById('leads-current-page');
    if(pageEl) pageEl.textContent = leadsState.currentPage;

    // Update Buttons
    const prevBtn = document.getElementById('leads-prev');
    if(prevBtn) prevBtn.disabled = leadsState.currentPage === 1;
    
    const nextBtn = document.getElementById('leads-next');
    if(nextBtn) nextBtn.disabled = end >= total;
    
    if(window.lucide) lucide.createIcons();
}

function initLeadsInteractions() {
    const searchInput = document.getElementById('leads-search');
    const versionSelect = document.getElementById('leads-filter-version');
    const statusSelect = document.getElementById('leads-filter-status');
    const prevBtn = document.getElementById('leads-prev');
    const nextBtn = document.getElementById('leads-next');

    if (searchInput) {
        let timeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                leadsState.filters.search = e.target.value.trim();
                applyLeadsFilters();
            }, 300);
        });
    }

    if (versionSelect) {
        versionSelect.addEventListener('change', (e) => {
            leadsState.filters.version = e.target.value;
            applyLeadsFilters();
        });
    }

    if (statusSelect) {
        statusSelect.addEventListener('change', (e) => {
            leadsState.filters.status = e.target.value;
            applyLeadsFilters();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (leadsState.currentPage > 1) {
                leadsState.currentPage--;
                renderLeadsTable();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const total = leadsState.filteredData.length;
            if (leadsState.currentPage * leadsState.itemsPerPage < total) {
                leadsState.currentPage++;
                renderLeadsTable();
            }
        });
    }
}

function initLeadsExport() {
    const btn = document.getElementById('export-leads-btn');
    if(!btn) return;
    
    btn.addEventListener('click', () => {
        let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
        csvContent += "申请时间,联系人手机,联系邮箱,申请版本,状态\n";
        
        leadsState.filteredData.forEach(lead => {
            const row = [
                lead.date,
                lead.phone,
                lead.email,
                lead.version,
                lead.status
            ].join(",");
            csvContent += row + "\n";
        });
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `kaiwudb_leads_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}
