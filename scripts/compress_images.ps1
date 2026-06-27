# Image compression script for fukui-firefly-guardian project.
# Resizes images over 1MB to a max width of 1600px and 75% quality.

Add-Type -AssemblyName System.Drawing

$files = Get-ChildItem -Path "public/images" -Recurse | Where-Object { $_.Extension -match "jpe?g|png" -and $_.Length -gt 1MB }

if ($files.Count -eq 0) {
    Write-Host "No images over 1MB found."
    exit
}

foreach ($file in $files) {
    $path = $file.FullName
    $img = [System.Drawing.Image]::FromFile($path)
    $width = $img.Width
    $height = $img.Height

    if ($width -gt 1600) {
        $ratio = 1600 / $width
        $newWidth = 1600
        $newHeight = [int]($height * $ratio)
    } else {
        $newWidth = $width
        $newHeight = $height
    }

    $newImg = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
    $g = [System.Drawing.Graphics]::FromImage($newImg)
    
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($img, 0, 0, $newWidth, $newHeight)
    
    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageDecoders() | Where-Object { $_.FormatID -eq [System.Drawing.Imaging.ImageFormat]::Jpeg.Guid }
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 75)

    $tempPath = $path + ".tmp"
    $newImg.Save($tempPath, $codec, $encoderParams)

    $g.Dispose()
    $newImg.Dispose()
    $img.Dispose()

    Remove-Item $path -Force
    Rename-Item -Path $tempPath -NewName $file.Name -Force
    
    $newSize = (Get-Item $path).Length / 1KB
    Write-Host "Compressed: $path to $newSize KB"
}
