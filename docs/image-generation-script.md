# Image Generation Script

The custom generator is `scripts/generate_assets.py`. It targets an OpenAI-compatible image-generation endpoint and never stores credentials in project files.

## Security

The key posted in chat must be revoked. Create a new key and set it locally; never paste it into this repository or chat.

```powershell
$secret = Read-Host "KAKOU_API_KEY" -AsSecureString
$plain = [System.Net.NetworkCredential]::new("", $secret).Password
$env:KAKOU_API_KEY = $plain
$env:KAKOU_IMAGE_ENDPOINT = "https://api.kakou.com/v1/images/generations"
$env:KAKOU_IMAGE_MODEL = "<model name shown by the provider>"
Remove-Variable secret, plain
```

The provider's model name is intentionally not guessed. Set it from the provider dashboard or documentation.

## Validate

Dry-run validates the job file and prints no prompt or credential:

```powershell
python scripts/generate_assets.py --dry-run
```

Generate one asset first:

```powershell
python scripts/generate_assets.py --only future-self-cover
```

After inspecting that output, generate all remaining missing assets:

```powershell
python scripts/generate_assets.py
```

Existing outputs are skipped. Use `--force` only when intentionally replacing a reviewed file.

The script accepts either `data[0].url` or `data[0].b64_json`, writes through a `.part` temporary file, and returns a failing exit code if any job fails.
HTTPS certificate verification remains enabled. When `certifi` is installed, the script uses its CA bundle to support Python installations whose bundled trust store is incomplete.
