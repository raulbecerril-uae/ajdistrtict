<?php
declare(strict_types=1);

/**
 * Syntax-checks every PHP file in the project with `php -l`.
 * Usage: php tests/lint.php   (or: composer lint)
 */

$root = dirname(__DIR__);
$skipDirs = ['backup', 'deploy', 'vendor', 'node_modules', '.git', 'storage'];
$errors = 0;
$checked = 0;

$files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($root, FilesystemIterator::SKIP_DOTS));
foreach ($files as $file) {
    /** @var SplFileInfo $file */
    if (!$file->isFile() || $file->getExtension() !== 'php') continue;
    $relative = str_replace('\\', '/', substr($file->getPathname(), strlen($root) + 1));
    foreach ($skipDirs as $dir) {
        if (str_starts_with($relative, $dir . '/')) continue 2;
    }
    $checked++;
    exec(escapeshellarg(PHP_BINARY) . ' -l ' . escapeshellarg($file->getPathname()) . ' 2>&1', $output, $code);
    if ($code !== 0) {
        $errors++;
        echo "LINT FAIL: {$relative}\n" . implode("\n", $output) . "\n";
    }
    $output = [];
}

echo "{$checked} files checked, {$errors} failures\n";
exit($errors === 0 ? 0 : 1);
