// 工具函数模块
class Utils {
    // 防抖函数
    static debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    // 节流函数
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // 格式化日期
    static formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        
        // 如果是今天
        if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString('zh-CN', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        }
        
        // 如果是昨天
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        if (date.toDateString() === yesterday.toDateString()) {
            return '昨天 ' + date.toLocaleTimeString('zh-CN', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        }
        
        // 如果是本周内
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        if (date > weekAgo) {
            const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
            return days[date.getDay()] + ' ' + date.toLocaleTimeString('zh-CN', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        }
        
        // 其他情况显示完整日期
        return date.toLocaleDateString('zh-CN') + ' ' + 
               date.toLocaleTimeString('zh-CN', { 
                   hour: '2-digit', 
                   minute: '2-digit' 
               });
    }

    // 转义HTML特殊字符
    static escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // 高亮代码
    static highlightCode(code, language) {
        // 简单的代码高亮实现
        const keywords = {
            'java': ['public', 'class', 'void', 'static', 'return', 'if', 'else', 'for', 'while', 'new', 'this', 'super'],
            'javascript': ['function', 'var', 'let', 'const', 'return', 'if', 'else', 'for', 'while', 'class', 'this'],
            'python': ['def', 'class', 'return', 'if', 'else', 'for', 'while', 'import', 'from', 'as']
        };

        let highlighted = Utils.escapeHtml(code);
        
        if (keywords[language.toLowerCase()]) {
            keywords[language.toLowerCase()].forEach(keyword => {
                const regex = new RegExp(`\\b${keyword}\\b`, 'g');
                highlighted = highlighted.replace(regex, `<span class="keyword">${keyword}</span>`);
            });
        }

        // 高亮字符串
        highlighted = highlighted.replace(/('.*?'|".*?")/g, '<span class="string">$1</span>');
        
        // 高亮注释
        if (language.toLowerCase() === 'java' || language.toLowerCase() === 'javascript') {
            highlighted = highlighted.replace(/\/\/.*$/gm, '<span class="comment">$&</span>');
            highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, '<span class="comment">$&</span>');
        } else if (language.toLowerCase() === 'python') {
            highlighted = highlighted.replace(/#.*$/gm, '<span class="comment">$&</span>');
        }

        return highlighted;
    }

    // 生成随机ID
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // 检测图片路径是否为本地路径
    static isLocalImagePath(path) {
        return path && (path.startsWith('C:') || path.startsWith('file://'));
    }

    // 获取图片显示URL
    static getImageUrl(imageData) {
        if (!imageData || !imageData.filepath) return '';
        
        // 如果是本地路径，尝试转换为相对路径或使用base64（这里需要根据实际需求调整）
        if (Utils.isLocalImagePath(imageData.filepath)) {
            // 这里可以添加处理本地图片的逻辑
            // 例如：返回一个占位符或尝试读取本地文件
            return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0zMCAzMEg3MFY3MEgzMFYzMFoiIGZpbGw9IiNEOEQ4RDgiLz4KPHN2Zz4K';
        }
        
        return imageData.filepath;
    }

    // 复制文本到剪贴板
    static copyToClipboard(text) {
        return new Promise((resolve, reject) => {
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text).then(resolve).catch(reject);
            } else {
                // 降级方案
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    document.execCommand('copy');
                    resolve();
                } catch (err) {
                    reject(err);
                }
                document.body.removeChild(textArea);
            }
        });
    }

    // 显示消息提示
    static showMessage(message, type = 'info') {
        // 创建消息元素
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.textContent = message;
        
        // 添加样式
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 4px;
            color: white;
            z-index: 1000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        // 设置背景色
        const colors = {
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FF9800',
            error: '#F44336'
        };
        messageEl.style.backgroundColor = colors[type] || colors.info;
        
        document.body.appendChild(messageEl);
        
        // 显示动画
        setTimeout(() => {
            messageEl.style.opacity = '1';
            messageEl.style.transform = 'translateX(0)';
        }, 100);
        
        // 3秒后自动消失
        setTimeout(() => {
            messageEl.style.opacity = '0';
            messageEl.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 3000);
    }
}

// 创建全局工具实例
window.utils = Utils;