Add-Type -AssemblyName System.Drawing

$bmp = New-Object System.Drawing.Bitmap('C:\Users\thoeu\.gemini\antigravity\brain\9d44f0f5-7f89-44b5-a946-fa60d85feb8f\.user_uploaded\media_1794194794731_53f5f347.jpg')
$W = $bmp.Width
$H = $bmp.Height
Write-Host "Success Image 2: $W x $H"

# 1. Green checkmark circle
$minX=999; $maxX=-1; $minY=999; $maxY=-1
for ($y=0; $y -lt 150; $y++) {
    for ($x=150; $x -lt 350; $x++) {
        $p = $bmp.GetPixel($x, $y)
        # green circle: R < 100, G > 140, B < 120
        if ($p.G -gt 150 -and $p.R -lt 100) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}
Write-Host "Green Checkmark: X=$minX..$maxX (diam=$($maxX-$minX+1)), Y=$minY..$maxY (diam=$($maxY-$minY+1))"

# 2. Text "ជោគជ័យ" (y=120..180)
$minY=999; $maxY=-1
for ($y=120; $y -lt 180; $y++) {
    for ($x=200; $x -lt 320; $x++) {
        $p = $bmp.GetPixel($x, $y)
        # white/light text: R > 240, G > 240
        if ($p.R -gt 245 -and $p.G -gt 245) {
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}
Write-Host "Title 'ជោគជ័យ': Y=$minY..$maxY (h=$($maxY-$minY+1))"

# 3. White card bounds
$cardLeft=999; $cardRight=-1; $cardTop=999; $cardBottom=-1
for ($y=160; $y -lt 950; $y++) {
    for ($x=10; $x -lt 510; $x++) {
        $p = $bmp.GetPixel($x, $y)
        if ($p.R -gt 250 -and $p.G -gt 250 -and $p.B -gt 250) {
            if ($x -lt $cardLeft) { $cardLeft = $x }
            if ($x -gt $cardRight) { $cardRight = $x }
            if ($y -lt $cardTop) { $cardTop = $y }
            if ($y -gt $cardBottom) { $cardBottom = $y }
        }
    }
}
Write-Host "White Ticket Card: X=$cardLeft..$cardRight (w=$($cardRight-$cardLeft+1)), Y=$cardTop..$cardBottom (h=$($cardBottom-$cardTop+1))"

# 4. Button "រួចរាល់" bounds (y=920..1020)
$btnLeft=999; $btnRight=-1; $btnTop=999; $btnBottom=-1
for ($y=930; $y -lt 1020; $y++) {
    for ($x=10; $x -lt 510; $x++) {
        $p = $bmp.GetPixel($x, $y)
        if ($p.R -gt 250 -and $p.G -gt 250 -and $p.B -gt 250) {
            if ($x -lt $btnLeft) { $btnLeft = $x }
            if ($x -gt $btnRight) { $btnRight = $x }
            if ($y -lt $btnTop) { $btnTop = $y }
            if ($y -gt $btnBottom) { $btnBottom = $y }
        }
    }
}
Write-Host "Done Button: X=$btnLeft..$btnRight (w=$($btnRight-$btnLeft+1)), Y=$btnTop..$btnBottom (h=$($btnBottom-$btnTop+1))"

$bmp.Dispose()
