$files = Get-ChildItem -Recurse -Path src -Include *.ts,*.tsx,*.mdx,*.css
foreach ($f in $files) {
  $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
  $text = [System.Text.Encoding]::UTF8.GetString($bytes)
  $orig = $text
  # Mojibake repair: characters that came from UTF-8 misread as Windows-1252 then re-encoded as UTF-8.
  $text = $text -replace ([regex]::Escape("$([char]0x00e2)$([char]0x20ac)$([char]0x201d)")), [char]0x2014  # em-dash
  $text = $text -replace ([regex]::Escape("$([char]0x00e2)$([char]0x20ac)$([char]0x2122)")), [char]0x2019  # right single quote
  $text = $text -replace ([regex]::Escape("$([char]0x00e2)$([char]0x20ac)$([char]0x0153)")), [char]0x201c  # left double quote
  $text = $text -replace ([regex]::Escape("$([char]0x00e2)$([char]0x20ac) ")), "$([char]0x201d) "          # right double quote followed by space
  $text = $text -replace ([regex]::Escape("$([char]0x00e2)$([char]0x20ac)$([char]0x00a6)")), [char]0x2026  # ellipsis
  $text = $text -replace ([regex]::Escape("$([char]0x00e2)$([char]0x20ac)$([char]0x201c)")), [char]0x2013  # en-dash
  if ($text -ne $orig) {
    [System.IO.File]::WriteAllText($f.FullName, $text, (New-Object System.Text.UTF8Encoding $false))
    Write-Host $f.FullName
  }
}
