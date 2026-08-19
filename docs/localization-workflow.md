# 多语言文档维护工作流

本项目使用 [GitLocalize](https://gitlocalize.com/) 管理文档翻译。GitLocalize 直接连接 GitHub 仓库，译者在网页端翻译仓库中的 MDX 文件，完成后以 Pull Request 的形式提交回本仓库，合并后即发布。

这种方案没有本地生成步骤、无需维护翻译交换文件，也不需要自托管翻译服务。

## 基本原则

- `content/docs/zh/` 是唯一人工编写的文档源（源语言：简体中文）。
- `content/docs/en/` 由 GitLocalize 翻译生成，译者不应直接在本地编辑英文内容。
- 两种语言的目录结构和文件名必须一致（例如 `quick-start/da400-install.mdx`），GitLocalize 才能正确映射源文件与译文文件。
- GitLocalize 完成翻译后自动创建 PR，由维护者审核合并后发布。

## 首次配置

在 GitLocalize 上配置一次：

1. 使用 GitHub 账号登录 [GitLocalize](https://gitlocalize.com/)，连接本仓库。
2. 创建项目，选择 **File-based** 翻译方式。
3. 源语言选择 **Chinese (Simplified)**，目标语言选择 **English**。
4. 添加文件路径映射：

   | 源文件 | 目标文件 |
   | --- | --- |
   | `content/docs/zh/**/*.mdx` | `content/docs/en/**/*.mdx` |

   `meta.json` 由维护者人工维护（标题翻译），不交给 GitLocalize，避免 `pages` 数组中的文件名被误译。
5. 开启 Markdown 的“不翻译代码块/行内代码”保护，确保代码、组件标签结构、URL 和图片路径不会被误译。
6. 为 GitLocalize 机器人配置仓库写权限，翻译提交使用专用分支（如 `gitlocalize/`），并启用 Pull Request 工作流。

## 日常流程

中文作者修改或新增 MDX 后，直接提交并合并到 `main`：

```bash
git add content/docs/zh
git commit -m "docs: update ..."
git push
```

GitLocalize 会检测源文件变化，在平台上标记过期的翻译片段。译者完成翻译后创建 PR，维护者审核时重点确认：

- 代码块、行内代码、URL 和图片路径未被翻译；
- 组件属性（如 `<Card title="...">`）中的文本翻译正确，结构未被破坏；
- `meta.json` 的 `pages` 文件名保持不变。

合并 PR 后英文文档即更新，无需任何本地生成步骤。

## 本地校验

翻译相关没有额外的本地脚本。提交前运行常规检查：

```bash
npm run types:check
npm run build
```

## 新增语言

在 GitLocalize 项目中添加目标语言，同时：

1. 在 `src/lib/i18n.ts` 的 `localeConfigs` 和 `languages` 中增加对应语言；
2. 在 `content/docs/` 下创建对应语言目录（可由 GitLocalize 首次翻译时生成）；
3. 为 RTL 语言额外检查布局；
4. 更新 GitLocalize 的路径映射以覆盖新语言。

## 运维要求

- 部署文档站时设置 `NEXT_PUBLIC_SITE_URL`，确保 canonical、Open Graph 和 `hreflang` 使用生产域名。
- 内容或导航变更后，检查 `/docs`、`/zh/docs`、搜索、内部链接和移动端布局。
