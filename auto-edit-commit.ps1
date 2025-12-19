$msgFile = $args[0]
$content = Get-Content $msgFile -Raw -ErrorAction SilentlyContinue
if ($content -match "TeamSpirit.*[^\x00-\x7F]") {
    "Initial commit: TeamSpirit attendance management system" | Out-File -FilePath $msgFile -Encoding utf8 -NoNewline
} else {
    if ($content) {
        $content | Out-File -FilePath $msgFile -Encoding utf8 -NoNewline
    }
}
