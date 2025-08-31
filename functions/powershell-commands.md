# PowerShell Commands for Testing Order API

## 🚀 Quick Start

### 1. Run the PowerShell Script
```powershell
.\powershell-test-examples.ps1
```

### 2. Manual Commands

#### Create Order
```powershell
$orderData = @{
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

Invoke-RestMethod -Uri "http://127.0.0.1:5001/your-project-id/us-central1/api/orders" -Method POST -Body $orderData -ContentType "application/json"
```

#### Get All Orders
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:5001/your-project-id/us-central1/api/orders" -Method GET
```

#### Update Order
```powershell
$updateData = @{
    total = 1500.00
    trackingId = "TRK987654321"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://127.0.0.1:5001/your-project-id/us-central1/api/orders/{orderId}" -Method PUT -Body $updateData -ContentType "application/json"
```

## 🔧 Alternative Methods

### Using Invoke-WebRequest (more detailed response)
```powershell
$response = Invoke-WebRequest -Uri "http://127.0.0.1:5001/your-project-id/us-central1/api/orders" -Method POST -Body $orderData -ContentType "application/json"
$response.Content | ConvertFrom-Json
```

### Using curl.exe (if available)
```powershell
curl.exe -X POST "http://127.0.0.1:5001/your-project-id/us-central1/api/orders" -H "Content-Type: application/json" -d $orderData
```

## 📝 Notes

- Replace `your-project-id` with your actual Firebase project ID
- The API runs on port 5001 when using Firebase emulator
- All dates should be in ISO format
- Payment methods must be: "COD", "CASH", or "ANOTHER"
