<?php
declare(strict_types=1);

// PHP's built-in server does not read Apache .htaccess or IIS web.config.
// Serve real assets directly and pass extensionless CMS/public routes to index.php.
$uriPath = parse_url((string)($_SERVER['REQUEST_URI'] ?? '/'), PHP_URL_PATH);
$relative = ltrim(str_replace(['/', '\\'], DIRECTORY_SEPARATOR, rawurldecode(is_string($uriPath) ? $uriPath : '/')), DIRECTORY_SEPARATOR);
$root = realpath(__DIR__);
$requested = realpath(__DIR__ . DIRECTORY_SEPARATOR . $relative);
if ($relative !== '' && $root !== false && $requested !== false
    && str_starts_with($requested, $root . DIRECTORY_SEPARATOR)
    && is_file($requested)) {
    return false;
}

require __DIR__ . '/index.php';
