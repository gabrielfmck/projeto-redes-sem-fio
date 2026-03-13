param(
  [string]$OutputPath = "demo-cert.pfx",
  [string]$Password = "tcd-redes-demo",
  [string[]]$DnsNames = @("localhost"),
  [string[]]$IpAddresses = @("127.0.0.1")
)

$rsa = [System.Security.Cryptography.RSA]::Create(2048)
$request = [System.Security.Cryptography.X509Certificates.CertificateRequest]::new(
  "CN=$($DnsNames[0])",
  $rsa,
  [System.Security.Cryptography.HashAlgorithmName]::SHA256,
  [System.Security.Cryptography.RSASignaturePadding]::Pkcs1
)

$sanBuilder = [System.Security.Cryptography.X509Certificates.SubjectAlternativeNameBuilder]::new()

foreach ($dnsName in $DnsNames) {
  $sanBuilder.AddDnsName($dnsName)
}

foreach ($ipAddress in $IpAddresses) {
  $sanBuilder.AddIpAddress([System.Net.IPAddress]::Parse($ipAddress))
}

$request.CertificateExtensions.Add($sanBuilder.Build())
$request.CertificateExtensions.Add(
  [System.Security.Cryptography.X509Certificates.X509BasicConstraintsExtension]::new($false, $false, 0, $true)
)
$request.CertificateExtensions.Add(
  [System.Security.Cryptography.X509Certificates.X509KeyUsageExtension]::new(
    [System.Security.Cryptography.X509Certificates.X509KeyUsageFlags]::DigitalSignature -bor
    [System.Security.Cryptography.X509Certificates.X509KeyUsageFlags]::KeyEncipherment,
    $true
  )
)
$request.CertificateExtensions.Add(
  [System.Security.Cryptography.X509Certificates.X509SubjectKeyIdentifierExtension]::new($request.PublicKey, $false)
)

$certificate = $request.CreateSelfSigned([datetimeoffset]::Now.AddDays(-1), [datetimeoffset]::Now.AddYears(1))
$bytes = $certificate.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Pfx, $Password)

[System.IO.File]::WriteAllBytes((Resolve-Path ".").Path + "\" + $OutputPath, $bytes)

Write-Host "Certificado criado em $OutputPath"
Write-Host "Senha do PFX: $Password"
