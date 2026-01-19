// 导航功能
function initializeNavigation() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    // 移动端菜单切换
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }
    
    // 导航项点击事件
    document.addEventListener('click', function(event) {
        const navItem = event.target.closest('.nav-item');
        if (navItem) {
            const moduleId = navItem.dataset.section;
            
            // 触发模块切换事件
            const moduleSwitchEvent = new CustomEvent('moduleSwitch', {
                detail: { moduleId: moduleId }
            });
            document.dispatchEvent(moduleSwitchEvent);
            
            // 移动端点击后关闭菜单
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                if (mobileMenuBtn) {
                    const icon = mobileMenuBtn.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        }
    });
    
    // 点击页面其他地方关闭移动端菜单
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768) {
            const isClickInsideMenu = navMenu.contains(event.target);
            const isClickOnMenuBtn = mobileMenuBtn && mobileMenuBtn.contains(event.target);
            
            if (!isClickInsideMenu && !isClickOnMenuBtn && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (mobileMenuBtn) {
                    const icon = mobileMenuBtn.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        }
    });
}