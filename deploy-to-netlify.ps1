# DopeTech Netlify Deployment Script
# This script helps prepare and deploy the project to Netlify

Write-Host "🚀 DopeTech Netlify Deployment Script" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from the project root." -ForegroundColor Red
    exit 1
}

# Check if git is available
try {
    $gitVersion = git --version
    Write-Host "✅ Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: Git not found. Please install Git and try again." -ForegroundColor Red
    exit 1
}

# Check current git status
Write-Host "`n📋 Checking git status..." -ForegroundColor Yellow
$gitStatus = git status --porcelain

if ($gitStatus) {
    Write-Host "📝 Changes detected:" -ForegroundColor Yellow
    Write-Host $gitStatus -ForegroundColor Gray
    
    $response = Read-Host "`n❓ Do you want to commit these changes? (y/n)"
    if ($response -eq 'y' -or $response -eq 'Y') {
        Write-Host "`n💾 Committing changes..." -ForegroundColor Yellow
        git add .
        git commit -m "Fix Netlify deployment configuration - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        Write-Host "✅ Changes committed successfully" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Skipping commit. Make sure to commit changes manually before deploying." -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ No uncommitted changes detected" -ForegroundColor Green
}

# Test build locally
Write-Host "`n🔨 Testing build locally..." -ForegroundColor Yellow
try {
    npm run build
    Write-Host "✅ Local build successful!" -ForegroundColor Green
} catch {
    Write-Host "❌ Local build failed. Please fix build issues before deploying." -ForegroundColor Red
    exit 1
}

# Check if out directory exists
if (Test-Path "out") {
    Write-Host "✅ Build output directory 'out' found" -ForegroundColor Green
    $outFiles = Get-ChildItem "out" -Recurse | Measure-Object
    Write-Host "📁 Build contains $($outFiles.Count) files" -ForegroundColor Gray
} else {
    Write-Host "❌ Build output directory 'out' not found. Build may have failed." -ForegroundColor Red
    exit 1
}

# Push to git
Write-Host "`n📤 Pushing to git..." -ForegroundColor Yellow
try {
    git push origin main
    Write-Host "✅ Successfully pushed to git" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to push to git. Please check your git configuration." -ForegroundColor Red
    exit 1
}

Write-Host "`n🎉 Deployment preparation completed!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host "`n📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Go to your Netlify dashboard" -ForegroundColor White
Write-Host "2. Check that the build is triggered automatically" -ForegroundColor White
Write-Host "3. Monitor the build logs for any errors" -ForegroundColor White
Write-Host "4. Verify the deployment once complete" -ForegroundColor White

Write-Host "`n🔍 If build fails:" -ForegroundColor Yellow
Write-Host "- Check Netlify build logs for specific errors" -ForegroundColor White
Write-Host "- Verify environment variables are set correctly" -ForegroundColor White
Write-Host "- Ensure Node.js version is set to 18.x" -ForegroundColor White
Write-Host "- Check that all dependencies are properly installed" -ForegroundColor White

Write-Host "`n📞 For support, check the NETLIFY_DEPLOYMENT_FIX.md file" -ForegroundColor Cyan
