document.addEventListener('DOMContentLoaded', () => {
    // 1. Tab 切换逻辑
    const tabItems = document.querySelectorAll('.tab-item');
    const smsForm = document.getElementById('form-sms');
    const pwdForm = document.getElementById('form-password');
    const authTitle = document.querySelector('.auth-title');

    tabItems.forEach(tab => {
        tab.addEventListener('click', () => {
            // 移除所有 active 状态
            tabItems.forEach(t => t.classList.remove('active'));
            // 激活当前 Tab
            tab.classList.add('active');

            const target = tab.getAttribute('data-target');
            if (target === 'sms') {
                smsForm.style.display = 'block';
                pwdForm.style.display = 'none';
                // 仅示例：验证码登录通常兼具注册功能
                authTitle.textContent = '登录 / 注册';
            } else {
                smsForm.style.display = 'none';
                pwdForm.style.display = 'block';
                authTitle.textContent = '登录';
            }
        });
    });

    // 2. 获取验证码倒计时逻辑
    const getCodeBtn = document.getElementById('get-code-btn');
    const phoneInput = document.getElementById('phone');
    let countdown = 0;
    let timer = null;

    getCodeBtn.addEventListener('click', () => {
        // 简单校验手机号是否为空
        if (!phoneInput.value.trim()) {
            alert('请输入手机号码');
            phoneInput.focus();
            return;
        }

        // 开始倒计时
        if (countdown === 0) {
            countdown = 60;
            getCodeBtn.disabled = true;
            getCodeBtn.textContent = `${countdown}s 后重新获取`;
            
            // 模拟发送请求...
            console.log(`Sending verification code to ${phoneInput.value}...`);

            timer = setInterval(() => {
                countdown--;
                if (countdown > 0) {
                    getCodeBtn.textContent = `${countdown}s 后重新获取`;
                } else {
                    clearInterval(timer);
                    getCodeBtn.disabled = false;
                    getCodeBtn.textContent = '获取验证码';
                }
            }, 1000);
        }
    });

    // 3. 表单提交阻止 (仅演示)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // 这里可以添加实际的登录/注册逻辑
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            
            btn.disabled = true;
            btn.textContent = '登录中...';
            
            setTimeout(() => {
                alert('登录成功！(演示)');
                btn.disabled = false;
                btn.textContent = originalText;
                // 跳转回首页
                window.location.href = 'index.html';
            }, 1500);
        });
    });
});
