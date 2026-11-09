Add-Type -AssemblyName System.Drawing

$bmp = New-Object System.Drawing.Bitmap('C:\Users\thoeu\Downloads\New folder (2)\scratch\krasar_test.png')

for ($y = 10; $y -lt 60; $y += 2) {
    $line = ""
    for ($x = 10; $x -lt 40; $x++) {
        $p = $bmp.GetPixel($x, $y)
        if ($p.R -lt 128) {
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
