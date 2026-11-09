Add-Type -AssemblyName System.Drawing

$bmp = New-Object System.Drawing.Bitmap('C:\Users\thoeu\.gemini\antigravity\brain\9d44f0f5-7f89-44b5-a946-fa60d85feb8f\.user_uploaded\media_1794193538623_12b47a50.jpg')
$W = $bmp.Width
$H = $bmp.Height

Write-Host "Target Image: $W x $H"

# 1. Back button circle (around x=50, y=50)
$minX=999; $maxX=-1; $minY=999; $maxY=-1
for ($y=10; $y -lt 100; $y++) {
    for ($x=10; $x -lt 100; $x++) {
        $p = $bmp.GetPixel($x, $y)
        # circle is light gray (#F0..#F6)
        if ($p.R -lt 250 -or $p.G -lt 250 -or $p.B -lt 250) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}
Write-Host "Back button bounds: X=$minX..$maxX (diam=$($maxX-$minX+1)), Y=$minY..$maxY (diam=$($maxY-$minY+1))"

# 2. Red KHQR circle (around center x, y=100..250)
$minX=999; $maxX=-1; $minY=999; $maxY=-1
for ($y=80; $y -lt 260; $y++) {
    for ($x=150; $x -lt 350; $x++) {
        $p = $bmp.GetPixel($x, $y)
        # red circle: R > 180, G < 60, B < 60
        if ($p.R -gt 180 -and $p.G -lt 70 -and $p.B -lt 70) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}
$redDiamX = $maxX - $minX + 1
$redDiamY = $maxY - $minY + 1
Write-Host "Red KHQR circle bounds: X=$minX..$maxX (diam=$redDiamX), Y=$minY..$maxY (diam=$redDiamY), CenterX=$([int](($minX+$maxX)/2)), CenterY=$([int](($minY+$maxY)/2))"

# 3. Currency Pill (y=320..420)
$minX=999; $maxX=-1; $minY=999; $maxY=-1
for ($y=320; $y -lt 420; $y++) {
    for ($x=180; $x -lt 370; $x++) {
        $p = $bmp.GetPixel($x, $y)
        if ($p.R -gt 160 -and $p.G -lt 150 -and $p.B -lt 60) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}
Write-Host "Currency Pill bounds: X=$minX..$maxX (w=$($maxX-$minX+1)), Y=$minY..$maxY (h=$($maxY-$minY+1))"

# 4. Big Number 0 (left of pill, x=140..205, y=320..420)
$minX=999; $maxX=-1; $minY=999; $maxY=-1
for ($y=320; $y -lt 420; $y++) {
    for ($x=130; $x -lt 210; $x++) {
        $p = $bmp.GetPixel($x, $y)
        # dark pixel: R < 80, G < 80, B < 80
        if ($p.R -lt 80 -and $p.G -lt 80 -and $p.B -lt 80) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}
Write-Host "Number '0' bounds: X=$minX..$maxX (w=$($maxX-$minX+1)), Y=$minY..$maxY (h=$($maxY-$minY+1))"

# 5. Cursor line between 0 and Pill (x=180..210, y=340..410)
$curX = -1; $curY1 = 999; $curY2 = -1
for ($y=340; $y -lt 410; $y++) {
    for ($x=180; $x -lt 210; $x++) {
        $p = $bmp.GetPixel($x, $y)
        # yellow cursor: R > 200, G > 160, B < 100
        if ($p.R -gt 200 -and $p.G -gt 150 -and $p.B -lt 120) {
            $curX = $x
            if ($y -lt $curY1) { $curY1 = $y }
            if ($y -gt $curY2) { $curY2 = $y }
        }
    }
}
Write-Host "Cursor line: X=$curX, Y=$curY1..$curY2 (h=$($curY2-$curY1+1))"

# 6. Source account pill (y=420..500)
$minX=999; $maxX=-1; $minY=999; $maxY=-1
for ($y=420; $y -lt 500; $y++) {
    for ($x=20; $x -lt 490; $x++) {
        $p = $bmp.GetPixel($x, $y)
        if ($p.R -lt 250 -or $p.G -lt 250 -or $p.B -lt 250) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}
Write-Host "Source account box: X=$minX..$maxX (w=$($maxX-$minX+1)), Y=$minY..$maxY (h=$($maxY-$minY+1))"

# 7. Keypad bounds (y=530..880)
# Find dividing lines (subtle gray)
$keypadTop = 550
$keypadBottom = 880
Write-Host "Keypad estimated bounds: Y=$keypadTop..$keypadBottom (h=$($keypadBottom-$keypadTop))"

# 8. Bottom "ទូទាត់" button (y=900..1010)
$minX=999; $maxX=-1; $minY=999; $maxY=-1
for ($y=900; $y -lt 1010; $y++) {
    for ($x=10; $x -lt 500; $x++) {
        $p = $bmp.GetPixel($x, $y)
        if ($p.R -lt 245 -and $p.G -lt 245 -and $p.B -lt 245) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}
$btnColor = $bmp.GetPixel([int](($minX+$maxX)/2), [int](($minY+$maxY)/2))
Write-Host "Pay button bounds: X=$minX..$maxX (w=$($maxX-$minX+1)), Y=$minY..$maxY (h=$($maxY-$minY+1)), Color=R=$($btnColor.R),G=$($btnColor.G),B=$($btnColor.B)"

$bmp.Dispose()
