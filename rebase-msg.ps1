param($todoFile)
$rebaseTodo = @"
reword 0d24ea1 Initial commit: TeamSpirit attendance management system
pick fd45cc5
pick 53d3760
pick 8f102c6
pick ab61e15
pick df1deed
pick 00d9cc7
pick ae9fcf9
"@
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($todoFile, $rebaseTodo, $utf8NoBom)
