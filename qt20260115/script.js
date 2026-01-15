// script.js - 青少年网络安全赛事平台主脚本文件

/**
 * 应用主控制器
 */
class AppController {
    constructor() {
        this.modules = {
            'core': '核心基础模块',
            'competition': '竞赛服务模块',
            'learning': '学习赋能模块',
            'interaction': '互动交流模块',
            'support': '辅助支持模块'
        };

        this.currentModule = 'core';
        this.isInitialized = false;
        this.eventHandlers = new Map();
    }

    /**
     * 初始化应用
     */
    async initialize() {
        if (this.isInitialized) {
            console.warn('应用已经初始化');
            return;
        }

        console.log('青少年网络安全赛事平台初始化...');

        try {
            // 显示加载状态
            this.showLoading();

            // 初始化顺序执行
            await this.initializeCore();
            await this.initializeUI();
            await this.initializeModules();
            await this.initializeEventListeners();

            // 隐藏加载状态
            this.hideLoading();

            this.isInitialized = true;
            console.log('应用初始化完成');

            // 发送初始化完成事件
            this.dispatchEvent('app:initialized', { timestamp: Date.now() });

        } catch (error) {
            console.error('应用初始化失败:', error);
            this.showError('应用初始化失败，请刷新页面重试');
        }
    }

    /**
     * 初始化核心功能
     */
    async initializeCore() {
        console.log('初始化核心功能...');

        // 检查浏览器兼容性
        if (!this.checkBrowserCompatibility()) {
            throw new Error('浏览器不兼容，请使用现代浏览器访问');
        }

        // 设置全局配置
        this.config = {
            apiBaseUrl: '/api',
            defaultModule: 'core',
            autoSaveInterval: 30000,
            maxUploadSize: 5 * 1024 * 1024 // 5MB
        };

        // 初始化状态管理
        this.state = {
            user: null,
            notifications: [],
            announcements: [],
            unreadCount: 0
        };

        // 尝试恢复用户会话
        await this.restoreUserSession();
    }

    /**
     * 初始化UI组件
     */
    async initializeUI() {
        console.log('初始化UI组件...');

        // 加载所有组件
        await this.loadComponents();

        // 初始化导航
        this.initializeNavigation();

        // 初始化轮播图
        this.initializeCarousel();

        // 初始化倒计时
        this.initializeCountdown();

        // 初始化公告已读功能
        this.initializeAnnouncements();
    }

    /**
     * 初始化模块系统
     */
    async initializeModules() {
        console.log('初始化模块系统...');

        // 加载默认模块
        await this.loadModule(this.config.defaultModule);

        // 预加载其他模块（延迟加载）
        setTimeout(() => {
            this.preloadModules();
        }, 2000);
    }

    /**
     * 初始化事件监听器
     */
    async initializeEventListeners() {
        console.log('初始化事件监听器...');

        // 窗口事件
        window.addEventListener('resize', this.handleResize.bind(this));
        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));

        // 键盘事件
        document.addEventListener('keydown', this.handleKeyDown.bind(this));

        // 自定义事件
        this.addEventListener('module:switch', this.handleModuleSwitch.bind(this));
        this.addEventListener('user:login', this.handleUserLogin.bind(this));
        this.addEventListener('user:logout', this.handleUserLogout.bind(this));
        this.addEventListener('notification:new', this.handleNewNotification.bind(this));
    }

    /**
     * 检查浏览器兼容性
     */
    checkBrowserCompatibility() {
        const requiredFeatures = [
            'fetch',
            'Promise',
            'Map',
            'Set',
            'localStorage',
            'sessionStorage'
        ];

        for (const feature of requiredFeatures) {
            if (!window[feature]) {
                console.error(`浏览器不支持: ${feature}`);
                return false;
            }
        }

        return true;
    }

    /**
     * 恢复用户会话
     */
    async restoreUserSession() {
        try {
            const userData = localStorage.getItem('user_session');
            if (userData) {
                const session = JSON.parse(userData);

                // 检查会话是否过期
                if (session.expiresAt > Date.now()) {
                    this.state.user = session.user;
                    console.log('用户会话已恢复:', session.user.username);

                    // 发送用户登录事件
                    this.dispatchEvent('user:restored', { user: session.user });
                } else {
                    localStorage.removeItem('user_session');
                    console.log('用户会话已过期');
                }
            }
        } catch (error) {
            console.error('恢复用户会话失败:', error);
            localStorage.removeItem('user_session');
        }
    }

    /**
     * 加载所有组件
     */
    async loadComponents() {
        const components = [
            { id: 'header-container', url: 'components/header.html' },
            { id: 'hero-carousel-container', url: 'components/hero-carousel.html' },
            { id: 'sidebar-container', url: 'components/sidebar.html' },
            { id: 'footer-container', url: 'components/footer.html' }
        ];

        const promises = components.map(component => this.loadComponent(component));
        await Promise.all(promises);
    }

    /**
     * 加载单个组件
     */
    async loadComponent({ id, url }) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const html = await response.text();
            const container = document.getElementById(id);

            if (container) {
                container.innerHTML = html;
                console.log(`组件加载成功: ${url}`);

                // 发送组件加载完成事件
                this.dispatchEvent('component:loaded', { id, url });

                return true;
            } else {
                throw new Error(`容器不存在: ${id}`);
            }
        } catch (error) {
            console.error(`加载组件失败: ${url}`, error);

            const container = document.getElementById(id);
            if (container) {
                container.innerHTML = `
                    <div class="alert alert-danger">
                        <i class="fas fa-exclamation-triangle"></i>
                        加载组件失败，请刷新页面重试
                    </div>
                `;
            }

            return false;
        }
    }

    /**
     * 加载模块
     */
    async loadModule(moduleId) {
        if (!this.modules[moduleId]) {
            console.error(`模块不存在: ${moduleId}`);
            this.showError(`模块 ${moduleId} 不存在`);
            return;
        }

        try {
            // 显示模块加载状态
            this.showModuleLoading();

            // 加载模块内容
            const response = await fetch(`modules/${moduleId}.html`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const html = await response.text();
            const container = document.getElementById('module-container');

            if (container) {
                // 添加淡出效果
                container.style.opacity = '0.5';
                container.style.transition = 'opacity 0.3s';

                setTimeout(() => {
                    container.innerHTML = html;
                    container.style.opacity = '1';

                    // 更新当前模块
                    this.currentModule = moduleId;

                    // 更新导航状态
                    this.updateNavigation(moduleId);

                    // 发送模块加载完成事件
                    this.dispatchEvent('module:loaded', {
                        moduleId,
                        moduleName: this.modules[moduleId]
                    });

                    console.log(`模块加载成功: ${this.modules[moduleId]}`);

                    // 初始化模块特定的功能
                    this.initializeModuleFeatures(moduleId);

                }, 300);
            }
        } catch (error) {
            console.error(`加载模块失败: ${moduleId}`, error);

            const container = document.getElementById('module-container');
            if (container) {
                container.innerHTML = `
                    <div class="section-card">
                        <div class="alert alert-danger">
                            <i class="fas fa-exclamation-triangle"></i>
                            加载模块失败，请稍后重试
                        </div>
                    </div>
                `;
            }
        } finally {
            // 隐藏加载状态
            this.hideModuleLoading();
        }
    }

    /**
     * 预加载其他模块
     */
    preloadModules() {
        Object.keys(this.modules).forEach(moduleId => {
            if (moduleId !== this.currentModule) {
                // 使用预加载链接
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = `modules/${moduleId}.html`;
                document.head.appendChild(link);
            }
        });
    }

    /**
     * 初始化模块特定功能
     */
    initializeModuleFeatures(moduleId) {
        switch (moduleId) {
            case 'competition':
                this.initializeCompetitionModule();
                break;
            case 'learning':
                this.initializeLearningModule();
                break;
            case 'interaction':
                this.initializeInteractionModule();
                break;
            case 'support':
                this.initializeSupportModule();
                break;
            default:
                // 核心模块不需要特殊初始化
                break;
        }
    }

    /**
     * 初始化导航系统
     */
    initializeNavigation() {
        // 移动端菜单切换
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navMenu = document.getElementById('navMenu');

        if (mobileMenuBtn && navMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-bars');
                    icon.classList.toggle('fa-times');
                }
            });

            // 点击导航项
            document.addEventListener('click', (event) => {
                const navItem = event.target.closest('.nav-item');
                if (navItem && navItem.dataset.section) {
                    const moduleId = navItem.dataset.section;

                    // 发送模块切换事件
                    this.dispatchEvent('module:switch', { moduleId });

                    // 移动端点击后关闭菜单
                    if (window.innerWidth <= 768) {
                        navMenu.classList.remove('active');
                        if (mobileMenuBtn) {
                            const icon = mobileMenuBtn.querySelector('i');
                            if (icon) {
                                icon.classList.remove('fa-times');
                                icon.classList.add('fa-bars');
                            }
                        }
                    }
                }
            });

            // 点击页面其他地方关闭移动端菜单
            document.addEventListener('click', (event) => {
                if (window.innerWidth <= 768) {
                    const isClickInsideMenu = navMenu.contains(event.target);
                    const isClickOnMenuBtn = mobileMenuBtn && mobileMenuBtn.contains(event.target);

                    if (!isClickInsideMenu && !isClickOnMenuBtn && navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        if (mobileMenuBtn) {
                            const icon = mobileMenuBtn.querySelector('i');
                            if (icon) {
                                icon.classList.remove('fa-times');
                                icon.classList.add('fa-bars');
                            }
                        }
                    }
                }
            });
        }
    }

    /**
     * 初始化轮播图
     */
    initializeCarousel() {
        const carousel = document.querySelector('.carousel');
        if (!carousel) return;

        let currentSlide = 0;
        const slides = carousel.querySelectorAll('.carousel-slide');
        const dots = carousel.querySelectorAll('.carousel-dot');

        if (slides.length === 0) return;

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
                clearInterval(window.carouselInterval);
                showSlide(index);
                startAutoCarousel();
            });
        });

        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        function startAutoCarousel() {
            clearInterval(window.carouselInterval);
            window.carouselInterval = setInterval(nextSlide, 5000);
        }

        // 初始化显示第一张幻灯片
        showSlide(0);

        // 开始自动轮播
        startAutoCarousel();

        // 鼠标悬停时暂停轮播
        carousel.addEventListener('mouseenter', () => {
            clearInterval(window.carouselInterval);
        });

        carousel.addEventListener('mouseleave', () => {
            startAutoCarousel();
        });
    }

    /**
     * 初始化倒计时
     */
    initializeCountdown() {
        const countdownElement = document.querySelector('.countdown');
        if (!countdownElement) return;

        // 设置截止日期：30天后的日期
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 30);
        targetDate.setHours(23, 59, 59, 0);

        function updateCountdown() {
            const now = new Date();
            const timeRemaining = targetDate - now;

            // 如果时间已过，重置为新的目标日期
            if (timeRemaining <= 0) {
                targetDate.setDate(targetDate.getDate() + 30);
                updateCountdown();
                return;
            }

            const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

            const daysElement = document.getElementById('days');
            const hoursElement = document.getElementById('hours');
            const minutesElement = document.getElementById('minutes');
            const secondsElement = document.getElementById('seconds');

            if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
            if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
            if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
            if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
        }

        // 初始更新
        updateCountdown();

        // 每秒更新一次
        window.countdownInterval = setInterval(updateCountdown, 1000);
    }

    /**
     * 初始化公告功能
     */
    initializeAnnouncements() {
        document.addEventListener('click', (event) => {
            const announcementItem = event.target.closest('.announcement-item');
            if (announcementItem) {
                const confirmSpan = announcementItem.querySelector('.read-confirm');

                if (!confirmSpan) {
                    const newConfirm = document.createElement('span');
                    newConfirm.classList.add('read-confirm');
                    newConfirm.innerHTML = '<i class="fas fa-check-circle"></i> 已读';
                    announcementItem.appendChild(newConfirm);

                    // 保存到本地存储
                    const announcementId = announcementItem.dataset.id || 'default';
                    localStorage.setItem(`announcement_read_${announcementId}`, 'true');

                    // 更新未读计数
                    this.updateUnreadCount();
                }
            }
        });
    }

    /**
     * 更新导航状态
     */
    updateNavigation(moduleId) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === moduleId) {
                item.classList.add('active');
            }
        });
    }

    /**
     * 更新未读计数
     */
    updateUnreadCount() {
        // 从本地存储获取已读公告
        const readAnnouncements = Object.keys(localStorage)
            .filter(key => key.startsWith('announcement_read_'))
            .length;

        // 模拟总公告数（实际应用中应从服务器获取）
        const totalAnnouncements = 5;
        const unreadCount = totalAnnouncements - readAnnouncements;

        this.state.unreadCount = Math.max(0, unreadCount);

        // 更新UI显示
        const badge = document.querySelector('.unread-badge');
        if (badge) {
            if (this.state.unreadCount > 0) {
                badge.textContent = this.state.unreadCount;
                badge.style.display = 'inline-block';
            } else {
                badge.style.display = 'none';
            }
        }
    }

    /**
     * 初始化竞赛模块
     */
    initializeCompetitionModule() {
        console.log('初始化竞赛服务模块');

        // 初始化报名表单验证
        this.initializeRegistrationForm();

        // 加载赛程数据
        this.loadCompetitionSchedule();
    }

    /**
     * 初始化学习模块
     */
    initializeLearningModule() {
        console.log('初始化学习赋能模块');

        // 初始化资源分类筛选
        this.initializeResourceFilter();

        // 初始化学习进度跟踪
        this.initializeLearningProgress();
    }

    /**
     * 初始化互动模块
     */
    initializeInteractionModule() {
        console.log('初始化互动交流模块');

        // 初始化论坛功能
        this.initializeForum();

        // 初始化反馈表单
        this.initializeFeedbackForm();
    }

    /**
     * 初始化支持模块
     */
    initializeSupportModule() {
        console.log('初始化辅助支持模块');

        // 初始化帮助中心
        this.initializeHelpCenter();

        // 初始化个人中心
        this.initializeUserProfile();
    }

    /**
     * 事件处理 - 模块切换
     */
    handleModuleSwitch(event) {
        const { moduleId } = event.detail;
        this.loadModule(moduleId);
    }

    /**
     * 事件处理 - 用户登录
     */
    handleUserLogin(event) {
        const { user } = event.detail;

        // 保存用户信息到状态
        this.state.user = user;

        // 保存到本地存储
        const session = {
            user,
            expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7天后过期
        };

        localStorage.setItem('user_session', JSON.stringify(session));

        // 更新UI
        this.updateUserUI();
    }

    /**
     * 事件处理 - 用户登出
     */
    handleUserLogout() {
        // 清除用户信息
        this.state.user = null;

        // 清除本地存储
        localStorage.removeItem('user_session');

        // 更新UI
        this.updateUserUI();
    }

    /**
     * 事件处理 - 新通知
     */
    handleNewNotification(event) {
        const { notification } = event.detail;

        // 添加到状态
        this.state.notifications.push(notification);

        // 显示通知
        this.showNotification(notification);
    }

    /**
     * 事件处理 - 窗口调整大小
     */
    handleResize() {
        // 发送窗口调整大小事件
        this.dispatchEvent('window:resize', {
            width: window.innerWidth,
            height: window.innerHeight
        });
    }

    /**
     * 事件处理 - 页面卸载前
     */
    handleBeforeUnload(event) {
        // 清理定时器
        if (window.carouselInterval) {
            clearInterval(window.carouselInterval);
        }

        if (window.countdownInterval) {
            clearInterval(window.countdownInterval);
        }

        // 保存未保存的数据
        this.savePendingData();
    }

    /**
     * 事件处理 - 键盘按下
     */
    handleKeyDown(event) {
        // ESC键关闭所有弹窗
        if (event.key === 'Escape') {
            this.closeAllModals();
        }

        // Ctrl+S 保存
        if (event.ctrlKey && event.key === 's') {
            event.preventDefault();
            this.saveCurrentData();
        }
    }

    /**
     * 显示加载状态
     */
    showLoading() {
        // 创建加载遮罩
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="text-center">
                <div class="loading" style="width: 40px; height: 40px; border-width: 4px;"></div>
                <p style="margin-top: 20px; color: var(--primary); font-weight: 500;">正在加载...</p>
            </div>
        `;
        overlay.id = 'global-loading-overlay';
        document.body.appendChild(overlay);
    }

    /**
     * 隐藏加载状态
     */
    hideLoading() {
        const overlay = document.getElementById('global-loading-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
        }
    }

    /**
     * 显示模块加载状态
     */
    showModuleLoading() {
        const container = document.getElementById('module-container');
        if (container) {
            container.innerHTML = `
                <div class="section-card text-center">
                    <div class="loading" style="width: 30px; height: 30px; margin: 20px auto;"></div>
                    <p style="color: var(--gray); margin-top: 10px;">正在加载模块...</p>
                </div>
            `;
        }
    }

    /**
     * 隐藏模块加载状态
     */
    hideModuleLoading() {
        // 这里可以添加额外的清理逻辑
    }

    /**
     * 显示错误消息
     */
    showError(message, duration = 5000) {
        const errorAlert = document.createElement('div');
        errorAlert.className = 'alert alert-danger';
        errorAlert.style.position = 'fixed';
        errorAlert.style.top = '20px';
        errorAlert.style.right = '20px';
        errorAlert.style.zIndex = '10000';
        errorAlert.style.maxWidth = '400px';
        errorAlert.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
            <button class="close-btn" onclick="this.parentNode.remove()">&times;</button>
        `;

        document.body.appendChild(errorAlert);

        // 自动消失
        if (duration > 0) {
            setTimeout(() => {
                if (errorAlert.parentNode) {
                    errorAlert.parentNode.removeChild(errorAlert);
                }
            }, duration);
        }
    }

    /**
     * 显示成功消息
     */
    showSuccess(message, duration = 3000) {
        const successAlert = document.createElement('div');
        successAlert.className = 'alert alert-success';
        successAlert.style.position = 'fixed';
        successAlert.style.top = '20px';
        successAlert.style.right = '20px';
        successAlert.style.zIndex = '10000';
        successAlert.style.maxWidth = '400px';
        successAlert.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
            <button class="close-btn" onclick="this.parentNode.remove()">&times;</button>
        `;

        document.body.appendChild(successAlert);

        // 自动消失
        if (duration > 0) {
            setTimeout(() => {
                if (successAlert.parentNode) {
                    successAlert.parentNode.removeChild(successAlert);
                }
            }, duration);
        }
    }

    /**
     * 显示通知
     */
    showNotification(notification) {
        const notificationElement = document.createElement('div');
        notificationElement.className = 'alert alert-info';
        notificationElement.style.position = 'fixed';
        notificationElement.style.top = '20px';
        notificationElement.style.right = '20px';
        notificationElement.style.zIndex = '10000';
        notificationElement.style.maxWidth = '400px';
        notificationElement.innerHTML = `
            <i class="fas fa-bell"></i>
            <span><strong>${notification.title}</strong><br>${notification.message}</span>
            <button class="close-btn" onclick="this.parentNode.remove()">&times;</button>
        `;

        document.body.appendChild(notificationElement);

        // 5秒后自动消失
        setTimeout(() => {
            if (notificationElement.parentNode) {
                notificationElement.parentNode.removeChild(notificationElement);
            }
        }, 5000);
    }

    /**
     * 更新用户界面
     */
    updateUserUI() {
        const userElements = document.querySelectorAll('.user-info');

        userElements.forEach(element => {
            if (this.state.user) {
                // 显示用户信息
                element.innerHTML = `
                    <div class="d-flex align-center">
                        <i class="fas fa-user-circle" style="font-size: 1.2rem; margin-right: 8px;"></i>
                        <span>${this.state.user.username}</span>
                        <button onclick="app.logout()" class="btn btn-sm btn-outline-primary ml-2">
                            <i class="fas fa-sign-out-alt"></i> 退出
                        </button>
                    </div>
                `;
            } else {
                // 显示登录按钮
                element.innerHTML = `
                    <button onclick="app.showLoginModal()" class="btn btn-primary btn-sm">
                        <i class="fas fa-sign-in-alt"></i> 登录
                    </button>
                `;
            }
        });
    }

    /**
     * 保存未保存的数据
     */
    savePendingData() {
        // 这里可以实现自动保存逻辑
        console.log('保存未保存的数据...');
    }

    /**
     * 保存当前数据
     */
    saveCurrentData() {
        // 这里可以实现手动保存逻辑
        this.showSuccess('数据保存成功');
    }

    /**
     * 关闭所有弹窗
     */
    closeAllModals() {
        document.querySelectorAll('.modal.show').forEach(modal => {
            modal.classList.remove('show');
        });
    }

    /**
     * 添加事件监听器
     */
    addEventListener(eventName, handler) {
        if (!this.eventHandlers.has(eventName)) {
            this.eventHandlers.set(eventName, []);
        }
        this.eventHandlers.get(eventName).push(handler);
    }

    /**
     * 移除事件监听器
     */
    removeEventListener(eventName, handler) {
        if (this.eventHandlers.has(eventName)) {
            const handlers = this.eventHandlers.get(eventName);
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }

    /**
     * 触发事件
     */
    dispatchEvent(eventName, data) {
        if (this.eventHandlers.has(eventName)) {
            const handlers = this.eventHandlers.get(eventName);
            handlers.forEach(handler => {
                try {
                    handler({ detail: data });
                } catch (error) {
                    console.error(`事件处理器错误: ${eventName}`, error);
                }
            });
        }
    }

    /**
     * 用户登录方法（示例）
     */
    async login(username, password) {
        // 这里应该调用真实的API
        // 模拟登录
        await new Promise(resolve => setTimeout(resolve, 1000));

        const user = {
            id: 1,
            username: username,
            email: `${username}@example.com`,
            user_type: 'student',
            full_name: '测试用户'
        };

        this.dispatchEvent('user:login', { user });
        this.showSuccess('登录成功');

        return user;
    }

    /**
     * 用户登出方法
     */
    logout() {
        this.dispatchEvent('user:logout', {});
        this.showSuccess('已退出登录');
    }

    /**
     * 显示登录模态框（示例）
     */
    showLoginModal() {
        // 这里可以实现登录模态框
        console.log('显示登录模态框');
    }
}

// 创建全局应用实例
window.app = new AppController();

// DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.app.initialize();
});

// 导出模块（如果使用模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AppController };
}