/* ═══════════════════════════════════════
   ZONE CONFIGURATOR
   Interactive zone composition tool.
   Select jurisdiction, toggle primitives
   and modules, watch zone.yaml render
   in real time. Shareable via URL hash.
   ═══════════════════════════════════════ */

(function () {
  'use strict';

  /* ══════════════════════════════════════
     DATA
     ══════════════════════════════════════ */

  var PRESETS = [
    {
      id: 'gulf-financial',
      name: 'Gulf Financial Hub',
      detail: 'ADGM / DIFC model',
      jurisdiction: 'ae-abudhabi-adgm',
      jurisdictionName: 'ADGM Abu Dhabi',
      framework: 'FSRA',
      region: 'Gulf',
      primitives: [1, 1, 1, 1, 1],
      modules: [1, 1, 1, 1, 1, 1, 1, 1],
      tier: 'enhanced'
    },
    {
      id: 'caribbean-structure',
      name: 'Offshore Structure',
      detail: 'Cayman / BVI model',
      jurisdiction: 'ky',
      jurisdictionName: 'Cayman Islands',
      framework: 'CIMA',
      region: 'Caribbean',
      primitives: [1, 1, 1, 0, 1],
      modules: [1, 1, 0, 0, 1, 1, 0, 0],
      tier: 'standard'
    },
    {
      id: 'emerging-market',
      name: 'Emerging Market',
      detail: 'Pakistan / Rwanda model',
      jurisdiction: 'pk-sifc',
      jurisdictionName: 'Pakistan SIFC',
      framework: 'PDA/SIFC',
      region: 'South Asia',
      primitives: [1, 1, 1, 1, 1],
      modules: [1, 1, 1, 1, 0, 1, 1, 0],
      tier: 'maximum'
    },
    {
      id: 'innovation-hub',
      name: 'Innovation Hub',
      detail: 'Singapore / Prospera model',
      jurisdiction: 'sg',
      jurisdictionName: 'Singapore',
      framework: 'MAS',
      region: 'APAC',
      primitives: [1, 1, 1, 1, 1],
      modules: [1, 1, 1, 1, 1, 1, 1, 1],
      tier: 'enhanced'
    },
    {
      id: 'trade-corridor',
      name: 'Trade Corridor',
      detail: 'Kazakhstan / Seychelles model',
      jurisdiction: 'kz-alatau',
      jurisdictionName: 'Alatau City, Kazakhstan',
      framework: 'AIFC/NCA',
      region: 'Central Asia',
      primitives: [1, 1, 0, 1, 1],
      modules: [1, 1, 1, 0, 0, 1, 1, 0],
      tier: 'enhanced'
    },
    {
      id: 'us-fl-mtl',
      name: 'US State MTL',
      detail: 'Florida OFR model',
      jurisdiction: 'us-fl',
      jurisdictionName: 'Florida',
      framework: 'FL OFR/SunBiz',
      region: 'Americas',
      primitives: [1, 1, 1, 1, 1],
      modules: [1, 1, 1, 1, 1, 1, 1, 1],
      tier: 'maximum'
    },
    {
      id: 'free-zone-network',
      name: 'Free Zone Network',
      detail: 'Dubai FZC model',
      jurisdiction: 'ae-dubai-fzc',
      jurisdictionName: 'Dubai Free Zone Council',
      framework: 'DFZC',
      region: 'Gulf',
      primitives: [1, 1, 1, 1, 1],
      modules: [1, 1, 1, 1, 1, 1, 1, 1],
      tier: 'maximum'
    }
  ];

  var PRIMITIVES = [
    { id: 'entities',    name: 'Entities',    syscall: '/dev/entities',    desc: 'Incorporation, amendments, dissolution, registry state' },
    { id: 'ownership',   name: 'Ownership',   syscall: '/dev/ownership',   desc: 'Cap tables, beneficial ownership, transfers, encumbrances' },
    { id: 'fiscal', name: 'Fiscal', syscall: '/dev/fiscal', desc: 'Treasury, accounts, payments, withholding, tax events' },
    { id: 'identity',    name: 'Identity',    syscall: '/dev/identity',    desc: 'KYC/KYB, identity passports, attestations, risk tiers' },
    { id: 'consent',     name: 'Consent',     syscall: '/dev/consent',     desc: 'Signatures, resolutions, approvals, delegated authority' }
  ];

  var MODULE_GROUPS = [
    {
      id: 'entity_formation',
      name: 'Entity Formation',
      modules: [
        { id: 'corporate_registry',    name: 'corporate-registry',    desc: 'Entity registration and public registry' },
        { id: 'formation_engine',      name: 'formation-engine',      desc: 'Automated formation workflows' },
        { id: 'beneficial_ownership',  name: 'beneficial-ownership',  desc: 'UBO disclosure and verification' },
        { id: 'dissolution_lifecycle', name: 'dissolution-lifecycle', desc: '10-stage dissolution state machine' }
      ]
    },
    {
      id: 'financial_services',
      name: 'Financial Services',
      modules: [
        { id: 'banking_core',       name: 'banking-core',       desc: 'Account opening, KYB, compliance checks' },
        { id: 'payment_rails',      name: 'payment-rails',      desc: 'Domestic and cross-border payments' },
        { id: 'fx_settlement',      name: 'fx-settlement',      desc: 'Multi-currency exchange and settlement' },
        { id: 'treasury_management', name: 'treasury-management', desc: 'Cash management and reporting' }
      ]
    },
    {
      id: 'licensing',
      name: 'Licensing and Permits',
      modules: [
        { id: 'business_license',   name: 'business-license',   desc: 'Activity-based license issuance' },
        { id: 'professional_cert',  name: 'professional-cert',  desc: 'Professional certification tracking' },
        { id: 'activity_permits',   name: 'activity-permits',   desc: 'Operational permits and renewals' },
        { id: 'renewal_tracking',   name: 'renewal-tracking',   desc: 'Automated renewal and expiry alerts' }
      ]
    },
    {
      id: 'identity_kyc',
      name: 'Identity and KYC',
      modules: [
        { id: 'identity_verification', name: 'identity-verification', desc: 'Document verification and biometrics' },
        { id: 'kyb_pipeline',          name: 'kyb-pipeline',          desc: 'Business verification workflows' },
        { id: 'risk_scoring',          name: 'risk-scoring',          desc: 'Risk tier computation and monitoring' },
        { id: 'attestation_service',   name: 'attestation-service',   desc: 'Verifiable credential issuance' }
      ]
    },
    {
      id: 'capital_markets',
      name: 'Capital Markets',
      modules: [
        { id: 'securities_reg',   name: 'securities-registration', desc: 'Securities classification and registration' },
        { id: 'cap_table',        name: 'cap-table',               desc: 'Cap table management and transfers' },
        { id: 'transfer_agent',   name: 'transfer-agent',          desc: 'Digital transfer agent operations' },
        { id: 'fund_admin',       name: 'fund-administration',     desc: 'Fund NAV, subscriptions, redemptions' }
      ]
    },
    {
      id: 'tax_reporting',
      name: 'Tax and Reporting',
      modules: [
        { id: 'tax_computation',     name: 'tax-computation',     desc: 'Withholding and liability calculation' },
        { id: 'treaty_application',   name: 'treaty-application',   desc: 'Double taxation treaty automation' },
        { id: 'regulatory_reporting', name: 'regulatory-reporting', desc: 'Automated regulatory filings' },
        { id: 'audit_trail',          name: 'audit-trail',          desc: 'Immutable audit log generation' }
      ]
    },
    {
      id: 'corridor',
      name: 'Corridor Infrastructure',
      modules: [
        { id: 'cross_border',     name: 'cross-border-settlement', desc: 'Inter-zone asset and entity transfer' },
        { id: 'corridor_receipts', name: 'corridor-receipts',       desc: 'Content-addressed transit proofs' },
        { id: 'watcher_network',   name: 'watcher-network',         desc: 'Multi-party attestation and slashing' },
        { id: 'arbitration_engine', name: 'arbitration-engine',     desc: 'Dispute resolution and award enforcement' }
      ]
    },
    {
      id: 'smart_asset',
      name: 'Smart Asset Runtime',
      modules: [
        { id: 'asset_vm',          name: 'asset-vm',          desc: 'Smart Asset virtual machine' },
        { id: 'compliance_tensor', name: 'compliance-tensor', desc: '23-domain compliance evaluation' },
        { id: 'migration_engine',  name: 'migration-engine',  desc: 'Cross-jurisdiction asset migration' },
        { id: 'anchor_service',    name: 'anchor-service',    desc: 'Settlement anchoring and finality proofs' }
      ]
    }
  ];

  var TIERS = [
    { id: 'standard', name: 'Standard', domains: 8, desc: 'Core: AML, KYC, sanctions, tax, corporate, securities, custody, data privacy' },
    { id: 'enhanced', name: 'Enhanced', domains: 14, desc: '+ Banking, licensing, payments, digital assets, arbitration, consumer protection' },
    { id: 'maximum',  name: 'Maximum',  domains: 23, desc: 'Full 23-domain compliance tensor' }
  ];

  var DOMAIN_NAMES = {
    standard: ['aml', 'corporate', 'custody', 'data_privacy', 'kyc', 'sanctions', 'securities', 'tax'],
    enhanced: ['aml', 'arbitration', 'banking', 'consumer_protection', 'corporate', 'custody', 'data_privacy', 'digital_assets', 'kyc', 'licensing', 'payments', 'sanctions', 'securities', 'tax'],
    maximum:  ['aml', 'anti_bribery', 'arbitration', 'banking', 'clearing', 'consumer_protection', 'corporate', 'custody', 'data_privacy', 'digital_assets', 'employment', 'immigration', 'insurance', 'ip', 'kyc', 'licensing', 'payments', 'sanctions', 'securities', 'settlement', 'sharia', 'tax', 'trade']
  };

  var CORRIDOR_CONNECTIONS = {
    'ae-abudhabi-adgm': ['sg', 'hk', 'gb', 'ky', 'us'],
    'ky':               ['us', 'vg', 'ae-abudhabi-adgm', 'sg', 'us-fl'],
    'pk-sifc':          ['ae-abudhabi-adgm', 'sg', 'hk', 'gb'],
    'sg':               ['hk', 'ae-abudhabi-adgm', 'gb', 'jp', 'au'],
    'kz-alatau':        ['ae-abudhabi-adgm', 'sg', 'cn-hangzhou'],
    'ae-dubai-fzc':     ['ae-abudhabi-adgm', 'sg', 'hk', 'gb', 'pk-sifc', 'ky'],
    'us-fl':            ['us', 'ky', 'vg', 'br-rio', 'prospera']
  };

  var CORRIDOR_COMMENTS = {
    'sg': 'Singapore (MAS)',
    'hk': 'Hong Kong (SFC)',
    'gb': 'London (FCA)',
    'ky': 'Cayman (CIMA)',
    'vg': 'BVI (FSC)',
    'us': 'United States (FinCEN)',
    'ae-abudhabi-adgm': 'ADGM (FSRA)',
    'ae-dubai-fzc': 'Dubai FZC',
    'jp': 'Japan (FSA)',
    'au': 'Australia (ASIC)',
    'pk-sifc': 'Pakistan (SIFC)',
    'cn-hangzhou': 'Hangzhou',
    'us-fl': 'Florida (OFR)',
    'br-rio': 'Rio de Janeiro',
    'prospera': 'Prospera (ZEDE)'
  };


  /* ══════════════════════════════════════
     STATE
     ══════════════════════════════════════ */

  var state = {
    preset: 0,
    primitives: [1, 1, 1, 1, 1],
    modules: [1, 1, 1, 1, 1, 1, 1, 1],  /* group-level enabled */
    moduleDetails: {},                    /* individual module overrides: 'group_id.module_id' -> 0|1 */
    tier: 'enhanced'
  };


  /* ══════════════════════════════════════
     DOM REFS
     ══════════════════════════════════════ */

  var presetsEl, primitivesEl, modulesEl, tiersEl, yamlEl, summaryEl;
  var shareBtn, copyBtn;


  /* ══════════════════════════════════════
     RENDERING: Controls
     ══════════════════════════════════════ */

  function renderPresets() {
    var html = '';
    for (var i = 0; i < PRESETS.length; i++) {
      var p = PRESETS[i];
      var cls = i === state.preset ? ' active' : '';
      html += '<button type="button" class="configure-preset' + cls + '" data-idx="' + i + '" role="radio" aria-checked="' + (i === state.preset) + '">';
      html += '<span class="configure-preset-name">' + esc(p.name) + '</span>';
      html += '<span class="configure-preset-detail">' + esc(p.detail) + '</span>';
      html += '</button>';
    }
    presetsEl.innerHTML = html;
  }

  function renderPrimitives() {
    var html = '';
    for (var i = 0; i < PRIMITIVES.length; i++) {
      var p = PRIMITIVES[i];
      var active = state.primitives[i] ? ' active' : '';
      html += '<div class="configure-toggle' + active + '" data-idx="' + i + '" role="switch" aria-checked="' + !!state.primitives[i] + '" tabindex="0">';
      html += '<div class="configure-toggle-info">';
      html += '<span class="configure-toggle-name">' + esc(p.name) + '</span>';
      html += '<span class="configure-toggle-syscall">' + esc(p.syscall) + '</span>';
      html += '</div>';
      html += '<div class="configure-toggle-indicator"></div>';
      html += '</div>';
    }
    primitivesEl.innerHTML = html;
  }

  function renderModules() {
    var html = '';
    for (var g = 0; g < MODULE_GROUPS.length; g++) {
      var group = MODULE_GROUPS[g];
      var enabled = state.modules[g];
      var openClass = '';
      var activeCount = 0;

      if (enabled) {
        for (var m = 0; m < group.modules.length; m++) {
          var key = group.id + '.' + group.modules[m].id;
          var on = state.moduleDetails[key] !== undefined ? state.moduleDetails[key] : 1;
          if (on) activeCount++;
        }
      }

      html += '<div class="configure-group' + openClass + '" data-gidx="' + g + '">';
      html += '<div class="configure-group-header" role="button" tabindex="0" aria-expanded="false">';
      html += '<span class="configure-group-name">' + esc(group.name) + '</span>';
      html += '<span class="configure-group-count">' + (enabled ? activeCount + '/' + group.modules.length : 'off') + '</span>';
      html += '</div>';
      html += '<div class="configure-group-modules">';

      for (var n = 0; n < group.modules.length; n++) {
        var mod = group.modules[n];
        var mkey = group.id + '.' + mod.id;
        var mOn = enabled && (state.moduleDetails[mkey] !== undefined ? state.moduleDetails[mkey] : 1);
        html += '<div class="configure-module' + (mOn ? ' active' : '') + '" data-gidx="' + g + '" data-midx="' + n + '" role="checkbox" aria-checked="' + !!mOn + '" tabindex="0">';
        html += '<span class="configure-module-check">\u2713</span>';
        html += '<span class="configure-module-name">' + esc(mod.name) + '</span>';
        html += '</div>';
      }

      html += '</div></div>';
    }
    modulesEl.innerHTML = html;
  }

  function renderTiers() {
    var html = '';
    for (var i = 0; i < TIERS.length; i++) {
      var t = TIERS[i];
      var cls = t.id === state.tier ? ' active' : '';
      html += '<button type="button" class="configure-tier' + cls + '" data-tier="' + t.id + '" role="radio" aria-checked="' + (t.id === state.tier) + '">';
      html += '<span class="configure-tier-name">' + esc(t.name) + '</span>';
      html += '<span class="configure-tier-domains">' + t.domains + ' domains</span>';
      html += '</button>';
    }
    tiersEl.innerHTML = html;
  }


  /* ══════════════════════════════════════
     RENDERING: YAML
     ══════════════════════════════════════ */

  function renderYaml() {
    var p = PRESETS[state.preset];
    var lines = [];

    /* Header comment */
    lines.push(c('# Zone Manifest: ' + p.jurisdictionName));
    lines.push(c('# Generated by Momentum Zone Configurator'));
    lines.push(c('# dev.momentum.inc/configure'));
    lines.push('');

    /* zone_id — convert jurisdiction dashes to dots */
    var zoneIdSuffix = p.jurisdiction.replace(/-/g, '.');
    lines.push(kv('zone_id', 'org.momentum.mez.zone.' + zoneIdSuffix));
    lines.push(kv('jurisdiction_id', p.jurisdiction));
    lines.push(kv('zone_name', '"' + p.jurisdictionName + ' Economic Zone"'));
    lines.push('');

    /* profile */
    lines.push(sec('profile:'));
    lines.push(kv('  id', 'org.momentum.mez.profile.sovereign-govos'));
    lines.push(kv('  version', '"0.4.44"'));
    lines.push('');

    /* jurisdiction_stack — build from jurisdiction ID segments */
    lines.push(sec('jurisdiction_stack:'));
    var parts = p.jurisdiction.split('-');
    for (var s = 0; s < parts.length; s++) {
      lines.push('  - ' + v(parts.slice(0, s + 1).join('-')));
    }
    lines.push('');

    /* lawpack_domains — derived from enabled module groups */
    var lawpackDomains = ['civil'];
    var lawpackMap = { 0: 'corporate', 1: 'financial', 4: 'securities', 5: 'tax' };
    for (var ld = 0; ld < MODULE_GROUPS.length; ld++) {
      if (state.modules[ld] && lawpackMap[ld]) lawpackDomains.push(lawpackMap[ld]);
    }
    if (state.modules[3]) lawpackDomains.push('aml');
    if (state.modules[7]) lawpackDomains.push('digital_assets');
    lawpackDomains.sort();

    lines.push(sec('lawpack_domains:'));
    for (var ldi = 0; ldi < lawpackDomains.length; ldi++) {
      lines.push('  - ' + v(lawpackDomains[ldi]));
    }
    lines.push('');

    /* compliance_domains — from tier selection */
    var domains = DOMAIN_NAMES[state.tier] || DOMAIN_NAMES.standard;
    lines.push(sec('compliance_domains:'));
    for (var d = 0; d < domains.length; d++) {
      lines.push('  - ' + v(domains[d]));
    }
    lines.push('');

    /* corridors — generic + bilateral pairs */
    var corridorPeers = CORRIDOR_CONNECTIONS[p.jurisdiction] || [];
    lines.push(sec('corridors:'));
    lines.push('  - ' + v('swift.iso20022-cross-border'));
    lines.push('  - ' + v('digital-cash.regulated-digital-cash'));
    for (var ci = 0; ci < corridorPeers.length; ci++) {
      var peer = corridorPeers[ci];
      var peerComment = CORRIDOR_COMMENTS[peer] || peer;
      var pair = [p.jurisdiction, peer].sort();
      lines.push('  - ' + v(pair[0] + '--' + pair[1]) + '  ' + c('# ' + peerComment));
    }
    lines.push('');

    /* corridor_peers */
    if (corridorPeers.length > 0) {
      lines.push(sec('corridor_peers:'));
      for (var cp = 0; cp < corridorPeers.length; cp++) {
        var cpComment = CORRIDOR_COMMENTS[corridorPeers[cp]] || corridorPeers[cp];
        lines.push('  - ' + k('zone_id:') + ' ' + v('org.momentum.mez.zone.' + corridorPeers[cp].replace(/-/g, '.')) + '  ' + c('# ' + cpComment));
      }
      lines.push('');
    }

    /* key_management */
    lines.push(sec('key_management:'));
    lines.push(kv('  rotation_interval_days', '90'));
    lines.push(kv('  grace_period_days', '14'));
    lines.push('');

    lines.push(kv('lockfile_path', 'stack.lock'));
    lines.push('');

    yamlEl.innerHTML = lines.join('\n');

    /* Update summary bar — count modules for summary display */
    var totalModules = 0;
    var totalEndpoints = 0;
    for (var mg = 0; mg < MODULE_GROUPS.length; mg++) {
      if (!state.modules[mg]) continue;
      for (var mm = 0; mm < MODULE_GROUPS[mg].modules.length; mm++) {
        var mkey = MODULE_GROUPS[mg].id + '.' + MODULE_GROUPS[mg].modules[mm].id;
        var mOn = state.moduleDetails[mkey] !== undefined ? state.moduleDetails[mkey] : 1;
        if (mOn) {
          totalModules++;
          totalEndpoints += 5 + Math.floor(MODULE_GROUPS[mg].modules[mm].name.length % 4);
        }
      }
    }
    renderSummary(totalModules, totalEndpoints, domains.length, corridorPeers.length + 2);
  }

  function renderSummary(modules, endpoints, domains, corridors) {
    var cost = Math.min(9.8, 3 + modules * 0.22);
    var costStr = cost < 10 ? '<$10M' : '$' + cost.toFixed(1) + 'M';

    summaryEl.innerHTML =
      metric(modules, 'Modules') +
      metric('~' + endpoints, 'Endpoints') +
      metric(domains, 'Domains') +
      metric('90d', 'Timeline');
  }


  /* ══════════════════════════════════════
     YAML HELPERS (syntax coloring)
     ══════════════════════════════════════ */

  function c(text) { return '<span class="y-comment">' + esc(text) + '</span>'; }
  function k(text) { return '<span class="y-key">' + esc(text) + '</span>'; }
  function v(text) { return '<span class="y-value">' + esc(text) + '</span>'; }
  function kv(key, val) { return '<span class="y-key">' + esc(key) + ':</span> <span class="y-value">' + esc(val) + '</span>'; }
  function sec(text) { return '<span class="y-section">' + esc(text) + '</span>'; }
  function bool(on) { return on ? '<span class="y-bool">true</span>' : '<span class="y-bool-off">false</span>'; }
  function metric(val, label) {
    return '<div class="configure-metric"><span class="configure-metric-value">' + val + '</span><span class="configure-metric-label">' + label + '</span></div>';
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function getTier(id) {
    for (var i = 0; i < TIERS.length; i++) {
      if (TIERS[i].id === id) return TIERS[i];
    }
    return TIERS[0];
  }


  /* ══════════════════════════════════════
     URL STATE
     ══════════════════════════════════════ */

  function encodeState() {
    var parts = [];
    parts.push('p=' + state.preset);
    parts.push('pr=' + state.primitives.join(''));
    parts.push('m=' + state.modules.join(''));
    parts.push('t=' + state.tier);

    /* Encode module detail overrides (only non-default) */
    var overrides = [];
    for (var key in state.moduleDetails) {
      if (state.moduleDetails.hasOwnProperty(key) && state.moduleDetails[key] === 0) {
        overrides.push(key);
      }
    }
    if (overrides.length > 0) {
      parts.push('off=' + overrides.join(','));
    }

    return '#' + parts.join('&');
  }

  function decodeState() {
    var hash = window.location.hash;
    if (!hash || hash.length < 2) return false;

    var params = {};
    var pairs = hash.substring(1).split('&');
    for (var i = 0; i < pairs.length; i++) {
      var kv = pairs[i].split('=');
      if (kv.length === 2) params[kv[0]] = kv[1];
    }

    if (params.p !== undefined) {
      var presetIdx = parseInt(params.p, 10);
      if (presetIdx >= 0 && presetIdx < PRESETS.length) state.preset = presetIdx;
    }

    if (params.pr) {
      var prBits = params.pr.split('');
      for (var j = 0; j < Math.min(prBits.length, 5); j++) {
        state.primitives[j] = prBits[j] === '1' ? 1 : 0;
      }
    }

    if (params.m) {
      var mBits = params.m.split('');
      for (var n = 0; n < Math.min(mBits.length, 8); n++) {
        state.modules[n] = mBits[n] === '1' ? 1 : 0;
      }
    }

    if (params.t && (params.t === 'standard' || params.t === 'enhanced' || params.t === 'maximum')) {
      state.tier = params.t;
    }

    if (params.off) {
      var offKeys = params.off.split(',');
      for (var o = 0; o < offKeys.length; o++) {
        state.moduleDetails[offKeys[o]] = 0;
      }
    }

    return true;
  }

  function pushState() {
    var hash = encodeState();
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', hash);
    } else {
      window.location.hash = hash;
    }
  }


  /* ══════════════════════════════════════
     EVENT HANDLERS
     ══════════════════════════════════════ */

  function applyPreset(idx) {
    var p = PRESETS[idx];
    state.preset = idx;
    state.primitives = p.primitives.slice();
    state.modules = p.modules.slice();
    state.tier = p.tier;
    state.moduleDetails = {};
    renderAll();
    pushState();
  }

  function togglePrimitive(idx) {
    state.primitives[idx] = state.primitives[idx] ? 0 : 1;
    renderAll();
    pushState();
  }

  function toggleModuleGroup(gidx) {
    state.modules[gidx] = state.modules[gidx] ? 0 : 1;
    /* Reset individual overrides for this group */
    var group = MODULE_GROUPS[gidx];
    for (var m = 0; m < group.modules.length; m++) {
      delete state.moduleDetails[group.id + '.' + group.modules[m].id];
    }
    renderAll();
    pushState();
  }

  function toggleModule(gidx, midx) {
    var group = MODULE_GROUPS[gidx];
    var mod = group.modules[midx];
    var key = group.id + '.' + mod.id;
    var current = state.moduleDetails[key] !== undefined ? state.moduleDetails[key] : 1;
    state.moduleDetails[key] = current ? 0 : 1;
    renderAll();
    pushState();
  }

  function setTier(tierId) {
    state.tier = tierId;
    renderAll();
    pushState();
  }

  function renderAll() {
    renderPresets();
    renderPrimitives();
    renderModules();
    renderTiers();
    renderYaml();
  }


  /* ══════════════════════════════════════
     SHARE & COPY
     ══════════════════════════════════════ */

  function getYamlText() {
    var text = yamlEl.textContent || yamlEl.innerText;
    return text;
  }

  function copyToClipboard(text, btn, originalText) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showCopied(btn, originalText);
      });
    } else {
      /* Fallback */
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); showCopied(btn, originalText); }
      catch (e) { /* silent */ }
      document.body.removeChild(ta);
    }
  }

  function showCopied(btn, originalText) {
    btn.textContent = 'Copied';
    btn.classList.add('copied');
    setTimeout(function () {
      btn.textContent = originalText;
      btn.classList.remove('copied');
    }, 2000);
  }


  /* ══════════════════════════════════════
     INITIALIZATION
     ══════════════════════════════════════ */

  function init() {
    presetsEl = document.getElementById('configure-presets');
    primitivesEl = document.getElementById('configure-primitives');
    modulesEl = document.getElementById('configure-modules');
    tiersEl = document.getElementById('configure-tiers');
    yamlEl = document.getElementById('configure-yaml');
    summaryEl = document.getElementById('configure-summary');
    shareBtn = document.getElementById('configure-share');
    copyBtn = document.getElementById('configure-copy');

    if (!presetsEl || !yamlEl) return;

    /* Load state from URL or apply default preset */
    if (!decodeState()) {
      applyPreset(0);
    } else {
      renderAll();
    }

    /* Preset clicks */
    presetsEl.addEventListener('click', function (e) {
      var btn = e.target.closest('.configure-preset');
      if (!btn) return;
      var idx = parseInt(btn.getAttribute('data-idx'), 10);
      applyPreset(idx);
    });

    /* Primitive toggles */
    primitivesEl.addEventListener('click', function (e) {
      var toggle = e.target.closest('.configure-toggle');
      if (!toggle) return;
      var idx = parseInt(toggle.getAttribute('data-idx'), 10);
      togglePrimitive(idx);
    });

    /* Keyboard support for primitives */
    primitivesEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        var toggle = e.target.closest('.configure-toggle');
        if (!toggle) return;
        e.preventDefault();
        var idx = parseInt(toggle.getAttribute('data-idx'), 10);
        togglePrimitive(idx);
      }
    });

    /* Module group headers (expand/collapse) and module checkboxes */
    modulesEl.addEventListener('click', function (e) {
      /* Module checkbox */
      var mod = e.target.closest('.configure-module');
      if (mod) {
        var gidx = parseInt(mod.getAttribute('data-gidx'), 10);
        var midx = parseInt(mod.getAttribute('data-midx'), 10);
        toggleModule(gidx, midx);
        return;
      }

      /* Group header toggle */
      var header = e.target.closest('.configure-group-header');
      if (header) {
        var group = header.parentElement;
        var isOpen = group.classList.contains('open');
        /* Close all groups first */
        var allGroups = modulesEl.querySelectorAll('.configure-group');
        for (var i = 0; i < allGroups.length; i++) {
          allGroups[i].classList.remove('open');
          allGroups[i].querySelector('.configure-group-header').setAttribute('aria-expanded', 'false');
        }
        /* Toggle the clicked one */
        if (!isOpen) {
          group.classList.add('open');
          header.setAttribute('aria-expanded', 'true');
        }

        /* Long press on header toggles the entire group */
        /* (Click just expands; to toggle group on/off, user toggles individual modules) */
      }
    });

    /* Keyboard support for module groups */
    modulesEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        var mod = e.target.closest('.configure-module');
        if (mod) {
          e.preventDefault();
          var gidx = parseInt(mod.getAttribute('data-gidx'), 10);
          var midx = parseInt(mod.getAttribute('data-midx'), 10);
          toggleModule(gidx, midx);
          return;
        }

        var header = e.target.closest('.configure-group-header');
        if (header) {
          e.preventDefault();
          header.click();
        }
      }
    });

    /* Tier clicks */
    tiersEl.addEventListener('click', function (e) {
      var tier = e.target.closest('.configure-tier');
      if (!tier) return;
      setTier(tier.getAttribute('data-tier'));
    });

    /* Share button */
    shareBtn.addEventListener('click', function () {
      var url = window.location.origin + window.location.pathname + encodeState();
      copyToClipboard(url, shareBtn, 'Copy share link');
    });

    /* Copy YAML button */
    copyBtn.addEventListener('click', function () {
      copyToClipboard(getYamlText(), copyBtn, 'Copy YAML');
    });

    /* Handle browser back/forward */
    window.addEventListener('hashchange', function () {
      decodeState();
      renderAll();
    });
  }

  /* DOM ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
