Add-Type -AssemblyName System.Drawing

$bmp = New-Object System.Drawing.Bitmap('C:\Users\thoeu\Downloads\New folder (2)\scratch\remark_crop.png')

for ($y = 0; $y -lt $bmp.Height; $y += 3) {
    $line = ""
    for ($x = 0; $x -lt $bmp.Width; $x += 3) {
        $p = $bmp.GetPixel($x, $y)
        if ($p.R -lt 240 -or $p.G -lt 240 -or $p.B -lt 240) {
            $line += "#"
        } else {
            $line += " "
        }
    }
    if ($line.Trim().Length -gt 0) {
        Write-Host "$($y): $line"
    }
}
$bmp.Dispose()
