$cssFile = "C:\Users\aleja\.gemini\antigravity-ide\scratch\invitacion-boda\style.css"
$base64File = "C:\Users\aleja\.gemini\antigravity-ide\scratch\invitacion-boda\byliner_script_base64.txt"

$base64String = Get-Content -Path $base64File -Raw

$fontFaceRule = "@font-face {
    font-family: 'Byliner Script';
    src: url('data:font/otf;base64,$base64String') format('opentype');
    font-weight: normal;
    font-style: normal;
}
"

$cssContent = Get-Content -Path $cssFile -Raw

# Insert the font face rule before the first @font-face
$cssContent = $cssContent -replace "(/\* Local Web Fonts declarations \*/)", "`$1`n$fontFaceRule"

# Replace the font-family in .section-title
$cssContent = $cssContent -replace "\.section-title\s*\{[^}]*font-family:\s*var\(--font-sans\);\s*/\*\s*Questrial font\s*\*/", ".section-title {`n    font-family: 'Byliner Script', cursive;"

# Also remove uppercase and letter-spacing for this cursive font
$cssContent = $cssContent -replace "text-transform:\s*uppercase;", ""
$cssContent = $cssContent -replace "letter-spacing:\s*3px;", ""

# And maybe make the font size a bit bigger since script fonts are usually smaller
$cssContent = $cssContent -replace "(?s)(\.section-title\s*\{[^}]*?)font-size:\s*2rem;", "`$1font-size: 3.5rem;"

Set-Content -Path $cssFile -Value $cssContent -Encoding UTF8
