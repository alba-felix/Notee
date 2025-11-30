// 笔记管理模块
class NotesManager {
    constructor() {
        this.notesContainer = document.getElementById('notesGrid');
        this.expandedNotes = new Set(); // 存储已展开的笔记ID
        this.selectedNote = null; // 当前选中的笔记
        this.init();
    }

    // 初始化笔记管理器
    async init() {
        await this.loadNotes();
        this.renderNotes();
        this.bindEvents();
    }

    // 加载笔记数据
    async loadNotes() {
        try {
            await window.dataManager.loadNotes();
        } catch (error) {
            console.error('Error loading notes:', error);
        }
    }

    // 渲染笔记列表
    renderNotes() {
        const notes = window.dataManager.getFilteredNotes();
        
        if (!this.notesContainer) return;
        
        if (notes.length === 0) {
            this.notesContainer.innerHTML = `
                <div class="empty-state">
                    <h3>暂无笔记</h3>
                    <p>当前分类下没有笔记，点击"新建笔记"按钮开始记录</p>
                </div>
            `;
            return;
        }

        this.notesContainer.innerHTML = notes.map(note => this.createNoteCard(note)).join('');
        
        // 更新分类计数
        if (window.categoriesManager) {
            window.categoriesManager.refreshCounts();
        }
    }

    // 创建笔记卡片HTML
    createNoteCard(note) {
        const isExpanded = this.expandedNotes.has(note.note_id);
        const isSelected = this.selectedNote === note.note_id;
        const hasCodeBlocks = note.code_blocks && note.code_blocks.length > 0;
        const hasImages = note.images && note.images.length > 0;
        
        return `
            <div class="note-card ${isSelected ? 'selected' : ''}" data-note-id="${note.note_id}">
                <!-- 卡片头部 -->
                <div class="note-header">
                    <div class="note-title">${this.escapeHtml(note.title)}</div>
                    <div class="note-meta">
                        <span class="note-category">${this.escapeHtml(note.category)}</span>
                        <div class="note-tags">
                            ${note.tags && note.tags.length > 0 ? 
                                note.tags.map(tag => `<span class="note-tag">${this.escapeHtml(tag)}</span>`).join('') : 
                                ''}
                        </div>
                    </div>
                </div>

                <!-- 卡片内容 - 只展示content字段 -->
                <div class="note-content ${isExpanded ? 'expanded' : ''}">
                    <div class="note-text">${this.escapeHtml(note.content)}</div>
                </div>

                <!-- 卡片底部 -->
                <div class="note-footer">
                    <div class="note-actions">
                        <button class="action-btn" data-action="edit" data-note-id="${note.note_id}">
                            编辑
                        </button>
                        <button class="action-btn ${hasCodeBlocks ? '' : 'hidden'}" data-action="code" data-note-id="${note.note_id}">
                            代码
                        </button>
                        <button class="action-btn ${hasImages ? '' : 'hidden'}" data-action="image" data-note-id="${note.note_id}">
                            图片
                        </button>
                        <button class="action-btn" data-action="delete" data-note-id="${note.note_id}">
                            删除
                        </button>
                    </div>
                    <button class="toggle-btn" data-action="toggle" data-note-id="${note.note_id}">
                        ${isExpanded ? '折叠' : '展开'}
                    </button>
                </div>
            </div>
        `;
    }

    // 绑定事件
    bindEvents() {
        if (!this.notesContainer) return;
        
        // 卡片点击事件
        this.notesContainer.addEventListener('click', (e) => {
            const target = e.target;
            const noteCard = target.closest('.note-card');
            
            if (!noteCard) return;
            
            const noteId = noteCard.dataset.noteId;
            
            // 处理按钮点击
            if (target.classList.contains('action-btn') || target.classList.contains('toggle-btn')) {
                e.stopPropagation();
                this.handleButtonClick(target, noteId);
                return;
            }
            
            // 卡片选中
            this.selectNote(noteId);
        });

        // 卡片悬停效果
        this.notesContainer.addEventListener('mouseenter', (e) => {
            const noteCard = e.target.closest('.note-card');
            if (noteCard) {
                noteCard.style.transform = 'translateY(-2px)';
            }
        }, true);

        this.notesContainer.addEventListener('mouseleave', (e) => {
            const noteCard = e.target.closest('.note-card');
            if (noteCard && noteCard.dataset.noteId !== this.selectedNote) {
                noteCard.style.transform = '';
            }
        }, true);
    }

    // 处理按钮点击
    handleButtonClick(button, noteId) {
        const action = button.dataset.action;
        
        switch (action) {
            case 'toggle':
                this.toggleNoteExpansion(noteId);
                break;
            case 'edit':
                this.editNote(noteId);
                break;
            case 'code':
                this.showCodeModal(noteId);
                break;
            case 'image':
                this.showImageModal(noteId);
                break;
            case 'delete':
                this.deleteNote(noteId);
                break;
        }
    }

    // 切换笔记展开/折叠
    toggleNoteExpansion(noteId) {
        if (this.expandedNotes.has(noteId)) {
            this.expandedNotes.delete(noteId);
        } else {
            this.expandedNotes.add(noteId);
        }
        this.renderNotes();
    }

    // 选择笔记
    selectNote(noteId) {
        // 清除之前的选择
        if (this.selectedNote) {
            const prevCard = this.notesContainer.querySelector(`[data-note-id="${this.selectedNote}"]`);
            if (prevCard) {
                prevCard.classList.remove('selected');
            }
        }
        
        // 设置新的选择
        this.selectedNote = noteId;
        const currentCard = this.notesContainer.querySelector(`[data-note-id="${noteId}"]`);
        if (currentCard) {
            currentCard.classList.add('selected');
        }
    }

    // 编辑笔记
    editNote(noteId) {
        window.utils.showMessage('编辑功能开发中...', 'info');
        console.log('编辑笔记:', noteId);
    }

    // 删除笔记
    deleteNote(noteId) {
        if (confirm('确定要删除这个笔记吗？此操作不可恢复。')) {
            window.utils.showMessage('删除功能开发中...', 'info');
            console.log('删除笔记:', noteId);
        }
    }

    // 转义HTML
    escapeHtml(unsafe) {
        return window.utils.escapeHtml(unsafe);
    }

    // 刷新笔记显示
    refresh() {
        this.renderNotes();
    }

    // 获取当前选中的笔记
    getSelectedNote() {
        return this.selectedNote ? window.dataManager.getNoteById(this.selectedNote) : null;
    }

    // 显示代码模态窗口
    showCodeModal(noteId) {
        const note = window.dataManager.getNoteById(noteId);
        if (!note || !note.code_blocks || note.code_blocks.length === 0) {
            window.utils.showMessage('该笔记没有代码内容', 'info');
            return;
        }

        // 获取模态窗口元素
        const modalOverlay = document.getElementById('codeModalOverlay');
        const modalTitle = document.getElementById('codeModalTitle');
        const modalContent = document.getElementById('codeModalContent');
        const modalClose = document.getElementById('codeModalClose');

        // 设置模态窗口标题
        modalTitle.textContent = `代码预览 - ${this.escapeHtml(note.title)}`;

        // 生成代码块内容
        modalContent.innerHTML = this.generateCodeBlocksHTML(note.code_blocks);

        // 显示模态窗口
        modalOverlay.classList.add('active');

        // 绑定关闭事件
        const closeModal = () => {
            modalOverlay.classList.remove('active');
        };

        // 点击关闭按钮
        modalClose.onclick = closeModal;

        // 点击背景关闭
        modalOverlay.onclick = (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        };

        // ESC键关闭
        const handleEscKey = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscKey);
            }
        };
        document.addEventListener('keydown', handleEscKey);
    }

    // 生成代码块HTML
    generateCodeBlocksHTML(codeBlocks) {
        if (!codeBlocks || codeBlocks.length === 0) {
            return `
                <div class="no-code-message">
                    <h4>暂无代码</h4>
                    <p>该笔记没有代码内容</p>
                </div>
            `;
        }

        return `
            <div class="code-blocks-container">
                ${codeBlocks.map((block, index) => this.generateCodeBlockHTML(block, index)).join('')}
            </div>
        `;
    }

    // 生成单个代码块HTML
    generateCodeBlockHTML(block, index) {
        const language = block.language || '其他';
        const languageClass = this.getLanguageClass(language);
        
        return `
            <div class="code-block-item">
                <div class="code-language-header">
                    <span class="language-icon ${languageClass}"></span>
                    <span>${this.escapeHtml(language)}</span>
                </div>
                <div class="code-content">
                    <pre class="code-text">${this.escapeHtml(block.content)}</pre>
                </div>
            </div>
        `;
    }

    // 获取语言对应的CSS类
    getLanguageClass(language) {
        const languageMap = {
            'Java': 'java',
            'Bash': 'bash',
            'Python': 'python',
            'JavaScript': 'javascript',
            'HTML': 'html',
            'CSS': 'css',
            'SQL': 'sql'
        };
        
        return languageMap[language] || 'other';
    }

    // 显示图片模态窗口
    showImageModal(noteId) {
        const note = window.dataManager.getNoteById(noteId);
        if (!note || !note.images || note.images.length === 0) {
            window.utils.showMessage('该笔记没有图片内容', 'info');
            return;
        }

        // 获取模态窗口元素
        const modalOverlay = document.getElementById('imageModalOverlay');
        const modalTitle = document.getElementById('imageModalTitle');
        const imageContainer = document.getElementById('imageContainer');
        const prevBtn = document.getElementById('prevImageBtn');
        const nextBtn = document.getElementById('nextImageBtn');
        const imageInfo = document.getElementById('imageInfo');
        const zoomOutBtn = document.getElementById('zoomOutBtn');
        const zoomInBtn = document.getElementById('zoomInBtn');
        const zoomLevel = document.getElementById('zoomLevel');
        const modalClose = document.getElementById('imageModalClose');

        // 设置模态窗口标题
        modalTitle.textContent = `图片预览 - ${this.escapeHtml(note.title)}`;

        // 初始化图片查看器状态
        let currentImageIndex = 0;
        let currentZoom = 100;
        const images = note.images;

        // 显示第一张图片
        this.displayImage(images, currentImageIndex, imageContainer, imageInfo, prevBtn, nextBtn);

        // 设置缩放级别显示
        zoomLevel.textContent = `${currentZoom}%`;

        // 显示模态窗口
        modalOverlay.classList.add('active');

        // 绑定关闭事件
        const closeModal = () => {
            modalOverlay.classList.remove('active');
            // 清理事件监听器
            prevBtn.onclick = null;
            nextBtn.onclick = null;
            zoomOutBtn.onclick = null;
            zoomInBtn.onclick = null;
            modalClose.onclick = null;
            modalOverlay.onclick = null;
        };

        // 上一张图片
        prevBtn.onclick = () => {
            if (currentImageIndex > 0) {
                currentImageIndex--;
                this.displayImage(images, currentImageIndex, imageContainer, imageInfo, prevBtn, nextBtn);
                currentZoom = 100; // 重置缩放
                zoomLevel.textContent = `${currentZoom}%`;
                this.updateZoom(imageContainer, currentZoom);
            }
        };

        // 下一张图片
        nextBtn.onclick = () => {
            if (currentImageIndex < images.length - 1) {
                currentImageIndex++;
                this.displayImage(images, currentImageIndex, imageContainer, imageInfo, prevBtn, nextBtn);
                currentZoom = 100; // 重置缩放
                zoomLevel.textContent = `${currentZoom}%`;
                this.updateZoom(imageContainer, currentZoom);
            }
        };

        // 缩小
        zoomOutBtn.onclick = () => {
            if (currentZoom > 25) {
                currentZoom -= 25;
                zoomLevel.textContent = `${currentZoom}%`;
                this.updateZoom(imageContainer, currentZoom);
            }
        };

        // 放大
        zoomInBtn.onclick = () => {
            if (currentZoom < 200) {
                currentZoom += 25;
                zoomLevel.textContent = `${currentZoom}%`;
                this.updateZoom(imageContainer, currentZoom);
            }
        };

        // 点击关闭按钮
        modalClose.onclick = closeModal;

        // 点击背景关闭
        modalOverlay.onclick = (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        };

        // ESC键关闭
        const handleEscKey = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscKey);
            }
        };
        document.addEventListener('keydown', handleEscKey);
    }

    // 显示图片
    displayImage(images, index, container, infoElement, prevBtn, nextBtn) {
        if (!images || images.length === 0) {
            container.innerHTML = '<div class="no-images-message">没有图片可显示</div>';
            infoElement.textContent = '0/0';
            prevBtn.disabled = true;
            nextBtn.disabled = true;
            return;
        }

        const imageData = images[index];
        let imageSrc = '';

        // 处理图片数据
        if (typeof imageData === 'string') {
            // 如果是字符串路径
            imageSrc = imageData;
        } else if (typeof imageData === 'object') {
            // 如果是对象，尝试获取filepath或filename
            if (imageData.filepath) {
                // 对于绝对路径，我们需要检查是否是本地文件系统路径
                if (imageData.filepath.includes(':') || imageData.filepath.startsWith('/')) {
                    // 这是绝对路径，在网页环境中无法直接访问
                    // 尝试使用filename构建相对路径
                    if (imageData.filename) {
                        imageSrc = `data/images/${imageData.filename}`;
                    } else {
                        // 从filepath中提取filename
                        const pathParts = imageData.filepath.split(/[/\\]/);
                        const filename = pathParts[pathParts.length - 1];
                        imageSrc = `data/images/${filename}`;
                    }
                } else {
                    // 这是相对路径，直接使用
                    imageSrc = imageData.filepath;
                }
            } else if (imageData.filename) {
                // 构建图片路径，假设图片在data/images目录下
                imageSrc = `data/images/${imageData.filename}`;
            }
        }

        if (!imageSrc) {
            container.innerHTML = '<div class="image-error">图片路径无效</div>';
            return;
        }

        // 创建图片元素
        const img = document.createElement('img');
        img.className = 'image-view';
        img.src = imageSrc;
        img.alt = `图片 ${index + 1}`;
        
        // 处理图片加载错误
        img.onerror = () => {
            container.innerHTML = '<div class="image-error">图片加载失败<br>路径: ' + this.escapeHtml(imageSrc) + '</div>';
        };

        // 显示加载状态
        container.innerHTML = '<div class="image-loading">加载中...</div>';
        
        // 图片加载完成后显示
        img.onload = () => {
            container.innerHTML = '';
            container.appendChild(img);
        };

        // 开始加载图片
        container.innerHTML = '';
        container.appendChild(img);

        // 更新信息
        infoElement.textContent = `${index + 1}/${images.length}`;

        // 更新按钮状态
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === images.length - 1;
    }

    // 更新图片缩放
    updateZoom(container, zoomLevel) {
        const img = container.querySelector('.image-view');
        if (img) {
            img.style.transform = `scale(${zoomLevel / 100})`;
        }
    }
}

// 页面加载完成后初始化笔记管理器
document.addEventListener('DOMContentLoaded', () => {
    window.notesManager = new NotesManager();
});