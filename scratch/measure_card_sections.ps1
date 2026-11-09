Add-Type -AssemblyName System.Drawing

$bmp = New-Object System.Drawing.Bitmap('C:\Users\thoeu\.gemini\antigravity\brain\9d44f0f5-7f89-44b5-a946-fa60d85feb8f\.user_uploaded\media_1794194794731_53f5f347.jpg')

# Find dashed line 1 (between date and sender, around y=360..400)
# Find dashed line 2 (between receiver and reference, around y=620..660)
for ($y = 350; $y -lt 400; $y++) {
    $p = $bmp.GetPixel(100, $y)
    if ($p.R -lt 230) {
        Write-Host "Dashed line 1 around y=$y (R=$($p.R),G=$($p.G),B=$($p.B))"
        break
    }
}

for ($y = 610; $y -lt 670; $y++) {
    $p = $bmp.GetPixel(100, $y)
    if ($p.R -lt 230) {
        Write-Host "Dashed line 2 around y=$y (R=$($p.R),G=$($p.G),B=$($p.B))"
        break
    }
}

# Avatar sender: Y=400..460
# Avatar receiver: Y=510..570
# Button Show More: Y=760..820

$bmp.Dispose()
