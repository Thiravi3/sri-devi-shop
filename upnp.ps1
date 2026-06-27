$nat = New-Object -ComObject HNetCfg.NATUPnP
$mapping = $nat.StaticPortMappingCollection
if ($mapping -ne $null) {
    try {
        $mapping.Add(80, "TCP", 3000, "192.168.1.72", $true, "Nextjs")
        Write-Host "UPnP Success"
    } catch {
        Write-Host "UPnP Failed"
    }
} else {
    Write-Host "UPnP Unavailable"
}
$ip = (Invoke-WebRequest -Uri "https://api.ipify.org").Content
Write-Host "Public IP: $ip"
