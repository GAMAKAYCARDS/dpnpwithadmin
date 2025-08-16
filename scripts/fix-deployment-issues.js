const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing deployment issues...\n');

// 1. Fix MIME type issues in next.config.mjs
function fixNextConfig() {
  console.log('📝 Updating Next.js configuration...');
  
  const configPath = path.join(__dirname, '..', 'next.config.mjs');
  let config = fs.readFileSync(configPath, 'utf8');
  
  // Add proper MIME type handling
  const mimeTypeConfig = `
  // MIME type handling for static assets
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        source: '/(.*)\\.css',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/css',
          },
        ],
      },
      {
        source: '/(.*)\\.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript',
          },
        ],
      },
    ];
  },`;
  
  // Insert headers configuration before the closing brace
  if (!config.includes('async headers()')) {
    config = config.replace(
      /export default nextConfig/,
      `${mimeTypeConfig}\n\nexport default nextConfig`
    );
    fs.writeFileSync(configPath, config);
    console.log('✅ Updated Next.js configuration');
  } else {
    console.log('ℹ️ Next.js configuration already has headers');
  }
}

// 2. Create a proper _document.js to handle MIME types
function createDocumentFile() {
  console.log('📄 Creating custom document...');
  
  const documentPath = path.join(__dirname, '..', 'app', '_document.tsx');
  const documentContent = `import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Proper MIME type declarations */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        
        {/* Preload critical assets with proper types */}
        <link 
          rel="preload" 
          href="/logo/dopelogo.svg" 
          as="image" 
          type="image/svg+xml" 
        />
        <link 
          rel="preload" 
          href="/video/footervid.mp4" 
          as="video" 
          type="video/mp4" 
        />
        
        {/* Manifest with proper type */}
        <link 
          rel="manifest" 
          href="/manifest.json" 
          type="application/manifest+json" 
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}`;
  
  if (!fs.existsSync(documentPath)) {
    fs.writeFileSync(documentPath, documentContent);
    console.log('✅ Created custom document');
  } else {
    console.log('ℹ️ Custom document already exists');
  }
}

// 3. Update package.json scripts
function updatePackageScripts() {
  console.log('📦 Updating package.json scripts...');
  
  const packagePath = path.join(__dirname, '..', 'package.json');
  const package = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // Add build script with asset check
  if (!package.scripts['build:check']) {
    package.scripts['build:check'] = 'node scripts/check-static-assets.js && pnpm build';
  }
  
  // Add fix script
  if (!package.scripts['fix:deployment']) {
    package.scripts['fix:deployment'] = 'node scripts/fix-deployment-issues.js';
  }
  
  fs.writeFileSync(packagePath, JSON.stringify(package, null, 2));
  console.log('✅ Updated package.json scripts');
}

// 4. Create a .htaccess file for Apache servers (if needed)
function createHtaccess() {
  console.log('🌐 Creating .htaccess file...');
  
  const htaccessPath = path.join(__dirname, '..', 'public', '.htaccess');
  const htaccessContent = `# MIME Type Fixes
<IfModule mod_mime.c>
  AddType text/css .css
  AddType application/javascript .js
  AddType image/svg+xml .svg
  AddType video/mp4 .mp4
  AddType image/png .png
  AddType image/jpeg .jpg .jpeg
  AddType image/webp .webp
  AddType image/avif .avif
  AddType application/manifest+json .json
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  Header always set X-Content-Type-Options nosniff
  Header always set X-Frame-Options DENY
  Header always set X-XSS-Protection "1; mode=block"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Cache Control
<IfModule mod_expires.c>
  ExpiresActive on
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType video/mp4 "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/avif "access plus 1 year"
</IfModule>`;
  
  fs.writeFileSync(htaccessPath, htaccessContent);
  console.log('✅ Created .htaccess file');
}

// 5. Create a web.config file for IIS servers (if needed)
function createWebConfig() {
  console.log('🌐 Creating web.config file...');
  
  const webConfigPath = path.join(__dirname, '..', 'public', 'web.config');
  const webConfigContent = `<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <staticContent>
      <mimeMap fileExtension=".css" mimeType="text/css" />
      <mimeMap fileExtension=".js" mimeType="application/javascript" />
      <mimeMap fileExtension=".svg" mimeType="image/svg+xml" />
      <mimeMap fileExtension=".mp4" mimeType="video/mp4" />
      <mimeMap fileExtension=".webp" mimeType="image/webp" />
      <mimeMap fileExtension=".avif" mimeType="image/avif" />
      <mimeMap fileExtension=".json" mimeType="application/json" />
    </staticContent>
    <httpProtocol>
      <customHeaders>
        <add name="X-Content-Type-Options" value="nosniff" />
        <add name="X-Frame-Options" value="DENY" />
        <add name="X-XSS-Protection" value="1; mode=block" />
        <add name="Referrer-Policy" value="strict-origin-when-cross-origin" />
      </customHeaders>
    </httpProtocol>
  </system.webServer>
</configuration>`;
  
  fs.writeFileSync(webConfigPath, webConfigContent);
  console.log('✅ Created web.config file');
}

// 6. Create a comprehensive error handling component
function createErrorHandling() {
  console.log('🛡️ Creating error handling components...');
  
  const errorBoundaryPath = path.join(__dirname, '..', 'components', 'error-boundary.tsx');
  const errorBoundaryContent = `'use client'

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Prevent multiple error logs
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (e) => {
        e.preventDefault()
        console.warn('Prevented error from bubbling:', e.error)
      })
      
      window.addEventListener('unhandledrejection', (e) => {
        e.preventDefault()
        console.warn('Prevented unhandled promise rejection:', e.reason)
      })
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-[#F7DD0F]">Something went wrong!</h1>
              <p className="text-gray-400">
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </p>
            </div>
            
            <button
              onClick={this.resetError}
              className="w-full bg-[#F7DD0F] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#F7DD0F]/90 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}`;
  
  if (!fs.existsSync(errorBoundaryPath)) {
    fs.writeFileSync(errorBoundaryPath, errorBoundaryContent);
    console.log('✅ Created error boundary component');
  } else {
    console.log('ℹ️ Error boundary component already exists');
  }
}

// 7. Create a deployment checklist
function createDeploymentChecklist() {
  console.log('📋 Creating deployment checklist...');
  
  const checklistPath = path.join(__dirname, '..', 'DEPLOYMENT_CHECKLIST.md');
  const checklistContent = `# Deployment Checklist

## Pre-Deployment Checks

### ✅ Static Assets
- [ ] All required assets are present in /public directory
- [ ] Run: \`node scripts/check-static-assets.js\`

### ✅ Environment Variables
- [ ] NEXT_PUBLIC_SUPABASE_URL is set
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY is set
- [ ] SUPABASE_SERVICE_ROLE_KEY is set (for API routes)

### ✅ Build Configuration
- [ ] next.config.mjs has proper MIME type headers
- [ ] netlify.toml has correct redirects and headers
- [ ] package.json scripts are updated

### ✅ Error Handling
- [ ] Error boundary components are in place
- [ ] Custom error pages are configured
- [ ] Fallback assets are available

## Post-Deployment Verification

### ✅ Console Errors
- [ ] No MIME type errors for CSS/JS files
- [ ] No 404 errors for static assets
- [ ] No multiple Supabase client warnings
- [ ] No DOM manipulation errors

### ✅ Performance
- [ ] Assets are loading with proper cache headers
- [ ] No preload warnings in console
- [ ] Video files are loading correctly
- [ ] Images are optimized and loading

### ✅ Functionality
- [ ] All pages are accessible
- [ ] Cart functionality works
- [ ] Product images display correctly
- [ ] Video autoplay works
- [ ] Logo displays properly

## Common Issues & Solutions

### MIME Type Errors
- **Issue**: CSS files being treated as executable scripts
- **Solution**: Ensure proper Content-Type headers in netlify.toml

### 404 Asset Errors
- **Issue**: Missing static files
- **Solution**: Run asset check script and create fallbacks

### Multiple Supabase Clients
- **Issue**: GoTrueClient instances warning
- **Solution**: Use singleton pattern in lib/supabase.ts

### DOM Manipulation Errors
- **Issue**: React trying to remove non-existent nodes
- **Solution**: Use safer DOM manipulation with proper checks

## Quick Fix Commands

\`\`\`bash
# Check and fix assets
node scripts/check-static-assets.js

# Fix deployment issues
node scripts/fix-deployment-issues.js

# Build with checks
pnpm run build:check

# Deploy to Netlify
netlify deploy --prod
\`\`\`
`;
  
  fs.writeFileSync(checklistPath, checklistContent);
  console.log('✅ Created deployment checklist');
}

// Run all fixes
function runAllFixes() {
  try {
    fixNextConfig();
    createDocumentFile();
    updatePackageScripts();
    createHtaccess();
    createWebConfig();
    createErrorHandling();
    createDeploymentChecklist();
    
    console.log('\n🎉 All deployment issues have been addressed!');
    console.log('\n📋 Next steps:');
    console.log('1. Run: pnpm install');
    console.log('2. Run: pnpm run build:check');
    console.log('3. Deploy to Netlify');
    console.log('4. Check the deployment checklist: DEPLOYMENT_CHECKLIST.md');
    
  } catch (error) {
    console.error('❌ Error during fix process:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runAllFixes();
}

module.exports = { runAllFixes };
