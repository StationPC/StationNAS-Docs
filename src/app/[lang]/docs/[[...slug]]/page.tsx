import { getPageImage, getPageMarkdownUrl, source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { gitConfig } from '@/lib/shared';
import { Callout } from 'fumadocs-ui/components/callout';
import { localeConfigs, sourceLanguage } from '@/lib/locales.generated';

const translationNotices = {
  en: {
    title: 'Translation review pending',
    body: 'This page may not include the latest changes from the Chinese source.',
    link: 'Read the current Chinese version',
  },
  zh: {
    title: '译文尚待审核',
    body: '此页面可能尚未包含中文源文档的最新更改。',
    link: '查看最新中文版本',
  },
} as const;

export default async function Page(props: PageProps<'/[lang]/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug, params.lang);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;
  const sourcePage = source.getPage(params.slug, sourceLanguage);
  const notice = translationNotices[params.lang as keyof typeof translationNotices]
    ?? translationNotices.en;
  const showTranslationNotice = params.lang !== sourceLanguage
    && page.data.translationStatus !== 'approved';

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${page.path}`}
        />
      </div>
      <DocsBody>
        {showTranslationNotice && (
          <Callout title={notice.title} type="warn">
            {notice.body}{' '}
            {sourcePage && <a href={sourcePage.url}>{notice.link}</a>}
          </Callout>
        )}
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<'/[lang]/docs/[[...slug]]'>,
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug, params.lang);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: {
      canonical: page.url,
      languages: Object.fromEntries([
        ...localeConfigs.flatMap((locale) => {
          const localizedPage = source.getPage(params.slug, locale.id);
          if (!localizedPage) return [];
          return [[locale.tag, localizedPage.url] as const];
        }),
        ['x-default', source.getPage(params.slug, 'en')?.url ?? page.url],
      ]),
    },
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}
