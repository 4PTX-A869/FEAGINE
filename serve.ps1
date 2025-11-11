param(
    [int]$Port = 8000
)

$base = Get-Location
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Preview URL: http://localhost:$Port/"

while ($true) {
    $context = $listener.GetContext()
    $req = $context.Request
    $res = $context.Response

    try {
        $relativePath = $req.Url.AbsolutePath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($relativePath)) { $relativePath = 'index.html' }

        $path = Join-Path $base.Path $relativePath
        if (Test-Path $path -PathType Container) { $path = Join-Path $path 'index.html' }

        if (-not (Test-Path $path -PathType Leaf)) {
            $res.StatusCode = 404
            $bytes = [System.Text.Encoding]::UTF8.GetBytes('Not found')
            $res.OutputStream.Write($bytes,0,$bytes.Length)
            continue
        }

        $ext = [System.IO.Path]::GetExtension($path).ToLower()
        $mime = @{ 
            '.html'='text/html'; '.htm'='text/html'; '.css'='text/css';
            '.js'='application/javascript'; '.json'='application/json';
            '.png'='image/png'; '.jpg'='image/jpeg'; '.jpeg'='image/jpeg';
            '.gif'='image/gif'; '.svg'='image/svg+xml'; '.mp4'='video/mp4';
            '.txt'='text/plain'; '.xml'='application/xml'; '.ico'='image/x-icon'
        }
        if ($mime.ContainsKey($ext)) { $res.ContentType = $mime[$ext] } else { $res.ContentType = 'application/octet-stream' }

        # 支持 Range/HEAD，并使用缓冲流式响应
        $res.AddHeader('Accept-Ranges','bytes')
        $method = $req.HttpMethod

        $fs = [System.IO.File]::OpenRead($path)
        try {
            $totalLength = $fs.Length
            $start = 0
            $end = $totalLength - 1
            $rangeHeader = $req.Headers['Range']

            if ($rangeHeader -and $rangeHeader -match '^bytes=(\d*)-(\d*)$') {
                $startStr = $Matches[1]
                $endStr = $Matches[2]
                if ([string]::IsNullOrEmpty($startStr)) { $start = 0 } else { $start = [int64]$startStr }
                if ([string]::IsNullOrEmpty($endStr)) { $end = $totalLength - 1 } else { $end = [int64]$endStr }
                if ($end -ge $totalLength) { $end = $totalLength - 1 }
                if ($start -ge $totalLength) {
                    $res.StatusCode = 416
                    $res.AddHeader('Content-Range', "bytes */$totalLength")
                    continue
                }
                $res.StatusCode = 206
                $res.AddHeader('Content-Range', "bytes $start-$end/$totalLength")
            } else {
                $res.StatusCode = 200
            }

            $lengthToSend = ($end - $start + 1)
            $res.ContentLength64 = $lengthToSend

            if ($method -eq 'HEAD') { continue }

            $buffer = New-Object byte[] 65536
            [void]$fs.Seek($start, [System.IO.SeekOrigin]::Begin)
            while ($lengthToSend -gt 0) {
                $readNow = [Math]::Min($buffer.Length, $lengthToSend)
                $read = $fs.Read($buffer, 0, $readNow)
                if ($read -le 0) { break }
                try { $res.OutputStream.Write($buffer, 0, $read) } catch { break }
                $lengthToSend -= $read
            }
        } finally {
            if ($fs) { $fs.Dispose() }
        }
    } catch {
        Write-Warning $_
    } finally {
        try { $res.Close() } catch {}
    }
}