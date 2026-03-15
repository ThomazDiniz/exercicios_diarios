# Converte todos os .mp4 em videos/ e Dicas/ para .webm (VP9 + Opus).
# Requer FFmpeg no PATH: https://ffmpeg.org/
$folders = @("videos", "Dicas")
$totalConverted = 0
foreach ($folderName in $folders) {
    $dir = Join-Path $PSScriptRoot $folderName
    if (-not (Test-Path $dir)) { continue }
    $mp4s = Get-ChildItem -Path $dir -Filter "*.mp4"
    foreach ($mp4 in $mp4s) {
        $base = [System.IO.Path]::GetFileNameWithoutExtension($mp4.Name)
        $webm = Join-Path $dir "$base.webm"
        Write-Host "Convertendo ($folderName): $($mp4.Name) -> $base.webm"
        & ffmpeg -i $mp4.FullName -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus -y $webm 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  OK: $base.webm"
            $totalConverted++
        } else {
            Write-Host "  Erro ao converter $($mp4.Name). Verifique se o FFmpeg esta instalado."
        }
    }
}
Write-Host "Concluido. $totalConverted video(s) convertido(s)."
