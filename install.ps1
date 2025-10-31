# PowerShell Installation Script for AI Resume Analyzer
# Run this script with: .\install.ps1

Write-Host "🚀 AI Resume Analyzer - Installation Script" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

# Check Node.js installation
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green

# Check for .env.local file
Write-Host "`n🔐 Checking environment variables..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    Write-Host "✅ .env.local file found" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env.local not found. Creating from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env.local"
    Write-Host "✅ Created .env.local file" -ForegroundColor Green
    Write-Host "`n⚠️  IMPORTANT: Please edit .env.local and add your configuration!" -ForegroundColor Yellow
    Write-Host "   See SETUP.md for detailed instructions`n" -ForegroundColor Yellow
}

# Generate Prisma Client
Write-Host "`n🗄️  Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Prisma client generated" -ForegroundColor Green

# Ask if user wants to push database schema
Write-Host "`n💾 Do you want to push the database schema now? (y/n)" -ForegroundColor Yellow
Write-Host "   (Only if you've configured database in .env.local)" -ForegroundColor Gray
$pushDb = Read-Host

if ($pushDb -eq "y" -or $pushDb -eq "Y") {
    Write-Host "`nPushing database schema..." -ForegroundColor Yellow
    npx prisma db push
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database schema pushed successfully" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Database push failed. Make sure your database is configured in .env.local" -ForegroundColor Yellow
    }
}

# Installation complete
Write-Host "`n✨ Installation Complete! ✨`n" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env.local with your configuration (see SETUP.md)" -ForegroundColor White
Write-Host "2. Run 'npm run dev' to start the development server" -ForegroundColor White
Write-Host "3. Visit http://localhost:3000`n" -ForegroundColor White

Write-Host "📚 For detailed setup instructions, see SETUP.md" -ForegroundColor Gray
Write-Host "❓ Need help? Check README.md`n" -ForegroundColor Gray
