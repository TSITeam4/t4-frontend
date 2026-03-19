import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://westernsalesclub.ca', lastModified: new Date(), changeFrequency: 'monthly', priority: 1.0 },
    { url: 'https://westernsalesclub.ca/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://westernsalesclub.ca/executive-team', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://westernsalesclub.ca/events', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://westernsalesclub.ca/sponsors', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: 'https://westernsalesclub.ca/contact-us', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
  ];
}
