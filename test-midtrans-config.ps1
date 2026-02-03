# Test Midtrans Configuration
# This script verifies that environment variables are correctly loaded

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Midtrans Configuration Test" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Load .env file
$envPath = ".\.env"
if (Test-Path $envPath) {
    Write-Host "✓ Found .env file" -ForegroundColor Green
    $envContent = Get-Content $envPath
    
    $serverKey = $envContent | Select-String -Pattern "MIDTRANS_SERVER_KEY" | Select-Object -First 1
    $clientKey = $envContent | Select-String -Pattern "^MIDTRANS_CLIENT_KEY" | Select-Object -First 1
    $merchantId = $envContent | Select-String -Pattern "MIDTRANS_MERCHANT_ID" | Select-Object -First 1
    $isProduction = $envContent | Select-String -Pattern "^MIDTRANS_IS_PRODUCTION" | Select-Object -First 1
    
    if ($serverKey) { Write-Host "✓ MIDTRANS_SERVER_KEY is set" -ForegroundColor Green } else { Write-Host "✗ MIDTRANS_SERVER_KEY is missing" -ForegroundColor Red }
    if ($clientKey) { Write-Host "✓ MIDTRANS_CLIENT_KEY is set" -ForegroundColor Green } else { Write-Host "✗ MIDTRANS_CLIENT_KEY is missing" -ForegroundColor Red }
    if ($merchantId) { Write-Host "✓ MIDTRANS_MERCHANT_ID is set" -ForegroundColor Green } else { Write-Host "✗ MIDTRANS_MERCHANT_ID is missing" -ForegroundColor Red }
    if ($isProduction) { Write-Host "✓ MIDTRANS_IS_PRODUCTION is set" -ForegroundColor Green } else { Write-Host "✗ MIDTRANS_IS_PRODUCTION is missing" -ForegroundColor Red }
} else {
    Write-Host "✗ .env file not found" -ForegroundColor Red
}

Write-Host ""

# Load .env.local file
$envLocalPath = ".\.env.local"
if (Test-Path $envLocalPath) {
    Write-Host "✓ Found .env.local file" -ForegroundColor Green
    $envLocalContent = Get-Content $envLocalPath
    
    $publicClientKey = $envLocalContent | Select-String -Pattern "NEXT_PUBLIC_MIDTRANS_CLIENT_KEY" | Select-Object -First 1
    $publicIsProduction = $envLocalContent | Select-String -Pattern "NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION" | Select-Object -First 1
    $publicAppUrl = $envLocalContent | Select-String -Pattern "NEXT_PUBLIC_APP_URL" | Select-Object -First 1
    
    if ($publicClientKey) { Write-Host "✓ NEXT_PUBLIC_MIDTRANS_CLIENT_KEY is set" -ForegroundColor Green } else { Write-Host "✗ NEXT_PUBLIC_MIDTRANS_CLIENT_KEY is missing" -ForegroundColor Red }
    if ($publicIsProduction) { Write-Host "✓ NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION is set" -ForegroundColor Green } else { Write-Host "✗ NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION is missing" -ForegroundColor Red }
    if ($publicAppUrl) { Write-Host "✓ NEXT_PUBLIC_APP_URL is set" -ForegroundColor Green } else { Write-Host "✗ NEXT_PUBLIC_APP_URL is missing" -ForegroundColor Red }
} else {
    Write-Host "✗ .env.local file not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Configuration Summary" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

if ($isProduction -match "false") {
    Write-Host "Environment: SANDBOX (Testing Mode)" -ForegroundColor Yellow
    Write-Host "This is the recommended mode for development and testing." -ForegroundColor Yellow
} else {
    Write-Host "Environment: PRODUCTION" -ForegroundColor Red
    Write-Host "WARNING: Real transactions will be processed!" -ForegroundColor Red
}

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Run 'npm run dev' to start the development server" -ForegroundColor White
Write-Host "2. Open http://localhost:3000/booking in your browser" -ForegroundColor White
Write-Host "3. Create a test booking to verify payment flow" -ForegroundColor White
Write-Host "4. See MIDTRANS_SETUP.md for detailed testing instructions" -ForegroundColor White
Write-Host ""
