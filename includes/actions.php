<?php
declare(strict_types=1);

/**
 * Dashboard POST action handlers.
 *
 * Every handler takes the current site array plus the trimmed request data and
 * returns the updated site array, throwing RuntimeException on invalid input.
 * Keeping them pure (no session, no echo) makes them unit-testable.
 */

function cms_clean_row(mixed $row): array {
    if (!is_array($row)) return [];
    $clean = [];
    foreach ($row as $key => $value) {
        if (is_array($value)) {
            $clean[$key] = array_values(array_map(static fn($v) => is_scalar($v) ? trim((string)$v) : '', $value));
        } elseif (is_scalar($value)) {
            $clean[$key] = trim((string)$value);
        }
    }
    return $clean;
}

/** Applies a dashboard action and returns the updated site configuration. */
function cms_apply_action(string $action, array $site, array $post, array $files): array {
    return match ($action) {
        'save_copy' => cms_save_copy($site, $post),
        'save_event' => cms_save_event($site, $post),
        'save_appearance' => cms_save_appearance($site, $post),
        'save_sections' => cms_save_sections($site, $post),
        'save_sponsors' => cms_save_sponsors($site, $post),
        'save_faq' => cms_save_faq($site, $post),
        'save_terms' => cms_save_terms($site, $post),
        'save_settings' => cms_save_settings($site, $post),
        'upload_media' => cms_upload_media_batch($site, $files),
        'delete_media' => cms_delete_media_action($site, $post, $files),
        'import_site' => cms_import_site_action($site, $files),
        default => throw new RuntimeException('Unknown dashboard action.'),
    };
}

/** Dashboard page each action redirects back to. */
function cms_action_page(string $action): string {
    return match ($action) {
        'save_copy' => 'content',
        'save_settings', 'import_site' => 'settings',
        'save_event' => 'events',
        'save_appearance' => 'appearance',
        'save_sections' => 'sections',
        'save_sponsors' => 'sponsors',
        'save_faq' => 'faq',
        'save_terms' => 'terms',
        'upload_media', 'delete_media' => 'media',
        default => 'dashboard',
    };
}

/** Validates an image reference chosen from the CMS (library path or bundled folder). */
function cms_is_safe_image_ref(string $image): bool {
    return $image === '' || $image === '__none__'
        || str_starts_with($image, '/media/')
        || preg_match('~^(logos|photos)/[a-zA-Z0-9_.@-]+$~', $image) === 1;
}

function cms_save_copy(array $site, array $post): array {
    foreach (($post['copy'] ?? []) as $key => $value) {
        if (array_key_exists($key, $site['copy'])) $site['copy'][$key] = trim((string)$value);
    }
    // Hero copy is stored under "home" but edited through the copy fields.
    if (isset($post['copy']['hero_title'])) $site['home']['hero_title'] = trim((string)$post['copy']['hero_title']);
    if (isset($post['copy']['hero_intro'])) $site['home']['hero_intro'] = trim((string)$post['copy']['hero_intro']);
    return $site;
}

function cms_save_event(array $site, array $post): array {
    foreach (($post['event'] ?? []) as $key => $value) {
        if ($key !== 'upcoming' && array_key_exists($key, $site['event'])) $site['event'][$key] = $value;
    }
    $eventImage = (string)($post['event']['image'] ?? '');
    if (cms_is_safe_image_ref($eventImage)) $site['appearance']['images']['event'] = $eventImage;
    $site['event']['booth_price'] = max(0, (float)($post['event']['booth_price'] ?? 0));
    $site['event']['max_per_order'] = max(1, min(20, (int)($post['event']['max_per_order'] ?? 1)));
    $site['event']['upcoming'] = array_values(array_map('cms_clean_row', (array)($post['event']['upcoming'] ?? [])));
    return $site;
}

function cms_save_appearance(array $site, array $post): array {
    $a = (array)($post['appearance'] ?? []);
    $allowedThemes = ['gulf', 'skyline', 'dune', 'oasis', 'falcon', 'majlis', 'souq', 'pearl', 'custom'];
    if (in_array($a['theme'] ?? '', $allowedThemes, true)) $site['appearance']['theme'] = $a['theme'];

    foreach (($a['colors'] ?? []) as $key => $color) {
        if (isset($site['appearance']['colors'][$key]) && preg_match('/^#[a-fA-F0-9]{6}$/', (string)$color)) {
            $site['appearance']['colors'][$key] = $color;
        }
    }

    // Preset themes override custom colors; only "custom" keeps picked colors.
    $presetColors = [
        'gulf' => ['#0E2B2C', '#F0B35C'], 'skyline' => ['#101D3A', '#6CC6FF'],
        'dune' => ['#EDE0C8', '#A5481F'], 'oasis' => ['#14301F', '#B9D96A'],
        'falcon' => ['#23201D', '#E2B04F'], 'majlis' => ['#4B1E2B', '#F2B94B'],
        'souq' => ['#B5532E', '#F6C879'], 'pearl' => ['#E9EFEC', '#0E6B6B'],
    ];
    $selectedTheme = $site['appearance']['theme'];
    if (isset($presetColors[$selectedTheme])) {
        $site['appearance']['colors'] = [
            'panel' => $presetColors[$selectedTheme][0],
            'accent' => $presetColors[$selectedTheme][1],
            'surface' => '#EFDFCB',
            'background' => '#FFFDFA',
        ];
    }

    foreach (($a['images'] ?? []) as $key => $image) {
        if (isset($site['appearance']['images'][$key]) && cms_is_safe_image_ref((string)$image)) {
            $site['appearance']['images'][$key] = $image;
        }
    }
    return $site;
}

function cms_save_sections(array $site, array $post): array {
    foreach ($site['sections'] as $key => $_) {
        $site['sections'][$key] = isset($post['sections'][$key]);
    }
    $positionInput = (array)($post['section_order'] ?? []);
    $orderable = ['events', 'location', 'booking', 'how', 'sponsors', 'faq'];
    $positions = [];
    foreach ($orderable as $key) {
        $fallback = (int)array_search($key, $site['section_order'], true) + 1;
        $positions[$key] = max(1, min(count($orderable), (int)($positionInput[$key] ?? $fallback)));
    }
    asort($positions);
    $site['section_positions'] = $positions;
    $site['section_order'] = array_keys($positions);
    return $site;
}

function cms_save_sponsors(array $site, array $post): array {
    $site['sponsors']['tiers'] = array_values(array_map('cms_clean_row', (array)($post['tiers'] ?? [])));
    foreach ($site['sponsors']['tiers'] as &$tier) {
        $tier['benefits'] = array_values(array_filter(
            array_map('trim', preg_split('/\R/', (string)($tier['benefits_text'] ?? '')) ?: [])
        ));
    }
    unset($tier);
    $site['sponsors']['showcase'] = array_values(array_map('trim', (array)($post['showcase'] ?? [])));
    return $site;
}

function cms_save_faq(array $site, array $post): array {
    $site['faq'] = array_values(array_map('cms_clean_row', (array)($post['faq'] ?? [])));
    return $site;
}

function cms_save_terms(array $site, array $post): array {
    $site['terms']['acceptance_en'] = trim((string)($post['terms']['acceptance_en'] ?? ''));
    $site['terms']['acceptance_ar'] = trim((string)($post['terms']['acceptance_ar'] ?? ''));
    $site['terms']['clauses'] = array_values(array_map('cms_clean_row', (array)($post['terms']['clauses'] ?? [])));
    return $site;
}

function cms_save_settings(array $site, array $post): array {
    $s = (array)($post['site'] ?? []);
    foreach (['name', 'logo_alt', 'meta_description'] as $key) {
        if (isset($s[$key])) $site['site'][$key] = trim((string)$s[$key]);
    }
    foreach (['whatsapp', 'instagram', 'tiktok', 'snapchat'] as $key) {
        if (isset($s['contact'][$key])) $site['site']['contact'][$key] = trim((string)$s['contact'][$key]);
    }

    $links = (array)($s['links'] ?? []);
    $pdf = trim((string)($links['terms_pdf'] ?? ''));
    if ($pdf === '' || preg_match('~^https://[^\s]+$~i', $pdf) || preg_match('~^[A-Za-z0-9_./-]+\.pdf$~i', $pdf)) {
        $site['site']['links']['terms_pdf'] = $pdf;
    }
    if (isset($links['external_label'])) $site['site']['links']['external_label'] = trim((string)$links['external_label']);
    $externalUrl = trim((string)($links['external_url'] ?? ''));
    if ($externalUrl === '' || preg_match('~^https://[^\s]+$~i', $externalUrl) || preg_match('~^(mailto|tel):[^\s]+$~i', $externalUrl)) {
        $site['site']['links']['external_url'] = $externalUrl;
    }

    foreach (($s['navigation'] ?? []) as $key => $value) {
        if (isset($site['site']['navigation'][$key])) $site['site']['navigation'][$key] = trim((string)$value);
    }
    return $site;
}

function cms_upload_media_batch(array $site, array $files): array {
    foreach ((array)($files['media_files']['name'] ?? []) as $i => $name) {
        if ($name === '') continue;
        $one = [
            'name' => $name,
            'type' => $files['media_files']['type'][$i] ?? '',
            'tmp_name' => $files['media_files']['tmp_name'][$i] ?? '',
            'error' => $files['media_files']['error'][$i] ?? UPLOAD_ERR_NO_FILE,
            'size' => $files['media_files']['size'][$i] ?? 0,
        ];
        $site['media_library'][] = cms_upload_media($one);
    }
    return $site;
}

function cms_delete_media_action(array $site, array $post, array $files): array {
    $id = (string)($post['media_id'] ?? '');
    $path = cms_media_path($id);
    if (!$path) throw new RuntimeException('Media file not found.');
    foreach ($site['appearance']['images'] as $key => $image) {
        if ($image === '/media/' . $id) $site['appearance']['images'][$key] = '';
    }
    foreach (($site['event']['upcoming'] ?? []) as &$eventCard) {
        if (($eventCard['img'] ?? '') === '/media/' . $id) $eventCard['img'] = '';
    }
    unset($eventCard);
    unlink($path);
    $site['media_library'] = array_values(array_filter(
        $site['media_library'], static fn($m) => ($m['id'] ?? '') !== $id
    ));
    return $site;
}

function cms_import_site_action(array $site, array $files): array {
    $f = $files['site_json'] ?? [];
    if (($f['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK || ($f['size'] ?? 0) > 2 * 1024 * 1024) {
        throw new RuntimeException('Choose a JSON backup up to 2 MB.');
    }
    $incoming = json_decode((string)file_get_contents((string)$f['tmp_name']), true);
    if (!is_array($incoming)) throw new RuntimeException('That file is not valid site JSON.');
    return cms_merge(cms_default_site(), $incoming);
}
