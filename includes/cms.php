<?php
declare(strict_types=1);

function cms_root(): string { return dirname(__DIR__); }
function cms_storage(): string { return cms_root() . DIRECTORY_SEPARATOR . 'storage'; }
function cms_site_file(): string { return cms_storage() . DIRECTORY_SEPARATOR . 'site.json'; }
function cms_admin_file(): string { return cms_storage() . DIRECTORY_SEPARATOR . 'admin.json'; }

function cms_default_site(): array { return require cms_root() . '/config/default.php'; }

function cms_site(): array {
    $defaults = cms_default_site();
    $path = cms_site_file();
    if (!is_file($path)) {
        cms_save_site($defaults);
        return $defaults;
    }
    $stored = json_decode((string)file_get_contents($path), true);
    if (!is_array($stored)) return $defaults;
    return cms_merge($defaults, $stored);
}

function cms_merge(array $base, array $stored): array {
    foreach ($stored as $key => $value) {
        if (is_array($value) && isset($base[$key]) && is_array($base[$key]) && !array_is_list($value) && !array_is_list($base[$key])) {
            $base[$key] = cms_merge($base[$key], $value);
        } else {
            $base[$key] = $value;
        }
    }
    return $base;
}

function cms_save_site(array $site): void {
    if (!is_dir(cms_storage()) && !mkdir(cms_storage(), 0750, true) && !is_dir(cms_storage())) {
        throw new RuntimeException('تعذّر إنشاء مجلد التخزين.');
    }
    $json = json_encode($site, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if ($json === false) throw new RuntimeException('تعذّر تحويل إعدادات الموقع إلى صيغة JSON.');
    $target = cms_site_file();
    $temp = $target . '.' . bin2hex(random_bytes(5)) . '.tmp';
    if (file_put_contents($temp, $json, LOCK_EX) === false || !rename($temp, $target)) {
        @unlink($temp);
        throw new RuntimeException('تعذّر حفظ إعدادات الموقع. تحقق من صلاحيات مجلد التخزين.');
    }
    @chmod($target, 0640);
}

function cms_h(?string $value): string { return htmlspecialchars((string)$value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function cms_csrf(): string {
    if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
    return (string)$_SESSION['csrf'];
}
function cms_verify_csrf(): void {
    $sent = (string)($_POST['_csrf'] ?? '');
    if ($sent === '' || !hash_equals(cms_csrf(), $sent)) {
        http_response_code(419);
        exit('انتهت صلاحية جلستك. ارجع إلى لوحة التحكم وحاول مرة أخرى.');
    }
}
function cms_admin_exists(): bool { return is_file(cms_admin_file()); }
function cms_admin_record(): array {
    $data = json_decode((string)@file_get_contents(cms_admin_file()), true);
    return is_array($data) ? $data : [];
}
function cms_is_authenticated(): bool { return isset($_SESSION['admin_id']) && is_string($_SESSION['admin_id']); }
function cms_redirect(string $path): never { header('Location: ' . $path, true, 303); exit; }
function cms_flash(string $message, string $type = 'success'): void { $_SESSION['flash'] = ['message'=>$message,'type'=>$type]; }
function cms_take_flash(): ?array { $flash = $_SESSION['flash'] ?? null; unset($_SESSION['flash']); return is_array($flash) ? $flash : null; }
function cms_path(): string {
    $uriPath = parse_url((string)($_SERVER['REQUEST_URI'] ?? '/'), PHP_URL_PATH);
    $path = '/' . trim(is_string($uriPath) ? $uriPath : '/', '/');
    return $path === '//' ? '/' : $path;
}
function cms_is_local_request(): bool {
    $addr = (string)($_SERVER['REMOTE_ADDR'] ?? '');
    if (!in_array($addr, ['127.0.0.1','::1'], true)) return false;
    // A reverse proxy bound to loopback makes every visitor look "local", and it
    // can inject X-Forwarded-For / X-Real-IP. Only trust those headers when the
    // proxy address is explicitly allowlisted via AJD_TRUSTED_PROXIES, and then
    // treat the request as local only if the original client is also loopback.
    $forwarded = trim((string)($_SERVER['HTTP_X_FORWARDED_FOR'] ?? ''));
    if ($forwarded === '') $forwarded = trim((string)($_SERVER['HTTP_X_REAL_IP'] ?? ''));
    if ($forwarded === '') return true;
    $trusted = array_filter(array_map('trim', explode(',', (string)(getenv('AJD_TRUSTED_PROXIES') ?: ''))));
    if (!in_array($addr, $trusted, true)) return false;
    $client = trim(explode(',', $forwarded)[0]);
    return in_array($client, ['127.0.0.1','::1'], true);
}

function cms_upload_media(array $file): array {
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) throw new RuntimeException('اختر ملفاً لرفعه.');
    if (($file['size'] ?? 0) > 8 * 1024 * 1024) throw new RuntimeException('يجب ألا يتجاوز حجم كل صورة 8 ميجابايت.');
    $tmp = (string)($file['tmp_name'] ?? '');
    if ($tmp === '' || !is_uploaded_file($tmp)) throw new RuntimeException('تعذّر التحقق من الملف المرفوع.');
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($tmp);
    $allowed = ['image/jpeg'=>'jpg','image/png'=>'png','image/webp'=>'webp','image/gif'=>'gif'];
    if (!isset($allowed[$mime])) throw new RuntimeException('ارفع صورة بصيغة JPG أو PNG أو WEBP أو GIF.');
    $info = @getimagesize($tmp);
    if (!$info || $info[0] > 9000 || $info[1] > 9000) throw new RuntimeException('أبعاد الصورة غير صالحة أو كبيرة جداً.');
    $folder = cms_storage() . DIRECTORY_SEPARATOR . 'uploads';
    if (!is_dir($folder) && !mkdir($folder, 0750, true) && !is_dir($folder)) throw new RuntimeException('تعذّر إنشاء مجلد الوسائط.');
    $name = gmdate('Ymd') . '-' . bin2hex(random_bytes(12)) . '.' . $allowed[$mime];
    if (!move_uploaded_file($tmp, $folder . DIRECTORY_SEPARATOR . $name)) throw new RuntimeException('تعذّر تخزين الصورة. تحقق من صلاحيات المجلد.');
    @chmod($folder . DIRECTORY_SEPARATOR . $name, 0640);
    return ['id'=>$name,'name'=>basename((string)($file['name'] ?? $name)),'path'=>'/media/' . $name,'mime'=>$mime,'size'=>(int)$file['size'],'uploaded'=>gmdate('c')];
}

function cms_media_path(string $name): ?string {
    if (!preg_match('/^[0-9]{8}-[a-f0-9]{24}\.(?:jpg|png|webp|gif)$/', $name)) return null;
    $path = cms_storage() . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . $name;
    return is_file($path) ? $path : null;
}
