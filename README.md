# 聚合网站 - Notee

一个简洁优雅的网址导航聚合平台，汇集各类优质网站资源，帮助你快速发现和使用最佳工具。

![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Deployed-brightgreen)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## 功能特性

- **分类导航** - 按类别整理网站资源，快速定位所需工具
- **智能搜索** - 支持站内搜索，同时可切换 Bing/百度/Google/Perplexity
- **响应式设计** - 完美适配桌面端和移动端
- **侧边栏导航** - 便捷的分类侧边栏，支持移动端收起
- **快捷入口** - 每日快讯、免费社群、最新项目、热门教程一键直达

## 网站分类

| 分类 | 描述 |
|------|------|
| AI工具 | ChatGPT、Midjourney 等 AI 相关工具 |
| 办公工具 | 文档协作、项目管理等效率工具 |
| 设计工具 | UI/UX 设计、图像处理工具 |
| 学习资源 | 编程教程、在线课程平台 |
| 生活服务 | 实用生活类网站 |
| 娱乐休闲 | 游戏、音乐、影视娱乐 |

## 技术栈

- **前端**: HTML5 + CSS3 + JavaScript (原生)
- **部署**: GitHub Pages
- **构建**: 静态部署，无需后端

## 快速开始

### 本地运行

```bash
# 克隆仓库
git clone https://github.com/alba-felix/Notee.git

# 进入目录
cd Notee

# 使用任意静态服务器运行，例如 Python
python -m http.server 8080

# 或使用 Node.js
npx serve
```

然后在浏览器打开 `http://localhost:8080`

### 部署到 GitHub Pages

1. Fork 本仓库
2. 进入 Settings → Pages
3. Source 选择 Deploy from a branch
4. 选择 `website` 分支，保存
5. 等待部署完成，访问 `https://<username>.github.io/Notee`

## 项目结构

```
Notee/
├── index.html          # 主页面
├── favicon.svg         # 网站图标
├── css/                # 样式文件
├── js/                 # JavaScript 文件
├── data/               # 数据文件 (JSON)
├── frontend/           # 前端资源
│   ├── css/
│   ├── js/
│   ├── data/
│   └── assets/
└── .github/
    └── workflows/      # GitHub Actions 工作流
```

## 贡献

欢迎提交 Issue 和 Pull Request 来完善网站资源！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 许可证

MIT License © 2026

---

如果这个项目对你有帮助，欢迎 ⭐ Star 支持！
