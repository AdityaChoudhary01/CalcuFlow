import { MetadataRoute } from 'next';

// TODO: Replace with your actual app URL
const URL = 'https://calcuflow.vercel.app/';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${URL}/sitemap.xml`,
  };
}
