# Do An PHP

## Hướng dẫn

-  Clone dự án
-  Tải composer: Chạy powershell dưới quyền admin

```
# Run as administrator...
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://php.new/install/windows/8.4'))
```

-  Tải lavarel: `composer global require laravel/installer`

-  Tải package: `composer install`

-  Chạy lệnh: `php --ini` để có đường dẫn file config của php

-  Vào file config và thay đổi:

```
    variables_order = "GPCS"

```

-  Chạy dự án:

```

cd src
npm install
npm run build
composer run dev

```
