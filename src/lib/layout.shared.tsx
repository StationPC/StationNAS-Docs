import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { i18n } from './i18n';
import { uiTranslations } from 'fumadocs-ui/i18n';
import { appName, gitConfig } from './shared';
import { localeConfigs } from './locales.generated';

// UI translations: official Fumadocs language pack + per-locale display names
// `displayName` is the label shown in the language switcher.
export const translations = i18n
  .translations()
  .extend(uiTranslations())
  .add(
    'ui',
    Object.fromEntries(
      localeConfigs.map((locale) => [locale.id, { displayName: locale.displayName }]),
    ),
  );

export function baseOptions(locale: string): BaseLayoutProps {
  return {
    nav: {
      // JSX supported
      title: appName,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
