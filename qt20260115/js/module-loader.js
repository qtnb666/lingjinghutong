// 模块加载器
class ModuleLoader {
    constructor() {
        this.modules = {
            'core': '核心基础模块',
            'competition': '竞赛服务模块',
            'learning': '学习赋能模块',
            'interaction': '互动交流模块',
            'support': '辅助支持模块'
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
    }
    
    switchModule(moduleId) {
        if (this.modules[moduleId]) {
            this.currentModule = moduleId;
            console.log(`切换到模块: ${this.modules[moduleId]}`);
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
            default:
                // 通用模块初始化
                break;
        }
    }
    
    initCompetitionModule() {
        console.log('初始化竞赛服务模块');
        // 这里可以添加竞赛模块特定的初始化代码
    }
    
    initLearningModule() {
        console.log('初始化学习赋能模块');
        // 这里可以添加学习模块特定的初始化代码
    }
    
    initInteractionModule() {
        console.log('初始化互动交流模块');
        // 这里可以添加互动模块特定的初始化代码
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