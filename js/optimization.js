// 视频懒加载优化
function optimizeVideoLoading() {
    const videos = document.querySelectorAll('video');
    
    // 创建Intersection Observer
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                
                // 如果视频有data-src属性，设置真实src
                if (video.dataset.src) {
                    video.src = video.dataset.src;
                    video.load();
                    // 加载后移除data-src避免重复加载
                    delete video.dataset.src;
                }
                
                // 停止观察已加载的视频
                videoObserver.unobserve(video);
            }
        });
    }, {
        rootMargin: '50px 0px', // 提前50px开始加载
        threshold: 0.01
    });

    // 为每个视频设置延迟加载
    videos.forEach(video => {
        // 保存原始src到data-src
        if (video.src && !video.dataset.src) {
            video.dataset.src = video.src;
            video.removeAttribute('src');
            // 添加加载提示
            video.poster = video.poster || 'img/placeholder.svg';
        }
        
        // 开始观察
        videoObserver.observe(video);
    });
}

// 图片懒加载优化
function optimizeImageLoading() {
    const images = document.querySelectorAll('img:not([loading="lazy"])');
    
    images.forEach(img => {
        // 添加原生懒加载属性
        img.setAttribute('loading', 'lazy');
        
        // 对于大图片，添加模糊占位符
        if (img.src && img.src.includes('4K-cover')) {
            img.style.filter = 'blur(5px)';
            img.addEventListener('load', () => {
                img.style.filter = 'none';
                img.style.transition = 'filter 0.3s ease';
            });
        }
    });
}

// CDN资源预加载优化
function preloadCriticalResources() {
    // 预加载关键CSS
    const criticalCSS = [
        'css/style.css'
    ];
    
    criticalCSS.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
    });
}

// 网络请求优化
function optimizeNetworkRequests() {
    // 添加资源提示
    const dnsPrefetch = [
        'https://fonts.googleapis.com',
        'https://cdn.bootcdn.net'
    ];
    
    dnsPrefetch.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
    });
}

// 性能监控
function monitorPerformance() {
    if ('PerformanceObserver' in window) {
        // 监控核心Web指标
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                console.log('Performance:', entry.name, entry.duration);
            }
        });
        
        observer.observe({entryTypes: ['navigation', 'resource', 'paint']});
    }
}

// 初始化所有优化
document.addEventListener('DOMContentLoaded', () => {
    optimizeVideoLoading();
    optimizeImageLoading();
    preloadCriticalResources();
    optimizeNetworkRequests();
    monitorPerformance();
    
    console.log('Website optimization completed');
});

// 导出优化函数供其他脚本使用
window.WebsiteOptimization = {
    optimizeVideoLoading,
    optimizeImageLoading,
    preloadCriticalResources,
    optimizeNetworkRequests
};