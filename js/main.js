// Feagine 擎羽 Website - Main JavaScript
// 全局变量
let currentLanguage = 'en';
// Swiper removed with Products section

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// 网站初始化
function initializeWebsite() {
    initializeLanguage();
    initializeNavigation();
    // Swiper removed
    initializeAOS();
    initializeLazyLoading();
    initializeContactForm();
    initializeTechSpecs();
    initializeCookieConsent();
    initializeScrollEffects();
    ensureHeroVideoLoop();
}

// 语言切换功能
function initializeLanguage() {
    const langToggle = document.getElementById('lang-toggle');
    const langText = document.getElementById('lang-text');
    
    if (langToggle) {
        langToggle.addEventListener('click', function() {
            currentLanguage = currentLanguage === 'en' ? 'cn' : 'en';
            updateLanguage();
            updateLanguageToggle();
        });
    }
    
    function updateLanguageToggle() {
        if (langText) {
            langText.textContent = currentLanguage === 'en' ? '中文' : 'EN';
        }
    }
}

// 更新页面语言
function updateLanguage() {
    const elements = document.querySelectorAll('[data-en][data-cn]');
    
    elements.forEach(element => {
        const text = currentLanguage === 'en' ? element.getAttribute('data-en') : element.getAttribute('data-cn');
        if (text) {
            element.textContent = text;
        }
    });
    
    // 更新占位符文本
    const placeholders = document.querySelectorAll('[data-placeholder-en][data-placeholder-cn]');
    placeholders.forEach(element => {
        const placeholder = currentLanguage === 'en' ? 
            element.getAttribute('data-placeholder-en') : 
            element.getAttribute('data-placeholder-cn');
        if (placeholder) {
            element.setAttribute('placeholder', placeholder);
        }
    });
    
    // 更新文档语言属性
    document.documentElement.lang = currentLanguage;
}

// 导航栏功能
function initializeNavigation() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // 移动端菜单切换
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
    
    // 平滑滚动到锚点
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // 考虑导航栏高度
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
            
            // 关闭移动端菜单
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            if (mobileMenuToggle) {
                mobileMenuToggle.classList.remove('active');
            }
        });
    });
    
    // 滚动时导航栏隐藏/显示功能
    let lastScrollTop = 0;
    let scrollTimeout;
    
    function handleNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 防抖处理
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // 如果在页面顶部，始终显示导航栏
            if (currentScrollTop <= 50) {
                navbar.classList.remove('hidden');
                navbar.classList.remove('scrolled');
            } else {
                // 向下滚动时隐藏导航栏
                if (currentScrollTop > lastScrollTop && currentScrollTop > 100) {
                    navbar.classList.add('hidden');
                } 
                // 向上滚动时显示导航栏
                else if (currentScrollTop < lastScrollTop) {
                    navbar.classList.remove('hidden');
                }
                navbar.classList.add('scrolled');
            }
            
            lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
        }, 10);
    }
    
    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
}

// 初始化 Swiper 轮播
// initializeSwiper removed

// 初始化 AOS 动画
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    } else {
        // Fallback: 当 AOS 不可用或未加载时，确保带有 data-aos 的元素可见
        try {
            const aosElements = document.querySelectorAll('[data-aos]');
            aosElements.forEach(el => {
                el.classList.add('aos-animate');
                // 移除可能影响显示的内联样式
                el.style.opacity = '';
                el.style.transform = '';
                el.style.visibility = '';
            });
            console.warn('AOS not available. Applied fallback to show content.');
        } catch (e) {
            console.warn('AOS fallback failed:', e);
        }
    }
}

// 图片懒加载
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // 降级处理
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

// 联系表单功能
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(this);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                company: formData.get('company'),
                message: formData.get('message')
            };
            
            // 表单验证
            if (validateForm(data)) {
                submitForm(data);
            }
        });
    }
}

// 表单验证
function validateForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push(currentLanguage === 'en' ? 'Name must be at least 2 characters' : '姓名至少需要2个字符');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push(currentLanguage === 'en' ? 'Please enter a valid email address' : '请输入有效的邮箱地址');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push(currentLanguage === 'en' ? 'Message must be at least 10 characters' : '留言至少需要10个字符');
    }
    
    if (errors.length > 0) {
        showFormErrors(errors);
        return false;
    }
    
    return true;
}

// 邮箱格式验证
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 显示表单错误
function showFormErrors(errors) {
    const errorContainer = document.getElementById('form-errors') || createErrorContainer();
    errorContainer.innerHTML = errors.map(error => `<p class="error-message">${error}</p>`).join('');
    errorContainer.style.display = 'block';
    
    // 3秒后自动隐藏错误信息
    setTimeout(() => {
        errorContainer.style.display = 'none';
    }, 3000);
}

// 创建错误信息容器
function createErrorContainer() {
    const container = document.createElement('div');
    container.id = 'form-errors';
    container.className = 'form-errors';
    
    const form = document.getElementById('contact-form');
    if (form) {
        form.insertBefore(container, form.firstChild);
    }
    
    return container;
}

// 提交表单
function submitForm(data) {
    const submitButton = document.querySelector('#contact-form button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // 显示加载状态
    submitButton.textContent = currentLanguage === 'en' ? 'Sending...' : '发送中...';
    submitButton.disabled = true;
    
    // 模拟表单提交（实际项目中需要连接后端API）
    setTimeout(() => {
        showSuccessMessage();
        resetForm();
        
        // 恢复按钮状态
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
}

// 显示成功信息
function showSuccessMessage() {
    const message = currentLanguage === 'en' ? 
        'Thank you for your message! We will get back to you soon.' : 
        '感谢您的留言！我们会尽快回复您。';
    
    showNotification(message, 'success');
}

// 重置表单
function resetForm() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.reset();
    }
}

// 显示通知
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// 技术规格表格功能
function initializeTechSpecs() {
    const toggleButton = document.getElementById('specs-toggle');
    
    if (toggleButton) {
        toggleButton.addEventListener('click', function() {
            const specsTable = document.getElementById('specs-table');
            const detailedSpecsTable = document.getElementById('detailed-specs-table');
            
            if (specsTable && detailedSpecsTable) {
                const isExpanded = specsTable.classList.contains('show');
                
                if (isExpanded) {
                    // 隐藏表格
                    specsTable.classList.remove('show');
                    detailedSpecsTable.classList.remove('show');
                    this.classList.remove('active');
                } else {
                    // 显示表格
                    specsTable.classList.add('show');
                    detailedSpecsTable.classList.add('show');
                    this.classList.add('active');
                }
            }
        });
    }
}

// Cookie 同意条功能
function initializeCookieConsent() {
    const cookieConsent = document.getElementById('cookie-consent');
    const acceptButton = document.getElementById('accept-cookies');
    const declineButton = document.getElementById('decline-cookies');
    
    // 检查是否已经设置了 cookie 偏好
    if (!getCookie('cookie-consent')) {
        setTimeout(() => {
            if (cookieConsent) {
                cookieConsent.style.display = 'block';
            }
        }, 2000);
    }
    
    if (acceptButton) {
        acceptButton.addEventListener('click', function() {
            setCookie('cookie-consent', 'accepted', 365);
            hideCookieConsent();
        });
    }
    
    if (declineButton) {
        declineButton.addEventListener('click', function() {
            setCookie('cookie-consent', 'declined', 365);
            hideCookieConsent();
        });
    }
}

// 隐藏 Cookie 同意条
function hideCookieConsent() {
    const cookieConsent = document.getElementById('cookie-consent');
    if (cookieConsent) {
        cookieConsent.style.display = 'none';
    }
}

// Cookie 操作函数
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// 滚动效果
function initializeScrollEffects() {
    // 返回顶部按钮
    const backToTop = createBackToTopButton();
    
    window.addEventListener('scroll', function() {
        // 显示/隐藏返回顶部按钮
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
        
        // 视差效果（如果需要）
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            heroSection.style.transform = `translateY(${parallax}px)`;
        }
    });
}

// 创建返回顶部按钮
function createBackToTopButton() {
    const button = document.createElement('button');
    button.className = 'back-to-top';
    button.innerHTML = '↑';
    button.setAttribute('aria-label', 'Back to top');
    
    button.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    document.body.appendChild(button);
    return button;
}

// 工具函数：防抖
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 工具函数：节流
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// 性能优化：使用 requestAnimationFrame 优化滚动事件
const optimizedScroll = throttle(function() {
    // 滚动相关的性能敏感操作
}, 16); // 约60fps

window.addEventListener('scroll', optimizedScroll);

// 错误处理
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // 在生产环境中，可以发送错误报告到服务器
});

// 页面可见性 API - 优化性能
document.addEventListener('visibilitychange', function() {
    // Swiper removed: no autoplay control needed
});

// 导出主要函数（如果需要在其他地方使用）
window.Feagine = {
    updateLanguage,
    showNotification,
    currentLanguage: () => currentLanguage
};
// 英雄区视频循环回退：在部分浏览器中，loop属性可能因缓冲/可见性策略未触发
function ensureHeroVideoLoop() {
    const hv = document.getElementById('hero-video');
    if (!hv) return;
    // 确保在可播放后绑定事件
    hv.addEventListener('ended', () => {
        try {
            hv.currentTime = 0;
            hv.play().catch(() => {});
        } catch (e) {
            console.warn('Hero video restart failed:', e);
        }
    });
    // 进入视口时尝试播放（移动端可能需要交互，但muted允许自动播放）
    const tryPlay = () => {
        if (hv.paused) {
            hv.play().catch(() => {});
        }
    };
    document.addEventListener('visibilitychange', tryPlay, { passive: true });
    window.addEventListener('focus', tryPlay, { passive: true });
}