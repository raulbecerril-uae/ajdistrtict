<?php
declare(strict_types=1);

/**
 * Dependency-free test runner for the CMS core.
 * Usage: php tests/run.php   (or: composer test)
 */

require dirname(__DIR__) . '/includes/cms.php';
require dirname(__DIR__) . '/includes/actions.php';

$passed = 0;
$failed = 0;

function assert_same(mixed $expected, mixed $actual, string $message): void {
    global $passed, $failed;
    if ($expected === $actual) { $passed++; return; }
    $failed++;
    fwrite(STDERR, "FAIL: {$message}\n  expected: " . var_export($expected, true) . "\n  actual:   " . var_export($actual, true) . "\n");
}

function assert_true(bool $condition, string $message): void {
    assert_same(true, $condition, $message);
}

function assert_throws(string $class, callable $fn, string $message): void {
    global $passed, $failed;
    try {
        $fn();
    } catch (Throwable $e) {
        if ($e instanceof $class) { $passed++; return; }
        $failed++;
        fwrite(STDERR, "FAIL: {$message} (got " . get_class($e) . ': ' . $e->getMessage() . ")\n");
        return;
    }
    $failed++;
    fwrite(STDERR, "FAIL: {$message} (no exception thrown)\n");
}

$baseSite = cms_default_site();

// ---------------------------------------------------------------- cms_merge
$merged = cms_merge(
    ['a' => 1, 'nested' => ['x' => 1, 'y' => 2], 'list' => [1, 2, 3]],
    ['nested' => ['y' => 9, 'z' => 10], 'list' => [7], 'new' => 'v']
);
assert_same(1, $merged['a'], 'merge keeps untouched keys');
assert_same(1, $merged['nested']['x'], 'merge keeps missing nested keys');
assert_same(9, $merged['nested']['y'], 'merge overrides present nested keys');
assert_same(10, $merged['nested']['z'], 'merge adds new nested keys');
assert_same([7], $merged['list'], 'merge replaces lists wholesale');
assert_same('v', $merged['new'], 'merge adds new top-level keys');

// ---------------------------------------------------------------- cms_path
$_SERVER['REQUEST_URI'] = '/terms/';
assert_same('/terms', cms_path(), 'path trims trailing slash');
$_SERVER['REQUEST_URI'] = '/';
assert_same('/', cms_path(), 'root path');
$_SERVER['REQUEST_URI'] = '/receipt?x=1';
assert_same('/receipt', cms_path(), 'path strips query string');

// ---------------------------------------------------------------- cms_media_path
assert_true(cms_media_path('../../etc/passwd') === null, 'media path rejects traversal');
assert_true(cms_media_path('nonexistent.php') === null, 'media path rejects bad extension');
assert_true(cms_media_path('20260101-zzzzzzzzzzzzzzzzzzzzzzzzzz.jpg') === null, 'media path rejects bad hex');
assert_true(cms_media_path('20260101-aaaaaaaaaaaaaaaaaaaaaaaaaa.jpg') === null, 'media path rejects missing file');

// ---------------------------------------------------------------- cms_clean_row
$row = cms_clean_row(['name' => '  Bob  ', 'n' => 5, 'tags' => [' x ', ' y ']]);
assert_same('Bob', $row['name'], 'row trims scalars');
assert_same('5', $row['n'], 'row casts scalars to string');
assert_same(['x', 'y'], $row['tags'], 'row trims list entries');

// ---------------------------------------------------------------- save_event clamps
$site = cms_save_event($baseSite, ['event' => [
    'booth_price' => -50,
    'max_per_order' => 999,
    'image' => 'javascript:alert(1)',
    'upcoming' => [['t' => ' Fair '], 'junk'],
]]);
assert_same(0, $site['event']['booth_price'], 'booth price clamped at 0');
assert_same(20, $site['event']['max_per_order'], 'max per order clamped at 20');
assert_true(!str_starts_with((string)$site['appearance']['images']['event'], 'javascript:'), 'event image rejects javascript: URL');
assert_same(['t' => 'Fair'], $site['event']['upcoming'][0], 'upcoming cards trimmed');
assert_same([], $site['event']['upcoming'][1], 'non-array upcoming card becomes empty row');

$site = cms_save_event($baseSite, ['event' => ['max_per_order' => 0, 'image' => '/media/20260101-aaaaaaaaaaaaaaaaaaaaaaaaaa.jpg']]);
assert_same(1, $site['event']['max_per_order'], 'max per order floor is 1');
assert_same('/media/20260101-aaaaaaaaaaaaaaaaaaaaaaaaaa.jpg', $site['appearance']['images']['event'], 'media library image accepted');

// ---------------------------------------------------------------- save_appearance
$site = cms_save_appearance($baseSite, ['appearance' => ['theme' => 'evil><script', 'colors' => ['panel' => '#GGGGGG']]]);
assert_same('gulf', $site['appearance']['theme'], 'unknown theme rejected');
assert_same('#0E2B2C', $site['appearance']['colors']['panel'], 'invalid hex color rejected');

$site = cms_save_appearance($baseSite, ['appearance' => ['theme' => 'custom', 'colors' => ['panel' => '#112233', 'accent' => '#aabbcc']]]);
assert_same('custom', $site['appearance']['theme'], 'custom theme accepted');
assert_same('#112233', $site['appearance']['colors']['panel'], 'custom theme keeps picked panel color');
assert_same('#aabbcc', $site['appearance']['colors']['accent'], 'custom theme keeps picked accent color');

$site = cms_save_appearance($baseSite, ['appearance' => ['theme' => 'pearl', 'colors' => ['panel' => '#112233']]]);
assert_same('#E9EFEC', $site['appearance']['colors']['panel'], 'preset theme overrides custom colors');

$site = cms_save_appearance($baseSite, ['appearance' => ['images' => ['hero' => 'http://evil.example/x.png']]]);
assert_true(!str_starts_with((string)$site['appearance']['images']['hero'], 'http://evil'), 'external hero image URL rejected');

// ---------------------------------------------------------------- is_safe_image_ref
assert_true(cms_is_safe_image_ref('logos/AJ-white@4x.png'), 'bundled logo path allowed');
assert_true(cms_is_safe_image_ref('photos/DSC04438.jpg'), 'bundled photo path allowed');
assert_true(cms_is_safe_image_ref('__none__'), '__none__ sentinel allowed');
assert_true(!cms_is_safe_image_ref('logos/../../storage/admin.json'), 'traversal through folders rejected');

// ---------------------------------------------------------------- save_settings links
$site = cms_save_settings($baseSite, ['site' => [
    'links' => ['external_url' => 'javascript:alert(1)', 'terms_pdf' => 'ftp://evil/x.pdf'],
    'contact' => ['whatsapp' => ' 971501112222 '],
]]);
assert_true(!str_starts_with((string)$site['site']['links']['external_url'], 'javascript:'), 'javascript: external URL rejected');
assert_true(!str_starts_with((string)$site['site']['links']['terms_pdf'], 'ftp:'), 'ftp: terms PDF rejected');
assert_same('971501112222', $site['site']['contact']['whatsapp'], 'contact values trimmed');

$site = cms_save_settings($baseSite, ['site' => ['links' => ['external_url' => 'tel:+971501112222', 'terms_pdf' => 'files/terms.pdf']]]);
assert_same('tel:+971501112222', $site['site']['links']['external_url'], 'tel: URL allowed');
assert_same('files/terms.pdf', $site['site']['links']['terms_pdf'], 'relative PDF path allowed');

// ---------------------------------------------------------------- apply_action dispatch
assert_throws(RuntimeException::class, fn() => cms_apply_action('drop_tables', $baseSite, [], []), 'unknown action throws');
assert_throws(RuntimeException::class, fn() => cms_apply_action('delete_media', $baseSite, ['media_id' => 'nope'], []), 'delete missing media throws');
assert_throws(RuntimeException::class, fn() => cms_apply_action('import_site', $baseSite, [], []), 'import without file throws');

$page = cms_action_page('save_event');
assert_same('events', $page, 'action redirect map');
assert_same('dashboard', cms_action_page('mystery'), 'unknown action redirects to dashboard');

// ---------------------------------------------------------------- summary
$total = $passed + $failed;
echo "{$passed}/{$total} assertions passed\n";
exit($failed === 0 ? 0 : 1);
