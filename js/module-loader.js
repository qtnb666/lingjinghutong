// 模块加载器
class ModuleLoader {
    constructor() {
        this.modules = {
            'core': '核心基础模块',
            'competition': '竞赛服务模块',
            'learning': '学习赋能模块',
            'interaction': '互动交流模块',
            'support': '辅助支持模块',
            'learning-resources': '学习资源页面' 
        };
        
        this.currentModule = 'core';
        this.init();
    }
    
    init() {
        // 监听模块切换事件
        document.addEventListener('moduleSwitch', (event) => {
            this.switchModule(event.detail.moduleId);
        });
        
        // 监听模块加载完成事件
        document.addEventListener('moduleLoaded', (event) => {
            this.onModuleLoaded(event.detail.moduleId);
        });

        // 监听资源页面请求事件
        document.addEventListener('resources:open', (event) => {
            this.openResourcesPage(event.detail.category);
        });
    }
    
    switchModule(moduleId) {
        if (this.modules[moduleId]) {
            this.currentModule = moduleId;
            console.log(`切换到模块: ${this.modules[moduleId]}`);
            // 如果是资源页面，特殊处理
            if (moduleId === 'learning-resources') {
                this.loadResourcesPage();
            }
        } else {
            console.warn(`未知模块: ${moduleId}`);
        }
    }
    
    onModuleLoaded(moduleId) {
        // 模块特定的初始化代码
        switch(moduleId) {
            case 'competition':
                this.initCompetitionModule();
                break;
            case 'learning':
                this.initLearningModule();
                break;
            case 'interaction':
                this.initInteractionModule();
                break;
            case 'learning-resources':
                this.initResourcesModule();
                break;
            case 'support':
                this.initSupportPage();
                break;
            default:
                // 通用模块初始化
                break;
        }
    }
    
    initCompetitionModule() {
        console.log('初始化竞赛服务模块');
        // 竞赛模块特定的初始化代码
    }
    
    initLearningModule() {
        console.log('初始化学习赋能模块');
        // 学习模块特定的初始化代码

        // 绑定基础资源查看按钮
        this.bindResourceViewButtons();
    }
    
    initInteractionModule() {
        console.log('初始化互动交流模块');
        // 互动模块特定的初始化代码
    }


    initSupportModule() {
        console.log('初始化辅助信息模块');
        // 辅助信息特定的初始化代码
    }




    // 获取当前模块信息
    getCurrentModule() {
        return {
            id: this.currentModule,
            name: this.modules[this.currentModule]
        };
    }
}

// 创建模块加载器实例
const moduleLoader = new ModuleLoader();

//默认导出
export default ModuleLoader;