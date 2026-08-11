# 多语言文档维护工作流

## 基本原则

- `content/docs/zh/` 是唯一人工编写的文档源。
- 其他语言目录由翻译管线生成，不直接编辑。
- `localization/xliff/` 是 Weblate 与仓库交换翻译内容的接口。
- GitHub Pull Request 是最终发布审批入口。

## 日常流程

中文作者修改或新增 MDX 后执行：

```bash
npm run i18n:sync
```

该命令会解析 MDX AST，更新源 XLIFF、各目标语言 XLIFF、语言配置、翻译状态和已发布译文。已有译文会被保留并标为过期，新句子暂时回退为中文。代码块、行内代码、URL、MDX 表达式和组件结构不会进入翻译单元。

Weblate 从 GitHub 拉取 `localization/xliff/*.xlf`。机器翻译服务只产生建议；译者在 Weblate 中修改，审核者将完成的单元标记为 Final。Weblate 应把译文推送到同一仓库的服务分支并创建 PR。

翻译 PR 创建后，GitHub Actions 会运行：

```bash
npm run i18n:sync
npm run i18n:check:release
```

生成的 MDX 和导航文件会自动提交回该 PR。高风险页面只有在对应语言的全部单元均为 Final 时才能通过发布检查。

## Weblate 组件配置

1. 在 `localization/weblate/` 中复制环境模板并启动服务：

   ```bash
   cp environment.example environment
   docker compose up -d
   ```

2. 在 Weblate 创建项目和组件，连接本 GitHub 仓库。
3. Source language 选择简体中文，文件格式选择 XLIFF 2.0。
4. File mask 使用 `localization/xliff/*.xlf`，基础文件使用 `localization/xliff/zh.xlf`。
5. 将 Repository push URL 配置为具有服务分支写入权限的 GitHub 凭据，服务分支使用 `weblate/` 或 `l10n/` 前缀，并启用 Pull Request 工作流。
6. 导入 `localization/glossary.yml` 中的术语，并开启项目翻译记忆。
7. 在 Weblate 管理后台配置按量计费的云翻译 API；API 密钥不得提交到仓库。

正式接入前，使用 `index.mdx` 验证 frontmatter、正文、`<Card title="..." />` 和链接均能正确往返。

## 风险与状态

页面通过 frontmatter 的 `translationRisk` 标记风险：

```yaml
translationRisk: high
```

安装、升级、数据删除、恢复、安全和关键故障处理页面使用 `high`；其他页面默认为 `normal`。中文变更后，旧译文自动变为 `stale`，站点会显示过期提示，但不会阻塞中文内容发布。

## 新增语言

在 `localization/config.yml` 的 `locales` 中增加语言，然后执行 `npm run i18n:sync`。语言配置包含：

- 内部路由 ID；
- BCP 47 HTML 标签；
- 语言选择器显示名称；
- `ltr` 或 `rtl` 方向；
- 搜索分词方式。

新增语言前应根据真实访问、用户、销售和支持工单数据评估。每次最多增加两种语言；RTL 语言必须额外检查布局。

## 运维要求

- 部署文档站时设置 `NEXT_PUBLIC_SITE_URL`，确保 canonical、Open Graph 和 `hreflang` 使用生产域名。
- 每日备份 PostgreSQL 和 Weblate 数据卷。
- 每月导出翻译记忆 TMX 和术语 TBX。
- 升级 Weblate 前先在备份副本上运行 XLIFF 往返测试。
- 提交前始终运行 `npm run i18n:check`、`npm run types:check` 和 `npm run build`。
