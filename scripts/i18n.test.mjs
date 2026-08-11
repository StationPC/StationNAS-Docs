import assert from 'node:assert/strict';
import test from 'node:test';
import { parse as parseYaml } from 'yaml';
import { readFile } from 'node:fs/promises';
import {
  applyReplacements,
  buildTargetXliff,
  collectMdxSegments,
} from './i18n.mjs';

const config = parseYaml(await readFile(new URL('../localization/config.yml', import.meta.url), 'utf8'));

test('extracts prose, frontmatter, JSX labels, and nested component text', () => {
  const source = `---
title: 安装指南
description: 安全安装 StationOS Pro
---

运行 \`station --version\` 棬查版本。

<Card title="快速开始" href="/zh/docs/quick-start/install" />

<Callout>不要关闭设备。</Callout>

\`\`\`bash
station install
\`\`\`
`;
  const { segments } = collectMdxSegments(source, 'fixture.mdx', config);
  const texts = segments.map((segment) => segment.text);

  assert(texts.includes('安装指南'));
  assert(texts.includes('安全安装 StationOS Pro'));
  assert(texts.includes('快速开始'));
  assert(texts.includes('不要关闭设备。'));
  assert(!texts.some((text) => text.includes('station --version')));
  assert(!texts.some((text) => text.includes('station install')));
  assert(!texts.some((text) => text.includes('/zh/docs/')));
});

test('applies translated ranges without changing protected syntax', () => {
  const source = '<Card title="快速开始" href="/docs" />';
  const start = source.indexOf('快速开始');
  const output = applyReplacements(source, [{
    start,
    end: start + '快速开始'.length,
    value: 'Quick Start',
  }]);

  assert.equal(output, '<Card title="Quick Start" href="/docs" />');
});

test('marks an existing translation for review when its Chinese source changes', () => {
  const unit = {
    id: 'u-test',
    file: 'index.mdx',
    locator: 'text:1.0',
    kind: 'text',
    text: '新的中文内容',
    risk: 'normal',
  };
  const existing = new Map([['u-test', {
    source: '旧的中文内容',
    target: 'Old English content',
    state: 'final',
  }]]);
  const xliff = buildTargetXliff(
    [unit],
    existing,
    new Map(),
    { id: 'en', tag: 'en' },
    'zh-Hans',
  );

  assert.match(xliff, /<target state="needs-review">Old English content<\/target>/);
});

