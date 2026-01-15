// 主初始化函数
function initializeApp() {
    console.log('青少年网络安全赛事平台初始化...');
    
    // 加载所有组件
    loadComponents();
    
    // 初始化各模块
    initializeModules();
    
    // 绑定全局事件
    bindGlobalEvents();
    
    // 设置默认模块
    setActiveModule('core');
}

// 加载组件
function loadComponents() {
    loadComponent('header-container', 'components/header.html');
    loadComponent('hero-carousel-container', 'components/hero-carousel.html');
    loadComponent('sidebar-container', 'components/sidebar.html');
    loadComponent('footer-container', 'components/footer.html');
}

// 通用组件加载函数
function loadComponent(containerId, filePath) {
    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            document.getElementById(containerId).innerHTML = data;
            console.log(`已加载组件: ${filePath}`);
        })
        .catch(error => {
            console.error(`加载组件失败: ${filePath}`, error);
            //document.getElementById(containerId).innerHTML = `<p>加载组件时出错: ${filePath}</p>`;
            document.getElementById(containerId).innerHTML = `<p>加载组件时出错: ${filePath} → ${error.message}</p>`;
        });
}

// 加载模块内容
function loadModule(moduleId) {
    const moduleFile = `modules/${moduleId}.html`;
    fetch(moduleFile)
        .then(response => response.text())
        .then(data => {
            document.getElementById('module-container').innerHTML = data;
            console.log(`已加载模块: ${moduleId}`);
            
            // 触发模块加载完成事件
            const event = new CustomEvent('moduleLoaded', { detail: { moduleId: moduleId } });
            document.dispatchEvent(event);
        })
        .catch(error => {
            console.error(`加载模块失败: ${moduleId}`, error);
            document.getElementById('module-container').innerHTML = `
                <div class="section-card">
                    <h2>加载模块时出错</h2>
                    <p>无法加载 ${moduleId} 模块，请稍后重试。</p>
                </div>
            `;
        });
}

// 设置活动模块
function setActiveModule(moduleId) {
    // 更新导航状态
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === moduleId) {
            item.classList.add('active');
        }
    });
    
    // 加载模块内容
    loadModule(moduleId);
}

// 初始化模块
function initializeModules() {
    // 注册模块切换事件
    document.addEventListener('moduleSwitch', function(event) {
        setActiveModule(event.detail.moduleId);
    });
}

// 绑定全局事件
function bindGlobalEvents() {
    // 公告已读确认
    document.addEventListener('click', function(event) {
        if (event.target.closest('.announcement-item')) {
            const item = event.target.closest('.announcement-item');
            const confirmSpan = item.querySelector('.read-confirm');
            
            if (!confirmSpan) {
                const newConfirm = document.createElement('span');
                newConfirm.classList.add('read-confirm');
                newConfirm.textContent = '已读确认';
                item.appendChild(newConfirm);
                
                // 保存到本地存储
                const announcementId = item.dataset.id || 'default';
                localStorage.setItem(`announcement_read_${announcementId}`, 'true');
            }
        }
    });
    
    // 模块卡片悬停效果
    document.addEventListener('mouseover', function(event) {
        const card = event.target.closest('.module-card');
        if (card) {
            card.style.borderTopColor = getComputedStyle(document.documentElement).getPropertyValue('--accent');
        }
    });
    
    document.addEventListener('mouseout', function(event) {
        const card = event.target.closest('.module-card');
        if (card) {
            card.style.borderTopColor = getComputedStyle(document.documentElement).getPropertyValue('--primary');
        }
    });
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initializeApp);