/* ═══════════════════════════════════════
   NETWORK EXPLORER
   Interactive terminal for querying the
   Momentum zone network. IIFE pattern,
   vanilla JS, reduced-motion aware.
   ═══════════════════════════════════════ */

(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ══════════════════════════════════════
     DATA — Zone network, compliance, primitives
     ══════════════════════════════════════ */

  var ZONES = [
    /* ── UAE ── */
    { id: 'adgm',     name: 'ADGM',                country: 'UAE',         region: 'Gulf',       status: 'live',         framework: 'FSRA',                    detail: '$1T+ administered assets. English common law, independent courts. Smart asset infrastructure, trading ops, custody, cross-border settlement.',
      compliance_domains: ['aml','arbitration','banking','clearing','consumer_protection','corporate','custody','data_privacy','digital_assets','employment','immigration','ip','kyc','licensing','payments','sanctions','securities','settlement','tax','trade','insurance','anti_bribery','sharia'],
      adapters: ['ICA Emirates ID', 'FTA TRN'], corridors_to: ['pk','sg','hk','gb','difc','us','ky','vg'] },
    { id: 'dfzc',     name: 'Dubai FZC',            country: 'UAE',         region: 'Gulf',       status: 'testnet', framework: 'Dubai FZ Council',         detail: '27 free zones. Sheikh Maktoum chairs. Federated, networked, AI-driven architecture. Includes DIFC ($800B+ assets), DMCC (21,000+ businesses), JAFZA (15M containers/yr), Meydan (200,000+ entrepreneurs).' },
    { id: 'difc',     name: 'DIFC',                 country: 'UAE',         region: 'Gulf',       status: 'live',         framework: 'DFSA',                    detail: '$800B+ administered assets, 6,920+ companies. Common law jurisdiction.',
      compliance_domains: ['aml','arbitration','banking','clearing','consumer_protection','corporate','custody','data_privacy','digital_assets','employment','immigration','ip','kyc','licensing','payments','sanctions','securities','settlement','tax','trade','insurance','anti_bribery','sharia'],
      adapters: ['ICA Emirates ID', 'FTA TRN'], corridors_to: ['adgm','sg','hk','gb','dmcc','jafza','pk'] },
    { id: 'dmcc',     name: 'DMCC',                 country: 'UAE',         region: 'Gulf',       status: 'live',         framework: 'DMCC Authority',          detail: '21,000+ businesses. Commodity trading hub. Gold, diamonds, tea, pearls verticals.',
      compliance_domains: ['aml','arbitration','banking','clearing','consumer_protection','corporate','custody','data_privacy','digital_assets','employment','immigration','ip','kyc','licensing','payments','sanctions','securities','settlement','tax','trade','insurance','anti_bribery','sharia'],
      adapters: ['ICA Emirates ID', 'FTA TRN', 'DMCC Portal'], corridors_to: ['difc','jafza','adgm','sg','hk','gb'] },
    { id: 'jafza',    name: 'JAFZA',                country: 'UAE',         region: 'Gulf',       status: 'live',         framework: 'JAFZA Authority',         detail: '15M containers/yr. Logistics and trade hub. Jebel Ali Port integration.',
      compliance_domains: ['aml','arbitration','banking','clearing','consumer_protection','corporate','custody','data_privacy','digital_assets','employment','immigration','ip','kyc','licensing','payments','sanctions','securities','settlement','tax','trade','insurance','anti_bribery','sharia'],
      adapters: ['ICA Emirates ID', 'FTA TRN', 'JAFZA Portal'], corridors_to: ['difc','dmcc','adgm','sg','gb'] },
    { id: 'ifza',     name: 'IFZA Dubai',           country: 'UAE',         region: 'Gulf',       status: 'testnet', framework: 'IFZA',                    detail: 'Multi-sector free zone in Dubai. 1,500+ business activities. Emirate-wide digital transformation.' },

    /* ── Asia-Pacific ── */
    { id: 'hk',       name: 'Hong Kong',            country: 'Hong Kong',   region: 'APAC',       status: 'live',         framework: 'SFC',                     detail: 'Capital markets, APAC hub. SFC digital-asset framework for virtual assets and securities.',
      compliance_domains: ['aml','arbitration','banking','clearing','consumer_protection','corporate','custody','data_privacy','digital_assets','employment','immigration','ip','kyc','licensing','payments','sanctions','securities','settlement','tax','trade','insurance','anti_bribery','sharia'],
      adapters: ['HKID', 'IRD BRN'], corridors_to: ['sg','adgm','us','gb','jp','difc'] },
    { id: 'sg',       name: 'Singapore',            country: 'Singapore',   region: 'APAC',       status: 'live',         framework: 'MAS',                     detail: 'Capital markets, APAC hub. MAS framework for digital payments and capital markets services.',
      compliance_domains: ['aml','arbitration','banking','clearing','consumer_protection','corporate','custody','data_privacy','digital_assets','employment','immigration','ip','kyc','licensing','payments','sanctions','securities','settlement','tax','trade','insurance','anti_bribery','sharia'],
      adapters: ['MyInfo NRIC', 'ACRA UEN'], corridors_to: ['adgm','hk','us','gb','au','jp','mu','difc','pk'] },
    { id: 'jp',       name: 'Japan',                country: 'Japan',       region: 'APAC',       status: 'live',         framework: 'FSA/JFSA',                detail: 'Financial Services Agency. Virtual asset exchange registration. MOJ corporate registry.',
      compliance_domains: ['aml','arbitration','banking','clearing','consumer_protection','corporate','custody','data_privacy','digital_assets','employment','immigration','ip','kyc','licensing','payments','sanctions','securities','settlement','tax','trade','insurance','anti_bribery','sharia'],
      adapters: ['MOJ Registry', 'NTA Corp Number'], corridors_to: ['sg','hk','au','us'] },
    { id: 'kr',       name: 'Korea',                country: 'South Korea', region: 'APAC',       status: 'pipeline',     framework: 'FSC',                     detail: 'Financial Services Commission. Virtual asset service provider framework.' },
    { id: 'au',       name: 'Australia',            country: 'Australia',   region: 'APAC',       status: 'live',         framework: 'ASIC/AUSTRAC',            detail: 'Digital currency exchange registration. APAC southern corridor. ASIC corporate registry.',
      compliance_domains: ['aml','arbitration','banking','clearing','consumer_protection','corporate','custody','data_privacy','digital_assets','employment','immigration','ip','kyc','licensing','payments','sanctions','securities','settlement','tax','trade','insurance','anti_bribery','sharia'],
      adapters: ['ASIC Registry', 'ABN Lookup', 'AUSTRAC DCE'], corridors_to: ['sg','jp','hk','gb','us'] },

    /* ── South Asia ── */
    { id: 'pk',       name: 'Pakistan SIFC',        country: 'Pakistan',    region: 'South Asia', status: 'live',         framework: 'PDA/SIFC',                detail: 'Special Investment Facilitation Council. Government of Pakistan partnership. National-scale deployment.',
      compliance_domains: ['aml','arbitration','banking','clearing','consumer_protection','corporate','custody','data_privacy','digital_assets','employment','immigration','ip','kyc','licensing','payments','sanctions','securities','settlement','tax','trade','insurance','anti_bribery','sharia'],
      adapters: ['NADRA CNIC', 'FBR NTN (IRIS)', 'SBP Raast', 'SECP'], corridors_to: ['adgm','difc','sg','gb'] },

    /* ── Central Asia ── */
    { id: 'kz',       name: 'Alatau City',          country: 'Kazakhstan',  region: 'Central Asia', status: 'testnet', framework: 'AIFC/NCA',             detail: 'Government passing legislation. Via National Cooperative Association (Belt & Road).' },

    /* ── Americas ── */
    { id: 'us',       name: 'United States',        country: 'United States', region: 'Americas', status: 'live',         framework: 'FinCEN MSB + 7 MTLs',    detail: 'FinCEN MSB registration. 7 state Money Transmitter Licenses: Delaware, Florida, Montana, Wyoming, Nevada, New York, California.',
      compliance_domains: ['aml','arbitration','banking','clearing','consumer_protection','corporate','custody','data_privacy','digital_assets','employment','immigration','ip','kyc','licensing','payments','sanctions','securities','settlement','tax','trade','insurance','anti_bribery','sharia'],
      adapters: ['IRS EIN'], corridors_to: ['gb','sg','hk','adgm','ky','vg','prospera','us-fl'] },
    { id: 'us-fl',    name: 'Florida',              country: 'United States', region: 'Americas',   status: 'live',         framework: 'FL OFR/SunBiz',           detail: 'Money Transmitter License (Ch. 560 F.S.). SunBiz corporate filings. No state income tax. Latin America gateway (PortMiami, CAFTA-DR). 6 national adapters, all 23 compliance domains.',
      compliance_domains: ['aml','kyc','sanctions','tax','securities','corporate','custody','data_privacy','licensing','banking','payments','clearing','settlement','digital_assets','employment','immigration','ip','consumer_protection','arbitration','trade','insurance','anti_bribery','sharia'],
      adapters: ['IRS EIN', 'FL SunBiz', 'FL OFR', 'FL DOR', 'FinCEN BSA', 'OFAC SDN'], corridors_to: ['us','ky','prospera','br-rio'] },
    { id: 'ky',       name: 'Cayman Islands',       country: 'Cayman Islands', region: 'Americas', status: 'live',        framework: 'CIMA',                    detail: 'Cayman Islands Monetary Authority. Fund domiciliation and offshore structuring. Registrar of Companies.',
      compliance_domains: ['aml','arbitration','banking','clearing','consumer_protection','corporate','custody','data_privacy','digital_assets','employment','immigration','ip','kyc','licensing','payments','sanctions','securities','settlement','tax','trade','insurance','anti_bribery','sharia'],
      adapters: ['CIMA Registry', 'DCI Portal'], corridors_to: ['us','vg','gb','adgm','us-fl'] },
    { id: 'vg',       name: 'BVI',                  country: 'British Virgin Islands', region: 'Americas', status: 'live', framework: 'FSC',                   detail: 'Financial Services Commission. Corporate structuring and SPV formation. BVI Business Companies Act 2004.',
      compliance_domains: ['aml','arbitration','banking','clearing','consumer_protection','corporate','custody','data_privacy','digital_assets','employment','immigration','ip','kyc','licensing','payments','sanctions','securities','settlement','tax','trade','insurance','anti_bribery','sharia'],
      adapters: ['FSC Registry', 'VIRRGIN Portal'], corridors_to: ['us','ky','gb','adgm'] },
    { id: 'prospera', name: 'Prospera',             country: 'Honduras',    region: 'Americas',   status: 'live',         framework: 'ZEDE',                    detail: 'Full-stack: registry, licensing, insurance, arbitration. 50-year legal stability agreement. eResidency system.',
      compliance_domains: ['aml','arbitration','banking','clearing','consumer_protection','corporate','custody','data_privacy','digital_assets','employment','immigration','ip','kyc','licensing','payments','sanctions','securities','settlement','tax','trade','insurance','anti_bribery','sharia'],
      adapters: ['Prospera eResidency', 'ZEDE Registry'], corridors_to: ['us','us-fl'] },
    { id: 'br-rio',   name: 'Rio de Janeiro',       country: 'Brazil',      region: 'Americas',   status: 'pipeline',     framework: 'CVM/BCB',                 detail: 'South American financial corridor. CVM securities framework.' },
    { id: 'br-floripa', name: 'Florianopolis',      country: 'Brazil',      region: 'Americas',   status: 'pipeline',     framework: 'CVM/BCB',                 detail: 'Southern Brazil tech hub. Innovation corridor.' },

    /* ── Europe ── */
    { id: 'gb',       name: 'London',               country: 'United Kingdom', region: 'Europe',  status: 'live',         framework: 'FCA',                     detail: 'Financial Conduct Authority. European financial hub.',
      compliance_domains: ['aml','arbitration','banking','clearing','consumer_protection','corporate','custody','data_privacy','digital_assets','employment','immigration','ip','kyc','licensing','payments','sanctions','securities','settlement','tax','trade','insurance','anti_bribery','sharia'],
      adapters: ['HMRC UTR', 'HMRC NINO'], corridors_to: ['us','sg','hk','adgm','gi','ky','vg','pk'] },
    { id: 'gi',       name: 'Gibraltar',            country: 'Gibraltar',   region: 'Europe',     status: 'live',         framework: 'GFSC',                    detail: 'Gibraltar Financial Services Commission. DLT provider framework. Companies House Gibraltar.',
      compliance_domains: ['aml','arbitration','banking','clearing','consumer_protection','corporate','custody','data_privacy','digital_assets','employment','immigration','ip','kyc','licensing','payments','sanctions','securities','settlement','tax','trade','insurance','anti_bribery','sharia'],
      adapters: ['GCS Registry', 'GFSC Portal'], corridors_to: ['gb','us','adgm'] },
    { id: 'pt',       name: 'Portugal',             country: 'Portugal',    region: 'Europe',     status: 'pipeline',     framework: 'CMVM/Banco de Portugal',  detail: 'Southern European corridor. Virtual asset service provider registration.' },

    /* ── Africa ── */
    { id: 'rw',       name: 'Rwanda',               country: 'Rwanda',      region: 'Africa',     status: 'live',         framework: 'BNR/RDB',                 detail: 'National Bank of Rwanda. East African financial inclusion corridor. RDB one-stop corporate registry.',
      compliance_domains: ['aml','arbitration','banking','clearing','consumer_protection','corporate','custody','data_privacy','digital_assets','employment','immigration','ip','kyc','licensing','payments','sanctions','securities','settlement','tax','trade','insurance','anti_bribery','sharia'],
      adapters: ['NIDA NID', 'RDB Portal', 'RRA TIN'], corridors_to: ['ng','za','mu'] },
    { id: 'ng',       name: 'Nigeria',              country: 'Nigeria',     region: 'Africa',     status: 'live',         framework: 'SEC/CBN',                 detail: 'Securities and Exchange Commission. West African capital markets. CAC corporate registry.',
      compliance_domains: ['aml','arbitration','banking','clearing','consumer_protection','corporate','custody','data_privacy','digital_assets','employment','immigration','ip','kyc','licensing','payments','sanctions','securities','settlement','tax','trade','insurance','anti_bribery','sharia'],
      adapters: ['NIMC NIN', 'CAC Registry', 'FIRS TIN'], corridors_to: ['za','rw','mu','gb'] },
    { id: 'za',       name: 'South Africa',         country: 'South Africa', region: 'Africa',    status: 'live',         framework: 'FSCA/SARB',               detail: 'Financial Sector Conduct Authority. Southern African financial hub. CIPC corporate registry.',
      compliance_domains: ['aml','arbitration','banking','clearing','consumer_protection','corporate','custody','data_privacy','digital_assets','employment','immigration','ip','kyc','licensing','payments','sanctions','securities','settlement','tax','trade','insurance','anti_bribery','sharia'],
      adapters: ['DHA ID', 'CIPC Registry', 'SARS TIN'], corridors_to: ['ng','mu','rw','gb'] },
    { id: 'mu',       name: 'Mauritius',            country: 'Mauritius',   region: 'Africa',     status: 'live',         framework: 'FSC',                     detail: 'Financial Services Commission. Indian Ocean financial bridge. CBRD corporate registry.',
      compliance_domains: ['aml','arbitration','banking','clearing','consumer_protection','corporate','custody','data_privacy','digital_assets','employment','immigration','ip','kyc','licensing','payments','sanctions','securities','settlement','tax','trade','insurance','anti_bribery','sharia'],
      adapters: ['MRA TAN', 'CBRD Registry'], corridors_to: ['sg','za','ng','rw','adgm'] },
    { id: 'sc',       name: 'Seychelles',           country: 'Seychelles',  region: 'Africa',     status: 'testnet', framework: 'FSA',                     detail: 'Indian Ocean financial corridor. DICT service bus deployment. 5 national adapters: SeyID (identity), FSA (corporate/IBC/VASP), SRC (tax), CBS (payments), Registrar General (ownership).',
      compliance_domains: ['aml','arbitration','banking','clearing','consumer_protection','corporate','custody','data_privacy','digital_assets','employment','immigration','ip','kyc','licensing','payments','sanctions','securities','settlement','tax','trade','insurance','anti_bribery','sharia'],
      adapters: ['SeyID NIN', 'FSA IBC Registry', 'SRC TIN', 'CBS NPS', 'Registrar General'], corridors_to: ['mu','adgm','sg','gb'] },
    { id: 'ke',       name: 'Kenya',                country: 'Kenya',       region: 'Africa',     status: 'pipeline',     framework: 'CMA/CBK',                 detail: 'Capital Markets Authority. East African financial corridor.' },
    { id: 'tz',       name: 'Zanzibar',             country: 'Tanzania',    region: 'Africa',     status: 'pipeline',     framework: 'Dunia/BOT',               detail: 'Dunia digital economy zone. Indian Ocean trade route.' },
    { id: 'gm',       name: 'Gambia SAR',           country: 'The Gambia',  region: 'Africa',     status: 'pipeline',     framework: 'CBG/SAR Authority',       detail: 'Special Administrative Region. NDA executed. West African corridor.' },

    /* ── Middle East (non-UAE) ── */
    { id: 'qa',       name: 'QFC Qatar',            country: 'Qatar',       region: 'Gulf',       status: 'pipeline',     framework: 'QFCRA',                   detail: 'Qatar Financial Centre. Gulf corridor expansion.' },

    /* ── Southeast Asia ── */
    { id: 'id-bali',  name: 'North Bali EZ',        country: 'Indonesia',   region: 'APAC',       status: 'pipeline',     framework: 'OJK/BKPM',                detail: 'North Bali Airport Special Economic Zone. Tourism and digital economy.' },

    /* ── China ── */
    { id: 'cn-hainan', name: 'Hainan',              country: 'China',       region: 'APAC',       status: 'pipeline',     framework: 'Hainan FTP',              detail: 'Hainan Free Trade Port. Cross-border trade and investment.' },
    { id: 'cn-hangzhou', name: 'Hangzhou',           country: 'China',       region: 'APAC',       status: 'pipeline',     framework: 'CBRC/CSRC',               detail: 'Fintech innovation hub. Digital economy corridor.' },

    /* ── Pipeline zones — 218 total configured ── */
    /* Gulf & Middle East */
    { id: 'bh',       name: 'Bahrain',              country: 'Bahrain',       region: 'Gulf',         status: 'pipeline', framework: 'CBB',                  detail: 'Central Bank of Bahrain. Gulf financial corridor.' },
    { id: 'sa',       name: 'Saudi Arabia',          country: 'Saudi Arabia',  region: 'Gulf',         status: 'pipeline', framework: 'SAMA/CMA',             detail: 'Saudi Arabian Monetary Authority. Vision 2030 financial infrastructure.' },
    { id: 'sa-neom',  name: 'NEOM',                  country: 'Saudi Arabia',  region: 'Gulf',         status: 'pipeline', framework: 'NEOM Authority',       detail: 'Charter city. Cognitive city infrastructure, zero-carbon economy.' },
    { id: 'kw',       name: 'Kuwait',                country: 'Kuwait',        region: 'Gulf',         status: 'pipeline', framework: 'CBK/CMA',              detail: 'Central Bank of Kuwait. Gulf sovereign wealth corridor.' },
    { id: 'om',       name: 'Oman',                  country: 'Oman',          region: 'Gulf',         status: 'pipeline', framework: 'CBO/CMA',              detail: 'Central Bank of Oman. Indian Ocean trade bridge.' },
    { id: 'jo',       name: 'Jordan',                country: 'Jordan',        region: 'Gulf',         status: 'pipeline', framework: 'CBJ/JSC',              detail: 'Central Bank of Jordan. Levant financial corridor.' },

    /* Europe */
    { id: 'ch',       name: 'Switzerland',           country: 'Switzerland',   region: 'Europe',       status: 'pipeline', framework: 'FINMA',                detail: 'Swiss Financial Market Supervisory Authority. DLT Act 2021.' },
    { id: 'de',       name: 'Germany',               country: 'Germany',       region: 'Europe',       status: 'pipeline', framework: 'BaFin',                detail: 'Federal Financial Supervisory Authority. European financial center.' },
    { id: 'fr',       name: 'France',                country: 'France',        region: 'Europe',       status: 'pipeline', framework: 'AMF/ACPR',             detail: 'Autorit\u00e9 des march\u00e9s financiers. EU DORA / MiCA implementation.' },
    { id: 'nl',       name: 'Netherlands',           country: 'Netherlands',   region: 'Europe',       status: 'pipeline', framework: 'DNB/AFM',              detail: 'De Nederlandsche Bank. European trade corridor.' },
    { id: 'ie',       name: 'Ireland',               country: 'Ireland',       region: 'Europe',       status: 'pipeline', framework: 'CBI',                  detail: 'Central Bank of Ireland. EU passporting hub.' },
    { id: 'lu',       name: 'Luxembourg',            country: 'Luxembourg',    region: 'Europe',       status: 'pipeline', framework: 'CSSF',                 detail: 'Commission de Surveillance du Secteur Financier. Fund domiciliation.' },
    { id: 'mt',       name: 'Malta',                 country: 'Malta',         region: 'Europe',       status: 'pipeline', framework: 'MFSA',                 detail: 'Malta Financial Services Authority. VFA framework.' },
    { id: 'ee',       name: 'Estonia',               country: 'Estonia',       region: 'Europe',       status: 'pipeline', framework: 'FSA/EFSA',             detail: 'E-residency. Digital-first corporate infrastructure.' },
    { id: 'cy',       name: 'Cyprus',                country: 'Cyprus',        region: 'Europe',       status: 'pipeline', framework: 'CySEC',                detail: 'Cyprus Securities and Exchange Commission. EU CASP licensing.' },
    { id: 'li',       name: 'Liechtenstein',         country: 'Liechtenstein',  region: 'Europe',      status: 'pipeline', framework: 'FMA',                  detail: 'Digital-asset framework (TVTG).' },
    { id: 'at',       name: 'Austria',               country: 'Austria',       region: 'Europe',       status: 'pipeline', framework: 'FMA',                  detail: 'Financial Market Authority. Central European corridor.' },
    { id: 'es',       name: 'Spain',                 country: 'Spain',         region: 'Europe',       status: 'pipeline', framework: 'CNMV/BdE',             detail: 'Comisi\u00f3n Nacional del Mercado de Valores. Sandbox framework.' },
    { id: 'it',       name: 'Italy',                 country: 'Italy',         region: 'Europe',       status: 'pipeline', framework: 'CONSOB/BdI',           detail: 'Southern European financial corridor.' },
    { id: 'se',       name: 'Sweden',                country: 'Sweden',        region: 'Europe',       status: 'pipeline', framework: 'Finansinspektionen',   detail: 'Nordic financial corridor. E-krona CBDC framework.' },
    { id: 'dk',       name: 'Denmark',               country: 'Denmark',       region: 'Europe',       status: 'pipeline', framework: 'DFSA',                 detail: 'Danish Financial Supervisory Authority. Nordic payments hub.' },
    { id: 'no',       name: 'Norway',                country: 'Norway',        region: 'Europe',       status: 'pipeline', framework: 'Finanstilsynet',       detail: 'Financial Supervisory Authority of Norway. Nordic corridor.' },
    { id: 'fi',       name: 'Finland',               country: 'Finland',       region: 'Europe',       status: 'pipeline', framework: 'FIN-FSA',              detail: 'Finnish Financial Supervisory Authority.' },

    /* Asia-Pacific (additional) */
    { id: 'in-gift',  name: 'GIFT City',             country: 'India',         region: 'APAC',         status: 'pipeline', framework: 'IFSCA',                detail: 'Gujarat International Finance Tec-City. India\u2019s IFSC. IFSCA regulatory sandbox.' },
    { id: 'in-ifsc',  name: 'India IFSC',            country: 'India',         region: 'APAC',         status: 'pipeline', framework: 'IFSCA',                detail: 'International Financial Services Centre Authority.' },
    { id: 'my',       name: 'Malaysia',              country: 'Malaysia',      region: 'APAC',         status: 'pipeline', framework: 'SC/BNM',               detail: 'Securities Commission / Bank Negara Malaysia. Islamic finance hub.' },
    { id: 'my-labuan', name: 'Labuan',               country: 'Malaysia',      region: 'APAC',         status: 'pipeline', framework: 'Labuan FSA',           detail: 'Labuan International Business and Financial Centre.' },
    { id: 'th',       name: 'Thailand',              country: 'Thailand',      region: 'APAC',         status: 'pipeline', framework: 'SEC/BOT',              detail: 'Securities and Exchange Commission. ASEAN financial corridor.' },
    { id: 'ph',       name: 'Philippines',           country: 'Philippines',   region: 'APAC',         status: 'pipeline', framework: 'BSP/SEC',              detail: 'Bangko Sentral ng Pilipinas. VASP framework.' },
    { id: 'vn',       name: 'Vietnam',               country: 'Vietnam',       region: 'APAC',         status: 'pipeline', framework: 'SBV/SSC',              detail: 'State Bank of Vietnam. Mekong financial corridor.' },
    { id: 'tw',       name: 'Taiwan',                country: 'Taiwan',        region: 'APAC',         status: 'pipeline', framework: 'FSC',                  detail: 'Financial Supervisory Commission. APAC semiconductor corridor.' },
    { id: 'nz',       name: 'New Zealand',           country: 'New Zealand',   region: 'APAC',         status: 'pipeline', framework: 'FMA/RBNZ',             detail: 'Financial Markets Authority. Pacific corridor.' },
    { id: 'bd',       name: 'Bangladesh',            country: 'Bangladesh',    region: 'South Asia',   status: 'pipeline', framework: 'BB/BSEC',              detail: 'Bangladesh Bank. South Asian remittance corridor.' },
    { id: 'lk',       name: 'Sri Lanka',             country: 'Sri Lanka',     region: 'South Asia',   status: 'pipeline', framework: 'CBSL/SEC',             detail: 'Central Bank of Sri Lanka. Indian Ocean trade hub.' },

    /* Americas (additional) */
    { id: 'ca',       name: 'Canada',                country: 'Canada',        region: 'Americas',     status: 'pipeline', framework: 'OSFI/CSA',             detail: 'Office of the Superintendent of Financial Institutions. North American corridor.' },
    { id: 'mx',       name: 'Mexico',                country: 'Mexico',        region: 'Americas',     status: 'pipeline', framework: 'CNBV/Banxico',         detail: 'Comisi\u00f3n Nacional Bancaria. Fintech Law 2018. USMCA corridor.' },
    { id: 'pa',       name: 'Panama',                country: 'Panama',        region: 'Americas',     status: 'pipeline', framework: 'SBP/SMV',              detail: 'Superintendencia de Bancos. Americas trade corridor.' },
    { id: 'sv',       name: 'El Salvador',           country: 'El Salvador',   region: 'Americas',     status: 'pipeline', framework: 'BCR/SSF',              detail: 'Banco Central de Reserva. Digital asset legal tender framework.' },
    { id: 'bb',       name: 'Barbados',              country: 'Barbados',      region: 'Americas',     status: 'pipeline', framework: 'CBB/FSC',              detail: 'Central Bank of Barbados. Caribbean financial center.' },
    { id: 'bm',       name: 'Bermuda',               country: 'Bermuda',       region: 'Americas',     status: 'pipeline', framework: 'BMA',                  detail: 'Bermuda Monetary Authority. DABA framework.' },
    { id: 'bs',       name: 'Bahamas',               country: 'Bahamas',       region: 'Americas',     status: 'pipeline', framework: 'SCB',                  detail: 'Securities Commission of The Bahamas. DARE Act.' },
    { id: 'jm',       name: 'Jamaica',               country: 'Jamaica',       region: 'Americas',     status: 'pipeline', framework: 'BOJ/FSC',              detail: 'Bank of Jamaica. Caribbean CBDC pilot (JAM-DEX).' },
    { id: 'tt',       name: 'Trinidad & Tobago',     country: 'Trinidad & Tobago', region: 'Americas', status: 'pipeline', framework: 'CBTT/TTSEC',           detail: 'Central Bank of Trinidad and Tobago. Caribbean energy corridor.' },
    { id: 'co',       name: 'Colombia',              country: 'Colombia',      region: 'Americas',     status: 'pipeline', framework: 'SFC/BdR',              detail: 'Superintendencia Financiera. Andean financial corridor.' },

    /* Africa (additional) */
    { id: 'eg',       name: 'Egypt',                 country: 'Egypt',         region: 'Africa',       status: 'pipeline', framework: 'CBE/FRA',              detail: 'Central Bank of Egypt. North African financial corridor.' },
    { id: 'gh',       name: 'Ghana',                 country: 'Ghana',         region: 'Africa',       status: 'pipeline', framework: 'BOG/SEC',              detail: 'Bank of Ghana. West African fintech hub.' },
    { id: 'et',       name: 'Ethiopia',              country: 'Ethiopia',      region: 'Africa',       status: 'pipeline', framework: 'NBE',                  detail: 'National Bank of Ethiopia. East African corridor.' },
    { id: 'ug',       name: 'Uganda',                country: 'Uganda',        region: 'Africa',       status: 'pipeline', framework: 'BOU/CMA',              detail: 'Bank of Uganda. East African Community corridor.' },
    { id: 'sn',       name: 'Senegal',               country: 'Senegal',       region: 'Africa',       status: 'pipeline', framework: 'BCEAO',                detail: 'WAEMU central bank. Francophone West African corridor.' },

    /* Central Asia & Other */
    { id: 'ge',       name: 'Georgia',               country: 'Georgia',       region: 'Central Asia', status: 'pipeline', framework: 'NBG',                  detail: 'National Bank of Georgia. Caucasus trade corridor.' },
    { id: 'uz',       name: 'Uzbekistan',            country: 'Uzbekistan',    region: 'Central Asia', status: 'pipeline', framework: 'CBU',                  detail: 'Central Bank of Uzbekistan. Central Asian Belt & Road node.' },

    /* APAC (additional) */
    { id: 'ph',       name: 'Philippines',           country: 'Philippines',   region: 'APAC',         status: 'pipeline', framework: 'BSP/SEC',              detail: 'Bangko Sentral ng Pilipinas. ASEAN financial corridor.' },
    { id: 'vn',       name: 'Vietnam',               country: 'Vietnam',       region: 'APAC',         status: 'pipeline', framework: 'SBV/SSC',             detail: 'State Bank of Vietnam. Belt & Road southern corridor.' },
    { id: 'th',       name: 'Thailand',              country: 'Thailand',      region: 'APAC',         status: 'pipeline', framework: 'BOT/SEC',             detail: 'Bank of Thailand. ASEAN+3 financial hub.' },
    { id: 'id',       name: 'Indonesia',             country: 'Indonesia',     region: 'APAC',         status: 'pipeline', framework: 'OJK/BI',              detail: 'Otoritas Jasa Keuangan. G20 economy, ASEAN largest.' },
    { id: 'bd',       name: 'Bangladesh',            country: 'Bangladesh',    region: 'APAC',         status: 'pipeline', framework: 'BB/BSEC',             detail: 'Bangladesh Bank. South Asian corridor, garment trade.' },
    { id: 'lk',       name: 'Sri Lanka',             country: 'Sri Lanka',     region: 'APAC',         status: 'pipeline', framework: 'CBSL/SEC',            detail: 'Central Bank of Sri Lanka. Indian Ocean maritime hub.' },
    { id: 'mm',       name: 'Myanmar',               country: 'Myanmar',       region: 'APAC',         status: 'pipeline', framework: 'CBM',                  detail: 'Central Bank of Myanmar. China-ASEAN corridor node.' },
    { id: 'kh',       name: 'Cambodia',              country: 'Cambodia',      region: 'APAC',         status: 'pipeline', framework: 'NBC/SECC',            detail: 'National Bank of Cambodia. Mekong corridor, Bakong CBDC.' },
    { id: 'mn',       name: 'Mongolia',              country: 'Mongolia',      region: 'APAC',         status: 'pipeline', framework: 'BOM/FRC',             detail: 'Bank of Mongolia. China-Russia transit corridor.' },
    { id: 'tw',       name: 'Taiwan',                country: 'Taiwan',        region: 'APAC',         status: 'pipeline', framework: 'FSC/CBC',             detail: 'Financial Supervisory Commission. Semiconductor corridor.' },
    { id: 'bn',       name: 'Brunei',                country: 'Brunei',        region: 'APAC',         status: 'pipeline', framework: 'BDCB/AMBD',           detail: 'Brunei Darussalam Central Bank. ASEAN energy corridor.' },
    { id: 'au',       name: 'Australia',             country: 'Australia',     region: 'APAC',         status: 'pipeline', framework: 'APRA/ASIC',           detail: 'Australian Prudential Regulation Authority. Oceania hub.' },
    { id: 'nz',       name: 'New Zealand',           country: 'New Zealand',   region: 'APAC',         status: 'pipeline', framework: 'RBNZ/FMA',            detail: 'Reserve Bank of New Zealand. Trans-Tasman corridor.' },

    /* Europe (additional) */
    { id: 'ch',       name: 'Switzerland',           country: 'Switzerland',   region: 'Europe',       status: 'pipeline', framework: 'FINMA/SIX',           detail: 'Swiss Financial Market Supervisory Authority.' },
    { id: 'lu',       name: 'Luxembourg',            country: 'Luxembourg',    region: 'Europe',       status: 'pipeline', framework: 'CSSF',                 detail: 'Commission de Surveillance du Secteur Financier. EU fund domicile.' },
    { id: 'ie',       name: 'Ireland',               country: 'Ireland',       region: 'Europe',       status: 'pipeline', framework: 'CBI',                  detail: 'Central Bank of Ireland. EU tech corridor.' },
    { id: 'nl',       name: 'Netherlands',           country: 'Netherlands',   region: 'Europe',       status: 'pipeline', framework: 'DNB/AFM',             detail: 'De Nederlandsche Bank. Rotterdam trade corridor.' },
    { id: 'ee',       name: 'Estonia',               country: 'Estonia',       region: 'Europe',       status: 'pipeline', framework: 'FSA/EFSA',            detail: 'Estonian Financial Supervision Authority. e-Residency, digital-first.' },
    { id: 'lt',       name: 'Lithuania',             country: 'Lithuania',     region: 'Europe',       status: 'pipeline', framework: 'LB/LSC',              detail: 'Bank of Lithuania. EU EMI licensing hub.' },
    { id: 'mt',       name: 'Malta',                 country: 'Malta',         region: 'Europe',       status: 'pipeline', framework: 'MFSA/MDIA',           detail: 'Malta Financial Services Authority. EU digital asset framework.' },
    { id: 'cy',       name: 'Cyprus',                country: 'Cyprus',        region: 'Europe',       status: 'pipeline', framework: 'CBC/CySEC',           detail: 'Central Bank of Cyprus. Eastern Mediterranean corridor.' },
    { id: 'je',       name: 'Jersey',                country: 'Jersey',        region: 'Europe',       status: 'pipeline', framework: 'JFSC',                 detail: 'Jersey Financial Services Commission. Crown Dependency.' },
    { id: 'gg',       name: 'Guernsey',              country: 'Guernsey',      region: 'Europe',       status: 'pipeline', framework: 'GFSC',                 detail: 'Guernsey Financial Services Commission. Crown Dependency.' },
    { id: 'im',       name: 'Isle of Man',           country: 'Isle of Man',   region: 'Europe',       status: 'pipeline', framework: 'FSA',                  detail: 'Isle of Man Financial Services Authority. Crown Dependency.' },
    { id: 'li',       name: 'Liechtenstein',         country: 'Liechtenstein', region: 'Europe',       status: 'pipeline', framework: 'FMA',                  detail: 'Financial Market Authority. Digital-asset framework (TVTG).' },

    /* Middle East (additional) */
    { id: 'bh',       name: 'Bahrain',               country: 'Bahrain',       region: 'Gulf',         status: 'pipeline', framework: 'CBB/CRA',             detail: 'Central Bank of Bahrain. Regulatory sandbox. GCC corridor.' },
    { id: 'om',       name: 'Oman',                  country: 'Oman',          region: 'Gulf',         status: 'pipeline', framework: 'CBO/CMA',             detail: 'Central Bank of Oman. Muscat trade corridor.' },
    { id: 'kw',       name: 'Kuwait',                country: 'Kuwait',        region: 'Gulf',         status: 'pipeline', framework: 'CBK/CMA',             detail: 'Central Bank of Kuwait. GCC sovereign wealth corridor.' },
    { id: 'jo',       name: 'Jordan',                country: 'Jordan',        region: 'Gulf',         status: 'pipeline', framework: 'CBJ/JSC',             detail: 'Central Bank of Jordan. Levant trade corridor.' },
    { id: 'sa',       name: 'Saudi Arabia',          country: 'Saudi Arabia',  region: 'Gulf',         status: 'pipeline', framework: 'SAMA/CMA',            detail: 'Saudi Arabian Monetary Authority. Vision 2030, NEOM.' },
    { id: 'il',       name: 'Israel',                country: 'Israel',        region: 'Gulf',         status: 'pipeline', framework: 'BOI/ISA',             detail: 'Bank of Israel. Innovation Authority. Abraham Accords corridor.' },

    /* Americas (additional) */
    { id: 'uy',       name: 'Uruguay',               country: 'Uruguay',       region: 'Americas',     status: 'pipeline', framework: 'BCU',                  detail: 'Banco Central del Uruguay. Mercosur southern corridor.' },
    { id: 'cl',       name: 'Chile',                 country: 'Chile',         region: 'Americas',     status: 'pipeline', framework: 'CMF/BCC',             detail: 'Comisi\u00f3n para el Mercado Financiero. Pacific Alliance corridor.' },
    { id: 'pe',       name: 'Peru',                  country: 'Peru',          region: 'Americas',     status: 'pipeline', framework: 'SBS/BCRP',            detail: 'Superintendencia de Banca. Andean corridor.' },
    { id: 'cr',       name: 'Costa Rica',            country: 'Costa Rica',    region: 'Americas',     status: 'pipeline', framework: 'BCCR/SUGEF',          detail: 'Banco Central de Costa Rica. Central American corridor.' },
    { id: 'do',       name: 'Dominican Republic',    country: 'Dominican Republic', region: 'Americas', status: 'pipeline', framework: 'BCRD/SIV',           detail: 'Banco Central. Caribbean economic zone corridor.' },

    /* Africa (additional) */
    { id: 'tz',       name: 'Tanzania',              country: 'Tanzania',      region: 'Africa',       status: 'pipeline', framework: 'BOT/CMSA',            detail: 'Bank of Tanzania. East African Community corridor.' },
    { id: 'mz',       name: 'Mozambique',            country: 'Mozambique',    region: 'Africa',       status: 'pipeline', framework: 'BdM',                  detail: 'Banco de Mo\u00e7ambique. Southern African LNG corridor.' },
    { id: 'bw',       name: 'Botswana',              country: 'Botswana',      region: 'Africa',       status: 'pipeline', framework: 'BOB/NBFIRA',          detail: 'Bank of Botswana. SADC financial corridor.' },
    { id: 'ma',       name: 'Morocco',               country: 'Morocco',       region: 'Africa',       status: 'pipeline', framework: 'BAM/AMMC',            detail: 'Bank Al-Maghrib. North Africa-Europe corridor.' },
    { id: 'ci',       name: 'C\u00f4te d\'Ivoire',   country: 'C\u00f4te d\'Ivoire', region: 'Africa', status: 'pipeline', framework: 'BCEAO/CREPMF',        detail: 'WAEMU zone. Francophone West African economic hub.' }
  ];

  /* From mez-canonical::domain::ComplianceDomain - exactly 23 */
  var COMPLIANCE_DOMAINS = [
    /* Base 8 (mandatory, fail-closed) */
    { id: 'aml',          name: 'AML',          desc: 'Anti-money laundering (transaction monitoring, suspicious activity)', base: true },
    { id: 'kyc',          name: 'KYC',          desc: 'Know Your Customer (identity verification, due diligence)', base: true },
    { id: 'sanctions',    name: 'Sanctions',    desc: 'Sanctions screening (OFAC, UN, EU lists). Hard-block on NonCompliant', base: true },
    { id: 'tax',          name: 'Tax',          desc: 'Tax compliance (withholding, reporting, filing)', base: true },
    { id: 'securities',   name: 'Securities',   desc: 'Securities regulation (issuance, trading, disclosure)', base: true },
    { id: 'corporate',    name: 'Corporate',    desc: 'Corporate governance (formation, dissolution, beneficial ownership)', base: true },
    { id: 'custody',      name: 'Custody',      desc: 'Custody requirements (asset safekeeping, segregation)', base: true },
    { id: 'data_privacy', name: 'Data Privacy', desc: 'Data privacy (GDPR, PDPA, cross-border data transfer)', base: true },
    /* Extended 15 */
    { id: 'licensing',        name: 'Licensing',           desc: 'Licensing (business license validity, professional certifications)', base: false },
    { id: 'banking',          name: 'Banking',             desc: 'Banking regulation (reserve requirements, capital adequacy)', base: false },
    { id: 'payments',         name: 'Payments',            desc: 'Payment services (PSP licensing, payment instrument rules)', base: false },
    { id: 'clearing',         name: 'Clearing',            desc: 'Clearing and settlement (CCP rules, netting, finality)', base: false },
    { id: 'settlement',       name: 'Settlement',          desc: 'Settlement finality (delivery-versus-payment, settlement cycles)', base: false },
    { id: 'digital_assets',   name: 'Digital Assets',      desc: 'Digital asset regulation (instrument classification, exchange licensing)', base: false },
    { id: 'employment',       name: 'Employment',          desc: 'Employment law (labor contracts, social security, withholding)', base: false },
    { id: 'immigration',      name: 'Immigration',         desc: 'Immigration (work permits, visa sponsorship, residency)', base: false },
    { id: 'ip',               name: 'IP',                  desc: 'Intellectual property (patent, trademark, trade secret)', base: false },
    { id: 'consumer_protection', name: 'Consumer Prot.',   desc: 'Consumer protection (disclosure, dispute resolution, warranties)', base: false },
    { id: 'arbitration',      name: 'Arbitration',         desc: 'Arbitration (dispute resolution frameworks, enforcement)', base: false },
    { id: 'trade',            name: 'Trade',               desc: 'Trade regulation (import/export controls, customs, tariffs)', base: false },
    { id: 'insurance',        name: 'Insurance',           desc: 'Insurance regulation (coverage, solvency, claims, distribution)', base: false },
    { id: 'anti_bribery',     name: 'Anti-Bribery',        desc: 'Anti-bribery and corruption controls (gifts, facilitation, reporting)', base: false },
    { id: 'sharia',           name: 'Sharia',              desc: 'Sharia compliance where the deploying legal tradition requires it', base: false }
  ];

  var PRIMITIVES = [
    { name: 'Entities',   syscall: '/dev/entities',  desc: 'Incorporation, amendments, dissolution, registry state. Full corporate lifecycle as a programmable primitive.' },
    { name: 'Ownership',  syscall: '/dev/ownership', desc: 'Cap tables, beneficial ownership, transfers, encumbrances. Every ownership event generates verifiable credentials.' },
    { name: 'Fiscal',       syscall: '/dev/fiscal',      desc: 'Treasury, accounts, payments, withholding, tax events. Financial operations with compliance at every step.' },
    { name: 'Identity',   syscall: '/dev/identity',  desc: 'KYC/KYB, identity passports, attestations, risk tiers. Portable identity across 30+ jurisdictions.' },
    { name: 'Consent',    syscall: '/dev/consent',   desc: 'Signatures, resolutions, approvals, delegated authority. Multi-party consent with cryptographic audit trails.' }
  ];

  var PARTNERS = [
    'PDA Pakistan',
    'Government of Pakistan',
    'Prospera Honduras',
    'Broad Group',
    'Lombard',
    'EHang (Nasdaq: EH)'
  ];

  var CORRIDOR_TYPES = [
    { name: 'Cross-border',        desc: 'Sovereign-to-sovereign corridors. Full compliance re-evaluation at each border crossing.' },
    { name: 'Free Zone to Host',   desc: 'Free zone to host economy. Reduced friction, shared regulatory umbrella.' },
    { name: 'Free Zone to Free Zone', desc: 'Zone-to-zone within same sovereign. Fastest settlement, shared compliance context.' },
    { name: 'Federal Mesh',        desc: 'State-to-state within federal system (e.g. US MTL network). Passporting model.' }
  ];

  /* ── Settlement types ── */
  var SETTLEMENT_TYPES = [
    { id: 'swift',                name: 'SWIFT ISO 20022',         protocol: 'pacs.008',           currency: 'Fiat',            attestations: ['kyb','bo','sanctions','aml','license','periodic_return'] },
    { id: 'digital-cash',        name: 'Regulated digital cash',  protocol: 'Digital cash transfer API', currency: 'USD',       attestations: ['kyb','bo','sanctions','aml','license','reserves','safeguarding','travel_rule'] },
    { id: 'correspondent',       name: 'Correspondent Banking',   protocol: 'Fiat correspondent',  currency: 'Multi-currency', attestations: ['kyb','bo','sanctions','aml','license'] },
    { id: 'open-banking',        name: 'Open Banking (A2A)',      protocol: 'Domestic A2A',        currency: 'Domestic',        attestations: ['kyb','bo','consent','api_security','incident_reporting','license'] },
    { id: 'passporting',         name: 'Passporting',             protocol: 'Mutual recognition',  currency: 'Fiat',            attestations: ['kyb','bo','sanctions','aml','license'] }
  ];

  /* ── Corridor lifecycle ── */
  /* 6 states, 9 transitions, evidence-based */
  var CORRIDOR_LIFECYCLE = {
    states: ['DRAFT','PENDING','ACTIVE','HALTED','SUSPENDED','DEPRECATED'],
    transitions: [
      { from: 'DRAFT',     to: 'PENDING',    action: 'submit',                    evidence: 'CorridorDefinitionCredential' },
      { from: 'PENDING',   to: 'ACTIVE',     action: 'activate',                  evidence: 'CorridorAgreementCredential + receipt_signed finality' },
      { from: 'ACTIVE',    to: 'HALTED',     action: 'halt',                      evidence: 'ForkAlarmCredential (emergency)' },
      { from: 'ACTIVE',    to: 'SUSPENDED',  action: 'suspend',                   evidence: 'zone_authority (non-emergency)' },
      { from: 'HALTED',    to: 'ACTIVE',     action: 'resume_from_halt',          evidence: 'ForkResolutionCredential' },
      { from: 'SUSPENDED', to: 'ACTIVE',     action: 'resume_from_suspension',    evidence: 'zone_authority' },
      { from: 'ACTIVE',    to: 'DEPRECATED', action: 'deprecate',                 evidence: 'Terminal (irreversible)' },
      { from: 'HALTED',    to: 'DEPRECATED', action: 'deprecate_from_halt',       evidence: 'Terminal (irreversible)' },
      { from: 'SUSPENDED', to: 'DEPRECATED', action: 'deprecate_from_suspension', evidence: 'Terminal (irreversible)' }
    ]
  };

  /* ── Transition types ── */
  /* 22 types across 4 families */
  var TRANSITION_TYPES = [
    /* Settlement */
    { id: 'settle.swift.pacs008.v1',            family: 'settlement', name: 'SWIFT pacs.008',        desc: 'ISO 20022 cross-border credit transfer' },
    { id: 'settle.digital-cash.transfer.v1',    family: 'settlement', name: 'Regulated Digital-Cash Transfer', desc: 'Mediated digital-cash settlement with travel rule' },
    /* Trade finance — invoices */
    { id: 'trade.invoice.issue.v1',             family: 'trade',      name: 'Invoice Issuance',      desc: 'Commercial invoice with compliance context' },
    { id: 'trade.invoice.accept.v1',            family: 'trade',      name: 'Invoice Accept/Dispute', desc: 'Buyer acceptance or dispute' },
    { id: 'trade.invoice.settle.v1',            family: 'trade',      name: 'Invoice Settlement',    desc: 'Payment against accepted invoice' },
    /* Trade finance — bills of lading */
    { id: 'trade.bol.issue.v1',                 family: 'trade',      name: 'Bill of Lading Issue',  desc: 'Carrier-issued BOL with goods receipt' },
    { id: 'trade.bol.endorse.v1',               family: 'trade',      name: 'BOL Endorsement',       desc: 'Title transfer via BOL endorsement' },
    { id: 'trade.bol.release.v1',               family: 'trade',      name: 'BOL Release',           desc: 'Goods release against BOL surrender' },
    /* Trade finance — letters of credit */
    { id: 'trade.lc.issue.v1',                  family: 'trade',      name: 'LC Issuance',           desc: 'Bank-issued letter of credit' },
    { id: 'trade.lc.amend.v1',                  family: 'trade',      name: 'LC Amendment',          desc: 'Amendment to LC terms' },
    { id: 'trade.lc.present.v1',                family: 'trade',      name: 'LC Document Present',   desc: 'UCP 600 compliant document presentation' },
    { id: 'trade.lc.honor.v1',                  family: 'trade',      name: 'LC Honor/Reject',       desc: 'Issuing bank honor or rejection decision' },
    /* Arbitration */
    { id: 'arbitration.dispute.file.v1',        family: 'arbitration', name: 'Dispute Filing',       desc: 'Formal dispute filing with jurisdiction' },
    { id: 'arbitration.dispute.respond.v1',     family: 'arbitration', name: 'Dispute Response',     desc: 'Respondent formal reply' },
    { id: 'arbitration.evidence.submit.v1',     family: 'arbitration', name: 'Evidence Submission',  desc: 'Cryptographically timestamped evidence' },
    { id: 'arbitration.ruling.receive.v1',      family: 'arbitration', name: 'Ruling Receipt',       desc: 'Arbitral award issuance' },
    { id: 'arbitration.ruling.enforce.v1',      family: 'arbitration', name: 'Ruling Enforcement',   desc: 'Cross-jurisdiction enforcement order' },
    { id: 'arbitration.appeal.file.v1',         family: 'arbitration', name: 'Appeal Filing',        desc: 'Formal appeal of arbitral award' },
    { id: 'arbitration.settlement.agree.v1',    family: 'arbitration', name: 'Settlement Agreement', desc: 'Mutual settlement of dispute' }
  ];

  /* ── Trace animation data ── */
  var TRACE_DOMAINS = [
    /* Base 8 */
    { name: 'AML',            source: 'ADGM AML Rulebook v5.1',        target: 'MAS Notice 626' },
    { name: 'KYC',            source: 'ADGM KYC/CDD Framework',        target: 'MAS Notice 124' },
    { name: 'Sanctions',      source: 'UAE Federal Sanctions List',     target: 'MAS Sanctions Reg' },
    { name: 'Tax',            source: 'UAE CT Law (9% > AED 375K)',     target: 'ITA S13 Exemption' },
    { name: 'Securities',     source: 'FSRA Virtual Asset Framework',   target: 'SFA Cap. 289' },
    { name: 'Corporate',      source: 'ADGM Companies Reg 2020',       target: 'Companies Act 1967' },
    { name: 'Custody',        source: 'FSRA Custody Framework',         target: 'MAS TCA Guidelines' },
    { name: 'Data Privacy',   source: 'ADGM Data Protection Reg 2021', target: 'PDPA 2012' },
    /* Extended 15 */
    { name: 'Licensing',      source: 'FSRA FSP License',              target: 'MAS CMS License' },
    { name: 'Banking',        source: 'CBUAE Banking Reg',             target: 'MAS Banking Act' },
    { name: 'Payments',       source: 'CBUAE RPSF',                    target: 'MAS PS Act' },
    { name: 'Clearing',       source: 'ADX CCP Rules',                 target: 'SGX CDP Rules' },
    { name: 'Settlement',     source: 'ADGM Settlement Finality',      target: 'MAS SFA Pt III' },
    { name: 'Digital Assets', source: 'FSRA VA Framework 2023',         target: 'MAS PS Act DPT' },
    { name: 'Employment',     source: 'ADGM Employment Reg 2019',      target: 'Employment Act 1968' },
    { name: 'Immigration',    source: 'ICA Golden Visa',               target: 'MOM EP/SP Framework' },
    { name: 'IP',             source: 'UAE Federal IP Law',             target: 'IPOS Act' },
    { name: 'Consumer Prot.', source: 'ADGM Consumer Reg',             target: 'CPFTA' },
    { name: 'Arbitration',    source: 'ADGM Arbitration Reg 2015',     target: 'IAA Cap. 143A' },
    { name: 'Trade',          source: 'UAE Customs Law',                target: 'Customs Act' }
  ];

  /* ── Module catalog ── */
  /* Module families — v0.4.44 GENESIS, 338 manifests across 25 families (146 browsable) */
  var MODULE_FAMILIES = [
    { id: 'legal',          name: 'Legal',           count: 9,  desc: 'Enabling act, civil code, commercial code, entity registry, land registry' },
    { id: 'regulatory',     name: 'Regulatory',      count: 8,  desc: 'AML/CFT, sanctions, data protection, market conduct, cybersecurity' },
    { id: 'financial',      name: 'Financial',        count: 14, desc: 'Treasury, payments adapter, banking, FX, settlement, cards, safeguarding' },
    { id: 'licensing',      name: 'Licensing',        count: 16, desc: 'CSP, EMI, DASP, custody, instrument issuer, exchange, fund admin, PSP' },
    { id: 'corporate',      name: 'Corporate',        count: 8,  desc: 'Formation, beneficial ownership, cap table, dissolution, secretarial' },
    { id: 'identity',       name: 'Identity',         count: 6,  desc: 'KYC tiers, credentials, work authorization, professional licensing' },
    { id: 'capital_markets', name: 'Capital Markets', count: 9,  desc: 'Securities issuance, clearing, CSD, DVP/PVP, surveillance, trading' },
    { id: 'trade',          name: 'Trade',            count: 8,  desc: 'Customs, letters of credit, supply chain finance, trade insurance' },
    { id: 'tax',            name: 'Tax',              count: 7,  desc: 'Withholding rules, fee schedules, incentives, treaty management' },
    { id: 'corridors',      name: 'Corridors',        count: 7,  desc: 'SWIFT, digital cash, open banking, correspondent, passporting' },
    { id: 'governance',     name: 'Governance',        count: 10, desc: 'Binary, ranked-choice, approval, score, quadratic voting, liquid democracy' },
    { id: 'arbitration',    name: 'Arbitration',       count: 8,  desc: 'Case management, mediation, expert determination, small claims' },
    { id: 'operational',    name: 'Operational',       count: 9,  desc: 'Audit logging, regulator console, attestation analytics, telemetry' },
    { id: 'phoenix',        name: 'PHOENIX',           count: 10, desc: 'Compliance tensor, Smart Asset VM, migration protocol, ZK proofs' },
    { id: 'agentic',        name: 'Agentic',           count: 6,  desc: 'Compliance agent, KYC agent, document processor, risk assessor' },
    { id: 'deployment',     name: 'Deployment',        count: 11, desc: 'AWS, K8s, zone provisioning, secrets management, Docker Compose' },
    { id: 'immigration',    name: 'Immigration',       count: 5,  desc: 'Work permits, visa processing, residency, talent mobility corridors' },
    { id: 'insurance',      name: 'Insurance',         count: 4,  desc: 'Entity insurance, custody coverage, directors liability, surety bonds' },
    { id: 'ip',             name: 'Intellectual Prop',  count: 5,  desc: 'Patent registry, trademark, trade secrets, IP licensing, royalty tracking' }
  ];

  /* Module instances — registered IDs
     where available; representative entries for unregistered families */
  var MODULES = [
    /* Legal (registered: 11 in registry, 9 in index) */
    { id: 'mez.legal.core', family: 'legal', name: 'Core Legal Framework', version: '0.1.0' },
    { id: 'mez.legal.enabling-act', family: 'legal', name: 'Enabling Act', version: '0.2.0' },
    { id: 'mez.legal.civil-code', family: 'legal', name: 'Civil Code', version: '0.2.0' },
    { id: 'mez.legal.commercial-code', family: 'legal', name: 'Commercial Code', version: '0.2.0' },
    { id: 'mez.legal.entity-registry', family: 'legal', name: 'Entity Registry', version: '0.2.0' },
    { id: 'mez.legal.dispute-resolution', family: 'legal', name: 'Dispute Resolution', version: '0.2.0' },
    { id: 'mez.legal.land-registry', family: 'legal', name: 'Land Registry', version: '0.2.0' },
    { id: 'mez.legal.authority-charter', family: 'legal', name: 'Authority Charter', version: '0.2.0' },
    { id: 'mez.legal.security-interests', family: 'legal', name: 'Security Interests', version: '0.2.0' },
    /* Regulatory (registered: 8) */
    { id: 'mez.reg.aml-cft', family: 'regulatory', name: 'AML/CFT', version: '0.1.0' },
    { id: 'mez.reg.sanctions', family: 'regulatory', name: 'Sanctions', version: '0.2.0' },
    { id: 'mez.reg.data-protection', family: 'regulatory', name: 'Data Protection', version: '0.2.0' },
    { id: 'mez.reg.cybersecurity', family: 'regulatory', name: 'Cybersecurity', version: '0.2.0' },
    { id: 'mez.reg.market-conduct', family: 'regulatory', name: 'Market Conduct', version: '0.2.0' },
    { id: 'mez.reg.consumer-protection', family: 'regulatory', name: 'Consumer Protection', version: '0.2.0' },
    { id: 'mez.reg.anti-corruption', family: 'regulatory', name: 'Anti-Corruption', version: '0.2.0' },
    { id: 'mez.reg.fin-supervision', family: 'regulatory', name: 'Financial Supervision', version: '0.2.0' },
    /* Financial (registered: 10) */
    { id: 'mez.fin.payments-adapter', family: 'financial', name: 'Payments Adapter', version: '0.1.0' },
    { id: 'mez.fin.banking-adapter', family: 'financial', name: 'Banking Adapter', version: '0.2.0' },
    { id: 'mez.fin.settlement-adapter', family: 'financial', name: 'Settlement Adapter', version: '0.2.0' },
    { id: 'mez.fin.domestic-payments', family: 'financial', name: 'Domestic Payments', version: '0.2.0' },
    { id: 'mez.fin.treasury', family: 'financial', name: 'Treasury', version: '0.2.0' },
    { id: 'mez.fin.fx', family: 'financial', name: 'FX', version: '0.2.0' },
    { id: 'mez.fin.cards', family: 'financial', name: 'Cards', version: '0.2.0' },
    { id: 'mez.fin.safeguarding', family: 'financial', name: 'Safeguarding', version: '0.2.0' },
    /* Licensing (registered: 11) */
    { id: 'mez.lic.csp', family: 'licensing', name: 'Corporate Service Provider', version: '0.1.0' },
    { id: 'mez.lic.emi', family: 'licensing', name: 'E-Money Institution', version: '0.1.0' },
    { id: 'mez.lic.dasp', family: 'licensing', name: 'Digital Asset Service Provider', version: '0.1.0' },
    { id: 'mez.lic.custody', family: 'licensing', name: 'Custody', version: '0.1.0' },
    { id: 'mez.lic.instrument-issuer', family: 'licensing', name: 'Instrument Issuer', version: '0.1.0' },
    { id: 'mez.lic.exchange', family: 'licensing', name: 'Exchange', version: '0.2.0' },
    { id: 'mez.lic.fund-admin', family: 'licensing', name: 'Fund Admin', version: '0.2.0' },
    { id: 'mez.lic.trust-company', family: 'licensing', name: 'Trust Company', version: '0.2.0' },
    { id: 'mez.lic.bank-sponsor', family: 'licensing', name: 'Bank Sponsor', version: '0.2.0' },
    { id: 'mez.lic.psp-acquirer', family: 'licensing', name: 'PSP Acquirer', version: '0.2.0' },
    { id: 'mez.lic.card-program-manager', family: 'licensing', name: 'Card Program Manager', version: '0.2.0' },
    /* Corridors (registered: 5) */
    { id: 'mez.corridor.swift', family: 'corridors', name: 'SWIFT ISO20022', version: '0.1.0' },
    { id: 'mez.corridor.digital-cash', family: 'corridors', name: 'Regulated Digital Cash', version: '0.1.0' },
    { id: 'mez.corridor.openbanking', family: 'corridors', name: 'Open Banking', version: '0.1.0' },
    { id: 'mez.corridor.correspondent', family: 'corridors', name: 'Correspondent Banking', version: '0.2.0' },
    { id: 'mez.corridor.passporting', family: 'corridors', name: 'Passporting', version: '0.2.0' },
    /* Operations (registered: 9) */
    { id: 'mez.ops.regulator-console', family: 'operational', name: 'Regulator Console', version: '0.1.0' },
    { id: 'mez.ops.audit-logging', family: 'operational', name: 'Audit Logging', version: '0.2.0' },
    { id: 'mez.ops.incident-response', family: 'operational', name: 'Incident Response', version: '0.2.0' },
    { id: 'mez.ops.attestation-analytics', family: 'operational', name: 'Attestation Analytics', version: '0.2.0' },
    { id: 'mez.ops.transparency-dashboard', family: 'operational', name: 'Transparency Dashboard', version: '0.2.0' },
    { id: 'mez.ops.deployment-telemetry', family: 'operational', name: 'Deployment Telemetry', version: '0.1.0' },
    /* Governance (registered: 9) */
    { id: 'mez.governance.core', family: 'governance', name: 'Core Governance', version: '0.1.0' },
    { id: 'mez.governance.binary-voting', family: 'governance', name: 'Binary Voting', version: '0.1.0' },
    { id: 'mez.governance.ranked-choice', family: 'governance', name: 'Ranked Choice', version: '0.1.0' },
    { id: 'mez.governance.approval-voting', family: 'governance', name: 'Approval Voting', version: '0.1.0' },
    { id: 'mez.governance.quadratic-voting', family: 'governance', name: 'Quadratic Voting', version: '0.1.0' },
    { id: 'mez.governance.quadratic-funding', family: 'governance', name: 'Quadratic Funding', version: '0.1.0' },
    { id: 'mez.governance.liquid-democracy', family: 'governance', name: 'Liquid Democracy', version: '0.1.0' },
    { id: 'mez.governance.zk-participation', family: 'governance', name: 'ZK Participation', version: '0.1.0' },
    /* Corporate */
    { id: 'corp-formation', family: 'corporate', name: 'Formation', version: '0.1.0' },
    { id: 'corp-beneficial-ownership', family: 'corporate', name: 'Beneficial Ownership', version: '0.1.0' },
    { id: 'corp-cap-table', family: 'corporate', name: 'Cap Table', version: '0.1.0' },
    { id: 'corp-dissolution', family: 'corporate', name: 'Dissolution', version: '0.1.0' },
    /* Identity */
    { id: 'id-core', family: 'identity', name: 'Core Identity', version: '0.1.0' },
    { id: 'id-kyc-tiers', family: 'identity', name: 'KYC Tiers', version: '0.1.0' },
    { id: 'id-credentials', family: 'identity', name: 'Credentials', version: '0.1.0' },
    { id: 'id-work-authorization', family: 'identity', name: 'Work Authorization', version: '0.1.0' },
    /* Capital Markets */
    { id: 'cm-securities-issuance', family: 'capital_markets', name: 'Securities Issuance', version: '0.1.0' },
    { id: 'cm-clearing', family: 'capital_markets', name: 'Clearing', version: '0.1.0' },
    { id: 'cm-csd', family: 'capital_markets', name: 'Central Securities Depository', version: '0.1.0' },
    { id: 'cm-dvp-pvp', family: 'capital_markets', name: 'DVP/PVP', version: '0.1.0' },
    /* Trade */
    { id: 'trd-customs', family: 'trade', name: 'Customs', version: '0.1.0' },
    { id: 'trd-letters-of-credit', family: 'trade', name: 'Letters of Credit', version: '0.1.0' },
    { id: 'trd-supply-chain-finance', family: 'trade', name: 'Supply Chain Finance', version: '0.1.0' },
    { id: 'trd-trade-insurance', family: 'trade', name: 'Trade Insurance', version: '0.1.0' },
    /* Tax */
    { id: 'tax-withholding', family: 'tax', name: 'Withholding Rules', version: '0.1.0' },
    { id: 'tax-fee-schedules', family: 'tax', name: 'Fee Schedules', version: '0.1.0' },
    { id: 'tax-treaty-management', family: 'tax', name: 'Treaty Management', version: '0.1.0' },
    { id: 'tax-incentive-programs', family: 'tax', name: 'Incentive Programs', version: '0.1.0' },
    /* Arbitration */
    { id: 'arb-mediation', family: 'arbitration', name: 'Mediation', version: '0.1.0' },
    { id: 'arb-expert-determination', family: 'arbitration', name: 'Expert Determination', version: '0.1.0' },
    { id: 'arb-small-claims', family: 'arbitration', name: 'Small Claims', version: '0.1.0' },
    /* PHOENIX */
    { id: 'phx-tensor', family: 'phoenix', name: 'Compliance Tensor', version: '0.1.0' },
    { id: 'phx-savm', family: 'phoenix', name: 'Smart Asset VM', version: '0.1.0' },
    { id: 'phx-migrate', family: 'phoenix', name: 'Migration Protocol', version: '0.1.0' },
    { id: 'phx-zk', family: 'phoenix', name: 'ZK Proofs', version: '0.1.0' },
    /* Agentic */
    { id: 'agt-compliance', family: 'agentic', name: 'Compliance Agent', version: '0.1.0' },
    { id: 'agt-kyc', family: 'agentic', name: 'KYC Agent', version: '0.1.0' },
    { id: 'agt-docproc', family: 'agentic', name: 'Document Processor', version: '0.1.0' },
    { id: 'agt-risk', family: 'agentic', name: 'Risk Assessor', version: '0.1.0' },
    /* Deployment */
    { id: 'dep-aws', family: 'deployment', name: 'AWS Provisioner', version: '0.1.0' },
    { id: 'dep-k8s', family: 'deployment', name: 'K8s Orchestrator', version: '0.1.0' },
    { id: 'dep-zone', family: 'deployment', name: 'Zone Provisioner', version: '0.1.0' },
    { id: 'dep-docker-compose', family: 'deployment', name: 'Docker Compose', version: '0.1.0' }
  ];

  /* ── Corridor graph for Dijkstra routing ── */
  var CORRIDOR_GRAPH = [
    /* Pakistan corridors */
    { from: 'pk', to: 'adgm', type: 'cross-border', fee_bps: 15, settlement_secs: 14400 },
    { from: 'pk', to: 'difc', type: 'cross-border', fee_bps: 18, settlement_secs: 14400 },
    { from: 'pk', to: 'sg', type: 'cross-border', fee_bps: 22, settlement_secs: 28800 },
    { from: 'pk', to: 'gb', type: 'cross-border', fee_bps: 20, settlement_secs: 21600 },
    /* UAE internal */
    { from: 'adgm', to: 'difc', type: 'fz-to-fz', fee_bps: 5, settlement_secs: 3600 },
    { from: 'difc', to: 'dmcc', type: 'fz-to-fz', fee_bps: 4, settlement_secs: 3600 },
    { from: 'difc', to: 'jafza', type: 'fz-to-fz', fee_bps: 4, settlement_secs: 3600 },
    { from: 'adgm', to: 'ifza', type: 'fz-to-host', fee_bps: 8, settlement_secs: 7200 },
    /* Gulf cross-border */
    { from: 'adgm', to: 'sg', type: 'cross-border', fee_bps: 12, settlement_secs: 14400 },
    { from: 'adgm', to: 'hk', type: 'cross-border', fee_bps: 14, settlement_secs: 14400 },
    { from: 'adgm', to: 'gb', type: 'cross-border', fee_bps: 10, settlement_secs: 10800 },
    { from: 'adgm', to: 'us', type: 'cross-border', fee_bps: 16, settlement_secs: 21600 },
    { from: 'adgm', to: 'ky', type: 'cross-border', fee_bps: 12, settlement_secs: 14400 },
    { from: 'adgm', to: 'vg', type: 'cross-border', fee_bps: 13, settlement_secs: 14400 },
    { from: 'difc', to: 'sg', type: 'cross-border', fee_bps: 13, settlement_secs: 14400 },
    { from: 'difc', to: 'hk', type: 'cross-border', fee_bps: 15, settlement_secs: 14400 },
    { from: 'difc', to: 'gb', type: 'cross-border', fee_bps: 11, settlement_secs: 10800 },
    /* APAC */
    { from: 'sg', to: 'hk', type: 'cross-border', fee_bps: 8, settlement_secs: 7200 },
    { from: 'sg', to: 'us', type: 'cross-border', fee_bps: 15, settlement_secs: 21600 },
    { from: 'sg', to: 'gb', type: 'cross-border', fee_bps: 12, settlement_secs: 14400 },
    { from: 'sg', to: 'au', type: 'cross-border', fee_bps: 10, settlement_secs: 10800 },
    { from: 'sg', to: 'jp', type: 'cross-border', fee_bps: 9, settlement_secs: 7200 },
    { from: 'sg', to: 'mu', type: 'cross-border', fee_bps: 14, settlement_secs: 14400 },
    { from: 'hk', to: 'us', type: 'cross-border', fee_bps: 14, settlement_secs: 21600 },
    { from: 'hk', to: 'gb', type: 'cross-border', fee_bps: 13, settlement_secs: 14400 },
    { from: 'hk', to: 'jp', type: 'cross-border', fee_bps: 7, settlement_secs: 7200 },
    { from: 'jp', to: 'au', type: 'cross-border', fee_bps: 11, settlement_secs: 10800 },
    /* Americas */
    { from: 'us', to: 'gb', type: 'cross-border', fee_bps: 8, settlement_secs: 7200 },
    { from: 'us', to: 'ky', type: 'cross-border', fee_bps: 6, settlement_secs: 7200 },
    { from: 'us', to: 'vg', type: 'cross-border', fee_bps: 7, settlement_secs: 7200 },
    { from: 'us', to: 'prospera', type: 'cross-border', fee_bps: 10, settlement_secs: 10800 },
    /* Florida corridors */
    { from: 'us-fl', to: 'us', type: 'federal-mesh', fee_bps: 3, settlement_secs: 1800 },
    { from: 'us-fl', to: 'ky', type: 'cross-border', fee_bps: 7, settlement_secs: 7200 },
    { from: 'us-fl', to: 'prospera', type: 'cross-border', fee_bps: 9, settlement_secs: 10800 },
    { from: 'us-fl', to: 'br-rio', type: 'cross-border', fee_bps: 14, settlement_secs: 14400 },
    { from: 'us-fl', to: 'vg', type: 'cross-border', fee_bps: 8, settlement_secs: 7200 },
    { from: 'ky', to: 'vg', type: 'cross-border', fee_bps: 5, settlement_secs: 3600 },
    /* Europe */
    { from: 'gb', to: 'gi', type: 'cross-border', fee_bps: 6, settlement_secs: 7200 },
    { from: 'gb', to: 'ky', type: 'cross-border', fee_bps: 8, settlement_secs: 10800 },
    { from: 'gb', to: 'vg', type: 'cross-border', fee_bps: 9, settlement_secs: 10800 },
    /* Africa */
    { from: 'ng', to: 'za', type: 'cross-border', fee_bps: 18, settlement_secs: 21600 },
    { from: 'ng', to: 'rw', type: 'cross-border', fee_bps: 20, settlement_secs: 28800 },
    { from: 'ng', to: 'mu', type: 'cross-border', fee_bps: 22, settlement_secs: 28800 },
    { from: 'za', to: 'mu', type: 'cross-border', fee_bps: 16, settlement_secs: 21600 },
    { from: 'za', to: 'rw', type: 'cross-border', fee_bps: 19, settlement_secs: 28800 },
    { from: 'mu', to: 'sg', type: 'cross-border', fee_bps: 14, settlement_secs: 14400 },
    /* Central Asia */
    { from: 'pk', to: 'kz', type: 'cross-border', fee_bps: 25, settlement_secs: 43200 }
  ];

  /* ── Tax rules (Pakistan) ── */
  var TAX_RULES = {
    pk: [
      { rule_id: 'S153-1A', event: 'payment_for_goods', filer_rate: 4.5, non_filer_rate: 9.0, section: 'ITO 2001 \u00a7153(1)(a)', final: false },
      { rule_id: 'S153-1B', event: 'payment_for_services', filer_rate: 8.0, non_filer_rate: 16.0, section: 'ITO 2001 \u00a7153(1)(b)', final: false },
      { rule_id: 'S152', event: 'cross_border_payment', rate: 20.0, section: 'ITO 2001 \u00a7152', final: true },
      { rule_id: 'S149', event: 'salary_payment', rate: 5.0, section: 'ITO 2001 \u00a7149', final: false },
      { rule_id: 'S150', event: 'dividend', filer_rate: 15.0, non_filer_rate: 30.0, section: 'ITO 2001 \u00a7150', final: true },
      { rule_id: 'S151', event: 'profit_on_debt', filer_rate: 15.0, non_filer_rate: 30.0, section: 'ITO 2001 \u00a7151', final: true },
      { rule_id: 'S155', event: 'rent_payment', filer_rate: 15.0, non_filer_rate: 30.0, section: 'ITO 2001 \u00a7155', final: false },
      { rule_id: 'STA-3', event: 'supply_of_goods', rate: 18.0, section: 'Sales Tax Act 1990 \u00a73', final: true }
    ],
    'us-fl': [
      { rule_id: 'FL-CIT', event: 'corporate_income', rate: 5.5, section: 'FL Stat \u00a7220.11', final: true },
      { rule_id: 'FL-SUT', event: 'supply_of_goods', rate: 6.0, section: 'FL Stat \u00a7212.05', final: true },
      { rule_id: 'FL-DOC', event: 'real_property_transfer', rate: 0.7, section: 'FL Stat \u00a7201.02', final: true },
      { rule_id: 'FL-ITA', event: 'intangible_tax', rate: 0.2, section: 'FL Stat \u00a7199.032 (repealed 2007)', final: true },
      { rule_id: 'US-WHT', event: 'cross_border_payment', rate: 30.0, section: 'IRC \u00a71441-1442 (NRA withholding)', final: true },
      { rule_id: 'US-FIRPTA', event: 'real_property_disposition', rate: 15.0, section: 'IRC \u00a71445 (FIRPTA)', final: true }
    ]
  };

  /* ── National adapters ── */
  var NATIONAL_ADAPTERS = [
    { country: 'PK', id: 'nadra-cnic', name: 'NADRA CNIC', type: 'identity', format: '13 digits' },
    { country: 'PK', id: 'fbr-ntn', name: 'FBR NTN (IRIS)', type: 'tax', format: '7 digits' },
    { country: 'PK', id: 'sbp-raast', name: 'SBP Raast', type: 'payments', format: 'IBAN' },
    { country: 'AE', id: 'ica-eid', name: 'ICA Emirates ID', type: 'identity', format: '15 digits' },
    { country: 'AE', id: 'fta-trn', name: 'FTA TRN', type: 'tax', format: 'Alphanumeric' },
    { country: 'SG', id: 'myinfo-nric', name: 'MyInfo NRIC', type: 'identity', format: 'S/T/F/G + 7 digits + check' },
    { country: 'SG', id: 'acra-uen', name: 'ACRA UEN', type: 'corporate', format: '9-10 chars' },
    { country: 'US', id: 'irs-ein', name: 'IRS EIN', type: 'corporate', format: 'XX-XXXXXXX' },
    { country: 'US-FL', id: 'sunbiz', name: 'FL SunBiz', type: 'corporate', format: 'Document Number' },
    { country: 'US-FL', id: 'ofr-fl', name: 'FL OFR', type: 'licensing', format: 'License Number' },
    { country: 'US-FL', id: 'fdor', name: 'FL DOR', type: 'tax', format: 'Certificate of Registration' },
    { country: 'US-FL', id: 'fincen-bsa', name: 'FinCEN BSA', type: 'aml', format: 'BSA ID' },
    { country: 'GB', id: 'hmrc-utr', name: 'HMRC UTR', type: 'tax', format: '10 digits' },
    { country: 'IN', id: 'uidai-aadhaar', name: 'UIDAI Aadhaar', type: 'identity', format: '12 digits' },
    { country: 'IN', id: 'pan', name: 'IT Dept PAN', type: 'tax', format: '10 chars' },
    { country: 'GB', id: 'hmrc-nino', name: 'HMRC NINO', type: 'identity', format: '9 chars' },
    /* HK */
    { country: 'HK', id: 'hkid', name: 'HKID', type: 'identity', format: 'Letter + 6 digits + check' },
    { country: 'HK', id: 'ird-brn', name: 'IRD BRN', type: 'corporate', format: '8 digits' },
    /* JP */
    { country: 'JP', id: 'moj-registry', name: 'MOJ Registry', type: 'corporate', format: '12-digit Corp Number' },
    { country: 'JP', id: 'nta-corp', name: 'NTA Corp Number', type: 'tax', format: '13 digits' },
    /* AU */
    { country: 'AU', id: 'asic-registry', name: 'ASIC Registry', type: 'corporate', format: 'ACN 9 digits' },
    { country: 'AU', id: 'abn-lookup', name: 'ABN Lookup', type: 'tax', format: '11 digits' },
    { country: 'AU', id: 'austrac-dce', name: 'AUSTRAC DCE', type: 'licensing', format: 'Registration Number' },
    /* UAE (DMCC/JAFZA) */
    { country: 'AE', id: 'dmcc-portal', name: 'DMCC Portal', type: 'licensing', format: 'DMCC License Number' },
    { country: 'AE', id: 'jafza-portal', name: 'JAFZA Portal', type: 'licensing', format: 'JAFZA License Number' },
    /* KY */
    { country: 'KY', id: 'cima-registry', name: 'CIMA Registry', type: 'corporate', format: 'Company Number' },
    { country: 'KY', id: 'dci-portal', name: 'DCI Portal', type: 'tax', format: 'TIN' },
    /* VG */
    { country: 'VG', id: 'fsc-registry', name: 'FSC Registry', type: 'corporate', format: 'Company Number' },
    { country: 'VG', id: 'virrgin-portal', name: 'VIRRGIN Portal', type: 'corporate', format: 'VIRRGIN ID' },
    /* GI */
    { country: 'GI', id: 'gcs-registry', name: 'GCS Registry', type: 'corporate', format: 'Company Number' },
    { country: 'GI', id: 'gfsc-portal', name: 'GFSC Portal', type: 'licensing', format: 'License Number' },
    /* Prospera */
    { country: 'HN', id: 'prospera-eres', name: 'Prospera eResidency', type: 'identity', format: 'eResident ID' },
    { country: 'HN', id: 'zede-registry', name: 'ZEDE Registry', type: 'corporate', format: 'Entity Number' },
    /* RW */
    { country: 'RW', id: 'nida-nid', name: 'NIDA NID', type: 'identity', format: '16 digits' },
    { country: 'RW', id: 'rdb-portal', name: 'RDB Portal', type: 'corporate', format: 'Business Number' },
    { country: 'RW', id: 'rra-tin', name: 'RRA TIN', type: 'tax', format: '9 digits' },
    /* NG */
    { country: 'NG', id: 'nimc-nin', name: 'NIMC NIN', type: 'identity', format: '11 digits' },
    { country: 'NG', id: 'cac-registry', name: 'CAC Registry', type: 'corporate', format: 'RC Number' },
    { country: 'NG', id: 'firs-tin', name: 'FIRS TIN', type: 'tax', format: '10 digits' },
    /* ZA */
    { country: 'ZA', id: 'dha-id', name: 'DHA ID', type: 'identity', format: '13 digits' },
    { country: 'ZA', id: 'cipc-registry', name: 'CIPC Registry', type: 'corporate', format: 'Registration Number' },
    { country: 'ZA', id: 'sars-tin', name: 'SARS TIN', type: 'tax', format: '10 digits' },
    /* MU */
    { country: 'MU', id: 'mra-tan', name: 'MRA TAN', type: 'tax', format: 'Tax Account Number' },
    { country: 'MU', id: 'cbrd-registry', name: 'CBRD Registry', type: 'corporate', format: 'File Number' }
  ];

  /* ── Kernel zone data — v0.4.44 ── */
  /* Jurisdiction stacks, regpack digests, profiles, lawpack domains */
  var ZONE_KERNEL = {
    'adgm': {
      jid: 'ae-abudhabi-adgm', jstack: ['ae', 'ae-abudhabi', 'ae-abudhabi-adgm'],
      profile: 'sovereign-govos-ae', lawpacks: ['civil', 'financial'],
      regpacks: [
        { domain: 'financial', sha: '5ce776c2', date: '2026-01-15', jid: 'ae' },
        { domain: 'sanctions', sha: '34bb8fcb', date: '2026-01-15', jid: 'ae' }
      ],
      domains: ['aml','arbitration','banking','clearing','consumer_protection','corporate','custody','data_privacy','digital_assets','employment','immigration','ip','kyc','licensing','payments','sanctions','securities','settlement','tax','trade','insurance','anti_bribery','sharia']
    },
    'dfzc': {
      jid: 'ae-dubai', jstack: ['ae', 'ae-dubai'],
      profile: 'sovereign-govos-ae', lawpacks: ['civil', 'financial'],
      regpacks: [
        { domain: 'financial', sha: '5ce776c2', date: '2026-01-15', jid: 'ae' },
        { domain: 'sanctions', sha: '34bb8fcb', date: '2026-01-15', jid: 'ae' }
      ],
      domains: ['aml','arbitration','banking','clearing','consumer_protection','corporate','custody','data_privacy','digital_assets','employment','immigration','ip','kyc','licensing','payments','sanctions','securities','settlement','tax','trade','insurance','anti_bribery','sharia']
    },
    'difc': {
      jid: 'ae-dubai-difc', jstack: ['ae', 'ae-dubai', 'ae-dubai-difc'],
      profile: 'sovereign-govos', lawpacks: ['civil', 'financial', 'tax', 'aml', 'securities', 'corporate'],
      regpacks: [
        { domain: 'financial', sha: '5ce776c2', date: '2026-01-15', jid: 'ae' },
        { domain: 'sanctions', sha: '34bb8fcb', date: '2026-01-15', jid: 'ae' }
      ],
      domains: ['aml','arbitration','banking','clearing','consumer_protection','corporate','custody','data_privacy','digital_assets','employment','immigration','ip','kyc','licensing','payments','sanctions','securities','settlement','tax','trade','insurance','anti_bribery','sharia']
    },
    'dmcc': {
      jid: 'ae-dubai-dmcc', jstack: ['ae', 'ae-dubai', 'ae-dubai-dmcc'],
      profile: 'commodities-center', lawpacks: ['civil', 'financial'],
      regpacks: [
        { domain: 'financial', sha: '5ce776c2', date: '2026-01-15', jid: 'ae' },
        { domain: 'sanctions', sha: '34bb8fcb', date: '2026-01-15', jid: 'ae' }
      ],
      domains: ['aml','arbitration','banking','clearing','consumer_protection','corporate','custody','data_privacy','digital_assets','employment','immigration','ip','kyc','licensing','payments','sanctions','securities','settlement','tax','trade','insurance','anti_bribery','sharia']
    },
    'jafza': {
      jid: 'ae-dubai-jafza', jstack: ['ae', 'ae-dubai', 'ae-dubai-jafza'],
      profile: 'free-zone', lawpacks: ['civil', 'financial'],
      regpacks: [
        { domain: 'financial', sha: '5ce776c2', date: '2026-01-15', jid: 'ae' },
        { domain: 'sanctions', sha: '34bb8fcb', date: '2026-01-15', jid: 'ae' }
      ],
      domains: ['aml','arbitration','banking','clearing','consumer_protection','corporate','custody','data_privacy','digital_assets','employment','immigration','ip','kyc','licensing','payments','sanctions','securities','settlement','tax','trade','insurance','anti_bribery','sharia']
    },
    'ifza': {
      jid: 'ae-dubai-ifza', jstack: ['ae', 'ae-dubai', 'ae-dubai-ifza'],
      profile: 'free-zone', lawpacks: ['civil', 'financial'],
      regpacks: [
        { domain: 'financial', sha: '5ce776c2', date: '2026-01-15', jid: 'ae' },
        { domain: 'sanctions', sha: '34bb8fcb', date: '2026-01-15', jid: 'ae' }
      ],
      domains: ['aml','arbitration','banking','clearing','consumer_protection','corporate','custody','data_privacy','digital_assets','employment','immigration','ip','kyc','licensing','payments','sanctions','securities','settlement','tax','trade','insurance','anti_bribery','sharia']
    },
    'hk': {
      jid: 'hk', jstack: ['hk'],
      profile: 'digital-financial-center', lawpacks: ['civil', 'financial'],
      regpacks: [
        { domain: 'financial', sha: '89dc928a', date: '2026-01-15', jid: 'hk' },
        { domain: 'sanctions', sha: '6bd125db', date: '2026-01-15', jid: 'hk' }
      ],
      domains: ['aml','arbitration','banking','clearing','consumer_protection','corporate','custody','data_privacy','digital_assets','employment','immigration','ip','kyc','licensing','payments','sanctions','securities','settlement','tax','trade','insurance','anti_bribery','sharia']
    },
    'sg': {
      jid: 'sg', jstack: ['sg'],
      profile: 'sovereign-govos-sg', lawpacks: ['civil', 'financial', 'tax', 'aml'],
      regpacks: [
        { domain: 'financial', sha: '4d2a1f73', date: '2026-01-15', jid: 'sg' },
        { domain: 'sanctions', sha: '2afd914d', date: '2026-01-15', jid: 'sg' }
      ],
      domains: ['aml','arbitration','banking','clearing','consumer_protection','corporate','custody','data_privacy','digital_assets','employment','immigration','ip','kyc','licensing','payments','sanctions','securities','settlement','tax','trade','insurance','anti_bribery','sharia']
    },
    'pk': {
      jid: 'pk-fed', jstack: ['pk'],
      profile: 'sovereign-govos', lawpacks: ['civil', 'corporate', 'financial', 'aml', 'tax', 'securities'],
      regpacks: [
        { domain: 'financial', sha: '444ddded', date: '2026-01-15', jid: 'pk' },
        { domain: 'sanctions', sha: 'e59056a2', date: '2026-01-15', jid: 'pk' }
      ],
      domains: ['aml','arbitration','banking','clearing','consumer_protection','corporate','custody','data_privacy','digital_assets','employment','immigration','ip','kyc','licensing','payments','sanctions','securities','settlement','tax','trade','insurance','anti_bribery','sharia']
    },
    'us': {
      jid: 'us-de', jstack: ['us', 'us-de'],
      profile: 'sovereign-govos', lawpacks: ['civil', 'financial'],
      regpacks: null,
      domains: ['aml','arbitration','banking','clearing','consumer_protection','corporate','custody','data_privacy','digital_assets','employment','immigration','ip','kyc','licensing','payments','sanctions','securities','settlement','tax','trade','insurance','anti_bribery','sharia']
    },
    'us-fl': {
      jid: 'us-fl', jstack: ['us', 'us-fl'],
      profile: 'sovereign-govos', lawpacks: ['civil', 'financial'],
      regpacks: [
        { domain: 'financial', sha: 'b35e587e', date: '2026-02-28', jid: 'us-fl' },
        { domain: 'licensing', sha: 'b83ad907', date: '2026-02-28', jid: 'us-fl' }
      ],
      domains: ['aml','kyc','sanctions','tax','securities','corporate','custody','data_privacy','licensing','banking','payments','clearing','settlement','digital_assets','employment','immigration','ip','consumer_protection','arbitration','trade','insurance','anti_bribery','sharia']
    },
    'ky': {
      jid: 'ky', jstack: ['ky'],
      profile: 'digital-financial-center', lawpacks: ['civil', 'financial'],
      regpacks: [
        { domain: 'financial', sha: '11164f51', date: '2026-01-15', jid: 'ky' },
        { domain: 'sanctions', sha: 'e9621692', date: '2026-01-15', jid: 'ky' }
      ],
      domains: ['aml','arbitration','banking','clearing','consumer_protection','corporate','custody','data_privacy','digital_assets','employment','immigration','ip','kyc','licensing','payments','sanctions','securities','settlement','tax','trade','insurance','anti_bribery','sharia']
    },
    'vg': {
      jid: 'vg', jstack: ['vg'],
      profile: 'digital-financial-center', lawpacks: ['civil', 'financial'],
      regpacks: null,
      domains: ['aml','arbitration','banking','clearing','consumer_protection','corporate','custody','data_privacy','digital_assets','employment','immigration','ip','kyc','licensing','payments','sanctions','securities','settlement','tax','trade','insurance','anti_bribery','sharia']
    },
    'prospera': {
      jid: 'hn-prospera', jstack: ['hn', 'hn-prospera'],
      profile: 'charter-city', lawpacks: ['civil', 'financial'],
      regpacks: null,
      domains: ['aml','arbitration','banking','clearing','consumer_protection','corporate','custody','data_privacy','digital_assets','employment','immigration','ip','kyc','licensing','payments','sanctions','securities','settlement','tax','trade','insurance','anti_bribery','sharia']
    },
    'kz': {
      jid: 'kz-alatau', jstack: ['kz', 'kz-alatau'],
      profile: 'digital-financial-center', lawpacks: ['civil', 'financial'],
      regpacks: null,
      domains: ['aml','arbitration','banking','clearing','consumer_protection','corporate','custody','data_privacy','digital_assets','employment','immigration','ip','kyc','licensing','payments','sanctions','securities','settlement','tax','trade','insurance','anti_bribery','sharia']
    },
    'sc': {
      jid: 'sc', jstack: ['sc'],
      profile: 'digital-financial-center', lawpacks: ['civil', 'corporate', 'financial', 'aml', 'tax', 'digital_assets'],
      regpacks: [
        { name: 'OFAC SDN', updated: '2026-03-01', entries: 12847 },
        { name: 'UN Consolidated', updated: '2026-02-28', entries: 891 },
        { name: 'FSA Licensed Entities', updated: '2026-03-07', entries: 246312 }
      ],
      domains: ['aml','arbitration','banking','clearing','consumer_protection','corporate','custody','data_privacy','digital_assets','employment','immigration','ip','kyc','licensing','payments','sanctions','securities','settlement','tax','trade','insurance','anti_bribery','sharia']
    },
    'gb': {
      jid: 'gb', jstack: ['gb'],
      profile: 'sovereign-govos', lawpacks: ['civil', 'financial'],
      regpacks: null,
      domains: ['aml','arbitration','banking','clearing','consumer_protection','corporate','custody','data_privacy','digital_assets','employment','immigration','ip','kyc','licensing','payments','sanctions','securities','settlement','tax','trade','insurance','anti_bribery','sharia']
    },
    'gi': {
      jid: 'gb-gi', jstack: ['gb', 'gb-gi'],
      profile: 'digital-financial-center', lawpacks: ['civil', 'financial'],
      regpacks: null,
      domains: ['aml','arbitration','banking','clearing','consumer_protection','corporate','custody','data_privacy','digital_assets','employment','immigration','ip','kyc','licensing','payments','sanctions','securities','settlement','tax','trade','insurance','anti_bribery','sharia']
    }
  };

  /* ── Operation lawpacks ── */
  var OPERATIONS = {
    'entity.incorporate': {
      desc: 'Full entity incorporation with treasury, banking, and optional cap table',
      jurisdictions: {
        'us-de': {
          name: 'Delaware',
          legal_basis: 'DGCL Section 101-102',
          steps: [
            { id: 'name_check',     type: 'filing.name_availability',         svc: 'organization-info', depends: [],                 domains: ['corporate','aml','sanctions','kyc'] },
            { id: 'entity_create',  type: 'create.entity',                    svc: 'organization-info', depends: ['name_check'],      domains: ['corporate','aml','sanctions','kyc'] },
            { id: 'filing',         type: 'filing.certificate_of_incorporation', svc: 'organization-info', depends: ['entity_create'], domains: ['corporate','licensing'] },
            { id: 'ein_application', type: 'filing.tax_id',                   svc: 'organization-info', depends: ['entity_create'],   domains: ['tax','corporate'] },
            { id: 'treasury_create', type: 'create.treasury',                 svc: 'treasury-info',     depends: ['entity_create'],   domains: ['banking','aml'] },
            { id: 'bank_account',   type: 'create.bank_account',             svc: 'treasury-info',     depends: ['treasury_create'], domains: ['banking','payments','aml'] },
            { id: 'cap_table',      type: 'create.cap_table',                svc: 'governance-info',      depends: ['entity_create'],   domains: ['securities','corporate'] },
            { id: 'directors',      type: 'consent.board_resolution',        svc: 'governance-info',      depends: ['entity_create'],   domains: ['corporate'] },
            { id: 'bylaws',         type: 'consent.board_resolution',        svc: 'governance-info',      depends: ['directors'],       domains: ['corporate'] },
            { id: 'initial_shares', type: 'ownership.issue_shares',          svc: 'governance-info',      depends: ['cap_table','directors'], domains: ['securities','corporate'] }
          ],
          fees: [{ amount: '$89', authority: 'DE Division of Corporations', desc: 'Certificate filing' }],
          params: [
            { name: 'legal_name', type: 'string', required: true, note: 'Must end in Inc, Corp, LLC, or Ltd' },
            { name: 'entity_type', type: 'enum', required: true, values: ['c_corp','s_corp','llc','lp'] },
            { name: 'incorporator_name', type: 'string', required: true },
            { name: 'incorporator_email', type: 'string', required: true },
            { name: 'treasury_provider', type: 'enum', required: false, values: ['adyen','currency_cloud','wise','mass'] },
            { name: 'share_classes', type: 'array', required: false }
          ]
        },
        'ae-abudhabi-adgm': {
          name: 'ADGM',
          legal_basis: 'ADGM Companies Regulations 2020 Part 3',
          steps: [
            { id: 'special_resolution', type: 'consent.special_resolution',    svc: 'governance-info',      depends: [],                     domains: ['corporate'] },
            { id: 'name_check',         type: 'filing.name_reservation',       svc: 'organization-info', depends: ['special_resolution'],  domains: ['corporate','aml','sanctions'] },
            { id: 'entity_create',      type: 'create.entity',                 svc: 'organization-info', depends: ['name_check'],          domains: ['corporate','aml','sanctions','kyc'] },
            { id: 'filing',             type: 'filing.certificate',            svc: 'organization-info', depends: ['entity_create'],       domains: ['corporate','licensing'] },
            { id: 'trade_license',      type: 'licensing.acquire',             svc: 'organization-info', depends: ['filing'],              domains: ['licensing','corporate'] },
            { id: 'data_protection',    type: 'filing.data_protection',        svc: 'organization-info', depends: ['entity_create'],       domains: ['data_privacy'] },
            { id: 'treasury_create',    type: 'create.treasury',               svc: 'treasury-info',     depends: ['entity_create'],       domains: ['banking','aml'] },
            { id: 'bank_account',       type: 'create.bank_account',           svc: 'treasury-info',     depends: ['treasury_create'],     domains: ['banking','payments','aml'] },
            { id: 'cap_table',          type: 'create.cap_table',              svc: 'governance-info',      depends: ['entity_create'],       domains: ['securities','corporate'] },
            { id: 'directors',          type: 'consent.board',                 svc: 'governance-info',      depends: ['entity_create'],       domains: ['corporate'] },
            { id: 'initial_shares',     type: 'ownership.issue_shares',        svc: 'governance-info',      depends: ['cap_table','directors'], domains: ['securities','corporate'] }
          ],
          fees: [
            { amount: 'AED 100', authority: 'ADGM RA', desc: 'Name reservation' },
            { amount: 'AED 2,000', authority: 'ADGM RA', desc: 'Certificate filing' },
            { amount: 'AED 1,050', authority: 'ADGM RA', desc: 'Trade license' },
            { amount: 'AED 300', authority: 'ADGM RA', desc: 'Data protection' }
          ],
          params: [
            { name: 'legal_name', type: 'string', required: true },
            { name: 'entity_type', type: 'enum', required: true, values: ['private_company','public_company','branch','partnership'] },
            { name: 'share_capital', type: 'string', required: true, note: 'Minimum AED 50,000' }
          ]
        },
        'pk-sifc': {
          name: 'Pakistan SIFC',
          legal_basis: 'Companies Act 2017 s.13-22',
          steps: [
            { id: 'identity_verify', type: 'identity.cnic_verify',           svc: 'identity-info',     depends: [],                   domains: ['kyc','aml','data_privacy'] },
            { id: 'ntn_verify',      type: 'identity.ntn_verify',            svc: 'identity-info',     depends: [],                   domains: ['tax','kyc'] },
            { id: 'name_check',      type: 'filing.name_availability',       svc: 'organization-info', depends: ['identity_verify'],   domains: ['corporate','aml','sanctions'] },
            { id: 'digital_sign',    type: 'identity.digital_signature',     svc: 'identity-info',     depends: ['identity_verify'],   domains: ['corporate'] },
            { id: 'entity_create',   type: 'create.entity',                  svc: 'organization-info', depends: ['name_check','digital_sign'], domains: ['corporate','aml','sanctions','kyc'] },
            { id: 'secp_filing',     type: 'filing.certificate',             svc: 'organization-info', depends: ['entity_create'],     domains: ['corporate','licensing'] },
            { id: 'fbr_register',    type: 'filing.tax_registration',        svc: 'organization-info', depends: ['entity_create'],     domains: ['tax','corporate'] },
            { id: 'treasury_create', type: 'create.treasury',                svc: 'treasury-info',     depends: ['entity_create'],     domains: ['banking','aml'] },
            { id: 'bank_account',    type: 'create.bank_account',            svc: 'treasury-info',     depends: ['treasury_create'],   domains: ['banking','payments','aml'] },
            { id: 'raast_register',  type: 'payments.register_raast',        svc: 'treasury-info',     depends: ['bank_account'],      domains: ['payments'] },
            { id: 'cap_table',       type: 'create.cap_table',               svc: 'governance-info',      depends: ['entity_create'],     domains: ['securities','corporate'] },
            { id: 'initial_shares',  type: 'ownership.issue_shares',         svc: 'governance-info',      depends: ['cap_table'],         domains: ['securities','corporate'] }
          ],
          fees: [
            { amount: 'PKR 200', authority: 'SECP', desc: 'Name availability' },
            { amount: 'PKR 1,000\u201350,000', authority: 'SECP', desc: 'Certificate filing (sliding scale)' }
          ],
          params: [
            { name: 'legal_name', type: 'string', required: true },
            { name: 'entity_type', type: 'enum', required: true, values: ['private_limited','single_member','public_limited','not_for_profit'] },
            { name: 'cnic', type: 'string', required: true, note: 'NADRA CNIC (13 digits)' },
            { name: 'ntn', type: 'string', required: true, note: 'FBR NTN (7 digits)' }
          ]
        },
        'sg': {
          name: 'Singapore',
          legal_basis: 'Companies Act 1967 s.17-22',
          steps: [
            { id: 'name_check',     type: 'filing.name_reservation',         svc: 'organization-info', depends: [],                   domains: ['corporate','aml','sanctions'] },
            { id: 'entity_create',  type: 'create.entity',                   svc: 'organization-info', depends: ['name_check'],        domains: ['corporate','aml','sanctions','kyc'] },
            { id: 'acra_filing',    type: 'filing.certificate',              svc: 'organization-info', depends: ['entity_create'],     domains: ['corporate','licensing'] },
            { id: 'iras_register',  type: 'filing.tax_registration',         svc: 'organization-info', depends: ['entity_create'],     domains: ['tax','corporate'] },
            { id: 'treasury_create', type: 'create.treasury',                svc: 'treasury-info',     depends: ['entity_create'],     domains: ['banking','aml'] },
            { id: 'bank_account',   type: 'create.bank_account',            svc: 'treasury-info',     depends: ['treasury_create'],   domains: ['banking','payments','aml'] },
            { id: 'cap_table',      type: 'create.cap_table',               svc: 'governance-info',      depends: ['entity_create'],     domains: ['securities','corporate'] },
            { id: 'directors',      type: 'consent.board',                   svc: 'governance-info',      depends: ['entity_create'],     domains: ['corporate'] },
            { id: 'initial_shares', type: 'ownership.issue_shares',          svc: 'governance-info',      depends: ['cap_table','directors'], domains: ['securities','corporate'] }
          ],
          fees: [
            { amount: 'SGD 15', authority: 'ACRA', desc: 'Name application' },
            { amount: 'SGD 315', authority: 'ACRA', desc: 'Certificate filing' }
          ],
          params: [
            { name: 'legal_name', type: 'string', required: true },
            { name: 'entity_type', type: 'enum', required: true, values: ['private_limited','exempt_private','public'] },
            { name: 'registered_address', type: 'string', required: true, note: 'Must be in Singapore' }
          ]
        },
        'ky': {
          name: 'Cayman Islands',
          legal_basis: 'Companies Act (2023 Revision) Part II',
          steps: [
            { id: 'name_check',      type: 'filing.name_reservation',        svc: 'organization-info', depends: [],                     domains: ['corporate'] },
            { id: 'entity_create',   type: 'create.entity',                  svc: 'organization-info', depends: ['name_check'],          domains: ['corporate','aml','sanctions','kyc'] },
            { id: 'filing',          type: 'filing.registration',            svc: 'organization-info', depends: ['entity_create'],       domains: ['corporate','licensing'] },
            { id: 'annual_license',  type: 'filing.annual_license',          svc: 'organization-info', depends: ['filing'],              domains: ['corporate','licensing'] },
            { id: 'treasury',        type: 'create.treasury',                svc: 'treasury-info',     depends: ['entity_create'],       domains: ['banking','aml','sanctions'] },
            { id: 'account',         type: 'create.bank_account',            svc: 'treasury-info',     depends: ['treasury'],            domains: ['banking','aml','sanctions','custody'] },
            { id: 'cap_table',       type: 'create.cap_table',              svc: 'governance-info',      depends: ['entity_create'],       domains: ['securities','corporate'] },
            { id: 'board',           type: 'create.board',                   svc: 'governance-info',      depends: ['entity_create'],       domains: ['corporate'] },
            { id: 'memorandum',      type: 'document.memorandum_and_articles', svc: 'governance-info',   depends: ['board'],               domains: ['corporate'] },
            { id: 'registered_office', type: 'filing.registered_office',     svc: 'organization-info', depends: ['filing'],              domains: ['corporate'] },
            { id: 'activate',        type: 'update.entity_status',           svc: 'organization-info', depends: ['filing','annual_license','treasury','registered_office'], domains: ['corporate','licensing'] }
          ],
          fees: [
            { amount: 'KYD 750', authority: 'Registrar of Companies', desc: 'Registration filing' },
            { amount: 'KYD 0\u201351,200', authority: 'Registrar', desc: 'Annual license (tiered by capital)' }
          ],
          params: [
            { name: 'legal_name', type: 'string', required: true },
            { name: 'entity_type', type: 'enum', required: true, values: ['ordinary_non_resident','exempt','exempt_limited_partnership','llc','segregated_portfolio'] },
            { name: 'registered_office', type: 'string', required: true, note: 'Must be in Cayman Islands' }
          ]
        },
        'us-fl': {
          name: 'Florida',
          legal_basis: 'FL Business Corporation Act Ch.607; FL LLC Act Ch.605',
          steps: [
            { id: 'name_check',     type: 'filing.name_availability',        svc: 'organization-info', depends: [],                   domains: ['corporate'] },
            { id: 'entity_create',  type: 'create.entity',                   svc: 'organization-info', depends: ['name_check'],        domains: ['corporate','aml','sanctions','kyc'] },
            { id: 'filing',         type: 'filing.articles_of_incorporation', svc: 'organization-info', depends: ['entity_create'],    domains: ['corporate','licensing'] },
            { id: 'ein',            type: 'filing.ein_application',          svc: 'organization-info', depends: ['filing'],            domains: ['tax','corporate'] },
            { id: 'treasury',       type: 'create.treasury',                 svc: 'treasury-info',     depends: ['entity_create'],     domains: ['banking','aml','sanctions'] },
            { id: 'account',        type: 'create.bank_account',             svc: 'treasury-info',     depends: ['treasury'],          domains: ['banking','aml','sanctions','custody'] },
            { id: 'cap_table',      type: 'create.cap_table',               svc: 'governance-info',      depends: ['entity_create'],     domains: ['securities','corporate'] },
            { id: 'board',          type: 'create.board',                    svc: 'governance-info',      depends: ['entity_create'],     domains: ['corporate'] },
            { id: 'bylaws',         type: 'document.bylaws_adoption',        svc: 'governance-info',      depends: ['board'],             domains: ['corporate'] },
            { id: 'activate',       type: 'update.entity_status',            svc: 'organization-info', depends: ['filing','treasury'], domains: ['corporate'] }
          ],
          fees: [
            { amount: 'USD 70', authority: 'FL Division of Corporations', desc: 'Corp filing (LLC: $125)' },
            { amount: 'USD 0', authority: 'IRS', desc: 'EIN application (SS-4)' }
          ],
          params: [
            { name: 'legal_name', type: 'string', required: true },
            { name: 'entity_type', type: 'enum', required: true, values: ['corporation','professional_corporation','llc','lp','lllp'] },
            { name: 'registered_agent', type: 'string', required: true, note: 'FL resident or registered agent' }
          ]
        },
        'hk': {
          name: 'Hong Kong',
          legal_basis: 'Companies Ordinance (Cap 622) Part 3',
          steps: [
            { id: 'name_check',         type: 'filing.name_search',           svc: 'organization-info', depends: [],                     domains: ['corporate'] },
            { id: 'entity_create',      type: 'create.entity',                svc: 'organization-info', depends: ['name_check'],          domains: ['corporate','aml','sanctions','kyc'] },
            { id: 'filing',             type: 'filing.incorporation',         svc: 'organization-info', depends: ['entity_create'],       domains: ['corporate','licensing'] },
            { id: 'business_reg',       type: 'filing.business_registration', svc: 'organization-info', depends: ['filing'],              domains: ['tax','licensing','corporate'] },
            { id: 'treasury',           type: 'create.treasury',              svc: 'treasury-info',     depends: ['entity_create'],       domains: ['banking','aml','sanctions'] },
            { id: 'account',            type: 'create.bank_account',          svc: 'treasury-info',     depends: ['treasury'],            domains: ['banking','aml','sanctions','custody'] },
            { id: 'cap_table',          type: 'create.cap_table',            svc: 'governance-info',      depends: ['entity_create'],       domains: ['securities','corporate'] },
            { id: 'board',              type: 'create.board',                 svc: 'governance-info',      depends: ['entity_create'],       domains: ['corporate'] },
            { id: 'secretary',          type: 'create.company_secretary',     svc: 'governance-info',      depends: ['entity_create'],       domains: ['corporate'] },
            { id: 'articles',           type: 'document.articles_of_association', svc: 'governance-info',  depends: ['board'],               domains: ['corporate'] },
            { id: 'activate',           type: 'update.entity_status',         svc: 'organization-info', depends: ['filing','business_reg','treasury'], domains: ['corporate','licensing'] }
          ],
          fees: [
            { amount: 'HKD 0', authority: 'Companies Registry', desc: 'Name search' },
            { amount: 'HKD 1,720', authority: 'Companies Registry', desc: 'Incorporation (Form NNC1)' },
            { amount: 'HKD 2,000', authority: 'IRD', desc: 'Business registration (1-yr)' }
          ],
          params: [
            { name: 'legal_name', type: 'string', required: true },
            { name: 'entity_type', type: 'enum', required: true, values: ['private_company_limited_by_shares','public_company','company_limited_by_guarantee'] },
            { name: 'company_secretary', type: 'string', required: true, note: 'Must be HK resident' }
          ]
        },
        'in': {
          name: 'India',
          legal_basis: 'Companies Act 2013 s.3-22',
          steps: [
            { id: 'din_application',    type: 'filing.din_application',       svc: 'identity-info',     depends: [],                     domains: ['corporate','kyc'] },
            { id: 'dsc_registration',   type: 'filing.dsc_registration',      svc: 'identity-info',     depends: ['din_application'],     domains: ['corporate','data_privacy'] },
            { id: 'name_check',         type: 'filing.name_reservation',      svc: 'organization-info', depends: ['dsc_registration'],    domains: ['corporate'] },
            { id: 'entity_create',      type: 'create.entity',                svc: 'organization-info', depends: ['name_check'],          domains: ['corporate','aml','sanctions','kyc'] },
            { id: 'filing',             type: 'filing.spice_plus',            svc: 'organization-info', depends: ['entity_create'],       domains: ['corporate','licensing'] },
            { id: 'pan_registration',   type: 'filing.pan_registration',      svc: 'organization-info', depends: ['filing'],              domains: ['tax','corporate'] },
            { id: 'tan_registration',   type: 'filing.tan_registration',      svc: 'organization-info', depends: ['filing'],              domains: ['tax'] },
            { id: 'gst_registration',   type: 'filing.gst_registration',      svc: 'organization-info', depends: ['pan_registration'],    domains: ['tax'] },
            { id: 'professional_tax',   type: 'filing.professional_tax',      svc: 'organization-info', depends: ['filing'],              domains: ['tax','employment'] },
            { id: 'esi_epf',            type: 'filing.social_security',       svc: 'organization-info', depends: ['filing'],              domains: ['employment','corporate'] },
            { id: 'treasury',           type: 'create.treasury',              svc: 'treasury-info',     depends: ['entity_create'],       domains: ['banking','aml','sanctions'] },
            { id: 'account',            type: 'create.bank_account',          svc: 'treasury-info',     depends: ['treasury'],            domains: ['banking','aml','sanctions','custody'] },
            { id: 'cap_table',          type: 'create.cap_table',            svc: 'governance-info',      depends: ['entity_create'],       domains: ['securities','corporate'] },
            { id: 'board',              type: 'create.board',                 svc: 'governance-info',      depends: ['entity_create'],       domains: ['corporate','immigration'] },
            { id: 'memorandum',         type: 'document.moa_and_aoa',        svc: 'governance-info',      depends: ['board'],               domains: ['corporate'] },
            { id: 'activate',           type: 'update.entity_status',         svc: 'organization-info', depends: ['filing','pan_registration','tan_registration','treasury'], domains: ['corporate','licensing','tax'] }
          ],
          fees: [
            { amount: 'INR 500', authority: 'MCA', desc: 'DIN application (per director)' },
            { amount: 'INR 1,500', authority: 'CCA', desc: 'DSC registration' },
            { amount: 'INR 1,000', authority: 'MCA', desc: 'Name reservation (RUN)' },
            { amount: 'INR 500\u20135,000', authority: 'MCA', desc: 'SPICe+ filing (INC-32)' }
          ],
          params: [
            { name: 'legal_name', type: 'string', required: true },
            { name: 'entity_type', type: 'enum', required: true, values: ['private_limited','public_limited','opc','section_8','llp','nidhi'] },
            { name: 'pan', type: 'string', required: true, note: 'PAN of incorporator (10 chars)' },
            { name: 'registered_address', type: 'string', required: true, note: 'Must be in India' }
          ]
        },
        'gb': {
          name: 'United Kingdom',
          legal_basis: 'Companies Act 2006 Part 2 s.7-16',
          steps: [
            { id: 'name_check',         type: 'filing.name_availability',     svc: 'organization-info', depends: [],                     domains: ['corporate'] },
            { id: 'entity_create',      type: 'create.entity',                svc: 'organization-info', depends: ['name_check'],          domains: ['corporate','aml','sanctions','kyc'] },
            { id: 'filing',             type: 'filing.incorporation',         svc: 'organization-info', depends: ['entity_create'],       domains: ['corporate','licensing'] },
            { id: 'hmrc_registration',  type: 'filing.corporation_tax',       svc: 'organization-info', depends: ['filing'],              domains: ['tax','corporate'] },
            { id: 'vat_registration',   type: 'filing.vat_registration',      svc: 'organization-info', depends: ['filing'],              domains: ['tax'] },
            { id: 'paye_registration',  type: 'filing.paye_registration',     svc: 'organization-info', depends: ['filing'],              domains: ['tax','employment'] },
            { id: 'treasury',           type: 'create.treasury',              svc: 'treasury-info',     depends: ['entity_create'],       domains: ['banking','aml','sanctions'] },
            { id: 'account',            type: 'create.bank_account',          svc: 'treasury-info',     depends: ['treasury'],            domains: ['banking','aml','sanctions','custody'] },
            { id: 'cap_table',          type: 'create.cap_table',            svc: 'governance-info',      depends: ['entity_create'],       domains: ['securities','corporate'] },
            { id: 'board',              type: 'create.board',                 svc: 'governance-info',      depends: ['entity_create'],       domains: ['corporate'] },
            { id: 'secretary',          type: 'create.company_secretary',     svc: 'governance-info',      depends: ['entity_create'],       domains: ['corporate'] },
            { id: 'articles',           type: 'document.articles_of_association', svc: 'governance-info',  depends: ['board'],               domains: ['corporate'] },
            { id: 'pscs',               type: 'filing.psc_register',          svc: 'organization-info', depends: ['entity_create'],       domains: ['corporate','aml','sanctions'] },
            { id: 'activate',           type: 'update.entity_status',         svc: 'organization-info', depends: ['filing','hmrc_registration','treasury'], domains: ['corporate','licensing','tax'] }
          ],
          fees: [
            { amount: 'GBP 12', authority: 'Companies House', desc: 'Online incorporation (same-day: GBP 30)' },
            { amount: 'GBP 0', authority: 'HMRC', desc: 'Corporation tax registration (CT41G)' }
          ],
          params: [
            { name: 'legal_name', type: 'string', required: true },
            { name: 'entity_type', type: 'enum', required: true, values: ['ltd','plc','llp','cic','unlimited'] },
            { name: 'registered_office', type: 'string', required: true, note: 'Must be in England, Wales, Scotland, or N. Ireland' }
          ]
        },
        'sc': {
          name: 'Seychelles',
          legal_basis: 'IBC Act 2016 s.4-15',
          steps: [
            { id: 'name_check',        type: 'filing.name_reservation',           svc: 'organization-info', depends: [],                                                         domains: ['corporate'] },
            { id: 'registered_agent',   type: 'filing.registered_agent',           svc: 'organization-info', depends: [],                                                         domains: ['corporate','licensing'] },
            { id: 'entity_create',      type: 'create.entity',                     svc: 'organization-info', depends: ['name_check','registered_agent'],                           domains: ['corporate','aml','sanctions','kyc'] },
            { id: 'fsa_filing',         type: 'filing.certificate',                svc: 'organization-info', depends: ['entity_create'],                                           domains: ['corporate','licensing'] },
            { id: 'tin_registration',   type: 'filing.tax_registration',           svc: 'organization-info', depends: ['entity_create'],                                           domains: ['tax'] },
            { id: 'ibc_exemption',      type: 'compliance.ibc_exemption',          svc: 'compliance-info',   depends: ['tin_registration'],                                        domains: ['tax','corporate'] },
            { id: 'treasury_create',    type: 'create.treasury',                   svc: 'treasury-info',     depends: ['entity_create'],                                           domains: ['banking','aml'] },
            { id: 'bank_account',       type: 'create.bank_account',               svc: 'treasury-info',     depends: ['treasury_create'],                                         domains: ['banking','payments','aml'] },
            { id: 'cap_table',          type: 'create.cap_table',                  svc: 'governance-info',      depends: ['entity_create'],                                           domains: ['securities','corporate'] },
            { id: 'directors',          type: 'consent.board',                     svc: 'governance-info',      depends: ['entity_create'],                                           domains: ['corporate'] },
            { id: 'memorandum',         type: 'document.memorandum_and_articles',  svc: 'governance-info',      depends: ['directors'],                                               domains: ['corporate'] },
            { id: 'beneficial_owners',  type: 'filing.beneficial_ownership',       svc: 'organization-info', depends: ['entity_create'],                                           domains: ['aml','corporate'] },
            { id: 'activate',           type: 'update.entity_status',              svc: 'organization-info', depends: ['fsa_filing','tin_registration','treasury_create','beneficial_owners'], domains: ['corporate','licensing'] }
          ],
          fees: [
            { amount: 'USD 100', authority: 'FSA', desc: 'Name reservation' },
            { amount: 'USD 100', authority: 'FSA', desc: 'Certificate of Incorporation' },
            { amount: 'USD 100', authority: 'FSA', desc: 'Annual license fee' }
          ],
          params: [
            { name: 'legal_name', type: 'string', required: true, note: 'Must end in Ltd, Corp, Inc, SA, or GmbH' },
            { name: 'entity_type', type: 'enum', required: true, values: ['ibc','special_license_company','protected_cell_company','limited_partnership','foundation'] },
            { name: 'registered_agent', type: 'string', required: true, note: 'Licensed CSP in Seychelles' }
          ]
        },
        'difc': {
          name: 'DIFC',
          legal_basis: 'DIFC Companies Law No. 5 of 2018 Part 3',
          steps: [
            { id: 'name_check',         type: 'filing.name_reservation',       svc: 'organization-info', depends: [],                     domains: ['corporate'] },
            { id: 'entity_create',      type: 'create.entity',                 svc: 'organization-info', depends: ['name_check'],          domains: ['corporate','aml','sanctions','kyc'] },
            { id: 'filing',             type: 'filing.certificate',            svc: 'organization-info', depends: ['entity_create'],       domains: ['corporate','licensing'] },
            { id: 'trade_license',      type: 'licensing.acquire',             svc: 'organization-info', depends: ['filing'],              domains: ['licensing','corporate'] },
            { id: 'data_protection',    type: 'filing.data_protection',        svc: 'organization-info', depends: ['entity_create'],       domains: ['data_privacy'] },
            { id: 'treasury_create',    type: 'create.treasury',               svc: 'treasury-info',     depends: ['entity_create'],       domains: ['banking','aml'] },
            { id: 'bank_account',       type: 'create.bank_account',           svc: 'treasury-info',     depends: ['treasury_create'],     domains: ['banking','payments','aml'] },
            { id: 'cap_table',          type: 'create.cap_table',              svc: 'governance-info',      depends: ['entity_create'],       domains: ['securities','corporate'] },
            { id: 'directors',          type: 'consent.board',                 svc: 'governance-info',      depends: ['entity_create'],       domains: ['corporate'] },
            { id: 'initial_shares',     type: 'ownership.issue_shares',        svc: 'governance-info',      depends: ['cap_table','directors'], domains: ['securities','corporate'] }
          ],
          fees: [
            { amount: 'USD 100', authority: 'DIFC Registrar', desc: 'Name reservation' },
            { amount: 'USD 8,000', authority: 'DIFC Registrar', desc: 'Registration fee' },
            { amount: 'USD 12,000', authority: 'DFSA', desc: 'Commercial license' }
          ],
          params: [
            { name: 'legal_name', type: 'string', required: true },
            { name: 'entity_type', type: 'enum', required: true, values: ['private_company','public_company','limited_liability_partnership','branch'] },
            { name: 'share_capital', type: 'string', required: true, note: 'Minimum USD 50,000' }
          ]
        },
        'dmcc': {
          name: 'DMCC',
          legal_basis: 'DMCC Company Regulations 2020',
          steps: [
            { id: 'name_check',         type: 'filing.name_reservation',       svc: 'organization-info', depends: [],                     domains: ['corporate'] },
            { id: 'entity_create',      type: 'create.entity',                 svc: 'organization-info', depends: ['name_check'],          domains: ['corporate','aml','sanctions','kyc'] },
            { id: 'filing',             type: 'filing.certificate',            svc: 'organization-info', depends: ['entity_create'],       domains: ['corporate','licensing'] },
            { id: 'trade_license',      type: 'licensing.acquire',             svc: 'organization-info', depends: ['filing'],              domains: ['licensing','trade'] },
            { id: 'treasury_create',    type: 'create.treasury',               svc: 'treasury-info',     depends: ['entity_create'],       domains: ['banking','aml'] },
            { id: 'bank_account',       type: 'create.bank_account',           svc: 'treasury-info',     depends: ['treasury_create'],     domains: ['banking','payments','aml'] },
            { id: 'cap_table',          type: 'create.cap_table',              svc: 'governance-info',      depends: ['entity_create'],       domains: ['securities','corporate'] },
            { id: 'directors',          type: 'consent.board',                 svc: 'governance-info',      depends: ['entity_create'],       domains: ['corporate'] },
            { id: 'activate',           type: 'update.entity_status',          svc: 'organization-info', depends: ['filing','trade_license','treasury_create'], domains: ['corporate','licensing'] }
          ],
          fees: [
            { amount: 'AED 1,080', authority: 'DMCC', desc: 'Name reservation' },
            { amount: 'AED 9,735', authority: 'DMCC', desc: 'Registration + license (DMCC Free Zone)' }
          ],
          params: [
            { name: 'legal_name', type: 'string', required: true },
            { name: 'entity_type', type: 'enum', required: true, values: ['dmcc_company','branch','free_zone_company'] },
            { name: 'activity', type: 'string', required: true, note: 'DMCC licensed activity code' }
          ]
        },
        'jafza': {
          name: 'JAFZA',
          legal_basis: 'JAFZA Implementing Regulations 2016',
          steps: [
            { id: 'name_check',         type: 'filing.name_reservation',       svc: 'organization-info', depends: [],                     domains: ['corporate'] },
            { id: 'entity_create',      type: 'create.entity',                 svc: 'organization-info', depends: ['name_check'],          domains: ['corporate','aml','sanctions','kyc'] },
            { id: 'filing',             type: 'filing.certificate',            svc: 'organization-info', depends: ['entity_create'],       domains: ['corporate','licensing'] },
            { id: 'trade_license',      type: 'licensing.acquire',             svc: 'organization-info', depends: ['filing'],              domains: ['licensing','trade'] },
            { id: 'customs_code',       type: 'filing.customs_registration',   svc: 'organization-info', depends: ['filing'],              domains: ['trade'] },
            { id: 'treasury_create',    type: 'create.treasury',               svc: 'treasury-info',     depends: ['entity_create'],       domains: ['banking','aml'] },
            { id: 'bank_account',       type: 'create.bank_account',           svc: 'treasury-info',     depends: ['treasury_create'],     domains: ['banking','payments','aml'] },
            { id: 'cap_table',          type: 'create.cap_table',              svc: 'governance-info',      depends: ['entity_create'],       domains: ['securities','corporate'] },
            { id: 'activate',           type: 'update.entity_status',          svc: 'organization-info', depends: ['filing','trade_license','customs_code','treasury_create'], domains: ['corporate','licensing','trade'] }
          ],
          fees: [
            { amount: 'AED 1,000', authority: 'JAFZA', desc: 'Name reservation' },
            { amount: 'AED 10,000', authority: 'JAFZA', desc: 'Registration fee' },
            { amount: 'AED 15,000', authority: 'JAFZA', desc: 'Trade license' }
          ],
          params: [
            { name: 'legal_name', type: 'string', required: true },
            { name: 'entity_type', type: 'enum', required: true, values: ['fze','fzco','branch','national_establishment'] },
            { name: 'warehouse', type: 'boolean', required: false, note: 'Warehouse lease required for trading companies' }
          ]
        },
        'jp': {
          name: 'Japan',
          legal_basis: 'Companies Act (Kaisha-h\u014d) 2005 Part II',
          steps: [
            { id: 'name_check',         type: 'filing.name_search',            svc: 'organization-info', depends: [],                     domains: ['corporate'] },
            { id: 'seal_registration',   type: 'filing.seal_registration',     svc: 'identity-info',     depends: [],                     domains: ['corporate'] },
            { id: 'entity_create',      type: 'create.entity',                 svc: 'organization-info', depends: ['name_check','seal_registration'], domains: ['corporate','aml','sanctions','kyc'] },
            { id: 'filing',             type: 'filing.registration',           svc: 'organization-info', depends: ['entity_create'],       domains: ['corporate','licensing'] },
            { id: 'nta_registration',   type: 'filing.tax_registration',       svc: 'organization-info', depends: ['filing'],              domains: ['tax','corporate'] },
            { id: 'treasury_create',    type: 'create.treasury',               svc: 'treasury-info',     depends: ['entity_create'],       domains: ['banking','aml'] },
            { id: 'bank_account',       type: 'create.bank_account',           svc: 'treasury-info',     depends: ['treasury_create'],     domains: ['banking','payments','aml'] },
            { id: 'cap_table',          type: 'create.cap_table',              svc: 'governance-info',      depends: ['entity_create'],       domains: ['securities','corporate'] },
            { id: 'directors',          type: 'consent.board',                 svc: 'governance-info',      depends: ['entity_create'],       domains: ['corporate'] },
            { id: 'articles',           type: 'document.articles_of_incorporation', svc: 'governance-info', depends: ['directors'],           domains: ['corporate'] },
            { id: 'activate',           type: 'update.entity_status',          svc: 'organization-info', depends: ['filing','nta_registration','treasury_create'], domains: ['corporate','licensing'] }
          ],
          fees: [
            { amount: 'JPY 0', authority: 'MOJ', desc: 'Name search' },
            { amount: 'JPY 150,000', authority: 'MOJ Legal Affairs Bureau', desc: 'Registration (KK)' },
            { amount: 'JPY 50,000', authority: 'Notary', desc: 'Articles of Incorporation notarization' }
          ],
          params: [
            { name: 'legal_name', type: 'string', required: true, note: 'Kanji, katakana, or romaji' },
            { name: 'entity_type', type: 'enum', required: true, values: ['kabushiki_kaisha','godo_kaisha','branch'] },
            { name: 'registered_seal', type: 'string', required: true, note: 'Company seal (inkan) required' }
          ]
        },
        'au': {
          name: 'Australia',
          legal_basis: 'Corporations Act 2001 Part 2A',
          steps: [
            { id: 'name_check',         type: 'filing.name_reservation',       svc: 'organization-info', depends: [],                     domains: ['corporate'] },
            { id: 'entity_create',      type: 'create.entity',                 svc: 'organization-info', depends: ['name_check'],          domains: ['corporate','aml','sanctions','kyc'] },
            { id: 'asic_filing',        type: 'filing.registration',           svc: 'organization-info', depends: ['entity_create'],       domains: ['corporate','licensing'] },
            { id: 'abn_registration',   type: 'filing.tax_registration',       svc: 'organization-info', depends: ['asic_filing'],         domains: ['tax','corporate'] },
            { id: 'gst_registration',   type: 'filing.gst_registration',       svc: 'organization-info', depends: ['abn_registration'],    domains: ['tax'] },
            { id: 'treasury_create',    type: 'create.treasury',               svc: 'treasury-info',     depends: ['entity_create'],       domains: ['banking','aml'] },
            { id: 'bank_account',       type: 'create.bank_account',           svc: 'treasury-info',     depends: ['treasury_create'],     domains: ['banking','payments','aml'] },
            { id: 'cap_table',          type: 'create.cap_table',              svc: 'governance-info',      depends: ['entity_create'],       domains: ['securities','corporate'] },
            { id: 'directors',          type: 'consent.board',                 svc: 'governance-info',      depends: ['entity_create'],       domains: ['corporate'] },
            { id: 'activate',           type: 'update.entity_status',          svc: 'organization-info', depends: ['asic_filing','abn_registration','treasury_create'], domains: ['corporate','licensing'] }
          ],
          fees: [
            { amount: 'AUD 538', authority: 'ASIC', desc: 'Company registration' },
            { amount: 'AUD 0', authority: 'ATO', desc: 'ABN application' }
          ],
          params: [
            { name: 'legal_name', type: 'string', required: true },
            { name: 'entity_type', type: 'enum', required: true, values: ['proprietary_limited','public','no_liability','unlimited'] },
            { name: 'registered_office', type: 'string', required: true, note: 'Must be in Australia' }
          ]
        },
        'vg': {
          name: 'BVI',
          legal_basis: 'BVI Business Companies Act 2004 Part II',
          steps: [
            { id: 'name_check',         type: 'filing.name_reservation',       svc: 'organization-info', depends: [],                     domains: ['corporate'] },
            { id: 'registered_agent',   type: 'filing.registered_agent',       svc: 'organization-info', depends: [],                     domains: ['corporate','licensing'] },
            { id: 'entity_create',      type: 'create.entity',                 svc: 'organization-info', depends: ['name_check','registered_agent'], domains: ['corporate','aml','sanctions','kyc'] },
            { id: 'filing',             type: 'filing.registration',           svc: 'organization-info', depends: ['entity_create'],       domains: ['corporate','licensing'] },
            { id: 'treasury_create',    type: 'create.treasury',               svc: 'treasury-info',     depends: ['entity_create'],       domains: ['banking','aml'] },
            { id: 'bank_account',       type: 'create.bank_account',           svc: 'treasury-info',     depends: ['treasury_create'],     domains: ['banking','payments','aml'] },
            { id: 'cap_table',          type: 'create.cap_table',              svc: 'governance-info',      depends: ['entity_create'],       domains: ['securities','corporate'] },
            { id: 'directors',          type: 'consent.board',                 svc: 'governance-info',      depends: ['entity_create'],       domains: ['corporate'] },
            { id: 'memorandum',         type: 'document.memorandum_and_articles', svc: 'governance-info',   depends: ['directors'],           domains: ['corporate'] },
            { id: 'beneficial_owners',  type: 'filing.beneficial_ownership',   svc: 'organization-info', depends: ['entity_create'],       domains: ['aml','corporate'] },
            { id: 'activate',           type: 'update.entity_status',          svc: 'organization-info', depends: ['filing','treasury_create','beneficial_owners'], domains: ['corporate','licensing'] }
          ],
          fees: [
            { amount: 'USD 350', authority: 'Registrar of Corporate Affairs', desc: 'Incorporation fee (50,000 shares)' },
            { amount: 'USD 350', authority: 'Registrar', desc: 'Annual license fee' }
          ],
          params: [
            { name: 'legal_name', type: 'string', required: true },
            { name: 'entity_type', type: 'enum', required: true, values: ['bc_limited','bc_unlimited','segregated_portfolio','limited_partnership'] },
            { name: 'registered_agent', type: 'string', required: true, note: 'Licensed RA in BVI' }
          ]
        },
        'prospera': {
          name: 'Prospera',
          legal_basis: 'Prospera ZEDE Organic Charter Art. 38-52',
          steps: [
            { id: 'eresidency',         type: 'identity.eresidency',           svc: 'identity-info',     depends: [],                     domains: ['kyc','data_privacy'] },
            { id: 'name_check',         type: 'filing.name_availability',      svc: 'organization-info', depends: ['eresidency'],          domains: ['corporate'] },
            { id: 'entity_create',      type: 'create.entity',                 svc: 'organization-info', depends: ['name_check'],          domains: ['corporate','aml','sanctions','kyc'] },
            { id: 'filing',             type: 'filing.registration',           svc: 'organization-info', depends: ['entity_create'],       domains: ['corporate','licensing'] },
            { id: 'treasury_create',    type: 'create.treasury',               svc: 'treasury-info',     depends: ['entity_create'],       domains: ['banking','aml'] },
            { id: 'bank_account',       type: 'create.bank_account',           svc: 'treasury-info',     depends: ['treasury_create'],     domains: ['banking','payments','aml'] },
            { id: 'cap_table',          type: 'create.cap_table',              svc: 'governance-info',      depends: ['entity_create'],       domains: ['securities','corporate'] },
            { id: 'arbitration_clause', type: 'consent.arbitration_agreement', svc: 'governance-info',      depends: ['entity_create'],       domains: ['arbitration','corporate'] },
            { id: 'activate',           type: 'update.entity_status',          svc: 'organization-info', depends: ['filing','treasury_create'], domains: ['corporate','licensing'] }
          ],
          fees: [
            { amount: 'USD 260', authority: 'Prospera Registrar', desc: 'eResidency registration' },
            { amount: 'USD 1,300', authority: 'Prospera Registrar', desc: 'Entity formation' }
          ],
          params: [
            { name: 'legal_name', type: 'string', required: true },
            { name: 'entity_type', type: 'enum', required: true, values: ['llc','corporation','cooperative','dao_llc'] },
            { name: 'eresidency_id', type: 'string', required: true, note: 'Prospera eResident ID' }
          ]
        },
        'gi': {
          name: 'Gibraltar',
          legal_basis: 'Companies Act 2014 Part II',
          steps: [
            { id: 'name_check',         type: 'filing.name_availability',      svc: 'organization-info', depends: [],                     domains: ['corporate'] },
            { id: 'entity_create',      type: 'create.entity',                 svc: 'organization-info', depends: ['name_check'],          domains: ['corporate','aml','sanctions','kyc'] },
            { id: 'filing',             type: 'filing.registration',           svc: 'organization-info', depends: ['entity_create'],       domains: ['corporate','licensing'] },
            { id: 'tax_registration',   type: 'filing.tax_registration',       svc: 'organization-info', depends: ['filing'],              domains: ['tax','corporate'] },
            { id: 'dlt_license',        type: 'licensing.dlt_provider',        svc: 'organization-info', depends: ['filing'],              domains: ['digital_assets','licensing'] },
            { id: 'treasury_create',    type: 'create.treasury',               svc: 'treasury-info',     depends: ['entity_create'],       domains: ['banking','aml'] },
            { id: 'bank_account',       type: 'create.bank_account',           svc: 'treasury-info',     depends: ['treasury_create'],     domains: ['banking','payments','aml'] },
            { id: 'cap_table',          type: 'create.cap_table',              svc: 'governance-info',      depends: ['entity_create'],       domains: ['securities','corporate'] },
            { id: 'directors',          type: 'consent.board',                 svc: 'governance-info',      depends: ['entity_create'],       domains: ['corporate'] },
            { id: 'activate',           type: 'update.entity_status',          svc: 'organization-info', depends: ['filing','tax_registration','treasury_create'], domains: ['corporate','licensing'] }
          ],
          fees: [
            { amount: 'GBP 10', authority: 'Companies House GI', desc: 'Name availability check' },
            { amount: 'GBP 100', authority: 'Companies House GI', desc: 'Incorporation fee' },
            { amount: 'GBP 2,100', authority: 'GFSC', desc: 'DLT provider license application' }
          ],
          params: [
            { name: 'legal_name', type: 'string', required: true },
            { name: 'entity_type', type: 'enum', required: true, values: ['private_limited','public_limited','llp','european_company'] },
            { name: 'registered_office', type: 'string', required: true, note: 'Must be in Gibraltar' }
          ]
        },
        'rw': {
          name: 'Rwanda',
          legal_basis: 'Law N\u00b0 007/2021 on Companies',
          steps: [
            { id: 'name_check',         type: 'filing.name_reservation',       svc: 'organization-info', depends: [],                     domains: ['corporate'] },
            { id: 'nid_verify',         type: 'identity.nid_verify',           svc: 'identity-info',     depends: [],                     domains: ['kyc','aml'] },
            { id: 'entity_create',      type: 'create.entity',                 svc: 'organization-info', depends: ['name_check','nid_verify'], domains: ['corporate','aml','sanctions','kyc'] },
            { id: 'rdb_filing',         type: 'filing.registration',           svc: 'organization-info', depends: ['entity_create'],       domains: ['corporate','licensing'] },
            { id: 'tin_registration',   type: 'filing.tax_registration',       svc: 'organization-info', depends: ['rdb_filing'],          domains: ['tax','corporate'] },
            { id: 'treasury_create',    type: 'create.treasury',               svc: 'treasury-info',     depends: ['entity_create'],       domains: ['banking','aml'] },
            { id: 'bank_account',       type: 'create.bank_account',           svc: 'treasury-info',     depends: ['treasury_create'],     domains: ['banking','payments','aml'] },
            { id: 'cap_table',          type: 'create.cap_table',              svc: 'governance-info',      depends: ['entity_create'],       domains: ['corporate'] },
            { id: 'activate',           type: 'update.entity_status',          svc: 'organization-info', depends: ['rdb_filing','tin_registration','treasury_create'], domains: ['corporate','licensing'] }
          ],
          fees: [
            { amount: 'RWF 0', authority: 'RDB', desc: 'Online registration (free via BRD portal)' },
            { amount: 'RWF 0', authority: 'RRA', desc: 'TIN registration' }
          ],
          params: [
            { name: 'legal_name', type: 'string', required: true },
            { name: 'entity_type', type: 'enum', required: true, values: ['private_limited','public_limited','branch','cooperative'] },
            { name: 'nid', type: 'string', required: true, note: 'NIDA National ID (16 digits)' }
          ]
        },
        'ng': {
          name: 'Nigeria',
          legal_basis: 'Companies and Allied Matters Act 2020 Part A',
          steps: [
            { id: 'name_check',         type: 'filing.name_reservation',       svc: 'organization-info', depends: [],                     domains: ['corporate'] },
            { id: 'nin_verify',         type: 'identity.nin_verify',           svc: 'identity-info',     depends: [],                     domains: ['kyc','aml'] },
            { id: 'entity_create',      type: 'create.entity',                 svc: 'organization-info', depends: ['name_check','nin_verify'], domains: ['corporate','aml','sanctions','kyc'] },
            { id: 'cac_filing',         type: 'filing.registration',           svc: 'organization-info', depends: ['entity_create'],       domains: ['corporate','licensing'] },
            { id: 'tin_registration',   type: 'filing.tax_registration',       svc: 'organization-info', depends: ['cac_filing'],          domains: ['tax','corporate'] },
            { id: 'treasury_create',    type: 'create.treasury',               svc: 'treasury-info',     depends: ['entity_create'],       domains: ['banking','aml'] },
            { id: 'bank_account',       type: 'create.bank_account',           svc: 'treasury-info',     depends: ['treasury_create'],     domains: ['banking','payments','aml'] },
            { id: 'cap_table',          type: 'create.cap_table',              svc: 'governance-info',      depends: ['entity_create'],       domains: ['securities','corporate'] },
            { id: 'directors',          type: 'consent.board',                 svc: 'governance-info',      depends: ['entity_create'],       domains: ['corporate'] },
            { id: 'activate',           type: 'update.entity_status',          svc: 'organization-info', depends: ['cac_filing','tin_registration','treasury_create'], domains: ['corporate','licensing'] }
          ],
          fees: [
            { amount: 'NGN 500', authority: 'CAC', desc: 'Name reservation' },
            { amount: 'NGN 10,000\u201340,000', authority: 'CAC', desc: 'Registration (Private: NGN 10,000; Public: NGN 40,000)' }
          ],
          params: [
            { name: 'legal_name', type: 'string', required: true },
            { name: 'entity_type', type: 'enum', required: true, values: ['private_limited','public_limited','unlimited','lp','llp'] },
            { name: 'nin', type: 'string', required: true, note: 'NIMC NIN (11 digits)' }
          ]
        },
        'za': {
          name: 'South Africa',
          legal_basis: 'Companies Act 71 of 2008 Chapter 2',
          steps: [
            { id: 'name_check',         type: 'filing.name_reservation',       svc: 'organization-info', depends: [],                     domains: ['corporate'] },
            { id: 'id_verify',          type: 'identity.sa_id_verify',         svc: 'identity-info',     depends: [],                     domains: ['kyc','aml'] },
            { id: 'entity_create',      type: 'create.entity',                 svc: 'organization-info', depends: ['name_check','id_verify'], domains: ['corporate','aml','sanctions','kyc'] },
            { id: 'cipc_filing',        type: 'filing.registration',           svc: 'organization-info', depends: ['entity_create'],       domains: ['corporate','licensing'] },
            { id: 'sars_registration',  type: 'filing.tax_registration',       svc: 'organization-info', depends: ['cipc_filing'],         domains: ['tax','corporate'] },
            { id: 'uif_registration',   type: 'filing.social_security',        svc: 'organization-info', depends: ['cipc_filing'],         domains: ['employment'] },
            { id: 'treasury_create',    type: 'create.treasury',               svc: 'treasury-info',     depends: ['entity_create'],       domains: ['banking','aml'] },
            { id: 'bank_account',       type: 'create.bank_account',           svc: 'treasury-info',     depends: ['treasury_create'],     domains: ['banking','payments','aml'] },
            { id: 'cap_table',          type: 'create.cap_table',              svc: 'governance-info',      depends: ['entity_create'],       domains: ['securities','corporate'] },
            { id: 'directors',          type: 'consent.board',                 svc: 'governance-info',      depends: ['entity_create'],       domains: ['corporate'] },
            { id: 'activate',           type: 'update.entity_status',          svc: 'organization-info', depends: ['cipc_filing','sars_registration','treasury_create'], domains: ['corporate','licensing'] }
          ],
          fees: [
            { amount: 'ZAR 50', authority: 'CIPC', desc: 'Name reservation' },
            { amount: 'ZAR 125', authority: 'CIPC', desc: 'Registration (Private Company)' }
          ],
          params: [
            { name: 'legal_name', type: 'string', required: true },
            { name: 'entity_type', type: 'enum', required: true, values: ['private_company','personal_liability','public_company','non_profit','external'] },
            { name: 'sa_id', type: 'string', required: true, note: 'SA ID Number (13 digits)' }
          ]
        },
        'mu': {
          name: 'Mauritius',
          legal_basis: 'Companies Act 2001 Part III',
          steps: [
            { id: 'name_check',         type: 'filing.name_reservation',       svc: 'organization-info', depends: [],                     domains: ['corporate'] },
            { id: 'entity_create',      type: 'create.entity',                 svc: 'organization-info', depends: ['name_check'],          domains: ['corporate','aml','sanctions','kyc'] },
            { id: 'cbrd_filing',        type: 'filing.registration',           svc: 'organization-info', depends: ['entity_create'],       domains: ['corporate','licensing'] },
            { id: 'tan_registration',   type: 'filing.tax_registration',       svc: 'organization-info', depends: ['cbrd_filing'],         domains: ['tax','corporate'] },
            { id: 'gbl_application',    type: 'licensing.global_business',     svc: 'organization-info', depends: ['cbrd_filing'],         domains: ['licensing','tax'] },
            { id: 'treasury_create',    type: 'create.treasury',               svc: 'treasury-info',     depends: ['entity_create'],       domains: ['banking','aml'] },
            { id: 'bank_account',       type: 'create.bank_account',           svc: 'treasury-info',     depends: ['treasury_create'],     domains: ['banking','payments','aml'] },
            { id: 'cap_table',          type: 'create.cap_table',              svc: 'governance-info',      depends: ['entity_create'],       domains: ['securities','corporate'] },
            { id: 'directors',          type: 'consent.board',                 svc: 'governance-info',      depends: ['entity_create'],       domains: ['corporate'] },
            { id: 'activate',           type: 'update.entity_status',          svc: 'organization-info', depends: ['cbrd_filing','tan_registration','treasury_create'], domains: ['corporate','licensing'] }
          ],
          fees: [
            { amount: 'MUR 100', authority: 'CBRD', desc: 'Name search' },
            { amount: 'MUR 4,000', authority: 'CBRD', desc: 'Domestic company registration' },
            { amount: 'USD 500', authority: 'FSC', desc: 'GBC1 license application (if applicable)' }
          ],
          params: [
            { name: 'legal_name', type: 'string', required: true },
            { name: 'entity_type', type: 'enum', required: true, values: ['domestic_company','global_business_company','authorised_company','limited_partnership'] },
            { name: 'management_company', type: 'string', required: false, note: 'Required for GBC1 license' }
          ]
        }
      }
    },
    'entity.dissolve': {
      desc: 'Entity dissolution and winding up',
      jurisdictions: {
        'us-de': { name: 'Delaware', legal_basis: 'DGCL 275-281', steps_count: 10, fee: '$204' },
        'us-fl': { name: 'Florida', legal_basis: 'FL BCA Ch.607.1401-607.1440', steps_count: 9, fee: 'USD 35' },
        'ae-abudhabi-adgm': { name: 'ADGM', legal_basis: 'ADGM Companies Reg 2020 Part 14', steps_count: 11, fee: 'AED 3,250' },
        'pk-sifc': { name: 'Pakistan', legal_basis: 'Companies Act 2017 s.301-362', steps_count: 14, fee: 'PKR 6,000' },
        'sg': { name: 'Singapore', legal_basis: 'Companies Act 1967 Part X', steps_count: 12, fee: 'SGD 150' },
        'ky': { name: 'Cayman Islands', legal_basis: 'Companies Act (2023 Rev) Part V s.94-135', steps_count: 11, fee: 'KYD 100' },
        'hk': { name: 'Hong Kong', legal_basis: 'Companies (Winding Up) Ordinance Cap 32', steps_count: 13, fee: 'HKD 760' },
        'in': { name: 'India', legal_basis: 'Companies Act 2013 s.248-252 (strike-off), s.270-365', steps_count: 14, fee: 'INR 30,000' },
        'gb': { name: 'United Kingdom', legal_basis: 'Companies Act 2006 Part 31', steps_count: 11, fee: 'GBP 10' },
        'sc': { name: 'Seychelles', legal_basis: 'IBC Act 2016 Part IV', steps_count: 10, fee: 'USD 200' }
      }
    },
    'fiscal.payment': {
      desc: 'Payment execution with compliance, sanctions, and withholding',
      jurisdictions: {
        'us-de': { name: 'Delaware', legal_basis: 'BSA/PATRIOT Act', steps_count: 8, fee: 'Varies' },
        'us-fl': { name: 'Florida', legal_basis: 'BSA, IRC s.1441/1445, FL Ch.560', steps_count: 8, fee: 'Varies' },
        'pk-sifc': {
          name: 'Pakistan', legal_basis: 'ITO 2001 s.149-156, AMLA 2010, SBP Regulations',
          steps: [
            { id: 'payer_verify',       type: 'identity.verify',              svc: 'identity-info',     depends: [],                   domains: ['kyc','aml'] },
            { id: 'ntn_verify',         type: 'identity.ntn_verify',          svc: 'identity-info',     depends: [],                   domains: ['tax','kyc'] },
            { id: 'recipient_verify',   type: 'identity.verify',              svc: 'identity-info',     depends: [],                   domains: ['kyc','aml'] },
            { id: 'sanctions_screen',   type: 'compliance.sanctions_check',   svc: 'compliance-info',   depends: [],                   domains: ['sanctions'] },
            { id: 'aml_screen',         type: 'compliance.aml_check',         svc: 'compliance-info',   depends: ['payer_verify'],      domains: ['aml'] },
            { id: 'filer_check',        type: 'tax.filer_status',             svc: 'treasury-info',     depends: ['ntn_verify'],        domains: ['tax'] },
            { id: 'withholding',        type: 'tax.withholding_compute',      svc: 'treasury-info',     depends: ['filer_check'],       domains: ['tax'] },
            { id: 'payment_execute',    type: 'payment.execute',              svc: 'treasury-info',     depends: ['sanctions_screen','aml_screen','withholding'], domains: ['payments','banking'] },
            { id: 'tax_event',          type: 'tax.record_event',             svc: 'treasury-info',     depends: ['payment_execute'],   domains: ['tax'] },
            { id: 'fbr_reporting',      type: 'tax.reporting',                svc: 'treasury-info',     depends: ['tax_event'],         domains: ['tax'] }
          ],
          fees: [{ amount: 'Varies', authority: 'SBP / FBR', desc: 'WHT per ITO s.149-156; filer/non-filer differential' }],
          params: [
            { name: 'payer_entity_id', type: 'string', required: true },
            { name: 'recipient_entity_id', type: 'string', required: true },
            { name: 'amount', type: 'number', required: true },
            { name: 'currency', type: 'enum', required: true, values: ['PKR','USD'] },
            { name: 'payment_rail', type: 'enum', required: false, values: ['raast','rtgs','ibft'] }
          ]
        },
        'sg': { name: 'Singapore', legal_basis: 'MAS Notice 626, ITA s.45, PS Act 2019', steps_count: 9, fee: 'Varies' },
        'ae': { name: 'UAE', legal_basis: 'Federal AML Law 20/2018, CBUAE, CT Law', steps_count: 9, fee: 'Varies' }
      }
    },
    'consent.equity_offer': {
      desc: 'Multi-party equity offering with securities compliance',
      jurisdictions: {
        'us-de': { name: 'Delaware', legal_basis: 'Securities Act 1933, Reg D/CF/A+', steps_count: 10, fee: 'Form D $0' },
        'us-fl': { name: 'Florida', legal_basis: 'Securities Act 1933, Reg D, FL s.517', steps_count: 10, fee: 'Form D $0' },
        'ae-abudhabi-adgm': { name: 'ADGM', legal_basis: 'FSRA FSMR 2015', steps_count: 12, fee: 'AED 100' },
        'sg': { name: 'Singapore', legal_basis: 'SFA Cap 289', steps_count: 12, fee: 'SGD 15' }
      }
    },
    'fiscal.open_account': {
      desc: 'Treasury and bank account creation',
      jurisdictions: {
        'us-de': { name: 'Delaware', legal_basis: 'BSA/CDD Rule', steps_count: 5 },
        'us-fl': { name: 'Florida', legal_basis: 'BSA/CDD Rule, FL Ch.655', steps_count: 5 },
        'ae-abudhabi-adgm': { name: 'ADGM', legal_basis: 'CBUAE', steps_count: 6 },
        'pk-sifc': { name: 'Pakistan', legal_basis: 'AMLA 2010', steps_count: 7 },
        'sg': { name: 'Singapore', legal_basis: 'MAS Notice 626', steps_count: 5 }
      }
    },
    'ownership.issue_shares': {
      desc: 'New share issuance with cap table update',
      jurisdictions: {
        'us-de': { name: 'Delaware', legal_basis: 'DGCL', steps_count: 8 },
        'us-fl': { name: 'Florida', legal_basis: 'FL BCA Ch.607.0601', steps_count: 8 },
        'ae-abudhabi-adgm': { name: 'ADGM', legal_basis: 'ADGM Companies Reg s.98-103', steps_count: 8 },
        'sg': { name: 'Singapore', legal_basis: 'Companies Act 1967', steps_count: 9 }
      }
    },
    'ownership.transfer': {
      desc: 'Share transfer with ROFR, lockup, drag-along, and tax events',
      jurisdictions: {
        'us-de': {
          name: 'Delaware', legal_basis: 'DGCL s.159, IRC s.1445-1446',
          steps: [
            { id: 'consent',          type: 'consent.board_approval',       svc: 'governance-info',      depends: [],                   domains: ['corporate'] },
            { id: 'restriction_check', type: 'ownership.restriction_check', svc: 'governance-info',      depends: ['consent'],          domains: ['securities','corporate'] },
            { id: 'transfer',         type: 'ownership.cap_table_transfer', svc: 'governance-info',      depends: ['restriction_check'], domains: ['securities','corporate'] },
            { id: 'compliance_verify', type: 'compliance.savm_verify',      svc: 'compliance-info',   depends: ['transfer'],         domains: ['securities'] },
            { id: 'withholding',      type: 'tax.withholding_compute',      svc: 'treasury-info',     depends: ['transfer'],         domains: ['tax'] },
            { id: 'tax_event',        type: 'tax.capital_gains',            svc: 'treasury-info',     depends: ['transfer'],         domains: ['tax'] },
            { id: 'certificate',      type: 'document.stock_certificate',   svc: 'governance-info',      depends: ['transfer'],         domains: ['corporate'] },
            { id: 'election_83b',     type: 'filing.election_83b',          svc: 'organization-info', depends: ['transfer'],         domains: ['tax'] }
          ],
          fees: [{ amount: 'Varies', authority: 'IRS', desc: 'FIRPTA withholding if applicable (IRC s.1445)' }],
          params: [
            { name: 'entity_id', type: 'string', required: true },
            { name: 'from_shareholder', type: 'string', required: true },
            { name: 'to_shareholder', type: 'string', required: true },
            { name: 'share_class', type: 'string', required: true },
            { name: 'num_shares', type: 'number', required: true }
          ]
        },
        'us-fl': { name: 'Florida', legal_basis: 'FL BCA Ch.607.0627, IRC s.1441/1445', steps_count: 8, fee: 'Varies' }
      }
    },
    'entity.rename': {
      desc: 'Entity name change with filing',
      jurisdictions: {
        'us-de': { name: 'Delaware', legal_basis: 'DGCL', steps_count: 6, fee: '$89' },
        'us-fl': { name: 'Florida', legal_basis: 'FL BCA Ch.607.1003', steps_count: 6, fee: 'USD 35' },
        'ae-abudhabi-adgm': { name: 'ADGM', legal_basis: 'ADGM Companies Reg', steps_count: 6, fee: 'AED 875' }
      }
    },
    'identity.verify': {
      desc: 'KYC/KYB identity verification routed through national adapters with sanctions and AML screening',
      jurisdictions: {
        'us-de': {
          name: 'United States',
          legal_basis: 'BSA 1970, USA PATRIOT Act 2001, FinCEN CDD Rule (31 CFR 1010.230)',
          steps: [
            { id: 'identity_verification', type: 'identity.provider_verification',  svc: 'identity-info', depends: [],                                      domains: ['kyc','data_privacy'] },
            { id: 'ssn_verification',      type: 'identity.ssn_verification',       svc: 'identity-info', depends: ['identity_verification'],                domains: ['kyc','tax'] },
            { id: 'ein_verification',      type: 'identity.ein_verification',       svc: 'identity-info', depends: ['identity_verification'],                domains: ['corporate','tax'] },
            { id: 'ofac_screening',        type: 'screening.sanctions',             svc: 'identity-info', depends: ['identity_verification'],                domains: ['sanctions'] },
            { id: 'aml_screening',         type: 'screening.aml',                   svc: 'identity-info', depends: ['identity_verification'],                domains: ['aml'] },
            { id: 'accreditation',         type: 'identity.accreditation_check',    svc: 'identity-info', depends: ['identity_verification','ofac_screening'], domains: ['securities'] }
          ],
          params: [
            { name: 'identity_id', type: 'string', required: true },
            { name: 'verification_level', type: 'enum', required: true, values: ['basic','standard','enhanced'] },
            { name: 'ssn', type: 'string', required: false, note: 'Enhanced only' },
            { name: 'ein', type: 'string', required: false, note: 'Corporate entities' }
          ]
        },
        'us-fl': {
          name: 'Florida',
          legal_basis: 'BSA 1970, USA PATRIOT Act 2001, FL Chapter 896, FL s.287.135',
          steps: [
            { id: 'identity_verification',          type: 'identity.provider_verification',      svc: 'identity-info', depends: [],                                                                  domains: ['kyc','data_privacy'] },
            { id: 'ssn_verification',                type: 'identity.ssn_verification',           svc: 'identity-info', depends: ['identity_verification'],                                           domains: ['kyc','tax'] },
            { id: 'ein_verification',                type: 'identity.ein_verification',           svc: 'identity-info', depends: ['identity_verification'],                                           domains: ['corporate','tax'] },
            { id: 'florida_dl_verification',         type: 'identity.florida_dl_verification',    svc: 'identity-info', depends: ['identity_verification'],                                           domains: ['kyc'] },
            { id: 'ofac_screening',                  type: 'screening.sanctions',                 svc: 'identity-info', depends: ['identity_verification'],                                           domains: ['sanctions'] },
            { id: 'florida_scrutinized_screening',   type: 'screening.florida_scrutinized',       svc: 'identity-info', depends: ['identity_verification'],                                           domains: ['sanctions'] },
            { id: 'aml_screening',                   type: 'screening.aml',                       svc: 'identity-info', depends: ['identity_verification'],                                           domains: ['aml'] },
            { id: 'accreditation',                   type: 'identity.accreditation_check',        svc: 'identity-info', depends: ['identity_verification','ofac_screening','florida_scrutinized_screening'], domains: ['securities'] }
          ],
          params: [
            { name: 'identity_id', type: 'string', required: true },
            { name: 'verification_level', type: 'enum', required: true, values: ['basic','standard','enhanced'] },
            { name: 'ssn', type: 'string', required: false, note: 'Enhanced only, ^[0-9]{3}-[0-9]{2}-[0-9]{4}$' },
            { name: 'ein', type: 'string', required: false, note: 'Corporate, ^[0-9]{2}-[0-9]{7}$' },
            { name: 'florida_dl', type: 'string', required: false, note: 'FL DL, ^[A-Z][0-9]{12}$' }
          ]
        },
        'pk-sifc': {
          name: 'Pakistan',
          legal_basis: 'AMLA 2010, SECP AML/CFT Guidelines 2018, SBP Prudential Regulations',
          steps: [
            { id: 'cnic_verification',   type: 'identity.cnic_verification',       svc: 'identity-info', depends: [],                                                            domains: ['kyc','aml','data_privacy'] },
            { id: 'biometric_match',     type: 'identity.biometric_verification',  svc: 'identity-info', depends: ['cnic_verification'],                                         domains: ['kyc','data_privacy'] },
            { id: 'ntn_verification',    type: 'identity.ntn_verification',        svc: 'identity-info', depends: ['cnic_verification'],                                         domains: ['tax','corporate'] },
            { id: 'sanctions_screening', type: 'screening.sanctions',              svc: 'identity-info', depends: ['cnic_verification'],                                         domains: ['sanctions'] },
            { id: 'aml_screening',       type: 'screening.aml',                    svc: 'identity-info', depends: ['cnic_verification'],                                         domains: ['aml'] },
            { id: 'pep_check',           type: 'screening.pep',                    svc: 'identity-info', depends: ['cnic_verification'],                                         domains: ['aml','sanctions'] },
            { id: 'accreditation',       type: 'identity.accreditation_check',     svc: 'identity-info', depends: ['cnic_verification','ntn_verification'],                      domains: ['securities'] }
          ],
          params: [
            { name: 'identity_id', type: 'string', required: true },
            { name: 'verification_level', type: 'enum', required: true, values: ['basic','standard','enhanced'] },
            { name: 'cnic', type: 'string', required: false, note: '^[0-9]{5}-[0-9]{7}-[0-9]$' },
            { name: 'ntn', type: 'string', required: false, note: '^[0-9]{7}-[0-9]$' }
          ]
        },
        'sg': {
          name: 'Singapore',
          legal_basis: 'MAS Notice 626, CDSA',
          steps: [
            { id: 'myinfo_verification', type: 'identity.myinfo_verification', svc: 'identity-info', depends: [],                                                         domains: ['kyc','data_privacy'] },
            { id: 'acra_check',          type: 'identity.acra_verification',   svc: 'identity-info', depends: ['myinfo_verification'],                                    domains: ['corporate','kyc'] },
            { id: 'sanctions_screening', type: 'screening.sanctions',          svc: 'identity-info', depends: ['myinfo_verification'],                                    domains: ['sanctions'] },
            { id: 'aml_screening',       type: 'screening.aml',               svc: 'identity-info', depends: ['myinfo_verification'],                                    domains: ['aml'] },
            { id: 'cdd_assessment',      type: 'screening.cdd',               svc: 'identity-info', depends: ['myinfo_verification','sanctions_screening','aml_screening'], domains: ['aml','kyc'] },
            { id: 'source_of_funds',     type: 'screening.source_of_funds',   svc: 'identity-info', depends: ['cdd_assessment'],                                          domains: ['aml','securities'] }
          ],
          params: [
            { name: 'identity_id', type: 'string', required: true },
            { name: 'verification_level', type: 'enum', required: true, values: ['basic','standard','enhanced'] },
            { name: 'nric', type: 'string', required: false, note: '^[STFGM][0-9]{7}[A-Z]$' },
            { name: 'uen', type: 'string', required: false, note: 'Corporate entities' }
          ]
        },
        'ae-abudhabi-adgm': { name: 'UAE/ADGM', legal_basis: 'Federal Decree-Law 20/2018, CBUAE AML/CFT Guidelines', steps_count: 6 },
        'in': { name: 'India', legal_basis: 'PMLA 2002, RBI KYC Master Direction 2016', steps_count: 7 },
        'gb': { name: 'United Kingdom', legal_basis: 'MLR 2017, Proceeds of Crime Act 2002', steps_count: 7 }
      }
    },
    'trade.export': {
      desc: 'Cross-border goods export with customs, sanctions, dual-use screening, and trade finance',
      jurisdictions: {
        'us-fl': {
          name: 'Florida',
          legal_basis: 'EAR (15 CFR 730-774), ITAR (22 CFR 120-130), FTR (15 CFR 30), OFAC (31 CFR 500-599)',
          steps: [
            { id: 'entity_verification',       type: 'check.entity_registration',            svc: 'organization-info', depends: [],                                                              domains: ['corporate','licensing'] },
            { id: 'sanctions_screening',       type: 'screening.sanctions',                   svc: 'identity-info',     depends: ['entity_verification'],                                         domains: ['sanctions','aml'] },
            { id: 'export_control_screening',  type: 'screening.export_controls',             svc: 'organization-info', depends: ['entity_verification'],                                         domains: ['trade','sanctions','licensing'] },
            { id: 'denied_party_screening',    type: 'screening.denied_parties',              svc: 'identity-info',     depends: ['entity_verification'],                                         domains: ['trade','sanctions'] },
            { id: 'fta_determination',         type: 'check.fta_eligibility',                 svc: 'organization-info', depends: ['entity_verification'],                                         domains: ['trade'] },
            { id: 'ftz_evaluation',            type: 'check.ftz_benefits',                    svc: 'organization-info', depends: ['entity_verification'],                                         domains: ['trade','tax'] },
            { id: 'customs_filing',            type: 'filing.electronic_export_information',  svc: 'organization-info', depends: ['sanctions_screening','export_control_screening','denied_party_screening'], domains: ['trade','licensing'] },
            { id: 'payment',                   type: 'payment.record',                        svc: 'treasury-info',     depends: ['customs_filing'],                                              domains: ['banking','aml','sanctions'] },
            { id: 'tax_event',                 type: 'create.tax_event',                      svc: 'treasury-info',     depends: ['customs_filing'],                                              domains: ['tax','trade'] }
          ],
          fees: [
            { amount: 'USD 0', authority: 'BIS', desc: 'AES filing (mandatory > $2,500)' },
            { amount: 'Varies', authority: 'BIS', desc: 'Export license if controlled (EAR99 exempt)' }
          ],
          params: [
            { name: 'destination_country', type: 'string', required: true, note: 'ISO alpha-2' },
            { name: 'goods_description', type: 'string', required: true },
            { name: 'hs_code', type: 'string', required: true, note: '4-10 digits' },
            { name: 'value', type: 'string', required: true },
            { name: 'currency', type: 'string', required: true },
            { name: 'buyer_id', type: 'string', required: true },
            { name: 'eccn', type: 'string', required: false, note: 'Export Control Classification Number' },
            { name: 'port_of_loading', type: 'string', required: false, note: 'Default: USMIA (PortMiami)' },
            { name: 'ftz_id', type: 'string', required: false, note: 'Foreign Trade Zone (5 FL FTZs)' }
          ]
        },
        'pk-sifc': {
          name: 'Pakistan',
          legal_basis: 'Customs Act 1969, SBP Foreign Exchange Regulations, Strategic Export Control Act 2004',
          steps: [
            { id: 'entity_verification',   type: 'check.entity_registration',      svc: 'organization-info', depends: [],                                                              domains: ['corporate','licensing'] },
            { id: 'export_license_check',  type: 'check.export_license',           svc: 'organization-info', depends: ['entity_verification'],                                         domains: ['trade','licensing'] },
            { id: 'dual_use_screening',    type: 'screening.dual_use',             svc: 'organization-info', depends: ['entity_verification'],                                         domains: ['trade','sanctions'] },
            { id: 'sanctions_screening',   type: 'screening.sanctions',            svc: 'identity-info',     depends: ['entity_verification'],                                         domains: ['sanctions','aml'] },
            { id: 'customs_declaration',   type: 'filing.customs_declaration',     svc: 'organization-info', depends: ['export_license_check','dual_use_screening','sanctions_screening'], domains: ['trade','tax','licensing'] },
            { id: 'quality_inspection',    type: 'check.inspection_certificate',   svc: 'organization-info', depends: ['customs_declaration'],                                         domains: ['trade'] },
            { id: 'letter_of_credit',      type: 'payment.initiate_lc',           svc: 'treasury-info',     depends: ['customs_declaration'],                                         domains: ['banking','trade','aml','sanctions'] },
            { id: 'shipping',              type: 'logistics.record_shipping',      svc: 'organization-info', depends: ['customs_declaration'],                                         domains: ['trade'] },
            { id: 'forex_declaration',     type: 'filing.forex_form_e',            svc: 'organization-info', depends: ['shipping'],                                                    domains: ['trade','banking','aml'] },
            { id: 'tax_event',             type: 'create.tax_event',               svc: 'treasury-info',     depends: ['customs_declaration'],                                         domains: ['tax','trade'] },
            { id: 'advance_payment',       type: 'payment.record_advance',         svc: 'treasury-info',     depends: ['customs_declaration'],                                         domains: ['banking','tax','aml'] },
            { id: 'payment_repatriation',  type: 'check.forex_repatriation',      svc: 'treasury-info',     depends: ['shipping','forex_declaration'],                                domains: ['banking','trade','aml'] }
          ],
          fees: [
            { amount: 'Varies', authority: 'Pakistan Customs', desc: 'WeBOC declaration fee' },
            { amount: '0.25%', authority: 'SBP', desc: 'Form E processing fee' }
          ],
          params: [
            { name: 'destination_country', type: 'string', required: true },
            { name: 'goods_description', type: 'string', required: true },
            { name: 'hs_code', type: 'string', required: true },
            { name: 'value', type: 'string', required: true },
            { name: 'currency', type: 'string', required: true, note: 'Default: PKR' },
            { name: 'buyer_id', type: 'string', required: true },
            { name: 'payment_method', type: 'enum', required: false, values: ['lc','advance','open_account','da'] },
            { name: 'port_of_loading', type: 'string', required: false, note: 'Default: PKKAR (Karachi)' },
            { name: 'fx_currency', type: 'enum', required: false, values: ['USD','EUR','GBP','CNY','AED','SAR'] }
          ]
        },
        'sg': { name: 'Singapore', legal_basis: 'Strategic Goods Act (Cap 300), Customs Act (Cap 70)', steps_count: 9, fee: 'Varies' },
        'ae-abudhabi-adgm': { name: 'UAE/ADGM', legal_basis: 'Federal Customs Law No.1/2003, AML Law 20/2018', steps_count: 9, fee: 'Varies' }
      }
    },
    'entity.amendment': {
      desc: 'Articles of incorporation or constitutional document amendment with regulatory filing',
      jurisdictions: {
        'us-de': {
          name: 'Delaware',
          legal_basis: 'DGCL Section 242 (Certificate of Amendment)',
          steps: [
            { id: 'board_resolution',    type: 'consent.board_resolution',        svc: 'governance-info',      depends: [],                     domains: ['corporate'] },
            { id: 'shareholder_vote',    type: 'consent.shareholder_approval',    svc: 'governance-info',      depends: ['board_resolution'],    domains: ['corporate','securities'] },
            { id: 'draft_amendment',     type: 'document.certificate_amendment',  svc: 'organization-info', depends: ['shareholder_vote'],    domains: ['corporate'] },
            { id: 'compliance_check',    type: 'compliance.amendment_review',     svc: 'compliance-info',   depends: ['draft_amendment'],     domains: ['corporate','securities'] },
            { id: 'filing',              type: 'filing.certificate_of_amendment', svc: 'organization-info', depends: ['compliance_check'],    domains: ['corporate','licensing'] },
            { id: 'cap_table_update',    type: 'ownership.cap_table_update',     svc: 'governance-info',      depends: ['filing'],              domains: ['securities','corporate'] },
            { id: 'notification',        type: 'notify.stakeholders',            svc: 'governance-info',      depends: ['filing'],              domains: ['corporate'] }
          ],
          fees: [
            { amount: '$150', authority: 'DE Division of Corporations', desc: 'Certificate of Amendment filing' }
          ],
          params: [
            { name: 'entity_id', type: 'string', required: true },
            { name: 'amendment_type', type: 'enum', required: true, values: ['name_change','authorized_shares','purpose','registered_agent','par_value','class_creation'] },
            { name: 'amendment_text', type: 'string', required: true, note: 'Proposed amendment language' },
            { name: 'effective_date', type: 'date', required: false, note: 'Future effective date (max 90 days)' }
          ]
        },
        'ae-abudhabi-adgm': {
          name: 'ADGM',
          legal_basis: 'ADGM Companies Regulations 2020 s.44-47',
          steps: [
            { id: 'special_resolution',  type: 'consent.special_resolution',     svc: 'governance-info',      depends: [],                     domains: ['corporate'] },
            { id: 'draft_amendment',      type: 'document.articles_amendment',    svc: 'organization-info', depends: ['special_resolution'],  domains: ['corporate'] },
            { id: 'ra_approval',          type: 'filing.ra_amendment_approval',   svc: 'organization-info', depends: ['draft_amendment'],     domains: ['corporate','licensing'] },
            { id: 'filing',               type: 'filing.amended_articles',        svc: 'organization-info', depends: ['ra_approval'],         domains: ['corporate','licensing'] },
            { id: 'trade_license_update', type: 'licensing.update',              svc: 'organization-info', depends: ['filing'],              domains: ['licensing','corporate'] },
            { id: 'notification',         type: 'notify.stakeholders',           svc: 'governance-info',      depends: ['filing'],              domains: ['corporate'] }
          ],
          fees: [
            { amount: 'AED 500', authority: 'ADGM RA', desc: 'Amendment filing' },
            { amount: 'AED 250', authority: 'ADGM RA', desc: 'Trade license update (if applicable)' }
          ],
          params: [
            { name: 'entity_id', type: 'string', required: true },
            { name: 'amendment_type', type: 'enum', required: true, values: ['articles','memorandum','share_capital','name','registered_office','objects'] },
            { name: 'resolution_date', type: 'date', required: true }
          ]
        },
        'pk-sifc': {
          name: 'Pakistan',
          legal_basis: 'Companies Act 2017 s.31-38 (Alteration of Memorandum/Articles)',
          steps: [
            { id: 'board_resolution',    type: 'consent.board_resolution',       svc: 'governance-info',      depends: [],                     domains: ['corporate'] },
            { id: 'special_resolution',  type: 'consent.special_resolution',     svc: 'governance-info',      depends: ['board_resolution'],    domains: ['corporate'] },
            { id: 'secp_form_sm2',       type: 'filing.form_sm2',               svc: 'organization-info', depends: ['special_resolution'],  domains: ['corporate','licensing'] },
            { id: 'compliance_check',    type: 'compliance.amendment_review',    svc: 'compliance-info',   depends: ['special_resolution'],  domains: ['corporate'] },
            { id: 'filing',              type: 'filing.altered_memorandum',      svc: 'organization-info', depends: ['secp_form_sm2','compliance_check'], domains: ['corporate','licensing'] },
            { id: 'fbr_notification',    type: 'notify.fbr_update',             svc: 'organization-info', depends: ['filing'],              domains: ['tax','corporate'] }
          ],
          fees: [
            { amount: 'PKR 500', authority: 'SECP', desc: 'Form SM-2 filing' },
            { amount: 'PKR 200', authority: 'SECP', desc: 'Certified copy fee' }
          ],
          params: [
            { name: 'entity_id', type: 'string', required: true },
            { name: 'amendment_type', type: 'enum', required: true, values: ['memorandum','articles','share_capital','name','objects','registered_office'] },
            { name: 'cnic', type: 'string', required: true, note: 'Director CNIC (13 digits)' }
          ]
        },
        'sg': { name: 'Singapore', legal_basis: 'Companies Act 1967 s.26-33', steps_count: 7, fee: 'SGD 60' },
        'hk': { name: 'Hong Kong', legal_basis: 'Companies Ordinance Cap 622 s.88-98', steps_count: 7, fee: 'HKD 1,720' },
        'gb': { name: 'United Kingdom', legal_basis: 'Companies Act 2006 s.21-28', steps_count: 6, fee: 'GBP 15' },
        'ky': { name: 'Cayman Islands', legal_basis: 'Companies Act (2023 Rev) s.8', steps_count: 6, fee: 'KYD 100' }
      }
    },
    'entity.annual_report': {
      desc: 'Annual report and compliance filing with regulatory authorities',
      jurisdictions: {
        'us-de': {
          name: 'Delaware',
          legal_basis: 'DGCL Section 502 (Annual Report), Title 8 Del.C. s.502',
          steps: [
            { id: 'financial_close',     type: 'fiscal.period_close',            svc: 'treasury-info',     depends: [],                     domains: ['corporate','tax'] },
            { id: 'officer_verification', type: 'identity.officer_verification', svc: 'identity-info',     depends: [],                     domains: ['corporate','kyc'] },
            { id: 'franchise_tax_calc',  type: 'tax.franchise_tax_compute',      svc: 'treasury-info',     depends: ['financial_close'],     domains: ['tax','corporate'] },
            { id: 'annual_report_prep',  type: 'document.annual_report',         svc: 'organization-info', depends: ['financial_close','officer_verification'], domains: ['corporate'] },
            { id: 'compliance_check',    type: 'compliance.annual_review',       svc: 'compliance-info',   depends: ['annual_report_prep'], domains: ['corporate','tax','licensing'] },
            { id: 'filing',              type: 'filing.annual_report',           svc: 'organization-info', depends: ['compliance_check','franchise_tax_calc'], domains: ['corporate','licensing'] },
            { id: 'tax_payment',         type: 'payment.franchise_tax',          svc: 'treasury-info',     depends: ['franchise_tax_calc'], domains: ['tax','payments'] },
            { id: 'confirmation',        type: 'document.filing_receipt',        svc: 'organization-info', depends: ['filing','tax_payment'], domains: ['corporate'] }
          ],
          fees: [
            { amount: '$50', authority: 'DE Division of Corporations', desc: 'Annual report filing' },
            { amount: '$175 min', authority: 'DE Division of Corporations', desc: 'Franchise tax (authorized shares method or assumed par value)' }
          ],
          params: [
            { name: 'entity_id', type: 'string', required: true },
            { name: 'fiscal_year_end', type: 'date', required: true },
            { name: 'tax_method', type: 'enum', required: false, values: ['authorized_shares','assumed_par_value'] },
            { name: 'total_gross_assets', type: 'number', required: false, note: 'Required for assumed par value method' }
          ]
        },
        'ae-abudhabi-adgm': {
          name: 'ADGM',
          legal_basis: 'ADGM Companies Regulations 2020 s.110-118',
          steps: [
            { id: 'financial_close',     type: 'fiscal.period_close',            svc: 'treasury-info',     depends: [],                     domains: ['corporate','tax'] },
            { id: 'audit_report',        type: 'document.audit_report',          svc: 'organization-info', depends: ['financial_close'],     domains: ['corporate'] },
            { id: 'ubo_verification',    type: 'identity.ubo_verification',      svc: 'identity-info',     depends: [],                     domains: ['aml','corporate'] },
            { id: 'annual_return',       type: 'document.annual_return',         svc: 'organization-info', depends: ['audit_report','ubo_verification'], domains: ['corporate','aml'] },
            { id: 'ra_filing',           type: 'filing.annual_return',           svc: 'organization-info', depends: ['annual_return'],       domains: ['corporate','licensing'] },
            { id: 'license_renewal',     type: 'licensing.renewal',              svc: 'organization-info', depends: ['ra_filing'],           domains: ['licensing','corporate'] },
            { id: 'esr_filing',          type: 'filing.economic_substance',      svc: 'organization-info', depends: ['financial_close'],     domains: ['tax','corporate'] },
            { id: 'ct_return',           type: 'filing.corporate_tax_return',    svc: 'treasury-info',     depends: ['financial_close'],     domains: ['tax'] }
          ],
          fees: [
            { amount: 'AED 1,000', authority: 'ADGM RA', desc: 'Annual return filing' },
            { amount: 'AED 1,050', authority: 'ADGM RA', desc: 'Trade license renewal' }
          ],
          params: [
            { name: 'entity_id', type: 'string', required: true },
            { name: 'fiscal_year_end', type: 'date', required: true },
            { name: 'auditor_name', type: 'string', required: true }
          ]
        },
        'pk-sifc': {
          name: 'Pakistan',
          legal_basis: 'Companies Act 2017 s.233-241 (Annual Returns), ITO 2001 s.114',
          steps: [
            { id: 'financial_close',     type: 'fiscal.period_close',            svc: 'treasury-info',     depends: [],                     domains: ['corporate','tax'] },
            { id: 'audit_report',        type: 'document.audit_report',          svc: 'organization-info', depends: ['financial_close'],     domains: ['corporate'] },
            { id: 'annual_return_prep',  type: 'document.form_a',               svc: 'organization-info', depends: ['audit_report'],        domains: ['corporate'] },
            { id: 'secp_filing',         type: 'filing.annual_return',           svc: 'organization-info', depends: ['annual_return_prep'],  domains: ['corporate','licensing'] },
            { id: 'fbr_income_tax',      type: 'filing.income_tax_return',       svc: 'treasury-info',     depends: ['financial_close'],     domains: ['tax'] },
            { id: 'fbr_withholding',     type: 'filing.withholding_statement',   svc: 'treasury-info',     depends: ['financial_close'],     domains: ['tax'] },
            { id: 'agm_minutes',         type: 'document.agm_minutes',          svc: 'governance-info',      depends: ['audit_report'],        domains: ['corporate'] },
            { id: 'compliance_cert',     type: 'document.compliance_certificate', svc: 'compliance-info',  depends: ['secp_filing','fbr_income_tax'], domains: ['corporate','tax','licensing'] }
          ],
          fees: [
            { amount: 'PKR 500\u20135,000', authority: 'SECP', desc: 'Annual return filing (Form A, scaled by capital)' },
            { amount: 'Varies', authority: 'FBR', desc: 'Income tax return filing (e-filing)' }
          ],
          params: [
            { name: 'entity_id', type: 'string', required: true },
            { name: 'fiscal_year_end', type: 'date', required: true },
            { name: 'ntn', type: 'string', required: true, note: 'FBR NTN (7 digits)' }
          ]
        },
        'sg': { name: 'Singapore', legal_basis: 'Companies Act 1967 s.197, IRAS s.68', steps_count: 8, fee: 'SGD 60' },
        'hk': { name: 'Hong Kong', legal_basis: 'Companies Ordinance Cap 622 s.662, IRO', steps_count: 9, fee: 'HKD 105' },
        'gb': { name: 'United Kingdom', legal_basis: 'Companies Act 2006 s.854-858, CTA 2009', steps_count: 8, fee: 'GBP 13' },
        'in': { name: 'India', legal_basis: 'Companies Act 2013 s.92 (MGT-7), ITA 1961 s.139', steps_count: 10, fee: 'INR 200\u201360,000' },
        'ky': { name: 'Cayman Islands', legal_basis: 'Companies Act (2023 Rev) s.230, Tax Information Authority Act', steps_count: 7, fee: 'KYD 600' }
      }
    },
    'entity.foreign_qualification': {
      desc: 'Register a foreign entity to do business in another jurisdiction',
      jurisdictions: {
        'us-de': {
          name: 'Delaware',
          legal_basis: 'DGCL Section 371-376 (Qualification of Foreign Corporations)',
          steps: [
            { id: 'home_good_standing',  type: 'check.good_standing',            svc: 'organization-info', depends: [],                     domains: ['corporate'] },
            { id: 'name_check',          type: 'filing.name_availability',       svc: 'organization-info', depends: [],                     domains: ['corporate'] },
            { id: 'registered_agent',    type: 'check.registered_agent',         svc: 'organization-info', depends: [],                     domains: ['corporate'] },
            { id: 'qualification_app',   type: 'filing.certificate_of_authority', svc: 'organization-info', depends: ['home_good_standing','name_check','registered_agent'], domains: ['corporate','licensing'] },
            { id: 'franchise_tax_reg',   type: 'filing.franchise_tax_registration', svc: 'treasury-info',  depends: ['qualification_app'],   domains: ['tax','corporate'] },
            { id: 'compliance_verify',   type: 'compliance.foreign_entity_review', svc: 'compliance-info', depends: ['qualification_app'],   domains: ['corporate','aml','sanctions'] },
            { id: 'activate',            type: 'update.foreign_entity_status',   svc: 'organization-info', depends: ['qualification_app','franchise_tax_reg'], domains: ['corporate','licensing'] }
          ],
          fees: [
            { amount: '$200', authority: 'DE Division of Corporations', desc: 'Certificate of Authority filing' }
          ],
          params: [
            { name: 'entity_id', type: 'string', required: true, note: 'Foreign entity ID' },
            { name: 'home_jurisdiction', type: 'string', required: true },
            { name: 'entity_type', type: 'enum', required: true, values: ['corporation','llc','lp','lllp'] },
            { name: 'registered_agent', type: 'string', required: true, note: 'DE resident or registered agent' }
          ]
        },
        'us-fl': {
          name: 'Florida',
          legal_basis: 'FL BCA Ch.607.1501-607.1536, FL LLC Act Ch.605.0902',
          steps: [
            { id: 'home_good_standing',  type: 'check.good_standing',            svc: 'organization-info', depends: [],                     domains: ['corporate'] },
            { id: 'name_check',          type: 'filing.name_availability',       svc: 'organization-info', depends: [],                     domains: ['corporate'] },
            { id: 'registered_agent',    type: 'check.registered_agent',         svc: 'organization-info', depends: [],                     domains: ['corporate'] },
            { id: 'qualification_app',   type: 'filing.qualification_application', svc: 'organization-info', depends: ['home_good_standing','name_check','registered_agent'], domains: ['corporate','licensing'] },
            { id: 'sunbiz_filing',       type: 'filing.sunbiz_registration',     svc: 'organization-info', depends: ['qualification_app'],   domains: ['corporate','licensing'] },
            { id: 'tax_registration',    type: 'filing.fl_tax_registration',     svc: 'treasury-info',     depends: ['sunbiz_filing'],       domains: ['tax','corporate'] },
            { id: 'activate',            type: 'update.foreign_entity_status',   svc: 'organization-info', depends: ['sunbiz_filing','tax_registration'], domains: ['corporate','licensing'] }
          ],
          fees: [
            { amount: 'USD 70', authority: 'FL Division of Corporations', desc: 'Qualification filing (LLC: $125)' },
            { amount: 'USD 100', authority: 'Sunbiz', desc: 'Registered agent designation' }
          ],
          params: [
            { name: 'entity_id', type: 'string', required: true },
            { name: 'home_jurisdiction', type: 'string', required: true },
            { name: 'entity_type', type: 'enum', required: true, values: ['corporation','llc','lp','lllp'] },
            { name: 'registered_agent', type: 'string', required: true, note: 'FL resident or registered agent' }
          ]
        },
        'ae-abudhabi-adgm': { name: 'ADGM', legal_basis: 'ADGM Companies Regulations 2020 Part 11 (Foreign Companies)', steps_count: 8, fee: 'AED 2,500' },
        'sg': { name: 'Singapore', legal_basis: 'Companies Act 1967 Part XI Division 2 s.368-386', steps_count: 8, fee: 'SGD 300' },
        'hk': { name: 'Hong Kong', legal_basis: 'Companies Ordinance Cap 622 Part 16 s.776-795', steps_count: 8, fee: 'HKD 1,720' },
        'gb': { name: 'United Kingdom', legal_basis: 'Companies Act 2006 Part 34 s.1044-1059', steps_count: 7, fee: 'GBP 20' },
        'in': { name: 'India', legal_basis: 'Companies Act 2013 s.380-392 (Foreign Company)', steps_count: 10, fee: 'INR 50,000' }
      }
    },
    'fiscal.annual_income_tax': {
      desc: 'Annual income tax return computation, filing, and payment',
      jurisdictions: {
        'us-de': {
          name: 'Delaware (Federal + State)',
          legal_basis: 'IRC s.11 (Corporate Tax), IRC s.6012 (Filing Requirements), Title 30 Del.C.',
          steps: [
            { id: 'financial_close',     type: 'fiscal.period_close',            svc: 'treasury-info',     depends: [],                     domains: ['tax'] },
            { id: 'revenue_aggregation', type: 'tax.revenue_aggregation',        svc: 'treasury-info',     depends: ['financial_close'],     domains: ['tax'] },
            { id: 'deductions_compute',  type: 'tax.deductions_compute',         svc: 'treasury-info',     depends: ['financial_close'],     domains: ['tax'] },
            { id: 'state_apportionment', type: 'tax.state_apportionment',        svc: 'treasury-info',     depends: ['revenue_aggregation'], domains: ['tax'] },
            { id: 'federal_1120',        type: 'filing.form_1120',               svc: 'treasury-info',     depends: ['revenue_aggregation','deductions_compute'], domains: ['tax'] },
            { id: 'state_return',        type: 'filing.state_income_tax',        svc: 'treasury-info',     depends: ['state_apportionment','federal_1120'], domains: ['tax'] },
            { id: 'estimated_payments',  type: 'tax.estimated_payment_reconcile', svc: 'treasury-info',    depends: ['federal_1120'],        domains: ['tax','payments'] },
            { id: 'payment',             type: 'payment.tax_payment',            svc: 'treasury-info',     depends: ['federal_1120','state_return','estimated_payments'], domains: ['tax','payments'] },
            { id: 'audit_trail',         type: 'document.tax_audit_trail',       svc: 'treasury-info',     depends: ['payment'],             domains: ['tax'] }
          ],
          fees: [
            { amount: 'USD 0', authority: 'IRS', desc: 'Form 1120 e-filing' },
            { amount: 'Varies', authority: 'DE Division of Revenue', desc: 'State income tax (8.7% flat rate)' }
          ],
          params: [
            { name: 'entity_id', type: 'string', required: true },
            { name: 'tax_year', type: 'number', required: true },
            { name: 'filing_status', type: 'enum', required: true, values: ['c_corp','s_corp','partnership','llc_disregarded'] },
            { name: 'ein', type: 'string', required: true, note: 'IRS EIN' }
          ]
        },
        'pk-sifc': {
          name: 'Pakistan',
          legal_basis: 'Income Tax Ordinance 2001 s.114, s.149-156, FBR Rules',
          steps: [
            { id: 'financial_close',     type: 'fiscal.period_close',            svc: 'treasury-info',     depends: [],                     domains: ['tax'] },
            { id: 'revenue_aggregation', type: 'tax.revenue_aggregation',        svc: 'treasury-info',     depends: ['financial_close'],     domains: ['tax'] },
            { id: 'withholding_reconcile', type: 'tax.withholding_reconcile',    svc: 'treasury-info',     depends: ['financial_close'],     domains: ['tax'] },
            { id: 'filer_status_check',  type: 'tax.filer_status',              svc: 'treasury-info',     depends: [],                     domains: ['tax'] },
            { id: 'return_prep',         type: 'document.income_tax_return',     svc: 'treasury-info',     depends: ['revenue_aggregation','withholding_reconcile'], domains: ['tax'] },
            { id: 'iris_filing',         type: 'filing.fbr_iris_return',         svc: 'treasury-info',     depends: ['return_prep'],         domains: ['tax'] },
            { id: 'wealth_statement',    type: 'filing.wealth_statement',        svc: 'treasury-info',     depends: ['financial_close'],     domains: ['tax'] },
            { id: 'payment',             type: 'payment.tax_payment',            svc: 'treasury-info',     depends: ['iris_filing'],         domains: ['tax','payments'] },
            { id: 'challan',             type: 'document.cpd_challan',           svc: 'treasury-info',     depends: ['payment'],             domains: ['tax'] }
          ],
          fees: [
            { amount: 'Varies', authority: 'FBR', desc: 'Corporate tax rate: 29% (general), 20% (SIFC incentive zone)' }
          ],
          params: [
            { name: 'entity_id', type: 'string', required: true },
            { name: 'ntn', type: 'string', required: true, note: 'FBR NTN (7 digits)' },
            { name: 'tax_year', type: 'number', required: true },
            { name: 'filing_type', type: 'enum', required: true, values: ['normal','revised','amended'] }
          ]
        },
        'ae-abudhabi-adgm': {
          name: 'UAE/ADGM',
          legal_basis: 'Federal Decree-Law No. 47/2022 (Corporate Tax), MoF Decision No. 116/2023',
          steps: [
            { id: 'financial_close',     type: 'fiscal.period_close',            svc: 'treasury-info',     depends: [],                     domains: ['tax'] },
            { id: 'fz_qualification',    type: 'tax.free_zone_qualification',    svc: 'treasury-info',     depends: ['financial_close'],     domains: ['tax'] },
            { id: 'tp_documentation',    type: 'document.transfer_pricing',      svc: 'treasury-info',     depends: ['financial_close'],     domains: ['tax'] },
            { id: 'ct_computation',      type: 'tax.corporate_tax_compute',      svc: 'treasury-info',     depends: ['financial_close','fz_qualification'], domains: ['tax'] },
            { id: 'return_filing',       type: 'filing.uae_ct_return',           svc: 'treasury-info',     depends: ['ct_computation','tp_documentation'], domains: ['tax'] },
            { id: 'payment',             type: 'payment.tax_payment',            svc: 'treasury-info',     depends: ['return_filing'],       domains: ['tax','payments'] }
          ],
          fees: [
            { amount: 'Varies', authority: 'FTA', desc: 'Corporate tax: 0% on first AED 375K, 9% thereafter (0% for qualifying FZ income)' }
          ],
          params: [
            { name: 'entity_id', type: 'string', required: true },
            { name: 'tax_period', type: 'string', required: true },
            { name: 'free_zone_entity', type: 'boolean', required: true }
          ]
        },
        'sg': { name: 'Singapore', legal_basis: 'Income Tax Act 1947 s.43-44, IRAS e-filing', steps_count: 8, fee: 'Varies (17% headline rate)' },
        'hk': { name: 'Hong Kong', legal_basis: 'Inland Revenue Ordinance Cap 112 s.14', steps_count: 7, fee: 'Varies (16.5% / 8.25% two-tier)' },
        'gb': { name: 'United Kingdom', legal_basis: 'Corporation Tax Act 2009, HMRC CT600', steps_count: 8, fee: 'Varies (25% / 19% small profits)' },
        'in': { name: 'India', legal_basis: 'Income Tax Act 1961 s.139, Companies Act 2013', steps_count: 10, fee: 'Varies (25% / 15% new mfg)' }
      }
    },
    'fiscal.loan_origination': {
      desc: 'Loan origination with KYC, credit assessment, compliance, and disbursement',
      jurisdictions: {
        'us-de': {
          name: 'Delaware',
          legal_basis: 'DE Licensed Lenders Act (Title 5), TILA (15 USC 1601), ECOA, HMDA, BSA',
          steps: [
            { id: 'borrower_kyc',        type: 'identity.verify',               svc: 'identity-info',     depends: [],                     domains: ['kyc','aml'] },
            { id: 'sanctions_screen',     type: 'screening.sanctions',           svc: 'identity-info',     depends: ['borrower_kyc'],        domains: ['sanctions'] },
            { id: 'credit_assessment',    type: 'check.credit_assessment',       svc: 'treasury-info',     depends: ['borrower_kyc'],        domains: ['banking','securities'] },
            { id: 'collateral_valuation', type: 'check.collateral_valuation',    svc: 'treasury-info',     depends: [],                     domains: ['banking','securities'] },
            { id: 'compliance_review',    type: 'compliance.lending_review',     svc: 'compliance-info',   depends: ['credit_assessment','sanctions_screen'], domains: ['banking','aml','securities'] },
            { id: 'term_sheet',           type: 'document.loan_term_sheet',      svc: 'governance-info',      depends: ['compliance_review','collateral_valuation'], domains: ['banking','securities'] },
            { id: 'borrower_consent',     type: 'consent.loan_agreement',        svc: 'governance-info',      depends: ['term_sheet'],          domains: ['banking','corporate'] },
            { id: 'tila_disclosure',      type: 'document.tila_disclosure',      svc: 'compliance-info',   depends: ['term_sheet'],          domains: ['banking'] },
            { id: 'disbursement',         type: 'payment.loan_disbursement',     svc: 'treasury-info',     depends: ['borrower_consent','tila_disclosure'], domains: ['payments','banking'] },
            { id: 'lien_recording',       type: 'filing.ucc1_filing',           svc: 'organization-info', depends: ['disbursement'],        domains: ['banking','corporate'] }
          ],
          fees: [
            { amount: 'Varies', authority: 'DE Bank Commissioner', desc: 'Licensed lender fees' },
            { amount: 'USD 50\u2013200', authority: 'DE Secretary of State', desc: 'UCC-1 filing' }
          ],
          params: [
            { name: 'borrower_entity_id', type: 'string', required: true },
            { name: 'lender_entity_id', type: 'string', required: true },
            { name: 'loan_amount', type: 'number', required: true },
            { name: 'currency', type: 'enum', required: true, values: ['USD'] },
            { name: 'loan_type', type: 'enum', required: true, values: ['term','revolving','bridge','convertible'] },
            { name: 'collateral_type', type: 'enum', required: false, values: ['real_property','personal_property','securities','unsecured'] }
          ]
        },
        'pk-sifc': {
          name: 'Pakistan',
          legal_basis: 'Banking Companies Ordinance 1962, SBP Prudential Regulations, AMLA 2010',
          steps: [
            { id: 'borrower_kyc',        type: 'identity.cnic_verify',          svc: 'identity-info',     depends: [],                     domains: ['kyc','aml'] },
            { id: 'ntn_verify',           type: 'identity.ntn_verify',          svc: 'identity-info',     depends: [],                     domains: ['tax','kyc'] },
            { id: 'sanctions_screen',     type: 'screening.sanctions',           svc: 'identity-info',     depends: ['borrower_kyc'],        domains: ['sanctions'] },
            { id: 'credit_assessment',    type: 'check.ecib_credit_check',      svc: 'treasury-info',     depends: ['borrower_kyc'],        domains: ['banking'] },
            { id: 'sbp_prudential',       type: 'compliance.sbp_prudential',    svc: 'compliance-info',   depends: ['credit_assessment','sanctions_screen'], domains: ['banking','aml'] },
            { id: 'markup_computation',   type: 'tax.markup_computation',        svc: 'treasury-info',     depends: ['credit_assessment'],   domains: ['banking','tax'] },
            { id: 'term_sheet',           type: 'document.loan_term_sheet',      svc: 'governance-info',      depends: ['sbp_prudential','markup_computation'], domains: ['banking'] },
            { id: 'borrower_consent',     type: 'consent.loan_agreement',        svc: 'governance-info',      depends: ['term_sheet'],          domains: ['banking','corporate'] },
            { id: 'disbursement',         type: 'payment.loan_disbursement',     svc: 'treasury-info',     depends: ['borrower_consent'],    domains: ['payments','banking'] },
            { id: 'sbp_reporting',        type: 'filing.sbp_cib_report',        svc: 'treasury-info',     depends: ['disbursement'],        domains: ['banking'] }
          ],
          fees: [
            { amount: 'Varies', authority: 'SBP', desc: 'Processing fee (typically 0.5\u20131% of facility)' }
          ],
          params: [
            { name: 'borrower_entity_id', type: 'string', required: true },
            { name: 'lender_entity_id', type: 'string', required: true },
            { name: 'facility_amount', type: 'number', required: true },
            { name: 'currency', type: 'enum', required: true, values: ['PKR','USD'] },
            { name: 'facility_type', type: 'enum', required: true, values: ['running_finance','term_loan','demand_finance','musharakah','murabaha'] }
          ]
        },
        'ae-abudhabi-adgm': { name: 'ADGM', legal_basis: 'FSRA Rules, CBUAE Regulations', steps_count: 10, fee: 'Varies' },
        'sg': { name: 'Singapore', legal_basis: 'MAS Act, Banking Act Cap 19, MAS Notice 632/643', steps_count: 10, fee: 'Varies' },
        'hk': { name: 'Hong Kong', legal_basis: 'Banking Ordinance Cap 155, Money Lenders Ordinance Cap 163', steps_count: 9, fee: 'Varies' }
      }
    },
    'identity.accreditation_update': {
      desc: 'Investor accreditation verification, renewal, and status update',
      jurisdictions: {
        'us-de': {
          name: 'United States',
          legal_basis: 'Securities Act 1933 Rule 501 (Reg D), Dodd-Frank s.413, SEC Release 33-10824',
          steps: [
            { id: 'identity_verify',     type: 'identity.verify',               svc: 'identity-info',     depends: [],                     domains: ['kyc','securities'] },
            { id: 'income_verification', type: 'check.income_verification',      svc: 'identity-info',     depends: ['identity_verify'],     domains: ['securities'] },
            { id: 'net_worth_verification', type: 'check.net_worth_verification', svc: 'identity-info',    depends: ['identity_verify'],     domains: ['securities'] },
            { id: 'professional_cert',   type: 'check.professional_certification', svc: 'identity-info',   depends: ['identity_verify'],     domains: ['securities'] },
            { id: 'accreditation_determination', type: 'compliance.accreditation_evaluate', svc: 'compliance-info', depends: ['income_verification','net_worth_verification','professional_cert'], domains: ['securities'] },
            { id: 'vc_issuance',         type: 'document.accreditation_vc',      svc: 'identity-info',     depends: ['accreditation_determination'], domains: ['securities','kyc'] },
            { id: 'registry_update',     type: 'update.accreditation_registry',  svc: 'identity-info',     depends: ['vc_issuance'],         domains: ['securities'] }
          ],
          fees: [
            { amount: 'USD 0', authority: 'SEC', desc: 'No filing fee (issuer responsibility)' }
          ],
          params: [
            { name: 'identity_id', type: 'string', required: true },
            { name: 'accreditation_basis', type: 'enum', required: true, values: ['income','net_worth','professional_certification','entity_assets','knowledgeable_employee','family_office'] },
            { name: 'verification_method', type: 'enum', required: false, values: ['self_certification','third_party_verification','issuer_verification'] }
          ]
        },
        'ae-abudhabi-adgm': {
          name: 'ADGM',
          legal_basis: 'FSMR 2015 s.58-62, FSRA Conduct of Business Rules',
          steps: [
            { id: 'identity_verify',     type: 'identity.verify',               svc: 'identity-info',     depends: [],                     domains: ['kyc'] },
            { id: 'professional_client_check', type: 'check.professional_client', svc: 'identity-info',    depends: ['identity_verify'],     domains: ['securities'] },
            { id: 'financial_assessment', type: 'check.financial_assessment',     svc: 'identity-info',     depends: ['identity_verify'],     domains: ['securities'] },
            { id: 'classification',       type: 'compliance.client_classification', svc: 'compliance-info', depends: ['professional_client_check','financial_assessment'], domains: ['securities'] },
            { id: 'opt_up_consent',       type: 'consent.client_classification', svc: 'governance-info',      depends: ['classification'],      domains: ['securities','corporate'] },
            { id: 'registry_update',      type: 'update.client_classification_registry', svc: 'identity-info', depends: ['opt_up_consent'],  domains: ['securities'] }
          ],
          params: [
            { name: 'identity_id', type: 'string', required: true },
            { name: 'classification_type', type: 'enum', required: true, values: ['retail','professional','market_counterparty'] }
          ]
        },
        'sg': { name: 'Singapore', legal_basis: 'SFA Cap 289 s.4A (Accredited Investor), MAS Guidelines', steps_count: 6 },
        'hk': { name: 'Hong Kong', legal_basis: 'SFO Cap 571 Schedule 1 (Professional Investor)', steps_count: 6 }
      }
    },
    'ownership.dividend_distribution': {
      desc: 'Dividend declaration, withholding tax computation, and distribution to shareholders',
      jurisdictions: {
        'us-de': {
          name: 'Delaware',
          legal_basis: 'DGCL Section 170-173 (Dividends), IRC s.301/316 (Distributions), s.1441-1442',
          steps: [
            { id: 'surplus_check',       type: 'check.surplus_availability',     svc: 'treasury-info',     depends: [],                     domains: ['corporate','securities'] },
            { id: 'board_resolution',    type: 'consent.board_resolution',        svc: 'governance-info',      depends: ['surplus_check'],       domains: ['corporate'] },
            { id: 'record_date_set',     type: 'update.record_date',             svc: 'governance-info',      depends: ['board_resolution'],    domains: ['corporate','securities'] },
            { id: 'shareholder_list',    type: 'check.shareholder_entitlement',  svc: 'governance-info',      depends: ['record_date_set'],     domains: ['securities','corporate'] },
            { id: 'withholding_compute', type: 'tax.dividend_withholding',       svc: 'treasury-info',     depends: ['shareholder_list'],    domains: ['tax'] },
            { id: 'treaty_check',        type: 'tax.treaty_rate_check',          svc: 'treasury-info',     depends: ['shareholder_list'],    domains: ['tax'] },
            { id: 'payment_execute',     type: 'payment.dividend_payment',       svc: 'treasury-info',     depends: ['withholding_compute','treaty_check'], domains: ['payments','tax'] },
            { id: 'form_1099div',        type: 'filing.form_1099_div',           svc: 'treasury-info',     depends: ['payment_execute'],     domains: ['tax'] },
            { id: 'cap_table_update',    type: 'ownership.cap_table_update',     svc: 'governance-info',      depends: ['payment_execute'],     domains: ['securities','corporate'] }
          ],
          fees: [
            { amount: 'Varies', authority: 'IRS', desc: 'Withholding: 0% (qualified domestic), 30% (NRA default), treaty rates vary' }
          ],
          params: [
            { name: 'entity_id', type: 'string', required: true },
            { name: 'dividend_type', type: 'enum', required: true, values: ['cash','stock','property','liquidating'] },
            { name: 'amount_per_share', type: 'number', required: true },
            { name: 'record_date', type: 'date', required: true },
            { name: 'payment_date', type: 'date', required: true }
          ]
        },
        'pk-sifc': {
          name: 'Pakistan',
          legal_basis: 'Companies Act 2017 s.123-127, ITO 2001 s.150 (Dividend WHT)',
          steps: [
            { id: 'profit_check',        type: 'check.distributable_profit',     svc: 'treasury-info',     depends: [],                     domains: ['corporate'] },
            { id: 'board_resolution',    type: 'consent.board_resolution',        svc: 'governance-info',      depends: ['profit_check'],        domains: ['corporate'] },
            { id: 'shareholder_approval', type: 'consent.shareholder_approval',  svc: 'governance-info',      depends: ['board_resolution'],    domains: ['corporate'] },
            { id: 'record_date_set',     type: 'update.record_date',             svc: 'governance-info',      depends: ['shareholder_approval'], domains: ['corporate','securities'] },
            { id: 'filer_check',         type: 'tax.filer_status',               svc: 'treasury-info',     depends: [],                     domains: ['tax'] },
            { id: 'withholding_compute', type: 'tax.dividend_withholding',       svc: 'treasury-info',     depends: ['filer_check','record_date_set'], domains: ['tax'] },
            { id: 'payment_execute',     type: 'payment.dividend_payment',       svc: 'treasury-info',     depends: ['withholding_compute'], domains: ['payments','tax'] },
            { id: 'secp_notification',   type: 'filing.dividend_notification',   svc: 'organization-info', depends: ['payment_execute'],     domains: ['corporate','licensing'] },
            { id: 'fbr_reporting',       type: 'filing.dividend_withholding_return', svc: 'treasury-info', depends: ['payment_execute'],     domains: ['tax'] }
          ],
          fees: [
            { amount: 'Varies', authority: 'FBR', desc: 'WHT: 15% (filer), 30% (non-filer) per ITO s.150' }
          ],
          params: [
            { name: 'entity_id', type: 'string', required: true },
            { name: 'dividend_type', type: 'enum', required: true, values: ['interim','final','bonus'] },
            { name: 'amount_per_share', type: 'number', required: true },
            { name: 'ntn', type: 'string', required: true, note: 'Company NTN' }
          ]
        },
        'ae-abudhabi-adgm': { name: 'ADGM', legal_basis: 'ADGM Companies Reg 2020 s.141-145', steps_count: 7, fee: 'AED 0 (no WHT)' },
        'sg': { name: 'Singapore', legal_basis: 'Companies Act 1967 s.403, ITA (one-tier system, no WHT)', steps_count: 7, fee: 'SGD 0 (one-tier, no WHT)' },
        'hk': { name: 'Hong Kong', legal_basis: 'Companies Ordinance Cap 622 s.295-299, IRO (no WHT)', steps_count: 6, fee: 'HKD 0 (no WHT)' },
        'gb': { name: 'United Kingdom', legal_basis: 'Companies Act 2006 s.829-853, CTA 2010 Part 23', steps_count: 8, fee: 'Varies (WHT on non-treaty recipients)' }
      }
    },
    'ownership.stock_split': {
      desc: 'Stock split or reverse split with cap table restructure and regulatory filing',
      jurisdictions: {
        'us-de': {
          name: 'Delaware',
          legal_basis: 'DGCL Section 242 (Charter Amendment for split), s.151-155',
          steps: [
            { id: 'board_resolution',    type: 'consent.board_resolution',        svc: 'governance-info',      depends: [],                     domains: ['corporate'] },
            { id: 'shareholder_vote',    type: 'consent.shareholder_approval',    svc: 'governance-info',      depends: ['board_resolution'],    domains: ['corporate','securities'] },
            { id: 'charter_amendment',   type: 'filing.certificate_of_amendment', svc: 'organization-info', depends: ['shareholder_vote'],    domains: ['corporate','licensing'] },
            { id: 'ratio_compute',       type: 'ownership.split_ratio_compute',  svc: 'governance-info',      depends: ['charter_amendment'],   domains: ['securities'] },
            { id: 'cap_table_restructure', type: 'ownership.cap_table_restructure', svc: 'governance-info',   depends: ['ratio_compute'],       domains: ['securities','corporate'] },
            { id: 'certificate_reissue', type: 'document.stock_certificates',    svc: 'governance-info',      depends: ['cap_table_restructure'], domains: ['securities'] },
            { id: 'tax_basis_adjust',    type: 'tax.cost_basis_adjustment',      svc: 'treasury-info',     depends: ['cap_table_restructure'], domains: ['tax'] },
            { id: 'notification',        type: 'notify.stakeholders',            svc: 'governance-info',      depends: ['cap_table_restructure'], domains: ['corporate','securities'] }
          ],
          fees: [
            { amount: '$150', authority: 'DE Division of Corporations', desc: 'Certificate of Amendment filing' }
          ],
          params: [
            { name: 'entity_id', type: 'string', required: true },
            { name: 'split_type', type: 'enum', required: true, values: ['forward','reverse'] },
            { name: 'split_ratio', type: 'string', required: true, note: 'e.g., "2:1" (forward) or "1:10" (reverse)' },
            { name: 'record_date', type: 'date', required: true },
            { name: 'share_class', type: 'string', required: false, note: 'All classes if omitted' }
          ]
        },
        'ae-abudhabi-adgm': {
          name: 'ADGM',
          legal_basis: 'ADGM Companies Regulations 2020 s.98-103',
          steps: [
            { id: 'board_resolution',    type: 'consent.board_resolution',        svc: 'governance-info',      depends: [],                     domains: ['corporate'] },
            { id: 'special_resolution',  type: 'consent.special_resolution',     svc: 'governance-info',      depends: ['board_resolution'],    domains: ['corporate'] },
            { id: 'ra_notification',     type: 'filing.ra_share_restructure',    svc: 'organization-info', depends: ['special_resolution'],  domains: ['corporate','licensing'] },
            { id: 'cap_table_restructure', type: 'ownership.cap_table_restructure', svc: 'governance-info',   depends: ['ra_notification'],     domains: ['securities','corporate'] },
            { id: 'articles_update',     type: 'document.articles_amendment',    svc: 'organization-info', depends: ['cap_table_restructure'], domains: ['corporate'] },
            { id: 'notification',        type: 'notify.stakeholders',            svc: 'governance-info',      depends: ['cap_table_restructure'], domains: ['corporate','securities'] }
          ],
          fees: [
            { amount: 'AED 500', authority: 'ADGM RA', desc: 'Amendment filing' }
          ],
          params: [
            { name: 'entity_id', type: 'string', required: true },
            { name: 'split_type', type: 'enum', required: true, values: ['subdivision','consolidation'] },
            { name: 'split_ratio', type: 'string', required: true }
          ]
        },
        'sg': { name: 'Singapore', legal_basis: 'Companies Act 1967 s.64-65', steps_count: 7, fee: 'SGD 60' },
        'hk': { name: 'Hong Kong', legal_basis: 'Companies Ordinance Cap 622 s.170-171', steps_count: 7, fee: 'HKD 105' },
        'gb': { name: 'United Kingdom', legal_basis: 'Companies Act 2006 s.618-621', steps_count: 6, fee: 'GBP 15' }
      }
    },
    'dispute.file_claim': {
      desc: 'File a dispute claim with evidence, counterparty notification, and arbitration initiation',
      jurisdictions: {
        'us-de': {
          name: 'Delaware',
          legal_basis: 'DE Uniform Arbitration Act (10 Del.C. Ch.57), FAA (9 USC s.1-16), UNCITRAL Model Law',
          steps: [
            { id: 'claimant_verify',     type: 'identity.verify',               svc: 'identity-info',     depends: [],                     domains: ['kyc'] },
            { id: 'contract_review',     type: 'check.arbitration_clause',       svc: 'compliance-info',   depends: [],                     domains: ['corporate'] },
            { id: 'evidence_compile',    type: 'document.evidence_bundle',       svc: 'governance-info',      depends: ['claimant_verify'],     domains: ['corporate'] },
            { id: 'claim_draft',         type: 'document.statement_of_claim',    svc: 'governance-info',      depends: ['evidence_compile','contract_review'], domains: ['corporate'] },
            { id: 'filing',              type: 'filing.arbitration_request',     svc: 'organization-info', depends: ['claim_draft'],         domains: ['corporate'] },
            { id: 'respondent_notify',   type: 'notify.respondent',             svc: 'governance-info',      depends: ['filing'],              domains: ['corporate'] },
            { id: 'escrow_deposit',      type: 'payment.arbitration_deposit',   svc: 'treasury-info',     depends: ['filing'],              domains: ['payments','banking'] },
            { id: 'case_create',         type: 'create.arbitration_case',        svc: 'organization-info', depends: ['filing','escrow_deposit'], domains: ['corporate'] }
          ],
          fees: [
            { amount: 'USD 3,350', authority: 'AAA/ICDR', desc: 'Filing fee (claims up to $75K; scales with amount)' }
          ],
          params: [
            { name: 'claimant_entity_id', type: 'string', required: true },
            { name: 'respondent_entity_id', type: 'string', required: true },
            { name: 'claim_amount', type: 'number', required: true },
            { name: 'claim_type', type: 'enum', required: true, values: ['breach_of_contract','tortious_interference','fraud','ip_infringement','regulatory_dispute','corridor_dispute'] },
            { name: 'arbitration_rules', type: 'enum', required: false, values: ['aaa','icdr','jams','uncitral'] },
            { name: 'governing_law', type: 'string', required: false, note: 'Default: Delaware law' }
          ]
        },
        'ae-abudhabi-adgm': {
          name: 'ADGM',
          legal_basis: 'ADGM Arbitration Regulations 2015, ADGM Courts Regulations 2015',
          steps: [
            { id: 'claimant_verify',     type: 'identity.verify',               svc: 'identity-info',     depends: [],                     domains: ['kyc'] },
            { id: 'contract_review',     type: 'check.arbitration_clause',       svc: 'compliance-info',   depends: [],                     domains: ['corporate'] },
            { id: 'evidence_compile',    type: 'document.evidence_bundle',       svc: 'governance-info',      depends: ['claimant_verify'],     domains: ['corporate'] },
            { id: 'claim_draft',         type: 'document.statement_of_claim',    svc: 'governance-info',      depends: ['evidence_compile','contract_review'], domains: ['corporate'] },
            { id: 'adgm_filing',         type: 'filing.adgm_arbitration_request', svc: 'organization-info', depends: ['claim_draft'],        domains: ['corporate'] },
            { id: 'respondent_notify',   type: 'notify.respondent',             svc: 'governance-info',      depends: ['adgm_filing'],         domains: ['corporate'] },
            { id: 'registration_fee',    type: 'payment.registration_fee',      svc: 'treasury-info',     depends: ['adgm_filing'],         domains: ['payments'] },
            { id: 'case_create',         type: 'create.arbitration_case',        svc: 'organization-info', depends: ['adgm_filing','registration_fee'], domains: ['corporate'] }
          ],
          fees: [
            { amount: 'AED 8,000', authority: 'ADGM Courts', desc: 'Registration fee (small claims: AED 1,000)' }
          ],
          params: [
            { name: 'claimant_entity_id', type: 'string', required: true },
            { name: 'respondent_entity_id', type: 'string', required: true },
            { name: 'claim_amount', type: 'number', required: true },
            { name: 'claim_type', type: 'enum', required: true, values: ['breach_of_contract','tortious_interference','fraud','regulatory_dispute','corridor_dispute'] },
            { name: 'arbitration_rules', type: 'enum', required: false, values: ['adgm','icc','lcia','uncitral'] }
          ]
        },
        'sg': { name: 'Singapore', legal_basis: 'International Arbitration Act (Cap 143A), SIAC Rules', steps_count: 8, fee: 'SGD 5,350 (SIAC filing)' },
        'pk-sifc': { name: 'Pakistan', legal_basis: 'Arbitration Act 1940, Recognition & Enforcement Act 2011', steps_count: 9, fee: 'PKR 5,000' },
        'hk': { name: 'Hong Kong', legal_basis: 'Arbitration Ordinance Cap 609, HKIAC Rules', steps_count: 8, fee: 'HKD 8,000 (HKIAC filing)' },
        'gb': { name: 'United Kingdom', legal_basis: 'Arbitration Act 1996, LCIA Rules', steps_count: 8, fee: 'GBP 1,950 (LCIA registration)' }
      }
    },
    'dispute.respond': {
      desc: 'File response to arbitration claim with counter-evidence and optional counterclaim',
      jurisdictions: {
        'us-de': {
          name: 'Delaware',
          legal_basis: 'DE Uniform Arbitration Act, FAA (9 USC), AAA Commercial Rules R-5',
          steps: [
            { id: 'respondent_verify',   type: 'identity.verify',               svc: 'identity-info',     depends: [],                     domains: ['kyc'] },
            { id: 'claim_review',        type: 'check.claim_review',            svc: 'compliance-info',   depends: [],                     domains: ['corporate'] },
            { id: 'evidence_compile',    type: 'document.response_evidence',     svc: 'governance-info',      depends: ['respondent_verify','claim_review'], domains: ['corporate'] },
            { id: 'response_draft',      type: 'document.statement_of_defense', svc: 'governance-info',      depends: ['evidence_compile'],    domains: ['corporate'] },
            { id: 'counterclaim_eval',   type: 'check.counterclaim_evaluation', svc: 'compliance-info',   depends: ['claim_review'],        domains: ['corporate'] },
            { id: 'filing',              type: 'filing.arbitration_response',    svc: 'organization-info', depends: ['response_draft'],      domains: ['corporate'] },
            { id: 'escrow_deposit',      type: 'payment.response_deposit',      svc: 'treasury-info',     depends: ['filing'],              domains: ['payments'] },
            { id: 'case_update',         type: 'update.arbitration_case',       svc: 'organization-info', depends: ['filing'],              domains: ['corporate'] }
          ],
          fees: [
            { amount: 'USD 3,350', authority: 'AAA/ICDR', desc: 'Response filing fee (counterclaim: additional fee)' }
          ],
          params: [
            { name: 'case_id', type: 'string', required: true },
            { name: 'respondent_entity_id', type: 'string', required: true },
            { name: 'include_counterclaim', type: 'boolean', required: false },
            { name: 'counterclaim_amount', type: 'number', required: false }
          ]
        },
        'ae-abudhabi-adgm': { name: 'ADGM', legal_basis: 'ADGM Arbitration Regulations 2015 s.16-17', steps_count: 8, fee: 'AED 5,000' },
        'sg': { name: 'Singapore', legal_basis: 'SIAC Rules Rule 4', steps_count: 7, fee: 'SGD 5,350' },
        'hk': { name: 'Hong Kong', legal_basis: 'HKIAC Rules Article 5', steps_count: 7, fee: 'HKD 8,000' },
        'gb': { name: 'United Kingdom', legal_basis: 'LCIA Rules Article 2', steps_count: 7, fee: 'GBP 1,950' }
      }
    },
    'dispute.arbitrate': {
      desc: 'Arbitration proceeding with tribunal constitution, hearings, and deliberation',
      jurisdictions: {
        'us-de': {
          name: 'Delaware',
          legal_basis: 'FAA (9 USC s.5), AAA Commercial Rules R-12 to R-33, UNCITRAL Art.10-15',
          steps: [
            { id: 'arbitrator_selection', type: 'consent.arbitrator_selection',  svc: 'governance-info',      depends: [],                     domains: ['corporate'] },
            { id: 'tribunal_constitution', type: 'create.tribunal',             svc: 'organization-info', depends: ['arbitrator_selection'], domains: ['corporate'] },
            { id: 'procedural_order',    type: 'document.procedural_order',     svc: 'governance-info',      depends: ['tribunal_constitution'], domains: ['corporate'] },
            { id: 'discovery',           type: 'document.discovery_exchange',    svc: 'governance-info',      depends: ['procedural_order'],    domains: ['corporate'] },
            { id: 'expert_reports',      type: 'document.expert_reports',        svc: 'governance-info',      depends: ['discovery'],           domains: ['corporate'] },
            { id: 'hearing',             type: 'event.arbitration_hearing',      svc: 'organization-info', depends: ['discovery','expert_reports'], domains: ['corporate'] },
            { id: 'post_hearing_briefs', type: 'document.post_hearing_brief',   svc: 'governance-info',      depends: ['hearing'],             domains: ['corporate'] },
            { id: 'deliberation',        type: 'event.tribunal_deliberation',   svc: 'organization-info', depends: ['post_hearing_briefs'], domains: ['corporate'] },
            { id: 'award_draft',         type: 'document.arbitral_award_draft', svc: 'governance-info',      depends: ['deliberation'],        domains: ['corporate'] },
            { id: 'award_issue',         type: 'document.arbitral_award',       svc: 'organization-info', depends: ['award_draft'],         domains: ['corporate'] }
          ],
          fees: [
            { amount: 'Varies', authority: 'AAA', desc: 'Arbitrator compensation ($1,500\u2013$3,000/day per arbitrator)' },
            { amount: 'Varies', authority: 'AAA', desc: 'Administrative fees (scaled by claim amount)' }
          ],
          params: [
            { name: 'case_id', type: 'string', required: true },
            { name: 'tribunal_size', type: 'enum', required: true, values: ['sole','three_member'] },
            { name: 'hearing_format', type: 'enum', required: false, values: ['in_person','virtual','hybrid'] },
            { name: 'seat_of_arbitration', type: 'string', required: false, note: 'Default: Wilmington, DE' }
          ]
        },
        'ae-abudhabi-adgm': { name: 'ADGM', legal_basis: 'ADGM Arbitration Regulations 2015 Part 4', steps_count: 10, fee: 'Varies' },
        'sg': { name: 'Singapore', legal_basis: 'IAA Cap 143A, SIAC Rules', steps_count: 10, fee: 'Varies' },
        'hk': { name: 'Hong Kong', legal_basis: 'Arbitration Ordinance Cap 609, HKIAC Rules', steps_count: 10, fee: 'Varies' },
        'gb': { name: 'United Kingdom', legal_basis: 'Arbitration Act 1996 s.14-41, LCIA Rules', steps_count: 10, fee: 'Varies (GBP 450/hr LCIA rate)' }
      }
    },
    'dispute.enforce': {
      desc: 'Enforce arbitral award domestically or cross-border under New York Convention',
      jurisdictions: {
        'us-de': {
          name: 'Delaware',
          legal_basis: 'FAA (9 USC s.9-13), New York Convention (9 USC s.201-208), 10 Del.C. s.5714',
          steps: [
            { id: 'award_verify',        type: 'check.award_validity',           svc: 'compliance-info',   depends: [],                     domains: ['corporate'] },
            { id: 'convention_check',    type: 'check.nyc_applicability',        svc: 'compliance-info',   depends: [],                     domains: ['corporate'] },
            { id: 'petition_draft',      type: 'document.confirmation_petition', svc: 'governance-info',      depends: ['award_verify','convention_check'], domains: ['corporate'] },
            { id: 'court_filing',        type: 'filing.petition_to_confirm',     svc: 'organization-info', depends: ['petition_draft'],      domains: ['corporate'] },
            { id: 'respondent_notice',   type: 'notify.respondent',             svc: 'governance-info',      depends: ['court_filing'],        domains: ['corporate'] },
            { id: 'court_order',         type: 'document.confirmation_order',    svc: 'organization-info', depends: ['court_filing'],        domains: ['corporate'] },
            { id: 'judgment_entry',      type: 'filing.judgment_entry',          svc: 'organization-info', depends: ['court_order'],         domains: ['corporate'] },
            { id: 'execution',           type: 'payment.judgment_execution',     svc: 'treasury-info',     depends: ['judgment_entry'],      domains: ['payments','banking'] }
          ],
          fees: [
            { amount: 'USD 402', authority: 'US District Court', desc: 'Petition filing fee' }
          ],
          params: [
            { name: 'case_id', type: 'string', required: true },
            { name: 'award_amount', type: 'number', required: true },
            { name: 'enforcement_jurisdiction', type: 'string', required: true },
            { name: 'cross_border', type: 'boolean', required: true }
          ]
        },
        'ae-abudhabi-adgm': { name: 'ADGM', legal_basis: 'ADGM Arbitration Regulations 2015 s.55-60, NYC 1958', steps_count: 7, fee: 'AED 2,000' },
        'sg': { name: 'Singapore', legal_basis: 'IAA Cap 143A s.19, NYC 1958', steps_count: 7, fee: 'SGD 500' },
        'hk': { name: 'Hong Kong', legal_basis: 'Arbitration Ordinance Cap 609 s.84-98, NYC 1958', steps_count: 7, fee: 'HKD 1,045' },
        'gb': { name: 'United Kingdom', legal_basis: 'Arbitration Act 1996 s.66-71, NYC 1958', steps_count: 7, fee: 'GBP 66' },
        'pk-sifc': { name: 'Pakistan', legal_basis: 'Recognition & Enforcement (Arbitration Agreements & Awards) Act 2011, NYC 1958', steps_count: 8, fee: 'PKR 5,000' }
      }
    },
    'dispute.settle': {
      desc: 'Settlement agreement execution with compliance verification and fund release',
      jurisdictions: {
        'us-de': {
          name: 'Delaware',
          legal_basis: 'DE Contract Law, FAA s.9 (Consent Award), IRC s.162(f) (Settlement deductibility)',
          steps: [
            { id: 'settlement_negotiate', type: 'event.settlement_negotiation', svc: 'governance-info',      depends: [],                     domains: ['corporate'] },
            { id: 'terms_draft',          type: 'document.settlement_agreement', svc: 'governance-info',     depends: ['settlement_negotiate'], domains: ['corporate'] },
            { id: 'compliance_review',    type: 'compliance.settlement_review', svc: 'compliance-info',   depends: ['terms_draft'],         domains: ['corporate','aml','sanctions'] },
            { id: 'tax_implications',     type: 'tax.settlement_tax_analysis',  svc: 'treasury-info',     depends: ['terms_draft'],         domains: ['tax'] },
            { id: 'party_consent',        type: 'consent.settlement_consent',   svc: 'governance-info',      depends: ['compliance_review','tax_implications'], domains: ['corporate'] },
            { id: 'consent_award',        type: 'document.consent_award',       svc: 'organization-info', depends: ['party_consent'],       domains: ['corporate'] },
            { id: 'payment_execute',      type: 'payment.settlement_payment',   svc: 'treasury-info',     depends: ['consent_award'],       domains: ['payments','banking'] },
            { id: 'case_close',           type: 'update.case_close',            svc: 'organization-info', depends: ['payment_execute'],     domains: ['corporate'] },
            { id: 'release_execute',      type: 'document.mutual_release',      svc: 'governance-info',      depends: ['payment_execute'],     domains: ['corporate'] }
          ],
          fees: [
            { amount: 'USD 0', authority: 'AAA', desc: 'No additional filing fee for consent award' }
          ],
          params: [
            { name: 'case_id', type: 'string', required: true },
            { name: 'settlement_amount', type: 'number', required: true },
            { name: 'payment_terms', type: 'enum', required: true, values: ['lump_sum','installments','structured'] },
            { name: 'confidentiality', type: 'boolean', required: false, note: 'Default: true' }
          ]
        },
        'ae-abudhabi-adgm': { name: 'ADGM', legal_basis: 'ADGM Arbitration Regulations 2015 s.35', steps_count: 8, fee: 'AED 0' },
        'sg': { name: 'Singapore', legal_basis: 'SIAC Rules Rule 32, Mediation Act 2017', steps_count: 8, fee: 'SGD 0' },
        'hk': { name: 'Hong Kong', legal_basis: 'HKIAC Rules Article 32', steps_count: 8, fee: 'HKD 0' },
        'gb': { name: 'United Kingdom', legal_basis: 'Arbitration Act 1996 s.51, Civil Procedure Rules Part 36', steps_count: 8, fee: 'GBP 0' }
      }
    },
    'compliance.audit': {
      desc: 'Full compliance audit across all 23 domains with evidence collection and remediation planning',
      jurisdictions: {
        'us-de': {
          name: 'United States',
          legal_basis: 'BSA/PATRIOT Act, SOX s.404, FCPA, OFAC Regulations, FinCEN CDD Rule',
          steps: [
            { id: 'scope_definition',    type: 'compliance.define_audit_scope',  svc: 'compliance-info',   depends: [],                     domains: ['corporate','aml','sanctions','kyc','tax','banking','securities','licensing','data_privacy','trade'] },
            { id: 'evidence_collection', type: 'compliance.collect_evidence',    svc: 'compliance-info',   depends: ['scope_definition'],    domains: ['corporate','aml','sanctions','kyc','tax','banking','securities'] },
            { id: 'aml_review',          type: 'compliance.aml_program_review', svc: 'compliance-info',   depends: ['evidence_collection'], domains: ['aml','sanctions'] },
            { id: 'sanctions_review',    type: 'compliance.sanctions_review',    svc: 'compliance-info',   depends: ['evidence_collection'], domains: ['sanctions'] },
            { id: 'kyc_review',          type: 'compliance.kyc_program_review', svc: 'compliance-info',   depends: ['evidence_collection'], domains: ['kyc','data_privacy'] },
            { id: 'tax_compliance',      type: 'compliance.tax_compliance_review', svc: 'compliance-info', depends: ['evidence_collection'], domains: ['tax'] },
            { id: 'securities_review',   type: 'compliance.securities_review',   svc: 'compliance-info',   depends: ['evidence_collection'], domains: ['securities'] },
            { id: 'tensor_evaluation',   type: 'compliance.tensor_evaluate',     svc: 'compliance-info',   depends: ['aml_review','sanctions_review','kyc_review','tax_compliance','securities_review'], domains: ['corporate','aml','sanctions','kyc','tax','banking','securities','licensing','data_privacy','trade'] },
            { id: 'findings_report',     type: 'document.audit_findings',       svc: 'compliance-info',   depends: ['tensor_evaluation'],   domains: ['corporate'] },
            { id: 'remediation_plan',    type: 'document.remediation_plan',     svc: 'compliance-info',   depends: ['findings_report'],     domains: ['corporate'] },
            { id: 'attestation',         type: 'document.compliance_attestation', svc: 'compliance-info', depends: ['tensor_evaluation'],   domains: ['corporate'] }
          ],
          fees: [
            { amount: 'USD 0', authority: 'Internal', desc: 'Internal audit cost (external auditor fees vary)' }
          ],
          params: [
            { name: 'entity_id', type: 'string', required: true },
            { name: 'audit_type', type: 'enum', required: true, values: ['full','targeted','periodic','triggered'] },
            { name: 'domains', type: 'array', required: false, note: 'Subset of 23 compliance domains (default: all)' },
            { name: 'period_start', type: 'date', required: true },
            { name: 'period_end', type: 'date', required: true }
          ]
        },
        'ae-abudhabi-adgm': {
          name: 'ADGM',
          legal_basis: 'FSRA Rulebook, ADGM AML Rules, CBUAE AML/CFT Guidelines',
          steps: [
            { id: 'scope_definition',    type: 'compliance.define_audit_scope',  svc: 'compliance-info',   depends: [],                     domains: ['corporate','aml','sanctions','kyc','banking','licensing'] },
            { id: 'evidence_collection', type: 'compliance.collect_evidence',    svc: 'compliance-info',   depends: ['scope_definition'],    domains: ['corporate','aml','sanctions','kyc','banking'] },
            { id: 'aml_review',          type: 'compliance.aml_program_review', svc: 'compliance-info',   depends: ['evidence_collection'], domains: ['aml','sanctions'] },
            { id: 'esr_review',          type: 'compliance.economic_substance_review', svc: 'compliance-info', depends: ['evidence_collection'], domains: ['tax','corporate'] },
            { id: 'data_protection',     type: 'compliance.data_protection_review', svc: 'compliance-info', depends: ['evidence_collection'], domains: ['data_privacy'] },
            { id: 'fsra_compliance',     type: 'compliance.fsra_rulebook_review', svc: 'compliance-info',  depends: ['evidence_collection'], domains: ['securities','banking','licensing'] },
            { id: 'tensor_evaluation',   type: 'compliance.tensor_evaluate',     svc: 'compliance-info',   depends: ['aml_review','esr_review','data_protection','fsra_compliance'], domains: ['corporate','aml','sanctions','kyc','tax','banking','securities','licensing','data_privacy'] },
            { id: 'findings_report',     type: 'document.audit_findings',       svc: 'compliance-info',   depends: ['tensor_evaluation'],   domains: ['corporate'] },
            { id: 'remediation_plan',    type: 'document.remediation_plan',     svc: 'compliance-info',   depends: ['findings_report'],     domains: ['corporate'] },
            { id: 'ra_reporting',        type: 'filing.compliance_report',      svc: 'organization-info', depends: ['findings_report'],     domains: ['corporate','licensing'] }
          ],
          fees: [
            { amount: 'Varies', authority: 'ADGM FSRA', desc: 'Supervisory fees (scaled by category)' }
          ],
          params: [
            { name: 'entity_id', type: 'string', required: true },
            { name: 'audit_type', type: 'enum', required: true, values: ['full','targeted','periodic','triggered'] },
            { name: 'fsra_category', type: 'enum', required: false, values: ['1','2','3a','3b','3c','4'] },
            { name: 'period_start', type: 'date', required: true },
            { name: 'period_end', type: 'date', required: true }
          ]
        },
        'pk-sifc': { name: 'Pakistan', legal_basis: 'AMLA 2010, SECP AML/CFT Guidelines 2018, SBP Prudential Regulations', steps_count: 10, fee: 'Varies' },
        'sg': { name: 'Singapore', legal_basis: 'MAS Notice 626, CDSA, PDPA, SFA Cap 289', steps_count: 10, fee: 'Varies' },
        'hk': { name: 'Hong Kong', legal_basis: 'AMLO Cap 615, SFO Cap 571, PDPO', steps_count: 10, fee: 'Varies' },
        'gb': { name: 'United Kingdom', legal_basis: 'MLR 2017, POCA 2002, FCA Handbook SYSC', steps_count: 10, fee: 'Varies' }
      }
    },
    'compliance.remediation': {
      desc: 'Execute remediation plan from audit findings with evidence tracking and re-evaluation',
      jurisdictions: {
        'us-de': {
          name: 'United States',
          legal_basis: 'FinCEN Enforcement Actions, OFAC Guidelines, SEC Remediation Framework',
          steps: [
            { id: 'findings_review',     type: 'check.findings_review',          svc: 'compliance-info',   depends: [],                     domains: ['corporate'] },
            { id: 'priority_triage',     type: 'compliance.priority_triage',     svc: 'compliance-info',   depends: ['findings_review'],     domains: ['corporate'] },
            { id: 'action_plan',         type: 'document.remediation_actions',   svc: 'compliance-info',   depends: ['priority_triage'],     domains: ['corporate'] },
            { id: 'policy_update',       type: 'update.compliance_policies',     svc: 'compliance-info',   depends: ['action_plan'],         domains: ['corporate','aml','sanctions','kyc'] },
            { id: 'control_implementation', type: 'update.control_implementation', svc: 'compliance-info', depends: ['action_plan'],         domains: ['corporate','aml','sanctions'] },
            { id: 'training',            type: 'event.compliance_training',      svc: 'compliance-info',   depends: ['policy_update'],       domains: ['corporate'] },
            { id: 'evidence_collection', type: 'compliance.collect_remediation_evidence', svc: 'compliance-info', depends: ['control_implementation','training'], domains: ['corporate'] },
            { id: 're_evaluation',       type: 'compliance.tensor_evaluate',     svc: 'compliance-info',   depends: ['evidence_collection'], domains: ['corporate','aml','sanctions','kyc','tax','banking','securities'] },
            { id: 'closure_report',      type: 'document.remediation_closure',   svc: 'compliance-info',   depends: ['re_evaluation'],       domains: ['corporate'] },
            { id: 'attestation',         type: 'document.remediation_attestation', svc: 'compliance-info', depends: ['closure_report'],      domains: ['corporate'] }
          ],
          params: [
            { name: 'audit_id', type: 'string', required: true },
            { name: 'entity_id', type: 'string', required: true },
            { name: 'priority', type: 'enum', required: true, values: ['critical','high','medium','low'] },
            { name: 'deadline', type: 'date', required: true }
          ]
        },
        'ae-abudhabi-adgm': { name: 'ADGM', legal_basis: 'FSRA Supervisory Notices, ADGM AML Rules', steps_count: 10 },
        'pk-sifc': { name: 'Pakistan', legal_basis: 'SECP Enforcement Circular 2023, SBP Supervisory Actions', steps_count: 9 },
        'sg': { name: 'Singapore', legal_basis: 'MAS Supervisory Framework, MAS Notice 626', steps_count: 9 },
        'gb': { name: 'United Kingdom', legal_basis: 'FCA Supervisory Framework, SMCR', steps_count: 10 }
      }
    },
    'compliance.passport_issue': {
      desc: 'Issue cross-jurisdiction compliance passport with cryptographic attestation',
      jurisdictions: {
        'us-de': {
          name: 'United States',
          legal_basis: 'FinCEN CDD Rule, BSA/PATRIOT Act (cross-border recognition framework)',
          steps: [
            { id: 'entity_verification', type: 'identity.verify',               svc: 'identity-info',     depends: [],                     domains: ['kyc','aml'] },
            { id: 'compliance_snapshot', type: 'compliance.tensor_evaluate',     svc: 'compliance-info',   depends: ['entity_verification'], domains: ['corporate','aml','sanctions','kyc','tax','banking','securities','licensing'] },
            { id: 'domain_attestations', type: 'document.domain_attestations',  svc: 'compliance-info',   depends: ['compliance_snapshot'], domains: ['corporate','aml','sanctions','kyc','tax'] },
            { id: 'evidence_bundle',     type: 'document.evidence_bundle',       svc: 'compliance-info',   depends: ['domain_attestations'], domains: ['corporate'] },
            { id: 'jcs_canonicalize',    type: 'crypto.jcs_canonicalize',       svc: 'compliance-info',   depends: ['evidence_bundle'],     domains: ['corporate'] },
            { id: 'sha256_digest',       type: 'crypto.sha256_digest',          svc: 'compliance-info',   depends: ['jcs_canonicalize'],    domains: ['corporate'] },
            { id: 'ed25519_sign',        type: 'crypto.ed25519_sign',           svc: 'compliance-info',   depends: ['sha256_digest'],       domains: ['corporate'] },
            { id: 'vc_issue',            type: 'document.compliance_passport_vc', svc: 'compliance-info', depends: ['ed25519_sign'],        domains: ['corporate'] },
            { id: 'passport_register',   type: 'create.compliance_passport',     svc: 'compliance-info',   depends: ['vc_issue'],            domains: ['corporate'] }
          ],
          params: [
            { name: 'entity_id', type: 'string', required: true },
            { name: 'target_jurisdictions', type: 'array', required: true, note: 'Jurisdictions where passport will be presented' },
            { name: 'validity_period', type: 'enum', required: false, values: ['30d','90d','180d','365d'] },
            { name: 'domains', type: 'array', required: false, note: 'Subset of 23 domains (default: all passing)' }
          ]
        },
        'ae-abudhabi-adgm': {
          name: 'ADGM',
          legal_basis: 'ADGM MoU Framework, CBUAE Cross-border Recognition',
          steps: [
            { id: 'entity_verification', type: 'identity.verify',               svc: 'identity-info',     depends: [],                     domains: ['kyc','aml'] },
            { id: 'compliance_snapshot', type: 'compliance.tensor_evaluate',     svc: 'compliance-info',   depends: ['entity_verification'], domains: ['corporate','aml','sanctions','kyc','tax','banking','licensing'] },
            { id: 'esr_verification',    type: 'compliance.economic_substance_verify', svc: 'compliance-info', depends: ['compliance_snapshot'], domains: ['tax','corporate'] },
            { id: 'domain_attestations', type: 'document.domain_attestations',  svc: 'compliance-info',   depends: ['compliance_snapshot','esr_verification'], domains: ['corporate','aml','sanctions','kyc','tax'] },
            { id: 'evidence_bundle',     type: 'document.evidence_bundle',       svc: 'compliance-info',   depends: ['domain_attestations'], domains: ['corporate'] },
            { id: 'jcs_canonicalize',    type: 'crypto.jcs_canonicalize',       svc: 'compliance-info',   depends: ['evidence_bundle'],     domains: ['corporate'] },
            { id: 'sha256_digest',       type: 'crypto.sha256_digest',          svc: 'compliance-info',   depends: ['jcs_canonicalize'],    domains: ['corporate'] },
            { id: 'ed25519_sign',        type: 'crypto.ed25519_sign',           svc: 'compliance-info',   depends: ['sha256_digest'],       domains: ['corporate'] },
            { id: 'vc_issue',            type: 'document.compliance_passport_vc', svc: 'compliance-info', depends: ['ed25519_sign'],        domains: ['corporate'] },
            { id: 'passport_register',   type: 'create.compliance_passport',     svc: 'compliance-info',   depends: ['vc_issue'],            domains: ['corporate'] }
          ],
          params: [
            { name: 'entity_id', type: 'string', required: true },
            { name: 'target_jurisdictions', type: 'array', required: true },
            { name: 'validity_period', type: 'enum', required: false, values: ['30d','90d','180d','365d'] }
          ]
        },
        'sg': { name: 'Singapore', legal_basis: 'MAS Supervisory MoU, IOSCO MMoU', steps_count: 9 },
        'hk': { name: 'Hong Kong', legal_basis: 'SFC Cross-border MoU, IOSCO MMoU', steps_count: 9 },
        'pk-sifc': { name: 'Pakistan', legal_basis: 'SECP MoU Framework, FATF Mutual Recognition', steps_count: 9 },
        'gb': { name: 'United Kingdom', legal_basis: 'FCA Cross-border MoU, IOSCO MMoU', steps_count: 9 }
      }
    },
    'compliance.tensor_evaluate': {
      desc: 'Run full 23-domain compliance tensor evaluation with fail-closed semantics',
      jurisdictions: {
        'us-de': {
          name: 'United States',
          legal_basis: 'BSA, PATRIOT Act, OFAC, SEC, IRS, FinCEN CDD Rule, HMDA, ECOA, FCPA',
          steps: [
            { id: 'entity_load',         type: 'check.entity_dossier',           svc: 'organization-info', depends: [],                     domains: ['corporate'] },
            { id: 'corporate_eval',      type: 'compliance.eval_corporate',      svc: 'compliance-info',   depends: ['entity_load'],         domains: ['corporate'] },
            { id: 'aml_eval',            type: 'compliance.eval_aml',            svc: 'compliance-info',   depends: ['entity_load'],         domains: ['aml'] },
            { id: 'sanctions_eval',      type: 'compliance.eval_sanctions',      svc: 'compliance-info',   depends: ['entity_load'],         domains: ['sanctions'] },
            { id: 'kyc_eval',            type: 'compliance.eval_kyc',            svc: 'compliance-info',   depends: ['entity_load'],         domains: ['kyc'] },
            { id: 'tax_eval',            type: 'compliance.eval_tax',            svc: 'compliance-info',   depends: ['entity_load'],         domains: ['tax'] },
            { id: 'banking_eval',        type: 'compliance.eval_banking',        svc: 'compliance-info',   depends: ['entity_load'],         domains: ['banking'] },
            { id: 'securities_eval',     type: 'compliance.eval_securities',     svc: 'compliance-info',   depends: ['entity_load'],         domains: ['securities'] },
            { id: 'licensing_eval',      type: 'compliance.eval_licensing',      svc: 'compliance-info',   depends: ['entity_load'],         domains: ['licensing'] },
            { id: 'data_privacy_eval',   type: 'compliance.eval_data_privacy',   svc: 'compliance-info',   depends: ['entity_load'],         domains: ['data_privacy'] },
            { id: 'trade_eval',          type: 'compliance.eval_trade',          svc: 'compliance-info',   depends: ['entity_load'],         domains: ['trade'] },
            { id: 'employment_eval',     type: 'compliance.eval_employment',     svc: 'compliance-info',   depends: ['entity_load'],         domains: ['employment'] },
            { id: 'immigration_eval',    type: 'compliance.eval_immigration',    svc: 'compliance-info',   depends: ['entity_load'],         domains: ['immigration'] },
            { id: 'environmental_eval',  type: 'compliance.eval_environmental',  svc: 'compliance-info',   depends: ['entity_load'],         domains: ['environmental'] },
            { id: 'ip_eval',             type: 'compliance.eval_ip',             svc: 'compliance-info',   depends: ['entity_load'],         domains: ['ip'] },
            { id: 'insurance_eval',      type: 'compliance.eval_insurance',      svc: 'compliance-info',   depends: ['entity_load'],         domains: ['insurance'] },
            { id: 'real_estate_eval',    type: 'compliance.eval_real_estate',    svc: 'compliance-info',   depends: ['entity_load'],         domains: ['real_estate'] },
            { id: 'consumer_eval',       type: 'compliance.eval_consumer_protection', svc: 'compliance-info', depends: ['entity_load'],      domains: ['consumer_protection'] },
            { id: 'procurement_eval',    type: 'compliance.eval_procurement',    svc: 'compliance-info',   depends: ['entity_load'],         domains: ['procurement'] },
            { id: 'dispute_eval',        type: 'compliance.eval_dispute_resolution', svc: 'compliance-info', depends: ['entity_load'],       domains: ['dispute_resolution'] },
            { id: 'custody_eval',        type: 'compliance.eval_custody',        svc: 'compliance-info',   depends: ['entity_load'],         domains: ['custody'] },
            { id: 'tensor_aggregate',    type: 'compliance.tensor_aggregate',    svc: 'compliance-info',   depends: ['corporate_eval','aml_eval','sanctions_eval','kyc_eval','tax_eval','banking_eval','securities_eval','licensing_eval','data_privacy_eval','trade_eval','employment_eval','immigration_eval','environmental_eval','ip_eval','insurance_eval','real_estate_eval','consumer_eval','procurement_eval','dispute_eval','custody_eval'], domains: ['corporate','aml','sanctions','kyc','tax','banking','securities','licensing','data_privacy','trade','employment','immigration','environmental','ip','insurance','real_estate','consumer_protection','procurement','dispute_resolution','custody'] },
            { id: 'decision',            type: 'compliance.fail_closed_decision', svc: 'compliance-info',  depends: ['tensor_aggregate'],    domains: ['corporate'] },
            { id: 'evidence_seal',       type: 'crypto.ed25519_sign',           svc: 'compliance-info',   depends: ['decision'],            domains: ['corporate'] }
          ],
          params: [
            { name: 'entity_id', type: 'string', required: true },
            { name: 'operation_context', type: 'string', required: true, note: 'Operation triggering evaluation' },
            { name: 'jurisdiction', type: 'string', required: true },
            { name: 'fail_mode', type: 'enum', required: false, values: ['fail_closed','advisory'], note: 'Default: fail_closed' }
          ]
        },
        'ae-abudhabi-adgm': { name: 'ADGM', legal_basis: 'FSRA Rules, ADGM AML Rules, CBUAE, UAE CT Law', steps_count: 22 },
        'pk-sifc': { name: 'Pakistan', legal_basis: 'AMLA 2010, SECP AML/CFT, SBP Regulations, ITO 2001', steps_count: 22 },
        'sg': { name: 'Singapore', legal_basis: 'MAS Notices, SFA, CDSA, PDPA, Companies Act', steps_count: 22 },
        'hk': { name: 'Hong Kong', legal_basis: 'AMLO, SFO, Companies Ordinance, PDPO, IRO', steps_count: 22 },
        'gb': { name: 'United Kingdom', legal_basis: 'MLR 2017, FCA Handbook, Companies Act 2006, UK GDPR', steps_count: 22 }
      }
    },
    'trade.import': {
      desc: 'Cross-border goods import with customs clearance, duties, and compliance verification',
      jurisdictions: {
        'us-fl': {
          name: 'Florida',
          legal_basis: 'Tariff Act 1930, CBP Regulations (19 CFR), Trade Act 1974, CTPA, OFAC',
          steps: [
            { id: 'entity_verification',       type: 'check.entity_registration',    svc: 'organization-info', depends: [],                                                              domains: ['corporate','licensing'] },
            { id: 'sanctions_screening',       type: 'screening.sanctions',           svc: 'identity-info',     depends: ['entity_verification'],                                         domains: ['sanctions','aml'] },
            { id: 'denied_party_screening',    type: 'screening.denied_parties',      svc: 'identity-info',     depends: ['entity_verification'],                                         domains: ['trade','sanctions'] },
            { id: 'tariff_classification',     type: 'check.tariff_classification',   svc: 'organization-info', depends: ['entity_verification'],                                         domains: ['trade','tax'] },
            { id: 'duty_computation',          type: 'tax.customs_duty_compute',      svc: 'treasury-info',     depends: ['tariff_classification'],                                       domains: ['trade','tax'] },
            { id: 'fta_determination',         type: 'check.fta_eligibility',         svc: 'organization-info', depends: ['tariff_classification'],                                       domains: ['trade'] },
            { id: 'ftz_evaluation',            type: 'check.ftz_benefits',            svc: 'organization-info', depends: ['entity_verification'],                                         domains: ['trade','tax'] },
            { id: 'customs_entry',             type: 'filing.customs_entry',          svc: 'organization-info', depends: ['sanctions_screening','denied_party_screening','duty_computation','fta_determination'], domains: ['trade','licensing'] },
            { id: 'duty_payment',              type: 'payment.customs_duty',          svc: 'treasury-info',     depends: ['customs_entry'],                                               domains: ['payments','tax','trade'] },
            { id: 'cbp_release',               type: 'filing.cbp_release',            svc: 'organization-info', depends: ['customs_entry','duty_payment'],                                domains: ['trade','licensing'] },
            { id: 'tax_event',                 type: 'create.tax_event',              svc: 'treasury-info',     depends: ['duty_payment'],                                                domains: ['tax','trade'] }
          ],
          fees: [
            { amount: 'Varies', authority: 'CBP', desc: 'Merchandise Processing Fee (0.3464%, min $27.75, max $538.40)' },
            { amount: 'Varies', authority: 'CBP', desc: 'Harbor Maintenance Fee (0.125% for sea shipments)' }
          ],
          params: [
            { name: 'origin_country', type: 'string', required: true, note: 'ISO alpha-2' },
            { name: 'goods_description', type: 'string', required: true },
            { name: 'hs_code', type: 'string', required: true, note: 'HTS 4-10 digits' },
            { name: 'value', type: 'string', required: true },
            { name: 'currency', type: 'string', required: true },
            { name: 'seller_id', type: 'string', required: true },
            { name: 'port_of_entry', type: 'string', required: false, note: 'Default: USMIA (PortMiami)' },
            { name: 'ftz_id', type: 'string', required: false, note: 'Foreign Trade Zone (5 FL FTZs)' }
          ]
        },
        'pk-sifc': {
          name: 'Pakistan',
          legal_basis: 'Customs Act 1969, SBP Import Policy, Import & Export Control Act 1950',
          steps: [
            { id: 'entity_verification',   type: 'check.entity_registration',      svc: 'organization-info', depends: [],                                                              domains: ['corporate','licensing'] },
            { id: 'import_license_check',  type: 'check.import_license',           svc: 'organization-info', depends: ['entity_verification'],                                         domains: ['trade','licensing'] },
            { id: 'sanctions_screening',   type: 'screening.sanctions',            svc: 'identity-info',     depends: ['entity_verification'],                                         domains: ['sanctions','aml'] },
            { id: 'tariff_classification', type: 'check.pct_classification',       svc: 'organization-info', depends: ['entity_verification'],                                         domains: ['trade','tax'] },
            { id: 'duty_computation',      type: 'tax.customs_duty_compute',       svc: 'treasury-info',     depends: ['tariff_classification'],                                       domains: ['trade','tax'] },
            { id: 'customs_declaration',   type: 'filing.goods_declaration',       svc: 'organization-info', depends: ['import_license_check','sanctions_screening','duty_computation'], domains: ['trade','tax','licensing'] },
            { id: 'duty_payment',          type: 'payment.customs_duty',           svc: 'treasury-info',     depends: ['customs_declaration'],                                         domains: ['payments','tax','trade'] },
            { id: 'letter_of_credit',      type: 'payment.lc_settlement',         svc: 'treasury-info',     depends: ['customs_declaration'],                                         domains: ['banking','trade','aml'] },
            { id: 'customs_release',       type: 'filing.customs_release',         svc: 'organization-info', depends: ['customs_declaration','duty_payment'],                           domains: ['trade','licensing'] },
            { id: 'forex_declaration',     type: 'filing.forex_form_i',            svc: 'organization-info', depends: ['letter_of_credit'],                                            domains: ['trade','banking','aml'] },
            { id: 'tax_event',             type: 'create.tax_event',               svc: 'treasury-info',     depends: ['duty_payment'],                                                domains: ['tax','trade'] }
          ],
          fees: [
            { amount: 'Varies', authority: 'Pakistan Customs', desc: 'Custom duty, regulatory duty, additional custom duty' },
            { amount: '18%', authority: 'FBR', desc: 'Sales tax on import (standard rate)' }
          ],
          params: [
            { name: 'origin_country', type: 'string', required: true },
            { name: 'goods_description', type: 'string', required: true },
            { name: 'hs_code', type: 'string', required: true, note: 'PCT code (8 digits)' },
            { name: 'value', type: 'string', required: true },
            { name: 'currency', type: 'string', required: true },
            { name: 'seller_id', type: 'string', required: true },
            { name: 'payment_method', type: 'enum', required: false, values: ['lc','tt','da','open_account'] },
            { name: 'port_of_entry', type: 'string', required: false, note: 'Default: PKKAR (Karachi)' }
          ]
        },
        'sg': { name: 'Singapore', legal_basis: 'Customs Act (Cap 70), Regulation of Imports & Exports Act', steps_count: 9, fee: 'Varies' },
        'ae-abudhabi-adgm': { name: 'UAE/ADGM', legal_basis: 'Federal Customs Law No.1/2003, GCC Common Customs Law', steps_count: 9, fee: 'Varies (5% GCC tariff)' }
      }
    },
    'corridor.create': {
      desc: 'Establish bilateral corridor agreement between two zones',
      jurisdictions: {
        'ae-abudhabi-adgm': {
          name: 'ADGM \u2194 Singapore',
          legal_basis: 'ADGM Regulations 2020, Corridor Protocol v2',
          steps: [
            { id: 'zone_verify',     type: 'check.zone_active',          svc: 'organization-info', depends: [],                domains: ['corporate','licensing'] },
            { id: 'counterpart_ack', type: 'corridor.counterpart_ack',   svc: 'organization-info', depends: ['zone_verify'],    domains: ['corporate'] },
            { id: 'compliance_pre',  type: 'compliance.tensor_evaluate', svc: 'mez-tensor',        depends: ['counterpart_ack'], domains: ['aml','sanctions','kyc','data_privacy'] },
            { id: 'agreement_sign',  type: 'consent.corridor_agreement', svc: 'governance-info',      depends: ['compliance_pre'], domains: ['corporate','licensing'] },
            { id: 'anchor',          type: 'corridor.anchor_create',     svc: 'mez-crypto',        depends: ['agreement_sign'], domains: ['corporate'] },
            { id: 'attestation',     type: 'vc.corridor_attestation',    svc: 'attestation-engine', depends: ['anchor'],        domains: ['corporate'] }
          ],
          fees: [],
          params: [
            { name: 'source_zone', type: 'string', required: true },
            { name: 'target_zone', type: 'string', required: true },
            { name: 'corridor_type', type: 'enum', required: true, values: ['bilateral','multilateral','synthetic'] }
          ]
        }
      }
    },
    'corridor.activate': {
      desc: 'Transition corridor from PENDING to ACTIVE with watcher attestation',
      jurisdictions: {
        'ae-abudhabi-adgm': {
          name: 'ADGM \u2194 Singapore',
          legal_basis: 'Corridor Protocol v2, Watcher Attestation Framework',
          steps: [
            { id: 'state_check',      type: 'check.corridor_state',       svc: 'organization-info', depends: [],               domains: ['corporate'] },
            { id: 'watcher_attest',    type: 'corridor.watcher_attest',    svc: 'mez-crypto',        depends: ['state_check'],   domains: ['corporate','aml'] },
            { id: 'compliance_gate',   type: 'compliance.tensor_evaluate', svc: 'mez-tensor',        depends: ['watcher_attest'], domains: ['aml','sanctions','kyc'] },
            { id: 'state_transition',  type: 'corridor.state_transition',  svc: 'organization-info', depends: ['compliance_gate'], domains: ['corporate'] },
            { id: 'receipt',           type: 'corridor.receipt_issue',     svc: 'mez-crypto',        depends: ['state_transition'], domains: ['corporate'] }
          ],
          fees: [],
          params: [
            { name: 'corridor_id', type: 'string', required: true },
            { name: 'watcher_id', type: 'string', required: false }
          ]
        }
      }
    },
    'licensing.acquire': {
      desc: 'Acquire zone operating license for an entity',
      jurisdictions: {
        'ae-abudhabi-adgm': {
          name: 'ADGM',
          legal_basis: 'ADGM Commercial Licensing Regulations 2015',
          steps: [
            { id: 'entity_check',    type: 'check.entity_active',       svc: 'organization-info', depends: [],              domains: ['corporate'] },
            { id: 'activity_class',  type: 'licensing.classify',        svc: 'organization-info', depends: ['entity_check'], domains: ['licensing','corporate'] },
            { id: 'compliance_pre',  type: 'compliance.tensor_evaluate', svc: 'mez-tensor',       depends: ['activity_class'], domains: ['licensing','aml','sanctions'] },
            { id: 'license_issue',   type: 'licensing.issue',           svc: 'organization-info', depends: ['compliance_pre'], domains: ['licensing','corporate'] },
            { id: 'attestation',     type: 'vc.license_attestation',    svc: 'attestation-engine', depends: ['license_issue'], domains: ['licensing'] }
          ],
          fees: [
            { amount: 'AED 1,050', authority: 'ADGM RA', desc: 'Commercial license fee' }
          ],
          params: [
            { name: 'entity_id', type: 'string', required: true },
            { name: 'activity_code', type: 'string', required: true, note: 'ADGM activity classification' }
          ]
        },
        'us-de': {
          name: 'Delaware',
          legal_basis: 'DGCL, Delaware Business License requirements',
          steps: [
            { id: 'entity_check',   type: 'check.entity_active',       svc: 'organization-info', depends: [],              domains: ['corporate'] },
            { id: 'license_type',   type: 'licensing.classify',        svc: 'organization-info', depends: ['entity_check'], domains: ['licensing'] },
            { id: 'license_issue',  type: 'licensing.issue',           svc: 'organization-info', depends: ['license_type'], domains: ['licensing','corporate'] }
          ],
          fees: [
            { amount: '$75', authority: 'DE Division of Revenue', desc: 'Business license' }
          ],
          params: [
            { name: 'entity_id', type: 'string', required: true },
            { name: 'license_type', type: 'enum', required: true, values: ['general','financial','professional'] }
          ]
        }
      }
    },
    'licensing.renew': {
      desc: 'Annual license renewal with compliance re-verification',
      jurisdictions: {
        'ae-abudhabi-adgm': {
          name: 'ADGM',
          legal_basis: 'ADGM Commercial Licensing Regulations 2015',
          steps: [
            { id: 'license_check',   type: 'check.license_active',      svc: 'organization-info', depends: [],               domains: ['licensing'] },
            { id: 'compliance_re',   type: 'compliance.tensor_evaluate', svc: 'mez-tensor',        depends: ['license_check'], domains: ['licensing','aml','sanctions','kyc'] },
            { id: 'renewal_issue',   type: 'licensing.renew',           svc: 'organization-info', depends: ['compliance_re'], domains: ['licensing','corporate'] },
            { id: 'attestation',     type: 'vc.license_attestation',    svc: 'attestation-engine', depends: ['renewal_issue'], domains: ['licensing'] }
          ],
          fees: [
            { amount: 'AED 1,050', authority: 'ADGM RA', desc: 'Annual renewal' }
          ],
          params: [
            { name: 'license_id', type: 'string', required: true }
          ]
        }
      }
    },
    'compliance.vasp_register': {
      desc: 'Register as Virtual Asset Service Provider under FATF Travel Rule',
      jurisdictions: {
        'ae-abudhabi-adgm': {
          name: 'ADGM',
          legal_basis: 'FSRA Virtual Asset Framework 2023, FATF Recommendation 16',
          steps: [
            { id: 'entity_check',    type: 'check.entity_active',       svc: 'organization-info', depends: [],                domains: ['corporate'] },
            { id: 'aml_assessment',  type: 'compliance.aml_risk',       svc: 'mez-tensor',        depends: ['entity_check'],   domains: ['aml','kyc','sanctions'] },
            { id: 'travel_rule',     type: 'compliance.travel_rule',    svc: 'mez-tensor',        depends: ['aml_assessment'], domains: ['aml','digital_assets'] },
            { id: 'vasp_filing',     type: 'filing.vasp_registration',  svc: 'organization-info', depends: ['travel_rule'],    domains: ['licensing','digital_assets','aml'] },
            { id: 'fsra_review',     type: 'filing.regulator_review',   svc: 'organization-info', depends: ['vasp_filing'],    domains: ['licensing','digital_assets'] },
            { id: 'attestation',     type: 'vc.vasp_attestation',       svc: 'attestation-engine', depends: ['fsra_review'],   domains: ['digital_assets','licensing'] }
          ],
          fees: [
            { amount: 'AED 20,000', authority: 'FSRA', desc: 'VASP application fee' },
            { amount: 'AED 15,000', authority: 'FSRA', desc: 'Annual supervision fee' }
          ],
          params: [
            { name: 'entity_id', type: 'string', required: true },
            { name: 'va_activities', type: 'array', required: true, note: 'exchange, transfer, custody, issuance, advisory' }
          ]
        },
        'sg': {
          name: 'Singapore',
          legal_basis: 'Payment Services Act 2019, MAS PS-N02 (Travel Rule)',
          steps: [
            { id: 'entity_check',   type: 'check.entity_active',       svc: 'organization-info', depends: [],               domains: ['corporate'] },
            { id: 'aml_program',    type: 'compliance.aml_program',    svc: 'mez-tensor',        depends: ['entity_check'],  domains: ['aml','kyc'] },
            { id: 'travel_rule',    type: 'compliance.travel_rule',    svc: 'mez-tensor',        depends: ['aml_program'],   domains: ['aml','digital_assets'] },
            { id: 'mas_filing',     type: 'filing.dpt_license',        svc: 'organization-info', depends: ['travel_rule'],   domains: ['licensing','digital_assets','payments'] },
            { id: 'attestation',    type: 'vc.vasp_attestation',       svc: 'attestation-engine', depends: ['mas_filing'],   domains: ['digital_assets','licensing'] }
          ],
          fees: [
            { amount: 'SGD 1,000', authority: 'MAS', desc: 'DPT license application' }
          ],
          params: [
            { name: 'entity_id', type: 'string', required: true },
            { name: 'dpt_services', type: 'array', required: true, note: 'dealing, exchange, transfer, custody, advisory' }
          ]
        }
      }
    },
    'compliance.vasp_report': {
      desc: 'Periodic VASP compliance reporting (STR, CTR, Travel Rule)',
      jurisdictions: {
        'ae-abudhabi-adgm': {
          name: 'ADGM',
          legal_basis: 'FSRA AML Rulebook, FATF Recommendation 20',
          steps: [
            { id: 'vasp_check',      type: 'check.vasp_registered',     svc: 'organization-info', depends: [],               domains: ['licensing','digital_assets'] },
            { id: 'transaction_scan', type: 'compliance.transaction_scan', svc: 'mez-tensor',      depends: ['vasp_check'],    domains: ['aml','digital_assets'] },
            { id: 'str_generate',    type: 'compliance.str_generate',   svc: 'mez-tensor',        depends: ['transaction_scan'], domains: ['aml'] },
            { id: 'report_file',     type: 'filing.vasp_report',        svc: 'organization-info', depends: ['str_generate'],  domains: ['licensing','aml','digital_assets'] },
            { id: 'attestation',     type: 'vc.report_attestation',     svc: 'attestation-engine', depends: ['report_file'],  domains: ['digital_assets','aml'] }
          ],
          fees: [],
          params: [
            { name: 'vasp_id', type: 'string', required: true },
            { name: 'period', type: 'string', required: true, note: 'YYYY-Q1 through Q4' },
            { name: 'report_type', type: 'enum', required: true, values: ['str','ctr','travel_rule','annual'] }
          ]
        }
      }
    }
  };

  /* ── JSON Schema catalog ── */
  var SCHEMA_FAMILIES = [
    { id: 'agentic',     name: 'Agentic',       count: 6, desc: 'Policy engine, triggers, actions, audit trails' },
    { id: 'arbitration', name: 'Arbitration',    count: 8, desc: 'Disputes, claims, evidence, orders, settlements' },
    { id: 'corridor',    name: 'Corridor',       count: 16, desc: 'Agreements, anchors, receipts, routing, state machine' },
    { id: 'smart-asset', name: 'Smart Asset',    count: 9, desc: 'Genesis, manifest, attestation, receipt chain' },
    { id: 'trade',       name: 'Trade',          count: 5, desc: 'Invoice, bill of lading, letter of credit, amount, party' },
    { id: 'transition',  name: 'Transitions',    count: 13, desc: 'Transfer, SWIFT pacs008, digital cash, BoL, LC payloads' },
    { id: 'vc',          name: 'Verifiable Cred', count: 20, desc: 'Corridor, arbitration, asset, regpack, lawpack attestations' },
    { id: 'infra',       name: 'Infrastructure', count: 12, desc: 'Zone, module, profile, regpack, lawpack, lockfile' },
    { id: 'identity',    name: 'Identity',       count: 6, desc: 'KYC, KYB, CNIC, NTN, national ID schemas' },
    { id: 'compliance',  name: 'Compliance',     count: 8, desc: 'Tensor, domain, passport, evidence, decision' },
    { id: 'govos',       name: 'GovOS',          count: 7, desc: 'Console, tax revenue, freezone, citizen, dashboard' },
    { id: 'entity',      name: 'Entity',         count: 6, desc: 'Creation, lifecycle, dossier, beneficial ownership' }
  ];

  /* ── CLI subcommands ── */
  var CLI_COMMANDS = [
    { name: 'validate',    desc: 'Validate modules, profiles, and zones against schemas', subcommands: 3 },
    { name: 'lock',        desc: 'Generate or verify deterministic lockfile for zone config', subcommands: 2 },
    { name: 'corridor',    desc: 'Corridor lifecycle: create, activate, halt, verify, state, attest', subcommands: 16 },
    { name: 'artifact',    desc: 'Content-addressed storage: store, resolve, verify, bundle, index', subcommands: 10 },
    { name: 'asset',       desc: 'Asset lifecycle and state-chain: genesis, checkpoint, migrate, anchor', subcommands: 15 },
    { name: 'law',         desc: 'Lawpack ingest, attestation, and verification', subcommands: 4 },
    { name: 'regpack',     desc: 'Regulatory packs: build, ingest, sanctions, verify, digest, attest', subcommands: 9 },
    { name: 'agent',       desc: 'Local agent lifecycle and policy enforcement', subcommands: 5 },
    { name: 'arbitration', desc: 'Dispute lifecycle: file, respond, rule, enforce, settle', subcommands: 12 },
    { name: 'vc',          desc: 'Ed25519 keygen, VC signing, and signature verification', subcommands: 3 },
    { name: 'zone',        desc: 'Zone composition and synthetic zone generation', subcommands: 4 },
    { name: 'init',        desc: 'Bootstrap a new Economic Zone with CAS digests', subcommands: 1 },
    { name: 'deploy',      desc: 'Deploy infrastructure generation (Docker Compose for N zones)', subcommands: 2 },
    { name: 'audit',       desc: 'Cryptographically verifiable corridor audit proof', subcommands: 3 },
    { name: 'demo',        desc: 'End-to-end corridor transaction narrative (offline)', subcommands: 1 }
  ];

  /* ══════════════════════════════════════
     TERMINAL ENGINE
     ══════════════════════════════════════ */

  var outputEl, inputEl;
  var history = [];
  var historyIdx = -1;
  var animating = false;
  var animationId = 0;

  /* ── Utilities ── */
  /* ── Mesh bridge — emit CustomEvents to drive corridor mesh ── */
  function emitMesh(type, detail) {
    window.dispatchEvent(new CustomEvent('mesh:' + type, { detail: detail || {} }));
  }

  function padRight(str, len) {
    while (str.length < len) str += ' ';
    return str;
  }

  function escHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function addLine(html, cls) {
    var div = document.createElement('div');
    div.className = 'line' + (cls ? ' ' + cls : '');
    if (html !== undefined && html !== '') {
      div.innerHTML = html;
    } else {
      div.innerHTML = '&nbsp;';
    }
    outputEl.appendChild(div);
    trimOutput();
    return div;
  }

  function addLines(lines) {
    for (var i = 0; i < lines.length; i++) {
      addLine(lines[i]);
    }
  }

  function trimOutput() {
    while (outputEl.children.length > 500) {
      outputEl.removeChild(outputEl.firstChild);
    }
  }

  /* Track whether user is at the scroll bottom.
     Updated on every scroll event so we always know
     the state BEFORE new content is appended. */
  var _userAtBottom = true;

  function scrollToBottom() {
    outputEl.scrollTop = outputEl.scrollHeight;
    _userAtBottom = true;
  }

  function scrollIfAtBottom() {
    if (_userAtBottom) {
      outputEl.scrollTop = outputEl.scrollHeight;
    }
  }

  function findZone(query) {
    if (!query) return null;
    var q = query.toLowerCase().replace(/[^a-z0-9]/g, '');
    /* Exact ID match */
    for (var i = 0; i < ZONES.length; i++) {
      if (ZONES[i].id === q) return ZONES[i];
    }
    /* Name prefix match */
    for (var j = 0; j < ZONES.length; j++) {
      var n = ZONES[j].name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (n.indexOf(q) === 0) return ZONES[j];
    }
    /* Substring match */
    for (var k = 0; k < ZONES.length; k++) {
      var m = ZONES[k].name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (m.indexOf(q) !== -1) return ZONES[k];
    }
    /* Country match */
    for (var l = 0; l < ZONES.length; l++) {
      var c = ZONES[l].country.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (c.indexOf(q) !== -1) return ZONES[l];
    }
    return null;
  }

  function zonesByStatus(status) {
    var result = [];
    for (var i = 0; i < ZONES.length; i++) {
      if (ZONES[i].status === status) result.push(ZONES[i]);
    }
    return result;
  }

  function statusLabel(status) {
    if (status === 'live') return '<span class="t-success">LIVE</span>';
    if (status === 'testnet') return '<span class="t-testnet">TESTNET</span>';
    return '<span class="t-dim">PIPELINE</span>';
  }

  function statusText(status) {
    if (status === 'live') return 'Live';
    if (status === 'testnet') return 'Testnet';
    return 'Pipeline';
  }


  /* ── Data cache (lazy-loaded from data/*.json) ── */
  var _dataCache = {};
  function loadData(name, callback) {
    if (_dataCache[name]) { callback(_dataCache[name]); return; }
    fetch('/data/' + name + '.json')
      .then(function (r) { return r.json(); })
      .then(function (data) { _dataCache[name] = data; callback(data); })
      .catch(function () {
        addLine('<span class="t-error">Failed to load ' + name + ' data</span>');
        addLine('');
      });
  }


  /* ══════════════════════════════════════
     COMMAND REGISTRY
     ══════════════════════════════════════ */

  var COMMANDS = {
    help:       { desc: 'Show available commands',                                   fn: cmdHelp,       group: 'terminal' },
    status:     { desc: 'Network overview and statistics',                           fn: cmdStatus,     group: 'explore' },
    zones:      { desc: 'List zones (--live, --testnet, --pipeline)',                fn: cmdZones,      group: 'explore' },
    zone:       { desc: 'Inspect a zone: zone <name|id>',                           fn: cmdZone,       group: 'explore' },
    corridors:  { desc: 'Corridor topology and math',                               fn: cmdCorridors,  group: 'explore' },
    compare:    { desc: 'Compare zones: compare <z1> <z2> [z3]',                    fn: cmdCompare,    group: 'explore' },
    trace:      { desc: 'Trace corridor: trace <from> <to>',                        fn: cmdTrace,      group: 'simulate' },
    demo:       { desc: 'Full corridor lifecycle: demo <from> <to>',                fn: cmdDemo,       group: 'simulate' },
    route:      { desc: 'Find route: route <from> <to>',                            fn: cmdRoute,      group: 'simulate' },
    entity:     { desc: 'Simulate formation: entity incorporate --jurisdiction <id>', fn: cmdEntity,    group: 'simulate' },
    settle:     { desc: 'Multilateral netting demonstration',                       fn: cmdSettle,     group: 'simulate' },
    operation:  { desc: 'Inspect lawpack: operation <type> [--jurisdiction <id>]',  fn: cmdOperation,  group: 'reference' },
    compliance: { desc: '23 compliance domains (lattice)',                           fn: cmdCompliance, group: 'reference' },
    modules:    { desc: 'Module catalog (--family <name>)',                          fn: cmdModules,    group: 'reference' },
    primitives: { desc: 'Five programmable primitives',                              fn: cmdPrimitives, group: 'reference' },
    deploy:     { desc: 'Deployment economics',                                     fn: cmdDeploy,     group: 'reference' },
    tax:        { desc: 'Withholding rules: tax --jurisdiction <id>',               fn: cmdTax,        group: 'reference' },
    schema:     { desc: 'OpenAPI schema catalog (1,570 schemas)',                        fn: cmdSchema,     group: 'reference' },
    cli:        { desc: 'Mass CLI (mez) subcommand reference',                      fn: cmdCli,        group: 'reference' },
    settlement: { desc: 'Settlement types: settlement [type]',                      fn: cmdSettlement, group: 'reference' },
    lifecycle:  { desc: 'Corridor state machine (6 states, 9 transitions)',         fn: cmdLifecycle,  group: 'reference' },
    transitions:{ desc: 'Transition types: transitions [--family <name>]',          fn: cmdTransitions, group: 'reference' },
    lawpack:    { desc: 'Lawpack DAG: lawpack <operation> <jurisdiction>',            fn: cmdLawpack,    group: 'reference' },
    diff:       { desc: 'Compare jurisdictions: diff <operation> <j1> <j2>',        fn: cmdDiff,       group: 'reference' },
    api:        { desc: 'OpenAPI surface: api [path-prefix]',                       fn: cmdApi,        group: 'reference' },
    savm:       { desc: 'Smart Asset VM instruction set (44 opcodes)',              fn: cmdSavm,       group: 'reference' },
    pipe:       { desc: 'Fee stack: pipe <from> <to>',                             fn: cmdPipe,       group: 'reference' },
    govos:      { desc: 'Zone operator dashboard: govos <zone-id>',               fn: cmdGovos,      group: 'government' },
    integrate:  { desc: 'Integration architecture: integrate <system-type>',      fn: cmdIntegrate,  group: 'government' },
    training:   { desc: 'Independence curriculum: training [phase]',              fn: cmdTraining,   group: 'government' },
    costs:      { desc: 'Deployment costs: costs [zone-id]',                      fn: cmdCosts,      group: 'government' },
    sovereignty:{ desc: 'Sovereignty architecture (4 dimensions)',                fn: cmdSovereignty, group: 'government' },
    audit:      { desc: 'Entity audit view: audit <entity-id>',                   fn: cmdAudit,      group: 'government' },
    documents:  { desc: 'Document pipeline: documents <operation-type>',          fn: cmdDocuments,  group: 'documents' },
    filing:     { desc: 'Registrar filing: filing <jurisdiction>',                fn: cmdFiling,     group: 'documents' },
    packs:      { desc: 'Pack Trilogy: packs <jurisdiction>',                     fn: cmdPacks,      group: 'documents' },
    clear:      { desc: 'Clear terminal output',                                    fn: cmdClear,      group: 'terminal' },
    history:    { desc: 'Show command history',                                     fn: cmdHistory,    group: 'terminal' },
    export:     { desc: 'Shareable URL for this session',                           fn: cmdExport,     group: 'terminal' },
    about:      { desc: 'About this explorer',                                      fn: cmdAbout,      group: 'terminal' },
    sdk:        { desc: 'TypeScript SDK: sdk <primitive> [action]',               fn: cmdSdk,        group: 'reference' },
    envelope:   { desc: 'OrchestrationEnvelope structure (every write)',          fn: cmdEnvelope,   group: 'reference' },
    'write-path': { desc: 'Write-path pipeline (10 stages)',                     fn: cmdWritePath,  group: 'reference' },
    security:   { desc: 'Security posture and audit record',                     fn: cmdSecurity,   group: 'reference' }
  };

  var COMMAND_NAMES = Object.keys(COMMANDS);

  /* ── help ── */
  function cmdHelp() {
    var groups = [
      { label: 'EXPLORATION', key: 'explore' },
      { label: 'SIMULATION', key: 'simulate' },
      { label: 'REFERENCE', key: 'reference' },
      { label: 'GOVERNMENT', key: 'government' },
      { label: 'DOCUMENTS & FILING', key: 'documents' },
      { label: 'TERMINAL', key: 'terminal' }
    ];

    addLine('');
    addLine('<span class="t-accent">Momentum Network Explorer</span> <span class="t-dim">v0.4.44 GENESIS</span>');

    for (var g = 0; g < groups.length; g++) {
      addLine('');
      addLine('<span class="t-label">' + groups[g].label + '</span>');
      addLine('');
      for (var i = 0; i < COMMAND_NAMES.length; i++) {
        var name = COMMAND_NAMES[i];
        var cmd = COMMANDS[name];
        if (cmd.group === groups[g].key) {
          addLine('  ' + padRight(name, 18) + '<span class="t-dim">' + cmd.desc + '</span>');
        }
      }
    }

    addLine('');
    addLine('<span class="t-label">EXAMPLES</span>');
    addLine('');
    var helpEx = [
      { cmd: 'lawpack entity.incorporate ae-abudhabi-adgm', desc: 'ADGM incorporation DAG (11 steps, FSRA)' },
      { cmd: 'diff entity.incorporate us-de sg', desc: 'Delaware vs Singapore side-by-side' },
      { cmd: 'schema corridor.receipt', desc: 'Browse schema: required fields, types, patterns' },
      { cmd: 'api /v1/corridors', desc: 'OpenAPI operations matching path' },
      { cmd: 'savm', desc: 'Smart Asset VM: 44 opcodes, compliance coprocessor' },
      { cmd: 'pipe adgm sg', desc: 'Fee stack: flat fees + bps + comparison' },
      { cmd: 'demo adgm sg', desc: 'Full corridor lifecycle (7 phases)' },
      { cmd: 'trace adgm sg', desc: 'Trace ADGM \u2192 Singapore corridor' },
      { cmd: 'zone adgm', desc: 'Inspect zone + regpacks + hierarchy' },
      { cmd: 'compare pk adgm sg', desc: 'Cross-jurisdiction comparison' }
    ];
    for (var h = 0; h < helpEx.length; h++) {
      addLine('  <span class="t-accent">' + padRight(helpEx[h].cmd, 48) + '</span> <span class="t-dim">' + helpEx[h].desc + '</span>');
    }
    addLine('');
    addLine('<span class="t-dim">Arrow keys for history. Tab for completion.</span>');
    addLine('');
  }

  /* ── status ── */
  function cmdStatus() {
    emitMesh('clear');
    var live = zonesByStatus('live');
    var testnet = zonesByStatus('testnet');
    var pipeline = zonesByStatus('pipeline');
    var total = ZONES.length;
    var corridorCount = total * (total - 1) / 2;

    addLine('');
    addLine('<span class="t-accent">NETWORK STATUS</span>');
    addLine('');
    addLine('  <span class="t-label">ZONES</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Live              <span class="t-success">' + live.length + ' jurisdictions</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Testnet            <span class="t-testnet">' + testnet.length + ' zones</span>');
    addLine('  <span class="t-tree">\u2514\u2500</span> Pipeline           <span class="t-dim">' + pipeline.length + ' zones</span>');
    addLine('');
    addLine('  <span class="t-label">METRICS</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Configured zones   <span class="t-value">218</span> <span class="t-dim">(' + total + ' in terminal, +56 US states, +22 synthetic)</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Possible corridors <span class="t-value">' + corridorCount.toLocaleString() + '</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Entities formed    <span class="t-value">1,000+</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Assets onboarded   <span class="t-value">$20B+</span>');
    addLine('  <span class="t-tree">\u2514\u2500</span> Avg formation      <span class="t-value">&lt;72 hours</span>');
    addLine('');
    addLine('  <span class="t-label">PARTNERS</span>');
    for (var i = 0; i < PARTNERS.length; i++) {
      var tree = (i === PARTNERS.length - 1) ? '\u2514\u2500' : '\u251C\u2500';
      addLine('  <span class="t-tree">' + tree + '</span> ' + escHtml(PARTNERS[i]));
    }
    addLine('');
  }

  /* ── zones ── */
  function cmdZones(args) {
    emitMesh('clear');
    var filter = null;
    if (args.indexOf('--live') !== -1) filter = 'live';
    else if (args.indexOf('--testnet') !== -1) filter = 'testnet';
    else if (args.indexOf('--pipeline') !== -1) filter = 'pipeline';

    var groups = [
      { label: 'LIVE', status: 'live' },
      { label: 'TESTNET', status: 'testnet' },
      { label: 'PIPELINE', status: 'pipeline' }
    ];

    addLine('');

    for (var g = 0; g < groups.length; g++) {
      var group = groups[g];
      if (filter && filter !== group.status) continue;

      var zones = zonesByStatus(group.status);
      if (zones.length === 0) continue;

      addLine('<span class="t-label">' + group.label + '</span> <span class="t-dim">(' + zones.length + ')</span>');
      addLine('');

      for (var i = 0; i < zones.length; i++) {
        var z = zones[i];
        var tree = (i === zones.length - 1) ? '\u2514\u2500' : '\u251C\u2500';
        addLine('  <span class="t-tree">' + tree + '</span> ' + padRight(escHtml(z.name), 24) + '<span class="t-dim">' + escHtml(z.country) + '</span>  <span class="t-dim">[' + escHtml(z.id) + ']</span>');
      }
      addLine('');
    }
  }

  /* ── zone <name> ── */
  function cmdZone(args) {
    var query = args.replace(/^zone\s*/i, '').trim();
    if (!query) {
      addLine('<span class="t-error">Usage: zone &lt;name|id&gt;</span>');
      addLine('<span class="t-dim">Example: zone adgm</span>');
      return;
    }

    var z = findZone(query);
    if (!z) {
      addLine('<span class="t-error">Zone not found: ' + escHtml(query) + '</span>');
      addLine('<span class="t-dim">Try: zones --live</span>');
      return;
    }

    var kern = ZONE_KERNEL[z.id]; /* kernel data if available */

    emitMesh('clear');
    emitMesh('highlight', { zones: [z.id] });
    emitMesh('pulse', { zone: z.id });

    addLine('');
    addLine('<span class="t-accent">' + escHtml(z.name) + '</span>  ' + statusLabel(z.status));
    addLine('');
    addLine('  <span class="t-tree">\u251C\u2500</span> ID             <span class="t-value">' + escHtml(z.id) + '</span>');
    if (kern) {
      addLine('  <span class="t-tree">\u251C\u2500</span> Jurisdiction   <span class="t-value">' + escHtml(kern.jid) + '</span>');
      addLine('  <span class="t-tree">\u251C\u2500</span> Stack          <span class="t-value">' + kern.jstack.join(' \u2192 ') + '</span>');
    }
    addLine('  <span class="t-tree">\u251C\u2500</span> Country        <span class="t-value">' + escHtml(z.country) + '</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Region         <span class="t-value">' + escHtml(z.region) + '</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Framework      <span class="t-value">' + escHtml(z.framework || '\u2014') + '</span>');
    if (kern) {
      addLine('  <span class="t-tree">\u251C\u2500</span> Profile        <span class="t-value">' + escHtml(kern.profile) + '</span>');
    }
    addLine('  <span class="t-tree">\u251C\u2500</span> Status         ' + statusLabel(z.status));
    addLine('  <span class="t-tree">\u2514\u2500</span> Detail');
    addLine('');

    /* Word-wrap detail at ~70 chars */
    var detailText = z.detail || '\u2014';
    var words = detailText.split(' ');
    var line = '     ';
    for (var i = 0; i < words.length; i++) {
      if (line.length + words[i].length > 75 && line.length > 5) {
        addLine('<span class="t-dim">' + escHtml(line) + '</span>');
        line = '     ';
      }
      line += words[i] + ' ';
    }
    if (line.trim()) {
      addLine('<span class="t-dim">' + escHtml(line) + '</span>');
    }

    /* Lawpack domains */
    if (kern && kern.lawpacks) {
      addLine('');
      addLine('  <span class="t-label">LAWPACK DOMAINS</span>');
      for (var lp = 0; lp < kern.lawpacks.length; lp++) {
        var lpTree = lp < kern.lawpacks.length - 1 ? '\u251C\u2500' : '\u2514\u2500';
        addLine('  <span class="t-tree">' + lpTree + '</span> ' + kern.lawpacks[lp]);
      }
    }

    /* Regpacks */
    if (kern && kern.regpacks) {
      addLine('');
      addLine('  <span class="t-label">REGPACKS</span>                                  <span class="t-label">VERIFIED</span>');
      for (var rp = 0; rp < kern.regpacks.length; rp++) {
        var rpk = kern.regpacks[rp];
        var rpTree = rp < kern.regpacks.length - 1 ? '\u251C\u2500' : '\u2514\u2500';
        addLine('  <span class="t-tree">' + rpTree + '</span> ' + padRight(rpk.domain, 14) + '<span class="t-dim">' + rpk.sha + '\u2026</span>   ' + rpk.date + '    <span class="t-value">' + rpk.jid + '</span>');
      }
    } else if (kern && kern.regpacks === null) {
      addLine('');
      addLine('  <span class="t-label">REGPACKS</span>  <span class="t-dim">builder needed</span>');
    }

    /* Compliance domains */
    var domains = (kern && kern.domains) ? kern.domains : z.compliance_domains;
    if (domains && domains.length > 0) {
      addLine('');
      addLine('  <span class="t-label">COMPLIANCE DOMAINS (' + domains.length + ')</span>');
      var domLine = '  ';
      for (var d = 0; d < domains.length; d++) {
        domLine += domains[d] + '  ';
        if ((d + 1) % 5 === 0 || d === domains.length - 1) {
          addLine('<span class="t-value">' + domLine + '</span>');
          domLine = '  ';
        }
      }
    }

    /* Connected corridors */
    addLine('');
    addLine('  <span class="t-label">CORRIDORS</span>');
    var sameRegion = [];
    var crossRegion = [];
    for (var j = 0; j < ZONES.length; j++) {
      if (ZONES[j].id === z.id) continue;
      if (ZONES[j].status !== 'live') continue;
      if (ZONES[j].region === z.region) sameRegion.push(ZONES[j]);
      else crossRegion.push(ZONES[j]);
    }
    var shown = sameRegion.slice(0, 5).concat(crossRegion.slice(0, 3));
    for (var ci = 0; ci < shown.length; ci++) {
      var cTree = (ci === shown.length - 1) ? '\u2514\u2500' : '\u251C\u2500';
      var cType = shown[ci].region === z.region ? '<span class="t-string">intra-region</span>' : '<span class="t-accent">cross-border</span>';
      addLine('  <span class="t-tree">' + cTree + '</span> ' + escHtml(z.id) + ' <span class="t-dim">\u2192</span> ' + padRight(escHtml(shown[ci].id), 14) + cType);
    }
    addLine('');
    addLine('<span class="t-dim">\u2192 Configure this zone: <a href="/docs.html" class="t-link">docs</a>  |  <a href="/explore.html" class="t-link">explore</a></span>');
    addLine('');
  }

  /* ── corridors ── */
  function cmdCorridors() {
    emitMesh('clear');
    var total = ZONES.length;
    var formula = function (n) { return n * (n - 1) / 2; };

    addLine('');
    addLine('<span class="t-accent">CORRIDOR TOPOLOGY</span>');
    addLine('');
    addLine('  N zones \u2192 N\u00d7(N-1)/2 possible corridors');
    addLine('  Each corridor is a fee-extracting compliance bridge.');
    addLine('');
    addLine('  <span class="t-label">PROGRESSION</span>');
    addLine('');

    var ns = [3, 10, 30, 50, 100, total];
    for (var i = 0; i < ns.length; i++) {
      var n = ns[i];
      var c = formula(n);
      var tree = (i === ns.length - 1) ? '\u2514\u2500' : '\u251C\u2500';
      var label = n === total ? padRight(n + ' zones (current)', 22) : padRight(n + ' zones', 22);
      addLine('  <span class="t-tree">' + tree + '</span> ' + label + '<span class="t-value">' + c.toLocaleString() + ' corridors</span>');
    }

    addLine('');
    addLine('  <span class="t-label">CORRIDOR TYPES</span>');
    addLine('');
    for (var j = 0; j < CORRIDOR_TYPES.length; j++) {
      var ct = CORRIDOR_TYPES[j];
      var tree2 = (j === CORRIDOR_TYPES.length - 1) ? '\u2514\u2500' : '\u251C\u2500';
      addLine('  <span class="t-tree">' + tree2 + '</span> <span class="t-accent">' + escHtml(ct.name) + '</span>');
      addLine('     <span class="t-dim">' + escHtml(ct.desc) + '</span>');
    }
    addLine('');
    addLine('  Hub-node positioning: \u2265100x advantage vs secondary.');
    addLine('  Switching costs compound. Strategic window is finite.');
    addLine('');
  }

  /* ── trace <from> <to> (animated) ── */
  function cmdTrace(args) {
    var parts = args.replace(/^trace\s*/i, '').trim().split(/\s+/);
    if (parts.length < 2 || !parts[0] || !parts[1]) {
      addLine('<span class="t-error">Usage: trace &lt;from&gt; &lt;to&gt;</span>');
      addLine('<span class="t-dim">Example: trace adgm sg</span>');
      return;
    }

    var fromZone = findZone(parts[0]);
    var toZone = findZone(parts[1]);

    if (!fromZone) {
      addLine('<span class="t-error">Source zone not found: ' + escHtml(parts[0]) + '</span>');
      return;
    }
    if (!toZone) {
      addLine('<span class="t-error">Target zone not found: ' + escHtml(parts[1]) + '</span>');
      return;
    }
    if (fromZone.id === toZone.id) {
      addLine('<span class="t-error">Source and target must be different zones.</span>');
      return;
    }

    emitMesh('clear');
    emitMesh('trace', { from: fromZone.id, to: toZone.id });
    emitMesh('burst', { from: fromZone.id, to: toZone.id, count: 5 });

    /* Pre-compute route for dynamic fees */
    var traceRoute = findRoute(fromZone.id, toZone.id);
    var corridorFeeBps = traceRoute ? traceRoute.total_fee_bps : 20;
    var corridorFeeUsd = corridorFeeBps * 100; /* $ per $1M notional */
    var traceFees = [
      { label: 'Corridor transit (' + corridorFeeBps + ' bps)', amount: corridorFeeUsd },
      { label: 'Compliance evaluation', amount: 500 },
      { label: 'Settlement anchoring', amount: 200 }
    ];

    animating = true;
    inputEl.disabled = true;
    animationId++;
    var myId = animationId;

    var fromId = fromZone.id;
    var toId = toZone.id;
    var fromName = fromZone.name;
    var toName = toZone.name;

    addLine('');

    /* Reduced motion: instant render */
    if (reducedMotion) {
      renderTraceInstant(fromZone, toZone, traceFees);
      animating = false;
      inputEl.disabled = false;
      inputEl.focus();
      scrollIfAtBottom();
      return;
    }

    /* Phase 1: Type the command character by character */
    var cmdText = 'mass asset migrate SA-0x7a3f --from ' + fromId + ' --to ' + toId;
    var promptLine = addLine('<span class="t-accent">$</span> ');
    var typedSpan = document.createElement('span');
    promptLine.appendChild(typedSpan);
    var cursor = document.createElement('span');
    cursor.className = 't-accent';
    cursor.textContent = '\u2588';
    promptLine.appendChild(cursor);
    scrollIfAtBottom();

    var charIdx = 0;

    function typeChar() {
      if (myId !== animationId) { finish(); return; }
      if (charIdx < cmdText.length) {
        typedSpan.textContent += cmdText[charIdx];
        charIdx++;
        scrollIfAtBottom();
        setTimeout(typeChar, 28 + Math.random() * 28);
      } else {
        cursor.remove();
        /* Re-render with styled spans */
        promptLine.innerHTML = '<span class="t-accent">$</span> mass asset migrate <span class="t-value">SA-0x7a3f</span> <span class="t-dim">--from</span> <span class="t-string">' + escHtml(fromId) + '</span> <span class="t-dim">--to</span> <span class="t-string">' + escHtml(toId) + '</span>';
        setTimeout(function () {
          if (myId !== animationId) { finish(); return; }
          phaseProcessing();
        }, 380);
      }
    }

    /* Phase 2: Processing header */
    function phaseProcessing() {
      addLine('');
      addLine('<span class="t-dim">[compliance]</span> Evaluating 23 domains across 2 jurisdictions...');
      addLine('');
      scrollIfAtBottom();
      setTimeout(function () {
        if (myId !== animationId) { finish(); return; }
        phaseCompliance(0);
      }, 380);
    }

    /* Phase 3: Compliance cascade */
    function phaseCompliance(idx) {
      if (myId !== animationId) { finish(); return; }
      if (idx >= TRACE_DOMAINS.length) {
        setTimeout(function () {
          if (myId !== animationId) { finish(); return; }
          phaseSettlement();
        }, 200);
        return;
      }

      var d = TRACE_DOMAINS[idx];
      var tree = (idx === TRACE_DOMAINS.length - 1) ? '\u2514\u2500' : '\u251C\u2500';
      var padName = padRight(d.name, 14);

      var lineEl = addLine('  <span class="t-tree">' + tree + '</span> <span class="t-domain">' + padName + '</span><span class="t-dim">' + padRight(d.source, 32) + '</span> <span class="t-dim">\u2192</span> <span class="t-dim">' + escHtml(d.target) + '</span>');
      scrollIfAtBottom();

      setTimeout(function () {
        if (myId !== animationId) { finish(); return; }
        var check = document.createElement('span');
        check.className = 't-success';
        check.style.opacity = '0';
        check.style.transition = 'opacity 60ms cubic-bezier(0.25, 0.1, 0.25, 1)';
        check.textContent = ' \u2713';
        lineEl.appendChild(check);
        check.offsetWidth; /* force reflow */
        check.style.opacity = '1';

        setTimeout(function () {
          phaseCompliance(idx + 1);
        }, 80);
      }, 50);
    }

    /* Phase 4: Settlement */
    function phaseSettlement() {
      if (myId !== animationId) { finish(); return; }

      addLine('');
      addLine('<span class="t-success">\u2713</span> <span class="t-dim">Corridor receipt:</span>  <span class="t-string">0x' + randomHex(12) + '...</span>');
      addLine('<span class="t-success">\u2713</span> <span class="t-dim">Exit attestation:</span> <span class="t-value">' + escHtml(fromId) + '</span>   <span class="t-dim">signed by 3 watchers</span>');
      addLine('<span class="t-success">\u2713</span> <span class="t-dim">Entry attestation:</span> <span class="t-value">' + escHtml(toId) + '</span>    <span class="t-dim">signed by 3 watchers</span>');
      addLine('<span class="t-success">\u2713</span> <span class="t-dim">Domicile updated:</span> <span class="t-value">' + escHtml(fromId) + '</span> \u2192 <span class="t-value">' + escHtml(toId) + '</span>');
      scrollIfAtBottom();

      setTimeout(function () {
        if (myId !== animationId) { finish(); return; }
        phaseReceipts();
      }, 300);
    }

    /* Phase 4.5: Receipt chain */
    function phaseReceipts() {
      if (myId !== animationId) { finish(); return; }
      var roots = ['0'.repeat(16)];
      for (var r = 0; r < 3; r++) roots.push(randomHex(16));
      addLine('');
      addLine('  <span class="t-label">RECEIPT CHAIN</span>');
      for (var r2 = 0; r2 < 3; r2++) {
        var tree = (r2 === 2) ? '\u2514\u2500' : '\u251C\u2500';
        addLine('  <span class="t-tree">' + tree + '</span> <span class="t-dim">#' + r2 + '</span>  <span class="t-dim">0x</span><span class="t-string">' + truncHash(roots[r2]) + '</span> <span class="t-dim">\u2192 0x</span><span class="t-string">' + truncHash(roots[r2 + 1]) + '</span>');
      }
      scrollIfAtBottom();

      setTimeout(function () {
        if (myId !== animationId) { finish(); return; }
        phaseSummary();
      }, 200);
    }

    /* Phase 5: Summary + fees */
    function phaseSummary() {
      if (myId !== animationId) { finish(); return; }

      addLine('');
      addLine('  <span class="t-value">4.2s elapsed</span> \u00b7 <span class="t-value">20/23 domains</span> \u00b7 <span class="t-value">0 intermediaries</span>');
      addLine('');

      var total = 0;
      for (var i = 0; i < traceFees.length; i++) {
        var fee = traceFees[i];
        var tree = (i === traceFees.length - 1) ? '\u2514\u2500' : '\u251C\u2500';
        addLine('  <span class="t-tree">' + tree + '</span> ' + padRight(fee.label, 32) + ' <span class="t-value">$' + fee.amount.toLocaleString() + '</span>');
        total += fee.amount;
      }

      addLine('');
      addLine('  Total fees: <span class="t-value">$' + total.toLocaleString() + '</span> <span class="t-dim">(on $1M notional)</span>');
      addLine('');
      scrollIfAtBottom();
      finish();
    }

    function finish() {
      animating = false;
      inputEl.disabled = false;
      inputEl.focus();
    }

    typeChar();
  }

  /* Instant trace render for reduced motion */
  function renderTraceInstant(fromZone, toZone, traceFees) {
    var fromId = fromZone.id;
    var toId = toZone.id;

    addLine('<span class="t-accent">$</span> mass asset migrate <span class="t-value">SA-0x7a3f</span> <span class="t-dim">--from</span> <span class="t-string">' + escHtml(fromId) + '</span> <span class="t-dim">--to</span> <span class="t-string">' + escHtml(toId) + '</span>');
    addLine('');
    addLine('<span class="t-dim">[compliance]</span> Evaluating 23 domains across 2 jurisdictions...');
    addLine('');

    for (var i = 0; i < TRACE_DOMAINS.length; i++) {
      var d = TRACE_DOMAINS[i];
      var tree = (i === TRACE_DOMAINS.length - 1) ? '\u2514\u2500' : '\u251C\u2500';
      var padName = padRight(d.name, 14);
      addLine('  <span class="t-tree">' + tree + '</span> <span class="t-domain">' + padName + '</span><span class="t-dim">' + padRight(d.source, 32) + '</span> <span class="t-dim">\u2192</span> <span class="t-dim">' + escHtml(d.target) + '</span> <span class="t-success">\u2713</span>');
    }

    addLine('');
    addLine('<span class="t-success">\u2713</span> <span class="t-dim">Corridor receipt:</span>  <span class="t-string">0x' + randomHex(12) + '...</span>');
    addLine('<span class="t-success">\u2713</span> <span class="t-dim">Exit attestation:</span> <span class="t-value">' + escHtml(fromId) + '</span>   <span class="t-dim">signed by 3 watchers</span>');
    addLine('<span class="t-success">\u2713</span> <span class="t-dim">Entry attestation:</span> <span class="t-value">' + escHtml(toId) + '</span>    <span class="t-dim">signed by 3 watchers</span>');
    addLine('<span class="t-success">\u2713</span> <span class="t-dim">Domicile updated:</span> <span class="t-value">' + escHtml(fromId) + '</span> \u2192 <span class="t-value">' + escHtml(toId) + '</span>');

    /* Receipt chain */
    var roots = ['0'.repeat(16)];
    for (var r = 0; r < 3; r++) roots.push(randomHex(16));
    addLine('');
    addLine('  <span class="t-label">RECEIPT CHAIN</span>');
    for (var r2 = 0; r2 < 3; r2++) {
      var rtree = (r2 === 2) ? '\u2514\u2500' : '\u251C\u2500';
      addLine('  <span class="t-tree">' + rtree + '</span> <span class="t-dim">#' + r2 + '</span>  <span class="t-dim">0x</span><span class="t-string">' + truncHash(roots[r2]) + '</span> <span class="t-dim">\u2192 0x</span><span class="t-string">' + truncHash(roots[r2 + 1]) + '</span>');
    }

    addLine('');
    addLine('  <span class="t-value">4.2s elapsed</span> \u00b7 <span class="t-value">20/23 domains</span> \u00b7 <span class="t-value">0 intermediaries</span>');
    addLine('');

    var total = 0;
    for (var j = 0; j < traceFees.length; j++) {
      var fee = traceFees[j];
      var tr = (j === traceFees.length - 1) ? '\u2514\u2500' : '\u251C\u2500';
      addLine('  <span class="t-tree">' + tr + '</span> ' + padRight(fee.label, 32) + ' <span class="t-value">$' + fee.amount.toLocaleString() + '</span>');
      total += fee.amount;
    }

    addLine('');
    addLine('  Total fees: <span class="t-value">$' + total.toLocaleString() + '</span> <span class="t-dim">(on $1M notional)</span>');
    addLine('');
  }

  function randomHex(len) {
    var hex = '';
    for (var i = 0; i < len; i++) {
      hex += '0123456789abcdef'[Math.floor(Math.random() * 16)];
    }
    return hex;
  }

  function truncHash(hex) {
    if (hex.length <= 8) return hex;
    return hex.slice(0, 4) + '...' + hex.slice(-4);
  }

  function formatTime(secs) {
    if (secs < 3600) return Math.round(secs / 60) + ' min';
    var h = Math.round(secs / 3600);
    return h + (h === 1 ? ' hour' : ' hours');
  }

  function corridorTypeLabel(type) {
    if (type === 'cross-border') return 'Cross-border';
    if (type === 'fz-to-host') return 'FZ \u2192 Host';
    if (type === 'fz-to-fz') return 'FZ \u2192 FZ';
    if (type === 'federal') return 'Federal';
    if (type === 'federal-mesh') return 'Federal Mesh';
    return type;
  }

  function zoneDomains(zone) {
    if (zone.compliance_domains) return zone.compliance_domains;
    var base = [];
    for (var i = 0; i < COMPLIANCE_DOMAINS.length; i++) {
      if (COMPLIANCE_DOMAINS[i].base) base.push(COMPLIANCE_DOMAINS[i].id);
    }
    return base;
  }

  function hasDomain(zone, domainId) {
    return zoneDomains(zone).indexOf(domainId) !== -1;
  }

  /* ── Dijkstra routing ── */
  function findRoute(fromId, toId) {
    var adj = {};
    for (var i = 0; i < CORRIDOR_GRAPH.length; i++) {
      var e = CORRIDOR_GRAPH[i];
      if (!adj[e.from]) adj[e.from] = [];
      if (!adj[e.to]) adj[e.to] = [];
      adj[e.from].push({ to: e.to, type: e.type, fee_bps: e.fee_bps, settlement_secs: e.settlement_secs });
      adj[e.to].push({ to: e.from, type: e.type, fee_bps: e.fee_bps, settlement_secs: e.settlement_secs });
    }
    var dist = {};
    var prev = {};
    var prevEdge = {};
    var visited = {};
    dist[fromId] = 0;
    while (true) {
      var minNode = null;
      var minDist = Infinity;
      for (var node in dist) {
        if (!visited[node] && dist[node] < minDist) {
          minDist = dist[node];
          minNode = node;
        }
      }
      if (minNode === null || minNode === toId) break;
      visited[minNode] = true;
      var neighbors = adj[minNode] || [];
      for (var j = 0; j < neighbors.length; j++) {
        var n = neighbors[j];
        var nd = dist[minNode] + n.fee_bps;
        if (dist[n.to] === undefined || nd < dist[n.to]) {
          dist[n.to] = nd;
          prev[n.to] = minNode;
          prevEdge[n.to] = n;
        }
      }
    }
    if (dist[toId] === undefined) return null;
    var hops = [];
    var current = toId;
    while (current !== fromId) {
      var p = prev[current];
      hops.unshift({ from: p, to: current, type: prevEdge[current].type, fee_bps: prevEdge[current].fee_bps, settlement_secs: prevEdge[current].settlement_secs });
      current = p;
    }
    var totalFee = 0;
    var totalTime = 0;
    for (var k = 0; k < hops.length; k++) {
      totalFee += hops[k].fee_bps;
      totalTime += hops[k].settlement_secs;
    }
    return { hops: hops, total_fee_bps: totalFee, total_settlement_secs: totalTime };
  }

  /* ── primitives ── */
  function cmdPrimitives() {
    addLine('');
    addLine('<span class="t-accent">FIVE PROGRAMMABLE PRIMITIVES</span>');
    addLine('<span class="t-dim">Programmable legal-entity primitives as system calls. Every zone exposes these five.</span>');
    addLine('');

    for (var i = 0; i < PRIMITIVES.length; i++) {
      var p = PRIMITIVES[i];
      var tree = (i === PRIMITIVES.length - 1) ? '\u2514\u2500' : '\u251C\u2500';
      addLine('  <span class="t-tree">' + tree + '</span> <span class="t-accent">' + escHtml(p.name) + '</span>  <span class="t-string">' + escHtml(p.syscall) + '</span>');
      addLine('     <span class="t-dim">' + escHtml(p.desc) + '</span>');
      if (i < PRIMITIVES.length - 1) addLine('');
    }

    addLine('');
    addLine('  <span class="t-dim">Zones are hardware nodes. Stack is the kernel. Corridors are the bus.</span>');
    addLine('  <span class="t-dim">Smart Assets are processes. Primitives are system calls.</span>');
    addLine('');
  }

  /* ── deploy --estimate ── */
  function cmdDeploy(args) {
    addLine('');
    addLine('<span class="t-accent">DEPLOYMENT ECONOMICS</span>');
    addLine('');

    addLine('  <span class="t-label">EZ STACK DEPLOYMENT</span>');
    addLine('');
    addLine('  <span class="t-tree">\u251C\u2500</span> Timeline           <span class="t-success">90 days</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Cost               <span class="t-success">&lt;$10M</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Modules            <span class="t-value">338 across 25 families</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Compliance domains <span class="t-value">20</span>');
    addLine('  <span class="t-tree">\u2514\u2500</span> Primitives         <span class="t-value">5</span>');
    addLine('');
    addLine('  <span class="t-label">INCLUDED</span>');
    addLine('');
    addLine('  <span class="t-tree">\u251C\u2500</span> Entity formation + registry');
    addLine('  <span class="t-tree">\u251C\u2500</span> Licensing + compliance engine');
    addLine('  <span class="t-tree">\u251C\u2500</span> Banking + payment rails');
    addLine('  <span class="t-tree">\u251C\u2500</span> Identity + KYC/KYB pipeline');
    addLine('  <span class="t-tree">\u251C\u2500</span> Corridor infrastructure');
    addLine('  <span class="t-tree">\u251C\u2500</span> Smart Asset runtime');
    addLine('  <span class="t-tree">\u2514\u2500</span> Watcher network + arbitration');
    addLine('');

    addLine('  <span class="t-label">VS TRADITIONAL</span>');
    addLine('');
    addLine('  <span class="t-tree">\u251C\u2500</span> Traditional timeline  <span class="t-error">18-24 months</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Traditional cost      <span class="t-error">$50-100M</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Integration risk      <span class="t-error">Multi-vendor, no interop</span>');
    addLine('  <span class="t-tree">\u2514\u2500</span> Corridor connectivity <span class="t-error">None (siloed)</span>');
    addLine('');
    addLine('  <span class="t-dim">EZ Stack: single vendor, pre-integrated, corridor-native from day one.</span>');
    addLine('');
  }

  /* ── operation — lawpack browser ── */
  function cmdOperation(args) {
    var opNames = Object.keys(OPERATIONS);
    var trimmed = args.trim();

    /* No args: list all operations */
    if (!trimmed) {
      addLine('');
      addLine('<span class="t-accent">OPERATION LAWPACKS</span>  <span class="t-dim">34 types across 10 families (34 browsable)</span>');
      addLine('<span class="t-dim">Lawpack-driven step DAGs</span>');
      addLine('');
      for (var o = 0; o < opNames.length; o++) {
        var op = OPERATIONS[opNames[o]];
        var jKeys = Object.keys(op.jurisdictions);
        var tree = o < opNames.length - 1 ? '\u251C\u2500' : '\u2514\u2500';
        addLine('  <span class="t-tree">' + tree + '</span> <span class="t-accent">' + padRight(opNames[o], 26) + '</span> <span class="t-dim">' + jKeys.length + ' variants</span>  ' + op.desc);
      }
      addLine('');
      addLine('<span class="t-dim">Usage: operation &lt;type&gt; --jurisdiction &lt;id&gt;</span>');
      addLine('');
      return;
    }

    /* Parse: operation entity.incorporate --compare us-de sg hk */
    var compareMatch = trimmed.match(/--compare\s+([\s\S]+)/);
    if (compareMatch) {
      var cParts = trimmed.replace(/--compare\s+[\s\S]+/, '').trim();
      var cJurisdictions = compareMatch[1].trim().split(/\s+/);
      if (cParts && cJurisdictions.length >= 2) {
        cmdOperationCompare(cParts, cJurisdictions.slice(0, 3));
        return;
      }
      addLine('<span class="t-dim">Usage: operation &lt;type&gt; --compare &lt;j1&gt; &lt;j2&gt; [j3]</span>');
      addLine('<span class="t-dim">Example: operation entity.incorporate --compare us-de sg hk</span>');
      return;
    }

    /* Parse: operation entity.incorporate --jurisdiction us-de */
    var jMatch = trimmed.match(/--jurisdiction\s+(\S+)/);
    var opType = trimmed.replace(/--jurisdiction\s+\S+/, '').trim();
    if (!opType && jMatch) { addLine('<span class="t-dim">Specify operation type. Try: operation</span>'); return; }

    var op = OPERATIONS[opType];
    if (!op) {
      addLine('');
      addLine('<span class="t-dim">Unknown operation: ' + escHtml(opType) + '</span>');
      addLine('<span class="t-dim">Available: ' + opNames.join(', ') + '</span>');
      addLine('');
      return;
    }

    var jKeys = Object.keys(op.jurisdictions);

    /* No jurisdiction: show summary of all variants */
    if (!jMatch) {
      addLine('');
      addLine('<span class="t-accent">OPERATION</span>  ' + opType);
      addLine('<span class="t-dim">' + op.desc + '</span>');
      addLine('');
      addLine('  <span class="t-label">JURISDICTION VARIANTS</span>');
      addLine('');
      for (var j = 0; j < jKeys.length; j++) {
        var jv = op.jurisdictions[jKeys[j]];
        var tree2 = j < jKeys.length - 1 ? '\u251C\u2500' : '\u2514\u2500';
        var stepInfo = jv.steps ? jv.steps.length + ' steps' : jv.steps_count + ' steps';
        var feeInfo = jv.fees ? jv.fees.map(function(f) { return f.amount; }).join(' + ') : (jv.fee || '');
        addLine('  <span class="t-tree">' + tree2 + '</span> ' + padRight(jKeys[j], 22) + '<span class="t-value">' + padRight(jv.name, 18) + '</span> ' + padRight(stepInfo, 10) + ' <span class="t-dim">' + jv.legal_basis + '</span>' + (feeInfo ? '  ' + feeInfo : ''));
      }
      addLine('');
      addLine('<span class="t-dim">Inspect: operation ' + opType + ' --jurisdiction ' + jKeys[0] + '</span>');
      addLine('');
      return;
    }

    /* Specific jurisdiction: show full step DAG */
    var jId = jMatch[1];
    var jv = op.jurisdictions[jId];
    /* Fuzzy resolve: try matching zone id or name against jurisdiction keys */
    if (!jv) {
      var q = jId.toLowerCase().replace(/[^a-z0-9]/g, '');
      for (var rk = 0; rk < jKeys.length; rk++) {
        var rKey = jKeys[rk];
        if (rKey.indexOf(q) !== -1 || q.indexOf(rKey.replace(/[^a-z0-9]/g, '')) === 0) { jv = op.jurisdictions[rKey]; jId = rKey; break; }
        var rName = op.jurisdictions[rKey].name.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (rName.indexOf(q) === 0 || q.indexOf(rName) === 0) { jv = op.jurisdictions[rKey]; jId = rKey; break; }
      }
    }
    if (!jv) {
      addLine('');
      addLine('<span class="t-dim">No lawpack for ' + escHtml(jId) + '. Available: ' + jKeys.join(', ') + '</span>');
      addLine('');
      return;
    }

    addLine('');
    addLine('<span class="t-accent">OPERATION</span>      ' + opType);
    addLine('<span class="t-accent">JURISDICTION</span>   ' + jId + ' (' + jv.name + ')');
    addLine('<span class="t-accent">LEGAL BASIS</span>    ' + jv.legal_basis);
    addLine('');

    /* Params */
    if (jv.params && jv.params.length > 0) {
      addLine('  <span class="t-label">PARAMS</span>');
      for (var p = 0; p < jv.params.length; p++) {
        var param = jv.params[p];
        var tree3 = p < jv.params.length - 1 ? '\u251C\u2500' : '\u2514\u2500';
        var valStr = param.values ? '[' + param.values.join(', ') + ']' : (param.note || '');
        addLine('  <span class="t-tree">' + tree3 + '</span> ' + padRight(param.name, 22) + padRight(param.type, 10) + (param.required ? '<span class="t-value">required</span>' : '<span class="t-dim">optional</span>') + (valStr ? '    <span class="t-dim">' + valStr + '</span>' : ''));
      }
      addLine('');
    }

    /* Steps */
    if (jv.steps) {
      addLine('  <span class="t-label">STEPS (' + jv.steps.length + ')</span>                                  <span class="t-label">COMPLIANCE DOMAINS</span>');
      for (var s = 0; s < jv.steps.length; s++) {
        var step = jv.steps[s];
        var tree4 = s === 0 ? '\u250C\u2500' : (s < jv.steps.length - 1 ? '\u251C\u2500' : '\u2514\u2500');
        var deps = step.depends.length > 0 ? ' \u2190 ' + step.depends.join(', ') : '';
        var domains = '[' + step.domains.join(', ') + ']';
        addLine('  <span class="t-tree">' + tree4 + '</span> ' + padRight(step.id, 20) + '<span class="t-dim">' + padRight(step.type, 36) + '</span><span class="t-dim">' + deps + '</span>');
        addLine('     ' + padRight('', 20) + padRight('', 36) + '<span class="t-value">' + domains + '</span>');
      }
      addLine('');
    } else if (jv.steps_count) {
      addLine('  <span class="t-label">STEPS</span>  <span class="t-value">' + jv.steps_count + '</span>');
      addLine('');
    }

    /* Fees */
    if (jv.fees && jv.fees.length > 0) {
      addLine('  <span class="t-label">FEES</span>');
      for (var f = 0; f < jv.fees.length; f++) {
        var fee = jv.fees[f];
        var tree5 = f < jv.fees.length - 1 ? '\u251C\u2500' : '\u2514\u2500';
        addLine('  <span class="t-tree">' + tree5 + '</span> <span class="t-value">' + padRight(fee.amount, 14) + '</span> <span class="t-dim">' + fee.authority + ' \u2014 ' + fee.desc + '</span>');
      }
      addLine('');
    }

    /* Services */
    if (jv.steps) {
      var svcs = {};
      for (var ss = 0; ss < jv.steps.length; ss++) { svcs[jv.steps[ss].svc] = true; }
      addLine('  <span class="t-label">SERVICES</span>  <span class="t-dim">' + Object.keys(svcs).join(', ') + '</span>');
    }
    addLine('');
  }

  /* ── operation --compare: side-by-side jurisdiction comparison ── */
  function cmdOperationCompare(opType, jurisdictions) {
    var op = OPERATIONS[opType];
    if (!op) {
      addLine('<span class="t-dim">Unknown operation: ' + escHtml(opType) + '</span>');
      return;
    }

    var jvs = [];
    var cmpKeys = Object.keys(op.jurisdictions);
    for (var j = 0; j < jurisdictions.length; j++) {
      var jv = op.jurisdictions[jurisdictions[j]];
      var resolvedId = jurisdictions[j];
      /* Fuzzy resolve */
      if (!jv) {
        var cq = jurisdictions[j].toLowerCase().replace(/[^a-z0-9]/g, '');
        for (var ck = 0; ck < cmpKeys.length; ck++) {
          if (cmpKeys[ck].indexOf(cq) !== -1 || cq.indexOf(cmpKeys[ck].replace(/[^a-z0-9]/g, '')) === 0) { jv = op.jurisdictions[cmpKeys[ck]]; resolvedId = cmpKeys[ck]; break; }
          var cn = op.jurisdictions[cmpKeys[ck]].name.toLowerCase().replace(/[^a-z0-9]/g, '');
          if (cn.indexOf(cq) === 0 || cq.indexOf(cn) === 0) { jv = op.jurisdictions[cmpKeys[ck]]; resolvedId = cmpKeys[ck]; break; }
        }
      }
      if (!jv) {
        addLine('<span class="t-dim">No lawpack for ' + escHtml(jurisdictions[j]) + ' in ' + opType + '</span>');
        return;
      }
      jvs.push({ id: resolvedId, data: jv });
    }

    var col = 24;
    addLine('');
    addLine('<span class="t-accent">COMPARE</span>  ' + opType);
    addLine('');

    /* Header */
    var hdr = '  ' + padRight('', 20);
    for (var h = 0; h < jvs.length; h++) hdr += '<span class="t-value">' + padRight(jvs[h].data.name, col) + '</span>';
    addLine(hdr);
    addLine('  <span class="t-dim">' + '\u2500'.repeat(20 + col * jvs.length) + '</span>');

    /* Jurisdiction ID */
    var row1 = '  ' + padRight('Jurisdiction', 20);
    for (var r1 = 0; r1 < jvs.length; r1++) row1 += padRight(jvs[r1].id, col);
    addLine(row1);

    /* Legal basis */
    var row2 = '  ' + padRight('Legal basis', 20);
    for (var r2 = 0; r2 < jvs.length; r2++) row2 += '<span class="t-dim">' + padRight(jvs[r2].data.legal_basis.substring(0, col - 2), col) + '</span>';
    addLine(row2);

    /* Steps */
    var row3 = '  ' + padRight('Steps', 20);
    for (var r3 = 0; r3 < jvs.length; r3++) {
      var sc = jvs[r3].data.steps ? jvs[r3].data.steps.length : jvs[r3].data.steps_count;
      row3 += '<span class="t-value">' + padRight(sc + ' steps', col) + '</span>';
    }
    addLine(row3);

    /* Fees */
    var row4 = '  ' + padRight('Fees', 20);
    for (var r4 = 0; r4 < jvs.length; r4++) {
      var feeStr = '\u2014';
      if (jvs[r4].data.fees) feeStr = jvs[r4].data.fees.map(function(f) { return f.amount; }).join(' + ');
      else if (jvs[r4].data.fee) feeStr = jvs[r4].data.fee;
      row4 += padRight(feeStr.substring(0, col - 2), col);
    }
    addLine(row4);

    /* Entity types (if params include entity_type) */
    var hasTypes = false;
    for (var ct = 0; ct < jvs.length; ct++) {
      if (jvs[ct].data.params) {
        for (var cp = 0; cp < jvs[ct].data.params.length; cp++) {
          if (jvs[ct].data.params[cp].name === 'entity_type') { hasTypes = true; break; }
        }
      }
    }
    if (hasTypes) {
      var row5 = '  ' + padRight('Entity types', 20);
      for (var r5 = 0; r5 < jvs.length; r5++) {
        var types = '\u2014';
        if (jvs[r5].data.params) {
          for (var tp = 0; tp < jvs[r5].data.params.length; tp++) {
            if (jvs[r5].data.params[tp].name === 'entity_type' && jvs[r5].data.params[tp].values) {
              types = jvs[r5].data.params[tp].values.length + ' types';
            }
          }
        }
        row5 += padRight(types, col);
      }
      addLine(row5);
    }

    /* Services */
    var row6 = '  ' + padRight('Services', 20);
    for (var r6 = 0; r6 < jvs.length; r6++) {
      var svcs = '\u2014';
      if (jvs[r6].data.steps) {
        var svcSet = {};
        for (var sv = 0; sv < jvs[r6].data.steps.length; sv++) svcSet[jvs[r6].data.steps[sv].svc] = true;
        svcs = Object.keys(svcSet).length + ' services';
      }
      row6 += padRight(svcs, col);
    }
    addLine(row6);

    /* Compliance domain coverage */
    addLine('');
    addLine('  <span class="t-label">COMPLIANCE DOMAINS</span>');
    addLine('');

    if (jvs[0].data.steps) {
      var allDomains = {};
      for (var ad = 0; ad < jvs.length; ad++) {
        if (jvs[ad].data.steps) {
          for (var ds = 0; ds < jvs[ad].data.steps.length; ds++) {
            for (var dd = 0; dd < jvs[ad].data.steps[ds].domains.length; dd++) {
              allDomains[jvs[ad].data.steps[ds].domains[dd]] = true;
            }
          }
        }
      }
      var domList = Object.keys(allDomains).sort();
      for (var dl = 0; dl < domList.length; dl++) {
        var dTree = dl < domList.length - 1 ? '\u251C\u2500' : '\u2514\u2500';
        var dRow = '  <span class="t-tree">' + dTree + '</span> ' + padRight(domList[dl], 18);
        for (var dj = 0; dj < jvs.length; dj++) {
          var hasDom = false;
          if (jvs[dj].data.steps) {
            for (var dds = 0; dds < jvs[dj].data.steps.length; dds++) {
              if (jvs[dj].data.steps[dds].domains.indexOf(domList[dl]) !== -1) { hasDom = true; break; }
            }
          }
          dRow += padRight(hasDom ? '<span class="t-success">\u2713</span>' : '<span class="t-dim">\u2014</span>', col);
        }
        addLine(dRow);
      }
    }

    addLine('');
    addLine('<span class="t-dim">Inspect: operation ' + opType + ' --jurisdiction ' + jvs[0].id + '</span>');
    addLine('');
  }

  /* ── tax ── */
  function cmdTax(args) {
    var match = args.match(/--jurisdiction\s+(\S+)/);
    if (!match) {
      addLine('');
      addLine('<span class="t-accent">TAX WITHHOLDING RULES</span>');
      addLine('');
      addLine('  <span class="t-dim">Usage: tax --jurisdiction &lt;zone_id&gt;</span>');
      addLine('');
      addLine('  <span class="t-label">AVAILABLE JURISDICTIONS</span>');
      addLine('');
      var taxJurisdictions = Object.keys(TAX_RULES);
      for (var t = 0; t < taxJurisdictions.length; t++) {
        var jId = taxJurisdictions[t];
        var jZone = findZone(jId);
        var jName = jZone ? jZone.name : jId;
        var tree = (t === taxJurisdictions.length - 1) ? '\u2514\u2500' : '\u251C\u2500';
        addLine('  <span class="t-tree">' + tree + '</span> <span class="t-value">' + escHtml(jId) + '</span>  ' + escHtml(jName) + '  <span class="t-dim">(' + TAX_RULES[jId].length + ' rules)</span>');
      }
      addLine('');
      addLine('  <span class="t-dim">Example: tax --jurisdiction pk</span>');
      addLine('');
      return;
    }

    var jur = match[1].toLowerCase();
    var rules = TAX_RULES[jur];
    if (!rules) {
      addLine('<span class="t-error">No tax rules for jurisdiction: ' + escHtml(match[1]) + '</span>');
      addLine('<span class="t-dim">Try: tax (lists available jurisdictions)</span>');
      return;
    }

    var zone = findZone(jur);
    var zoneName = zone ? zone.name : jur;

    addLine('');
    addLine('<span class="t-accent">TAX WITHHOLDING RULES</span> <span class="t-dim">\u2014 ' + escHtml(zoneName) + '</span>');
    addLine('');

    addLine('  <span class="t-dim">' + padRight('Rule', 12) + padRight('Event', 26) + padRight('Filer', 10) + padRight('Non-filer', 12) + 'Section</span>');
    addLine('  <span class="t-dim">' + '\u2500'.repeat(78) + '</span>');

    for (var i = 0; i < rules.length; i++) {
      var r = rules[i];
      var tree = (i === rules.length - 1) ? '\u2514\u2500' : '\u251C\u2500';
      var filerStr, nonFilerStr;

      if (r.filer_rate !== undefined) {
        filerStr = '<span class="t-value">' + r.filer_rate.toFixed(1) + '%</span>';
        nonFilerStr = '<span class="t-error">' + r.non_filer_rate.toFixed(1) + '%</span>';
      } else {
        filerStr = '<span class="t-value">' + r.rate.toFixed(1) + '%</span>';
        nonFilerStr = '<span class="t-dim">\u2014</span>';
      }

      var finalTag = r.final ? ' <span class="t-dim">(final)</span>' : '';

      addLine('  <span class="t-tree">' + tree + '</span> '
        + padRight(r.rule_id, 10)
        + padRight(r.event, 26)
        + padRight(filerStr, 18)
        + padRight(nonFilerStr, 18)
        + '<span class="t-string">' + escHtml(r.section) + '</span>'
        + finalTag);
    }

    addLine('');
    addLine('  <span class="t-dim">Rates applied automatically by the fiscal primitive.</span>');
    addLine('  <span class="t-dim">Filer/non-filer status determined via FBR NTN (IRIS) adapter.</span>');
    addLine('');
  }

  /* ── compliance ── */
  function cmdCompliance() {
    addLine('');
    addLine('<span class="t-accent">COMPLIANCE DOMAINS</span> <span class="t-dim">(20)</span>');
    addLine('');
    addLine('  <span class="t-dim">Lattice: NotApplicable &gt; Exempt &gt; Compliant &gt; Pending &gt; NonCompliant</span>');
    addLine('  <span class="t-dim">Evaluation is fail-closed: base domains block on NonCompliant.</span>');
    addLine('');
    addLine('  <span class="t-label">BASE (8, mandatory, fail-closed)</span>');
    addLine('');

    for (var i = 0; i < COMPLIANCE_DOMAINS.length; i++) {
      var d = COMPLIANCE_DOMAINS[i];
      if (i === 8) {
        addLine('');
        addLine('  <span class="t-label">EXTENDED (12)</span>');
        addLine('');
      }
      var tree = (i === 7 || i === COMPLIANCE_DOMAINS.length - 1) ? '\u2514\u2500' : '\u251C\u2500';
      addLine('  <span class="t-tree">' + tree + '</span> <span class="t-accent">' + padRight(d.name, 18) + '</span><span class="t-dim">' + escHtml(d.desc) + '</span>');
    }

    addLine('');
  }

  /* ── modules ── */
  function cmdModules(args) {
    var familyFlag = args.match(/--family\s+(\S+)/);

    if (familyFlag) {
      var famId = familyFlag[1].toLowerCase();
      var fam = null;
      for (var f = 0; f < MODULE_FAMILIES.length; f++) {
        if (MODULE_FAMILIES[f].id === famId) { fam = MODULE_FAMILIES[f]; break; }
      }
      if (!fam) {
        addLine('<span class="t-error">Family not found: ' + escHtml(familyFlag[1]) + '</span>');
        addLine('<span class="t-dim">Try: modules</span>');
        return;
      }

      var mods = [];
      for (var m = 0; m < MODULES.length; m++) {
        if (MODULES[m].family === famId) mods.push(MODULES[m]);
      }

      addLine('');
      addLine('<span class="t-accent">' + escHtml(fam.name) + '</span> <span class="t-dim">(' + fam.count + ' modules, showing ' + mods.length + ')</span>');
      addLine('<span class="t-dim">' + escHtml(fam.desc) + '</span>');
      addLine('');

      for (var k = 0; k < mods.length; k++) {
        var mod = mods[k];
        var tree = (k === mods.length - 1) ? '\u2514\u2500' : '\u251C\u2500';
        addLine('  <span class="t-tree">' + tree + '</span> ' + padRight(escHtml(mod.id), 22) + '<span class="t-accent">' + padRight(escHtml(mod.name), 28) + '</span><span class="t-dim">v' + escHtml(mod.version) + '</span>');
      }
      addLine('');
      return;
    }

    /* Default: show families summary */
    var totalMods = 0;
    for (var t = 0; t < MODULE_FAMILIES.length; t++) totalMods += MODULE_FAMILIES[t].count;

    addLine('');
    addLine('<span class="t-accent">MODULE CATALOG</span> <span class="t-dim">(338 manifests across 25 families \u2014 ' + totalMods + ' browsable)</span>');
    addLine('');

    for (var j = 0; j < MODULE_FAMILIES.length; j++) {
      var fm = MODULE_FAMILIES[j];
      var tr = (j === MODULE_FAMILIES.length - 1) ? '\u2514\u2500' : '\u251C\u2500';
      addLine('  <span class="t-tree">' + tr + '</span> ' + padRight(escHtml(fm.name), 18) + '<span class="t-value">' + padRight(fm.count + ' modules', 12) + '</span><span class="t-dim">' + escHtml(fm.desc) + '</span>');
    }

    addLine('');
    addLine('  <span class="t-dim">Use: modules --family &lt;name&gt;</span>');
    addLine('');
  }

  /* ── route ── */
  function cmdRoute(args) {
    var parts = args.replace(/^route\s*/i, '').trim().split(/\s+/);
    if (parts.length < 2 || !parts[0] || !parts[1]) {
      addLine('<span class="t-error">Usage: route &lt;from&gt; &lt;to&gt;</span>');
      addLine('<span class="t-dim">Example: route pk sg</span>');
      return;
    }

    var fromZone = findZone(parts[0]);
    var toZone = findZone(parts[1]);
    if (!fromZone) { addLine('<span class="t-error">Zone not found: ' + escHtml(parts[0]) + '</span>'); return; }
    if (!toZone) { addLine('<span class="t-error">Zone not found: ' + escHtml(parts[1]) + '</span>'); return; }
    if (fromZone.id === toZone.id) { addLine('<span class="t-error">Source and target must differ.</span>'); return; }

    var result = findRoute(fromZone.id, toZone.id);

    addLine('');
    addLine('<span class="t-accent">ROUTE</span> <span class="t-value">' + escHtml(fromZone.name) + '</span> <span class="t-dim">\u2192</span> <span class="t-value">' + escHtml(toZone.name) + '</span>');
    addLine('');

    if (!result) {
      addLine('  <span class="t-dim">No corridor path found between these zones.</span>');
      addLine('  <span class="t-dim">A direct corridor would need to be established.</span>');
      addLine('');
      return;
    }

    addLine('  <span class="t-label">PATH (' + result.hops.length + (result.hops.length === 1 ? ' hop' : ' hops') + ')</span>');
    addLine('');

    for (var i = 0; i < result.hops.length; i++) {
      var h = result.hops[i];
      var tree = (i === result.hops.length - 1) ? '\u2514\u2500' : '\u251C\u2500';
      addLine('  <span class="t-tree">' + tree + '</span> <span class="t-value">' + escHtml(h.from) + '</span> <span class="t-dim">\u2192</span> <span class="t-value">' + escHtml(h.to) + '</span>  <span class="t-string">' + corridorTypeLabel(h.type) + '</span>  <span class="t-dim">' + h.fee_bps + ' bps \u00b7 ' + formatTime(h.settlement_secs) + '</span>');
    }

    var usdOnMillion = Math.round(result.total_fee_bps * 100);
    addLine('');
    addLine('  <span class="t-label">TOTALS</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Fee              <span class="t-value">' + result.total_fee_bps + ' bps</span> <span class="t-dim">($' + usdOnMillion.toLocaleString() + ' on $1M)</span>');
    addLine('  <span class="t-tree">\u2514\u2500</span> Settlement       <span class="t-value">' + formatTime(result.total_settlement_secs) + '</span>');
    addLine('');
  }

  /* ── entity incorporate ── */
  function cmdEntity(args) {
    var match = args.match(/--jurisdiction\s+(\S+)/);
    if (!match) {
      addLine('<span class="t-error">Usage: entity incorporate --jurisdiction &lt;zone_id&gt;</span>');
      addLine('');
      addLine('<span class="t-label">LIVE ZONES</span>');
      var liveZones = [];
      for (var lz = 0; lz < ZONES.length; lz++) {
        if (ZONES[lz].status === 'live') liveZones.push(ZONES[lz]);
      }
      for (var lzi = 0; lzi < liveZones.length; lzi++) {
        var lzTree = lzi < liveZones.length - 1 ? '\u251C\u2500' : '\u2514\u2500';
        addLine('  <span class="t-tree">' + lzTree + '</span> <span class="t-value">' + padRight(liveZones[lzi].id, 12) + '</span> <span class="t-dim">' + liveZones[lzi].name + '</span>');
      }
      addLine('');
      addLine('<span class="t-dim">Example: entity incorporate --jurisdiction adgm</span>');
      addLine('<span class="t-dim">         entity incorporate --jurisdiction sg</span>');
      addLine('<span class="t-dim">         entity incorporate --jurisdiction hk</span>');
      return;
    }

    var zone = findZone(match[1]);
    if (!zone) { addLine('<span class="t-error">Zone not found: ' + escHtml(match[1]) + '</span>'); return; }

    animating = true;
    inputEl.disabled = true;
    animationId++;
    var myId = animationId;
    var entityId = zone.id.toUpperCase() + '-ENT-0x' + randomHex(4);
    var vcDigest = randomHex(16);

    addLine('');

    if (reducedMotion) {
      renderEntityInstant(zone, entityId, vcDigest);
      animating = false;
      inputEl.disabled = false;
      inputEl.focus();
      scrollIfAtBottom();
      return;
    }

    /* Phase 1: Jurisdiction */
    addLine('<span class="t-dim">[entity]</span> Incorporating in <span class="t-value">' + escHtml(zone.name) + '</span>...');
    addLine('');
    addLine('  <span class="t-tree">\u251C\u2500</span> Zone       <span class="t-value">' + escHtml(zone.id) + '</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Framework  <span class="t-value">' + escHtml(zone.framework) + '</span>');
    addLine('  <span class="t-tree">\u2514\u2500</span> Status     ' + statusLabel(zone.status));
    scrollIfAtBottom();

    setTimeout(function () {
      if (myId !== animationId) { entityFinish(); return; }
      entityComplianceStart();
    }, 400);

    /* Phase 2: Compliance tensor */
    function entityComplianceStart() {
      addLine('');
      addLine('<span class="t-dim">[compliance]</span> Evaluating compliance tensor...');
      addLine('');
      entityComplianceDomain(0);
    }

    function entityComplianceDomain(idx) {
      if (myId !== animationId) { entityFinish(); return; }
      if (idx >= COMPLIANCE_DOMAINS.length) {
        scrollIfAtBottom();
        setTimeout(function () {
          if (myId !== animationId) { entityFinish(); return; }
          entityAdapters();
        }, 300);
        return;
      }
      var d = COMPLIANCE_DOMAINS[idx];
      var has = hasDomain(zone, d.id);
      var tree = (idx === COMPLIANCE_DOMAINS.length - 1) ? '\u2514\u2500' : '\u251C\u2500';
      var mark = has ? '<span class="t-success">\u2713</span>' : '<span class="t-dim">\u2014</span>';
      addLine('  <span class="t-tree">' + tree + '</span> ' + padRight(d.name, 18) + mark);
      scrollIfAtBottom();
      setTimeout(function () { entityComplianceDomain(idx + 1); }, 80);
    }

    /* Phase 2.5: National adapter verification */
    function entityAdapters() {
      var adapters = zone.adapters;
      if (!adapters || adapters.length === 0) {
        setTimeout(function () {
          if (myId !== animationId) { entityFinish(); return; }
          entityRegistration();
        }, 200);
        return;
      }
      addLine('');
      addLine('<span class="t-dim">[adapters]</span> National system verification');
      addLine('');
      entityAdapterLine(0);
    }

    function entityAdapterLine(idx) {
      if (myId !== animationId) { entityFinish(); return; }
      var adapters = zone.adapters;
      if (idx >= adapters.length) {
        scrollIfAtBottom();
        setTimeout(function () {
          if (myId !== animationId) { entityFinish(); return; }
          entityRegistration();
        }, 300);
        return;
      }
      var adapterName = adapters[idx];
      var detail = null;
      for (var a = 0; a < NATIONAL_ADAPTERS.length; a++) {
        if (NATIONAL_ADAPTERS[a].name === adapterName || adapterName.indexOf(NATIONAL_ADAPTERS[a].name) !== -1) {
          detail = NATIONAL_ADAPTERS[a]; break;
        }
      }
      var tree = (idx === adapters.length - 1) ? '\u2514\u2500' : '\u251C\u2500';
      if (detail) {
        addLine('  <span class="t-tree">' + tree + '</span> <span class="t-accent">' + escHtml(detail.name) + '</span>  <span class="t-dim">' + escHtml(detail.type) + '</span>  <span class="t-dim">(' + escHtml(detail.format) + ')</span>  <span class="t-success">\u2713 linked</span>');
      } else {
        addLine('  <span class="t-tree">' + tree + '</span> <span class="t-accent">' + escHtml(adapterName) + '</span>  <span class="t-success">\u2713 linked</span>');
      }
      scrollIfAtBottom();
      setTimeout(function () { entityAdapterLine(idx + 1); }, 200);
    }

    /* Phase 3: Registration */
    function entityRegistration() {
      addLine('');
      addLine('<span class="t-dim">[registry]</span> Entity registered');
      addLine('  <span class="t-tree">\u251C\u2500</span> Entity ID    <span class="t-value">' + entityId + '</span>');
      addLine('  <span class="t-tree">\u251C\u2500</span> Type         <span class="t-value">Limited Company</span>');
      addLine('  <span class="t-tree">\u2514\u2500</span> Lifecycle    <span class="t-success">ACTIVE</span>');
      scrollIfAtBottom();
      setTimeout(function () {
        if (myId !== animationId) { entityFinish(); return; }
        entityCapTable();
      }, 400);
    }

    /* Phase 4: Cap table */
    function entityCapTable() {
      addLine('');
      addLine('<span class="t-dim">[ownership]</span> Cap table initialized');
      addLine('  <span class="t-tree">\u251C\u2500</span> Shares       <span class="t-value">10,000 authorized</span>');
      addLine('  <span class="t-tree">\u251C\u2500</span> Class        <span class="t-value">Ordinary</span>');
      addLine('  <span class="t-tree">\u2514\u2500</span> Founder      <span class="t-value">100% vested</span>');
      scrollIfAtBottom();
      setTimeout(function () {
        if (myId !== animationId) { entityFinish(); return; }
        entityIdentity();
      }, 350);
    }

    /* Phase 5: Identity */
    function entityIdentity() {
      addLine('');
      addLine('<span class="t-dim">[identity]</span> KYB verification');
      addLine('  <span class="t-tree">\u251C\u2500</span> Director     <span class="t-success">Verified</span>');
      addLine('  <span class="t-tree">\u2514\u2500</span> UBO          <span class="t-success">Verified</span>');
      scrollIfAtBottom();
      setTimeout(function () {
        if (myId !== animationId) { entityFinish(); return; }
        entityConsent();
      }, 300);
    }

    /* Phase 6: Consent + VC */
    function entityConsent() {
      addLine('');
      addLine('<span class="t-dim">[consent]</span> Formation resolution signed');
      addLine('<span class="t-dim">[vc]</span> Verifiable Credential issued');
      addLine('  <span class="t-tree">\u2514\u2500</span> Digest       <span class="t-dim">sha256:0x</span><span class="t-string">' + truncHash(vcDigest) + '</span>');
      addLine('');
      addLine('<span class="t-success">\u2713</span> Entity <span class="t-value">' + entityId + '</span> incorporated in <span class="t-value">' + escHtml(zone.name) + '</span>');
      addLine('');
      scrollIfAtBottom();
      entityFinish();
    }

    function entityFinish() {
      animating = false;
      inputEl.disabled = false;
      inputEl.focus();
    }
  }

  function renderEntityInstant(zone, entityId, vcDigest) {
    addLine('<span class="t-dim">[entity]</span> Incorporating in <span class="t-value">' + escHtml(zone.name) + '</span>...');
    addLine('');
    addLine('  <span class="t-tree">\u251C\u2500</span> Zone       <span class="t-value">' + escHtml(zone.id) + '</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Framework  <span class="t-value">' + escHtml(zone.framework) + '</span>');
    addLine('  <span class="t-tree">\u2514\u2500</span> Status     ' + statusLabel(zone.status));
    addLine('');
    addLine('<span class="t-dim">[compliance]</span> Evaluating compliance tensor...');
    addLine('');
    for (var i = 0; i < COMPLIANCE_DOMAINS.length; i++) {
      var d = COMPLIANCE_DOMAINS[i];
      var has = hasDomain(zone, d.id);
      var tree = (i === COMPLIANCE_DOMAINS.length - 1) ? '\u2514\u2500' : '\u251C\u2500';
      var mark = has ? '<span class="t-success">\u2713</span>' : '<span class="t-dim">\u2014</span>';
      addLine('  <span class="t-tree">' + tree + '</span> ' + padRight(d.name, 18) + mark);
    }
    /* Adapters */
    if (zone.adapters && zone.adapters.length > 0) {
      addLine('');
      addLine('<span class="t-dim">[adapters]</span> National system verification');
      addLine('');
      for (var ai = 0; ai < zone.adapters.length; ai++) {
        var adapterName = zone.adapters[ai];
        var detail = null;
        for (var aj = 0; aj < NATIONAL_ADAPTERS.length; aj++) {
          if (NATIONAL_ADAPTERS[aj].name === adapterName || adapterName.indexOf(NATIONAL_ADAPTERS[aj].name) !== -1) {
            detail = NATIONAL_ADAPTERS[aj]; break;
          }
        }
        var atree = (ai === zone.adapters.length - 1) ? '\u2514\u2500' : '\u251C\u2500';
        if (detail) {
          addLine('  <span class="t-tree">' + atree + '</span> <span class="t-accent">' + escHtml(detail.name) + '</span>  <span class="t-dim">' + escHtml(detail.type) + '</span>  <span class="t-dim">(' + escHtml(detail.format) + ')</span>  <span class="t-success">\u2713 linked</span>');
        } else {
          addLine('  <span class="t-tree">' + atree + '</span> <span class="t-accent">' + escHtml(adapterName) + '</span>  <span class="t-success">\u2713 linked</span>');
        }
      }
    }
    addLine('');
    addLine('<span class="t-dim">[registry]</span> Entity registered');
    addLine('  <span class="t-tree">\u251C\u2500</span> Entity ID    <span class="t-value">' + entityId + '</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Type         <span class="t-value">Limited Company</span>');
    addLine('  <span class="t-tree">\u2514\u2500</span> Lifecycle    <span class="t-success">ACTIVE</span>');
    addLine('');
    addLine('<span class="t-dim">[ownership]</span> Cap table initialized');
    addLine('  <span class="t-tree">\u251C\u2500</span> Shares       <span class="t-value">10,000 authorized</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Class        <span class="t-value">Ordinary</span>');
    addLine('  <span class="t-tree">\u2514\u2500</span> Founder      <span class="t-value">100% vested</span>');
    addLine('');
    addLine('<span class="t-dim">[identity]</span> KYB verification');
    addLine('  <span class="t-tree">\u251C\u2500</span> Director     <span class="t-success">Verified</span>');
    addLine('  <span class="t-tree">\u2514\u2500</span> UBO          <span class="t-success">Verified</span>');
    addLine('');
    addLine('<span class="t-dim">[consent]</span> Formation resolution signed');
    addLine('<span class="t-dim">[vc]</span> Verifiable Credential issued');
    addLine('  <span class="t-tree">\u2514\u2500</span> Digest       <span class="t-dim">sha256:0x</span><span class="t-string">' + truncHash(vcDigest) + '</span>');
    addLine('');
    addLine('<span class="t-success">\u2713</span> Entity <span class="t-value">' + entityId + '</span> incorporated in <span class="t-value">' + escHtml(zone.name) + '</span>');
    addLine('');
  }

  /* ── settle ── */
  function cmdSettle(args) {
    var obligations = [
      { from: 'Alpha Corp (pk)', to: 'Beta Ltd (adgm)', amount: 2000000 },
      { from: 'Beta Ltd (adgm)', to: 'Gamma SA (sg)', amount: 1500000 },
      { from: 'Gamma SA (sg)', to: 'Alpha Corp (pk)', amount: 1000000 },
      { from: 'Alpha Corp (pk)', to: 'Delta Inc (gb)', amount: 500000 },
      { from: 'Delta Inc (gb)', to: 'Beta Ltd (adgm)', amount: 1500000 },
      { from: 'Gamma SA (sg)', to: 'Delta Inc (gb)', amount: 1000000 }
    ];
    /* Net: Alpha -1500, Beta +2000, Gamma -500, Delta 0 */
    /* Settlement: Alpha→Beta 1500, Gamma→Beta 500 = 2 legs */

    var grossTotal = 0;
    for (var g = 0; g < obligations.length; g++) grossTotal += obligations[g].amount;

    animating = true;
    inputEl.disabled = true;
    animationId++;
    var myId = animationId;

    addLine('');

    if (reducedMotion) {
      renderSettleInstant(obligations, grossTotal);
      animating = false;
      inputEl.disabled = false;
      inputEl.focus();
      scrollIfAtBottom();
      return;
    }

    /* Phase 1: Gross obligations */
    addLine('<span class="t-accent">SETTLEMENT ENGINE</span> <span class="t-dim">\u2014 Multilateral Netting</span>');
    addLine('');
    addLine('  <span class="t-label">GROSS OBLIGATIONS (6 legs)</span>');
    addLine('');
    for (var i = 0; i < obligations.length; i++) {
      var o = obligations[i];
      var tree = (i === obligations.length - 1) ? '\u2514\u2500' : '\u251C\u2500';
      addLine('  <span class="t-tree">' + tree + '</span> ' + padRight(escHtml(o.from), 22) + '<span class="t-dim">\u2192</span> ' + padRight(escHtml(o.to), 22) + '<span class="t-value">$' + o.amount.toLocaleString() + '</span>');
    }
    addLine('');
    addLine('  Total gross: <span class="t-value">$' + grossTotal.toLocaleString() + '</span> across <span class="t-value">6 legs</span>');
    scrollIfAtBottom();

    setTimeout(function () {
      if (myId !== animationId) { settleFinish(); return; }
      settleNetting();
    }, 600);

    function settleNetting() {
      addLine('');
      addLine('<span class="t-dim">[netting]</span> Computing multilateral net positions...');
      scrollIfAtBottom();
      setTimeout(function () {
        if (myId !== animationId) { settleFinish(); return; }
        settleResult();
      }, 500);
    }

    function settleResult() {
      addLine('');
      addLine('  <span class="t-label">NET POSITIONS</span>');
      addLine('');
      addLine('  <span class="t-tree">\u251C\u2500</span> Alpha Corp (pk)   <span class="t-error">owes $1,500,000</span>');
      addLine('  <span class="t-tree">\u251C\u2500</span> Beta Ltd (adgm)   <span class="t-success">owed $2,000,000</span>');
      addLine('  <span class="t-tree">\u251C\u2500</span> Gamma SA (sg)     <span class="t-error">owes $500,000</span>');
      addLine('  <span class="t-tree">\u2514\u2500</span> Delta Inc (gb)    <span class="t-dim">net zero</span>');
      scrollIfAtBottom();

      setTimeout(function () {
        if (myId !== animationId) { settleFinish(); return; }
        settleLegs();
      }, 400);
    }

    function settleLegs() {
      addLine('');
      addLine('  <span class="t-label">SETTLEMENT LEGS (2)</span>');
      addLine('');
      addLine('  <span class="t-tree">\u251C\u2500</span> Alpha Corp (pk) <span class="t-dim">\u2192</span> Beta Ltd (adgm)   <span class="t-success">$1,500,000</span>');
      addLine('  <span class="t-tree">\u2514\u2500</span> Gamma SA (sg)   <span class="t-dim">\u2192</span> Beta Ltd (adgm)   <span class="t-success">$500,000</span>');
      addLine('');
      addLine('  <span class="t-value">6 legs \u2192 2 legs</span> \u00b7 <span class="t-value">$7,500,000 \u2192 $2,000,000</span> \u00b7 <span class="t-success">73% reduction</span>');
      addLine('');
      scrollIfAtBottom();
      settleFinish();
    }

    function settleFinish() {
      animating = false;
      inputEl.disabled = false;
      inputEl.focus();
    }
  }

  function renderSettleInstant(obligations, grossTotal) {
    addLine('<span class="t-accent">SETTLEMENT ENGINE</span> <span class="t-dim">\u2014 Multilateral Netting</span>');
    addLine('');
    addLine('  <span class="t-label">GROSS OBLIGATIONS (6 legs)</span>');
    addLine('');
    for (var i = 0; i < obligations.length; i++) {
      var o = obligations[i];
      var tree = (i === obligations.length - 1) ? '\u2514\u2500' : '\u251C\u2500';
      addLine('  <span class="t-tree">' + tree + '</span> ' + padRight(escHtml(o.from), 22) + '<span class="t-dim">\u2192</span> ' + padRight(escHtml(o.to), 22) + '<span class="t-value">$' + o.amount.toLocaleString() + '</span>');
    }
    addLine('');
    addLine('  Total gross: <span class="t-value">$' + grossTotal.toLocaleString() + '</span> across <span class="t-value">6 legs</span>');
    addLine('');
    addLine('<span class="t-dim">[netting]</span> Computing multilateral net positions...');
    addLine('');
    addLine('  <span class="t-label">NET POSITIONS</span>');
    addLine('');
    addLine('  <span class="t-tree">\u251C\u2500</span> Alpha Corp (pk)   <span class="t-error">owes $1,500,000</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Beta Ltd (adgm)   <span class="t-success">owed $2,000,000</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Gamma SA (sg)     <span class="t-error">owes $500,000</span>');
    addLine('  <span class="t-tree">\u2514\u2500</span> Delta Inc (gb)    <span class="t-dim">net zero</span>');
    addLine('');
    addLine('  <span class="t-label">SETTLEMENT LEGS (2)</span>');
    addLine('');
    addLine('  <span class="t-tree">\u251C\u2500</span> Alpha Corp (pk) <span class="t-dim">\u2192</span> Beta Ltd (adgm)   <span class="t-success">$1,500,000</span>');
    addLine('  <span class="t-tree">\u2514\u2500</span> Gamma SA (sg)   <span class="t-dim">\u2192</span> Beta Ltd (adgm)   <span class="t-success">$500,000</span>');
    addLine('');
    addLine('  <span class="t-value">6 legs \u2192 2 legs</span> \u00b7 <span class="t-value">$7,500,000 \u2192 $2,000,000</span> \u00b7 <span class="t-success">73% reduction</span>');
    addLine('');
  }

  /* ── compare ── */
  function cmdCompare(args) {
    var parts = args.replace(/^compare\s*/i, '').trim().split(/\s+/);
    if (parts.length < 2 || !parts[0] || !parts[1]) {
      addLine('<span class="t-error">Usage: compare &lt;zone1&gt; &lt;zone2&gt; [zone3]</span>');
      addLine('<span class="t-dim">Example: compare pk adgm sg</span>');
      return;
    }

    var zones = [];
    for (var p = 0; p < Math.min(parts.length, 3); p++) {
      var z = findZone(parts[p]);
      if (!z) { addLine('<span class="t-error">Zone not found: ' + escHtml(parts[p]) + '</span>'); return; }
      zones.push(z);
    }

    emitMesh('clear');
    emitMesh('highlight', { zones: zones.map(function (z) { return z.id; }) });

    var col = 18;
    addLine('');
    addLine('<span class="t-accent">ZONE COMPARISON</span>');
    addLine('');

    /* Header row */
    var hdr = '  ' + padRight('', 20);
    for (var h = 0; h < zones.length; h++) hdr += padRight(escHtml(zones[h].id), col);
    addLine('<span class="t-dim">' + hdr + '</span>');
    addLine('');

    /* Info rows */
    var rows = [
      { label: 'Name', fn: function (z) { return '<span class="t-value">' + escHtml(z.name) + '</span>'; } },
      { label: 'Status', fn: function (z) { return statusLabel(z.status); } },
      { label: 'Framework', fn: function (z) { return '<span class="t-value">' + escHtml(z.framework) + '</span>'; } },
      { label: 'Region', fn: function (z) { return '<span class="t-dim">' + escHtml(z.region) + '</span>'; } },
      { label: 'Adapters', fn: function (z) { return '<span class="t-value">' + (z.adapters ? z.adapters.length : 0) + '</span>'; } }
    ];

    for (var r = 0; r < rows.length; r++) {
      var row = '  ' + padRight(rows[r].label, 20);
      /* We need plain text padding so build raw + html */
      addLine(buildCompareRow(rows[r].label, zones, rows[r].fn, col));
    }

    /* Compliance domains */
    addLine('');
    addLine('  <span class="t-label">COMPLIANCE DOMAINS</span>');
    addLine('');

    for (var d = 0; d < COMPLIANCE_DOMAINS.length; d++) {
      var dom = COMPLIANCE_DOMAINS[d];
      var tree = (d === COMPLIANCE_DOMAINS.length - 1) ? '\u2514\u2500' : '\u251C\u2500';
      var line = '  <span class="t-tree">' + tree + '</span> ' + padRight(dom.name, 18);
      for (var zz = 0; zz < zones.length; zz++) {
        var has = hasDomain(zones[zz], dom.id);
        line += padRight(has ? '<span class="t-success">\u2713</span>' : '<span class="t-dim">\u2014</span>', col);
      }
      addLine(line);
    }
    addLine('');
  }

  function buildCompareRow(label, zones, fn, col) {
    var line = '  ' + padRight(label, 20);
    for (var i = 0; i < zones.length; i++) {
      line += fn(zones[i]) + padRight('', col - 4);
    }
    return line;
  }

  /* ── demo (showstopper: 7-phase corridor lifecycle) ── */
  function cmdDemo(args) {
    var parts = args.replace(/^demo\s*/i, '').trim().split(/\s+/);
    if (parts.length < 2 || !parts[0] || !parts[1]) {
      addLine('<span class="t-error">Usage: demo &lt;from&gt; &lt;to&gt;</span>');
      addLine('<span class="t-dim">Example: demo adgm sg</span>');
      return;
    }
    var fromZone = findZone(parts[0]);
    var toZone = findZone(parts[1]);
    if (!fromZone) { addLine('<span class="t-error">Zone not found: ' + escHtml(parts[0]) + '</span>'); return; }
    if (!toZone) { addLine('<span class="t-error">Zone not found: ' + escHtml(parts[1]) + '</span>'); return; }
    if (fromZone.id === toZone.id) { addLine('<span class="t-error">Source and target must differ.</span>'); return; }

    emitMesh('clear');
    emitMesh('highlight', { zones: [fromZone.id, toZone.id] });

    /* Pre-compute route + crypto artifacts */
    var routeResult = findRoute(fromZone.id, toZone.id);
    if (!routeResult) {
      routeResult = { hops: [{ from: fromZone.id, to: toZone.id, type: 'cross-border', fee_bps: 20, settlement_secs: 28800 }], total_fee_bps: 20, total_settlement_secs: 28800 };
    }
    var hop = routeResult.hops[0];

    var receiptRoots = ['0'.repeat(16)];
    for (var rx = 0; rx < 4; rx++) receiptRoots.push(randomHex(16));
    var fsmEvidence = [randomHex(16), randomHex(16)];
    var invoiceDigest = randomHex(16);
    var invoiceId = 'INV-2026-0x' + randomHex(4);
    var entityFrom = fromZone.id.toUpperCase() + '-ENT-0x' + randomHex(4);
    var entityTo = toZone.id.toUpperCase() + '-ENT-0x' + randomHex(4);
    var ephemeralPub = randomHex(16);
    var receiptSigs = [];
    for (var rs = 0; rs < 4; rs++) receiptSigs.push(randomHex(16));
    var mmrRoot = randomHex(16);

    animating = true;
    inputEl.disabled = true;
    animationId++;
    var myId = animationId;

    addLine('');

    if (reducedMotion) {
      renderDemoInstant(fromZone, toZone, hop, receiptRoots, fsmEvidence, invoiceDigest, invoiceId, entityFrom, entityTo, ephemeralPub, receiptSigs, mmrRoot);
      animating = false;
      inputEl.disabled = false;
      inputEl.focus();
      scrollIfAtBottom();
      return;
    }

    /* Phase 0: Type command */
    var cmdText = 'mez demo ' + fromZone.id + ' ' + toZone.id;
    var promptLine = addLine('<span class="t-accent">$</span> ');
    var typedSpan = document.createElement('span');
    promptLine.appendChild(typedSpan);
    var cursor = document.createElement('span');
    cursor.className = 't-accent';
    cursor.textContent = '\u2588';
    promptLine.appendChild(cursor);
    scrollIfAtBottom();
    var charIdx = 0;

    function typeChar() {
      if (myId !== animationId) { demoFinish(); return; }
      if (charIdx < cmdText.length) {
        typedSpan.textContent += cmdText[charIdx];
        charIdx++;
        scrollIfAtBottom();
        setTimeout(typeChar, 28 + Math.random() * 28);
      } else {
        cursor.remove();
        promptLine.innerHTML = '<span class="t-accent">$</span> mez demo <span class="t-string">' + escHtml(fromZone.id) + '</span> <span class="t-string">' + escHtml(toZone.id) + '</span>';
        setTimeout(function () {
          if (myId !== animationId) { demoFinish(); return; }
          demoRoute();
        }, 380);
      }
    }

    /* Phase 1: Route Discovery */
    function demoRoute() {
      addLine('');
      addLine('<span class="t-dim">[route]</span> Route discovery via Dijkstra...');
      addLine('');
      addLine('  <span class="t-tree">\u251C\u2500</span> Source           <span class="t-value">' + escHtml(fromZone.name) + '</span> <span class="t-dim">(' + escHtml(fromZone.id) + ')</span>');
      addLine('  <span class="t-tree">\u251C\u2500</span> Target           <span class="t-value">' + escHtml(toZone.name) + '</span> <span class="t-dim">(' + escHtml(toZone.id) + ')</span>');
      addLine('  <span class="t-tree">\u251C\u2500</span> Corridor         <span class="t-string">' + corridorTypeLabel(hop.type) + '</span>');
      addLine('  <span class="t-tree">\u251C\u2500</span> Fee              <span class="t-value">' + hop.fee_bps + ' bps</span>');
      addLine('  <span class="t-tree">\u2514\u2500</span> Settlement       <span class="t-value">' + formatTime(hop.settlement_secs) + '</span>');
      scrollIfAtBottom();
      setTimeout(function () {
        if (myId !== animationId) { demoFinish(); return; }
        demoComplianceHeader();
      }, 400);
    }

    /* Phase 2: Compliance cascade */
    function demoComplianceHeader() {
      addLine('');
      addLine('<span class="t-dim">[compliance]</span> Bilateral compliance evaluation \u2014 23 domains...');
      addLine('');
      addLine('  <span class="t-label">BASE (mandatory, fail-closed)</span>');
      setTimeout(function () {
        if (myId !== animationId) { demoFinish(); return; }
        demoComplianceDomain(0);
      }, 200);
    }

    function demoComplianceDomain(idx) {
      if (myId !== animationId) { demoFinish(); return; }
      if (idx === 8) {
        addLine('');
        addLine('  <span class="t-label">EXTENDED</span>');
      }
      if (idx >= COMPLIANCE_DOMAINS.length) {
        var fromDoms = zoneDomains(fromZone);
        var toDoms = zoneDomains(toZone);
        var bilateral = 0;
        for (var b = 0; b < COMPLIANCE_DOMAINS.length; b++) {
          if (fromDoms.indexOf(COMPLIANCE_DOMAINS[b].id) !== -1 && toDoms.indexOf(COMPLIANCE_DOMAINS[b].id) !== -1) bilateral++;
        }
        addLine('');
        addLine('  <span class="t-value">23/23 evaluated</span> \u00b7 <span class="t-value">' + bilateral + ' bilateral</span> \u00b7 <span class="t-success">0 failures</span>');
        scrollIfAtBottom();
        setTimeout(function () {
          if (myId !== animationId) { demoFinish(); return; }
          demoFSM(0);
        }, 300);
        return;
      }
      var d = COMPLIANCE_DOMAINS[idx];
      var tree = (idx === 7 || idx === COMPLIANCE_DOMAINS.length - 1) ? '\u2514\u2500' : '\u251C\u2500';
      var fromHas = hasDomain(fromZone, d.id);
      var toHas = hasDomain(toZone, d.id);
      var fromMark = fromHas ? '<span class="t-success">\u2713</span>' : '<span class="t-dim">\u2014</span>';
      var toMark = toHas ? '<span class="t-success">\u2713</span>' : '<span class="t-dim">\u2014</span>';
      addLine('  <span class="t-tree">' + tree + '</span> ' + padRight(d.name, 18) + padRight(escHtml(fromZone.framework), 16) + ' ' + fromMark + '    ' + padRight(escHtml(toZone.framework), 16) + ' ' + toMark);
      scrollIfAtBottom();
      setTimeout(function () { demoComplianceDomain(idx + 1); }, 120);
    }

    /* Phase 3: Corridor FSM */
    var fsmTransitions = [
      { label: 'DRAFT \u2192 PENDING', evidence: fsmEvidence[0] },
      { label: 'PENDING \u2192 ACTIVE', evidence: fsmEvidence[1] },
      { label: 'ACTIVE', evidence: null }
    ];

    function demoFSM(idx) {
      if (myId !== animationId) { demoFinish(); return; }
      if (idx === 0) {
        emitMesh('burst', { from: fromZone.id, to: toZone.id, count: 8 });
        addLine('');
        addLine('<span class="t-dim">[corridor]</span> State machine transition...');
        addLine('');
      }
      if (idx >= fsmTransitions.length) {
        scrollIfAtBottom();
        setTimeout(function () {
          if (myId !== animationId) { demoFinish(); return; }
          demoInvoice();
        }, 200);
        return;
      }
      var t = fsmTransitions[idx];
      var tree = (idx === fsmTransitions.length - 1) ? '\u2514\u2500' : '\u251C\u2500';
      var detail = t.evidence
        ? '  <span class="t-dim">evidence: 0x</span><span class="t-string">' + truncHash(t.evidence) + '</span>'
        : '  <span class="t-dim">watchers: 3/3 attestations</span>';
      addLine('  <span class="t-tree">' + tree + '</span> <span class="t-accent">' + t.label + '</span>' + detail + '  <span class="t-success">\u2713</span>');
      scrollIfAtBottom();
      setTimeout(function () { demoFSM(idx + 1); }, 400);
    }

    /* Phase 4: Invoice */
    function demoInvoice() {
      if (myId !== animationId) { demoFinish(); return; }
      addLine('');
      addLine('<span class="t-dim">[invoice]</span> Trade invoice generated');
      addLine('');
      addLine('  <span class="t-tree">\u251C\u2500</span> Invoice          <span class="t-value">' + invoiceId + '</span>');
      addLine('  <span class="t-tree">\u251C\u2500</span> Amount           <span class="t-value">$1,000,000.00</span>');
      addLine('  <span class="t-tree">\u251C\u2500</span> Currency         <span class="t-value">USD</span>');
      addLine('  <span class="t-tree">\u251C\u2500</span> From             <span class="t-value">' + entityFrom + '</span>');
      addLine('  <span class="t-tree">\u251C\u2500</span> To               <span class="t-value">' + entityTo + '</span>');
      addLine('  <span class="t-tree">\u2514\u2500</span> Canonical digest <span class="t-dim">sha256:0x</span><span class="t-string">' + truncHash(invoiceDigest) + '</span>');
      scrollIfAtBottom();
      setTimeout(function () {
        if (myId !== animationId) { demoFinish(); return; }
        demoTax();
      }, 300);
    }

    /* Phase 5: Tax Withholding */
    function demoTax() {
      if (myId !== animationId) { demoFinish(); return; }
      var rules = TAX_RULES[fromZone.id];
      addLine('');
      if (!rules) {
        addLine('<span class="t-dim">[tax]</span> No withholding rules in source jurisdiction');
        scrollIfAtBottom();
        setTimeout(function () {
          if (myId !== animationId) { demoFinish(); return; }
          demoReceipts(0);
        }, 300);
        return;
      }
      var rule = null;
      for (var i = 0; i < rules.length; i++) {
        if (rules[i].event === 'cross_border_payment') { rule = rules[i]; break; }
      }
      if (!rule) {
        addLine('<span class="t-dim">[tax]</span> No cross-border withholding rule');
        scrollIfAtBottom();
        setTimeout(function () {
          if (myId !== animationId) { demoFinish(); return; }
          demoReceipts(0);
        }, 300);
        return;
      }
      var gross = 1000000;
      var withheld = gross * rule.rate / 100;
      var net = gross - withheld;
      addLine('<span class="t-dim">[tax]</span> Withholding computation');
      addLine('');
      addLine('  <span class="t-tree">\u251C\u2500</span> Section          <span class="t-value">' + escHtml(rule.section) + '</span>');
      addLine('  <span class="t-tree">\u251C\u2500</span> Event            <span class="t-value">cross_border_payment</span>');
      addLine('  <span class="t-tree">\u251C\u2500</span> Rate             <span class="t-value">' + rule.rate.toFixed(1) + '%</span>' + (rule.final ? ' <span class="t-dim">(final)</span>' : ''));
      addLine('  <span class="t-tree">\u251C\u2500</span> Gross            <span class="t-value">$' + gross.toLocaleString() + '.00</span>');
      addLine('  <span class="t-tree">\u251C\u2500</span> Withheld         <span class="t-error">$' + withheld.toLocaleString() + '.00</span>');
      addLine('  <span class="t-tree">\u2514\u2500</span> Net              <span class="t-success">$' + net.toLocaleString() + '.00</span>');
      scrollIfAtBottom();
      setTimeout(function () {
        if (myId !== animationId) { demoFinish(); return; }
        demoReceipts(0);
      }, 500);
    }

    /* Phase 6: Receipt Chain */
    function demoReceipts(idx) {
      if (myId !== animationId) { demoFinish(); return; }
      if (idx === 0) {
        addLine('');
        addLine('<span class="t-dim">[receipts]</span> Building receipt chain...');
        addLine('');
      }
      if (idx >= 4) {
        addLine('');
        addLine('  <span class="t-dim">MMR commitment</span>  <span class="t-dim">0x</span><span class="t-string">' + truncHash(mmrRoot) + '</span> <span class="t-dim">(checkpoint at height 4)</span>');
        scrollIfAtBottom();
        setTimeout(function () {
          if (myId !== animationId) { demoFinish(); return; }
          demoSigning();
        }, 300);
        return;
      }
      var tree = (idx === 3) ? '\u2514\u2500' : '\u251C\u2500';
      addLine('  <span class="t-tree">' + tree + '</span> <span class="t-dim">#' + idx + '</span>  <span class="t-dim">0x</span><span class="t-string">' + truncHash(receiptRoots[idx]) + '</span> <span class="t-dim">\u2192 0x</span><span class="t-string">' + truncHash(receiptRoots[idx + 1]) + '</span>');
      scrollIfAtBottom();
      setTimeout(function () { demoReceipts(idx + 1); }, 500);
    }

    /* Phase 7: Ed25519 Signing */
    function demoSigning() {
      if (myId !== animationId) { demoFinish(); return; }
      addLine('');
      addLine('<span class="t-dim">[signing]</span> Ed25519 ephemeral keypair');
      addLine('');
      addLine('  <span class="t-tree">\u251C\u2500</span> Public key   <span class="t-dim">ed25519:0x</span><span class="t-string">' + truncHash(ephemeralPub) + '</span>');
      for (var i = 0; i < 4; i++) {
        var tree = (i === 3) ? '\u2514\u2500' : '\u251C\u2500';
        addLine('  <span class="t-tree">' + tree + '</span> Receipt #' + i + '   <span class="t-dim">sig: 0x</span><span class="t-string">' + truncHash(receiptSigs[i]) + '</span>');
      }
      addLine('');
      addLine('<span class="t-success">\u2713</span> Corridor settlement complete');
      addLine('  <span class="t-value">4 receipts</span> \u00b7 <span class="t-value">20/23 domains</span> \u00b7 <span class="t-value">3 watcher attestations</span>');
      addLine('  Total fees: <span class="t-value">$' + (hop.fee_bps * 100).toLocaleString() + '</span>');
      addLine('');
      emitMesh('pulse', { zone: fromZone.id });
      emitMesh('pulse', { zone: toZone.id });
      scrollIfAtBottom();
      demoFinish();
    }

    function demoFinish() {
      animating = false;
      inputEl.disabled = false;
      inputEl.focus();
    }

    typeChar();
  }

  function renderDemoInstant(fromZone, toZone, hop, receiptRoots, fsmEvidence, invoiceDigest, invoiceId, entityFrom, entityTo, ephemeralPub, receiptSigs, mmrRoot) {
    addLine('<span class="t-accent">$</span> mez demo <span class="t-string">' + escHtml(fromZone.id) + '</span> <span class="t-string">' + escHtml(toZone.id) + '</span>');
    /* Phase 1: Route */
    addLine('');
    addLine('<span class="t-dim">[route]</span> Route discovery via Dijkstra...');
    addLine('');
    addLine('  <span class="t-tree">\u251C\u2500</span> Source           <span class="t-value">' + escHtml(fromZone.name) + '</span> <span class="t-dim">(' + escHtml(fromZone.id) + ')</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Target           <span class="t-value">' + escHtml(toZone.name) + '</span> <span class="t-dim">(' + escHtml(toZone.id) + ')</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Corridor         <span class="t-string">' + corridorTypeLabel(hop.type) + '</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Fee              <span class="t-value">' + hop.fee_bps + ' bps</span>');
    addLine('  <span class="t-tree">\u2514\u2500</span> Settlement       <span class="t-value">' + formatTime(hop.settlement_secs) + '</span>');
    /* Phase 2: Compliance */
    addLine('');
    addLine('<span class="t-dim">[compliance]</span> Bilateral compliance evaluation \u2014 23 domains...');
    addLine('');
    addLine('  <span class="t-label">BASE (mandatory, fail-closed)</span>');
    var fromDoms = zoneDomains(fromZone);
    var toDoms = zoneDomains(toZone);
    var bilateral = 0;
    for (var i = 0; i < COMPLIANCE_DOMAINS.length; i++) {
      if (i === 8) { addLine(''); addLine('  <span class="t-label">EXTENDED</span>'); }
      var d = COMPLIANCE_DOMAINS[i];
      var tree = (i === 7 || i === COMPLIANCE_DOMAINS.length - 1) ? '\u2514\u2500' : '\u251C\u2500';
      var fh = fromDoms.indexOf(d.id) !== -1;
      var th = toDoms.indexOf(d.id) !== -1;
      if (fh && th) bilateral++;
      var fm = fh ? '<span class="t-success">\u2713</span>' : '<span class="t-dim">\u2014</span>';
      var tm = th ? '<span class="t-success">\u2713</span>' : '<span class="t-dim">\u2014</span>';
      addLine('  <span class="t-tree">' + tree + '</span> ' + padRight(d.name, 18) + padRight(escHtml(fromZone.framework), 16) + ' ' + fm + '    ' + padRight(escHtml(toZone.framework), 16) + ' ' + tm);
    }
    addLine('');
    addLine('  <span class="t-value">23/23 evaluated</span> \u00b7 <span class="t-value">' + bilateral + ' bilateral</span> \u00b7 <span class="t-success">0 failures</span>');
    /* Phase 3: FSM */
    addLine('');
    addLine('<span class="t-dim">[corridor]</span> State machine transition...');
    addLine('');
    addLine('  <span class="t-tree">\u251C\u2500</span> <span class="t-accent">DRAFT \u2192 PENDING</span>  <span class="t-dim">evidence: 0x</span><span class="t-string">' + truncHash(fsmEvidence[0]) + '</span>  <span class="t-success">\u2713</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> <span class="t-accent">PENDING \u2192 ACTIVE</span>  <span class="t-dim">evidence: 0x</span><span class="t-string">' + truncHash(fsmEvidence[1]) + '</span>  <span class="t-success">\u2713</span>');
    addLine('  <span class="t-tree">\u2514\u2500</span> <span class="t-accent">ACTIVE</span>  <span class="t-dim">watchers: 3/3 attestations</span>  <span class="t-success">\u2713</span>');
    /* Phase 4: Invoice */
    addLine('');
    addLine('<span class="t-dim">[invoice]</span> Trade invoice generated');
    addLine('');
    addLine('  <span class="t-tree">\u251C\u2500</span> Invoice          <span class="t-value">' + invoiceId + '</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Amount           <span class="t-value">$1,000,000.00</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Currency         <span class="t-value">USD</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> From             <span class="t-value">' + entityFrom + '</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> To               <span class="t-value">' + entityTo + '</span>');
    addLine('  <span class="t-tree">\u2514\u2500</span> Canonical digest <span class="t-dim">sha256:0x</span><span class="t-string">' + truncHash(invoiceDigest) + '</span>');
    /* Phase 5: Tax */
    var rules = TAX_RULES[fromZone.id];
    addLine('');
    if (rules) {
      var rule = null;
      for (var r = 0; r < rules.length; r++) { if (rules[r].event === 'cross_border_payment') { rule = rules[r]; break; } }
      if (rule) {
        var gross = 1000000;
        var withheld = gross * rule.rate / 100;
        var net = gross - withheld;
        addLine('<span class="t-dim">[tax]</span> Withholding computation');
        addLine('');
        addLine('  <span class="t-tree">\u251C\u2500</span> Section          <span class="t-value">' + escHtml(rule.section) + '</span>');
        addLine('  <span class="t-tree">\u251C\u2500</span> Event            <span class="t-value">cross_border_payment</span>');
        addLine('  <span class="t-tree">\u251C\u2500</span> Rate             <span class="t-value">' + rule.rate.toFixed(1) + '%</span>' + (rule.final ? ' <span class="t-dim">(final)</span>' : ''));
        addLine('  <span class="t-tree">\u251C\u2500</span> Gross            <span class="t-value">$' + gross.toLocaleString() + '.00</span>');
        addLine('  <span class="t-tree">\u251C\u2500</span> Withheld         <span class="t-error">$' + withheld.toLocaleString() + '.00</span>');
        addLine('  <span class="t-tree">\u2514\u2500</span> Net              <span class="t-success">$' + net.toLocaleString() + '.00</span>');
      } else {
        addLine('<span class="t-dim">[tax]</span> No cross-border withholding rule');
      }
    } else {
      addLine('<span class="t-dim">[tax]</span> No withholding rules in source jurisdiction');
    }
    /* Phase 6: Receipts */
    addLine('');
    addLine('<span class="t-dim">[receipts]</span> Receipt chain');
    addLine('');
    for (var rc = 0; rc < 4; rc++) {
      var rtree = (rc === 3) ? '\u2514\u2500' : '\u251C\u2500';
      addLine('  <span class="t-tree">' + rtree + '</span> <span class="t-dim">#' + rc + '</span>  <span class="t-dim">0x</span><span class="t-string">' + truncHash(receiptRoots[rc]) + '</span> <span class="t-dim">\u2192 0x</span><span class="t-string">' + truncHash(receiptRoots[rc + 1]) + '</span>');
    }
    addLine('');
    addLine('  <span class="t-dim">MMR commitment</span>  <span class="t-dim">0x</span><span class="t-string">' + truncHash(mmrRoot) + '</span> <span class="t-dim">(checkpoint at height 4)</span>');
    /* Phase 7: Signing */
    addLine('');
    addLine('<span class="t-dim">[signing]</span> Ed25519 ephemeral keypair');
    addLine('');
    addLine('  <span class="t-tree">\u251C\u2500</span> Public key   <span class="t-dim">ed25519:0x</span><span class="t-string">' + truncHash(ephemeralPub) + '</span>');
    for (var s = 0; s < 4; s++) {
      var stree = (s === 3) ? '\u2514\u2500' : '\u251C\u2500';
      addLine('  <span class="t-tree">' + stree + '</span> Receipt #' + s + '   <span class="t-dim">sig: 0x</span><span class="t-string">' + truncHash(receiptSigs[s]) + '</span>');
    }
    addLine('');
    addLine('<span class="t-success">\u2713</span> Corridor settlement complete');
    addLine('  <span class="t-value">4 receipts</span> \u00b7 <span class="t-value">20/23 domains</span> \u00b7 <span class="t-value">3 watcher attestations</span>');
    addLine('  Total fees: <span class="t-value">$' + (hop.fee_bps * 100).toLocaleString() + '</span>');
    addLine('');
  }

  /* ── schema — JSON Schema catalog + detail browser ── */
  function cmdSchema(args) {
    var parts = args.trim().split(/\s+/);
    var schemaArg = parts[1] ? parts[1].toLowerCase() : null;

    /* No arg: show family listing */
    if (!schemaArg) {
      var totalSchemas = 0;
      for (var i = 0; i < SCHEMA_FAMILIES.length; i++) totalSchemas += SCHEMA_FAMILIES[i].count;

      addLine('');
      addLine('<span class="t-accent">OPENAPI SCHEMA CATALOG</span> <span class="t-dim">(' + totalSchemas + ' schemas, Draft 2020-12, SHA-256 content-addressed)</span>');
      addLine('<span class="t-dim">Every write is validated against typed schemas</span>');
      addLine('');

      for (var j = 0; j < SCHEMA_FAMILIES.length; j++) {
        var fam = SCHEMA_FAMILIES[j];
        var tree = j < SCHEMA_FAMILIES.length - 1 ? '\u251C\u2500' : '\u2514\u2500';
        addLine('  <span class="t-tree">' + tree + '</span> ' + padRight(fam.name, 18) + '<span class="t-value">' + padRight(fam.count + ' schemas', 12) + '</span><span class="t-dim">' + fam.desc + '</span>');
      }

      addLine('');
      addLine('  <span class="t-label">PROPERTIES</span>');
      addLine('  <span class="t-tree">\u251C\u2500</span> Format             <span class="t-value">JSON Schema Draft 2020-12</span>');
      addLine('  <span class="t-tree">\u251C\u2500</span> Addressing         <span class="t-value">SHA-256 content-addressed</span>');
      addLine('  <span class="t-tree">\u251C\u2500</span> Validation         <span class="t-value">Every write-path operation</span>');
      addLine('  <span class="t-tree">\u2514\u2500</span> Canonicalization   <span class="t-value">JCS (RFC 8785)</span>');
      addLine('');
      addLine('<span class="t-dim">Browse: schema corridor.receipt  |  schema entity  |  schema smart-asset</span>');
      addLine('');
      return;
    }

    /* With arg: load full schema data and show detail */
    loadData('schemas', function (schemas) {
      /* Find matching schemas — exact match on title/file, or prefix match on family */
      var matches = [];
      for (var s = 0; s < schemas.length; s++) {
        var sch = schemas[s];
        var fname = sch.file.replace('.schema.json', '').toLowerCase();
        var title = (sch.title || '').toLowerCase();
        if (fname === schemaArg || fname.indexOf(schemaArg) === 0 || title.indexOf(schemaArg) !== -1) {
          matches.push(sch);
        }
      }

      if (matches.length === 0) {
        addLine('<span class="t-error">No schemas matching: ' + escHtml(schemaArg) + '</span>');
        addLine('<span class="t-dim">Try: schema corridor  |  schema entity  |  schema smart-asset</span>');
        addLine('');
        return;
      }

      /* Multiple matches: list them */
      if (matches.length > 1) {
        addLine('');
        addLine('<span class="t-accent">SCHEMAS</span> <span class="t-dim">matching \u201C' + escHtml(schemaArg) + '\u201D (' + matches.length + ' results)</span>');
        addLine('');
        for (var m = 0; m < matches.length; m++) {
          var ms = matches[m];
          var mTree = m < matches.length - 1 ? '\u251C\u2500' : '\u2514\u2500';
          var mName = ms.file.replace('.schema.json', '');
          var mProps = ms.properties ? ms.properties.length + ' props' : '';
          var mReq = ms.required ? ms.required.length + ' required' : '';
          addLine('  <span class="t-tree">' + mTree + '</span> <span class="t-accent">' + padRight(mName, 32) + '</span> <span class="t-value">' + padRight(mProps, 10) + '</span><span class="t-dim">' + mReq + '</span>');
        }
        addLine('');
        addLine('<span class="t-dim">Inspect: schema ' + matches[0].file.replace('.schema.json', '') + '</span>');
        addLine('');
        return;
      }

      /* Single match: show full detail */
      var schema = matches[0];
      var sName = schema.file.replace('.schema.json', '');

      addLine('');
      addLine('<span class="t-accent">SCHEMA</span>  ' + sName);
      if (schema.title) addLine('<span class="t-dim">' + escHtml(schema.title) + '</span>');
      if (schema.id) addLine('<span class="t-dim">$id: ' + escHtml(schema.id) + '</span>');
      addLine('');

      if (schema.required && schema.required.length > 0) {
        addLine('  <span class="t-label">REQUIRED FIELDS</span>  <span class="t-value">' + schema.required.length + '</span>');
        addLine('  <span class="t-dim">' + schema.required.join(', ') + '</span>');
        addLine('');
      }

      if (schema.properties && schema.properties.length > 0) {
        addLine('  <span class="t-label">PROPERTIES</span>  <span class="t-value">' + schema.properties.length + '</span>');
        addLine('');
        for (var p = 0; p < schema.properties.length; p++) {
          var prop = schema.properties[p];
          var pTree = p < schema.properties.length - 1 ? '\u251C\u2500' : '\u2514\u2500';
          var isReq = schema.required && schema.required.indexOf(prop.name) !== -1;
          var reqTag = isReq ? ' <span class="t-value">required</span>' : '';
          var typeStr = prop.type || '';
          addLine('  <span class="t-tree">' + pTree + '</span> ' + padRight(prop.name, 26) + '<span class="t-dim">' + padRight(typeStr, 12) + '</span>' + reqTag);
          if (prop.pattern) addLine('     ' + padRight('', 26) + '<span class="t-dim">pattern: ' + escHtml(prop.pattern) + '</span>');
          if (prop.format) addLine('     ' + padRight('', 26) + '<span class="t-dim">format: ' + prop.format + '</span>');
          if (prop.description) addLine('     ' + padRight('', 26) + '<span class="t-dim">' + escHtml(prop.description.substring(0, 60)) + '</span>');
          if (prop['enum']) addLine('     ' + padRight('', 26) + '<span class="t-dim">enum: [' + prop['enum'].join(', ') + ']</span>');
          if (prop.minimum !== undefined) addLine('     ' + padRight('', 26) + '<span class="t-dim">minimum: ' + prop.minimum + '</span>');
        }
      }

      addLine('');
    });
  }

  /* ── cli — CLI subcommand reference ── */
  function cmdCli(args) {
    var totalSubs = 0;
    for (var i = 0; i < CLI_COMMANDS.length; i++) totalSubs += CLI_COMMANDS[i].subcommands;

    addLine('');
    addLine('<span class="t-accent">Mass CLI (mez)</span> <span class="t-dim">v0.4.44 \u2014 ' + CLI_COMMANDS.length + ' commands, ' + totalSubs + ' subcommands</span>');
    addLine('<span class="t-dim">Rust binary for zone composition, corridor operations, cryptographic audit</span>');
    addLine('');

    for (var j = 0; j < CLI_COMMANDS.length; j++) {
      var cmd = CLI_COMMANDS[j];
      var tree = j < CLI_COMMANDS.length - 1 ? '\u251C\u2500' : '\u2514\u2500';
      addLine('  <span class="t-tree">' + tree + '</span> <span class="t-accent">' + padRight('mez ' + cmd.name, 20) + '</span> ' + padRight(cmd.subcommands + ' sub', 8) + '<span class="t-dim">' + cmd.desc + '</span>');
    }

    addLine('');
    addLine('  <span class="t-label">CI CONFORMANCE</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Required commands  <span class="t-value">71</span> <span class="t-dim">(Appendix F conformance, 100% implemented)</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> CI gates           <span class="t-value">25+</span>');
    addLine('  <span class="t-tree">\u2514\u2500</span> Test annotations   <span class="t-value">42,956</span>');
    addLine('');
  }

  /* ── clear ── */
  /* ── settlement ── */
  function cmdSettlement(args) {
    var parts = args.trim().split(/\s+/);
    var typeArg = parts[1] ? parts[1].toLowerCase() : null;

    if (typeArg) {
      /* Show detail for specific settlement type */
      var found = null;
      for (var i = 0; i < SETTLEMENT_TYPES.length; i++) {
        if (SETTLEMENT_TYPES[i].id === typeArg || SETTLEMENT_TYPES[i].name.toLowerCase().indexOf(typeArg) >= 0) {
          found = SETTLEMENT_TYPES[i]; break;
        }
      }
      if (!found) {
        addLine('<span class="t-error">Unknown settlement type: ' + escHtml(typeArg) + '</span>');
        addLine('<span class="t-dim">Available: ' + SETTLEMENT_TYPES.map(function(s) { return s.id; }).join(', ') + '</span>');
        addLine('');
        return;
      }
      addLine('');
      addLine('<span class="t-accent">' + found.name + '</span> <span class="t-dim">(' + found.id + ')</span>');
      addLine('');
      addLine('  <span class="t-tree">\u251C\u2500</span> Protocol    <span class="t-value">' + found.protocol + '</span>');
      addLine('  <span class="t-tree">\u251C\u2500</span> Currency    <span class="t-value">' + found.currency + '</span>');
      addLine('  <span class="t-tree">\u2514\u2500</span> Attestations');
      for (var a = 0; a < found.attestations.length; a++) {
        var atree = (a === found.attestations.length - 1) ? '\u2514\u2500' : '\u251C\u2500';
        addLine('       <span class="t-tree">' + atree + '</span> <span class="t-string">' + found.attestations[a] + '</span>');
      }
      addLine('');
      return;
    }

    addLine('');
    addLine('<span class="t-accent">Settlement Types</span> <span class="t-dim">\u2500 5 types from registries/settlement-types.yaml</span>');
    addLine('');
    for (var s = 0; s < SETTLEMENT_TYPES.length; s++) {
      var st = SETTLEMENT_TYPES[s];
      var stree = (s === SETTLEMENT_TYPES.length - 1) ? '\u2514\u2500' : '\u251C\u2500';
      addLine('  <span class="t-tree">' + stree + '</span> <span class="t-accent">' + padRight(st.id, 20) + '</span> ' + padRight(st.name, 26) + ' <span class="t-dim">' + st.protocol + '</span>');
    }
    addLine('');
    addLine('<span class="t-dim">Use settlement &lt;type&gt; for attestation details.</span>');
    addLine('');
  }

  /* ── lifecycle ── */
  function cmdLifecycle() {
    addLine('');
    addLine('<span class="t-accent">Corridor Lifecycle State Machine</span> <span class="t-dim">\u2500 from governance/corridor.lifecycle.state-machine.v2.json</span>');
    addLine('');
    addLine('  <span class="t-accent">States</span> <span class="t-dim">(' + CORRIDOR_LIFECYCLE.states.length + ')</span>');
    for (var si = 0; si < CORRIDOR_LIFECYCLE.states.length; si++) {
      var stree = (si === CORRIDOR_LIFECYCLE.states.length - 1) ? '\u2514\u2500' : '\u251C\u2500';
      var state = CORRIDOR_LIFECYCLE.states[si];
      var color = state === 'ACTIVE' ? 't-pass' : state === 'DEPRECATED' ? 't-error' : state === 'HALTED' || state === 'SUSPENDED' ? 't-warn' : 't-value';
      addLine('  <span class="t-tree">' + stree + '</span> <span class="' + color + '">' + state + '</span>');
    }
    addLine('');
    addLine('  <span class="t-accent">Transitions</span> <span class="t-dim">(' + CORRIDOR_LIFECYCLE.transitions.length + ')</span>');
    for (var ti = 0; ti < CORRIDOR_LIFECYCLE.transitions.length; ti++) {
      var t = CORRIDOR_LIFECYCLE.transitions[ti];
      var ttree = (ti === CORRIDOR_LIFECYCLE.transitions.length - 1) ? '\u2514\u2500' : '\u251C\u2500';
      addLine('  <span class="t-tree">' + ttree + '</span> <span class="t-warn">' + padRight(t.from, 10) + '</span> \u2192 <span class="t-pass">' + padRight(t.to, 10) + '</span> <span class="t-dim">' + padRight(t.action, 28) + '</span> <span class="t-string">' + t.evidence + '</span>');
    }
    addLine('');
    addLine('  <span class="t-dim">DRAFT \u2192 PENDING \u2192 ACTIVE is the nominal path.</span>');
    addLine('  <span class="t-dim">DEPRECATED is terminal and irreversible.</span>');
    addLine('');
  }

  /* ── transitions ── */
  function cmdTransitions(args) {
    var parts = args.trim().split(/\s+/);
    var familyArg = null;
    for (var i = 1; i < parts.length; i++) {
      if (parts[i] === '--family' && parts[i + 1]) { familyArg = parts[i + 1].toLowerCase(); break; }
    }

    var filtered = TRANSITION_TYPES;
    if (familyArg) {
      filtered = TRANSITION_TYPES.filter(function(t) { return t.family === familyArg; });
      if (filtered.length === 0) {
        addLine('<span class="t-error">Unknown family: ' + escHtml(familyArg) + '</span>');
        addLine('<span class="t-dim">Available: settlement, trade, arbitration</span>');
        addLine('');
        return;
      }
    }

    /* Group by family */
    var families = {};
    for (var j = 0; j < filtered.length; j++) {
      var tt = filtered[j];
      if (!families[tt.family]) families[tt.family] = [];
      families[tt.family].push(tt);
    }

    addLine('');
    addLine('<span class="t-accent">Transition Types</span> <span class="t-dim">\u2500 ' + filtered.length + ' types from registries/transition-types.yaml</span>');
    addLine('');
    var famKeys = Object.keys(families);
    for (var fi = 0; fi < famKeys.length; fi++) {
      var fam = famKeys[fi];
      var types = families[fam];
      addLine('  <span class="t-accent">' + fam.charAt(0).toUpperCase() + fam.slice(1) + '</span> <span class="t-dim">(' + types.length + ')</span>');
      for (var k = 0; k < types.length; k++) {
        var typ = types[k];
        var ktree = (k === types.length - 1) ? '\u2514\u2500' : '\u251C\u2500';
        addLine('  <span class="t-tree">' + ktree + '</span> <span class="t-value">' + padRight(typ.id, 40) + '</span> <span class="t-dim">' + typ.desc + '</span>');
      }
      addLine('');
    }
    if (!familyArg) {
      addLine('<span class="t-dim">Use transitions --family &lt;name&gt; to filter. Families: settlement, trade, arbitration</span>');
      addLine('');
    }
  }

  function cmdClear() {
    emitMesh('clear');
    outputEl.innerHTML = '';
  }

  /* ── about ── */
  function cmdAbout() {
    addLine('');
    addLine('<span class="t-accent">Momentum Network Explorer</span>');
    addLine('<span class="t-dim">Version 0.4.44 GENESIS</span>');
    addLine('');
    addLine('  Interactive terminal for querying the Momentum zone network.');
    addLine('  Data reflects the current production deployment state.');
    addLine('');
    addLine('  <span class="t-tree">\u251C\u2500</span> Stack    <span class="t-value">Mass v0.4.44</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Zones    <span class="t-value">' + ZONES.length + ' total</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Domains  <span class="t-value">' + COMPLIANCE_DOMAINS.length + '</span>');
    addLine('  <span class="t-tree">\u2514\u2500</span> Source   <span class="t-string">momentum.inc</span>');
    addLine('');
  }


  /* ── history — show command history ── */
  function cmdHistory() {
    addLine('');
    if (history.length === 0) {
      addLine('<span class="t-dim">No commands in history.</span>');
      addLine('');
      return;
    }
    addLine('<span class="t-accent">COMMAND HISTORY</span> <span class="t-dim">(' + history.length + ' commands)</span>');
    addLine('');
    var start = Math.max(0, history.length - 25);
    for (var i = start; i < history.length; i++) {
      var num = padRight(String(i + 1), 4);
      addLine('  <span class="t-dim">' + num + '</span>' + escHtml(history[i]));
    }
    addLine('');
  }

  /* ── export — shareable URL ── */
  function cmdExport() {
    addLine('');
    if (history.length === 0) {
      addLine('<span class="t-dim">No commands to export.</span>');
      addLine('');
      return;
    }
    /* Encode last command as shareable URL */
    var lastCmd = history[history.length - 1];
    if (lastCmd === 'export') lastCmd = history.length > 1 ? history[history.length - 2] : '';
    var url = window.location.origin + window.location.pathname + '#cmd=' + encodeURIComponent(lastCmd);
    addLine('<span class="t-accent">SHAREABLE LINK</span>');
    addLine('');
    addLine('  <span class="t-string">' + escHtml(url) + '</span>');
    addLine('');
    /* Copy to clipboard */
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function () {
        addLine('  <span class="t-success">\u2713</span> <span class="t-dim">Copied to clipboard</span>');
        addLine('');
      }).catch(function () {
        addLine('  <span class="t-dim">Select and copy the URL above.</span>');
        addLine('');
      });
    } else {
      addLine('  <span class="t-dim">Select and copy the URL above.</span>');
      addLine('');
    }
  }

  /* ── lawpack — shorthand for operation + jurisdiction ── */
  function cmdLawpack(args) {
    var parts = args.trim().split(/\s+/);
    /* lawpack entity.incorporate <jurisdiction> */
    if (parts.length < 3) {
      addLine('');
      addLine('<span class="t-dim">Usage: lawpack &lt;operation&gt; &lt;jurisdiction&gt;</span>');
      addLine('<span class="t-dim">Example: lawpack entity.incorporate ae-abudhabi-adgm</span>');
      addLine('');
      return;
    }
    cmdOperation('operation ' + parts[1] + ' --jurisdiction ' + parts[2]);
    addLine('<span class="t-dim">\u2192 Full operation reference: <a href="/docs.html#operations" class="t-link">/docs.html#operations</a></span>');
    addLine('');
  }

  /* ── diff — shorthand for operation --compare ── */
  function cmdDiff(args) {
    var parts = args.trim().split(/\s+/);
    /* diff entity.incorporate <j1> <j2> */
    if (parts.length < 4) {
      addLine('');
      addLine('<span class="t-dim">Usage: diff &lt;operation&gt; &lt;j1&gt; &lt;j2&gt; [j3]</span>');
      addLine('<span class="t-dim">Example: diff entity.incorporate us-de sg</span>');
      addLine('');
      return;
    }
    var jArgs = parts.slice(2).join(' ');
    cmdOperation('operation ' + parts[1] + ' --compare ' + jArgs);
    addLine('<span class="t-dim">\u2192 Full operation reference: <a href="/docs.html#operations" class="t-link">/docs.html#operations</a></span>');
    addLine('');
  }

  /* ── api — OpenAPI spec browser ── */
  function cmdApi(args) {
    var parts = args.trim().split(/\s+/);
    var pathFilter = parts[1] || null;

    loadData('openapi-index', function (specs) {
      addLine('');

      if (!pathFilter) {
        /* List all specs */
        var totalOps = 0;
        for (var i = 0; i < specs.length; i++) totalOps += specs[i].operation_count;
        addLine('<span class="t-accent">OPENAPI SURFACE</span> <span class="t-dim">' + specs.length + ' specs, ' + totalOps + ' operations</span>');
        addLine('<span class="t-dim">From runtime /openapi.json exported to sdk/mass-openapi.json</span>');
        addLine('');
        for (var s = 0; s < specs.length; s++) {
          var spec = specs[s];
          var tree = s < specs.length - 1 ? '\u251C\u2500' : '\u2514\u2500';
          addLine('  <span class="t-tree">' + tree + '</span> <span class="t-accent">' + padRight(spec.title || spec.file, 36) + '</span> <span class="t-value">' + padRight(spec.operation_count + ' ops', 8) + '</span> <span class="t-dim">' + spec.path_count + ' paths</span>');
        }
        addLine('');
        addLine('<span class="t-dim">Browse: api /v1/entities  |  api /v1/corridors  |  api /v1/smart-assets</span>');
        addLine('');
        return;
      }

      /* Filter operations by path prefix */
      var matches = [];
      for (var j = 0; j < specs.length; j++) {
        for (var k = 0; k < specs[j].operations.length; k++) {
          var op = specs[j].operations[k];
          if (op.path.indexOf(pathFilter) === 0 || op.path.indexOf(pathFilter.replace(/^\//, '')) !== -1) {
            matches.push({ spec: specs[j].title, method: op.method, path: op.path, summary: op.summary, opId: op.operationId });
          }
        }
      }

      if (matches.length === 0) {
        addLine('<span class="t-dim">No operations matching: ' + escHtml(pathFilter) + '</span>');
        addLine('');
        return;
      }

      addLine('<span class="t-accent">API OPERATIONS</span> <span class="t-dim">matching ' + escHtml(pathFilter) + ' (' + matches.length + ' results)</span>');
      addLine('');

      var methodColors = { GET: 't-success', POST: 't-value', PUT: 't-accent', DELETE: 't-error', PATCH: 't-accent' };
      for (var m = 0; m < matches.length; m++) {
        var match = matches[m];
        var tree2 = m < matches.length - 1 ? '\u251C\u2500' : '\u2514\u2500';
        var mCls = methodColors[match.method] || 't-dim';
        addLine('  <span class="t-tree">' + tree2 + '</span> <span class="' + mCls + '">' + padRight(match.method, 8) + '</span>' + padRight(match.path, 36) + '<span class="t-dim">' + (match.summary || '') + '</span>');
      }
      addLine('');
    });
  }

  /* ── savm — Smart Asset VM instruction set ── */
  function cmdSavm() {
    var categories = [
      { name: 'Stack',       ops: 'PUSH, POP, DUP, SWAP, OVER',                  count: 5 },
      { name: 'Arithmetic',  ops: 'ADD, SUB, MUL, DIV, MOD, NEG',                count: 6 },
      { name: 'Comparison',  ops: 'EQ, NEQ, LT, GT, LTE, GTE',                   count: 6 },
      { name: 'Logic',       ops: 'AND, OR, NOT, XOR',                            count: 4 },
      { name: 'Memory',      ops: 'LOAD, STORE, MSIZE',                           count: 3 },
      { name: 'Storage',     ops: 'SLOAD, SSTORE, SHAS',                          count: 3 },
      { name: 'Control',     ops: 'JUMP, JUMPI, JUMPDEST, HALT, REVERT',          count: 5 },
      { name: 'Context',     ops: 'CALLER, ORIGIN, ZONE, JURISDICTION',            count: 4 },
      { name: 'Compliance',  ops: 'CCHECK, CEVAL, CLOAD, CSTORE',                 count: 4 },
      { name: 'Migration',   ops: 'MDOMICILE, MATTEST, MRECEIPT',                 count: 3 },
      { name: 'Crypto',      ops: 'SHA256, ED25519_VERIFY',                        count: 2 },
      { name: 'System',      ops: 'LOG, TIMESTAMP, NONCE, NOP',                    count: 4 }
    ];

    var totalOps = 0;
    for (var i = 0; i < categories.length; i++) totalOps += categories[i].count;

    addLine('');
    addLine('<span class="t-accent">SMART ASSET VM</span> <span class="t-dim">(SAVM) \u2014 ' + totalOps + ' opcodes, stack-based, gas-metered</span>');
    addLine('<span class="t-dim">Compliance coprocessor architecture</span>');
    addLine('');
    addLine('  <span class="t-label">INSTRUCTION SET</span>');
    addLine('');

    for (var c = 0; c < categories.length; c++) {
      var cat = categories[c];
      var tree = c < categories.length - 1 ? '\u251C\u2500' : '\u2514\u2500';
      addLine('  <span class="t-tree">' + tree + '</span> ' + padRight(cat.name, 14) + '<span class="t-value">' + padRight(cat.count + ' ops', 8) + '</span><span class="t-dim">' + cat.ops + '</span>');
    }

    addLine('');
    addLine('  <span class="t-label">EXECUTION MODEL</span>');
    addLine('');
    addLine('  <span class="t-tree">\u251C\u2500</span> Pipeline         <span class="t-dim">fetch \u2192 decode \u2192 meter \u2192 execute \u2192 receipt</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Gas metering      <span class="t-dim">Per-opcode gas schedule, fail-closed on limit</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Compliance        <span class="t-dim">CCHECK / CEVAL bridge to 23-domain tensor</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Receipts          <span class="t-dim">Hash-chained execution receipts (SHA-256)</span>');
    addLine('  <span class="t-tree">\u2514\u2500</span> Compilation       <span class="t-dim">Regulatory policy \u2192 bytecode (compiler.rs)</span>');
    addLine('');
    addLine('  <span class="t-label">COPROCESSOR OPCODES</span>');
    addLine('');
    addLine('  <span class="t-tree">\u251C\u2500</span> <span class="t-value">CCHECK</span>   <span class="t-dim">Push compliance result for domain onto stack</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> <span class="t-value">CEVAL</span>    <span class="t-dim">Evaluate full 23-domain tensor, push pass/fail</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> <span class="t-value">CLOAD</span>   <span class="t-dim">Load compliance state from tensor into memory</span>');
    addLine('  <span class="t-tree">\u2514\u2500</span> <span class="t-value">CSTORE</span>  <span class="t-dim">Write compliance evidence to tensor storage</span>');
    addLine('');
    addLine('  <span class="t-dim">The SAVM compiles regulatory requirements into executable bytecode.</span>');
    addLine('  <span class="t-dim">Every asset evaluation runs through the compliance coprocessor.</span>');
    addLine('');
  }

  /* ── pipe (fees) — corridor fee stack ── */
  function cmdPipe(args) {
    var parts = args.trim().split(/\s+/);
    var fromId = parts[1] ? parts[1].toLowerCase() : null;
    var toId = parts[2] ? parts[2].toLowerCase() : null;

    if (!fromId || !toId) {
      addLine('');
      addLine('<span class="t-dim">Usage: pipe &lt;from&gt; &lt;to&gt;</span>');
      addLine('<span class="t-dim">Example: pipe adgm sg</span>');
      addLine('');
      return;
    }

    var fromZone = findZone(fromId);
    var toZone = findZone(toId);
    if (!fromZone) { addLine('<span class="t-error">Unknown zone: ' + escHtml(fromId) + '</span>'); return; }
    if (!toZone) { addLine('<span class="t-error">Unknown zone: ' + escHtml(toId) + '</span>'); return; }

    addLine('');
    addLine('<span class="t-accent">CORRIDOR FEE STACK</span>  <span class="t-dim">' + fromZone.name + ' \u2192 ' + toZone.name + '</span>');
    addLine('');

    var fees = [
      { layer: 'Compliance evaluation',      amount: '$500',    note: '23-domain tensor computation' },
      { layer: 'Corridor transit fee',        amount: '$1,200',  note: 'Cross-border state machine transition' },
      { layer: 'Settlement anchoring',        amount: '$800',    note: 'Receipt chain + watcher attestations' },
      { layer: 'Domicile re-registration',    amount: '$400',    note: 'Target jurisdiction registration' }
    ];

    var total = 0;
    addLine('  <span class="t-label">FLAT FEES</span>');
    addLine('');
    for (var i = 0; i < fees.length; i++) {
      var fee = fees[i];
      var tree = i < fees.length - 1 ? '\u251C\u2500' : '\u2514\u2500';
      addLine('  <span class="t-tree">' + tree + '</span> ' + padRight(fee.layer, 30) + '<span class="t-value">' + padRight(fee.amount, 10) + '</span><span class="t-dim">' + fee.note + '</span>');
      total += parseInt(fee.amount.replace(/[$,]/g, ''));
    }

    addLine('');
    addLine('  <span class="t-label">VARIABLE FEES</span>');
    addLine('');
    addLine('  <span class="t-tree">\u251C\u2500</span> ' + padRight('FX conversion', 30) + '<span class="t-value">' + padRight('25 bps', 10) + '</span><span class="t-dim">If currency conversion required</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> ' + padRight('Settlement routing', 30) + '<span class="t-value">' + padRight('10 bps', 10) + '</span><span class="t-dim">SWIFT / digital cash / local rails</span>');
    addLine('  <span class="t-tree">\u2514\u2500</span> ' + padRight('Insurance / guarantee', 30) + '<span class="t-value">' + padRight('5-50 bps', 10) + '</span><span class="t-dim">Risk-weighted, optional</span>');

    addLine('');
    addLine('  <span class="t-label">TOTAL (FLAT)</span>     <span class="t-value">$' + total.toLocaleString() + '</span>');
    addLine('');

    addLine('  <span class="t-label">COMPARISON</span>');
    addLine('');
    addLine('  <span class="t-tree">\u251C\u2500</span> ' + padRight('Traditional correspondent banking', 38) + '<span class="t-dim">$5,000\u201315,000 + 7\u201314 days</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> ' + padRight('SWIFT gpi', 38) + '<span class="t-dim">$2,500\u20135,000 + 1\u20133 days</span>');
    addLine('  <span class="t-tree">\u2514\u2500</span> ' + padRight('Momentum corridor', 38) + '<span class="t-value">$' + total.toLocaleString() + ' + 40 bps + 4.2 seconds</span>');
    addLine('');
  }

  /* ══════════════════════════════════════
     GOVERNMENT COMMANDS
     ══════════════════════════════════════ */

  /* ── govos ── */
  function cmdGovos(args) {
    var parts = args.split(/\s+/);
    var zoneArg = parts[1];
    var zone = zoneArg ? findZone(zoneArg) : null;
    if (!zone) {
      zone = findZone('adgm'); /* default */
    }

    /* Simulated zone-specific metrics */
    var metrics = {
      'adgm':     { entities: 847,  formed_month: 34,  compliance: '98.1%', corridors: 6, revenue: '$2.4M',  staff: 12, status: 'Operational' },
      'pk':       { entities: 1247, formed_month: 89,  compliance: '96.2%', corridors: 4, revenue: 'PKR 47.2M', staff: 24, status: 'Operational' },
      'sg':       { entities: 412,  formed_month: 18,  compliance: '99.3%', corridors: 8, revenue: 'SGD 1.8M', staff: 8, status: 'Operational' },
      'prospera': { entities: 523,  formed_month: 41,  compliance: '97.8%', corridors: 7, revenue: '$890K',  staff: 6, status: 'Independent' },
      'us':       { entities: 2340, formed_month: 156, compliance: '95.4%', corridors: 5, revenue: '$4.1M',  staff: 0, status: 'Operational' },
      'dfzc':     { entities: 0,    formed_month: 0,   compliance: 'N/A',   corridors: 0, revenue: '$0',     staff: 0, status: 'Testnet' },
      'hk':       { entities: 289,  formed_month: 12,  compliance: '98.7%', corridors: 5, revenue: 'HKD 9.2M', staff: 4, status: 'Operational' }
    };
    var m = metrics[zone.id] || { entities: 0, formed_month: 0, compliance: 'N/A', corridors: 0, revenue: '$0', staff: 0, status: zone.status === 'live' ? 'Operational' : statusText(zone.status) };

    addLine('');
    addLine('<span class="t-accent">GOVOS CONSOLE</span> <span class="t-dim">\u2014 ' + escHtml(zone.name) + '</span>');
    addLine('');
    addLine('  <span class="t-label">ZONE STATUS</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Jurisdiction         ' + escHtml(zone.name) + ' (' + escHtml(zone.framework) + ')');
    addLine('  <span class="t-tree">\u251C\u2500</span> Status               ' + statusLabel(zone.status));
    addLine('  <span class="t-tree">\u2514\u2500</span> Operational status   <span class="t-value">' + m.status + '</span>');
    addLine('');
    addLine('  <span class="t-label">ENTITIES</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Total entities       <span class="t-value">' + m.entities.toLocaleString() + '</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Formed this month    <span class="t-value">' + m.formed_month + '</span>');
    addLine('  <span class="t-tree">\u2514\u2500</span> Compliance score     <span class="t-value">' + m.compliance + '</span>');
    addLine('');
    addLine('  <span class="t-label">REVENUE & CORRIDORS</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Statutory fees MTD   <span class="t-value">' + m.revenue + '</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Active corridors     <span class="t-value">' + m.corridors + '</span>');
    addLine('  <span class="t-tree">\u2514\u2500</span> Government staff     <span class="t-value">' + m.staff + '</span>');
    addLine('');
    addLine('<span class="t-dim">Console endpoints: /v1/govos/console, /v1/govos/tax-revenue, /v1/govos/licensing</span>');
    addLine('<span class="t-dim">See also: audit &lt;entity-id&gt;, sovereignty, training</span>');
    addLine('');
  }

  /* ── integrate ── */
  function cmdIntegrate(args) {
    var parts = args.split(/\s+/);
    var systemType = (parts[1] || '').toLowerCase();

    var systems = {
      identity: {
        name: 'National Identity System',
        adapters: ['NADRA CNIC (Pakistan)', 'SeyID (Seychelles)', 'Emirates ID (UAE)', 'MyInfo NRIC (Singapore)', 'Aadhaar (India)', 'HMRC NINO (UK)'],
        primitive: 'Identity',
        endpoints: ['POST /v1/identity/verify', 'GET /v1/identity/{id}/attestations', 'POST /v1/identity/national-id/verify'],
        flow: [
          'Government ID system  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500',
          '       \u2502                                           ',
          '       \u2502  OAuth 2.0 client credentials             ',
          '       \u25BC                                           ',
          'National ID Adapter  \u2500\u2500  field mapping + retry  ',
          '       \u2502                                           ',
          '       \u25BC                                           ',
          'Identity Primitive   \u2500\u2500  KYC/KYB attestation   ',
          '       \u2502                                           ',
          '       \u25BC                                           ',
          'Compliance Tensor    \u2500\u2500  23-domain evaluation   '
        ],
        timeline: '7\u201314 days (adapter development + testing)',
        prereqs: 'API access to national ID system, OAuth 2.0 credentials, field mapping specification'
      },
      tax: {
        name: 'Tax Authority',
        adapters: ['FBR IRIS (Pakistan)', 'FTA TRN (UAE)', 'IRS EIN (US)', 'HMRC UTR (UK)', 'FL DOR (Florida)'],
        primitive: 'Fiscal',
        endpoints: ['POST /v1/fiscal/tax-event', 'GET /v1/fiscal/withholding-rules', 'POST /v1/fiscal/filing'],
        flow: [
          'Tax Authority API    \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500',
          '       \u2502                                           ',
          '       \u25BC                                           ',
          'Tax Adapter          \u2500\u2500  withholding rules     ',
          '       \u2502                                           ',
          '       \u25BC                                           ',
          'Fiscal Primitive     \u2500\u2500  tax event tracking    ',
          '       \u2502                                           ',
          '       \u25BC                                           ',
          'Tax Pipeline         \u2500\u2500  auto withholding      '
        ],
        timeline: '14\u201321 days (depends on tax authority API availability)',
        prereqs: 'Tax authority API access, withholding rule specification, tax treaty mappings'
      },
      registry: {
        name: 'Company Registry',
        adapters: ['SECP eServices (Pakistan)', 'ADGM-RA (Abu Dhabi)', 'DE Div of Corps (Delaware)', 'SunBiz (Florida)', 'ACRA (Singapore)', 'Companies House (UK)'],
        primitive: 'Entity',
        endpoints: ['POST /v1/entities', 'POST /v1/entities/{id}/filing', 'GET /v1/entities/{id}/registrar-status'],
        flow: [
          'Company Registrar    \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500',
          '       \u2502                                           ',
          '       \u25BC                                           ',
          'Filing Adapter       \u2500\u2500  document submission   ',
          '       \u2502                                           ',
          '       \u25BC                                           ',
          'Entity Primitive     \u2500\u2500  lifecycle management  ',
          '       \u2502                                           ',
          '       \u25BC                                           ',
          'Templating Engine    \u2500\u2500  PDF + e-signature     '
        ],
        timeline: '14\u201328 days (depends on registrar e-filing API)',
        prereqs: 'Registrar API access, filing type specification, fee schedule, document templates'
      },
      banking: {
        name: 'Central Bank / Payment System',
        adapters: ['SBP Raast (Pakistan)', 'CBS RTGS (Seychelles)', 'SWIFT ISO 20022', 'Regulated Digital Cash', 'Open Banking A2A'],
        primitive: 'Fiscal',
        endpoints: ['POST /v1/fiscal/payment', 'GET /v1/fiscal/settlement-status', 'POST /v1/corridors/{id}/settle'],
        flow: [
          'Central Bank / PSP   \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500',
          '       \u2502                                           ',
          '       \u25BC                                           ',
          'Payment Adapter      \u2500\u2500  SWIFT / RTGS / A2A   ',
          '       \u2502                                           ',
          '       \u25BC                                           ',
          'Fiscal Primitive     \u2500\u2500  settlement tracking   ',
          '       \u2502                                           ',
          '       \u25BC                                           ',
          'Corridor Receipt     \u2500\u2500  MMR chain + VC        '
        ],
        timeline: '21\u201342 days (banking integrations require compliance review)',
        prereqs: 'Payment system API access, settlement type selection, AML/CFT compliance approval'
      },
      licensing: {
        name: 'Licensing Authority',
        adapters: ['CSP Registrar (Seychelles)', 'VASP Authority', 'Professional Licensing Board', 'Building Permits Authority'],
        primitive: 'Entity + Licensepack',
        endpoints: ['GET /v1/govos/licensing', 'POST /v1/entities/{id}/license', 'GET /v1/entities/{id}/licenses'],
        flow: [
          'Licensing Authority  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500',
          '       \u2502                                           ',
          '       \u25BC                                           ',
          'Licensepack          \u2500\u2500  15+ license categories',
          '       \u2502                                           ',
          '       \u25BC                                           ',
          'Entity Primitive     \u2500\u2500  license lifecycle     ',
          '       \u2502                                           ',
          '       \u25BC                                           ',
          'GovOS Dashboard      \u2500\u2500  renewals + compliance '
        ],
        timeline: '7\u201314 days (license category configuration)',
        prereqs: 'License category list, fee schedule, renewal rules, issuing authority'
      }
    };

    if (!systemType || !systems[systemType]) {
      addLine('');
      addLine('<span class="t-accent">INTEGRATION ARCHITECTURE</span>');
      addLine('');
      addLine('<span class="t-dim">Usage: integrate &lt;system-type&gt;</span>');
      addLine('');
      var sysKeys = Object.keys(systems);
      for (var s = 0; s < sysKeys.length; s++) {
        var tree = s < sysKeys.length - 1 ? '\u251C\u2500' : '\u2514\u2500';
        addLine('  <span class="t-tree">' + tree + '</span> <span class="t-accent">' + padRight(sysKeys[s], 16) + '</span> <span class="t-dim">' + systems[sysKeys[s]].name + '</span>');
      }
      addLine('');
      return;
    }

    var sys = systems[systemType];
    addLine('');
    addLine('<span class="t-accent">INTEGRATION: ' + sys.name.toUpperCase() + '</span>');
    addLine('');
    addLine('  <span class="t-label">MASS PRIMITIVE</span>     ' + sys.primitive);
    addLine('');
    addLine('  <span class="t-label">AVAILABLE ADAPTERS</span>');
    for (var a = 0; a < sys.adapters.length; a++) {
      var at = a < sys.adapters.length - 1 ? '\u251C\u2500' : '\u2514\u2500';
      addLine('  <span class="t-tree">' + at + '</span> ' + escHtml(sys.adapters[a]));
    }
    addLine('');
    addLine('  <span class="t-label">DATA FLOW</span>');
    addLine('');
    for (var f = 0; f < sys.flow.length; f++) {
      addLine('  <span class="t-dim">' + sys.flow[f] + '</span>');
    }
    addLine('');
    addLine('  <span class="t-label">API ENDPOINTS</span>');
    for (var e = 0; e < sys.endpoints.length; e++) {
      var et = e < sys.endpoints.length - 1 ? '\u251C\u2500' : '\u2514\u2500';
      addLine('  <span class="t-tree">' + et + '</span> <span class="t-value">' + escHtml(sys.endpoints[e]) + '</span>');
    }
    addLine('');
    addLine('  <span class="t-label">TIMELINE</span>          ' + sys.timeline);
    addLine('  <span class="t-label">PREREQUISITES</span>     <span class="t-dim">' + escHtml(sys.prereqs) + '</span>');
    addLine('');
  }

  /* ── training ── */
  function cmdTraining(args) {
    var parts = args.split(/\s+/);
    var phase = (parts[1] || '').toLowerCase();

    var phases = {
      foundation: {
        label: 'FOUNDATION', days: '1\u201330',
        topics: [
          'Platform architecture: five primitives, service bus model, adapter pattern',
          'API surface walkthrough: 597 OpenAPI paths and 656 operations',
          'Sandbox deployment: Docker Compose local environment',
          'First adapter integration: national identity system',
          'Compliance tensor: 23 domains, fail-closed evaluation',
          'Document lifecycle: template \u2192 PDF \u2192 signing \u2192 filing'
        ],
        exercises: [
          'Form 10 entities across 3 entity types',
          'Run compliance check across 23 compliance domains',
          'Inspect operation DAG for entity.incorporate',
          'Configure a document template and collect a test signature',
          'Connect national ID adapter to sandbox'
        ],
        deliverable: 'Team demonstrates API comprehension. Sandbox running. Identity adapter connected.'
      },
      operations: {
        label: 'OPERATIONS', days: '31\u201360',
        topics: [
          'Production deployment: Kubernetes, Terraform, secrets management',
          'Regulator dashboard configuration: compliance views, alert thresholds',
          'Document template customization: jurisdiction-specific filings',
          'Filing adapter testing: submit test filings to registrar sandbox',
          'Licensepack configuration: add zone-specific license categories',
          'GovOS console: tax revenue, free zone ops, licensing dashboard'
        ],
        exercises: [
          'Process first production entity formation independently',
          'Configure regulator dashboard for local compliance authority',
          'Build first custom service on APIs (building permit application)',
          'Submit test filing to registrar and track lifecycle',
          'Configure 3 license categories in licensepack'
        ],
        deliverable: 'First production use case executed. Regulator dashboard live. Filing adapters tested.'
      },
      independence: {
        label: 'INDEPENDENCE', days: '61\u201390',
        topics: [
          'Full operational handoff procedures',
          'Incident response: compliance alerts, system failures, data recovery',
          'Pack update workflow: amending lawpacks when legislation changes',
          'Regpack updates: ingesting new sanctions lists, regulatory changes',
          'Corridor management: creating, monitoring, troubleshooting corridors',
          'Performance tuning: monitoring, scaling, backup procedures'
        ],
        exercises: [
          'Deploy a zone update independently (zero-downtime)',
          'Configure a new license category end-to-end',
          'Process entity formation with document signing and registrar filing',
          'Investigate and resolve a compliance alert',
          'Modify a lawpack to reflect a legislation change'
        ],
        deliverable: 'Certification passed. All credentials transferred. Government operates independently.'
      }
    };

    if (!phase || !phases[phase]) {
      addLine('');
      addLine('<span class="t-accent">OPERATIONAL INDEPENDENCE TRAINING</span>');
      addLine('');
      addLine('<span class="t-dim">Usage: training &lt;phase&gt;</span>');
      addLine('');
      addLine('  <span class="t-tree">\u251C\u2500</span> <span class="t-accent">' + padRight('foundation', 16) + '</span> <span class="t-dim">Days 1\u201330: Architecture, APIs, sandbox, first adapter</span>');
      addLine('  <span class="t-tree">\u251C\u2500</span> <span class="t-accent">' + padRight('operations', 16) + '</span> <span class="t-dim">Days 31\u201360: Production, regulator dashboard, filing</span>');
      addLine('  <span class="t-tree">\u2514\u2500</span> <span class="t-accent">' + padRight('independence', 16) + '</span> <span class="t-dim">Days 61\u201390: Handoff, certification, sovereignty</span>');
      addLine('');
      addLine('<span class="t-dim">Evidence: Pr\u00f3spera, Honduras. 87 days. 500+ entities. Local staff operate independently.</span>');
      addLine('');
      return;
    }

    var p = phases[phase];
    addLine('');
    addLine('<span class="t-accent">TRAINING: ' + p.label + '</span> <span class="t-dim">(Days ' + p.days + ')</span>');
    addLine('');
    addLine('  <span class="t-label">TOPICS</span>');
    for (var t = 0; t < p.topics.length; t++) {
      var tt = t < p.topics.length - 1 ? '\u251C\u2500' : '\u2514\u2500';
      addLine('  <span class="t-tree">' + tt + '</span> ' + escHtml(p.topics[t]));
    }
    addLine('');
    addLine('  <span class="t-label">HANDS-ON EXERCISES</span>');
    for (var x = 0; x < p.exercises.length; x++) {
      var xt = x < p.exercises.length - 1 ? '\u251C\u2500' : '\u2514\u2500';
      addLine('  <span class="t-tree">' + xt + '</span> ' + escHtml(p.exercises[x]));
    }
    addLine('');
    addLine('  <span class="t-label">DELIVERABLE</span>');
    addLine('  ' + escHtml(p.deliverable));
    addLine('');
  }

  /* ── costs ── */
  function cmdCosts(args) {
    var parts = args.split(/\s+/);
    var zoneArg = parts[1];
    var zone = zoneArg ? findZone(zoneArg) : null;

    addLine('');
    addLine('<span class="t-accent">DEPLOYMENT COST ESTIMATOR</span>' + (zone ? ' <span class="t-dim">\u2014 ' + escHtml(zone.name) + '</span>' : ''));
    addLine('');
    addLine('  <span class="t-label">INFRASTRUCTURE (monthly)</span>');
    addLine('');
    addLine('  <span class="t-tree">\u251C\u2500</span> ' + padRight('Sovereign (on-premise)', 34) + '<span class="t-value">$4,200\u2013$6,800</span>');
    addLine('     <span class="t-dim">8 vCPU, 32GB RAM, 500GB SSD, PostgreSQL 16, Redis 7</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> ' + padRight('Hybrid', 34) + '<span class="t-value">$2,800\u2013$4,500</span>');
    addLine('     <span class="t-dim">Identity + entity on-premise, corridors via cloud</span>');
    addLine('  <span class="t-tree">\u2514\u2500</span> ' + padRight('Cloud (AWS/Azure)', 34) + '<span class="t-value">$1,500\u2013$3,200</span>');
    addLine('     <span class="t-dim">EKS + RDS + KMS. Customer-managed encryption keys.</span>');
    addLine('');
    addLine('  <span class="t-label">STAFFING</span>');
    addLine('');
    addLine('  <span class="t-tree">\u251C\u2500</span> ' + padRight('Minimum (small zone)', 34) + '<span class="t-value">3\u20134 staff</span>');
    addLine('     <span class="t-dim">1 platform admin, 1 compliance officer, 1\u20132 developers</span>');
    addLine('  <span class="t-tree">\u2514\u2500</span> ' + padRight('Full (national deployment)', 34) + '<span class="t-value">8\u201315 staff</span>');
    addLine('     <span class="t-dim">+ regulator staff, filing officers, support team</span>');
    addLine('');
    addLine('  <span class="t-label">ONE-TIME SETUP</span>');
    addLine('');
    addLine('  <span class="t-tree">\u251C\u2500</span> ' + padRight('Platform deployment', 34) + '<span class="t-value">$0</span> <span class="t-dim">(Momentum covers during pilot)</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> ' + padRight('Adapter development', 34) + '<span class="t-value">$0</span> <span class="t-dim">(included in 90-day deployment)</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> ' + padRight('Training (3 phases)', 34) + '<span class="t-value">$0</span> <span class="t-dim">(contractual deliverable)</span>');
    addLine('  <span class="t-tree">\u2514\u2500</span> ' + padRight('Total upfront to government', 34) + '<span class="t-value">$0</span>');
    addLine('');
    addLine('<span class="t-dim">EZ Stack deployment: 90 days, &lt;$10M total (Momentum investment). Government cost: staff time only.</span>');
    addLine('');
  }

  /* ── sovereignty ── */
  function cmdSovereignty() {
    addLine('');
    addLine('<span class="t-accent">SOVEREIGNTY ARCHITECTURE</span>');
    addLine('');
    addLine('  <span class="t-label">1. DATA SOVEREIGNTY</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Encryption at rest         AES-256-GCM, field-level encryption');
    addLine('  <span class="t-tree">\u251C\u2500</span> Encryption in transit       TLS 1.3, mTLS between services');
    addLine('  <span class="t-tree">\u251C\u2500</span> Key custody                 Government holds all encryption keys');
    addLine('  <span class="t-tree">\u251C\u2500</span> On-premise option           Full sovereign deployment available');
    addLine('  <span class="t-tree">\u2514\u2500</span> Data residency              Citizen data never leaves sovereign infra');
    addLine('');
    addLine('  <span class="t-label">2. REGULATORY SOVEREIGNTY</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Rule layer                  Directly editable by government staff');
    addLine('  <span class="t-tree">\u251C\u2500</span> Lawpacks                    Government defines operation rules');
    addLine('  <span class="t-tree">\u251C\u2500</span> Regpacks                    Government controls sanctions/regulatory state');
    addLine('  <span class="t-tree">\u251C\u2500</span> Licensepacks                Government defines license categories');
    addLine('  <span class="t-tree">\u2514\u2500</span> Compliance tensor           Government sets domain thresholds');
    addLine('');
    addLine('  <span class="t-label">3. OPERATIONAL SOVEREIGNTY</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Staff independence          By Day 90 (contractual)');
    addLine('  <span class="t-tree">\u251C\u2500</span> Certification               5-point competency exam');
    addLine('  <span class="t-tree">\u251C\u2500</span> Documentation               Full platform docs transferred');
    addLine('  <span class="t-tree">\u251C\u2500</span> Credentials                 All API keys, certificates, tokens');
    addLine('  <span class="t-tree">\u2514\u2500</span> Evidence                    <span class="t-value">Pr\u00f3spera: local staff operate independently</span>');
    addLine('');
    addLine('  <span class="t-label">4. EXIT SOVEREIGNTY</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Termination clause          Exit at Day 90 if deliverables unmet');
    addLine('  <span class="t-tree">\u251C\u2500</span> Code retention              Government retains all deployed code');
    addLine('  <span class="t-tree">\u251C\u2500</span> Data retention              All data stays with government');
    addLine('  <span class="t-tree">\u251C\u2500</span> No lock-in                  Standard APIs, no proprietary formats');
    addLine('  <span class="t-tree">\u2514\u2500</span> Transition period           90-day support after termination');
    addLine('');
  }

  /* ── audit ── */
  function cmdAudit(args) {
    var parts = args.split(/\s+/);
    var entityId = parts[1] || 'ATL-00147';

    /* Simulated entity dossier for audit view */
    addLine('');
    addLine('<span class="t-accent">GOVERNMENT AUDIT VIEW</span> <span class="t-dim">\u2014 ' + escHtml(entityId) + '</span>');
    addLine('');
    addLine('  <span class="t-label">ENTITY</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> ID                   <span class="t-value">' + escHtml(entityId) + '</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Name                 Acme Ventures LLC');
    addLine('  <span class="t-tree">\u251C\u2500</span> Jurisdiction         Delaware (DGCL Title 8)');
    addLine('  <span class="t-tree">\u251C\u2500</span> Status               <span class="t-success">Active</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Formation date       2026-01-15T09:23:47Z');
    addLine('  <span class="t-tree">\u2514\u2500</span> Formation time       47s');
    addLine('');
    addLine('  <span class="t-label">COMPLIANCE TENSOR (23 domains)</span>');
    addLine('');
    var tensorDomains = [
      { name: 'AML',             status: 'pass' },
      { name: 'KYC',             status: 'pass' },
      { name: 'Sanctions',       status: 'pass' },
      { name: 'Tax',             status: 'pass' },
      { name: 'Securities',      status: 'pass' },
      { name: 'Corporate',       status: 'pass' },
      { name: 'Custody',         status: 'pass' },
      { name: 'Data Privacy',    status: 'pass' },
      { name: 'Licensing',       status: 'pass' },
      { name: 'Banking',         status: 'pass' },
      { name: 'Payments',        status: 'pass' },
      { name: 'Clearing',        status: 'n/a' },
      { name: 'Settlement',      status: 'n/a' },
      { name: 'Digital Assets',  status: 'n/a' },
      { name: 'Employment',      status: 'pending' },
      { name: 'Immigration',     status: 'pending' },
      { name: 'IP',              status: 'pass' },
      { name: 'Consumer Prot.',  status: 'n/a' },
      { name: 'Arbitration',     status: 'pass' },
      { name: 'Trade',           status: 'pass' },
      { name: 'Insurance',       status: 'n/a' },
      { name: 'Anti-Bribery',    status: 'pass' },
      { name: 'Sharia',          status: 'n/a' }
    ];
    for (var d = 0; d < tensorDomains.length; d++) {
      var td = tensorDomains[d];
      var st = td.status === 'pass' ? '<span class="t-success">\u2713 pass</span>' : td.status === 'pending' ? '<span class="t-testnet">pending</span>' : '<span class="t-dim">n/a</span>';
      addLine('  ' + padRight(td.name, 20) + st);
    }
    addLine('');
    addLine('  <span class="t-label">CORRIDOR ACTIVITY</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Recognized in        3 peer zones (ADGM, SG-MAS, HK-SFC)');
    addLine('  <span class="t-tree">\u251C\u2500</span> Corridor receipts    47 (last 30 days)');
    addLine('  <span class="t-tree">\u2514\u2500</span> Settlement volume    $2.3M');
    addLine('');
    addLine('  <span class="t-label">OWNERSHIP CHANGES</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Share classes        2 (Common A, Preferred B)');
    addLine('  <span class="t-tree">\u251C\u2500</span> Shareholders         4');
    addLine('  <span class="t-tree">\u2514\u2500</span> Last transfer        2026-02-18T14:22:01Z');
    addLine('');
    addLine('  <span class="t-label">CONSENT HISTORY</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Board resolutions    3 (all approved)');
    addLine('  <span class="t-tree">\u251C\u2500</span> Shareholder votes    1');
    addLine('  <span class="t-tree">\u2514\u2500</span> Last consent         2026-03-01T10:15:22Z');
    addLine('');
    addLine('  <span class="t-label">AUDIT CHAIN</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Attestations         12 VCs issued');
    addLine('  <span class="t-tree">\u251C\u2500</span> Hash chain           eval #47 SHA-256(prev) \u2192 0x8f2a...');
    addLine('  <span class="t-tree">\u2514\u2500</span> Tamper check         <span class="t-success">none detected</span>');
    addLine('');
  }

  /* ── documents ── */
  function cmdDocuments(args) {
    var parts = args.split(/\s+/);
    var opType = parts[1] || '';

    var docSpecs = {
      'entity.rename': {
        label: 'entity.rename',
        jurisdictions: [
          { jid: 'Delaware', grouping: 'consent', docs: ['Certificate of Amendment'], signers: ['officer (president/secretary)'], registrar: 'Delaware Division of Corporations', filing_type: 'amendment', fee: '$150', timeline: '3\u20135 business days' },
          { jid: 'ADGM', grouping: 'consent', docs: ['Special Resolution'], signers: ['authorized_signatory'], registrar: 'ADGM Registration Authority', filing_type: 'amendment', fee: '$100', timeline: '1\u20132 business days' }
        ]
      },
      'entity.incorporate': {
        label: 'entity.incorporate',
        jurisdictions: [
          { jid: 'Delaware', grouping: 'agreement', docs: ['Bylaws', 'Operating Agreement'], signers: ['officer'], registrar: 'Delaware Division of Corporations', filing_type: 'incorporation', fee: '$300', timeline: '1\u20133 business days' },
          { jid: 'ADGM', grouping: 'agreement', docs: ['Shareholder Agreement', 'Bylaws'], signers: ['authorized_signatory', 'witness'], registrar: 'ADGM Registration Authority', filing_type: 'incorporation', fee: '$2,000', timeline: '5\u201310 business days' },
          { jid: 'Pakistan', grouping: 'agreement', docs: ['Operating Agreement', 'Board Resolution'], signers: ['officer', 'witness'], registrar: 'SECP eServices', filing_type: 'incorporation', fee: 'PKR 10,000', timeline: '3\u20137 business days' }
        ]
      },
      'entity.dissolve': {
        label: 'entity.dissolve',
        jurisdictions: [
          { jid: 'Delaware', grouping: 'consent', docs: ['Certificate of Dissolution', 'Board Resolution'], signers: ['officer'], registrar: 'Delaware Division of Corporations', filing_type: 'dissolution', fee: '$204', timeline: '5\u201310 business days' }
        ]
      },
      'ownership.issue_shares': {
        label: 'ownership.issue_shares',
        jurisdictions: [
          { jid: 'Delaware', grouping: 'equity_offer', docs: ['Stock Certificate', 'Stock Purchase Agreement', '83(b) Election'], signers: ['officer', 'recipient'], registrar: 'N/A (internal)', filing_type: 'N/A', fee: '$0', timeline: 'Immediate' }
        ]
      }
    };

    if (!opType || !docSpecs[opType]) {
      addLine('');
      addLine('<span class="t-accent">DOCUMENT PIPELINE</span>');
      addLine('');
      addLine('<span class="t-dim">Usage: documents &lt;operation-type&gt;</span>');
      addLine('');
      var docKeys = Object.keys(docSpecs);
      for (var dk = 0; dk < docKeys.length; dk++) {
        var dkt = dk < docKeys.length - 1 ? '\u251C\u2500' : '\u2514\u2500';
        addLine('  <span class="t-tree">' + dkt + '</span> <span class="t-accent">' + padRight(docKeys[dk], 28) + '</span> <span class="t-dim">' + docSpecs[docKeys[dk]].jurisdictions.length + ' jurisdiction variants</span>');
      }
      addLine('');
      addLine('<span class="t-dim">Pipeline: lawpack \u2192 template resolution \u2192 PDF generation \u2192 e-signature \u2192 registrar filing</span>');
      addLine('');
      return;
    }

    var spec = docSpecs[opType];
    addLine('');
    addLine('<span class="t-accent">DOCUMENT PIPELINE: ' + escHtml(spec.label) + '</span>');

    for (var j = 0; j < spec.jurisdictions.length; j++) {
      var jd = spec.jurisdictions[j];
      addLine('');
      addLine('  <span class="t-label">' + jd.jid.toUpperCase() + '</span>');
      addLine('  <span class="t-tree">\u251C\u2500</span> Template grouping    <span class="t-value">' + escHtml(jd.grouping) + '</span>');
      addLine('  <span class="t-tree">\u251C\u2500</span> Documents            ' + jd.docs.join(', '));
      addLine('  <span class="t-tree">\u251C\u2500</span> Signing roles        ' + jd.signers.join(', '));
      addLine('  <span class="t-tree">\u251C\u2500</span> Registrar            ' + escHtml(jd.registrar));
      addLine('  <span class="t-tree">\u251C\u2500</span> Filing type          ' + escHtml(jd.filing_type));
      addLine('  <span class="t-tree">\u251C\u2500</span> Fee                  <span class="t-value">' + escHtml(jd.fee) + '</span>');
      addLine('  <span class="t-tree">\u2514\u2500</span> Processing time      ' + escHtml(jd.timeline));
    }
    addLine('');
    addLine('<span class="t-dim">Lifecycle: Submitted \u2192 UnderReview \u2192 Approved / Rejected / RequiresCorrection</span>');
    addLine('');
  }

  /* ── filing ── */
  function cmdFiling(args) {
    var parts = args.split(/\s+/);
    var jArg = (parts[1] || '').toLowerCase();

    var filingAdapters = {
      'pakistan':   { registrar: 'SECP eServices', country: 'Pakistan', types: ['incorporation', 'amendment', 'dissolution', 'annual_return', 'name_reservation'], endpoint: 'eservices.secp.gov.pk', avg_days: '3\u20137', fees: 'PKR 5,000\u201325,000' },
      'adgm':      { registrar: 'ADGM Registration Authority', country: 'UAE', types: ['incorporation', 'amendment', 'dissolution', 'annual_return'], endpoint: 'ra.adgm.com/api', avg_days: '1\u20132', fees: '$100\u2013$2,000' },
      'delaware':  { registrar: 'Delaware Division of Corporations', country: 'United States', types: ['incorporation', 'amendment', 'dissolution', 'annual_return', 'name_reservation'], endpoint: 'corp.delaware.gov', avg_days: '1\u20133', fees: '$150\u2013$500' },
      'florida':   { registrar: 'SunBiz (FL Division of Corporations)', country: 'United States', types: ['incorporation', 'amendment', 'dissolution', 'annual_return'], endpoint: 'sunbiz.org/api', avg_days: '2\u20135', fees: '$70\u2013$300' },
      'singapore': { registrar: 'ACRA (Accounting & Corporate Regulatory Authority)', country: 'Singapore', types: ['incorporation', 'amendment', 'dissolution', 'annual_return'], endpoint: 'acra.gov.sg/api', avg_days: '1\u20132', fees: 'SGD 300\u20131,500' },
      'uk':        { registrar: 'Companies House', country: 'United Kingdom', types: ['incorporation', 'amendment', 'dissolution', 'annual_return', 'name_reservation'], endpoint: 'api.company-information.service.gov.uk', avg_days: '1\u20132', fees: '\u00a312\u2013\u00a3100' },
      'hongkong':  { registrar: 'Hong Kong Companies Registry', country: 'Hong Kong', types: ['incorporation', 'amendment', 'dissolution', 'annual_return'], endpoint: 'cr.gov.hk/api', avg_days: '1\u20134', fees: 'HKD 1,720\u20135,000' },
      'bvi':       { registrar: 'BVI Financial Services Commission', country: 'British Virgin Islands', types: ['incorporation', 'amendment', 'dissolution', 'annual_return'], endpoint: 'bvifsc.vg/api', avg_days: '2\u20135', fees: '$350\u2013$1,100' },
      'cayman':    { registrar: 'Cayman Islands General Registry', country: 'Cayman Islands', types: ['incorporation', 'amendment', 'dissolution', 'annual_return'], endpoint: 'ciregistry.gov.ky/api', avg_days: '1\u20133', fees: 'KYD 100\u2013800' },
      'seychelles':{ registrar: 'FSA Seychelles (IBC Registry)', country: 'Seychelles', types: ['incorporation', 'amendment', 'dissolution', 'annual_return', 'vasp_registration'], endpoint: 'fsaseychelles.sc/api', avg_days: '3\u20137', fees: '$100\u2013$1,000' }
    };

    if (!jArg || !filingAdapters[jArg]) {
      addLine('');
      addLine('<span class="t-accent">REGISTRAR FILING ADAPTERS</span>');
      addLine('');
      addLine('<span class="t-dim">Usage: filing &lt;jurisdiction&gt;</span>');
      addLine('');
      var fKeys = Object.keys(filingAdapters);
      for (var fk = 0; fk < fKeys.length; fk++) {
        var fkt = fk < fKeys.length - 1 ? '\u251C\u2500' : '\u2514\u2500';
        var fa = filingAdapters[fKeys[fk]];
        addLine('  <span class="t-tree">' + fkt + '</span> <span class="t-accent">' + padRight(fKeys[fk], 14) + '</span> ' + escHtml(fa.registrar) + ' <span class="t-dim">(' + fa.country + ')</span>');
      }
      addLine('');
      addLine('<span class="t-dim">Filing lifecycle: Submitted \u2192 UnderReview \u2192 Approved / Rejected / RequiresCorrection</span>');
      addLine('');
      return;
    }

    var adapter = filingAdapters[jArg];
    addLine('');
    addLine('<span class="t-accent">FILING ADAPTER: ' + adapter.registrar.toUpperCase() + '</span>');
    addLine('');
    addLine('  <span class="t-label">REGISTRAR</span>        ' + escHtml(adapter.registrar));
    addLine('  <span class="t-label">COUNTRY</span>          ' + escHtml(adapter.country));
    addLine('  <span class="t-label">ENDPOINT</span>         <span class="t-value">' + escHtml(adapter.endpoint) + '</span>');
    addLine('');
    addLine('  <span class="t-label">SUPPORTED FILING TYPES</span>');
    for (var ft = 0; ft < adapter.types.length; ft++) {
      var ftt = ft < adapter.types.length - 1 ? '\u251C\u2500' : '\u2514\u2500';
      addLine('  <span class="t-tree">' + ftt + '</span> ' + escHtml(adapter.types[ft]));
    }
    addLine('');
    addLine('  <span class="t-label">FILING LIFECYCLE</span>');
    addLine('  Submitted <span class="t-dim">\u2192</span> UnderReview <span class="t-dim">\u2192</span> <span class="t-success">Approved</span> / <span class="t-error">Rejected</span> / <span class="t-testnet">RequiresCorrection</span>');
    addLine('');
    addLine('  <span class="t-label">AVG PROCESSING</span>  ' + adapter.avg_days + ' business days');
    addLine('  <span class="t-label">FEE RANGE</span>       ' + adapter.fees);
    addLine('');
  }

  /* ── packs ── */
  function cmdPacks(args) {
    var parts = args.split(/\s+/);
    var jArg = parts[1];
    var zone = jArg ? findZone(jArg) : null;

    var packData = {
      'pk':       { lawpacks: 28, regpack_sanctions: 'OFAC + UN + EU + UK', regpack_date: '2026-02-28', licensepack_cats: 15, specific_ops: 9, inherited_ops: 19 },
      'adgm':     { lawpacks: 22, regpack_sanctions: 'OFAC + UN + EU', regpack_date: '2026-01-15', licensepack_cats: 11, specific_ops: 8, inherited_ops: 14 },
      'us':       { lawpacks: 18, regpack_sanctions: 'OFAC SDN + EU', regpack_date: '2026-01-15', licensepack_cats: 8, specific_ops: 6, inherited_ops: 12 },
      'us-fl':    { lawpacks: 24, regpack_sanctions: 'OFAC + FinCEN BSA', regpack_date: '2026-02-28', licensepack_cats: 12, specific_ops: 10, inherited_ops: 14 },
      'sg':       { lawpacks: 20, regpack_sanctions: 'OFAC + UN + MAS', regpack_date: '2026-01-15', licensepack_cats: 9, specific_ops: 7, inherited_ops: 13 },
      'prospera': { lawpacks: 16, regpack_sanctions: 'OFAC + UN', regpack_date: '2026-01-15', licensepack_cats: 9, specific_ops: 5, inherited_ops: 11 }
    };

    if (!zone || !packData[zone.id]) {
      addLine('');
      addLine('<span class="t-accent">PACK TRILOGY</span>');
      addLine('');
      addLine('<span class="t-dim">Usage: packs &lt;jurisdiction&gt;</span>');
      addLine('');
      addLine('  Three pack types make the kernel jurisdiction-aware:');
      addLine('');
      addLine('  <span class="t-tree">\u251C\u2500</span> <span class="t-accent">' + padRight('Lawpack', 14) + '</span> <span class="t-dim">Legislative statutes \u2192 machine-readable operation step DAGs</span>');
      addLine('  <span class="t-tree">\u251C\u2500</span> <span class="t-accent">' + padRight('Regpack', 14) + '</span> <span class="t-dim">Dynamic regulatory state: sanctions, license registries, deadlines</span>');
      addLine('  <span class="t-tree">\u2514\u2500</span> <span class="t-accent">' + padRight('Licensepack', 14) + '</span> <span class="t-dim">Business license lifecycle: 15+ categories, renewals, compliance</span>');
      addLine('');
      addLine('<span class="t-dim">Lawpacks are content-addressed via SHA-256. Regpack updates propagate immediately to the compliance tensor.</span>');
      addLine('');
      var pkKeys = Object.keys(packData);
      addLine('  <span class="t-label">AVAILABLE JURISDICTIONS</span>');
      for (var pk = 0; pk < pkKeys.length; pk++) {
        var pkt = pk < pkKeys.length - 1 ? '\u251C\u2500' : '\u2514\u2500';
        var pkz = findZone(pkKeys[pk]);
        addLine('  <span class="t-tree">' + pkt + '</span> <span class="t-accent">' + padRight(pkKeys[pk], 12) + '</span> <span class="t-dim">' + (pkz ? pkz.name : pkKeys[pk]) + '</span>');
      }
      addLine('');
      return;
    }

    var pd = packData[zone.id];
    var zk = ZONE_KERNEL[zone.id];

    addLine('');
    addLine('<span class="t-accent">PACK TRILOGY: ' + escHtml(zone.name).toUpperCase() + '</span>');
    addLine('');
    addLine('  <span class="t-label">LAWPACK</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Operation definitions   <span class="t-value">' + pd.lawpacks + '</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Jurisdiction-specific   <span class="t-value">' + pd.specific_ops + '</span> <span class="t-dim">(custom step DAGs)</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Inherited from default  <span class="t-value">' + pd.inherited_ops + '</span>');
    addLine('  <span class="t-tree">\u2514\u2500</span> Content-addressing      SHA-256');
    addLine('');
    addLine('  <span class="t-label">REGPACK</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Sanctions lists         <span class="t-value">' + pd.regpack_sanctions + '</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Last update             ' + pd.regpack_date);
    if (zk && zk.regpacks) {
      for (var rp = 0; rp < zk.regpacks.length; rp++) {
        addLine('  <span class="t-tree">\u251C\u2500</span> ' + zk.regpacks[rp].domain + '                SHA: ' + zk.regpacks[rp].sha);
      }
    }
    addLine('  <span class="t-tree">\u2514\u2500</span> Propagation             <span class="t-dim">Immediate (all entities in all zones)</span>');
    addLine('');
    addLine('  <span class="t-label">LICENSEPACK</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> License categories      <span class="t-value">' + pd.licensepack_cats + '</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Renewal tracking        Active');
    addLine('  <span class="t-tree">\u2514\u2500</span> Compliance warnings     Automatic');
    if (zk && zk.domains) {
      addLine('');
      addLine('  <span class="t-label">COMPLIANCE DOMAINS (' + zk.domains.length + ')</span>');
      addLine('  <span class="t-dim">' + zk.domains.join(', ') + '</span>');
    }
    addLine('');
  }

  /* ══════════════════════════════════════
     COMMAND PROCESSING
     ══════════════════════════════════════ */

  function processCommand(raw) {
    var trimmed = raw.trim();
    if (!trimmed) return;

    /* Add to history */
    if (history.length === 0 || history[history.length - 1] !== trimmed) {
      history.push(trimmed);
    }
    historyIdx = history.length;

    /* Echo the command */
    addLine('<span class="t-dim">$ ' + escHtml(trimmed) + '</span>', 'line-echo');

    /* Parse */
    var parts = trimmed.split(/\s+/);
    var cmd = parts[0].toLowerCase();
    var args = trimmed;

    /* Aliases */
    var ALIASES = { z: 'zone', t: 'trace', d: 'demo', r: 'route', c: 'compare', s: 'status', op: 'operation', lp: 'lawpack', fees: 'pipe', gov: 'govos', sov: 'sovereignty', docs: 'documents', e: 'envelope', wp: 'write-path', sec: 'security' };
    if (ALIASES[cmd]) {
      cmd = ALIASES[cmd];
      args = cmd + ' ' + parts.slice(1).join(' ');
    }

    /* Dispatch */
    if (COMMANDS[cmd]) {
      COMMANDS[cmd].fn(args);
    } else {
      addLine('<span class="t-error">Unknown command: ' + escHtml(cmd) + '</span>');
      addLine('<span class="t-dim">Type help for available commands.</span>');
      addLine('');
    }

    scrollToBottom();
  }


  /* ══════════════════════════════════════
     TAB COMPLETION
     ══════════════════════════════════════ */

  function tabComplete(value) {
    var parts = value.split(/\s+/);

    /* Complete command name (including aliases) */
    if (parts.length <= 1) {
      var prefix = (parts[0] || '').toLowerCase();
      var ALIAS_MAP = { z: 'zone', t: 'trace', d: 'demo', r: 'route', c: 'compare', s: 'status', op: 'operation', lp: 'lawpack', fees: 'pipe', e: 'envelope', wp: 'write-path', sec: 'security' };
      if (ALIAS_MAP[prefix]) return ALIAS_MAP[prefix] + ' ';
      var matches = [];
      for (var i = 0; i < COMMAND_NAMES.length; i++) {
        if (COMMAND_NAMES[i].indexOf(prefix) === 0) matches.push(COMMAND_NAMES[i]);
      }
      if (matches.length === 1) return matches[0] + ' ';
      return null;
    }

    var cmd = parts[0].toLowerCase();

    /* Complete zone name for zone/trace/route/compare/demo/pipe/govos/costs/packs commands */
    if (cmd === 'zone' || cmd === 'trace' || cmd === 'route' || cmd === 'compare' || cmd === 'demo' || cmd === 'pipe' || cmd === 'govos' || cmd === 'costs' || cmd === 'packs') {
      var lastPart = parts[parts.length - 1].toLowerCase();
      var zoneMatches = [];
      for (var j = 0; j < ZONES.length; j++) {
        if (ZONES[j].id.indexOf(lastPart) === 0) zoneMatches.push(ZONES[j].id);
      }
      if (zoneMatches.length === 1) {
        parts[parts.length - 1] = zoneMatches[0];
        return parts.join(' ') + ' ';
      }
    }

    /* integrate system-type completion */
    if (cmd === 'integrate') {
      if (parts.length === 2) {
        var igLast = parts[1].toLowerCase();
        var igTypes = ['identity', 'tax', 'registry', 'banking', 'licensing'];
        var igMatches = [];
        for (var ig = 0; ig < igTypes.length; ig++) {
          if (igTypes[ig].indexOf(igLast) === 0) igMatches.push(igTypes[ig]);
        }
        if (igMatches.length === 1) return 'integrate ' + igMatches[0] + ' ';
      }
    }

    /* training phase completion */
    if (cmd === 'training') {
      if (parts.length === 2) {
        var trLast = parts[1].toLowerCase();
        var trPhases = ['foundation', 'operations', 'independence'];
        var trMatches = [];
        for (var tr = 0; tr < trPhases.length; tr++) {
          if (trPhases[tr].indexOf(trLast) === 0) trMatches.push(trPhases[tr]);
        }
        if (trMatches.length === 1) return 'training ' + trMatches[0] + ' ';
      }
    }

    /* filing jurisdiction completion */
    if (cmd === 'filing') {
      if (parts.length === 2) {
        var flLast = parts[1].toLowerCase();
        var flJuris = ['pakistan', 'adgm', 'delaware', 'florida', 'singapore', 'uk', 'hongkong', 'bvi', 'cayman', 'seychelles'];
        var flMatches = [];
        for (var fl = 0; fl < flJuris.length; fl++) {
          if (flJuris[fl].indexOf(flLast) === 0) flMatches.push(flJuris[fl]);
        }
        if (flMatches.length === 1) return 'filing ' + flMatches[0] + ' ';
      }
    }

    /* documents operation-type completion */
    if (cmd === 'documents') {
      if (parts.length === 2) {
        var dcLast = parts[1].toLowerCase();
        var dcOps = ['entity.rename', 'entity.incorporate', 'entity.dissolve', 'ownership.issue_shares'];
        var dcMatches = [];
        for (var dc = 0; dc < dcOps.length; dc++) {
          if (dcOps[dc].indexOf(dcLast) === 0) dcMatches.push(dcOps[dc]);
        }
        if (dcMatches.length === 1) return 'documents ' + dcMatches[0] + ' ';
      }
    }

    /* sdk primitive completion */
    if (cmd === 'sdk') {
      if (parts.length === 2) {
        var sdkLast = parts[1].toLowerCase();
        var sdkPrims = ['entity', 'ownership', 'fiscal', 'identity', 'consent', 'corridor', 'asset'];
        var sdkMatches = [];
        for (var sk = 0; sk < sdkPrims.length; sk++) {
          if (sdkPrims[sk].indexOf(sdkLast) === 0) sdkMatches.push(sdkPrims[sk]);
        }
        if (sdkMatches.length === 1) return 'sdk ' + sdkMatches[0] + ' ';
      }
    }

    /* entity incorporate --jurisdiction completion */
    if (cmd === 'entity') {
      if (parts.length === 2 && 'incorporate'.indexOf(parts[1].toLowerCase()) === 0) {
        return 'entity incorporate --jurisdiction ';
      }
      if (parts.length === 4 && parts[2] === '--jurisdiction') {
        var ejLast = parts[3].toLowerCase();
        var ejMatches = [];
        for (var ej = 0; ej < ZONES.length; ej++) {
          if (ZONES[ej].id.indexOf(ejLast) === 0) ejMatches.push(ZONES[ej].id);
        }
        if (ejMatches.length === 1) return 'entity incorporate --jurisdiction ' + ejMatches[0] + ' ';
      }
    }

    /* tax --jurisdiction completion */
    if (cmd === 'tax') {
      if (parts.length === 2 && '--jurisdiction'.indexOf(parts[1]) === 0) {
        return 'tax --jurisdiction ';
      }
      if (parts.length === 3 && parts[1] === '--jurisdiction') {
        var tjLast = parts[2].toLowerCase();
        var tjKeys = Object.keys(TAX_RULES);
        var tjMatches = [];
        for (var tj = 0; tj < tjKeys.length; tj++) {
          if (tjKeys[tj].indexOf(tjLast) === 0) tjMatches.push(tjKeys[tj]);
        }
        if (tjMatches.length === 1) return 'tax --jurisdiction ' + tjMatches[0] + ' ';
      }
    }

    /* operation type and --jurisdiction completion */
    if (cmd === 'operation') {
      var opNames = Object.keys(OPERATIONS);
      if (parts.length === 2) {
        var opLast = parts[1].toLowerCase();
        var opMatches = [];
        for (var op = 0; op < opNames.length; op++) {
          if (opNames[op].indexOf(opLast) === 0) opMatches.push(opNames[op]);
        }
        if (opMatches.length === 1) return 'operation ' + opMatches[0] + ' ';
      }
      if (parts.length === 3 && '--jurisdiction'.indexOf(parts[2]) === 0) {
        return 'operation ' + parts[1] + ' --jurisdiction ';
      }
      if (parts.length === 3 && '--compare'.indexOf(parts[2]) === 0) {
        return 'operation ' + parts[1] + ' --compare ';
      }
      if (parts.length >= 4 && parts[2] === '--compare') {
        var ocObj = OPERATIONS[parts[1]];
        if (ocObj) {
          var ocLast = parts[parts.length - 1].toLowerCase();
          var ocKeys = Object.keys(ocObj.jurisdictions);
          var ocMatches = [];
          for (var oc = 0; oc < ocKeys.length; oc++) {
            if (ocKeys[oc].indexOf(ocLast) === 0) ocMatches.push(ocKeys[oc]);
          }
          if (ocMatches.length === 1) return parts.slice(0, -1).join(' ') + ' ' + ocMatches[0] + ' ';
        }
      }
      if (parts.length === 4 && parts[2] === '--jurisdiction') {
        var opObj = OPERATIONS[parts[1]];
        if (opObj) {
          var ojKeys = Object.keys(opObj.jurisdictions);
          var ojLast = parts[3].toLowerCase();
          var ojMatches = [];
          for (var oj = 0; oj < ojKeys.length; oj++) {
            if (ojKeys[oj].indexOf(ojLast) === 0) ojMatches.push(ojKeys[oj]);
          }
          if (ojMatches.length === 1) return 'operation ' + parts[1] + ' --jurisdiction ' + ojMatches[0] + ' ';
        }
      }
    }

    /* settlement type completion */
    if (cmd === 'settlement') {
      if (parts.length === 2) {
        var stLast = parts[1].toLowerCase();
        var stMatches = [];
        for (var st = 0; st < SETTLEMENT_TYPES.length; st++) {
          if (SETTLEMENT_TYPES[st].id.indexOf(stLast) === 0) stMatches.push(SETTLEMENT_TYPES[st].id);
        }
        if (stMatches.length === 1) return 'settlement ' + stMatches[0] + ' ';
      }
    }

    /* transitions --family completion */
    if (cmd === 'transitions') {
      if (parts.length === 2 && '--family'.indexOf(parts[1]) === 0) {
        return 'transitions --family ';
      }
      if (parts.length === 3 && parts[1] === '--family') {
        var tfLast = parts[2].toLowerCase();
        var tfFamilies = ['settlement', 'trade', 'arbitration'];
        var tfMatches = [];
        for (var tf = 0; tf < tfFamilies.length; tf++) {
          if (tfFamilies[tf].indexOf(tfLast) === 0) tfMatches.push(tfFamilies[tf]);
        }
        if (tfMatches.length === 1) return 'transitions --family ' + tfMatches[0] + ' ';
      }
    }

    /* lawpack <operation> <jurisdiction> completion */
    if (cmd === 'lawpack' || cmd === 'lp') {
      var lpOpNames = Object.keys(OPERATIONS);
      if (parts.length === 2) {
        var lpLast = parts[1].toLowerCase();
        var lpMatches = [];
        for (var lp = 0; lp < lpOpNames.length; lp++) {
          if (lpOpNames[lp].indexOf(lpLast) === 0) lpMatches.push(lpOpNames[lp]);
        }
        if (lpMatches.length === 1) return cmd + ' ' + lpMatches[0] + ' ';
      }
      if (parts.length === 3) {
        var lpOp = OPERATIONS[parts[1]];
        if (lpOp) {
          var lpjLast = parts[2].toLowerCase();
          var lpjKeys = Object.keys(lpOp.jurisdictions);
          var lpjMatches = [];
          for (var lpj = 0; lpj < lpjKeys.length; lpj++) {
            if (lpjKeys[lpj].indexOf(lpjLast) === 0) lpjMatches.push(lpjKeys[lpj]);
          }
          if (lpjMatches.length === 1) return cmd + ' ' + parts[1] + ' ' + lpjMatches[0] + ' ';
        }
      }
    }

    /* diff <operation> <j1> <j2> completion */
    if (cmd === 'diff') {
      var dfOpNames = Object.keys(OPERATIONS);
      if (parts.length === 2) {
        var dfLast = parts[1].toLowerCase();
        var dfMatches = [];
        for (var df = 0; df < dfOpNames.length; df++) {
          if (dfOpNames[df].indexOf(dfLast) === 0) dfMatches.push(dfOpNames[df]);
        }
        if (dfMatches.length === 1) return 'diff ' + dfMatches[0] + ' ';
      }
      if (parts.length >= 3) {
        var dfOp = OPERATIONS[parts[1]];
        if (dfOp) {
          var dfjLast = parts[parts.length - 1].toLowerCase();
          var dfjKeys = Object.keys(dfOp.jurisdictions);
          var dfjMatches = [];
          for (var dfj = 0; dfj < dfjKeys.length; dfj++) {
            if (dfjKeys[dfj].indexOf(dfjLast) === 0) dfjMatches.push(dfjKeys[dfj]);
          }
          if (dfjMatches.length === 1) return parts.slice(0, -1).join(' ') + ' ' + dfjMatches[0] + ' ';
        }
      }
    }

    /* modules --family completion */
    if (cmd === 'modules') {
      if (parts.length === 2 && '--family'.indexOf(parts[1]) === 0) {
        return 'modules --family ';
      }
      if (parts.length === 3 && parts[1] === '--family') {
        var mfLast = parts[2].toLowerCase();
        var mfMatches = [];
        for (var mf = 0; mf < MODULE_FAMILIES.length; mf++) {
          if (MODULE_FAMILIES[mf].id.indexOf(mfLast) === 0) mfMatches.push(MODULE_FAMILIES[mf].id);
        }
        if (mfMatches.length === 1) return 'modules --family ' + mfMatches[0] + ' ';
      }
    }

    return null;
  }


  /* ── sdk — TypeScript SDK equivalent ── */
  function cmdSdk(args) {
    var parts = args.trim().split(/\s+/);
    var target = (parts[1] || '').toLowerCase();
    var action = (parts[2] || '').toLowerCase();

    var examples = {
      'entity': {
        'create': {
          title: 'Entity Formation',
          code: [
            '<span class="t-dim">import</span> Mass <span class="t-dim">from</span> <span class="t-string">\'@mass/primitives\'</span>;',
            '',
            '<span class="t-dim">const</span> mass = <span class="t-dim">new</span> Mass({ token: process.env.<span class="t-value">MASS_TOKEN</span> });',
            '',
            '<span class="t-dim">const</span> company = <span class="t-dim">await</span> mass.entities.<span class="t-accent">incorporate</span>({',
            '  zone: <span class="t-string">\'us-de\'</span>,',
            '  type: <span class="t-string">\'llc\'</span>,',
            '  jurisdiction: <span class="t-string">\'us-de\'</span>,',
            '  name: <span class="t-string">\'Meridian Dynamics LLC\'</span>,',
            '  beneficial_owners: [{ identity_id: <span class="t-string">\'id_01HZQ3\'</span>, ownership_pct: <span class="t-string">\'100.00\'</span> }]',
            '});',
            '',
            '<span class="t-dim">// company.entity_id          →</span> <span class="t-value">ent_01HZQ3...</span>',
            '<span class="t-dim">// company.compliance.overall →</span> <span class="t-success">Compliant</span> <span class="t-dim">(20/23 domains)</span>',
            '<span class="t-dim">// company.credential.proof   →</span> <span class="t-value">Ed25519Signature2020</span>',
            '<span class="t-dim">// company.passport_digest    →</span> <span class="t-value">sha256:7a3f9b2e...</span>'
          ]
        }
      },
      'ownership': {
        'transfer': {
          title: 'Share Transfer',
          code: [
            '<span class="t-dim">const</span> transfer = <span class="t-dim">await</span> mass.ownership.<span class="t-accent">transfer</span>({',
            '  entity_id: <span class="t-string">\'ent_01HZQ3\'</span>,',
            '  from_shareholder: <span class="t-string">\'id_01HZR7\'</span>,',
            '  to_shareholder: <span class="t-string">\'id_01HZR8\'</span>,',
            '  share_class: <span class="t-string">\'Common\'</span>,',
            '  quantity: <span class="t-value">10000</span>,',
            '  price_per_share: <span class="t-string">\'1.00\'</span>,',
            '  currency: <span class="t-string">\'USD\'</span>',
            '});',
            '',
            '<span class="t-dim">// transfer.compliance.securities →</span> <span class="t-success">Compliant</span>',
            '<span class="t-dim">// transfer.tax_event.type        →</span> <span class="t-value">capital_gains</span>',
            '<span class="t-dim">// transfer.passport_digest       →</span> <span class="t-value">sha256:b4c6d8e1...</span>'
          ]
        }
      },
      'fiscal': {
        'payment': {
          title: 'Create Payment',
          code: [
            '<span class="t-dim">const</span> payment = <span class="t-dim">await</span> mass.fiscal.<span class="t-accent">createPayment</span>({',
            '  from_account: <span class="t-string">\'acc_01HZR8\'</span>,',
            '  to_account: <span class="t-string">\'acc_01HZS3\'</span>,',
            '  amount: <span class="t-string">\'50000.00\'</span>,',
            '  currency: <span class="t-string">\'USD\'</span>,',
            '  reference: <span class="t-string">\'INV-2026-0142\'</span>',
            '});',
            '',
            '<span class="t-dim">// payment.compliance.sanctions →</span> <span class="t-success">Compliant</span>',
            '<span class="t-dim">// payment.compliance.aml       →</span> <span class="t-success">Compliant</span>',
            '<span class="t-dim">// payment.passport_digest      →</span> <span class="t-value">sha256:e1c5f834...</span>'
          ]
        }
      },
      'identity': {
        'verify': {
          title: 'Identity Verification',
          code: [
            '<span class="t-dim">const</span> result = <span class="t-dim">await</span> mass.identity.<span class="t-accent">verify</span>({',
            '  cnic: <span class="t-string">\'35201-1234567-8\'</span>  <span class="t-dim">// NADRA format</span>',
            '});',
            '',
            '<span class="t-dim">// result.verified     →</span> <span class="t-success">true</span>',
            '<span class="t-dim">// result.source       →</span> <span class="t-value">NADRA</span>',
            '<span class="t-dim">// result.name_match   →</span> <span class="t-success">true</span>'
          ]
        }
      },
      'consent': {
        'vote': {
          title: 'Cast Vote',
          code: [
            '<span class="t-dim">const</span> vote = <span class="t-dim">await</span> mass.consent.<span class="t-accent">vote</span>({',
            '  consent_id: <span class="t-string">\'con_01HZS6\'</span>,',
            '  voter_id: <span class="t-string">\'id_01HZQ3\'</span>,',
            '  decision: <span class="t-string">\'approve\'</span>',
            '});',
            '',
            '<span class="t-dim">// vote.quorum_met    →</span> <span class="t-success">true</span>',
            '<span class="t-dim">// vote.votes_received →</span> <span class="t-value">2</span> <span class="t-dim">of</span> <span class="t-value">3</span>',
            '<span class="t-dim">// vote.status        →</span> <span class="t-value">approved</span>'
          ]
        }
      },
      'corridor': {
        'create': {
          title: 'Create Corridor',
          code: [
            '<span class="t-dim">const</span> corridor = <span class="t-dim">await</span> mass.corridors.<span class="t-accent">create</span>({',
            '  jurisdiction_a: <span class="t-string">\'us-de\'</span>,',
            '  jurisdiction_b: <span class="t-string">\'ae-abudhabi-adgm\'</span>',
            '});',
            '',
            '<span class="t-dim">// corridor.id    →</span> <span class="t-value">cor_01HZQ5...</span>',
            '<span class="t-dim">// corridor.state →</span> <span class="t-value">DRAFT</span>',
            '',
            '<span class="t-dim">await</span> mass.corridors.<span class="t-accent">transition</span>(corridor.id, {',
            '  target_state: <span class="t-string">\'PENDING\'</span>,',
            '  evidence: { bilateral_agreement_digest: <span class="t-string">\'sha256:a4f8c2e1...\'</span> }',
            '});'
          ]
        }
      },
      'asset': {
        'genesis': {
          title: 'Smart Asset Genesis',
          code: [
            '<span class="t-dim">const</span> asset = <span class="t-dim">await</span> mass.assets.<span class="t-accent">genesis</span>({',
            '  asset_name: <span class="t-string">\'Meridian Series A\'</span>,',
            '  asset_class: <span class="t-string">\'equity\'</span>,',
            '  home_harbor_id: <span class="t-string">\'ae-abudhabi-adgm\'</span>,',
            '  metadata: { denomination: <span class="t-string">\'AED\'</span>, total_supply: <span class="t-value">1000000</span> }',
            '});',
            '',
            '<span class="t-dim">// asset.asset_id       →</span> <span class="t-value">sha256:7a3f9b2e...</span> <span class="t-dim">(content-addressed)</span>',
            '<span class="t-dim">// asset.genesis_digest →</span> <span class="t-value">sha256:c6f3d8a1...</span>'
          ]
        }
      }
    };

    if (!target || !examples[target]) {
      addLine('');
      addLine('<span class="t-accent">Mass SDK</span> <span class="t-dim">(@mass/primitives v0.1.0) \u2014 TypeScript</span>');
      addLine('');
      addLine('  <span class="t-dim">npm install @mass/primitives</span>');
      addLine('');
      addLine('  <span class="t-label">PRIMITIVES</span>');
      addLine('  <span class="t-tree">\u251C\u2500</span> <span class="t-accent">sdk entity create</span>       <span class="t-dim">Entity formation</span>');
      addLine('  <span class="t-tree">\u251C\u2500</span> <span class="t-accent">sdk ownership transfer</span>  <span class="t-dim">Share transfer with tax event</span>');
      addLine('  <span class="t-tree">\u251C\u2500</span> <span class="t-accent">sdk fiscal payment</span>      <span class="t-dim">Payment with sanctions check</span>');
      addLine('  <span class="t-tree">\u251C\u2500</span> <span class="t-accent">sdk identity verify</span>     <span class="t-dim">NADRA CNIC verification</span>');
      addLine('  <span class="t-tree">\u2514\u2500</span> <span class="t-accent">sdk consent vote</span>        <span class="t-dim">Board resolution vote</span>');
      addLine('');
      addLine('  <span class="t-label">INFRASTRUCTURE</span>');
      addLine('  <span class="t-tree">\u251C\u2500</span> <span class="t-accent">sdk corridor create</span>     <span class="t-dim">Cross-border corridor</span>');
      addLine('  <span class="t-tree">\u2514\u2500</span> <span class="t-accent">sdk asset genesis</span>       <span class="t-dim">Smart asset creation</span>');
      addLine('');
      addLine('  <span class="t-label">24 SUB-CLIENTS</span>');
      addLine('  <span class="t-dim">mass.entities \u00b7 mass.ownership \u00b7 mass.fiscal \u00b7 mass.identity \u00b7 mass.consent</span>');
      addLine('  <span class="t-dim">mass.operations \u00b7 mass.documents \u00b7 mass.compliance \u00b7 mass.corridors \u00b7 mass.assets</span>');
      addLine('  <span class="t-dim">mass.disputes \u00b7 mass.watchers \u00b7 mass.trade \u00b7 mass.governance \u00b7 mass.licensing</span>');
      addLine('  <span class="t-dim">mass.notifications \u00b7 mass.peers \u00b7 mass.agentic \u00b7 mass.govos \u00b7 mass.csp</span>');
      addLine('  <span class="t-dim">mass.oauth \u00b7 mass.instruments \u00b7 mass.govos_sc \u00b7 mass.notifications</span>');
      addLine('');
      return;
    }

    var actions = examples[target];
    var actionKey = action || Object.keys(actions)[0];
    var ex = actions[actionKey];
    if (!ex) {
      addLine('<span class="t-error">Unknown action: sdk ' + escHtml(target) + ' ' + escHtml(action) + '</span>');
      addLine('<span class="t-dim">Available: ' + Object.keys(actions).join(', ') + '</span>');
      return;
    }

    addLine('');
    addLine('<span class="t-accent">' + ex.title + '</span> <span class="t-dim">\u2014 @mass/primitives</span>');
    addLine('');
    for (var i = 0; i < ex.code.length; i++) {
      addLine('  ' + ex.code[i]);
    }
    addLine('');
    addLine('<span class="t-dim">\u2192 Full SDK reference: <a href="/docs.html#sdks" class="t-link">/docs.html#sdks</a></span>');
    addLine('');
  }

  /* ── envelope — OrchestrationEnvelope structure ── */
  function cmdEnvelope() {
    addLine('');
    addLine('<span class="t-accent">OrchestrationEnvelope</span> <span class="t-dim">\u2014 returned by every write operation</span>');
    addLine('');
    addLine('  Every mutation (entity creation, share transfer, payment, corridor transition)');
    addLine('  returns this envelope containing cryptographic proof of compliance.');
    addLine('');
    addLine('  <span class="t-tree">\u251C\u2500</span> <span class="t-accent">operation_id</span>        <span class="t-value">op_01HZQ5...</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> <span class="t-accent">jurisdiction_id</span>     <span class="t-value">us-de</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> <span class="t-accent">attestation_id</span>      <span class="t-value">att_01HZQ4...</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> <span class="t-accent">compliance_verdict</span>');
    addLine('  <span class="t-tree">\u2502</span>  <span class="t-tree">\u251C\u2500</span> domains_evaluated  <span class="t-value">20</span>');
    addLine('  <span class="t-tree">\u2502</span>  <span class="t-tree">\u251C\u2500</span> overall_status     <span class="t-success">Compliant</span>');
    addLine('  <span class="t-tree">\u2502</span>  <span class="t-tree">\u2514\u2500</span> domain_results     <span class="t-dim">{ aml: \u2713, kyc: \u2713, sanctions: \u2713, tax: \u2713, securities: \u2713, ... }</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> <span class="t-accent">verifiable_credential</span>');
    addLine('  <span class="t-tree">\u2502</span>  <span class="t-tree">\u251C\u2500</span> type               <span class="t-value">MezEntityFormationCredential</span>');
    addLine('  <span class="t-tree">\u2502</span>  <span class="t-tree">\u251C\u2500</span> issuer             <span class="t-string">did:mez:zone_us-de</span>');
    addLine('  <span class="t-tree">\u2502</span>  <span class="t-tree">\u251C\u2500</span> proof_type         <span class="t-value">Ed25519Signature2020</span>');
    addLine('  <span class="t-tree">\u2502</span>  <span class="t-tree">\u2514\u2500</span> signature_valid    <span class="t-success">true</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> <span class="t-accent">passport_digest</span>     <span class="t-value">sha256:7a3f9b2e...</span>');
    addLine('  <span class="t-tree">\u2514\u2500</span> <span class="t-accent">timestamp</span>           <span class="t-dim">2026-03-13T14:22:07Z</span>');
    addLine('');
    addLine('  <span class="t-dim">The passport_digest is hash-chained: prev_digest \u2192 current_digest.</span>');
    addLine('  <span class="t-dim">Every write produces an immutable, verifiable compliance record.</span>');
    addLine('');
  }

  /* ── write-path — 10-stage write pipeline ── */
  function cmdWritePath() {
    addLine('');
    addLine('<span class="t-accent">WRITE-PATH PIPELINE</span> <span class="t-dim">\u2014 every mutation, every time</span>');
    addLine('');

    var stages = [
      { n: '01', name: 'Auth',           desc: 'Constant-time bearer verification, CallerIdentity extraction',   svc: 'mez-api' },
      { n: '02', name: 'Pre-flight',     desc: '23-domain compliance tensor evaluation against jurisdiction lawpack', svc: 'mez-tensor' },
      { n: '03', name: 'Sanctions',      desc: 'OFAC + UN + EU hard-block. NonCompliant = reject (legal requirement, no override)', svc: 'mez-tensor' },
      { n: '04', name: 'Execute',        desc: 'Mass API call via mez-mass-client (proxy or sovereign Postgres)',  svc: 'mez-mass-client' },
      { n: '05', name: 'Evidence',       desc: 'Operational evidence stored in attestation engine',              svc: 'attestation-engine' },
      { n: '06', name: 'Post-flight',    desc: 'Tensor re-evaluated with execution evidence',                   svc: 'mez-tensor' },
      { n: '07', name: 'VC Issuance',    desc: 'Verifiable Credential signed with Ed25519',                     svc: 'mez-vc' },
      { n: '08', name: 'Attestation',    desc: 'Transaction attestation stored (PostgreSQL)',                    svc: 'mez-crypto' },
      { n: '09', name: 'Passport',       desc: 'Compliance passport updated (hash-chained: prev \u2192 current)', svc: 'mez-orchestration' },
      { n: '10', name: 'Envelope',       desc: 'OrchestrationEnvelope returned to caller',                      svc: 'mez-api' }
    ];

    if (!reducedMotion) {
      var idx = 0;
      function showNext() {
        if (idx >= stages.length) {
          addLine('');
          addLine('  <span class="t-success">\u2713</span> <span class="t-dim">Pipeline complete. Every write produces compliance proof.</span>');
          addLine('');
          addLine('<span class="t-dim">\u2192 See also: <a href="/docs.html#operations" class="t-link">Operations reference</a> \u00b7</span> <span class="t-accent">envelope</span> <span class="t-dim">for response structure</span>');
          addLine('');
          return;
        }
        var s = stages[idx];
        var tree = idx < stages.length - 1 ? '\u251C\u2500' : '\u2514\u2500';
        addLine('  <span class="t-tree">' + tree + '</span> <span class="t-value">' + s.n + '</span> <span class="t-accent">' + padRight(s.name, 14) + '</span> <span class="t-dim">' + s.desc + '</span>');
        idx++;
        setTimeout(showNext, 120);
      }
      showNext();
    } else {
      for (var i = 0; i < stages.length; i++) {
        var s = stages[i];
        var tree = i < stages.length - 1 ? '\u251C\u2500' : '\u2514\u2500';
        addLine('  <span class="t-tree">' + tree + '</span> <span class="t-value">' + s.n + '</span> <span class="t-accent">' + padRight(s.name, 14) + '</span> <span class="t-dim">' + s.desc + '</span>');
      }
      addLine('');
      addLine('  <span class="t-success">\u2713</span> <span class="t-dim">Pipeline complete. Every write produces compliance proof.</span>');
      addLine('');
      addLine('<span class="t-dim">\u2192 See also: <a href="/docs.html#operations" class="t-link">Operations reference</a> \u00b7</span> <span class="t-accent">envelope</span> <span class="t-dim">for response structure</span>');
      addLine('');
    }
  }

  /* ── security — Security posture ── */
  function cmdSecurity() {
    addLine('');
    addLine('<span class="t-accent">SECURITY POSTURE</span> <span class="t-dim">\u2014 1,187,133 LOC Rust, 1,777 source files</span>');
    addLine('');
    addLine('  <span class="t-label">AUDIT RECORD</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Audit cycles          <span class="t-value">6</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Total findings         <span class="t-value">137</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Fixed                  <span class="t-value">133</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Open (CRITICAL)        <span class="t-success">0</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Open (HIGH)            <span class="t-success">0</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Open (MEDIUM)          <span class="t-success">0</span>');
    addLine('  <span class="t-tree">\u2514\u2500</span> Re-audits              <span class="t-value">16</span>');
    addLine('');
    addLine('  <span class="t-label">INVARIANTS</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Unsafe blocks          <span class="t-value">1</span> <span class="t-dim">(zeroize field encryption)</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Exploit replay gate    <span class="t-success">active</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Zero-panic core        <span class="t-success">enforced</span> <span class="t-dim">(mez-core: CI blocks any panic)</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Sanctions hard-block   <span class="t-success">fail-closed</span> <span class="t-dim">(legal requirement, no override)</span>');
    addLine('  <span class="t-tree">\u2514\u2500</span> Panic paths tracked    <span class="t-value">12,392</span>');
    addLine('');
    addLine('  <span class="t-label">CRYPTOGRAPHIC STACK</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Signatures             <span class="t-value">Ed25519</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Digests                <span class="t-value">SHA-256</span> <span class="t-dim">(JCS canonicalization)</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Field encryption       <span class="t-value">AES-256-GCM</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Credentials            <span class="t-value">W3C Verifiable Credentials</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> Receipt chains         <span class="t-value">Merkle Mountain Range (MMR)</span>');
    addLine('  <span class="t-tree">\u2514\u2500</span> ZK (feature-gated)     <span class="t-value">Groth16 / PLONK</span>');
    addLine('');
    addLine('  <span class="t-label">CI GATES</span> <span class="t-dim">(25+)</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> cargo check --workspace       <span class="t-dim">(zero warnings)</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> cargo clippy -- -D warnings   <span class="t-dim">(zero lints)</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> cargo test --workspace        <span class="t-dim">(42,956 annotations)</span>');
    addLine('  <span class="t-tree">\u251C\u2500</span> cargo audit                   <span class="t-dim">(0 vulnerabilities)</span>');
    addLine('  <span class="t-tree">\u2514\u2500</span> exploit replay gate           <span class="t-dim">(known-attack verification)</span>');
    addLine('');
  }

  /* ══════════════════════════════════════
     INITIALIZATION
     ══════════════════════════════════════ */

  function init() {
    outputEl = document.getElementById('explore-output');
    inputEl = document.getElementById('explore-input');
    if (!outputEl || !inputEl) return;

    /* Welcome message */
    addLine('<span class="t-accent">Momentum Network Explorer</span> <span class="t-dim">v0.4.44 GENESIS</span>');
    addLine('<span class="t-value">Browser demo</span> \u00b7 Illustrative workflows and configuration data.');
    addLine('<span class="t-dim">Commands run locally. Displayed outcomes and timing are examples.</span>');
    addLine('');
    var welcomeEx = [
      { cmd: 'entity incorporate --jurisdiction us-de', desc: 'Walk through an incorporation example', tree: '\u251C\u2500' },
      { cmd: 'demo adgm sg', desc: 'Full corridor lifecycle (7 phases)', tree: '\u251C\u2500' },
      { cmd: 'sdk entity create', desc: 'TypeScript SDK equivalent', tree: '\u251C\u2500' },
      { cmd: 'write-path', desc: '10-stage write pipeline', tree: '\u251C\u2500' },
      { cmd: 'diff entity.incorporate us-de ae-adgm pk-sifc', desc: 'Same API, different law', tree: '\u251C\u2500' },
      { cmd: 'operation', desc: 'Browse operation examples', tree: '\u251C\u2500' },
      { cmd: 'help', desc: 'All ' + Object.keys(COMMANDS).length + ' commands', tree: '\u2514\u2500' }
    ];
    for (var w = 0; w < welcomeEx.length; w++) {
      var ex = welcomeEx[w];
      addLine('  <span class="t-tree">' + ex.tree + '</span> <span class="t-accent">' + padRight(ex.cmd, 34) + '</span> <span class="t-dim">' + ex.desc + '</span>');
    }
    addLine('<span class="t-dim">\u2500\u2500\u2500</span>');
    addLine('<span class="t-dim">See also:</span> <a href="/" class="t-link">Start building</a> <span class="t-dim">\u00b7</span> <a href="/docs.html" class="t-link">Full API reference</a>');
    addLine('');

    /* URL param deep-linking: ?cmd=zone+adgm */
    var urlParams = (typeof URLSearchParams !== 'undefined') ? new URLSearchParams(window.location.search) : null;
    var urlCmd = urlParams ? urlParams.get('cmd') : null;
    if (urlCmd) {
      processCommand(urlCmd);
    }

    /* Input: Enter to submit */
    inputEl.addEventListener('keydown', function (e) {
      if (animating) {
        e.preventDefault();
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        var val = inputEl.value;
        inputEl.value = '';
        processCommand(val);
      }

      /* History navigation */
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (history.length > 0 && historyIdx > 0) {
          historyIdx--;
          inputEl.value = history[historyIdx];
        }
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIdx < history.length - 1) {
          historyIdx++;
          inputEl.value = history[historyIdx];
        } else {
          historyIdx = history.length;
          inputEl.value = '';
        }
      }

      /* Tab completion */
      if (e.key === 'Tab') {
        e.preventDefault();
        var completed = tabComplete(inputEl.value);
        if (completed) inputEl.value = completed;
      }

      /* Ctrl+L / Cmd+K: clear */
      if ((e.ctrlKey && e.key === 'l') || (e.metaKey && e.key === 'k')) {
        e.preventDefault();
        cmdClear();
      }
    });

    /* Track scroll position to decide autoscroll behavior.
       When user is at the bottom, new output auto-scrolls.
       When user has scrolled up, new output does not yank them back. */
    outputEl.addEventListener('scroll', function () {
      var threshold = 40;
      _userAtBottom = outputEl.scrollHeight - outputEl.scrollTop - outputEl.clientHeight <= threshold;
    }, { passive: true });

    /* Click output area to focus input (with selection guard) */
    outputEl.addEventListener('click', function () {
      var sel = window.getSelection();
      if (!sel || sel.isCollapsed) {
        inputEl.focus();
      }
    });

    /* Mobile quick-command buttons */
    var mobileButtons = document.querySelectorAll('.explore-mobile-cmds button');
    for (var i = 0; i < mobileButtons.length; i++) {
      mobileButtons[i].addEventListener('click', function () {
        if (animating) return;
        var cmd = this.getAttribute('data-cmd');
        if (cmd) {
          inputEl.value = '';
          processCommand(cmd);
        }
      });
    }

    /* Mesh bidirectionality: zone click → terminal command */
    window.addEventListener('mesh:zone-click', function (e) {
      if (animating) return;
      var zoneId = e.detail && e.detail.zone;
      if (zoneId) {
        inputEl.value = '';
        processCommand('zone ' + zoneId);
        inputEl.focus();
      }
    });

    /* Hash deep-linking: #cmd=zone+adgm */
    var hashCmd = window.location.hash.match(/cmd=([^&]+)/);
    if (hashCmd) {
      var decoded = decodeURIComponent(hashCmd[1].replace(/\+/g, ' '));
      processCommand(decoded);
    }

    /* Auto-focus after 300ms */
    setTimeout(function () {
      inputEl.focus();
    }, 300);
  }

  /* DOM ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
