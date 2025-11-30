// 分类管理模块
class CategoriesManager {
    constructor() {
        this.categoriesContainer = document.getElementById('categories');
        this.currentCategory = '全部';
        this.init();
    }

    // 初始化分类管理器
    async init() {
        await this.loadCategories();
        this.renderCategories();
        this.bindEvents();
    }

    // 加载分类数据
    async loadCategories() {
        try {
            await window.dataManager.loadCategories();
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    // 渲染分类列表
    renderCategories() {
        const categories = window.dataManager.getAllCategories();
        const counts = window.dataManager.getNotesCountByCategory();
        
        if (!this.categoriesContainer) return;
        
        this.categoriesContainer.innerHTML = categories.map(category => {
            const count = counts[category] || 0;
            const isActive = category === this.currentCategory;
            
            return `
                <button class="category-item ${isActive ? 'active' : ''}" 
                        data-category="${category}">
                    <span class="category-name">${category}</span>
                    <span class="category-count">${count}</span>
                </button>
            `;
        }).join('');
    }

    // 绑定事件
    bindEvents() {
        this.categoriesContainer.addEventListener('click', (e) => {
            const categoryItem = e.target.closest('.category-item');
            if (categoryItem) {
                const category = categoryItem.dataset.category;
                this.selectCategory(category);
            }
        });
    }

    // 选择分类
    selectCategory(category) {
        if (this.currentCategory === category) return;
        
        // 更新当前分类
        this.currentCategory = category;
        window.dataManager.setCurrentCategory(category);
        
        // 更新UI
        this.updateActiveCategory();
        
        // 通知笔记管理器重新渲染
        if (window.notesManager) {
            window.notesManager.renderNotes();
        }
    }

    // 更新激活的分类
    updateActiveCategory() {
        const categoryItems = this.categoriesContainer.querySelectorAll('.category-item');
        categoryItems.forEach(item => {
            const category = item.dataset.category;
            if (category === this.currentCategory) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // 刷新分类计数
    refreshCounts() {
        const counts = window.dataManager.getNotesCountByCategory();
        const categoryItems = this.categoriesContainer.querySelectorAll('.category-item');
        
        categoryItems.forEach(item => {
            const category = item.dataset.category;
            const count = counts[category] || 0;
            const countSpan = item.querySelector('.category-count');
            if (countSpan) {
                countSpan.textContent = count;
            }
        });
    }

    // 获取当前分类
    getCurrentCategory() {
        return this.currentCategory;
    }

    // 获取所有分类
    getAllCategories() {
        return window.dataManager.getAllCategories();
    }
}

// 页面加载完成后初始化分类管理器
document.addEventListener('DOMContentLoaded', () => {
    window.categoriesManager = new CategoriesManager();
});