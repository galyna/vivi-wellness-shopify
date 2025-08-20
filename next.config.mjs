   /** @type {import('next').NextConfig} */
   import withBundleAnalyzer from '@next/bundle-analyzer';

   const nextConfig = withBundleAnalyzer({
     enabled: process.env.ANALYZE === 'true',enabled: process.env.ANALYZE === 'true',
     openAnalyzer: true,
     generateStatsFile: true,
     statsFilename: 'stats.json',
   })({
     images: {
       domains: ['cdn.sanity.io', 'cdn.shopify.com'],
     },
   });

   export default nextConfig;