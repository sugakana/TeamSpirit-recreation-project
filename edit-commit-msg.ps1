$msgFile = $args[0]
$content = Get-Content $msgFile -Raw
if ($content -match "TeamSpirit") {
    "Initial commit: TeamSpirit attendance management system" | Out-File -FilePath $msgFile -Encoding utf8 -NoNewline
} else {
    $content | Out-File -FilePath $msgFile -Encoding utf8 -NoNewline
}
