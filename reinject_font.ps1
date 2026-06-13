$cssFile = "C:\Users\aleja\.gemini\antigravity-ide\scratch\invitacion-boda\style.css"
$base64File = "C:\Users\aleja\.gemini\antigravity-ide\scratch\invitacion-boda\byliner_script_base64.txt"

$base64String = Get-Content -Path $base64File -Raw
$base64String = $base64String -replace "\s+", ""

$fontFaceRule = "
@font-face {
    font-family: 'Byliner Script';
    src: url('data:font/otf;base64,$base64String') format('opentype');
    font-weight: normal;
    font-style: normal;
}
"

$cssContent = [System.IO.File]::ReadAllText($cssFile)

$cssContent = $cssContent -replace "SECCIÃ“N", "SECCIÓN"
$cssContent = $cssContent -replace "MENÃš", "MENÚ"

$cssContent = $cssContent -replace "(/\* Local Web Fonts declarations \*/)", "`$1`n$fontFaceRule"

$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($cssFile, $cssContent, $utf8NoBom)
