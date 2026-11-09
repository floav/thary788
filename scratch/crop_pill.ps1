Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Image]::FromFile('C:\Users\thoeu\.gemini\antigravity\brain\9d44f0f5-7f89-44b5-a946-fa60d85feb8f\.user_uploaded\media_1794193538623_12b47a50.jpg')
$bmp = New-Object System.Drawing.Bitmap(160, 80)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$rectSrc = New-Object System.Drawing.Rectangle(195, 335, 160, 80)
$rectDst = New-Object System.Drawing.Rectangle(0, 0, 160, 80)
$g.DrawImage($src, $rectDst, $rectSrc, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$src.Dispose()

$bmp.Save('C:\Users\thoeu\Downloads\New folder (2)\scratch\currency_pill_crop.png', [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Saved currency_pill_crop.png"

# Inspect colors inside pill
$pLeft = $bmp.GetPixel(30, 40)
$pMid = $bmp.GetPixel(80, 40)
$pRight = $bmp.GetPixel(130, 40)
Write-Host "Pill (30,40):  R=$($pLeft.R), G=$($pLeft.G), B=$($pLeft.B)"
Write-Host "Pill (80,40):  R=$($pMid.R), G=$($pMid.G), B=$($pMid.B)"
Write-Host "Pill (130,40): R=$($pRight.R), G=$($pRight.G), B=$($pRight.B)"

$bmp.Dispose()
