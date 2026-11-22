<?php
declare(strict_types=1);

/**
 * AJ District front controller.
 *
 * Routes:
 *   /            /terms      /receipt   → public site (templates/public.html + CMS config)
 *   /media/{id}                          → uploaded media stream
 *   /admin/setup|login|logout            → authentication (includes/auth.php)
 *   /admin/{page}                        → dashboard (includes/admin-view.php)
 *   POST /admin/{page}                   → content actions (includes/actions.php)
 */

require __DIR__ . '/includes/cms.php';
require __DIR__ . '/includes/actions.php';
require __DIR__ . '/includes/auth.php';
require __DIR__ . '/includes/admin-view.php';

ini_set('session.use_strict_mode', '1');
ini_set('session.cookie_httponly', '1');
ini_set('session.cookie_samesite', 'Strict');
session_set_cookie_params(['httponly' => true, 'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off', 'samesite' => 'Strict', 'path' => '/']);
session_start();
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('X-Frame-Options: SAMEORIGIN');

$path = cms_path();
if ($path === '/index.php') cms_redirect('/');

// ---------------------------------------------------------------- uploaded media
if (preg_match('~^/media/([^/]+)$~', $path, $match)) {
    $file = cms_media_path($match[1]);
    if (!$file) { http_response_code(404); exit('Not found'); }
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file) ?: 'application/octet-stream';
    header('Content-Type: ' . $mime);
    header('Content-Length: ' . (string)filesize($file));
    header('Cache-Control: public, max-age=2592000, immutable');
    readfile($file);
    exit;
}

// ---------------------------------------------------------------- public site
if (!str_starts_with($path, '/admin')) {
    if (!in_array($path, ['/', '/terms', '/receipt'], true)) { http_response_code(404); exit('Page not found'); }
    $publicRoute = $path === '/terms' ? 'terms' : ($path === '/receipt' ? 'receipt' : '');
    $html = cms_public_template();
    $html = str_replace(
        ['__AJ_ROUTE__', '__AJ_CONFIG__'],
        [json_encode($publicRoute), cms_site_json()],
        $html
    );
    header('Content-Type: text/html; charset=utf-8');
    echo $html;
    exit;
}

// ---------------------------------------------------------------- admin routing
$route = trim(substr($path, strlen('/admin')), '/');
if ($route === '') $route = 'dashboard';
$allowedPages = ['dashboard','content','events','appearance','sections','sponsors','faq','terms','media','settings'];

if ($route === 'setup') cms_handle_setup();
if ($route === 'login') cms_handle_login();
if ($route === 'logout' && ($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') cms_handle_logout();
if (!cms_admin_exists()) cms_redirect('/admin/setup');
if (!cms_is_authenticated()) cms_redirect('/admin/login');

if ($route === 'export') {
    header('Content-Type: application/json; charset=utf-8');
    header('Content-Disposition: attachment; filename="aj-district-site-backup-' . gmdate('Y-m-d') . '.json"');
    echo json_encode(cms_site(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

$site = cms_site();
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    cms_verify_csrf();
    $action = (string)($_POST['action'] ?? '');
    try {
        $site = cms_apply_action($action, $site, $_POST, $_FILES);
        cms_save_site($site);
        cms_flash('Your changes are saved and live on the public site.');
    } catch (Throwable $e) {
        cms_flash($e->getMessage(), 'error');
    }
    cms_redirect('/admin/' . cms_action_page($action));
}

if (!in_array($route, $allowedPages, true)) { http_response_code(404); $route = 'dashboard'; }
admin_render($route, $site, cms_take_flash());

/** Renders the public template and fails loudly if the config placeholders are missing. */
function cms_public_template(): string {
    $file = __DIR__ . '/templates/public.html';
    $html = file_get_contents($file);
    if ($html === false || !str_contains($html, '__AJ_CONFIG__')) {
        http_response_code(500);
        exit('Public template is missing or malformed: templates/public.html');
    }
    return $html;
}

function cms_site_json(): string {
    $json = json_encode(cms_site(), JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    return $json ?: '{}';
}
