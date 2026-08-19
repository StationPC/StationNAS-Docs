import { defineI18n } from 'fumadocs-core/i18n';

// Static locale configuration. Translations are managed with GitLocalize,
// which translates `content/docs/zh/**` into `content/docs/en/**` and opens
// pull requests against this repository.
export const localeConfigs = [
  { id: 'en', tag: 'en', displayName: 'English', direction: 'ltr', search: 'english' },
  { id: 'zh', tag: 'zh-Hans', displayName: '中文', direction: 'ltr', search: 'cjk' },
] as const;

export const languages = ['en', 'zh'] as const;
export const defaultLanguage = 'en' as const;
// Source language edited by maintainers; other locales are translated by GitLocalize.
export const sourceLanguage = 'zh' as const;

export type Locale = (typeof languages)[number];
export type LocaleConfig = (typeof localeConfigs)[number];

export function getLocaleConfig(locale: string): LocaleConfig {
  return localeConfigs.find((item) => item.id === locale) ?? localeConfigs[0];
}

export const i18n = defineI18n({
  defaultLanguage,
  languages: [...languages],
  parser: 'dir',
  // Default locale (en) is served without a URL prefix:
  //   /docs    -> English (rewritten internally to /en/docs)
  //   /zh/docs -> Chinese
  hideLocale: 'default-locale',
});
