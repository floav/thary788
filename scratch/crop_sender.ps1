Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Image]::FromFile('C:\Users\thoeu\.gemini\antigravity\brain\9d44f0f5-7f89-44b5-a946-fa60d85feb8f\.user_uploaded\media_1794194794731_53f5f347.jpg')
$bmp = New-Object System.Drawing.Bitmap(80, 80)
$g = [System.Drawing.Graphics]::FromImage($bmp)
# Sender circle in Image 2 is around x=40..120, y=380..460
$rectSrc = New-Object System.Drawing.Rectangle(40, 385, 80, 80)
$rectDst = New-Object System.Drawing.Rectangle(0, 0, 80, 80)
$g.DrawImage($src, $rectDst, $rectSrc, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$src.Dispose()

$bmp.Save('C:\Users\thoeu\Downloads\New folder (2)\scratch\sender_circle_crop.png', [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Saved sender_circle_crop.png"

# Inspect colors
for ($y = 20; $y -lt 60; $y += 5) {
    for ($x = 20; $x -lt 60; $x += 5) {
        $p = $bmp.GetPixel($x, $y)
        # Check dark pixels (star)
        if ($p.R -lt 150) {
            Write-Host "Star pixel at ($x,$y): R=$($p.R), G=$($p.G), B=$($p.B)"
        }
    }
}
$bmp.Dispose()
