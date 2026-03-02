// 侧边栏展开/折叠功能
document.addEventListener('DOMContentLoaded', function () {
    // 菜单切换按钮
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const main = document.querySelector('.main');
    const footer = document.querySelector('.footer');

    // 切换侧边栏显示/隐藏
    menuToggle.addEventListener('click', function () {
        sidebar.classList.toggle('open');
        sidebar.classList.toggle('collapsed');
        main.classList.toggle('sidebar-collapsed');
        footer.classList.toggle('sidebar-collapsed');
    });

    // 从 JSON 文件中加载数据并动态生成页面
    loadWebsitesData().then(r => {
        allWebsitesData = r;
        generateWebsiteCards(allWebsitesData);
    });
});

// 全局变量：存储所有网站数据
let allWebsitesData = {};

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 实时搜索功能
function performSearch(keyword) {
    keyword = keyword.trim().toLowerCase();

    const toolSections = document.querySelectorAll('.tool-section');

    if (!keyword) {
        // 如果关键词为空，显示所有内容
        toolSections.forEach(section => {
            section.style.display = 'block';
            const cards = section.querySelectorAll('.tool-card');
            cards.forEach(card => {
                card.style.display = 'flex';
            });
        });
        return;
    }

    // 遍历所有分类和卡片
    toolSections.forEach(section => {
        const cards = section.querySelectorAll('.tool-card');
        let hasVisibleCards = false;

        cards.forEach(card => {
            const name = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const description = card.getAttribute('data-description')?.toLowerCase() || '';
            const url = card.getAttribute('data-url')?.toLowerCase() || '';

            // 检查是否匹配
            if (name.includes(keyword) || description.includes(keyword) || url.includes(keyword)) {
                card.style.display = 'flex';
                hasVisibleCards = true;
            } else {
                card.style.display = 'none';
            }
        });

        // 如果分类下没有匹配的卡片，隐藏整个分类
        section.style.display = hasVisibleCards ? 'block' : 'none';
    });
}

// 绑定搜索事件
function bindSearchEvents() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    // 使用防抖，200ms 延迟
    const debouncedSearch = debounce((value) => {
        performSearch(value);
    }, 200);

    searchInput.addEventListener('input', function (e) {
        debouncedSearch(e.target.value);
    });

    // 按 ESC 清空搜索
    searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            this.value = '';
            performSearch('');
        }
    });
}

// 分类图标映射
const categoryIcons = {
    'AI工具': '<path d="M8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 14V8C14 4.68629 11.3137 2 8 2Z" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="6" cy="7" r="1" fill="currentColor"/><circle cx="10" cy="7" r="1" fill="currentColor"/><path d="M5.5 10C6.5 11 9.5 11 10.5 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    '办公工具': '<path d="M3 3H7L8 1H12L13 3H13C14.1046 3 15 3.89543 15 5V13C15 14.1046 14.1046 15 13 15H3C1.89543 15 1 14.1046 1 13V5C1 3.89543 1.89543 3 3 3Z" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="8" cy="9" r="2.5" stroke="currentColor" stroke-width="1.5" fill="none"/>',
    '设计工具': '<path d="M13 1L15 3L5 13L1 15L3 11L13 1Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M10 4L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    '学习资源': '<path d="M8 1L1 5V11L8 15L15 11V5L8 1Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M1 5L8 9L15 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 9V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    '生活服务': '<path d="M8 1L1 8L3.5 10.5V15H12.5V10.5L15 8L8 1Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M6 15V10H10V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
    '娱乐休闲': '<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M5 6C6 5 7 5 8 6C9 7 10 7 11 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M5 10C6 9 7 9 8 10C9 11 10 11 11 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    '收藏夹栏': '<path d="M8 1L9.5 5.5L14 6L11 9L12 14L8 11.5L4 14L5 9L2 6L6.5 5.5L8 1Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    '收藏夹栏/工具网': '<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M2 8H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M8 2V14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    '收藏夹栏/工具网2': '<rect x="2" y="2" width="12" height="12" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M5 5H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M5 8H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M5 11H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    '收藏夹栏/工具网2/工具网2-1': '<rect x="3" y="3" width="10" height="10" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.5" fill="none"/>',
    '收藏夹栏/爬虫': '<circle cx="8" cy="5" r="3" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M3 8L5 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M13 8L11 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M3 11L6 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M13 11L10 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M5 14L7 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M11 14L9 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    '收藏夹栏/前端': '<path d="M3 3L8 8L3 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M8 3L13 8L8 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    '收藏夹栏/前端/Java': '<path d="M6 2V12C6 13.5 7 14 8 14C9 14 10 13.5 10 12V2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M3 8C5 6 7 6 9 8C11 10 13 10 15 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    '其他收藏夹': '<path d="M2 4C2 2.89543 2.89543 2 4 2H12C13.1046 2 14 2.89543 14 4V12C14 13.1046 13.1046 14 12 14H4C2.89543 14 2 13.1046 2 12V4Z" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M5 7L7 9L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
    '其他收藏夹/已搁置标签页': '<path d="M2 6C2 4.89543 2.89543 4 4 4H12C13.1046 4 14 4.89543 14 6V12C14 13.1046 13.1046 14 12 14H4C2.89543 14 2 13.1046 2 12V6Z" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M2 8H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    '其他收藏夹/已搁置标签页/游戏': '<rect x="2" y="5" width="12" height="7" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="5.5" cy="8.5" r="1" fill="currentColor"/><circle cx="10.5" cy="8.5" r="1" fill="currentColor"/>',
    '其他收藏夹/已搁置标签页/组 3': '<rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M8 5V8M8 8V11M8 8H5M8 8H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    '其他收藏夹/VAM': '<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M8 4V8L11 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
    'default': '<path d="M3 3H7L8 1H12L13 3H13C14.1046 3 15 3.89543 15 5V13C15 14.1046 14.1046 15 13 15H3C1.89543 15 1 14.1046 1 13V5C1 3.89543 1.89543 3 3 3Z" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M5 5H11M5 8H11M5 11H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'
};

// 获取分类图标
function getCategoryIcon(categoryName) {
    return categoryIcons[categoryName] || categoryIcons['default'];
}

// 动态生成侧边栏菜单
function generateSidebarMenu(categories) {
    const sidebarMenu = document.querySelector('.sidebar-menu');
    if (!sidebarMenu) return;

    sidebarMenu.innerHTML = '';

    categories.forEach(category => {
        const menuItem = document.createElement('li');
        menuItem.className = 'menu-item';

        menuItem.innerHTML = `
            <a href="#" class="menu-link">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    ${getCategoryIcon(category)}
                </svg>
                <span>${category}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" class="menu-arrow">
                    <path d="M4 3L6 5L8 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </a>
        `;

        sidebarMenu.appendChild(menuItem);
    });

    // 绑定点击事件
    bindSidebarEvents();
}

// 动态生成主内容区域
function generateMainContent(categories) {
    const mainContent = document.querySelector('.main');
    if (!mainContent) return;

    // 保留品牌标识、分类标签、搜索栏和快捷入口
    const brandSection = mainContent.querySelector('.brand-section');
    const categoryTabs = mainContent.querySelector('.category-tabs');
    const searchSection = mainContent.querySelector('.search-section');
    const quickAccess = mainContent.querySelector('.quick-access');

    // 清空现有的工具区块
    const existingSections = mainContent.querySelectorAll('.tool-section');
    existingSections.forEach(section => section.remove());

    // 为每个分类创建工具区块
    categories.forEach(category => {
        const section = document.createElement('div');
        section.className = 'tool-section';
        section.id = category;

        section.innerHTML = `
            <h2>${category}</h2>
            <div class="tool-grid">
                <!-- 工具卡片将由 JavaScript 动态生成 -->
            </div>
        `;

        mainContent.appendChild(section);
    });
}

// 绑定侧边栏点击事件
function bindSidebarEvents() {
    const menuItems = document.querySelectorAll('.menu-item');

    // 统一的平滑滚动定位函数
    function scrollToSection(sectionId) {
        console.log('尝试滚动到分类:', sectionId);
        const toolSection = document.getElementById(sectionId);
        console.log('找到的工具区域:', toolSection);

        if (toolSection) {
            toolSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            return true;
        } else {
            console.error('未找到 ID 为', sectionId, '的元素');
            const allSections = document.querySelectorAll('.tool-section');
            console.log('所有工具区域 ID:', Array.from(allSections).map(s => s.id));
        }
        return false;
    }

    // 处理侧边栏点击
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const menuItem = this.closest('.menu-item');
            if (!menuItem) return;

            if (this.classList.contains('menu-link')) {
                const isActive = menuItem.classList.contains('active');

                menuItems.forEach(otherItem => {
                    if (otherItem !== menuItem) {
                        otherItem.classList.remove('active');
                    }
                });

                menuItem.classList.toggle('active');
            }

            let categoryName;
            if (this.classList.contains('menu-link')) {
                categoryName = this.querySelector('span').textContent.trim();
            } else {
                const parentLink = menuItem.querySelector('.menu-link');
                categoryName = parentLink.querySelector('span').textContent.trim();
            }

            if (categoryName) {
                scrollToSection(categoryName);
            }
        });
    });

    // 分类标签切换（顶部 Tab）
    const categoryTabs = document.querySelectorAll('.category-tabs a');

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function (e) {
            e.preventDefault();

            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            const targetId = this.getAttribute('data-target') || this.textContent.trim();
            scrollToSection(targetId);

            menuItems.forEach(item => {
                const span = item.querySelector('.menu-link span');
                if (span && span.textContent.trim() === targetId) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        });
    });
}

// 从 JSON 文件中加载数据并生成工具卡片
async function loadWebsitesData() {
    try {
        console.log('开始加载数据...');
        const response = await fetch('frontend/data/websites.json');
        console.log('Fetch 响应:', response);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('加载数据成功:', data);

        const categories = Object.keys(data);

        // 动态生成侧边栏菜单
        generateSidebarMenu(categories);

        // 动态生成主内容区域
        generateMainContent(categories);

        // 为每个分类生成工具卡片
        categories.forEach(category => {
            console.log('处理分类:', category);
            const toolSection = document.getElementById(category);
            console.log('找到工具区域:', toolSection);

            if (toolSection) {
                const toolGrid = toolSection.querySelector('.tool-grid');
                console.log('找到工具网格:', toolGrid);

                if (toolGrid) {
                    toolGrid.innerHTML = '';

                    data[category].forEach(website => {
                        console.log('创建卡片:', website.name);
                        const card = createToolCard(website);
                        toolGrid.appendChild(card);
                    });
                } else {
                    console.error('未找到工具网格容器');
                }
            } else {
                console.error('未找到工具区域:', category);
            }
        });

        // 为工具卡片添加点击事件
        addToolCardClickEvents();

        // 绑定搜索标签切换
        bindSearchTabs();

        // 绑定快捷入口点击
        bindQuickAccess();

        // 绑定搜索事件
        bindSearchEvents();

        console.log('数据加载完成');
    } catch (error) {
        console.error('加载数据失败:', error);
        console.error('错误堆栈:', error.stack);
    }
}

// 绑定搜索标签切换
function bindSearchTabs() {
    const searchTabs = document.querySelectorAll('.search-tabs a');

    searchTabs.forEach(tab => {
        tab.addEventListener('click', function (e) {
            e.preventDefault();

            searchTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// 绑定快捷入口点击
function bindQuickAccess() {
    const quickItems = document.querySelectorAll('.quick-item');

    quickItems.forEach(item => {
        item.addEventListener('click', function () {
            console.log('Quick item clicked:', this.querySelector('h3')?.textContent);
        });
    });
}

// 创建网站图标元素
function createFaviconElement(websiteUrl, fallbackNodeFactory) {
    let u;
    try {
        u = new URL(websiteUrl);
    } catch (_) {
        return fallbackNodeFactory();
    }
    const host = u.hostname;
    const img = document.createElement('img');
    img.src = `https://icons.duckduckgo.com/ip3/${host}.ico`;
    img.width = 24;
    img.height = 24;
    img.alt = '';
    img.referrerPolicy = 'no-referrer';
    img.onerror = function () {
        if (img.dataset.fallback !== 'origin') {
            img.src = `${u.origin}/favicon.ico`;
            img.dataset.fallback = 'origin';
        } else {
            const parent = img.parentNode;
            if (parent) {
                parent.innerHTML = '';
                parent.appendChild(fallbackNodeFactory());
            }
        }
    };
    return img;
}

// 创建工具卡片
function createToolCard(website) {
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.setAttribute('data-description', website.description);

    // 创建图标容器
    const iconContainer = document.createElement('div');
    iconContainer.className = 'tool-icon';

    const fallbackIconFactory = () => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '24');
        svg.setAttribute('height', '24');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M12 2L2 7L12 12L22 7L12 2Z');
        path.setAttribute('stroke', 'currentColor');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        svg.appendChild(path);
        return svg;
    };

    // 优先使用本地图标，如果没有则使用动态获取
    if (website.icon) {
        const img = document.createElement('img');
        img.src = website.icon;
        img.width = 24;
        img.height = 24;
        img.alt = '';
        img.onerror = function () {
            this.replaceWith(createFaviconElement(website.url, fallbackIconFactory));
        };
        iconContainer.appendChild(img);
    } else {
        const favicon = createFaviconElement(website.url, fallbackIconFactory);
        iconContainer.appendChild(favicon);
    }

    // 创建内容容器
    const contentContainer = document.createElement('div');
    contentContainer.className = 'tool-content';

    // 创建标题
    const title = document.createElement('h3');
    title.textContent = website.name;
    contentContainer.appendChild(title);

    // 创建描述
    const description = document.createElement('p');
    description.textContent = website.description.length > 20
        ? website.description.substring(0, 20) + '...'
        : website.description;
    contentContainer.appendChild(description);

    // 组装卡片
    card.appendChild(iconContainer);
    card.appendChild(contentContainer);

    // 添加 URL 属性
    card.setAttribute('data-url', website.url);

    return card;
}

// 为工具卡片添加点击事件
function addToolCardClickEvents() {
    const toolCards = document.querySelectorAll('.tool-card');

    toolCards.forEach(card => {
        card.addEventListener('click', function () {
            const url = this.getAttribute('data-url');
            if (url) {
                window.open(url, '_blank');
            }
        });
    });
}
