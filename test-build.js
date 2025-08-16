#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing build process...\n');

try {
  // Check if node_modules exists
  if (!fs.existsSync(path.join(process.cwd(), 'node_modules'))) {
    console.log('📦 Installing dependencies...');
    execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
  }

  // Check if TypeScript packages are installed
  console.log('🔍 Checking TypeScript packages...');
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const devDeps = packageJson.devDependencies || {};
  
  if (!devDeps.typescript) {
    console.log('❌ TypeScript not found in devDependencies');
    process.exit(1);
  }
  
  if (!devDeps['@types/react']) {
    console.log('❌ @types/react not found in devDependencies');
    process.exit(1);
  }

  console.log('✅ TypeScript packages found');

  // Test the build
  console.log('🏗️  Running build...');
  execSync('npm run build:netlify', { stdio: 'inherit' });

  // Check if out directory was created
  if (fs.existsSync(path.join(process.cwd(), 'out'))) {
    console.log('✅ Build successful! out/ directory created');
  } else {
    console.log('❌ Build failed - out/ directory not found');
    process.exit(1);
  }

  console.log('\n🎉 Build test completed successfully!');

} catch (error) {
  console.error('❌ Build test failed:', error.message);
  process.exit(1);
}
