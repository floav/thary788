Add-Type -AssemblyName System.Drawing

$bmp = New-Object System.Drawing.Bitmap('C:\Users\thoeu\Downloads\New folder (2)\scratch\kp_row1.png')

# Column 1 center is around x=85 (507 / 6 = ~85)
for ($y = 10; $y -lt 70; $y += 3) {
    $line = ""
    for ($x = 65; $x -lt 105; $x += 2) {
        $p = $bmp.GetPixel($x, $y)
        if ($p.R -lt 100) {
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
