$cssFile = "C:\Users\aleja\.gemini\antigravity-ide\scratch\invitacion-boda\style.css"
$css = [System.IO.File]::ReadAllText($cssFile)

$css = $css -replace "(?s)@font-face\s*\{\s*font-family:\s*'Byliner Script';.*?\}\s*", ""

$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($cssFile, $css, $utf8NoBom)
