param($todoFile)
$rebaseTodo = "reword 0d24ea1 Initial commit: TeamSpirit attendance management system`npick fd45cc5`npick 53d3760`npick ae9fcf9"
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($todoFile, $rebaseTodo, $utf8NoBom)
