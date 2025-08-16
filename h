[33mf01874a[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mmain[m[33m, [m[1;31morigin/main[m[33m)[m Fix Netlify deployment issues
[33m23342c9[m Fix path alias resolution: Add webpack alias configuration for @ imports to work on Netlify
[33m50f549e[m Fix Netlify build: Move autoprefixer, postcss, and tailwindcss to dependencies for production build
[33mdd02405[m Fix Express dependency issue: Exclude nested directories with API routes from build
[33m6e083da[m Fix Netlify deployment: Update vaul to 1.1.2 for React 19 compatibility and add generateStaticParams for static export
[33mde4aae7[m Fix dependency installation: Switched from pnpm to npm for better Netlify compatibility, removed pnpm-lock.yaml, and updated build command
[33m04420d0[m Fix Node.js version issue: Updated to Node.js 18.x for better Netlify compatibility, added .nvmrc file, and ensured consistent version across all configs
[33m8d62336[m Fix ES module error: Removed Netlify Next.js plugin, cleaned up package.json, and ensured pure static export configuration
[33m81e6cc3[m Fix Netlify deployment: Removed all API routes incompatible with static export, cleaned up next.config.mjs headers, and ensured pure static deployment
[33ma0c3fc1[m Fix orders not appearing on Netlify: Added static export config, created orders-data.ts for client-side data fetching, and updated OrdersManager to work with static deployment
[33m095e673[m Enhanced admin panel with responsive design: Updated Assets, Carousel, and Orders tabs with mobile-first design, improved UI/UX, and better accessibility
[33md746402[m Initial commit: DopeTech Nepal e-commerce platform with admin panel
