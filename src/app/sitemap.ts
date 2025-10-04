import { MetadataRoute } from 'next';

// TODO: Replace with your actual app URL
const URL = 'https://your-app-url.com';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: URL,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
  ];
}
