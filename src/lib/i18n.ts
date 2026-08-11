import { defineI18n } from 'fumadocs-core/i18n';
import { defaultLanguage, languages } from './locales.generated';

export { defaultLanguage, languages } from './locales.generated';

export const i18n = defineI18n({
  defaultLanguage,
  languages: [...languages],
  parser: 'dir',
  // Default locale (en) is served without a URL prefix:
  //   /docs  -> English (rewritten internally to /en/docs)
  //   /zh/docs -> Chinese
  hideLocale: 'default-locale',
});
