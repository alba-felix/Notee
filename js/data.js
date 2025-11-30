// 数据管理模块
class DataManager {
    constructor() {
        this.notes = [];
        this.categories = [];
        this.currentCategory = '全部';
    }

    // 加载笔记数据
    async loadNotes() {
        try {
            const response = await fetch('data/notes.json');
            if (!response.ok) {
                throw new Error('Failed to load notes data');
            }
            this.notes = await response.json();
            return this.notes;
        } catch (error) {
            console.error('Error loading notes:', error);
            return [];
        }
    }

    // 加载分类数据
    async loadCategories() {
        try {
            const response = await fetch('data/categories.json');
            if (!response.ok) {
                throw new Error('Failed to load categories data');
            }
            this.categories = await response.json();
            return this.categories;
        } catch (error) {
            console.error('Error loading categories:', error);
            return ['全部', '综合', '快速笔记', '其他', 'JAVA'];
        }
    }

    // 根据当前分类筛选笔记
    getFilteredNotes() {
        if (this.currentCategory === '全部') {
            return this.notes.filter(note => !note.is_archived);
        }
        return this.notes.filter(note => 
            note.category === this.currentCategory && !note.is_archived
        );
    }

    // 设置当前分类
    setCurrentCategory(category) {
        this.currentCategory = category;
    }

    // 获取笔记详情
    getNoteById(noteId) {
        return this.notes.find(note => note.note_id === noteId);
    }

    // 获取所有分类
    getAllCategories() {
        return this.categories;
    }

    // 获取笔记数量统计
    getNotesCountByCategory() {
        const counts = {};
        this.categories.forEach(category => {
            if (category === '全部') {
                counts[category] = this.notes.filter(note => !note.is_archived).length;
            } else {
                counts[category] = this.notes.filter(note => 
                    note.category === category && !note.is_archived
                ).length;
            }
        });
        return counts;
    }
}

// 创建全局数据管理器实例
window.dataManager = new DataManager();