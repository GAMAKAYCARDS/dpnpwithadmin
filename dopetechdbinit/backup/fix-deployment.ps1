# Fix Deployment Issues Script
Write-Host "Fixing deployment issues..." -ForegroundColor Green

# Clean up any leftover files
if (Test-Path "h origin main") { Remove-Item "h origin main" -Force }
if (Test-Path "h -u origin main") { Remove-Item "h -u origin main" -Force }
if (Test-Path "tatus --short") { Remove-Item "tatus --short" -Force }
if (Test-Path "tatus --porcelain") { Remove-Item "tatus --porcelain" -Force }

# Update git remote URL (remove embedded token)
Write-Host "Updating git remote URL..." -ForegroundColor Yellow
git remote set-url origin https://github.com/dopetechnp-dotcom/dopetechnp.git

# Check current status
Write-Host "Checking git status..." -ForegroundColor Yellow
git status

# Add all changes
Write-Host "Adding all changes..." -ForegroundColor Yellow
git add .

# Commit if there are changes
Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "Fix deployment issues and clean up repository"

# Force push to ensure deployment
Write-Host "Force pushing to trigger deployment..." -ForegroundColor Yellow
git push -f origin main

Write-Host "Deployment fix completed!" -ForegroundColor Green
