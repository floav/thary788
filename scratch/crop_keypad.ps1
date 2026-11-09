Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Image]::FromFile('C:\Users\thoeu\.gemini\antigravity\brain\9d44f0f5-7f89-44b5-a946-fa60d85feb8f\.user_uploaded\media_1794193538623_12b47a50.jpg')

function Crop-Keypad-Row($yStart, $yEnd, $name) {
    $h = $yEnd - $yStart
    $bmp = New-Object System.Drawing.Bitmap($src.Width, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $rectSrc = New-Object System.Drawing.Rectangle(0, $yStart, $src.Width, $h)
    $rectDst = New-Object System.Drawing.Rectangle(0, 0, $src.Width, $h)
    $g.DrawImage($src, $rectDst, $rectSrc, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $bmp.Save("C:\Users\thoeu\Downloads\New folder (2)\scratch\$name", [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Saved $name"
}

Crop-Keypad-Row 540 630 "kp_row1.png"
Crop-Keypad-Row 630 720 "kp_row2.png"
Crop-Keypad-Row 720 810 "kp_row3.png"
Crop-Keypad-Row 810 900 "kp_row4.png"

$src.Dispose()
