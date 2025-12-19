$commit = $env:GIT_COMMIT
if ($commit -eq "0d24ea15d304e377f6ecb080b67186e2e86475d1") {
    Write-Output "Initial commit: TeamSpirit attendance management system"
} else {
    $input | ForEach-Object { Write-Output $_ }
}
