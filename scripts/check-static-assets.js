const fs = require('fs');
const path = require('path');

// Required static assets
const requiredAssets = [
  '/logo/dopelogo.svg',
  '/logo/simple-logo.svg',
  '/video/footervid.mp4',
  '/payment/paymentQR.svg',
  '/payment/message qr.svg',
  '/placeholder.jpg',
  '/placeholder-logo.png',
  '/placeholder-user.jpg',
  '/manifest.json'
];

// Check if assets exist
function checkAssets() {
  console.log('🔍 Checking static assets...');
  
  const publicDir = path.join(__dirname, '..', 'public');
  const missingAssets = [];
  const existingAssets = [];
  
  requiredAssets.forEach(asset => {
    const assetPath = path.join(publicDir, asset);
    if (fs.existsSync(assetPath)) {
      existingAssets.push(asset);
      console.log(`✅ ${asset}`);
    } else {
      missingAssets.push(asset);
      console.log(`❌ ${asset} - MISSING`);
    }
  });
  
  console.log('\n📊 Summary:');
  console.log(`✅ Found: ${existingAssets.length}/${requiredAssets.length} assets`);
  console.log(`❌ Missing: ${missingAssets.length} assets`);
  
  if (missingAssets.length > 0) {
    console.log('\n❌ Missing assets:');
    missingAssets.forEach(asset => console.log(`   - ${asset}`));
    
    // Create fallback assets
    console.log('\n🔧 Creating fallback assets...');
    createFallbackAssets(missingAssets, publicDir);
  } else {
    console.log('\n🎉 All required assets are present!');
  }
}

// Create fallback assets
function createFallbackAssets(missingAssets, publicDir) {
  missingAssets.forEach(asset => {
    const assetPath = path.join(publicDir, asset);
    const assetDir = path.dirname(assetPath);
    
    // Ensure directory exists
    if (!fs.existsSync(assetDir)) {
      fs.mkdirSync(assetDir, { recursive: true });
      console.log(`📁 Created directory: ${assetDir}`);
    }
    
    // Create fallback content based on file type
    if (asset.endsWith('.svg')) {
      createFallbackSVG(assetPath, asset);
    } else if (asset.endsWith('.mp4')) {
      createFallbackVideo(assetPath, asset);
    } else if (asset.endsWith('.json')) {
      createFallbackJSON(assetPath, asset);
    } else if (asset.endsWith('.jpg') || asset.endsWith('.png')) {
      createFallbackImage(assetPath, asset);
    }
  });
}

function createFallbackSVG(filePath, asset) {
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
    <rect width="100" height="100" fill="#F7DD0F"/>
    <text x="50" y="50" text-anchor="middle" dy=".3em" fill="#000" font-family="Arial" font-size="12">DopeTech</text>
  </svg>`;
  
  fs.writeFileSync(filePath, svgContent);
  console.log(`📄 Created fallback SVG: ${asset}`);
}

function createFallbackVideo(filePath, asset) {
  // Create a minimal MP4 file (1x1 pixel, 1 frame)
  const minimalMP4 = Buffer.from([
    0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6F, 0x6D,
    0x00, 0x00, 0x02, 0x00, 0x69, 0x73, 0x6F, 0x6D, 0x69, 0x73, 0x6F, 0x32,
    0x61, 0x76, 0x63, 0x31, 0x6D, 0x70, 0x34, 0x31
  ]);
  
  fs.writeFileSync(filePath, minimalMP4);
  console.log(`🎥 Created fallback MP4: ${asset}`);
}

function createFallbackJSON(filePath, asset) {
  const manifestContent = {
    name: "DopeTech Nepal",
    short_name: "DopeTech",
    description: "Premium tech gear from DopeTech Nepal",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#F7DD0F",
    icons: [
      {
        src: "/logo/simple-logo.svg",
        sizes: "192x192",
        type: "image/svg+xml"
      }
    ]
  };
  
  fs.writeFileSync(filePath, JSON.stringify(manifestContent, null, 2));
  console.log(`📄 Created fallback JSON: ${asset}`);
}

function createFallbackImage(filePath, asset) {
  // Create a minimal PNG file (1x1 pixel, yellow)
  const minimalPNG = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
    0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x63, 0xF8, 0xCF, 0xCF, 0x00,
    0x00, 0x03, 0x01, 0x01, 0x00, 0x18, 0xDD, 0x8D, 0xB0, 0x00, 0x00, 0x00,
    0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
  ]);
  
  fs.writeFileSync(filePath, minimalPNG);
  console.log(`🖼️ Created fallback image: ${asset}`);
}

// Run the check
if (require.main === module) {
  checkAssets();
}

module.exports = { checkAssets };
