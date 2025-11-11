# Feagine 擎羽 公司官网

![Feagine Logo](img/placeholder.svg)

这是Feagine（擎羽）公司的官方网站项目，展示了公司的柔性机器人产品线和技术特点。网站采用双语设计（中文/英文），响应式布局，适配各种设备。

## 🚀 技术栈

- **前端**: HTML5 + CSS3 + Vanilla JavaScript
- **样式**: 纯CSS3，使用Grid和Flexbox布局
- **字体**: Google Fonts (Inter + Noto Sans SC)
- **轮播**: Swiper.js 11.x (CDN)
- **动画**: AOS (Animate On Scroll) 2.3 (CDN)
- **视频**: Pexels免费视频 + YouTube嵌入
- **构建**: 纯静态文件，无需构建过程

## 📋 功能特点

- 双语支持（中/英文切换）
- 响应式设计（移动端优先）
- 产品轮播展示
- 视频演示区
- 技术规格对比表
- 客户与合作伙伴展示
- 新闻时间轴
- 联系表单
- SEO优化

## 🔧 本地开发

### 前提条件

- 现代网页浏览器
- 文本编辑器
- 可选: 本地服务器（如Python的SimpleHTTPServer）

### 安装步骤

1. 克隆仓库:
   ```bash
   git clone https://github.com/4PTX-A869/FEAGINE.git
   cd FEAGINE
   ```

2. 启动本地服务器:
   ```bash
   # 使用Python (Python 3.x)
   python -m http.server 8000
   
   # 或使用Node.js
   npx serve
   ```

3. 在浏览器中访问:
   ```
   http://localhost:8000
   ```

## 📂 项目结构

```
/
├── index.html          # 主页面
├── css/
│   └── style.css       # 样式文件
├── js/
│   └── main.js         # JavaScript功能
├── img/                # 图片资源
│   └── placeholder.svg # 占位图
├── robots.txt          # 搜索引擎爬虫指引
└── sitemap.xml         # 网站地图
```

## 🚢 部署到GitHub Pages

本项目配置为使用GitHub Pages进行部署。

### 自动部署

1. 将代码推送到GitHub仓库的`main`分支:
   ```bash
   git add .
   git commit -m "更新网站内容"
   git push origin main
   ```

2. GitHub Pages将自动从`main`分支部署网站。

3. 部署完成后，可通过以下地址访问网站:
   ```
   https://4ptx-a869.github.io/FEAGINE/
   ```

### 部署检查清单

- [ ] 确保所有资源路径使用相对路径
- [ ] 验证所有CDN资源能正常加载
- [ ] 检查所有链接是否正常工作
- [ ] 测试响应式设计在不同设备上的表现
- [ ] 验证双语切换功能正常工作
- [ ] 确认联系表单正确配置
- [ ] 检查SEO元标签是否正确设置

## 🤝 贡献指南

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m '添加某功能'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 📄 许可证

[MIT](LICENSE)

## 📞 联系方式

Feagine 擎羽 - [sales@feagine.com](mailto:sales@feagine.com)

项目链接: [https://github.com/4PTX-A869/FEAGINE](https://github.com/4PTX-A869/FEAGINE)