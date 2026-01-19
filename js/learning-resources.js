import ModuleLoader from './module-loader.js'

ModuleLoader.prototype.initResourcesModule = function () {
    console.log('初始化学习资源页面模块');
    // 学习资源特定的初始化代码

    // 初始化新的手风琴目录
    this.initAccordionDirectory();

    // 初始化视频网格
    this.initVideoGrid();

    // 绑定搜索和筛选功能
    this.bindResourceFilters();

    // 绑定返回按钮
    this.bindBackButton();

    // 绑定PDF预览功能
    this.bindPdfPreview();

    // 初始化手风琴交互
    this.initAccordionInteractions();

    //// 初始化搜索功能
    //this.initSearchFunction();
}

// 绑定基础资源查看按钮
ModuleLoader.prototype.bindResourceViewButtons = function () {
    console.log("bindResourceViewButtons" )
    /*document.addEventListener('moduleLoaded', (e) => {*////忘记了这里不监听有什么后果，但是不监听可以运行
        console.log(1)
        const viewResourceBtn = document.querySelector('.view-resources-btn');
        if (viewResourceBtn) {
            viewResourceBtn.addEventListener('click', () => {
                // 触发资源页面打开事件
                console.log(1)
                const event = new CustomEvent('resources:open', {
                    detail: { category: 'basic' }
                });
                document.dispatchEvent(event);
            });
        }
    /*})*/
};

// 打开资源页面
ModuleLoader.prototype.openResourcesPage=function(category) {
    // 直接切换到资源页面模块
    const event = new CustomEvent('moduleSwitch', {
        detail: { moduleId: 'learning-resources' }
    });
    document.dispatchEvent(event);
};

// 加载资源页面
ModuleLoader.prototype.loadResourcesPage = async function() {
    try {
        const response = await fetch('modules/learning-resources.html');
        if (!response.ok) throw new Error('页面加载失败');

        const html = await response.text();
        const container = document.getElementById('module-container');

        if (container) {
            container.innerHTML = html;

            // 更新导航状态
            this.updateNavigation('learning');

            // 触发模块加载完成事件
            const event = new CustomEvent('moduleLoaded', {
                detail: { moduleId: 'learning-resources' }
            });
            setTimeout(() => document.dispatchEvent(event), 100);
        }
    } catch (error) {
        console.error('加载资源页面失败:', error);
        this.showError('加载资源页面失败');
    }
}

//// 初始化PDF目录
//ModuleLoader.prototype.initPdfDirectory = function () {
//    const pdfItems = document.querySelectorAll('.pdf-item');
//    pdfItems.forEach(item => {
//        const header = item.querySelector('.pdf-header');
//        if (header) {
//            header.addEventListener('click', () => {
//                item.classList.toggle('expanded');
//                const icon = header.querySelector('.pdf-toggle');
//                if (icon) {
//                    if (item.classList.contains('expanded')) {
//                        icon.classList.remove('fa-chevron-right');
//                        icon.classList.add('fa-chevron-down');
//                    } else {
//                        icon.classList.remove('fa-chevron-down');
//                        icon.classList.add('fa-chevron-right');
//                    }
//                }
//            });
//        }
//    });
//}

// 手风琴目录初始化
ModuleLoader.prototype.initAccordionDirectory = function () {
    console.log('初始化手风琴目录');

    // 页面内的JavaScript已经处理了手风琴交互
    // 这里只需要绑定PDF预览按钮
    this.bindPdfPreview();
}

// 初始化手风琴交互
ModuleLoader.prototype.initAccordionInteractions = function () {
    console.log('初始化手风琴交互');

    // 初始化所有级别的手风琴
    const allHeaders = document.querySelectorAll('.accordion-header');

    allHeaders.forEach(header => {
        // 移除可能存在的旧监听器
        const newHeader = header.cloneNode(true);
        header.parentNode.replaceChild(newHeader, header);

        newHeader.addEventListener('click', (e) => {
            const item = newHeader.closest('.accordion-item');
            const isActive = item.classList.contains('active');

            // 如果是学段级别，只关闭其他学段
            if (newHeader.classList.contains('grade-header')) {
                document.querySelectorAll('.grade-item.active').forEach(activeItem => {
                    if (activeItem !== item) {
                        activeItem.classList.remove('active');
                        activeItem.querySelector('.grade-header').classList.remove('open');
                    }
                });
            }

            // 切换当前项
            if (!isActive) {
                item.classList.add('active');
                newHeader.classList.add('open');
            } else {
                item.classList.remove('active');
                newHeader.classList.remove('open');
            }

            e.stopPropagation(); // 阻止事件冒泡，避免触发父级手风琴
        });
    });
}

// 初始化视频网格
ModuleLoader.prototype.initVideoGrid = function () {
    const videoCards = document.querySelectorAll('.video-card');
    videoCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.video-play-btn')) {
                return;
            }
            const btn = e.target.closest('.video-play-btn');
            const videoId = btn.dataset.videoId;
            const title = btn.dataset.title;
            this.playVideo(videoId, title);
        });
    });
}

// 绑定搜索和筛选功能
ModuleLoader.prototype.bindResourceFilters = function () {
    // 搜索功能
    const searchInput = document.getElementById('resource-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            this.filterResources(term);
        });
    }

    // 筛选按钮
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            this.filterByType(filter);
        });
    });
}

// 绑定返回按钮
ModuleLoader.prototype.bindBackButton = function () {
    const backBtn = document.querySelector('.back-to-learning-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            const event = new CustomEvent('moduleSwitch', {
                detail: { moduleId: 'learning' }
            });
            document.dispatchEvent(event);
        });
    }
}

// 播放视频
ModuleLoader.prototype.playVideo = function (videoId, title) {
    const modalHtml = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5>${title}</h5>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="video-wrapper">
                            <iframe src="assets/videos/${videoId}" 
                                    frameborder="0" 
                                    allowfullscreen></iframe>
                        </div>
                    </div>
                </div>
            </div>
        `;

    const modal = document.createElement('div');
    modal.innerHTML = modalHtml;
    document.body.appendChild(modal);

    // 绑定关闭事件
    modal.querySelector('.modal-close').addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
        if (e.target === modal.querySelector('.modal-overlay')) {
            document.body.removeChild(modal);
        }
    });
}

// 过滤资源
ModuleLoader.prototype.filterResources = function (term) {
    // 过滤PDF
    document.querySelectorAll('.pdf-item').forEach(item => {
        const title = item.querySelector('.pdf-title').textContent.toLowerCase();
        const visible = title.includes(term);
        item.style.display = visible ? '' : 'none';
    });

    // 过滤视频
    document.querySelectorAll('.video-card').forEach(card => {
        const title = card.querySelector('.video-title').textContent.toLowerCase();
        const visible = title.includes(term);
        card.style.display = visible ? '' : 'none';
    });
}

// 按类型筛选
ModuleLoader.prototype.filterByType = function (type) {
    console.log(`按类型筛选: ${type}`);
    // 这里可以添加具体的筛选逻辑
}

// 显示错误
ModuleLoader.prototype.showError = function (message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger';
    alert.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        `;
    alert.style.position = 'fixed';
    alert.style.top = '20px';
    alert.style.right = '20px';
    alert.style.zIndex = '1000';

    document.body.appendChild(alert);
    setTimeout(() => document.body.removeChild(alert), 3000);
}

// 更新导航状态
ModuleLoader.prototype.updateNavigation = function (moduleId) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === moduleId) {
            item.classList.add('active');
        }
    });
}

// 手风琴加载
ModuleLoader.prototype.bindPdfPreview = function () {
    document.addEventListener('click', (e) => {
        // 处理章节的预览按钮
        if (e.target.closest('.preview-btn')) {
            e.preventDefault();
            e.stopPropagation(); // 防止触发手风琴点击

            const btn = e.target.closest('.preview-btn');
            const pdfFile = btn.dataset.pdf;
            const title = btn.dataset.title;
            this.showPdfPreview(pdfFile, title);
        }

        // 处理原有的预览按钮（如果还有的话）
        if (e.target.closest('.preview-pdf')) {
            e.preventDefault();
            const btn = e.target.closest('.preview-pdf');
            const pdfFile = btn.dataset.pdf;
            const title = btn.dataset.title;
            this.showPdfPreview(pdfFile, title);
        }
    });
}

// 添加 showPdfPreview 方法
ModuleLoader.prototype.showPdfPreview = function (pdfFile, title) {
    const fullPdfPath = pdfFile.startsWith('http') ? pdfFile : `/${pdfFile}`;
    const modalHtml = `
        <div class="modal-overlay" id="pdf-preview-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h5>${title}</h5>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="pdf-preview-container">
                        <div class="pdf-loading">
                            <div class="loading"></div>
                            <p>正在加载PDF...</p>
                        </div>
                        <iframe src="https://docs.google.com/viewer?url=${encodeURIComponent(window.location.origin + 'assets/教材/pdfs/' + pdfFile)}&embedded=true" 
                                style="width:100%; height:500px;" 
                                frameborder="0"></iframe>
                    </div>
                    <div class="pdf-actions mt-3">
                        <a href="pdfs/${pdfFile}" download="${title}.pdf" class="btn btn-primary">
                            <i class="fas fa-download"></i> 下载PDF
                        </a>
                        <button class="btn btn-outline-secondary close-pdf-btn">关闭预览</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const modal = document.createElement('div');
    modal.innerHTML = modalHtml;
    document.body.appendChild(modal);

    // 显示模态框
    setTimeout(() => {
        modal.querySelector('.modal-overlay').classList.add('show');
    }, 10);

    // 绑定关闭事件
    const closeModal = () => {
        modal.querySelector('.modal-overlay').classList.remove('show');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    };

    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.close-pdf-btn').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
        if (e.target === modal.querySelector('.modal-overlay')) {
            closeModal();
        }
    });
}

// 修改 filterResources 方法，支持新的目录结构
ModuleLoader.prototype.filterResources = function (term) {
    // 过滤章节
    const chapterItems = document.querySelectorAll('.chapter-item');
    let foundAny = false;

    chapterItems.forEach(item => {
        const title = item.querySelector('.chapter-header').textContent.toLowerCase();
        const desc = item.querySelector('.chapter-desc')?.textContent.toLowerCase() || '';

        if (title.includes(term) || desc.includes(term)) {
            item.style.display = '';
            foundAny = true;

            // 展开包含匹配项的父目录
            const unitItem = item.closest('.unit-item');
            const gradeItem = item.closest('.grade-item');

            if (unitItem) {
                unitItem.classList.add('active');
                unitItem.querySelector('.unit-header').classList.add('open');
            }

            if (gradeItem) {
                gradeItem.classList.add('active');
                gradeItem.querySelector('.grade-header').classList.add('open');
            }
        } else {
            item.style.display = 'none';
        }
    });

    // 如果没有搜索结果，显示提示
    if (!foundAny && term) {
        this.showNoResults(term);
    }
}

// 添加显示无结果的方法
ModuleLoader.prototype.showNoResults = function (searchTerm) {
    // 可以在这里添加无结果提示
    console.log(`没有找到包含"${searchTerm}"的资源`);
}

// 手风琴初始化
function initNestedAccordion() {
    // 单元级别手风琴
    document.addEventListener('click', function (e) {
        // 单元展开/收起
        if (e.target.closest('.unit-header')) {
            const unitHeader = e.target.closest('.unit-header');
            const unitItem = unitHeader.closest('.unit-item');

            // 阻止事件冒泡到章节点击
            e.stopPropagation();

            // 切换当前单元
            unitItem.classList.toggle('active');

            // 可选项：关闭其他单元
            // document.querySelectorAll('.unit-item.active').forEach(item => {
            //     if (item !== unitItem) item.classList.remove('active');
            // });
        }

        // 章节展开/收起
        if (e.target.closest('.chapter-header')) {
            const chapterHeader = e.target.closest('.chapter-header');
            const chapterItem = chapterHeader.closest('.chapter-item');

            // 检查点击的是否是操作按钮区域
            if (e.target.closest('.chapter-actions')) {
                return;
            }

            e.stopPropagation();
            chapterItem.classList.toggle('active');

            // 可选项：关闭同一单元内的其他章节
            const parentUnit = chapterItem.closest('.unit-item');
            const otherChapters = parentUnit.querySelectorAll('.chapter-item.active');
            otherChapters.forEach(item => {
                if (item !== chapterItem) item.classList.remove('active');
            });
        }

        // 预览按钮点击
        if (e.target.closest('.preview-btn')) {
            e.preventDefault();
            e.stopPropagation();

            const btn = e.target.closest('.preview-btn');
            const pdfFile = btn.dataset.pdf;
            const title = btn.dataset.title;

            openPDFPreview(pdfFile, title);
        }
    });

    // 键盘导航支持
    document.querySelectorAll('.unit-header, .chapter-header').forEach(header => {
        header.setAttribute('tabindex', '0');
        header.setAttribute('role', 'button');

        header.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const item = this.closest('.accordion-item');
                item.classList.toggle('active');
            }

            // 箭头键导航
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                const items = Array.from(this.closest('.accordion').querySelectorAll('.accordion-item'));
                const currentIndex = items.indexOf(this.closest('.accordion-item'));
                let nextIndex;

                if (e.key === 'ArrowDown') {
                    nextIndex = (currentIndex + 1) % items.length;
                } else {
                    nextIndex = (currentIndex - 1 + items.length) % items.length;
                }

                items[nextIndex].querySelector('.accordion-header').focus();
            }
        });
    });
}

// 初始化
document.addEventListener('DOMContentLoaded', function () {
    initNestedAccordion();
});