// 主程序入口
class NoteeApp {
    constructor() {
        this.init();
    }

    // 初始化应用
    async init() {
        try {
            // 等待所有模块加载完成
            await this.waitForModules();
            
            // 绑定顶部菜单事件
            this.bindHeaderEvents();
            
            // 初始化完成
            console.log('Notee 应用初始化完成');
            
        } catch (error) {
            console.error('应用初始化失败:', error);
        }
    }

    // 等待所有模块加载完成
    waitForModules() {
        return new Promise((resolve) => {
            const checkModules = () => {
                if (window.dataManager && window.categoriesManager && window.notesManager) {
                    resolve();
                } else {
                    setTimeout(checkModules, 100);
                }
            };
            checkModules();
        });
    }

    // 绑定顶部菜单事件
    bindHeaderEvents() {
        const addNoteBtn = document.getElementById('addNoteBtn');
        const searchBtn = document.getElementById('searchBtn');
        const settingsBtn = document.getElementById('settingsBtn');

        if (addNoteBtn) {
            addNoteBtn.addEventListener('click', () => {
                this.handleAddNote();
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.handleSearch();
            });
        }

        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.handleSettings();
            });
        }
    }

    // 处理新建笔记
    handleAddNote() {
        window.utils.showMessage('新建笔记功能开发中...', 'info');
        console.log('新建笔记');
    }

    // 处理搜索
    handleSearch() {
        window.utils.showMessage('搜索功能开发中...', 'info');
        console.log('搜索');
    }

    // 处理设置
    handleSettings() {
        window.utils.showMessage('设置功能开发中...', 'info');
        console.log('设置');
    }

    // 刷新应用
    refresh() {
        if (window.categoriesManager) {
            window.categoriesManager.refreshCounts();
        }
        if (window.notesManager) {
            window.notesManager.refresh();
        }
    }

    // 获取应用状态
    getStatus() {
        return {
            notesCount: window.dataManager ? window.dataManager.notes.length : 0,
            categoriesCount: window.dataManager ? window.dataManager.categories.length : 0,
            currentCategory: window.categoriesManager ? window.categoriesManager.getCurrentCategory() : '全部',
            selectedNote: window.notesManager ? window.notesManager.getSelectedNote() : null
        };
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.noteeApp = new NoteeApp();
});

// 添加一些全局样式到代码高亮
const style = document.createElement('style');
style.textContent = `
    .keyword {
        color: #d73a49;
        font-weight: bold;
    }
    
    .string {
        color: #032f62;
    }
    
    .comment {
        color: #6a737d;
        font-style: italic;
    }
    
    .category-count {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 10px;
        padding: 0.1rem 0.4rem;
        font-size: 0.8rem;
        margin-left: auto;
    }
    
    .category-item.active .category-count {
        background: rgba(255, 255, 255, 0.5);
    }
`;
document.head.appendChild(style);