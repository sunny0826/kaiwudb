/**
 * Customer Case Detail Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initLightbox();
});

/**
 * Initialize scroll animations for sections
 */
function initScrollAnimations() {
    const sections = document.querySelectorAll('.case-detail-section');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}

/**
 * Initialize image lightbox functionality
 */
function initLightbox() {
    const lightbox = document.getElementById('caseImageLightbox');
    const lightboxImg = document.getElementById('caseImageLightboxImg');
    const closeBtn = document.getElementById('caseImageLightboxClose');
    const triggerImages = document.querySelectorAll('.case-arch-image');

    if (!lightbox || !lightboxImg || !closeBtn) return;

    // Open lightbox
    triggerImages.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    // Close lightbox
    function closeLightbox() {
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeLightbox);

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('case-image-lightbox-inner')) {
            closeLightbox();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.getAttribute('aria-hidden') === 'false') {
            closeLightbox();
        }
    });
}
