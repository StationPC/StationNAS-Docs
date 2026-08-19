# StationOS Pro 帮助中心

这是一个基于 **Next.js 16、React 19、Fumadocs 和 Tailwind CSS 4** 构建的中英双语文档站点，用于维护 StationOS Pro 的使用指南、教程、故障排查、更新日志和支持信息。

项目使用 Next.js App Router 提供页面与接口，使用 Fumadocs 管理 MDX 文档、导航、全文搜索和文档界面，并根据目录自动生成中英文路由。

## 技术栈

- [Next.js](https://nextjs.org/)：应用框架、路由和服务端渲染
- [React](https://react.dev/)：用户界面
- [Fumadocs](https://fumadocs.dev/)：文档内容加载、导航、搜索和 UI
- [MDX](https://mdxjs.com/)：在 Markdown 中使用 React 组件
- [Tailwind CSS](https://tailwindcss.com/)：样式系统
- [TypeScript](https://www.typescriptlang.org/)：类型检查

## 环境要求

- Node.js 20 或更高版本
- npm（项目已提交 `package-lock.json`，建议统一使用 npm）

## 快速开始

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

浏览器访问：

- 英文文档：<http://localhost:3000/docs>
- 中文文档：<http://localhost:3000/zh/docs>

修改页面或 MDX 文档后，开发服务器会自动刷新。

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm install` | 安装依赖，并生成 Fumadocs 内容元数据 |
| `npm run dev` | 启动本地开发服务器 |
| `npm run types:check` | 重新生成 MDX/路由类型并执行 TypeScript 检查 |
| `npm run build` | 创建生产构建，同时检查路由和页面渲染 |
| `npm start` | 启动已经完成构建的生产服务器 |

提交代码前建议执行：

```bash
npm run types:check
npm run build
```

## 项目结构

```text
.
├── content/docs/
│   ├── en/                 # 英文文档
│   └── zh/                 # 中文文档
├── docs/                   # 面向文档编写与项目维护人员的内部指南
├── src/
│   ├── app/                # Next.js App Router 页面与接口
│   │   ├── [lang]/         # 多语言页面
│   │   ├── api/search/     # 文档搜索接口
│   │   ├── llms.txt/       # LLM 文档索引
│   │   └── llms-full.txt/  # 完整文档文本
│   ├── components/         # 通用组件和 MDX 组件配置
│   ├── lib/                # 内容源、国际化和布局配置
│   └── proxy.ts            # 语言协商和 Markdown 内容重写
├── source.config.ts        # Fumadocs/MDX 内容配置
├── next.config.mjs         # Next.js 配置
└── package.json            # 依赖和脚本
```

`.next/` 和 `.source/` 是自动生成目录，请勿手动修改。

`content/docs/` 存放会发布到帮助中心的用户文档；根目录的 `docs/` 存放编写规范和维护指南，不会被 Fumadocs 加载为站点内容。

## 编写人员指南

- [Fumadocs 常用内置组件编写指南](docs/fumadocs-components.md)：介绍提示框、卡片、代码块、选项卡、步骤、折叠面板、文件树、类型表格和可缩放图片等组件。
- [多语言文档维护工作流](docs/localization-workflow.md)：介绍中文单一内容源、GitLocalize 翻译、审核和 GitHub PR 发布流程。

## 编写文档

文档保存在 `content/docs` 中，并按语言分别组织：

```text
content/docs/en/            # 英文
content/docs/zh/            # 中文
```

两种语言的目录结构应尽量保持一致。例如：

```text
content/docs/
├── en/quick-start/install.mdx
└── zh/quick-start/install.mdx
```

### 新增页面

以新增中文常见问题页面为例：

1. 创建 `content/docs/zh/faq.mdx`。
2. 编写页面元数据和正文：

````mdx
---
title: 常见问题
description: StationOS Pro 常见问题与解决方法
---

## 如何检查系统版本？

打开终端并执行：

```bash
station --version
```
````

3. 将页面加入同目录的 `content/docs/zh/meta.json`：

```json
{
  "title": "帮助中心",
  "pages": ["index", "quick-start", "faq"]
}
```

4. 英文翻译由 GitLocalize 在源文件变化后自动生成 PR，无需手动创建英文页面；只需保持英文目录的 `meta.json` 与中文目录的页面顺序一致。

页面文件建议使用小写 kebab-case 命名，例如 `network-settings.mdx`。

### 新增文档分组

创建目录、分组元数据和文档页面：

```text
content/docs/zh/network/
├── meta.json
├── overview.mdx
└── wifi.mdx
```

`meta.json` 用于设置分组名称和页面顺序：

```json
{
  "title": "网络设置",
  "pages": ["overview", "wifi"]
}
```

然后在上级 `content/docs/zh/meta.json` 的 `pages` 中加入 `"network"`。

### 使用 MDX 组件

Fumadocs 的默认 MDX 组件已经在 `src/components/mdx.tsx` 中注册。`Callout`、`Cards`、`Card` 和增强代码块等组件可以直接在文档中使用，例如：

```mdx
<Cards>
  <Card title="快速开始" href="/zh/docs/quick-start/install" />
  <Card title="故障排查" href="/zh/docs/troubleshooting" />
</Cards>
```

`Tabs`、`Steps`、`Accordion`、`Files` 和 `TypeTable` 等 Fumadocs UI 扩展组件需要在 MDX 页面中导入，或者由开发人员统一注册。详细用法参见 [Fumadocs 常用内置组件编写指南](docs/fumadocs-components.md)。

若要添加项目自定义 React 组件，请先在 `src/components/` 中创建组件，再将它加入 `src/components/mdx.tsx` 返回的组件对象。

## 国际化与路由

语言配置位于 `src/lib/i18n.ts`：

- `en` 是默认语言，不显示语言前缀。
- `/docs` 对应英文文档。
- `/zh/docs` 对应中文文档。
- `/en/docs` 会重定向到 `/docs`。

Fumadocs 根据 `content/docs/en` 和 `content/docs/zh` 自动读取对应语言的内容。中文是人工编写的源语言，英文由 [GitLocalize](https://gitlocalize.com/) 翻译并通过 PR 合并，详见[多语言文档维护工作流](docs/localization-workflow.md)。新增语言时，需要同时更新语言配置、内容目录和界面翻译。

## 框架配置

### 内容源

`source.config.ts` 定义 Fumadocs 文档集合和 MDX 处理方式。生成的内容由 `src/lib/source.ts` 中的 `loader()` 加载，并用于：

- 获取页面内容
- 生成侧边栏目录树
- 生成静态路由参数
- 提供搜索数据
- 输出 Markdown 和 LLM 文本

### 站点信息

在 `src/lib/shared.ts` 中修改站点名称、文档路由和 GitHub 仓库信息：

```ts
export const appName = 'StationOS Pro 帮助中心';

export const gitConfig = {
  user: '你的 GitHub 用户名或组织名',
  repo: '仓库名称',
  branch: 'main',
};
```

这些配置会用于顶部导航、GitHub 链接和文档“查看源码”功能。

### 页面布局

- `src/app/[lang]/docs/layout.tsx`：文档整体布局和侧边栏
- `src/app/[lang]/docs/[[...slug]]/page.tsx`：文档详情页
- `src/lib/layout.shared.tsx`：导航栏和多语言界面的公共配置
- `src/app/[lang]/(home)/page.tsx`：站点首页

### 样式

全局样式位于 `src/app/global.css`。该文件已经引入 Tailwind CSS 和 Fumadocs 默认主题：

```css
@import 'tailwindcss';
@import 'fumadocs-ui/css/neutral.css';
@import 'fumadocs-ui/css/preset.css';
```

可以在此文件中添加全局样式，也可以直接在 React/MDX 组件中使用 Tailwind CSS 类名。

## 搜索与机器可读内容

项目内置以下接口：

| 地址 | 用途 |
| --- | --- |
| `/api/search` | Fumadocs 全文搜索接口 |
| `/llms.txt` | 面向 LLM 的文档索引 |
| `/llms-full.txt` | 聚合后的完整文档文本 |
| `/docs/页面路径.md` | 获取指定页面的 Markdown 内容 |

`src/proxy.ts`(Next.js 16 中替代 `middleware.ts`)同时负责语言路由处理，以及根据 `.md` 后缀或请求头返回 Markdown 内容。

## 生产部署

先创建生产构建：

```bash
npm run build
```

再启动生产服务：

```bash
npm start
```

该项目是标准 Next.js 应用，可以部署到支持 Node.js 的平台。部署环境应安装依赖、执行 `npm run build`，并通过 `npm start` 启动服务。

## 开发约定

- TypeScript/React 代码使用两空格缩进、单引号和分号。
- React 组件使用 PascalCase，函数和变量使用 camelCase。
- 优先使用 `@/*` 别名导入 `src/` 中的模块。
- 默认使用服务端组件，仅在需要浏览器状态或副作用时添加客户端组件。
- 新增、删除或调整文档顺序时，应同步更新相邻的 `meta.json`。
- 重要文档变更应尽量同步维护中英文版本。
- 内容或导航变更后，应检查 `/docs`、`/zh/docs`、搜索、内部链接和移动端布局。
