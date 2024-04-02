/* eslint-disable no-unused-vars */
const languageList = [
  { code: 'default', name: 'Default' },
  { code: 'en', name: 'English' },
  { code: 'en-gb', name: 'English (UK)' },
  { code: 'zh', name: 'Chinese' },
  { code: 'hi', name: 'Hindi' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'ar', name: 'Arabic' },
  { code: 'bn', name: 'Bengali (Bangla)' },
  { code: 'ru', name: 'Russian' },
  { code: 'pt-br', name: 'Portuguese (Brazilian)' },
  { code: 'pt-pt', name: 'Portuguese (Portugal)' },
  { code: 'in', name: 'Indonesian' },
  { code: 'ur', name: 'Urdu' },
  { code: 'ja', name: 'Japanese' },
  { code: 'de', name: 'German' },
  { code: 'tr', name: 'Turkish' },
  { code: 'ab', name: 'Abkhazian' },
  { code: 'aa', name: 'Afar' },
  { code: 'af', name: 'Afrikaans' },
  { code: 'ak', name: 'Akan' },
  { code: 'sq', name: 'Albanian' },
  { code: 'gsw', name: 'Alsatian (dialects of German)' },
  { code: 'am', name: 'Amharic' },
  { code: 'an', name: 'Aragonese' },
  { code: 'hy', name: 'Armenian' },
  { code: 'as', name: 'Assamese' },
  { code: 'syr', name: 'Assyrian' },
  { code: 'ast', name: 'Asturian' },
  { code: 'av', name: 'Avaric' },
  { code: 'ae', name: 'Avestan' },
  { code: 'ay', name: 'Aymara' },
  { code: 'az', name: 'Azerbaijani' },
  { code: 'bm', name: 'Bambara' },
  { code: 'ba', name: 'Bashkir' },
  { code: 'eu', name: 'Basque' },
  { code: 'bar', name: 'Bavarian' },
  { code: 'be', name: 'Belarusian' },
  { code: 'bh', name: 'Bihari' },
  { code: 'bi', name: 'Bislama' },
  { code: 'bs', name: 'Bosnian' },
  { code: 'br', name: 'Breton' },
  { code: 'bg', name: 'Bulgarian' },
  { code: 'my', name: 'Burmese' },
  { code: 'ca', name: 'Catalan' },
  { code: 'ch', name: 'Chamorro' },
  { code: 'ce', name: 'Chechen' },
  { code: 'ny', name: 'Chichewa, Chewa, Nyanja' },
  { code: 'zh-hans', name: 'Chinese (Simplified)' },
  { code: 'zh-hant', name: 'Chinese (Traditional)' },
  { code: 'cv', name: 'Chuvash' },
  { code: 'kw', name: 'Cornish' },
  { code: 'co', name: 'Corsican' },
  { code: 'cr', name: 'Cree' },
  { code: 'hr', name: 'Croatian' },
  { code: 'cop', name: 'Coptic' },
  { code: 'cs', name: 'Czech' },
  { code: 'da', name: 'Danish' },
  { code: 'dv', name: 'Divehi, Dhivehi, Maldivian' },
  { code: 'nl', name: 'Dutch' },
  { code: 'dz', name: 'Dzongkha' },
  { code: 'eo', name: 'Esperanto' },
  { code: 'et', name: 'Estonian' },
  { code: 'ee', name: 'Ewe' },
  { code: 'fo', name: 'Faroese' },
  { code: 'fj', name: 'Fijian' },
  { code: 'fi', name: 'Finnish' },
  { code: 'fur', name: 'Friulian' },
  { code: 'ff', name: 'Fula, Fulah, Pulaar, Pular' },
  { code: 'gl', name: 'Galician' },
  { code: 'gd', name: 'Gaelic (Scottish)' },
  { code: 'gv', name: 'Gaelic (Manx)' },
  { code: 'ka', name: 'Georgian' },
  { code: 'el', name: 'Greek' },
  { code: 'kl', name: 'Greenlandic' },
  { code: 'gn', name: 'Guarani' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'ht', name: 'Haitian Creole' },
  { code: 'ha', name: 'Hausa' },
  { code: 'he', name: 'Hebrew' },
  { code: 'hz', name: 'Herero' },
  { code: 'ho', name: 'Hiri Motu' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'is', name: 'Icelandic' },
  { code: 'io', name: 'Ido' },
  { code: 'ig', name: 'Igbo' },
  { code: 'ia', name: 'Interlingua' },
  { code: 'ie', name: 'Interlingue' },
  { code: 'iu', name: 'Inuktitut' },
  { code: 'ik', name: 'Inupiak' },
  { code: 'ga', name: 'Irish' },
  { code: 'it', name: 'Italian' },
  { code: 'jv', name: 'Javanese' },
  { code: 'kl', name: 'Kalaallisut, Greenlandic' },
  { code: 'kn', name: 'Kannada' },
  { code: 'kr', name: 'Kanuri' },
  { code: 'ks', name: 'Kashmiri' },
  { code: 'kk', name: 'Kazakh' },
  { code: 'km', name: 'Khmer' },
  { code: 'ki', name: 'Kikuyu' },
  { code: 'rw', name: 'Kinyarwanda (Rwanda)' },
  { code: 'rn', name: 'Kirundi' },
  { code: 'ky', name: 'Kyrgyz' },
  { code: 'kv', name: 'Komi' },
  { code: 'kg', name: 'Kongo' },
  { code: 'ko', name: 'Korean' },
  { code: 'ku', name: 'Kurdish' },
  { code: 'kj', name: 'Kwanyama' },
  { code: 'lo', name: 'Lao' },
  { code: 'la', name: 'Latin' },
  { code: 'lv', name: 'Latvian (Lettish)' },
  { code: 'lij', name: 'Ligurian' },
  { code: 'li', name: 'Limburgish (Limburger)' },
  { code: 'ln', name: 'Lingala' },
  { code: 'lt', name: 'Lithuanian' },
  { code: 'lmo', name: 'Lombard' },
  { code: 'lu', name: 'Luga-Katanga' },
  { code: 'lg', name: 'Luganda, Ganda' },
  { code: 'lb', name: 'Luxembourgish' },
  { code: 'gv', name: 'Manx' },
  { code: 'mk', name: 'Macedonian' },
  { code: 'mg', name: 'Malagasy' },
  { code: 'ms', name: 'Malay' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'mt', name: 'Maltese' },
  { code: 'mi', name: 'Maori' },
  { code: 'mr', name: 'Marathi' },
  { code: 'mh', name: 'Marshallese' },
  { code: 'mo', name: 'Moldavian' },
  { code: 'mn', name: 'Mongolian' },
  { code: 'na', name: 'Nauru' },
  { code: 'nv', name: 'Navajo' },
  { code: 'ng', name: 'Ndonga' },
  { code: 'nd', name: 'Northern Ndebele' },
  { code: 'nap', name: 'Neapolitan' },
  { code: 'ne', name: 'Nepali' },
  { code: 'no', name: 'Norwegian' },
  { code: 'nb', name: 'Norwegian bokmål' },
  { code: 'nn', name: 'Norwegian nynorsk' },
  { code: 'ii', name: 'Nuosu' },
  { code: 'oc', name: 'Occitan' },
  { code: 'oj', name: 'Ojibwe' },
  { code: 'cu', name: 'Old Church Slavonic, Old Bulgarian' },
  { code: 'or', name: 'Oriya' },
  { code: 'om', name: 'Oromo (Afaan Oromo)' },
  { code: 'os', name: 'Ossetian' },
  { code: 'pi', name: 'Pāli' },
  { code: 'ps', name: 'Pashto, Pushto' },
  { code: 'fa', name: 'Persian (Farsi)' },
  { code: 'pl', name: 'Polish' },
  { code: 'pa', name: 'Punjabi (Eastern)' },
  { code: 'qu', name: 'Quechua' },
  { code: 'rm', name: 'Romansh' },
  { code: 'ro', name: 'Romanian' },
  { code: 'se', name: 'Sami' },
  { code: 'sm', name: 'Samoan' },
  { code: 'sg', name: 'Sango' },
  { code: 'srd', name: 'Sardinian' },
  { code: 'sa', name: 'Sanskrit' },
  { code: 'sr', name: 'Serbian' },
  { code: 'sh', name: 'Serbo-Croatian' },
  { code: 'st', name: 'Sesotho' },
  { code: 'tn', name: 'Setswana' },
  { code: 'sn', name: 'Shona' },
  { code: 'ii', name: 'Sichuan Yi' },
  { code: 'scn', name: 'Sicilian' },
  { code: 'sd', name: 'Sindhi' },
  { code: 'si', name: 'Sinhalese' },
  { code: 'ss', name: 'Siswati' },
  { code: 'sk', name: 'Slovak' },
  { code: 'sl', name: 'Slovenian' },
  { code: 'so', name: 'Somali' },
  { code: 'nr', name: 'Southern Ndebele' },
  { code: 'su', name: 'Sundanese' },
  { code: 'sw', name: 'Swahili (Kiswahili)' },
  { code: 'ss', name: 'Swati' },
  { code: 'sv', name: 'Swedish' },
  { code: 'tl', name: 'Tagalog' },
  { code: 'ty', name: 'Tahitian' },
  { code: 'tg', name: 'Tajik' },
  { code: 'ta', name: 'Tamil' },
  { code: 'tt', name: 'Tatar' },
  { code: 'te', name: 'Telugu' },
  { code: 'th', name: 'Thai' },
  { code: 'bo', name: 'Tibetan' },
  { code: 'ti', name: 'Tigrinya' },
  { code: 'to', name: 'Tonga' },
  { code: 'ts', name: 'Tsonga' },
  { code: 'tk', name: 'Turkmen' },
  { code: 'tw', name: 'Twi' },
  { code: 'ug', name: 'Uyghur' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'uz', name: 'Uzbek' },
  { code: 've', name: 'Venda' },
  { code: 'vec', name: 'Venetian' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'vo', name: 'Volapük' },
  { code: 'wa', name: 'Wallon' },
  { code: 'cy', name: 'Welsh' },
  { code: 'wo', name: 'Wolof' },
  { code: 'fy', name: 'Western Frisian' },
  { code: 'xh', name: 'Xhosa' },
  { code: 'sah', name: 'Yakut' },
  { code: 'yi', name: 'Yiddish' },
  { code: 'yo', name: 'Yoruba' },
  { code: 'za', name: 'Zhuang, Chuang' },
  { code: 'zu', name: 'Zulu' },
];
const speechToTextLanguageList = [
  { name: 'Afrikaans (South Africa)', code: 'af-ZA' },
  { name: 'Albanian (Albania)', code: 'sq-AL' },
  { name: 'Amharic (Ethiopia)', code: 'am-ET' },
  { name: 'Arabic (Algeria)', code: 'ar-DZ' },
  { name: 'Arabic (Bahrain)', code: 'ar-BH' },
  { name: 'Arabic (Egypt)', code: 'ar-EG' },
  { name: 'Arabic (Iraq)', code: 'ar-IQ' },
  { name: 'Arabic (Israel)', code: 'ar-IL' },
  { name: 'Arabic (Jordan)', code: 'ar-JO' },
  { name: 'Arabic (Kuwait)', code: 'ar-KW' },
  { name: 'Arabic (Lebanon)', code: 'ar-LB' },
  { name: 'Arabic (Mauritania)', code: 'ar-MR' },
  { name: 'Arabic (Morocco)', code: 'ar-MA' },
  { name: 'Arabic (Oman)', code: 'ar-OM' },
  { name: 'Arabic (Qatar)', code: 'ar-QA' },
  { name: 'Arabic (Saudi Arabia)', code: 'ar-SA' },
  { name: 'Arabic (State of Palestine)', code: 'ar-PS' },
  { name: 'Arabic (Tunisia)', code: 'ar-TN' },
  { name: 'Arabic (United Arab Emirates)', code: 'ar-AE' },
  { name: 'Arabic (Yemen)', code: 'ar-YE' },
  { name: 'Armenian (Armenia)', code: 'hy-AM' },
  { name: 'Azerbaijani (Azerbaijan)', code: 'az-AZ' },
  { name: 'Basque (Spain)', code: 'eu-ES' },
  { name: 'Bengali (Bangladesh)', code: 'bn-BD' },
  { name: 'Bengali (India)', code: 'bn-IN' },
  { name: 'Bosnian (Bosnia and Herzegovina)', code: 'bs-BA' },
  { name: 'Bulgarian (Bulgaria)', code: 'bg-BG' },
  { name: 'Burmese (Myanmar)', code: 'my-MM' },
  { name: 'Catalan (Spain)', code: 'ca-ES' },
  { name: 'Chinese, Cantonese (Traditional Hong Kong)', code: 'yue-Hant-HK' },
  { name: 'Chinese, Mandarin (Simplified, China)', code: 'zh' },
  { name: 'Chinese, Mandarin (Traditional, Taiwan)', code: 'zh-TW' },
  { name: 'Croatian (Croatia)', code: 'hr-HR' },
  { name: 'Czech (Czech Republic)', code: 'cs-CZ' },
  { name: 'Danish (Denmark)', code: 'da-DK' },
  { name: 'Dutch (Belgium)', code: 'nl-BE' },
  { name: 'Dutch (Netherlands)', code: 'nl-NL' },
  { name: 'English (Australia)', code: 'en-AU' },
  { name: 'English (Canada)', code: 'en-CA' },
  { name: 'English (Ghana)', code: 'en-GH' },
  { name: 'English (Hong Kong)', code: 'en-HK' },
  { name: 'English (India)', code: 'en-IN' },
  { name: 'English (Ireland)', code: 'en-IE' },
  { name: 'English (Kenya)', code: 'en-KE' },
  { name: 'English (New Zealand)', code: 'en-NZ' },
  { name: 'English (Nigeria)', code: 'en-NG' },
  { name: 'English (Pakistan)', code: 'en-PK' },
  { name: 'English (Philippines)', code: 'en-PH' },
  { name: 'English (Singapore)', code: 'en-SG' },
  { name: 'English (South Africa)', code: 'en-ZA' },
  { name: 'English (Tanzania)', code: 'en-TZ' },
  { name: 'English (United Kingdom)', code: 'en-GB' },
  { name: 'English (United States)', code: 'en-US' },
  { name: 'Estonian (Estonia)', code: 'et-EE' },
  { name: 'Filipino (Philippines)', code: 'fil-PH' },
  { name: 'Finnish (Finland)', code: 'fi-FI' },
  { name: 'French (Belgium)', code: 'fr-BE' },
  { name: 'French (Canada)', code: 'fr-CA' },
  { name: 'French (France)', code: 'fr-FR' },
  { name: 'French (Switzerland)', code: 'fr-CH' },
  { name: 'Galician (Spain)', code: 'gl-ES' },
  { name: 'Georgian (Georgia)', code: 'ka-GE' },
  { name: 'German (Austria)', code: 'de-AT' },
  { name: 'German (Germany)', code: 'de-DE' },
  { name: 'German (Switzerland)', code: 'de-CH' },
  { name: 'Greek (Greece)', code: 'el-GR' },
  { name: 'Gujarati (India)', code: 'gu-IN' },
  { name: 'Hebrew (Israel)', code: 'iw-IL' },
  { name: 'Hindi (India)', code: 'hi-IN' },
  { name: 'Hungarian (Hungary)', code: 'hu-HU' },
  { name: 'Icelandic (Iceland)', code: 'is-IS' },
  { name: 'Indonesian (Indonesia)', code: 'id-ID' },
  { name: 'Italian (Italy)', code: 'it-IT' },
  { name: 'Italian (Switzerland)', code: 'it-CH' },
  { name: 'Japanese (Japan)', code: 'ja-JP' },
  { name: 'Javanese (Indonesia)', code: 'jv-ID' },
  { name: 'Kannada (India)', code: 'kn-IN' },
  { name: 'Kazakh (Kazakhstan)', code: 'kk-KZ' },
  { name: 'Khmer (Cambodia)', code: 'km-KH' },
  { name: 'Kinyarwanda (Rwanda)', code: 'rw-RW' },
  { name: 'Korean (South Korea)', code: 'ko-KR' },
  { name: 'Lao (Laos)', code: 'lo-LA' },
  { name: 'Latvian (Latvia)', code: 'lv-LV' },
  { name: 'Lithuanian (Lithuania)', code: 'lt-LT' },
  { name: 'Macedonian (North Macedonia)', code: 'mk-MK' },
  { name: 'Malay (Malaysia)', code: 'ms-MY' },
  { name: 'Malayalam (India)', code: 'ml-IN' },
  { name: 'Marathi (India)', code: 'mr-IN' },
  { name: 'Mongolian (Mongolia)', code: 'mn-MN' },
  { name: 'Nepali (Nepal)', code: 'ne-NP' },
  { name: 'Norwegian Bokmål (Norway)', code: 'no-NO' },
  { name: 'Persian (Iran)', code: 'fa-IR' },
  { name: 'Polish (Poland)', code: 'pl-PL' },
  { name: 'Portuguese (Brazil)', code: 'pt-BR' },
  { name: 'Portuguese (Portugal)', code: 'pt-PT' },
  { name: 'Punjabi (Gurmukhi India)', code: 'pa-Guru-IN' },
  { name: 'Romanian (Romania)', code: 'ro-RO' },
  { name: 'Russian (Russia)', code: 'ru-RU' },
  { name: 'Serbian (Serbia)', code: 'sr-RS' },
  { name: 'Sinhala (Sri Lanka)', code: 'si-LK' },
  { name: 'Slovak (Slovakia)', code: 'sk-SK' },
  { name: 'Slovenian (Slovenia)', code: 'sl-SI' },
  { name: 'Southern Sotho (South Africa)', code: 'st-ZA' },
  { name: 'Spanish (Argentina)', code: 'es-AR' },
  { name: 'Spanish (Bolivia)', code: 'es-BO' },
  { name: 'Spanish (Chile)', code: 'es-CL' },
  { name: 'Spanish (Colombia)', code: 'es-CO' },
  { name: 'Spanish (Costa Rica)', code: 'es-CR' },
  { name: 'Spanish (Dominican Republic)', code: 'es-DO' },
  { name: 'Spanish (Ecuador)', code: 'es-EC' },
  { name: 'Spanish (El Salvador)', code: 'es-SV' },
  { name: 'Spanish (Guatemala)', code: 'es-GT' },
  { name: 'Spanish (Honduras)', code: 'es-HN' },
  { name: 'Spanish (Mexico)', code: 'es-MX' },
  { name: 'Spanish (Nicaragua)', code: 'es-NI' },
  { name: 'Spanish (Panama)', code: 'es-PA' },
  { name: 'Spanish (Paraguay)', code: 'es-PY' },
  { name: 'Spanish (Peru)', code: 'es-PE' },
  { name: 'Spanish (Puerto Rico)', code: 'es-PR' },
  { name: 'Spanish (Spain)', code: 'es-ES' },
  { name: 'Spanish (United States)', code: 'es-US' },
  { name: 'Spanish (Uruguay)', code: 'es-UY' },
  { name: 'Spanish (Venezuela)', code: 'es-VE' },
  { name: 'Sundanese (Indonesia)', code: 'su-ID' },
  { name: 'Swahili (Kenya)', code: 'sw-KE' },
  { name: 'Swahili (Tanzania)', code: 'sw-TZ' },
  { name: 'Swati (Latin, South Africa)', code: 'ss-Latn-ZA' },
  { name: 'Swedish (Sweden)', code: 'sv-SE' },
  { name: 'Tamil (India)', code: 'ta-IN' },
  { name: 'Tamil (Malaysia)', code: 'ta-MY' },
  { name: 'Tamil (Singapore)', code: 'ta-SG' },
  { name: 'Tamil (Sri Lanka)', code: 'ta-LK' },
  { name: 'Telugu (India)', code: 'te-IN' },
  { name: 'Thai (Thailand)', code: 'th-TH' },
  { name: 'Tsonga (South Africa)', code: 'ts-ZA' },
  { name: 'Tswana (Latin, South Africa)', code: 'tn-Latn-ZA' },
  { name: 'Turkish (Turkey)', code: 'tr-TR' },
  { name: 'Ukrainian (Ukraine)', code: 'uk-UA' },
  { name: 'Urdu (India)', code: 'ur-IN' },
  { name: 'Urdu (Pakistan)', code: 'ur-PK' },
  { name: 'Uzbek (Uzbekistan)', code: 'uz-UZ' },
  { name: 'Venda (South Africa)', code: 've-ZA' },
  { name: 'Vietnamese (Vietnam)', code: 'vi-VN' },
  { name: 'Xhosa (South Africa)', code: 'xh-ZA' },
  { name: 'Zulu (South Africa)', code: 'zu-ZA' },
];

const textToSpeechVoiceList = [
  { name: 'Juniper', code: 'juniper' },
  { name: 'Breeze', code: 'breeze' },
  { name: 'Cove', code: 'cove' },
  { name: 'Sky', code: 'sky' },
  { name: 'Ember', code: 'ember' },
];
