try {
    $response = Invoke-WebRequest -Uri 'https://foodstagram-1hbq.onrender.com/api/auth/login' -Method POST -TimeoutSec 15 -UseBasicParsing -ContentType "application/json" -Body '{}'
    Write-Host "Status Code: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
