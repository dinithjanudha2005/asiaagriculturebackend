# PowerShell script for testing the Order API
# Run this script in PowerShell: .\powershell-test-examples.ps1

# Configuration
$BASE_URL = "http://127.0.0.1:5001/asiya-agriculture-pos-system/us-central1/api"
$ORDERS_ENDPOINT = "$BASE_URL/orders"

# Test order data
$testOrder = @{
    fullName = "John Smith"
    address = "123 Main Street, Apartment 4B, Downtown District"
    province = "Western Province"
    city = "Colombo"
    phoneNumber01 = "+94 71 234 5678"
    phoneNumber02 = "+94 11 234 5678"
    productName = "Organic Rice - 5kg Pack"
    trackingId = "TRK123456789"
    total = 1250.50
    deliverService = "Express Delivery"
    date = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    paymentMethod = "COD"
} | ConvertTo-Json

Write-Host "🚀 Testing Order API with PowerShell..." -ForegroundColor Green
Write-Host "📍 Endpoint: $ORDERS_ENDPOINT" -ForegroundColor Yellow
Write-Host "=" * 50

# Test 1: Create Order
Write-Host "`n📝 TEST 1: Creating Order" -ForegroundColor Cyan
Write-Host "-" * 30

try {
    $response = Invoke-RestMethod -Uri $ORDERS_ENDPOINT -Method POST -Body $testOrder -ContentType "application/json"
    Write-Host "✅ Order created successfully!" -ForegroundColor Green
    Write-Host "📋 Response: $($response | ConvertTo-Json -Depth 3)" -ForegroundColor White
} catch {
    Write-Host "❌ Failed to create order:" -ForegroundColor Red
    Write-Host "   Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "   Message: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Get All Orders
Write-Host "`n📋 TEST 2: Fetching All Orders" -ForegroundColor Cyan
Write-Host "-" * 30

try {
    $response = Invoke-RestMethod -Uri $ORDERS_ENDPOINT -Method GET
    Write-Host "✅ Retrieved orders successfully!" -ForegroundColor Green
    Write-Host "📋 Count: $($response.count)" -ForegroundColor White
    Write-Host "📋 Orders:" -ForegroundColor White
    $response.data | ForEach-Object { $i = 1 } { 
        Write-Host "   $i. $($_.fullName) - $($_.productName) - `$$($_.total)" -ForegroundColor White
        $i++
    }
} catch {
    Write-Host "❌ Failed to fetch orders:" -ForegroundColor Red
    Write-Host "   Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "   Message: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 All tests completed!" -ForegroundColor Green
