Add-Type -AssemblyName System.Drawing

$pfc = New-Object System.Drawing.Text.PrivateFontCollection
$pfc.AddFontFile('C:\Users\thoeu\Downloads\New folder (2)\Krasar Regular.ttf')
$fontFamily = $pfc.Families[0]
$font = New-Object System.Drawing.Font($fontFamily, 32, [System.Drawing.FontStyle]::Regular)

$bmp = New-Object System.Drawing.Bitmap(300, 100)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::White)
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)
$g.DrawString("1 2 3 4 5 0", $font, $brush, 10, 10)
$g.Dispose()

$bmp.Save('C:\Users\thoeu\Downloads\New folder (2)\scratch\krasar_test.png', [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Rendered Krasar numbers test"
$bmp.Dispose()
