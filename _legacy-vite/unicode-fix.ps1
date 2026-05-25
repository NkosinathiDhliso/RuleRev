$files = Get-ChildItem -Recurse -Path src -Include *.ts,*.tsx,*.mdx,*.css
foreach ($f in $files) {
  $c = Get-Content -Raw -LiteralPath $f.FullName
  $orig = $c
  $c = $c -replace '\\u2019',[char]0x2019
  $c = $c -replace '\\u2014',[char]0x2014
  $c = $c -replace '\\u201c',[char]0x201c
  $c = $c -replace '\\u201d',[char]0x201d
  $c = $c -replace '\\u2026',[char]0x2026
  $c = $c -replace '\\u00a0',[char]0x00a0
  if ($c -ne $orig) {
    [System.IO.File]::WriteAllText($f.FullName, $c, (New-Object System.Text.UTF8Encoding $false))
    Write-Host $f.FullName
  }
}
