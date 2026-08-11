import Link from 'next/link';
import { source } from '@/lib/source';
import { languages } from '@/lib/i18n';

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params;
  // pick a landing page from the docs, or render a custom hero here
  const page = source.getPage([], lang);

  return (
    <div className="flex flex-col justify-center text-center flex-1">
      <h1 className="text-2xl font-bold mb-4">{page?.data.title ?? 'Hello World'}</h1>
      <p>
        <Link href={page?.url ?? '/docs'} className="font-medium underline">
          /docs
        </Link>{' '}
        — open the documentation.
      </p>
    </div>
  );
}

export function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}
