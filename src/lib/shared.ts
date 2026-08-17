export const appName = 'My App';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';
export const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000');

// fill this with your actual GitHub info, for example:
export const gitConfig = {
  user: 'StationPC',
  repo: 'StationNAS-Docs',
  branch: 'main',
};
