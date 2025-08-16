#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 DopeTech Deployment Debug Script');
console.log('=====================================');

// Check Node.js version
console.log(`\n📋 Node.js Version: ${process.version}`);
console.log(`📋 Platform: ${process.platform}`);
console.log(`📋 Architecture: ${process.arch}`);

// Check if we're in a CI environment
console.log(`📋 CI Environment: ${process.env.CI || 'false'}`);
console.log(`📋 Netlify Environment: ${process.env.NETLIFY || 'false'}`);

// Check package.json
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log(`\n📦 Package Info:`);
  console.log(`   Name: ${packageJson.name}`);
  console.log(`   Version: ${packageJson.version}`);
  console.log(`   Node Engine: ${packageJson.engines?.node || 'not specified'}`);
  
  console.log(`\n🔧 Build Scripts:`);
  Object.entries(packageJson.scripts).forEach(([name, script]) => {
    console.log(`   ${name}: ${script}`);
  });
} catch (error) {
  console.error('❌ Error reading package.json:', error.message);
}

// Check Next.js config
try {
  const nextConfigPath = path.join(process.cwd(), 'next.config.mjs');
  if (fs.existsSync(nextConfigPath)) {
    console.log(`\n✅ Next.js config found: ${nextConfigPath}`);
  } else {
    console.log(`\n❌ Next.js config not found at: ${nextConfigPath}`);
  }
} catch (error) {
  console.error('❌ Error checking Next.js config:', error.message);
}

// Check for critical files
const criticalFiles = [
  'app/layout.tsx',
  'app/page.tsx',
  'package.json',
  'next.config.mjs',
  'tailwind.config.js',
  'tsconfig.json'
];

console.log(`\n📁 Critical Files Check:`);
criticalFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} (missing)`);
  }
});

// Check environment variables
console.log(`\n🔐 Environment Variables:`);
const envVars = [
  'NODE_ENV',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

envVars.forEach(envVar => {
  const value = process.env[envVar];
  if (value) {
    console.log(`   ✅ ${envVar}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`   ❌ ${envVar}: not set`);
  }
});

// Check disk space (if possible)
try {
  const { execSync } = require('child_process');
  if (process.platform === 'win32') {
    const output = execSync('wmic logicaldisk get size,freespace,caption', { encoding: 'utf8' });
    console.log(`\n💾 Disk Space (Windows):`);
    console.log(output);
  } else {
    const output = execSync('df -h', { encoding: 'utf8' });
    console.log(`\n💾 Disk Space (Unix):`);
    console.log(output);
  }
} catch (error) {
  console.log(`\n💾 Disk Space: Unable to check (${error.message})`);
}

console.log(`\n✅ Debug script completed successfully!`);
console.log(`\n📝 Next steps:`);
console.log(`   1. Check the output above for any missing files or environment variables`);
console.log(`   2. Ensure all dependencies are properly installed`);
console.log(`   3. Verify Next.js configuration is correct`);
console.log(`   4. Check for any TypeScript or linting errors`);

process.exit(0);
