Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Image]::FromFile('C:\Users\thoeu\.gemini\antigravity\brain\9d44f0f5-7f89-44b5-a946-fa60d85feb8f\.user_uploaded\media_1794193538623_12b47a50.jpg')
$bmp = New-Object System.Drawing.Bitmap($src.Width, 80)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$rectSrc = New-Object System.Drawing.Rectangle(0, 225, $src.Width, 80)
$rectDst = New-Object System.Drawing.Rectangle(0, 0, $src.Width, 80)
$g.DrawImage($src, $rectDst, $rectSrc, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$src.Dispose()

$bmp.Save('C:\Users\thoeu\Downloads\New folder (2)\scratch\name_crop.png', [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Saved name_crop.png"
$bmp.Dispose()
