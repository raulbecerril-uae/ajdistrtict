<?php
declare(strict_types=1);

/**
 * Translation helper for AJ District CMS.
 *
 * Supported translation providers:
 *  1. 'free_mymemory' - MyMemory Translation API (100% Free, NO API Key Required).
 *  2. 'google_cloud'  - Official Google Cloud Translation v3 API.
 *  3. 'openai'        - OpenAI API (e.g. gpt-4o-mini / gpt-4o) with context-aware Arabic.
 *
 * All translated strings are cached in storage/translations_ar.json by MD5 hash
 * to prevent duplicate network calls and speed up builds.
 * Provider configuration is saved in storage/ajd_settings.json.
 */

function translate_settings_file(): string
{
    return cms_storage() . DIRECTORY_SEPARATOR . 'ajd_settings.json';
}

function translate_cache_file(): string
{
    return cms_storage() . DIRECTORY_SEPARATOR . 'translations_ar.json';
}

function translate_load_settings(): array
{
    $path = translate_settings_file();
    if (!is_file($path)) return [];
    $data = json_decode((string)file_get_contents($path), true);
    return is_array($data) ? $data : [];
}

function translate_save_settings(array $settings): void
{
    if (!is_dir(cms_storage())) return;
    $json = json_encode($settings, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false) return;
    $target = translate_settings_file();
    $tmp = $target . '.' . bin2hex(random_bytes(4)) . '.tmp';
    if (file_put_contents($tmp, $json, LOCK_EX) !== false) {
        rename($tmp, $target);
        @chmod($target, 0640);
    } else {
        @unlink($tmp);
    }
}

function translate_provider(): string
{
    $s = translate_load_settings();
    return (string)($s['translate_provider'] ?? 'free_mymemory');
}

function translate_api_key(): string
{
    $s = translate_load_settings();
    return trim((string)($s['google_translate_api_key'] ?? ''));
}

function translate_openai_key(): string
{
    $s = translate_load_settings();
    return trim((string)($s['openai_api_key'] ?? ''));
}

function translate_load_cache(): array
{
    $path = translate_cache_file();
    if (!is_file($path)) return [];
    $data = json_decode((string)file_get_contents($path), true);
    return is_array($data) ? $data : [];
}

function translate_save_cache(array $cache): void
{
    if (!is_dir(cms_storage())) return;
    $json = json_encode($cache, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false) return;
    $target = translate_cache_file();
    $tmp = $target . '.' . bin2hex(random_bytes(4)) . '.tmp';
    if (file_put_contents($tmp, $json, LOCK_EX) !== false) {
        rename($tmp, $target);
        @chmod($target, 0640);
    } else {
        @unlink($tmp);
    }
}

/**
 * Translates a single text using MyMemory Free API (no API key needed).
 */
function translate_call_free(string $text): string
{
    $url = 'https://api.mymemory.translated.net/get?q=' . rawurlencode($text) . '&langpair=en|ar';

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_USERAGENT, 'AJDistrict/1.0');
        curl_setopt($ch, CURLOPT_TIMEOUT, 12);
        $raw = curl_exec($ch);
        $err = curl_error($ch);
        if ($raw === false || $raw === '') {
            throw new RuntimeException("Free translation request failed: $err");
        }
    } else {
        $ctx = stream_context_create([
            'http' => [
                'method'        => 'GET',
                'header'        => "User-Agent: AJDistrict/1.0\r\nAccept: application/json\r\n",
                'timeout'       => 12,
                'ignore_errors' => true,
            ],
            'ssl' => ['verify_peer' => false],
        ]);
        $raw = @file_get_contents($url, false, $ctx);
        if ($raw === false) {
            throw new RuntimeException('Free translation request failed (stream error).');
        }
    }

    $data = json_decode((string)$raw, true);
    if (!is_array($data) || empty($data['responseData']['translatedText'])) {
        throw new RuntimeException('Unable to parse free translation output.');
    }

    $translated = (string)$data['responseData']['translatedText'];
    // In case API returns uppercase error messages like MYMEMORY WARNING
    if (str_starts_with($translated, 'MYMEMORY WARNING')) {
        throw new RuntimeException($translated);
    }

    return html_entity_decode(trim($translated), ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

/**
 * Calls the Google Cloud Translation v3 Basic REST endpoint.
 *
 * @param  string[] $texts
 * @return string[]
 */
function translate_call_api(string $apiKey, array $texts): array
{
    if (empty($texts)) return [];

    $url = 'https://translation.googleapis.com/language/translate/v2?key=' . urlencode($apiKey);
    $payload = json_encode([
        'q'      => array_values($texts),
        'source' => 'en',
        'target' => 'ar',
        'format' => 'text',
    ]);

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json", "Accept: application/json"]);
        curl_setopt($ch, CURLOPT_TIMEOUT, 20);
        $raw = curl_exec($ch);
        $err = curl_error($ch);
        if ($raw === false) {
            throw new RuntimeException("Google Translate API request failed: $err");
        }
    } else {
        $ctx = stream_context_create([
            'http' => [
                'method'        => 'POST',
                'header'        => "Content-Type: application/json\r\nAccept: application/json\r\n",
                'content'       => $payload,
                'timeout'       => 15,
                'ignore_errors' => true,
            ],
            'ssl' => ['verify_peer' => true],
        ]);
        $raw = @file_get_contents($url, false, $ctx);
        if ($raw === false) {
            throw new RuntimeException('Google Translate API request failed (network error).');
        }
    }

    $resp = json_decode((string)$raw, true);

    if (isset($resp['error'])) {
        $msg = (string)($resp['error']['message'] ?? 'Unknown API error');
        $code = (int)($resp['error']['code'] ?? 0);
        throw new RuntimeException("Google Translate API error ($code): $msg");
    }

    $translations = $resp['data']['translations'] ?? [];
    if (!is_array($translations) || count($translations) !== count($texts)) {
        throw new RuntimeException('Google Translate API returned an unexpected response shape.');
    }

    return array_map(
        static fn(array $t): string => html_entity_decode((string)($t['translatedText'] ?? ''), ENT_QUOTES | ENT_HTML5, 'UTF-8'),
        $translations
    );
}

/**
 * Translates texts via OpenAI API.
 *
 * @param  string[] $texts
 * @return string[]
 */
function translate_call_openai(string $apiKey, array $texts): array
{
    if (empty($texts)) return [];

    $url = 'https://api.openai.com/v1/chat/completions';
    $systemPrompt = "You are a professional English-to-Arabic translator for an exhibition and event booking platform in the UAE (AJ District). Translate the provided JSON array of English strings accurately into modern standard Arabic suitable for UAE / Gulf audiences. Maintain any placeholders like {total}, {max}, {event}. Return ONLY a valid JSON array of translated strings in the exact same order with no extra markdown formatting or explanations.";

    $payload = json_encode([
        'model' => 'gpt-4o-mini',
        'messages' => [
            ['role' => 'system', 'content' => $systemPrompt],
            ['role' => 'user', 'content' => json_encode(array_values($texts), JSON_UNESCAPED_UNICODE)]
        ],
        'temperature' => 0.2,
    ]);

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json", "Authorization: Bearer {$apiKey}"]);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        $raw = curl_exec($ch);
        $err = curl_error($ch);
        if ($raw === false) {
            throw new RuntimeException("OpenAI API request failed: $err");
        }
    } else {
        $ctx = stream_context_create([
            'http' => [
                'method'        => 'POST',
                'header'        => "Content-Type: application/json\r\nAuthorization: Bearer {$apiKey}\r\n",
                'content'       => $payload,
                'timeout'       => 30,
                'ignore_errors' => true,
            ],
            'ssl' => ['verify_peer' => true],
        ]);
        $raw = @file_get_contents($url, false, $ctx);
        if ($raw === false) {
            throw new RuntimeException('OpenAI API request failed (network error).');
        }
    }

    $resp = json_decode((string)$raw, true);
    if (isset($resp['error'])) {
        $msg = (string)($resp['error']['message'] ?? 'OpenAI API error');
        throw new RuntimeException("OpenAI error: $msg");
    }

    $content = trim((string)($resp['choices'][0]['message']['content'] ?? ''));
    if (str_starts_with($content, '```')) {
        $content = preg_replace('/^```(?:json)?\s*/i', '', $content) ?? '';
        $content = preg_replace('/\s*```$/', '', $content) ?? '';
    }

    $decoded = json_decode($content, true);
    if (!is_array($decoded) || count($decoded) !== count($texts)) {
        throw new RuntimeException('OpenAI returned invalid translation list.');
    }

    return array_map(static fn($v) => is_string($v) ? trim($v) : '', $decoded);
}

/**
 * Translate an array of English strings to Arabic using the configured provider.
 * Strings already in cache are served instantly; only new/changed strings hit the network.
 *
 * @param  array<string,string> $strings  key => English text
 * @return array<string,string>           key => Arabic text
 */
function translate_to_arabic(array $strings): array
{
    $provider = translate_provider();
    $googleKey = translate_api_key();
    $openaiKey = translate_openai_key();

    if ($provider === 'google_cloud' && $googleKey === '') {
        throw new RuntimeException('Google Cloud Translation API key is missing. Set it in Settings or switch to Free Instant Translation.');
    }
    if ($provider === 'openai' && $openaiKey === '') {
        throw new RuntimeException('OpenAI API key is missing. Set it in Settings or switch to Free Instant Translation.');
    }

    $cache  = translate_load_cache();
    $result = [];
    $needed = []; // hash => [keys]

    foreach ($strings as $key => $text) {
        $text = trim((string)$text);
        if ($text === '') {
            $result[$key] = '';
            continue;
        }
        $hash = md5($text);
        if (isset($cache[$hash])) {
            $result[$key] = $cache[$hash];
        } else {
            $needed[$hash][] = $key;
        }
    }

    if (!empty($needed)) {
        $hashes      = array_keys($needed);
        $uniqueTexts = [];
        foreach ($hashes as $h) {
            $firstKey        = $needed[$h][0];
            $uniqueTexts[$h] = trim((string)$strings[$firstKey]);
        }

        $translated = [];
        if ($provider === 'google_cloud') {
            $translated = translate_call_api($googleKey, array_values($uniqueTexts));
        } elseif ($provider === 'openai') {
            $translated = translate_call_openai($openaiKey, array_values($uniqueTexts));
        } else {
            // Default: free_mymemory (100% free, no API key required)
            foreach (array_values($uniqueTexts) as $uText) {
                try {
                    $translated[] = translate_call_free($uText);
                } catch (Throwable) {
                    $translated[] = $uText; // fallback if single phrase fails
                }
            }
        }

        foreach (array_keys($uniqueTexts) as $i => $hash) {
            $ar = $translated[$i] ?? '';
            if ($ar !== '') {
                $cache[$hash] = $ar;
                foreach ($needed[$hash] as $k) {
                    $result[$k] = $ar;
                }
            }
        }

        translate_save_cache($cache);
    }

    return $result;
}

/**
 * Collects every translatable string from the site config and returns
 * the site array with an injected `ar` key containing Arabic translations.
 */
function translate_site_to_arabic(array $site): array
{
    $strings = [];

    // ── home ──────────────────────────────────────────────────────────────
    foreach (['hero_title', 'hero_intro'] as $k) {
        if (!empty($site['home'][$k])) $strings["home.$k"] = $site['home'][$k];
    }

    // ── copy (all string values) ──────────────────────────────────────────
    $skipCopy = ['terms_agreement_intro_ar'];
    foreach (($site['copy'] ?? []) as $k => $v) {
        if (!in_array($k, $skipCopy, true) && is_string($v) && trim($v) !== '') {
            $strings["copy.$k"] = $v;
        }
    }

    // ── event ─────────────────────────────────────────────────────────────
    $eventFields = ['name', 'short_date', 'date', 'hours', 'venue', 'city', 'address', 'note', 'description'];
    foreach ($eventFields as $k) {
        if (!empty($site['event'][$k])) $strings["event.$k"] = $site['event'][$k];
    }
    // upcoming cards
    foreach (($site['event']['upcoming'] ?? []) as $i => $card) {
        foreach (['tag', 't', 'x', 'p'] as $f) {
            if (!empty($card[$f])) $strings["event.upcoming.$i.$f"] = $card[$f];
        }
    }

    // ── sponsors ──────────────────────────────────────────────────────────
    foreach (($site['sponsors']['tiers'] ?? []) as $i => $tier) {
        if (!empty($tier['title'])) $strings["sponsors.tiers.$i.title"] = $tier['title'];
        foreach (($tier['benefits'] ?? []) as $j => $b) {
            if (trim((string)$b) !== '') $strings["sponsors.tiers.$i.benefits.$j"] = $b;
        }
    }

    // ── faq ───────────────────────────────────────────────────────────────
    foreach (($site['faq'] ?? []) as $i => $row) {
        if (!empty($row['q'])) $strings["faq.$i.q"] = $row['q'];
        if (!empty($row['a'])) $strings["faq.$i.a"] = $row['a'];
    }

    // ── site meta ─────────────────────────────────────────────────────────
    if (!empty($site['site']['name']))             $strings['site.name']             = $site['site']['name'];
    if (!empty($site['site']['meta_description'])) $strings['site.meta_description'] = $site['site']['meta_description'];

    if (empty($strings)) {
        $site['ar'] = [];
        return $site;
    }

    $translated = translate_to_arabic($strings);

    $ar = [];
    foreach ($translated as $dotKey => $value) {
        $parts = explode('.', $dotKey, 5);
        $ref = &$ar;
        foreach ($parts as $part) {
            if (!isset($ref[$part]) || !is_array($ref[$part])) $ref[$part] = [];
            $ref = &$ref[$part];
        }
        $ref = $value;
        unset($ref);
    }
    $site['ar'] = $ar;

    return $site;
}
