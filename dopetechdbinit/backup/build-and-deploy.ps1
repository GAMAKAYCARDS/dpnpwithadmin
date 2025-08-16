# Build and Deploy Script
Write-Host "Building and deploying the application..." -ForegroundColor Green

# Clean previous builds
Write-Host "Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path ".next") { Remove-Item ".next" -Recurse -Force }
if (Test-Path "out") { Remove-Item "out" -Recurse -Force }

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
pnpm install

# Build the application
Write-Host "Building the application..." -ForegroundColor Yellow
pnpm build

# Check if build was successful
if (Test-Path "out") {
    Write-Host "Build successful! Output directory created." -ForegroundColor Green
    
    # Add build output to git
    Write-Host "Adding build output to git..." -ForegroundColor Yellow
    git add .
    
    # Commit build
    Write-Host "Committing build..." -ForegroundColor Yellow
    git commit -m "Build and deploy - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    
    # Push to trigger deployment
    Write-Host "Pushing to trigger deployment..." -ForegroundColor Yellow
    git push origin main
    
    Write-Host "Deployment triggered successfully!" -ForegroundColor Green
} else {
    Write-Host "Build failed! Check the build output above." -ForegroundColor Red
    exit 1
}
