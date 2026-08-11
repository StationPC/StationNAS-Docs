# Fumadocs 常用内置组件编写指南

本文面向帮助中心的文档编写人员，介绍本项目中常用的 Fumadocs MDX 组件及其写法。

本文以项目当前使用的 `fumadocs-ui 16.9.3` 为基准。真正发布到帮助中心的内容仍应写在：

```text
content/docs/en/    # 英文文档
content/docs/zh/    # 中文文档
```

根目录的 `docs/` 只存放项目内部的编写与维护指南，不会出现在帮助中心导航中。

## 使用前须知

本项目在 `src/components/mdx.tsx` 中注册了 `fumadocs-ui/mdx` 提供的默认组件。

以下组件可以直接在 `.mdx` 文件中使用，不需要手动导入：

- `Callout`
- `Cards`、`Card`
- `CodeBlockTabs` 相关组件
- Fumadocs 增强后的标题、链接、图片、表格和代码块

以下常用组件由 Fumadocs UI 提供，但当前没有全局注册。使用时需要在 `.mdx` 文件中导入：

- `Tabs`、`Tab`
- `Steps`、`Step`
- `Accordions`、`Accordion`
- `Files`、`Folder`、`File`
- `TypeTable`
- `ImageZoom`
- `InlineTOC`

MDX 文件中的组件导入应放在 frontmatter 之后、正文之前：

```mdx
---
title: 示例文档
description: 演示 Fumadocs 组件的使用方法
---

import { Step, Steps } from 'fumadocs-ui/components/steps';

正文从这里开始。
```

如果同一个扩展组件被大量页面使用，应由开发人员将它统一注册到 `src/components/mdx.tsx`，编写人员不必在每篇文档中重复导入。

## Callout 提示框

`Callout` 用于展示提示、警告、错误或补充信息，是最常用的默认组件之一。

```mdx
<Callout>
  这是一条普通提示。
</Callout>

<Callout title="注意" type="warn">
  执行此操作前，请先备份重要数据。
</Callout>

<Callout title="操作失败" type="error">
  请检查网络连接后重试。
</Callout>

<Callout title="操作成功" type="success">
  配置已经保存。
</Callout>

<Callout title="建议" type="idea">
  建议在系统空闲时执行升级。
</Callout>
```

常用 `type` 值：

| 值 | 用途 |
| --- | --- |
| `info` | 普通信息，也是默认值 |
| `warn`、`warning` | 注意事项或风险提醒 |
| `error` | 错误、危险操作或失败信息 |
| `success` | 操作成功或结果确认 |
| `idea` | 技巧、建议或可选方案 |

使用建议：

- 不要将大段正文全部放入提示框。
- `error` 只用于确实可能造成失败、数据丢失或无法恢复的情况。
- 标题尽量简短，例如“注意”“重要”“操作成功”。

## Cards 与 Card 卡片

`Cards` 和 `Card` 适合展示入口、相关文档和下一步操作，已经在项目中默认注册。

```mdx
<Cards>
  <Card
    title="快速开始"
    description="完成 StationOS Pro 的首次配置"
    href="/zh/docs/quick-start/install"
  />
  <Card
    title="故障排查"
    description="查找常见问题的解决方法"
    href="/zh/docs/troubleshooting"
  />
</Cards>
```

卡片也可以使用正文作为描述：

```mdx
<Cards>
  <Card title="网络设置" href="./network-settings.mdx">
    配置有线网络、无线网络和代理服务器。
  </Card>
  <Card title="系统升级" href="./system-update.mdx">
    检查并安装最新的系统版本。
  </Card>
</Cards>
```

常用属性：

| 属性 | 说明 |
| --- | --- |
| `title` | 卡片标题，必填 |
| `description` | 简短说明，可选 |
| `href` | 点击后跳转的地址；省略时只展示内容 |
| `external` | 是否按外部链接处理 |
| `icon` | React 图标组件，通常由开发人员配置 |

本项目已经支持 MDX 相对链接。链接到同一内容树中的其他文档时，推荐使用 `./page.mdx` 或 `../group/page.mdx`，这样中英文目录可以保持相同写法。

## 代码块

普通 Markdown 代码块会自动获得语法高亮和复制按钮，不需要导入组件。

````mdx
```bash
npm run dev
```
````

### 添加标题

````mdx
```ts title="src/lib/example.ts"
export const enabled = true;
```
````

### 显示行号

````mdx
```ts lineNumbers
const name = 'StationOS Pro';
console.log(name);
```
````

也可以指定起始行号：

````mdx
```ts lineNumbers=10
const name = 'StationOS Pro';
console.log(name);
```
````

### 高亮和差异标记

````mdx
```ts
const oldValue = false; // [!code --]
const newValue = true; // [!code ++]
console.log(newValue); // [!code highlight]
```
````

代码块语言应尽量填写准确，例如 `bash`、`json`、`ts`、`tsx`、`css`，不要统一写成 `text`。

## Tabs 与 Tab 选项卡

选项卡适合展示不同系统、软件包管理器或操作方式下的等价步骤。

````mdx
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';

<Tabs items={['npm', 'pnpm']}>
  <Tab value="npm">

```bash
npm install
```

  </Tab>
  <Tab value="pnpm">

```bash
pnpm install
```

  </Tab>
</Tabs>
````

常用属性：

| 属性 | 说明 |
| --- | --- |
| `items` | 选项卡标题数组 |
| `defaultIndex` | 默认显示项的序号，从 `0` 开始 |
| `value` | `Tab` 对应的选项值，建议显式填写 |

`items` 中的名称应与各个 `Tab` 的 `value` 一致。只有两种以上内容确实互斥时才使用选项卡，不要用它隐藏普通的连续步骤。

## Steps 与 Step 步骤

步骤组件适合安装、配置、升级等必须按顺序完成的流程。

```mdx
import { Step, Steps } from 'fumadocs-ui/components/steps';

<Steps>
  <Step>

### 打开系统设置

从桌面进入“设置”。

  </Step>
  <Step>

### 选择系统更新

进入“系统”并选择“系统更新”。

  </Step>
  <Step>

### 安装更新

确认版本信息，然后选择“立即更新”。

  </Step>
</Steps>
```

在 `Step` 中使用 Markdown 标题和段落时，需要像示例一样保留空行，否则 MDX 可能不会按预期解析。

每个步骤应描述一个明确动作。步骤标题推荐使用动词开头，例如“打开设置”“连接设备”“验证结果”。

## Accordions 与 Accordion 折叠面板

折叠面板适合常见问题、可选说明和较长的补充内容。

```mdx
import {
  Accordion,
  Accordions,
} from 'fumadocs-ui/components/accordion';

<Accordions type="single">
  <Accordion title="升级会删除个人文件吗？">
    正常升级不会删除个人文件，但仍建议提前备份重要数据。
  </Accordion>
  <Accordion title="升级失败后怎么办？">
    请记录错误信息，然后前往故障排查页面查找对应方案。
  </Accordion>
</Accordions>
```

`type="single"` 表示一次只展开一项；使用 `type="multiple"` 时可以同时展开多项。

不要把完成任务所必需的关键信息只放在折叠面板内，以免读者忽略。

## Files、Folder 与 File 文件树

文件树用于展示目录结构，比纯文本树更直观。

```mdx
import { File, Files, Folder } from 'fumadocs-ui/components/files';

<Files>
  <Folder name="content" defaultOpen>
    <Folder name="docs" defaultOpen>
      <Folder name="zh">
        <File name="index.mdx" />
        <File name="meta.json" />
      </Folder>
    </Folder>
  </Folder>
  <File name="package.json" />
</Files>
```

`Folder` 的 `defaultOpen` 属性用于控制目录是否默认展开。文件树只负责展示结构，不会读取项目中的真实文件。

## TypeTable 类型表格

`TypeTable` 适合编写 API、配置项和命令参数说明。

```mdx
import { TypeTable } from 'fumadocs-ui/components/type-table';

<TypeTable
  type={{
    language: {
      description: '界面语言',
      type: `'zh' | 'en'`,
      default: `'zh'`,
      required: false,
    },
    autoUpdate: {
      description: '是否自动检查更新',
      type: 'boolean',
      default: 'true',
      required: false,
    },
  }}
/>
```

每个字段至少应填写 `type`。常用字段包括：

| 字段 | 说明 |
| --- | --- |
| `description` | 参数说明 |
| `type` | 简短类型 |
| `default` | 默认值 |
| `required` | 是否必填 |
| `deprecated` | 是否已经弃用 |

普通功能说明优先使用 Markdown 表格；只有需要明确展示类型、默认值和必填状态时才使用 `TypeTable`。

## ImageZoom 可缩放图片

单个页面可以直接导入并使用可缩放图片：

```mdx
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';

<ImageZoom
  src="/images/settings/system-update.png"
  alt="系统更新页面"
  width={1280}
  height={720}
/>
```

如果希望所有 Markdown 图片都支持点击放大，应由开发人员在 `src/components/mdx.tsx` 中将默认 `img` 替换为 `ImageZoom`，而不是要求编写人员逐张修改。

图片必须提供准确的 `alt` 文本。不要使用“图片”“截图”等没有实际信息的描述。

## InlineTOC 文内目录

`InlineTOC` 用于在正文中展示当前页面的标题目录，但它需要页面的 `toc` 数据。普通内容编写人员通常不应直接使用它；若某类页面需要统一显示文内目录，应由开发人员在页面模板中配置。

## 全局注册扩展组件

以下内容供维护 `src/components/mdx.tsx` 的开发人员参考。若编写人员频繁使用 Tabs、Steps 等组件，可以统一注册：

```tsx
import defaultMdxComponents from 'fumadocs-ui/mdx';
import * as AccordionComponents from 'fumadocs-ui/components/accordion';
import * as FileComponents from 'fumadocs-ui/components/files';
import * as StepComponents from 'fumadocs-ui/components/steps';
import * as TabsComponents from 'fumadocs-ui/components/tabs';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import type { MDXComponents } from 'mdx/types';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    ...AccordionComponents,
    ...FileComponents,
    ...StepComponents,
    ...TabsComponents,
    TypeTable,
    ...components,
  } satisfies MDXComponents;
}
```

全局注册后，MDX 文件中可以省略对应的 `import`。修改全局组件配置后，应执行：

```bash
npm run types:check
npm run build
```

## 编写规范

- 优先使用标准 Markdown；只有标准语法无法清晰表达内容时才使用组件。
- JSX 标签必须正确闭合，例如 `<Card ... />` 或 `<Callout>...</Callout>`。
- JavaScript 数组和对象使用花括号传入，例如 `items={['npm', 'pnpm']}`。
- JSX 中使用 `className`，不要使用 HTML 的 `class`。
- 组件内部包含 Markdown 标题、列表或代码块时，应在标签与内容之间保留空行。
- 不要仅依靠颜色表达成功、警告或错误，同时使用明确的文字说明。
- 新组件首次使用后，应在浏览器中检查桌面端、移动端和深色模式效果。
- 中英文内容树应保持一致；新增页面或调整顺序时同步维护相邻的 `meta.json`。

## 参考资料

- [Fumadocs 默认 MDX 组件](https://fumadocs.dev/docs/ui/components)
- [Fumadocs Markdown 与代码块语法](https://fumadocs.dev/docs/markdown)
- [Fumadocs UI 组件文档](https://fumadocs.dev/docs/ui/components)
