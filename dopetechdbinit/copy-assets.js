const fs = require('fs-extra');
const path = require('path');

async function copyAssets() {
  try {
    console.log('📁 Copying static assets...');
    console.log('Current working directory:', process.cwd());
    
    // Check if source directories exist
    const logoSource = path.join(process.cwd(), 'public', 'logo');
    const videoSource = path.join(process.cwd(), 'public', 'video');
    
    console.log('Checking logo source:', logoSource);
    console.log('Checking video source:', videoSource);
    
    if (!await fs.pathExists(logoSource)) {
      console.error('❌ Logo source directory does not exist:', logoSource);
      // List contents of public directory
      const publicDir = path.join(process.cwd(), 'public');
      if (await fs.pathExists(publicDir)) {
        const contents = await fs.readdir(publicDir);
        console.log('Contents of public directory:', contents);
      }
      process.exit(1);
    }
    
    if (!await fs.pathExists(videoSource)) {
      console.error('❌ Video source directory does not exist:', videoSource);
      process.exit(1);
    }
    
    // Copy logo directory
    await fs.copy(logoSource, path.join(process.cwd(), 'logo'));
    console.log('✅ Logo files copied');
    
    // Copy video directory
    await fs.copy(videoSource, path.join(process.cwd(), 'video'));
    console.log('✅ Video files copied');
    
    console.log('🎉 All static assets copied successfully!');
  } catch (error) {
    console.error('❌ Error copying assets:', error);
    process.exit(1);
  }
}

copyAssets();
