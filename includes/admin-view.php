<?php
declare(strict_types=1);

function admin_field(string $name, string $label, mixed $value, string $type = 'text', string $help = ''): string {
    $n = cms_h($name); $l = cms_h($label); $v = cms_h(is_scalar($value) ? (string)$value : ''); $id = 'f-' . preg_replace('/[^a-z0-9_-]/i', '-', $name);
    $html = '<label class="field" for="' . $id . '"><span>' . $l . '</span>';
    if ($type === 'textarea') $html .= '<textarea id="' . $id . '" name="' . $n . '" rows="4">' . $v . '</textarea>';
    else $html .= '<input id="' . $id . '" name="' . $n . '" type="' . cms_h($type) . '" value="' . $v . '">';
    if ($help !== '') $html .= '<small>' . cms_h($help) . '</small>';
    return $html . '</label>';
}

function admin_save_button(string $csrf): string {
    return '<input type="hidden" name="_csrf" value="' . cms_h($csrf) . '"><div class="form-actions"><span>Save to publish your changes on the public website.</span><button class="button primary" type="submit"><i class="ph-light ph-floppy-disk"></i> Save changes</button></div>';
}

function admin_shell(string $page, string $title, string $body, ?array $flash = null, array $site = []): void {
    $nav = [
        'dashboard'=>['Overview','squares-four'], 'content'=>['Pages & content','text-align-left'],
        'events'=>['Events','calendar-blank'], 'appearance'=>['Appearance','paint-brush'],
        'sections'=>['Navigation & sections','layout'], 'sponsors'=>['Sponsors','medal'],
        'faq'=>['FAQ','chat-circle-text'], 'terms'=>['Terms & receipt','file-text'],
        'media'=>['Media library','image'], 'settings'=>['Site settings','gear-six'],
    ];
    $flashHtml = $flash ? '<div class="notice ' . cms_h($flash['type'] ?? 'success') . '">' . cms_h($flash['message'] ?? '') . '</div>' : '';
    ?><!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title><?=cms_h($title)?> · AJ District CMS</title><link rel="stylesheet" href="/css/admin.css?v=5"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/light/style.css"></head><body class="admin-body">
    <div class="admin-app"><aside class="sidebar"><a class="admin-brand" href="/admin"><span class="brand-mark">AJ</span><span><b>AJ District</b><small>CONTENT STUDIO</small></span></a><div class="side-label">WORKSPACE</div><nav><?php foreach($nav as $key=>$item): ?><a class="<?= $page===$key?'active':'' ?>" href="/admin/<?=cms_h($key)?>"><i class="ph-light ph-<?=cms_h($item[1])?>"></i><span><?=cms_h($item[0])?></span></a><?php endforeach; ?></nav><div class="sidebar-bottom"><a href="/" target="_blank" rel="noopener"><i class="ph-light ph-arrow-square-out"></i><span>View public site</span></a><form method="post" action="/admin/logout"><input type="hidden" name="_csrf" value="<?=cms_h(cms_csrf())?>"><button type="submit"><i class="ph-light ph-sign-out"></i><span>Sign out</span></button></form></div></aside>
    <main class="admin-main"><header class="admin-top"><div><span class="eyebrow">AJ DISTRICT / ADMIN</span><h1><?=cms_h($title)?></h1></div><div class="top-right"><span class="live-dot">● Site connected</span><button class="button secondary preview-toggle" type="button" aria-expanded="false" aria-controls="admin-preview"><i class="ph-light ph-eye"></i> Live preview</button><a class="avatar" href="/admin/settings" title="Site settings"><i class="ph-light ph-user"></i></a></div></header><div class="admin-content"><?=$flashHtml?><?=$body?></div></main><aside class="admin-preview" id="admin-preview" aria-label="Live website preview" hidden><div class="admin-preview-head"><div><b>Website preview</b><span>Unsaved edits appear here as you make them.</span></div><button class="icon-button preview-close" type="button" aria-label="Close preview"><i class="ph-light ph-x"></i></button></div><iframe title="Live public website preview" data-preview-src="/?adminPreview=1"></iframe></aside></div><script>window.AJ_ADMIN_CONFIG=<?=json_encode($site,JSON_HEX_TAG|JSON_HEX_APOS|JSON_HEX_AMP|JSON_HEX_QUOT|JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES) ?: '{}'?>;</script><script src="/js/admin.js?v=7"></script></body></html><?php
}

function admin_render(string $page, array $site, ?array $flash = null): void {
    $titleMap = ['dashboard'=>'Overview','content'=>'Pages & content','events'=>'Events','appearance'=>'Appearance','sections'=>'Navigation & sections','sponsors'=>'Sponsors','faq'=>'FAQ','terms'=>'Terms & receipt','media'=>'Media library','settings'=>'Site settings'];
    $title = $titleMap[$page] ?? 'Overview'; $csrf = cms_csrf(); $body = '';
    if ($page === 'dashboard') {
        $enabled = count(array_filter($site['sections'] ?? []));
        $body .= '<div class="welcome-card"><div><span class="eyebrow">YOUR EVENT WEBSITE</span><h2>Good day. Your site is ready to shape.</h2><p>Update the public pages, event schedule, appearance, and media from one place.</p><a class="button primary" href="/admin/content">Edit website content <i class="ph-light ph-arrow-right"></i></a></div><div class="welcome-art" aria-hidden="true"><span>AJ</span></div></div>';
        $body .= '<div class="stat-grid"><a href="/admin/events"><span class="stat-icon"><i class="ph-light ph-calendar-blank"></i></span><small>FEATURED EVENT</small><b>'.cms_h($site['event']['name'] ?? '').'</b><em>'.cms_h($site['event']['date'] ?? '').'</em></a><a href="/admin/sections"><span class="stat-icon"><i class="ph-light ph-layout"></i></span><small>VISIBLE SECTIONS</small><b>'.$enabled.' of '.count($site['sections'] ?? []).'</b><em>Public website layout</em></a><a href="/admin/media"><span class="stat-icon"><i class="ph-light ph-image"></i></span><small>MEDIA LIBRARY</small><b>'.count($site['media_library'] ?? []).' files</b><em>Images and brand assets</em></a><a href="/admin/faq"><span class="stat-icon"><i class="ph-light ph-chat-circle-text"></i></span><small>HELP CONTENT</small><b>'.count($site['faq'] ?? []).' answers</b><em>Frequently asked questions</em></a></div>';
        $body .= '<div class="dashboard-grid"><section class="panel"><div class="panel-head"><div><span class="eyebrow">QUICK EDIT</span><h3>Manage the essentials</h3></div></div><div class="quick-links"><a href="/admin/events"><i class="ph-light ph-calendar-blank"></i><span><b>Event details</b><small>Dates, location, pricing and event cards</small></span><i class="ph-light ph-arrow-right"></i></a><a href="/admin/appearance"><i class="ph-light ph-palette"></i><span><b>Brand appearance</b><small>Colors, logo and homepage images</small></span><i class="ph-light ph-arrow-right"></i></a><a href="/admin/faq"><i class="ph-light ph-chat-circle-text"></i><span><b>Questions and answers</b><small>Keep visitor information current</small></span><i class="ph-light ph-arrow-right"></i></a></div></section><section class="panel site-preview"><span class="eyebrow">PUBLIC WEBSITE</span><h3>'.cms_h($site['site']['name'] ?? 'AJ District').'</h3><p>'.cms_h($site['site']['meta_description'] ?? '').'</p><a href="/" target="_blank" rel="noopener">Open website <i class="ph-light ph-arrow-up-right"></i></a><hr><span class="security-note"><i class="ph-light ph-shield-check"></i> Administrator session is protected. Use HTTPS when publishing.</span></section></div>';
    } elseif ($page === 'content') {
        $fields = [
            'hero_title'=>['Homepage headline','text'],'hero_intro'=>['Homepage introduction','textarea'],
            'hero_reserve_label'=>['Hero reserve button','text'],'hero_events_label'=>['Hero events button','text'],'hero_map_label'=>['Hero map link','text'],'hero_spaces_left'=>['Hero spaces-left label ({total} placeholder)','text'],'hero_ring_label'=>['Rotating reserve message','text'],
            'events_intro'=>['Events introduction','textarea'],'events_status'=>['Featured event status','text'],'events_reserve_label'=>['Featured event reserve button','text'],'events_map_label'=>['Featured event map button','text'],'events_sponsor_intro'=>['Sponsor strip introduction','text'],'events_next_title'=>['Upcoming events heading','text'],
            'location_title'=>['Location section title','text'],'location_intro'=>['Location introduction','textarea'],'location_status'=>['Map event status','text'],'location_next_label'=>['Next event location label','text'],'location_venue_label'=>['Map venue label','text'],'location_date_label'=>['Map date label','text'],'location_hours_label'=>['Map hours label','text'],'location_getting_there_label'=>['Map arrival label','text'],'location_directions_label'=>['Directions link','text'],'location_open_map_label'=>['Open map link','text'],'location_copy_address_label'=>['Copy address button','text'],
            'booking_title'=>['Booking section title ({event} placeholder)','text'],'booking_intro'=>['Booking introduction ({max} placeholder)','textarea'],'booking_note'=>['Booking availability note','textarea'],'booking_spaces_free'=>['Available spaces label ({total} placeholder)','text'],'booking_countdown_label'=>['Countdown label','text'],'booking_countdown_now'=>['Countdown live status','text'],
            'how_title'=>['How it works title','text'],'how_choose_title'=>['Step 1 title','text'],'how_choose_text'=>['Step 1 description','textarea'],
            'how_pay_title'=>['Step 2 title','text'],'how_pay_text'=>['Step 2 description','textarea'],'how_visit_title'=>['Step 3 title','text'],'how_visit_text'=>['Step 3 description','textarea'],'how_visit_link'=>['Step 3 link label','text'],
            'sponsors_title'=>['Sponsors section title','text'],'sponsors_intro'=>['Sponsors introduction','textarea'],'sponsors_form_title'=>['Sponsor form title','text'],'sponsors_company_label'=>['Sponsor form: company label','text'],'sponsors_contact_label'=>['Sponsor form: contact label','text'],'sponsors_interest_label'=>['Sponsor form: interest label','text'],'sponsors_unsure_label'=>['Sponsor form: undecided option','text'],'sponsors_submit_label'=>['Sponsor form: submit button','text'],
            'faq_title'=>['FAQ title','text'],'faq_intro'=>['FAQ introduction','textarea'],'faq_ask_label'=>['Ask on WhatsApp button','text'],
            'terms_title'=>['Terms page title','text'],'terms_intro'=>['Terms page introduction','textarea'],'terms_download_label'=>['Official PDF download button','text'],
            'terms_agreement_intro_en'=>['Terms agreement introduction (English)','textarea'],'terms_agreement_intro_ar'=>['Terms agreement introduction (Arabic)','textarea'],
            'receipt_title'=>['Receipt page title','text'],'receipt_intro'=>['Receipt page introduction','textarea'],
            'footer_cta'=>['Footer call to action','text'],'footer_cta_reserve'=>['Reserve button label','text'],'footer_cta_contact'=>['Contact button label','text'],'footer_about'=>['Footer description','textarea'],
            'footer_next'=>['Next-event heading','text'],'footer_explore'=>['Explore heading','text'],'footer_contact'=>['Contact heading','text'],
            'footer_events_label'=>['Explore: Events link','text'],'footer_location_label'=>['Explore: Location link','text'],'footer_reserve_label'=>['Explore: Reserve link','text'],'footer_dashboard_label'=>['Explore: Dashboard link','text'],
            'footer_map_label'=>['Event: View map link','text'],'footer_whatsapp_label'=>['Contact: WhatsApp link','text'],'footer_instagram_label'=>['Contact: Instagram link','text'],'footer_tiktok_label'=>['Contact: TikTok link','text'],'footer_snapchat_label'=>['Contact: Snapchat link','text'],
            'footer_legal'=>['Copyright and location line','text'],'footer_back_to_top'=>['Back to top link','text'],
        ];
        $groups = [
            'Homepage'=>['hero_title','hero_intro','hero_reserve_label','hero_events_label','hero_map_label','hero_spaces_left','hero_ring_label'],
            'Events & location'=>['events_intro','events_status','events_reserve_label','events_map_label','events_sponsor_intro','events_next_title','location_title','location_intro','location_status','location_next_label','location_venue_label','location_date_label','location_hours_label','location_getting_there_label','location_directions_label','location_open_map_label','location_copy_address_label'],
            'Booking & visitor guide'=>['booking_title','booking_intro','booking_note','booking_spaces_free','booking_countdown_label','booking_countdown_now','how_title','how_choose_title','how_choose_text','how_pay_title','how_pay_text','how_visit_title','how_visit_text','how_visit_link'],
            'Sponsors & FAQ'=>['sponsors_title','sponsors_intro','sponsors_form_title','sponsors_company_label','sponsors_contact_label','sponsors_interest_label','sponsors_unsure_label','sponsors_submit_label','faq_title','faq_intro','faq_ask_label'],
            'Terms & receipt'=>['terms_title','terms_intro','terms_download_label','terms_agreement_intro_en','terms_agreement_intro_ar','receipt_title','receipt_intro'],
            'Footer'=>['footer_cta','footer_cta_reserve','footer_cta_contact','footer_about','footer_next','footer_explore','footer_contact','footer_events_label','footer_location_label','footer_reserve_label','footer_dashboard_label','footer_map_label','footer_whatsapp_label','footer_instagram_label','footer_tiktok_label','footer_snapchat_label','footer_legal','footer_back_to_top'],
        ];
        $body .= '<div class="page-intro"><p>Edit the public copy in one place. Choose a section below, make your changes, then use the save button to publish them.</p></div><form method="post" class="panel edit-form admin-save-form"><input type="hidden" name="action" value="save_copy"><div class="admin-tabs" role="tablist" aria-label="Website content sections">';
        $firstGroup = array_key_first($groups);
        foreach ($groups as $group=>$keys) $body .= '<button type="button" role="tab" id="tab-'.cms_h(substr(sha1($group),0,8)).'" aria-selected="'.($group===$firstGroup?'true':'false').'" data-admin-tab="'.cms_h(substr(sha1($group),0,8)).'">'.cms_h($group).'</button>';
        $body .= '</div>';
        foreach ($groups as $group=>$keys) {
            $tabId = substr(sha1($group),0,8);
            $body .= '<section class="admin-tab-panel" role="tabpanel" aria-labelledby="tab-'.$tabId.'" data-admin-panel="'.$tabId.'" '.($group===$firstGroup?'':'hidden').'><div class="tab-panel-head"><h3>'.cms_h($group).'</h3><p>Edit the text visitors see in this part of your website.</p></div><div class="field-grid">';
            foreach ($keys as $key) {
                [$label,$type] = $fields[$key];
                $value = $key === 'hero_title' ? ($site['home']['hero_title'] ?? '') : ($key === 'hero_intro' ? ($site['home']['hero_intro'] ?? '') : ($site['copy'][$key] ?? ''));
                $body .= admin_field('copy['.$key.']',$label,$value,$type);
            }
            $body .= '</div></section>';
        }
        $body .= admin_save_button($csrf).'</form>';
    } elseif ($page === 'events') {
        $e = $site['event'];
        $body .= '<div class="page-intro"><p>Update the current event and the event cards shown to visitors. Changes appear on the public website after saving.</p></div><form method="post" class="panel edit-form admin-save-form"><input type="hidden" name="action" value="save_event"><div class="admin-tabs" role="tablist" aria-label="Event editor"><button type="button" role="tab" id="tab-featured-event" aria-selected="true" data-admin-tab="featured-event">Current event</button><button type="button" role="tab" id="tab-upcoming-events" aria-selected="false" data-admin-tab="upcoming-events">Upcoming events</button></div><section class="admin-tab-panel" role="tabpanel" aria-labelledby="tab-featured-event" data-admin-panel="featured-event"><div class="tab-panel-head"><h3>Current event</h3><p>These details are used in the event banner, booking area, and visitor information.</p></div><div class="field-grid">';
        foreach ([['name','Event name'],['short_date','Short date'],['date','Full date'],['hours','Opening hours'],['venue','Venue'],['city','City'],['address','Map address'],['coordinates','Map coordinates'],['start','Countdown start (UAE time)','datetime-local'],['booth_price','Booth price (AED)','number'],['max_per_order','Maximum spaces per order','number'],['note','Arrival and parking information','textarea'],['description','Featured event description','textarea']] as $spec) $body .= admin_field('event['.$spec[0].']',$spec[1],$e[$spec[0]] ?? '',$spec[2] ?? 'text');
        $body .= '</div><div class="current-event-photo"><div><h3>Current event photo</h3><p>This is the image on the featured event tile on your public site. Choose an image from the library or use the original.</p></div>'.admin_media_select('event','Featured event photo',$site['appearance']['images']['event'] ?? 'photos/DSC04815.jpg',$site['media_library'] ?? [],'event[image]').'<a class="button secondary" href="/admin/media" target="_blank" rel="noopener"><i class="ph-light ph-upload-simple"></i> Upload a new image</a></div></section><section class="admin-tab-panel" role="tabpanel" aria-labelledby="tab-upcoming-events" data-admin-panel="upcoming-events" hidden><div class="tab-panel-head"><h3>Upcoming events</h3><p>Add or update the event cards visitors can browse.</p></div><div class="repeat-list event-repeat-list" data-repeat-list="upcoming">';
        foreach (($e['upcoming'] ?? []) as $i=>$item) $body .= admin_event_row((int)$i,$item,$site['media_library'] ?? []);
        $body .= '</div><template data-repeat-template="upcoming">'.admin_event_row('__INDEX__',[], $site['media_library'] ?? []).'</template><button type="button" class="button secondary add-row" data-add-row="upcoming"><i class="ph-light ph-plus"></i> Add event card</button></section>'.admin_save_button($csrf).'</form>';
    } elseif ($page === 'appearance') {
        $a = $site['appearance']; $body .= '<div class="page-intro"><p>Choose the site-wide theme and control the photos and brand assets used on the public site.</p></div><form method="post" class="panel edit-form" enctype="multipart/form-data"><input type="hidden" name="action" value="save_appearance"><div class="field-grid"><label class="field"><span>Default theme</span><select name="appearance[theme]">';
        foreach (['gulf'=>'Gulf','skyline'=>'Skyline','dune'=>'Dune','oasis'=>'Oasis','falcon'=>'Falcon','majlis'=>'Majlis','souq'=>'Souq','pearl'=>'Pearl','custom'=>'Custom colors'] as $value=>$label) $body .= '<option value="'.cms_h($value).'" '.(($a['theme'] ?? '')===$value?'selected':'').'>'.cms_h($label).'</option>';
        $body .= '</select></label>';
        $paletteMap=['gulf'=>['#0E2B2C','#F0B35C'],'skyline'=>['#101D3A','#6CC6FF'],'dune'=>['#EDE0C8','#A5481F'],'oasis'=>['#14301F','#B9D96A'],'falcon'=>['#23201D','#E2B04F'],'majlis'=>['#4B1E2B','#F2B94B'],'souq'=>['#B5532E','#F6C879'],'pearl'=>['#E9EFEC','#0E6B6B']];
        $themeName=$a['theme']??'gulf';$displayColors=$a['colors']??[];if(isset($paletteMap[$themeName])){$displayColors['panel']=$paletteMap[$themeName][0];$displayColors['accent']=$paletteMap[$themeName][1];$displayColors['surface']='#EFDFCB';$displayColors['background']='#FFFDFA';}
        foreach (['panel'=>'Brand panel','accent'=>'Accent','surface'=>'Page surface','background'=>'Page background'] as $key=>$label) $body .= '<label class="field color-field"><span>'.cms_h($label).'</span><input type="color" name="appearance[colors]['.cms_h($key).']" value="'.cms_h($displayColors[$key] ?? '#000000').'"></label>';
        $body .= '</div><div class="media-slots"><h3 class="form-section-title">Public site images</h3><p class="muted">Upload images in the Media Library, then choose them here.</p><div class="field-grid">';
        foreach (['logo'=>'AJ District logo','hero'=>'Homepage hero background','feature'=>'Homepage feature photo','booth'=>'Booth photo','aisle'=>'Aisle photo','event'=>'Featured event card'] as $key=>$label) $body .= admin_media_select($key,$label,$a['images'][$key] ?? '',$site['media_library'] ?? []);
        $body .= '</div></div>'.admin_save_button($csrf).'</form>';
    } elseif ($page === 'sections') {
        $labels = ['events'=>'Upcoming events','location'=>'Location map','booking'=>'Booking and space map','how'=>'How it works','sponsors'=>'Sponsors','faq'=>'Frequently asked questions','terms'=>'Exhibition terms','receipts'=>'Receipt generator'];
        $positions=['events','location','booking','how','sponsors','faq'];$order=$site['section_order']??$positions;$body .= '<div class="page-intro"><p>Choose the visible sections and their order on the homepage. Terms and receipts remain available from their own pages.</p></div><form method="post" class="panel edit-form"><input type="hidden" name="action" value="save_sections"><div class="toggle-list">';
        foreach($labels as $key=>$label) { $body .= '<label class="toggle-row"><span><b>'.cms_h($label).'</b><small>'.(in_array($key,$positions,true)?'Show this section on the public website':'Keep this standalone page available').'</small></span><input type="checkbox" name="sections['.cms_h($key).']" value="1" '.(($site['sections'][$key] ?? true)?'checked':'').'><i></i></label>'; if(in_array($key,$positions,true)) { $currentPosition=(int)($site['section_positions'][$key]??(array_search($key,$order,true)+1)); $body .= '<label class="field order-field"><span>'.cms_h($label).' position</span><select name="section_order['.cms_h($key).']">'; foreach(range(1,count($positions)) as $number) $body .= '<option value="'.$number.'" '.($currentPosition===$number?'selected':'').'>'.$number.'</option>'; $body .= '</select></label>'; } }
        $body .= '</div>'.admin_save_button($csrf).'</form>';
    } elseif ($page === 'faq') {
        $body .= '<div class="page-intro"><p>Add, edit, or remove visitor questions. The site displays each answer in an expandable item.</p></div><form method="post" class="panel edit-form"><input type="hidden" name="action" value="save_faq"><div class="repeat-list" data-repeat-list="faq">';
        foreach (($site['faq'] ?? []) as $i=>$item) $body .= admin_faq_row((int)$i,$item);
        $body .= '</div><template data-repeat-template="faq">'.admin_faq_row('__INDEX__',[]).'</template><button type="button" class="button secondary add-row" data-add-row="faq"><i class="ph-light ph-plus"></i> Add question</button>'.admin_save_button($csrf).'</form>';
    } elseif ($page === 'sponsors') {
        $body .= '<div class="page-intro"><p>Manage sponsorship packages and the logo-strip labels shown on the public site.</p></div><form method="post" class="panel edit-form"><input type="hidden" name="action" value="save_sponsors"><div class="repeat-list" data-repeat-list="tiers">';
        foreach (($site['sponsors']['tiers'] ?? []) as $i=>$item) $body .= admin_sponsor_row((int)$i,$item);
        $body .= '</div><template data-repeat-template="tiers">'.admin_sponsor_row('__INDEX__',[]).'</template><button type="button" class="button secondary add-row" data-add-row="tiers"><i class="ph-light ph-plus"></i> Add sponsorship tier</button><h3 class="form-section-title">Sponsor strip</h3>'.admin_field('showcase[0]','Sponsor label 1',$site['sponsors']['showcase'][0] ?? '').admin_field('showcase[1]','Sponsor label 2',$site['sponsors']['showcase'][1] ?? '').admin_field('showcase[2]','Sponsor label 3',$site['sponsors']['showcase'][2] ?? '').admin_save_button($csrf).'</form>';
    } elseif ($page === 'terms') {
        $terms = $site['terms'];
        $body .= '<div class="page-intro"><p>Edit the bilingual participant agreement displayed on the Terms page. Keep each clause in the same order in both languages.</p></div><form method="post" class="panel edit-form"><input type="hidden" name="action" value="save_terms">'.admin_field('terms[acceptance_en]','Participant acknowledgment (English)',$terms['acceptance_en'] ?? '','textarea').admin_field('terms[acceptance_ar]','Participant acknowledgment (Arabic)',$terms['acceptance_ar'] ?? '','textarea').'<div class="repeat-list" data-repeat-list="clauses">';
        foreach (($terms['clauses'] ?? []) as $i=>$clause) $body .= admin_term_row((int)$i,$clause);
        $body .= '</div><template data-repeat-template="clauses">'.admin_term_row('__INDEX__',[]).'</template><button type="button" class="button secondary add-row" data-add-row="clauses"><i class="ph-light ph-plus"></i> Add clause</button>'.admin_save_button($csrf).'</form>';
    } elseif ($page === 'media') {
        $body .= '<div class="page-intro"><p>Upload JPG, PNG, WEBP, or GIF images up to 8 MB. Files are kept outside the public folder and served through the protected media route.</p></div><form method="post" enctype="multipart/form-data" class="panel upload-panel"><input type="hidden" name="action" value="upload_media"><input type="hidden" name="_csrf" value="'.cms_h($csrf).'"><label class="upload-drop"><i class="ph-light ph-cloud-arrow-up"></i><b>Select images to upload</b><span>Maximum 8 MB per image</span><input type="file" name="media_files[]" accept="image/jpeg,image/png,image/webp,image/gif" multiple required></label><div class="upload-preview-grid" aria-live="polite" hidden></div><button class="button primary" type="submit">Upload to media library</button></form><div class="media-grid">';
        foreach (($site['media_library'] ?? []) as $media) $body .= '<article class="media-card"><img src="'.cms_h($media['path'] ?? '').'" alt=""><div><b>'.cms_h($media['name'] ?? '').'</b><small>'.number_format(((int)($media['size'] ?? 0))/1024).' KB · '.cms_h($media['mime'] ?? '').'</small></div><form method="post" onsubmit="return confirm(\'Delete this image? Any active image slot will revert to its original image.\')"><input type="hidden" name="action" value="delete_media"><input type="hidden" name="_csrf" value="'.cms_h($csrf).'"><input type="hidden" name="media_id" value="'.cms_h($media['id'] ?? '').'"><button class="icon-button danger media-delete" title="Delete image" aria-label="Delete image" type="submit"><i class="ph-light ph-trash"></i><span>Delete</span></button></form></article>';
        if (empty($site['media_library'])) $body .= '<div class="empty-state"><i class="ph-light ph-image"></i><b>Your library is empty</b><span>Upload your first image above.</span></div>';
        $body .= '</div>';
    } elseif ($page === 'settings') {
        $s = $site['site']; $body .= '<div class="page-intro"><p>Configure site identity, SEO, social profiles, external links, and navigation labels.</p></div><form method="post" class="panel edit-form"><input type="hidden" name="action" value="save_settings"><h3 class="form-section-title">Site identity &amp; social profiles</h3><div class="field-grid">'.admin_field('site[name]','Website name',$s['name'] ?? '').admin_field('site[logo_alt]','Logo description',$s['logo_alt'] ?? '').admin_field('site[meta_description]','Search description',$s['meta_description'] ?? '','textarea').admin_field('site[contact][whatsapp]','WhatsApp number (country code first)',$s['contact']['whatsapp'] ?? '').admin_field('site[contact][instagram]','Instagram URL',$s['contact']['instagram'] ?? '').admin_field('site[contact][tiktok]','TikTok URL',$s['contact']['tiktok'] ?? '').admin_field('site[contact][snapchat]','Snapchat URL',$s['contact']['snapchat'] ?? '');
        $body .= '</div><h3 class="form-section-title">Other external links</h3><div class="field-grid">'.admin_field('site[links][terms_pdf]','Official terms PDF link (URL or site path)',$s['links']['terms_pdf'] ?? '').admin_field('site[links][external_label]','Additional footer link label',$s['links']['external_label'] ?? '').admin_field('site[links][external_url]','Additional footer link URL',$s['links']['external_url'] ?? '').'</div><h3 class="form-section-title">Navigation labels</h3><div class="field-grid">';
        foreach (($s['navigation'] ?? []) as $key=>$label) $body .= admin_field('site[navigation]['.$key.']','Navigation label: '.ucfirst($key),$label);
        $body .= '</div>'.admin_save_button($csrf).'</form><div class="panel backup-panel"><div><h3>Site backup</h3><p>Download a copy of your full content configuration, including event cards, FAQs, sponsors, terms, theme settings, and media references.</p></div><a class="button secondary" href="/admin/export"><i class="ph-light ph-download-simple"></i> Export site data</a><form method="post" enctype="multipart/form-data"><input type="hidden" name="action" value="import_site"><input type="hidden" name="_csrf" value="'.cms_h($csrf).'"><label class="button secondary import-button">Import JSON backup<input type="file" name="site_json" accept="application/json,.json" required></label><button class="button primary" type="submit">Restore backup</button></form></div>'.admin_translation_panel($csrf);
    }
    admin_shell($page, $title, $body, $flash, $site);
}

function admin_event_row(int|string $i, array $item, array $library = []): string {
    $base='event[upcoming]['.$i.']';$value=(string)($item['img'] ?? '');$image=$value==='__none__'?'':(admin_event_image_src($value)?:'/photos/DSC04685.jpg');$preview='<img src="'.cms_h($image).'" alt="Event card image preview"'.($image===''?' hidden':'').'><span class="image-preview-empty"'.($image===''?'':' hidden').'>'.($image===''?'No image assigned':'Preview unavailable').'</span>';$name=$base.'[img]';
    $photo='<label class="field"><span>Event card photo</span><select name="'.cms_h($name).'" data-event-image-select><option value="" '.($value===''?'selected':'').'>Use default event photo (DSC04685)</option><option value="__none__" '.($value==='__none__'?'selected':'').'>Remove photo from this card</option>';
    foreach(glob(__DIR__.'/../photos/*.jpg')?:[] as $file){$photoName=pathinfo($file,PATHINFO_FILENAME);$photo.='<option value="'.cms_h($photoName).'" '.($value===$photoName?'selected':'').'>'.cms_h($photoName).'</option>';}
    foreach($library as $media){$mediaPath=(string)($media['path']??'');if($mediaPath==='')continue;$photo.='<option value="'.cms_h($mediaPath).'" '.($value===$mediaPath?'selected':'').'>'.cms_h($media['name']??'Uploaded image').'</option>';}
    if($value!==''&&!str_starts_with($value,'/media/')&&!preg_match('/^[A-Za-z0-9_-]+$/',pathinfo($value,PATHINFO_FILENAME)))$photo.='<option value="'.cms_h($value).'" selected>Current photo</option>';
    $photo.='</select><small>Choose a library photo. Upload new images in the Media Library.</small></label>';
    return '<fieldset class="repeat-card event-repeat-card"><legend>Upcoming event</legend><button class="remove-row" type="button" aria-label="Remove event card"><i class="ph-light ph-x"></i></button><div class="event-card-top"><div class="event-image-preview">'.$preview.'</div>'.$photo.'</div><div class="field-grid">'.admin_field($base.'[t]','Event name',$item['t'] ?? '').admin_field($base.'[tag]','Status label',$item['tag'] ?? '').'<label class="field"><span>Category</span><select name="'.cms_h($base.'[c]').'">'.admin_option('market','Market',$item['c'] ?? '').admin_option('expo','Expo',$item['c'] ?? '').admin_option('seasonal','Seasonal',$item['c'] ?? '').'</select></label>'.admin_field($base.'[d][0]','Date range',$item['d'][0] ?? '').admin_field($base.'[d][1]','Month',$item['d'][1] ?? '').admin_field($base.'[p]','Location',$item['p'] ?? '').admin_field($base.'[x]','Description',$item['x'] ?? '','textarea').'</div></fieldset>';
}
function admin_faq_row(int|string $i, array $item): string {
    $base='faq['.$i.']';return '<fieldset class="repeat-card"><legend>Question</legend><button class="remove-row" type="button" aria-label="Remove question"><i class="ph-light ph-x"></i></button>'.admin_field($base.'[q]','Question',$item['q'] ?? '').admin_field($base.'[a]','Answer',$item['a'] ?? '','textarea').'</fieldset>';
}
function admin_sponsor_row(int|string $i, array $item): string {
    $base='tiers['.$i.']';return '<fieldset class="repeat-card"><legend>Sponsorship package</legend><button class="remove-row" type="button" aria-label="Remove package"><i class="ph-light ph-x"></i></button><div class="field-grid">'.admin_field($base.'[title]','Package title',$item['title'] ?? '').admin_field($base.'[icon]','Phosphor icon name',$item['icon'] ?? 'seal-check').admin_field($base.'[benefits_text]','Benefits (one per line)',implode("\n",$item['benefits'] ?? []),'textarea').'</div></fieldset>';
}
function admin_term_row(int|string $i, array $item): string {
    $base='terms[clauses]['.$i.']';return '<fieldset class="repeat-card"><legend>Clause '.(is_int($i)?$i+1:'').'</legend><button class="remove-row" type="button" aria-label="Remove clause"><i class="ph-light ph-x"></i></button><div class="field-grid">'.admin_field($base.'[en]','English heading',$item['en'] ?? '').admin_field($base.'[ar]','Arabic heading',$item['ar'] ?? '').admin_field($base.'[en_text]','English text (one paragraph or bullet per line)',$item['en_text'] ?? '','textarea').admin_field($base.'[ar_text]','Arabic text (one paragraph or bullet per line)',$item['ar_text'] ?? '','textarea').'</div></fieldset>';
}
function admin_media_select(string $key, string $label, string $value, array $library, string $fieldName = ''): string {
    $name=$fieldName!==''?$fieldName:'appearance[images]['.$key.']';$defaults=['logo'=>'logos/AJ-white@4x.png','hero'=>'photos/DSC04670.jpg','feature'=>'photos/DSC04639.jpg','booth'=>'photos/DSC04620.jpg','aisle'=>'photos/DSC04553.jpg','event'=>'photos/DSC04815.jpg'];$defaultSrc=admin_image_url($defaults[$key] ?? '');$previewSrc=$value==='__none__'?'':admin_image_url($value!==''?$value:($defaults[$key] ?? ''));$html='<label class="field image-picker-field"><span>'.cms_h($label).'</span><select name="'.cms_h($name).'" data-image-preview-select data-default-src="'.cms_h($defaultSrc).'"><option value="">Use original site image</option><option value="__none__" '.($value==='__none__'?'selected':'').'>Remove image from this section</option>';
    foreach (($library ?? []) as $media) $html .= '<option value="'.cms_h($media['path'] ?? '').'" '.(($media['path'] ?? '')===$value?'selected':'').'>'.cms_h($media['name'] ?? 'Uploaded image').'</option>';
    if (!str_starts_with($value,'/media/') && $value!=='' && $value!=='__none__') $html .= '<option value="'.cms_h($value).'" selected>Current: '.cms_h(basename($value)).'</option>';
    $noImage=$value==='__none__';return $html.'</select><div class="image-picker-preview"><img src="'.cms_h($previewSrc).'" alt="'.cms_h($label).' preview"'.($noImage?' hidden':'').'><span class="image-preview-empty"'.($noImage?'':' hidden').'>'.($noImage?'Image removed from this section':'Preview unavailable').'</span></div></label>';
}
function admin_image_url(string $path): string { if($path===''||$path==='__none__')return ''; if(preg_match('~^https?://~i',$path)||str_starts_with($path,'/'))return $path; return '/'.ltrim($path,'/'); }
function admin_event_image_src(string $filename): string { if(str_starts_with($filename,'/media/')){$id=basename($filename);return preg_match('/^[A-Za-z0-9_.-]+$/',$id)&&cms_media_path($id)?'/media/'.$id:'';} $filename=pathinfo(basename(trim($filename)),PATHINFO_FILENAME); if($filename===''||!preg_match('/^[A-Za-z0-9_-]+$/',$filename))return ''; return is_file(__DIR__.'/../photos/'.$filename.'.jpg')?'/photos/'.$filename.'.jpg':''; }
function admin_option(string $value,string $label,string $selected):string{return '<option value="'.cms_h($value).'" '.($selected===$value?'selected':'').'>'.cms_h($label).'</option>';}

function admin_translation_panel(string $csrf): string
{
    $provider  = translate_provider();
    $googleKey = translate_api_key();
    $openaiKey = translate_openai_key();
    $cacheFile = translate_cache_file();
    $cacheSize = is_file($cacheFile) ? count((array)(json_decode((string)file_get_contents($cacheFile), true) ?: [])) : 0;

    $statusHtml = match ($provider) {
        'free_mymemory' => '<span style="color:var(--green,#2a9d50)"><i class="ph-light ph-check-circle"></i> Active: Free Instant Translation (No API Key Required)</span>',
        'google_cloud' => ($googleKey !== ''
            ? '<span style="color:var(--green,#2a9d50)"><i class="ph-light ph-check-circle"></i> Active: Google Cloud Translation v3 (' . cms_h(substr($googleKey, 0, 6) . '••••') . ')</span>'
            : '<span style="color:var(--warn,#c05000)"><i class="ph-light ph-warning"></i> Google Cloud selected, but no API key provided.</span>'),
        'openai' => ($openaiKey !== ''
            ? '<span style="color:var(--green,#2a9d50)"><i class="ph-light ph-check-circle"></i> Active: OpenAI GPT Model (' . cms_h(substr($openaiKey, 0, 6) . '••••') . ')</span>'
            : '<span style="color:var(--warn,#c05000)"><i class="ph-light ph-warning"></i> OpenAI selected, but no API key provided.</span>'),
        default => '<span style="color:var(--green,#2a9d50)"><i class="ph-light ph-check-circle"></i> Active: Free Instant Translation</span>',
    };

    $html  = '<div class="panel backup-panel" style="margin-top:24px">';
    $html .= '<div><h3>Automatic Arabic Translation</h3>';
    $html .= '<p>Translate website copy automatically into Arabic. Translations are cached locally (' . $cacheSize . ' strings in cache) so subsequent saves are fast and incur no extra calls.</p>';
    $html .= '<p>' . $statusHtml . '</p></div>';

    // ── Translation Settings Form ─────────────────────────────────────────
    $html .= '<form method="post" class="edit-form" style="width:100%">';
    $html .= '<input type="hidden" name="action" value="save_translate_settings">';
    $html .= '<input type="hidden" name="_csrf" value="' . cms_h($csrf) . '">';

    $html .= '<label class="field"><span>Translation Engine / Provider</span>';
    $html .= '<select name="translate[provider]">';
    $html .= '<option value="free_mymemory"' . ($provider === 'free_mymemory' ? ' selected' : '') . '>Free Instant Translation (Default - No API Key Needed)</option>';
    $html .= '<option value="google_cloud"' . ($provider === 'google_cloud' ? ' selected' : '') . '>Google Cloud Translation API v3 (Official API Key)</option>';
    $html .= '<option value="openai"' . ($provider === 'openai' ? ' selected' : '') . '>OpenAI (GPT-4o-mini / Context-Aware Arabic)</option>';
    $html .= '</select>';
    $html .= '<small>Select <strong>Free Instant Translation</strong> if you do not have an API key. You can switch to Google Cloud or OpenAI anytime.</small>';
    $html .= '</label>';

    $html .= '<div class="field-grid" style="margin-top:12px">';
    $html .= '<label class="field"><span>Google Cloud API Key (Optional)</span>';
    $html .= '<input type="password" name="translate[google_api_key]" value="' . cms_h($googleKey) . '" autocomplete="off" placeholder="AIzaSy...">';
    $html .= '<small>Only required if using Google Cloud Translation provider.</small>';
    $html .= '</label>';

    $html .= '<label class="field"><span>OpenAI API Key (Optional)</span>';
    $html .= '<input type="password" name="translate[openai_api_key]" value="' . cms_h($openaiKey) . '" autocomplete="off" placeholder="sk-...">';
    $html .= '<small>Only required if using OpenAI translation provider.</small>';
    $html .= '</label>';
    $html .= '</div>';

    $html .= '<div class="form-actions"><span>Save to apply translation settings.</span>';
    $html .= '<div class="form-actions-buttons">';
    $html .= '<button class="button primary" type="submit"><i class="ph-light ph-floppy-disk"></i> Save Translation Settings</button>';
    $html .= '</div></div></form>';

    // ── Re-translate button ───────────────────────────────────────────────
    $html .= '<form method="post" style="margin-top:14px;border-top:1px solid rgba(0,0,0,0.08);padding-top:14px">';
    $html .= '<input type="hidden" name="action" value="retranslate_site">';
    $html .= '<input type="hidden" name="_csrf" value="' . cms_h($csrf) . '">';
    $html .= '<button class="button secondary" type="submit"><i class="ph-light ph-translate"></i> Translate all content to Arabic now</button>';
    $html .= '<small style="display:block;margin-top:6px;color:#888">Runs all CMS content through the active translation provider and refreshes the Arabic site content.</small>';
    $html .= '</form>';

    $html .= '</div>';
    return $html;
}
