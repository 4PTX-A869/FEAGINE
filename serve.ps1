param(
    [int]$Port = 8000
)

$base = Get-Location
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Preview URL: http://localhost:$Port/"

try {
    while ($true) {
        $context = $listener.GetContext()
        $req = $context.Request
        $res = $context.Response

        $relativePath = $req.Url.AbsolutePath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($relativePath)) { $relativePath = 'index.html' }

        $path = Join-Path $base.Path $relativePath
        if (Test-Path $path -PathType Container) { $path = Join-Path $path 'index.html' }

        if (-not (Test-Path $path -PathType Leaf)) {
            $res.StatusCode = 404
            $bytes = [System.Text.Encoding]::UTF8.GetBytes('Not found')
            $res.OutputStream.Write($bytes,0,$bytes.Length)
            $res.Close()
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

        $bytes = [System.IO.File]::ReadAllBytes($path)
        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes,0,$bytes.Length)
        $res.Close()
    }
}
finally {
    $listener.Stop()
}