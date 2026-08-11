新建 4 个一级文档分类（中英双语）+ 删除 test.mdx

## slug / 标题命名表
| 分类 | slug | 中文 | 英文 | 起始页 | 页中/英标题 |
|---|---|---|---|---|---|
| 应用教程 | tutorials | 应用教程 | Tutorials | overview | 概述 / Overview |
| 故障排除 | troubleshooting | 故障排除 | Troubleshooting | overview | 概述 / Overview |
| 版本记录 | changelog | 版本记录 | Changelog | overview | 概述 / Overview |
| 技术支持 | support | 技术支持 | Support | overview | 概述 / Overview |

`quick-start/`（快速开始）已存在，不动。

## 文件操作（共 12 步）

### 删除（2 个）
1. `content/docs/zh/test.mdx`
2. `content/docs/en/test.mdx`

### 新建（8 个，每个分类 × 中英两份 = meta.json + overview.mdx）
中文 `content/docs/zh/<slug>/`：
3. `tutorials/meta.json` → `{ "title": "应用教程", "pages": ["overview"] }`
4. `tutorials/overview.mdx` → frontmatter `title: 概述` + 可填充正文
5. `troubleshooting/meta.json` → `{ "title": "故障排除", "pages": ["overview"] }`
6. `troubleshooting/overview.mdx` → `title: 概述`
7. `changelog/meta.json` → `{ "title": "版本记录", "pages": ["overview"] }`
8. `changelog/overview.mdx` → `title: 概述`
9. `support/meta.json` → `{ "title": "技术支持", "pages": ["overview"] }`
10. `support/overview.mdx` → `title: 概述`

英文 `content/docs/en/<slug>/`：镜像，分类标题用 Tutorials/Troubleshooting/Changelog/Support，页面 title: Overview。

### 修改父级 meta.json（2 个，登记分类 + 移除 test）
11. `content/docs/zh/meta.json` → `pages: ["index", "quick-start", "tutorials", "troubleshooting", "changelog", "support"]`
12. `content/docs/en/meta.json` → 同上

## 不改动
- 不动任何 .ts 代码（defineDocs 递归扫描自动处理）
- 不动 quick-start/ 已有文件
- overview.mdx frontmatter 对齐现有风格（title + description，正文给可填充的小节标题）

## 最终侧边栏
帮助中心
├─ 首页(index)
├─ 快速开始 → 如何安装
├─ 应用教程 → 概述
├─ 故障排除 → 概述
├─ 版本记录 → 概述
└─ 技术支持 → 概述

## 验证
重启 dev server 后访问 /zh/docs/{tutorials,troubleshooting,changelog,support}/overview 确认路由生效，检查侧边栏结构。