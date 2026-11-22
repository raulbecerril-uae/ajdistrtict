<?php
declare(strict_types=1);

/**
 * Administrator authentication screens: first-run setup, sign in and sign out.
 * Each handler renders its page and terminates the request.
 */

function cms_handle_setup(): never {
    if (cms_admin_exists()) cms_redirect('/admin/login');

    $setupKey = (string)(getenv('AJD_SETUP_KEY') ?: '');
    $allowed = $setupKey !== ''
        ? hash_equals($setupKey, (string)($_GET['key'] ?? $_POST['setup_key'] ?? ''))
        : cms_is_local_request();
    $error = '';

    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
        cms_verify_csrf();
        $allowed = $setupKey !== ''
            ? hash_equals($setupKey, (string)($_POST['setup_key'] ?? ''))
            : cms_is_local_request();
        $username = trim((string)($_POST['username'] ?? ''));
        $password = (string)($_POST['password'] ?? '');
        if (!$allowed) {
            $error = 'Initial setup is allowed only from this computer unless AJD_SETUP_KEY is configured.';
        } elseif (!preg_match('/^[a-zA-Z0-9_.@-]{3,80}$/', $username)) {
            $error = 'Use a username of 3 to 80 letters, numbers, dots, underscores, @, or hyphens.';
        } elseif (strlen($password) < 12) {
            $error = 'Choose a password with at least 12 characters.';
        } else {
            $record = [
                'id' => bin2hex(random_bytes(16)),
                'username' => $username,
                'password_hash' => password_hash($password, PASSWORD_DEFAULT),
                'created' => gmdate('c'),
            ];
            if (!is_dir(cms_storage())) mkdir(cms_storage(), 0750, true);
            file_put_contents(cms_admin_file(), json_encode($record, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES), LOCK_EX);
            @chmod(cms_admin_file(), 0640);
            cms_redirect('/admin/login?created=1');
        }
    }

    render_auth_page('Create administrator', $error, 'setup', $allowed, $setupKey);
    exit;
}

function cms_handle_login(): never {
    if (!cms_admin_exists()) cms_redirect('/admin/setup');
    if (cms_is_authenticated()) cms_redirect('/admin');

    $error = '';
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
        cms_verify_csrf();
        $record = cms_admin_record();
        $attempts = $_SESSION['login_attempts'] ?? ['count' => 0, 'since' => time()];
        if (time() - (int)$attempts['since'] > 900) $attempts = ['count' => 0, 'since' => time()];
        if ((int)$attempts['count'] >= 8) {
            $error = 'Too many attempts. Wait 15 minutes before trying again.';
        } elseif (
            hash_equals((string)($record['username'] ?? ''), (string)($_POST['username'] ?? ''))
            && password_verify((string)($_POST['password'] ?? ''), (string)($record['password_hash'] ?? ''))
        ) {
            session_regenerate_id(true);
            $_SESSION['admin_id'] = (string)$record['id'];
            unset($_SESSION['login_attempts']);
            cms_redirect('/admin');
        } else {
            $attempts['count'] = (int)$attempts['count'] + 1;
            $_SESSION['login_attempts'] = $attempts;
            $error = 'Username or password is incorrect.';
        }
    }

    render_auth_page('Sign in to AJ District', $error, 'login', true, '');
    exit;
}

function cms_handle_logout(): never {
    cms_verify_csrf();
    $_SESSION = [];
    session_regenerate_id(true);
    cms_redirect('/admin/login');
}

function render_auth_page(string $title, string $error, string $mode, bool $allowed, string $setupKey): void {
    $csrf = cms_csrf();
    $notice = $error !== '' ? '<div class="notice error">' . cms_h($error) . '</div>' : '';
    // The shared-credential hint is a first-run convenience only; never show it publicly.
    $credentials = ($mode === 'login' && cms_is_local_request())
        ? '<aside class="login-credentials"><b>Dashboard credentials</b><span>Username <code>admin</code></span><span>Password <code>ajdistrict01</code></span></aside>'
        : '';
    ?><!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title><?=cms_h($title)?> · AJ District</title><link rel="stylesheet" href="/css/admin.css?v=1"></head><body class="auth-body"><main class="auth-card"><a class="admin-brand" href="/"><span class="brand-mark">AJ</span><span><b>AJ District</b><small>CONTENT STUDIO</small></span></a><span class="eyebrow">SECURE ADMIN ACCESS</span><h1><?=cms_h($title)?></h1><p><?=$mode==='setup'?'Create the first administrator account to manage the website.':'Manage the AJ District website.'?></p><?=$notice?><?php if($mode==='setup'&&!$allowed):?><div class="notice error">Initial setup is restricted. Open this page from the server computer, or configure AJD_SETUP_KEY and supply it as <code>?key=…</code>.</div><?php endif;?><?php if($mode==='login'):?><?=$credentials?><?php endif;?><form method="post" class="edit-form"><input type="hidden" name="_csrf" value="<?=cms_h($csrf)?>"><?php if($mode==='setup'&&$setupKey!==''):?><input type="hidden" name="setup_key" value="<?=cms_h((string)($_GET['key']??''))?>"><?php endif; ?><?=admin_field('username','Username','')?><?=admin_field('password','Password','','password',$mode==='setup'?'Use at least 12 characters.':'')?><button class="button primary" type="submit"><?=$mode==='setup'?'Create administrator':'Sign in'?></button></form><?php if($mode==='login'):?><a class="auth-link" href="/admin/setup">First time setup</a><?php endif;?></main></body></html><?php
}
