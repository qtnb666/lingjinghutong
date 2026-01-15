// 轮播图功能
let carouselInterval;
let currentSlide = 0;

function initializeCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    
    if (slides.length === 0) {
        console.log('未找到轮播图元素');
        return;
    }
    
    // 显示指定幻灯片
    function showSlide(index) {
        // 确保索引在有效范围内
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        // 隐藏所有幻灯片
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // 显示当前幻灯片
        slides[index].classList.add('active');
        if (dots[index]) {
            dots[index].classList.add('active');
        }
        
        currentSlide = index;
    }
    
    // 点击圆点切换幻灯片
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(carouselInterval);
            showSlide(index);
            startAutoCarousel();
        });
    });
    
    // 下一张幻灯片
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    // 开始自动轮播
    function startAutoCarousel() {
        clearInterval(carouselInterval);
        carouselInterval = setInterval(nextSlide, 5000);
    }
    
    // 初始化显示第一张幻灯片
    showSlide(0);
    
    // 开始自动轮播
    startAutoCarousel();
    
    // 鼠标悬停时暂停轮播
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => {
            clearInterval(carouselInterval);
        });
        
        carousel.addEventListener('mouseleave', () => {
            startAutoCarousel();
        });
    }
    
    console.log('轮播图初始化完成');
}

// 清理轮播图定时器
function cleanupCarousel() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
    }
}

// 页面卸载时清理资源
window.addEventListener('beforeunload', cleanupCarousel);