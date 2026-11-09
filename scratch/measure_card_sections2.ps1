Add-Type -AssemblyName System.Drawing

$bmp = New-Object System.Drawing.Bitmap('C:\Users\thoeu\.gemini\antigravity\brain\9d44f0f5-7f89-44b5-a946-fa60d85feb8f\.user_uploaded\media_1794194794731_53f5f347.jpg')

for ($y = 600; $y -lt 720; $y++) {
    $p = $bmp.GetPixel(100, $y)
    if ($p.R -lt 235 -and $p.G -lt 235 -and $p.B -lt 235) {
        Write-Host "Dashed line 2 around y=$y (R=$($p.R),G=$($p.G),B=$($p.B))"
        break
    }
}

# Find "បង្ហាញបន្ថែម" button (around y=780..850)
for ($y = 750; $y -lt 850; $y++) {
    $p = $bmp.GetPixel(260, $y)
    # gray button background #F0..#F5
    if ($p.R -lt 250 -and $p.R -gt 230) {
        Write-Host "Show more button around y=$y"
        break
    }
}

$bmp.Dispose()
