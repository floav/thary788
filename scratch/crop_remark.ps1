Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Image]::FromFile('C:\Users\thoeu\.gemini\antigravity\brain\9d44f0f5-7f89-44b5-a946-fa60d85feb8f\.user_uploaded\media_1794193538623_12b47a50.jpg')
$bmp = New-Object System.Drawing.Bitmap(300, 60)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$rectSrc = New-Object System.Drawing.Rectangle(100, 495, 300, 60)
$rectDst = New-Object System.Drawing.Rectangle(0, 0, 300, 60)
$g.DrawImage($src, $rectDst, $rectSrc, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$src.Dispose()

$bmp.Save('C:\Users\thoeu\Downloads\New folder (2)\scratch\remark_crop.png', [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Saved remark_crop.png"
$bmp.Dispose()
