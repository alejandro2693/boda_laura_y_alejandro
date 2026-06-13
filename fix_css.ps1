$cssFile = "C:\Users\aleja\.gemini\antigravity-ide\scratch\invitacion-boda\style.css"
$css = [System.IO.File]::ReadAllText($cssFile)

$regex = "(data:font/otf;base64,)(.*?)('\) format\('opentype'\);)"
$css = [System.Text.RegularExpressions.Regex]::Replace($css, $regex, {
    param($match)
    $cleanBase64 = $match.Groups[2].Value -replace "\s+", ""
    return $match.Groups[1].Value + $cleanBase64 + $match.Groups[3].Value
}, [System.Text.RegularExpressions.RegexOptions]::Singleline)

$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($cssFile, $css, $utf8NoBom)
