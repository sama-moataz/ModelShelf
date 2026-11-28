// Single source of truth for the canonical URL and site-wide copy.
export const SITE_URL: string =
  import.meta.env.PUBLIC_SITE_URL || 'https://modelshelf.vercel.app';

export const SITE_NAME = 'ModelShelf';
export const SITE_TAGLINE = 'Open datasets & APIs for student and indie AI/ML projects';
export const SITE_DESCRIPTION =
  'ModelShelf is a curated directory of open datasets and APIs for students and indie builders: licenses, costs, rate limits and copy-paste starter code, with no paywalls.';
export const REPO_URL = 'https://github.com/sama-moataz/ModelShelf';
// Google AdSense publisher. The tag in Layout.astro and /ads.txt both read it, so they cannot drift.
export const ADSENSE_CLIENT = 'ca-pub-1579232071917566';
