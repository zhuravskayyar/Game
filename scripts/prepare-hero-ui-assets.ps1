# Deterministic slicing of the user-supplied atlases; no generated artwork.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$atlasRoot = Join-Path $PSScriptRoot '../public/assets/sprites/generated/ui/hero-reference'
$partsRoot = Join-Path $atlasRoot 'parts'
New-Item -ItemType Directory -Path $partsRoot -Force | Out-Null

function Save-Part($source, [string]$name, [int]$x, [int]$y, [int]$w, [int]$h, [string]$repeat = '') {
    $piece = $source.Clone([System.Drawing.Rectangle]::new($x, $y, $w, $h), [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $outWidth = if ($repeat.Contains('x')) { $w * 2 } else { $w }
    $outHeight = if ($repeat.Contains('y')) { $h * 2 } else { $h }
    $result = [System.Drawing.Bitmap]::new($outWidth, $outHeight)
    $graphics = [System.Drawing.Graphics]::FromImage($result)
    try {
        $graphics.DrawImageUnscaled($piece, 0, 0)
        # Mirrored pairs have matching boundary pixels at every repeat seam.
        # Original painted pixels retain their size and aspect ratio.
        if ($repeat.Contains('x')) {
            $piece.RotateFlip([System.Drawing.RotateFlipType]::RotateNoneFlipX)
            $graphics.DrawImageUnscaled($piece, $w, 0)
            $piece.RotateFlip([System.Drawing.RotateFlipType]::RotateNoneFlipX)
        }
        if ($repeat.Contains('y')) {
            $piece.RotateFlip([System.Drawing.RotateFlipType]::RotateNoneFlipY)
            $graphics.DrawImageUnscaled($piece, 0, $h)
            if ($repeat.Contains('x')) {
                $piece.RotateFlip([System.Drawing.RotateFlipType]::RotateNoneFlipX)
                $graphics.DrawImageUnscaled($piece, $w, $h)
            }
        }
        $result.Save((Join-Path $partsRoot "$name.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    } finally { $graphics.Dispose(); $result.Dispose(); $piece.Dispose() }
}

$paper = [System.Drawing.Bitmap]::new((Join-Path $atlasRoot 'parchment-panels.png'))
$paperTexture = [System.Drawing.Bitmap]::new((Join-Path $atlasRoot 'parchment-texture.png'))
$labels = [System.Drawing.Bitmap]::new((Join-Path $atlasRoot 'labels-and-tabs.png'))
try {
    Save-Part $paper 'paper-tl' 44 45 96 96
    Save-Part $paper 'paper-tr' 1124 45 96 96
    Save-Part $paper 'paper-bl' 44 1095 96 96
    Save-Part $paper 'paper-br' 1124 1095 96 96
    Save-Part $paper 'paper-top' 425 45 412 96 'x'
    Save-Part $paper 'paper-bottom' 425 1095 412 96 'x'
    Save-Part $paper 'paper-left' 44 421 96 416 'y'
    Save-Part $paper 'paper-right' 1124 421 96 416 'y'
    Save-Part $paperTexture 'paper-fill' 0 0 $paperTexture.Width $paperTexture.Height 'xy'
    Save-Part $labels 'ribbon-left' 24 520 408 320
    # The label atlas center has a decorative diamond at its midpoint; repeat
    # only its plain left half and mirror it so that the diamond stays unique
    # to a future label rather than appearing as a seam on every heading.
    Save-Part $labels 'ribbon-center' 475 520 325 320 'x'
    Save-Part $labels 'ribbon-right' 1238 520 408 320
    Save-Part $labels 'square-tile' 650 88 372 344
} finally { $paper.Dispose(); $paperTexture.Dispose(); $labels.Dispose() }

$fillPng = Join-Path $partsRoot 'paper-fill.png'
$fillWebp = Join-Path $partsRoot 'paper-fill.webp'
& ffmpeg -v error -y -i $fillPng -c:v libwebp -quality 88 -compression_level 6 $fillWebp
if ($LASTEXITCODE -ne 0) { throw 'Failed to encode the mirrored parchment fill to WebP' }
Remove-Item -LiteralPath $fillPng
