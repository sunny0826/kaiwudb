/**
 * Download Page Logic
 * Handles tab switching and interactive elements
 */

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initCopyButtons();
    initKwdbDownloadCard();
});

/**
 * Initialize Tab Switching
 */
function initTabs() {
    const tabs = document.querySelectorAll('.download-tab-btn');
    const panels = document.querySelectorAll('.download-tab-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-tab');

            // Deactivate all
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            // Activate current
            tab.classList.add('active');
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}

/**
 * Initialize Copy to Clipboard functionality
 */
function initCopyButtons() {
    const copyBtns = document.querySelectorAll('.copy-btn');

    copyBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const codeBlock = btn.previousElementSibling; // Assuming <code> is right before button
            if (codeBlock) {
                const text = codeBlock.textContent;
                try {
                    await navigator.clipboard.writeText(text);
                    
                    // Visual feedback
                    const originalIcon = btn.innerHTML;
                    btn.innerHTML = '<i data-lucide="check"></i>';
                    if (window.lucide) lucide.createIcons();
                    
                    setTimeout(() => {
                        btn.innerHTML = originalIcon;
                        if (window.lucide) lucide.createIcons();
                    }, 2000);
                    
                } catch (err) {
                    console.error('Failed to copy:', err);
                }
            }
        });
    });
}

function initKwdbDownloadCard() {
    const card = document.getElementById('kwdb-download-card');
    if (!card) return;

    const versionSelect = card.querySelector('#kwdb-version-select');
    const osSelect = card.querySelector('#kwdb-os-select');
    const archSelect = card.querySelector('#kwdb-arch-select');
    const downloadBtn = card.querySelector('#kwdb-download-btn');
    const hint = card.querySelector('#kwdb-selection-hint');

    if (!versionSelect || !osSelect || !archSelect || !downloadBtn || !hint) return;

    const getSelectedLabel = (selectEl) => {
        const option = selectEl.options[selectEl.selectedIndex];
        return option ? option.textContent.trim() : '';
    };

    const updateState = () => {
        const versionValue = versionSelect.value;
        const osValue = osSelect.value;
        const archValue = archSelect.value;
        const isReady = Boolean(versionValue && osValue && archValue);

        downloadBtn.classList.toggle('is-disabled', !isReady);
        downloadBtn.setAttribute('aria-disabled', String(!isReady));

        if (!isReady) {
            hint.textContent = '请选择版本、操作系统与架构以获取安装包';
            return;
        }

        const versionLabel = getSelectedLabel(versionSelect);
        const osLabel = getSelectedLabel(osSelect);
        const archLabel = getSelectedLabel(archSelect);
        hint.textContent = `已选择：${versionLabel} · ${osLabel} · ${archLabel}`;
    };

    versionSelect.addEventListener('change', updateState);
    osSelect.addEventListener('change', updateState);
    archSelect.addEventListener('change', updateState);

    updateState();
}
