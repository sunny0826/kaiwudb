document.addEventListener('DOMContentLoaded', () => {
    initScrollSpy();
    initSmoothScroll();
    initInteractions();
    updateActivityStatus();
});

function initScrollSpy() {
    const nav = document.getElementById('stickyNav');
    if (!nav) return;

    const navLinks = nav.querySelectorAll('.tab-link');
    const sections = document.querySelectorAll('.detail-section');
    
    // Offset for sticky header (Navbar approx 64px + Sticky Nav approx 60px)
    const offset = 130; 

    const onScroll = () => {
        let current = '';
        const scrollPosition = window.scrollY + offset + 20; // +20 buffer

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        // If at bottom of page, highlight last item if logic misses it
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
            if (sections.length > 0) {
                current = sections[sections.length - 1].getAttribute('id');
            }
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', onScroll);
}

function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.activity-tabs-nav .tab-link');
    const offset = 130; // Matches scroll spy offset

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Stop main.js handler

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
                
                // Manually set active class immediately for better feedback
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

function initInteractions() {
    // Register Button
    const registerBtns = document.querySelectorAll('.btn-primary');
    registerBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const statusTag = document.querySelector('.status-tag');
            if (statusTag && statusTag.classList.contains('registering')) {
                alert('报名成功！我们会将确认信息发送至您的邮箱。');
                btn.textContent = '已报名';
                btn.disabled = true;
                btn.style.background = '#52c41a';
                btn.style.cursor = 'default';
            } else if (statusTag && statusTag.classList.contains('ended')) {
                alert('活动已结束，无法报名。');
            } else {
                alert('当前活动不在报名期内。');
            }
        });
    });

    // Share Button
    const shareBtns = document.querySelectorAll('.btn-secondary');
    shareBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                alert('链接已复制到剪贴板');
            }).catch(err => {
                console.error('Could not copy text: ', err);
                // Fallback
                const input = document.createElement('textarea');
                input.value = url;
                document.body.appendChild(input);
                input.select();
                document.execCommand('copy');
                document.body.removeChild(input);
                alert('链接已复制到剪贴板');
            });
        });
    });
}

function updateActivityStatus() {
    // Example logic to update status based on date
    // In a real app, this would be server-side or based on API data
    const now = new Date();
    // Hardcoded date from HTML: 2026-01-31
    const activityDateStr = '2026-01-31T18:00:00'; // Event end time
    const activityDate = new Date(activityDateStr);
    
    const statusTag = document.querySelector('.status-tag');
    const registerBtn = document.querySelector('.hero-actions .btn-primary');
    
    if (!statusTag || !registerBtn) return;

    if (now > activityDate) {
        // Activity Ended
        statusTag.textContent = '已结束';
        statusTag.className = 'status-tag ended'; 
        // Remove inline styles to rely on CSS
        statusTag.removeAttribute('style');
        
        registerBtn.textContent = '活动已结束';
        registerBtn.disabled = true;
    }
}
