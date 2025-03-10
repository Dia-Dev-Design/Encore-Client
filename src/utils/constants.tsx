import { CountryData, StateData, TimeZone, User } from "./interfaces";

export const serverURL = () => {
    const devEnviroment = "https://api-dev.startupencore.ai";
    return devEnviroment;
};

export const countries: CountryData[] = [
    { code: "US", name: "United States", callingCode: "1" },
    { code: "CA", name: "Canada", callingCode: "1" },
    { code: "MX", name: "Mexico", callingCode: "52" },
    { code: "VE", name: "Venezuela", callingCode: "58" },
    { code: "AF", name: "Afghanistan", callingCode: "93" },
    { code: "AL", name: "Albania", callingCode: "355" },
    { code: "DZ", name: "Algeria", callingCode: "213" },
    { code: "AD", name: "Andorra", callingCode: "376" },
    { code: "AO", name: "Angola", callingCode: "244" },
    { code: "AR", name: "Argentina", callingCode: "54" },
    { code: "AM", name: "Armenia", callingCode: "374" },
    { code: "AU", name: "Australia", callingCode: "61" },
    { code: "AT", name: "Austria", callingCode: "43" },
    { code: "AZ", name: "Azerbaijan", callingCode: "994" },
    { code: "BH", name: "Bahrain", callingCode: "973" },
    { code: "BD", name: "Bangladesh", callingCode: "880" },
    { code: "BY", name: "Belarus", callingCode: "375" },
    { code: "BE", name: "Belgium", callingCode: "32" },
    { code: "BZ", name: "Belize", callingCode: "501" },
    { code: "BJ", name: "Benin", callingCode: "229" },
    { code: "BT", name: "Bhutan", callingCode: "975" },
    { code: "BO", name: "Bolivia", callingCode: "591" },
    { code: "BA", name: "Bosnia and Herzegovina", callingCode: "387" },
    { code: "BW", name: "Botswana", callingCode: "267" },
    { code: "BR", name: "Brazil", callingCode: "55" },
    { code: "BN", name: "Brunei", callingCode: "673" },
    { code: "BG", name: "Bulgaria", callingCode: "359" },
    { code: "BF", name: "Burkina Faso", callingCode: "226" },
    { code: "BI", name: "Burundi", callingCode: "257" },
    { code: "KH", name: "Cambodia", callingCode: "855" },
    { code: "CM", name: "Cameroon", callingCode: "237" },
    { code: "CV", name: "Cape Verde", callingCode: "238" },
    { code: "CF", name: "Central African Republic", callingCode: "236" },
    { code: "TD", name: "Chad", callingCode: "235" },
    { code: "CL", name: "Chile", callingCode: "56" },
    { code: "CN", name: "China", callingCode: "86" },
    { code: "CO", name: "Colombia", callingCode: "57" },
    { code: "KM", name: "Comoros", callingCode: "269" },
    { code: "CG", name: "Congo", callingCode: "242" },
    { code: "CD", name: "Congo (DRC)", callingCode: "243" },
    { code: "CR", name: "Costa Rica", callingCode: "506" },
    { code: "HR", name: "Croatia", callingCode: "385" },
    { code: "CU", name: "Cuba", callingCode: "53" },
    { code: "CY", name: "Cyprus", callingCode: "357" },
    { code: "CZ", name: "Czech Republic", callingCode: "420" },
    { code: "DK", name: "Denmark", callingCode: "45" },
    { code: "DJ", name: "Djibouti", callingCode: "253" },
    { code: "DM", name: "Dominica", callingCode: "1767" },
    { code: "DO", name: "Dominican Republic", callingCode: "1" },
    { code: "EC", name: "Ecuador", callingCode: "593" },
    { code: "EG", name: "Egypt", callingCode: "20" },
    { code: "SV", name: "El Salvador", callingCode: "503" },
    { code: "GQ", name: "Equatorial Guinea", callingCode: "240" },
    { code: "ER", name: "Eritrea", callingCode: "291" },
    { code: "EE", name: "Estonia", callingCode: "372" },
    { code: "ET", name: "Ethiopia", callingCode: "251" },
    { code: "FI", name: "Finland", callingCode: "358" },
    { code: "FR", name: "France", callingCode: "33" },
    { code: "GA", name: "Gabon", callingCode: "241" },
    { code: "GM", name: "Gambia", callingCode: "220" },
    { code: "GE", name: "Georgia", callingCode: "995" },
    { code: "DE", name: "Germany", callingCode: "49" },
    { code: "GH", name: "Ghana", callingCode: "233" },
    { code: "GR", name: "Greece", callingCode: "30" },
    { code: "GT", name: "Guatemala", callingCode: "502" },
    { code: "HT", name: "Haiti", callingCode: "509" },
    { code: "HN", name: "Honduras", callingCode: "504" },
    { code: "HK", name: "Hong Kong", callingCode: "852" },
    { code: "HU", name: "Hungary", callingCode: "36" },
    { code: "IS", name: "Iceland", callingCode: "354" },
    { code: "IN", name: "India", callingCode: "91" },
    { code: "ID", name: "Indonesia", callingCode: "62" },
    { code: "IR", name: "Iran", callingCode: "98" },
    { code: "IQ", name: "Iraq", callingCode: "964" },
    { code: "IE", name: "Ireland", callingCode: "353" },
    { code: "IL", name: "Israel", callingCode: "972" },
    { code: "IT", name: "Italy", callingCode: "39" },
    { code: "JM", name: "Jamaica", callingCode: "1" },
    { code: "JP", name: "Japan", callingCode: "81" },
    { code: "JO", name: "Jordan", callingCode: "962" },
    { code: "KZ", name: "Kazakhstan", callingCode: "7" },
    { code: "KE", name: "Kenya", callingCode: "254" },
    { code: "KI", name: "Kiribati", callingCode: "686" },
    { code: "KP", name: "Korea (North)", callingCode: "850" },
    { code: "KR", name: "Korea (South)", callingCode: "82" },
    { code: "KW", name: "Kuwait", callingCode: "965" },
    { code: "KG", name: "Kyrgyzstan", callingCode: "996" },
    { code: "LA", name: "Laos", callingCode: "856" },
    { code: "LV", name: "Latvia", callingCode: "371" },
    { code: "LB", name: "Lebanon", callingCode: "961" },
    { code: "LS", name: "Lesotho", callingCode: "266" },
    { code: "LR", name: "Liberia", callingCode: "231" },
    { code: "LY", name: "Libya", callingCode: "218" },
    { code: "LI", name: "Liechtenstein", callingCode: "423" },
    { code: "LT", name: "Lithuania", callingCode: "370" },
    { code: "LU", name: "Luxembourg", callingCode: "352" },
    { code: "MG", name: "Madagascar", callingCode: "261" },
    { code: "MW", name: "Malawi", callingCode: "265" },
    { code: "MY", name: "Malaysia", callingCode: "60" },
    { code: "MV", name: "Maldives", callingCode: "960" },
    { code: "ML", name: "Mali", callingCode: "223" },
    { code: "MT", name: "Malta", callingCode: "356" },
    { code: "MH", name: "Marshall Islands", callingCode: "692" },
    { code: "MR", name: "Mauritania", callingCode: "222" },
    { code: "MU", name: "Mauritius", callingCode: "230" },
    { code: "FM", name: "Micronesia", callingCode: "691" },
    { code: "MD", name: "Moldova", callingCode: "373" },
    { code: "MC", name: "Monaco", callingCode: "377" },
    { code: "MN", name: "Mongolia", callingCode: "976" },
    { code: "ME", name: "Montenegro", callingCode: "382" },
    { code: "MA", name: "Morocco", callingCode: "212" },
    { code: "MZ", name: "Mozambique", callingCode: "258" },
    { code: "MM", name: "Myanmar (Burma)", callingCode: "95" },
    { code: "NA", name: "Namibia", callingCode: "264" },
    { code: "NR", name: "Nauru", callingCode: "674" },
    { code: "NP", name: "Nepal", callingCode: "977" },
    { code: "NL", name: "Netherlands", callingCode: "31" },
    { code: "NZ", name: "New Zealand", callingCode: "64" },
    { code: "NI", name: "Nicaragua", callingCode: "505" },
    { code: "NE", name: "Niger", callingCode: "227" },
    { code: "NG", name: "Nigeria", callingCode: "234" },
    { code: "NO", name: "Norway", callingCode: "47" },
    { code: "OM", name: "Oman", callingCode: "968" },
    { code: "PK", name: "Pakistan", callingCode: "92" },
    { code: "PW", name: "Palau", callingCode: "680" },
    { code: "PA", name: "Panama", callingCode: "507" },
    { code: "PG", name: "Papua New Guinea", callingCode: "675" },
    { code: "PY", name: "Paraguay", callingCode: "595" },
    { code: "PE", name: "Peru", callingCode: "51" },
    { code: "PH", name: "Philippines", callingCode: "63" },
    { code: "PL", name: "Poland", callingCode: "48" },
    { code: "PT", name: "Portugal", callingCode: "351" },
    { code: "QA", name: "Qatar", callingCode: "974" },
    { code: "RO", name: "Romania", callingCode: "40" },
    { code: "RU", name: "Russia", callingCode: "7" },
    { code: "RW", name: "Rwanda", callingCode: "250" },
    { code: "WS", name: "Samoa", callingCode: "685" },
    { code: "SM", name: "San Marino", callingCode: "378" },
    { code: "ST", name: "Sao Tome and Principe", callingCode: "239" },
    { code: "SA", name: "Saudi Arabia", callingCode: "966" },
    { code: "SN", name: "Senegal", callingCode: "221" },
    { code: "RS", name: "Serbia", callingCode: "381" },
    { code: "SC", name: "Seychelles", callingCode: "248" },
    { code: "SL", name: "Sierra Leone", callingCode: "232" },
    { code: "SG", name: "Singapore", callingCode: "65" },
    { code: "SK", name: "Slovakia", callingCode: "421" },
    { code: "SI", name: "Slovenia", callingCode: "386" },
    { code: "SB", name: "Solomon Islands", callingCode: "677" },
    { code: "SO", name: "Somalia", callingCode: "252" },
    { code: "ZA", name: "South Africa", callingCode: "27" },
    { code: "ES", name: "Spain", callingCode: "34" },
    { code: "LK", name: "Sri Lanka", callingCode: "94" },
    { code: "SD", name: "Sudan", callingCode: "249" },
    { code: "SR", name: "Suriname", callingCode: "597" },
    { code: "SE", name: "Sweden", callingCode: "46" },
    { code: "CH", name: "Switzerland", callingCode: "41" },
    { code: "SY", name: "Syria", callingCode: "963" },
    { code: "TW", name: "Taiwan", callingCode: "886" },
    { code: "TJ", name: "Tajikistan", callingCode: "992" },
    { code: "TZ", name: "Tanzania", callingCode: "255" },
    { code: "TH", name: "Thailand", callingCode: "66" },
    { code: "TL", name: "Timor-Leste", callingCode: "670" },
    { code: "TG", name: "Togo", callingCode: "228" },
    { code: "TO", name: "Tonga", callingCode: "676" },
    { code: "TT", name: "Trinidad and Tobago", callingCode: "1-868" },
    { code: "TN", name: "Tunisia", callingCode: "216" },
    { code: "TR", name: "Turkey", callingCode: "90" },
    { code: "TM", name: "Turkmenistan", callingCode: "993" },
    { code: "TV", name: "Tuvalu", callingCode: "688" },
    { code: "UG", name: "Uganda", callingCode: "256" },
    { code: "UA", name: "Ukraine", callingCode: "380" },
    { code: "AE", name: "United Arab Emirates", callingCode: "971" },
    { code: "GB", name: "United Kingdom", callingCode: "44" },
    { code: "UY", name: "Uruguay", callingCode: "598" },
    { code: "UZ", name: "Uzbekistan", callingCode: "998" },
    { code: "VU", name: "Vanuatu", callingCode: "678" },
    { code: "VA", name: "Vatican City", callingCode: "39" },
    { code: "VN", name: "Vietnam", callingCode: "84" },
    { code: "YE", name: "Yemen", callingCode: "967" },
    { code: "ZM", name: "Zambia", callingCode: "260" },
    { code: "ZW", name: "Zimbabwe", callingCode: "263" },
];

export const states: StateData[] = [
    { code: "US-AL", name: "Alabama" },
    { code: "US-AK", name: "Alaska" },
    { code: "US-AZ", name: "Arizona" },
    { code: "US-AR", name: "Arkansas" },
    { code: "US-CA", name: "California" },
    { code: "US-CO", name: "Colorado" },
    { code: "US-CT", name: "Connecticut" },
    { code: "US-DE", name: "Delaware" },
    { code: "US-FL", name: "Florida" },
    { code: "US-GA", name: "Georgia" },
    { code: "US-HI", name: "Hawaii" },
    { code: "US-ID", name: "Idaho" },
    { code: "US-IL", name: "Illinois" },
    { code: "US-IN", name: "Indiana" },
    { code: "US-IA", name: "Iowa" },
    { code: "US-KS", name: "Kansas" },
    { code: "US-KY", name: "Kentucky" },
    { code: "US-LA", name: "Louisiana" },
    { code: "US-ME", name: "Maine" },
    { code: "US-MD", name: "Maryland" },
    { code: "US-MA", name: "Massachusetts" },
    { code: "US-MI", name: "Michigan" },
    { code: "US-MN", name: "Minnesota" },
    { code: "US-MS", name: "Mississippi" },
    { code: "US-MO", name: "Missouri" },
    { code: "US-MT", name: "Montana" },
    { code: "US-NE", name: "Nebraska" },
    { code: "US-NV", name: "Nevada" },
    { code: "US-NH", name: "New Hampshire" },
    { code: "US-NJ", name: "New Jersey" },
    { code: "US-NM", name: "New Mexico" },
    { code: "US-NY", name: "New York" },
    { code: "US-NC", name: "North Carolina" },
    { code: "US-ND", name: "North Dakota" },
    { code: "US-OH", name: "Ohio" },
    { code: "US-OK", name: "Oklahoma" },
    { code: "US-OR", name: "Oregon" },
    { code: "US-PA", name: "Pennsylvania" },
    { code: "US-RI", name: "Rhode Island" },
    { code: "US-SC", name: "South Carolina" },
    { code: "US-SD", name: "South Dakota" },
    { code: "US-TN", name: "Tennessee" },
    { code: "US-TX", name: "Texas" },
    { code: "US-UT", name: "Utah" },
    { code: "US-VT", name: "Vermont" },
    { code: "US-VA", name: "Virginia" },
    { code: "US-WA", name: "Washington" },
    { code: "US-WV", name: "West Virginia" },
    { code: "US-WI", name: "Wisconsin" },
    { code: "US-WY", name: "Wyoming" },
];

export const timeZones: TimeZone[] = [
    {
        value: "Dateline Standard Time",
        abbr: "DST",
        offset: -12,
        isdst: false,
        text: "(UTC-12:00) International Date Line West",
        utc: [
            "Etc/GMT+12"
        ]
    },
    {
        value: "UTC-11",
        abbr: "U",
        offset: -11,
        isdst: false,
        text: "(UTC-11:00) Coordinated Universal Time-11",
        utc: [
            "Etc/GMT+11",
            "Pacific/Midway",
            "Pacific/Niue",
            "Pacific/Pago_Pago"
        ]
    },
    {
        value: "Hawaiian Standard Time",
        abbr: "HST",
        offset: -10,
        isdst: false,
        text: "(UTC-10:00) Hawaii",
        utc: [
            "Etc/GMT+10",
            "Pacific/Honolulu",
            "Pacific/Johnston",
            "Pacific/Rarotonga",
            "Pacific/Tahiti"
        ]
    },
    {
        value: "Alaskan Standard Time",
        abbr: "AKDT",
        offset: -8,
        isdst: true,
        text: "(UTC-09:00) Alaska",
        utc: [
            "America/Anchorage",
            "America/Juneau",
            "America/Nome",
            "America/Sitka",
            "America/Yakutat"
        ]
    },
    {
        value: "Pacific Standard Time (Mexico)",
        abbr: "PDT",
        offset: -7,
        isdst: true,
        text: "(UTC-08:00) Baja California",
        utc: [
            "America/Santa_Isabel"
        ]
    },
    {
        value: "Pacific Daylight Time",
        abbr: "PDT",
        offset: -7,
        isdst: true,
        text: "(UTC-07:00) Pacific Daylight Time (US & Canada)",
        utc: [
            "America/Los_Angeles",
            "America/Tijuana",
            "America/Vancouver"
        ]
    },
    {
        value: "Pacific Standard Time",
        abbr: "PST",
        offset: -8,
        isdst: false,
        text: "(UTC-08:00) Pacific Standard Time (US & Canada)",
        utc: [
            "America/Los_Angeles",
            "America/Tijuana",
            "America/Vancouver",
            "PST8PDT"
        ]
    },
    {
        value: "US Mountain Standard Time",
        abbr: "UMST",
        offset: -7,
        isdst: false,
        text: "(UTC-07:00) Arizona",
        utc: [
            "America/Creston",
            "America/Dawson",
            "America/Dawson_Creek",
            "America/Hermosillo",
            "America/Phoenix",
            "America/Whitehorse",
            "Etc/GMT+7"
        ]
    },
    {
        value: "Mountain Standard Time (Mexico)",
        abbr: "MDT",
        offset: -6,
        isdst: true,
        text: "(UTC-07:00) Chihuahua, La Paz, Mazatlan",
        utc: [
            "America/Chihuahua",
            "America/Mazatlan"
        ]
    },
    {
        value: "Mountain Standard Time",
        abbr: "MDT",
        offset: -6,
        isdst: true,
        text: "(UTC-07:00) Mountain Time (US & Canada)",
        utc: [
            "America/Boise",
            "America/Cambridge_Bay",
            "America/Denver",
            "America/Edmonton",
            "America/Inuvik",
            "America/Ojinaga",
            "America/Yellowknife",
            "MST7MDT"
        ]
    },
    {
        value: "Central America Standard Time",
        abbr: "CAST",
        offset: -6,
        isdst: false,
        text: "(UTC-06:00) Central America",
        utc: [
            "America/Belize",
            "America/Costa_Rica",
            "America/El_Salvador",
            "America/Guatemala",
            "America/Managua",
            "America/Tegucigalpa",
            "Etc/GMT+6",
            "Pacific/Galapagos"
        ]
    },
    {
        value: "Central Standard Time",
        abbr: "CDT",
        offset: -5,
        isdst: true,
        text: "(UTC-06:00) Central Time (US & Canada)",
        utc: [
            "America/Chicago",
            "America/Indiana/Knox",
            "America/Indiana/Tell_City",
            "America/Matamoros",
            "America/Menominee",
            "America/North_Dakota/Beulah",
            "America/North_Dakota/Center",
            "America/North_Dakota/New_Salem",
            "America/Rainy_River",
            "America/Rankin_Inlet",
            "America/Resolute",
            "America/Winnipeg",
            "CST6CDT"
        ]
    },
    {
        value: "Central Standard Time (Mexico)",
        abbr: "CDT",
        offset: -5,
        isdst: true,
        text: "(UTC-06:00) Guadalajara, Mexico City, Monterrey",
        utc: [
            "America/Bahia_Banderas",
            "America/Cancun",
            "America/Merida",
            "America/Mexico_City",
            "America/Monterrey"
        ]
    },
    {
        value: "Canada Central Standard Time",
        abbr: "CCST",
        offset: -6,
        isdst: false,
        text: "(UTC-06:00) Saskatchewan",
        utc: [
            "America/Regina",
            "America/Swift_Current"
        ]
    },
    {
        value: "SA Pacific Standard Time",
        abbr: "SPST",
        offset: -5,
        isdst: false,
        text: "(UTC-05:00) Bogota, Lima, Quito",
        utc: [
            "America/Bogota",
            "America/Cayman",
            "America/Coral_Harbour",
            "America/Eirunepe",
            "America/Guayaquil",
            "America/Jamaica",
            "America/Lima",
            "America/Panama",
            "America/Rio_Branco",
            "Etc/GMT+5"
        ]
    },
    {
        value: "Eastern Standard Time",
        abbr: "EST",
        offset: -5,
        isdst: false,
        text: "(UTC-05:00) Eastern Time (US & Canada)",
        utc: [
            "America/Detroit",
            "America/Havana",
            "America/Indiana/Petersburg",
            "America/Indiana/Vincennes",
            "America/Indiana/Winamac",
            "America/Iqaluit",
            "America/Kentucky/Monticello",
            "America/Louisville",
            "America/Montreal",
            "America/Nassau",
            "America/New_York",
            "America/Nipigon",
            "America/Pangnirtung",
            "America/Port-au-Prince",
            "America/Thunder_Bay",
            "America/Toronto"
        ]
    },
    {
        value: "Eastern Daylight Time",
        abbr: "EDT",
        offset: -4,
        isdst: true,
        text: "(UTC-04:00) Eastern Daylight Time (US & Canada)",
        utc: [
            "America/Detroit",
            "America/Havana",
            "America/Indiana/Petersburg",
            "America/Indiana/Vincennes",
            "America/Indiana/Winamac",
            "America/Iqaluit",
            "America/Kentucky/Monticello",
            "America/Louisville",
            "America/Montreal",
            "America/Nassau",
            "America/New_York",
            "America/Nipigon",
            "America/Pangnirtung",
            "America/Port-au-Prince",
            "America/Thunder_Bay",
            "America/Toronto"
        ]
    },
    {
        value: "US Eastern Standard Time",
        abbr: "UEDT",
        offset: -5,
        isdst: false,
        text: "(UTC-05:00) Indiana (East)",
        utc: [
            "America/Indiana/Marengo",
            "America/Indiana/Vevay",
            "America/Indianapolis"
        ]
    },
    {
        value: "Venezuela Standard Time",
        abbr: "VST",
        offset: -4.5,
        isdst: false,
        text: "(UTC-04:30) Caracas",
        utc: [
            "America/Caracas"
        ]
    },
    {
        value: "Paraguay Standard Time",
        abbr: "PYT",
        offset: -4,
        isdst: false,
        text: "(UTC-04:00) Asuncion",
        utc: [
            "America/Asuncion"
        ]
    },
    {
        value: "Atlantic Standard Time",
        abbr: "ADT",
        offset: -3,
        isdst: true,
        text: "(UTC-04:00) Atlantic Time (Canada)",
        utc: [
            "America/Glace_Bay",
            "America/Goose_Bay",
            "America/Halifax",
            "America/Moncton",
            "America/Thule",
            "Atlantic/Bermuda"
        ]
    },
    {
        value: "Central Brazilian Standard Time",
        abbr: "CBST",
        offset: -4,
        isdst: false,
        text: "(UTC-04:00) Cuiaba",
        utc: [
            "America/Campo_Grande",
            "America/Cuiaba"
        ]
    },
    {
        value: "SA Western Standard Time",
        abbr: "SWST",
        offset: -4,
        isdst: false,
        text: "(UTC-04:00) Georgetown, La Paz, Manaus, San Juan",
        utc: [
            "America/Anguilla",
            "America/Antigua",
            "America/Aruba",
            "America/Barbados",
            "America/Blanc-Sablon",
            "America/Boa_Vista",
            "America/Curacao",
            "America/Dominica",
            "America/Grand_Turk",
            "America/Grenada",
            "America/Guadeloupe",
            "America/Guyana",
            "America/Kralendijk",
            "America/La_Paz",
            "America/Lower_Princes",
            "America/Manaus",
            "America/Marigot",
            "America/Martinique",
            "America/Montserrat",
            "America/Port_of_Spain",
            "America/Porto_Velho",
            "America/Puerto_Rico",
            "America/Santo_Domingo",
            "America/St_Barthelemy",
            "America/St_Kitts",
            "America/St_Lucia",
            "America/St_Thomas",
            "America/St_Vincent",
            "America/Tortola",
            "Etc/GMT+4"
        ]
    },
    {
        value: "Pacific SA Standard Time",
        abbr: "PSST",
        offset: -4,
        isdst: false,
        text: "(UTC-04:00) Santiago",
        utc: [
            "America/Santiago",
            "Antarctica/Palmer"
        ]
    },
    {
        value: "Newfoundland Standard Time",
        abbr: "NDT",
        offset: -2.5,
        isdst: true,
        text: "(UTC-03:30) Newfoundland",
        utc: [
            "America/St_Johns"
        ]
    },
    {
        value: "E. South America Standard Time",
        abbr: "ESAST",
        offset: -3,
        isdst: false,
        text: "(UTC-03:00) Brasilia",
        utc: [
            "America/Sao_Paulo"
        ]
    },
    {
        value: "Argentina Standard Time",
        abbr: "AST",
        offset: -3,
        isdst: false,
        text: "(UTC-03:00) Buenos Aires",
        utc: [
            "America/Argentina/Buenos_Aires",
            "America/Argentina/Catamarca",
            "America/Argentina/Cordoba",
            "America/Argentina/Jujuy",
            "America/Argentina/La_Rioja",
            "America/Argentina/Mendoza",
            "America/Argentina/Rio_Gallegos",
            "America/Argentina/Salta",
            "America/Argentina/San_Juan",
            "America/Argentina/San_Luis",
            "America/Argentina/Tucuman",
            "America/Argentina/Ushuaia",
            "America/Buenos_Aires",
            "America/Catamarca",
            "America/Cordoba",
            "America/Jujuy",
            "America/Mendoza"
        ]
    },
    {
        value: "SA Eastern Standard Time",
        abbr: "SEST",
        offset: -3,
        isdst: false,
        text: "(UTC-03:00) Cayenne, Fortaleza",
        utc: [
            "America/Araguaina",
            "America/Belem",
            "America/Cayenne",
            "America/Fortaleza",
            "America/Maceio",
            "America/Paramaribo",
            "America/Recife",
            "America/Santarem",
            "Antarctica/Rothera",
            "Atlantic/Stanley",
            "Etc/GMT+3"
        ]
    },
    {
        value: "Greenland Standard Time",
        abbr: "GDT",
        offset: -3,
        isdst: true,
        text: "(UTC-03:00) Greenland",
        utc: [
            "America/Godthab"
        ]
    },
    {
        value: "Montevideo Standard Time",
        abbr: "MST",
        offset: -3,
        isdst: false,
        text: "(UTC-03:00) Montevideo",
        utc: [
            "America/Montevideo"
        ]
    },
    {
        value: "Bahia Standard Time",
        abbr: "BST",
        offset: -3,
        isdst: false,
        text: "(UTC-03:00) Salvador",
        utc: [
            "America/Bahia"
        ]
    },
    {
        value: "UTC-02",
        abbr: "U",
        offset: -2,
        isdst: false,
        text: "(UTC-02:00) Coordinated Universal Time-02",
        utc: [
            "America/Noronha",
            "Atlantic/South_Georgia",
            "Etc/GMT+2"
        ]
    },
    {
        value: "Mid-Atlantic Standard Time",
        abbr: "MDT",
        offset: -1,
        isdst: true,
        text: "(UTC-02:00) Mid-Atlantic - Old",
        utc: []
    },
    {
        value: "Azores Standard Time",
        abbr: "ADT",
        offset: 0,
        isdst: true,
        text: "(UTC-01:00) Azores",
        utc: [
            "America/Scoresbysund",
            "Atlantic/Azores"
        ]
    },
    {
        value: "Cape Verde Standard Time",
        abbr: "CVST",
        offset: -1,
        isdst: false,
        text: "(UTC-01:00) Cape Verde Is.",
        utc: [
            "Atlantic/Cape_Verde",
            "Etc/GMT+1"
        ]
    },
    {
        value: "Morocco Standard Time",
        abbr: "MDT",
        offset: 1,
        isdst: true,
        text: "(UTC) Casablanca",
        utc: [
            "Africa/Casablanca",
            "Africa/El_Aaiun"
        ]
    },
    {
        value: "UTC",
        abbr: "UTC",
        offset: 0,
        isdst: false,
        text: "(UTC) Coordinated Universal Time",
        utc: [
            "America/Danmarkshavn",
            "Etc/GMT"
        ]
    },
    {
        value: "GMT Standard Time",
        abbr: "GMT",
        offset: 0,
        isdst: false,
        text: "(UTC) Edinburgh, London",
        utc: [
            "Europe/Isle_of_Man",
            "Europe/Guernsey",
            "Europe/Jersey",
            "Europe/London"
        ]
    },
    {
        value: "British Summer Time",
        abbr: "BST",
        offset: 1,
        isdst: true,
        text: "(UTC+01:00) Edinburgh, London",
        utc: [
            "Europe/Isle_of_Man",
            "Europe/Guernsey",
            "Europe/Jersey",
            "Europe/London"
        ]
    },
    {
        value: "GMT Standard Time",
        abbr: "GDT",
        offset: 1,
        isdst: true,
        text: "(UTC) Dublin, Lisbon",
        utc: [
            "Atlantic/Canary",
            "Atlantic/Faeroe",
            "Atlantic/Madeira",
            "Europe/Dublin",
            "Europe/Lisbon"
        ]
    },
    {
        value: "Greenwich Standard Time",
        abbr: "GST",
        offset: 0,
        isdst: false,
        text: "(UTC) Monrovia, Reykjavik",
        utc: [
            "Africa/Abidjan",
            "Africa/Accra",
            "Africa/Bamako",
            "Africa/Banjul",
            "Africa/Bissau",
            "Africa/Conakry",
            "Africa/Dakar",
            "Africa/Freetown",
            "Africa/Lome",
            "Africa/Monrovia",
            "Africa/Nouakchott",
            "Africa/Ouagadougou",
            "Africa/Sao_Tome",
            "Atlantic/Reykjavik",
            "Atlantic/St_Helena"
        ]
    },
    {
        value: "W. Europe Standard Time",
        abbr: "WEDT",
        offset: 2,
        isdst: true,
        text: "(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna",
        utc: [
            "Arctic/Longyearbyen",
            "Europe/Amsterdam",
            "Europe/Andorra",
            "Europe/Berlin",
            "Europe/Busingen",
            "Europe/Gibraltar",
            "Europe/Luxembourg",
            "Europe/Malta",
            "Europe/Monaco",
            "Europe/Oslo",
            "Europe/Rome",
            "Europe/San_Marino",
            "Europe/Stockholm",
            "Europe/Vaduz",
            "Europe/Vatican",
            "Europe/Vienna",
            "Europe/Zurich"
        ]
    },
    {
        value: "Central Europe Standard Time",
        abbr: "CEDT",
        offset: 2,
        isdst: true,
        text: "(UTC+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague",
        utc: [
            "Europe/Belgrade",
            "Europe/Bratislava",
            "Europe/Budapest",
            "Europe/Ljubljana",
            "Europe/Podgorica",
            "Europe/Prague",
            "Europe/Tirane"
        ]
    },
    {
        value: "Romance Standard Time",
        abbr: "RDT",
        offset: 2,
        isdst: true,
        text: "(UTC+01:00) Brussels, Copenhagen, Madrid, Paris",
        utc: [
            "Africa/Ceuta",
            "Europe/Brussels",
            "Europe/Copenhagen",
            "Europe/Madrid",
            "Europe/Paris"
        ]
    },
    {
        value: "Central European Standard Time",
        abbr: "CEDT",
        offset: 2,
        isdst: true,
        text: "(UTC+01:00) Sarajevo, Skopje, Warsaw, Zagreb",
        utc: [
            "Europe/Sarajevo",
            "Europe/Skopje",
            "Europe/Warsaw",
            "Europe/Zagreb"
        ]
    },
    {
        value: "W. Central Africa Standard Time",
        abbr: "WCAST",
        offset: 1,
        isdst: false,
        text: "(UTC+01:00) West Central Africa",
        utc: [
            "Africa/Algiers",
            "Africa/Bangui",
            "Africa/Brazzaville",
            "Africa/Douala",
            "Africa/Kinshasa",
            "Africa/Lagos",
            "Africa/Libreville",
            "Africa/Luanda",
            "Africa/Malabo",
            "Africa/Ndjamena",
            "Africa/Niamey",
            "Africa/Porto-Novo",
            "Africa/Tunis",
            "Etc/GMT-1"
        ]
    },
    {
        value: "Namibia Standard Time",
        abbr: "NST",
        offset: 1,
        isdst: false,
        text: "(UTC+01:00) Windhoek",
        utc: [
            "Africa/Windhoek"
        ]
    },
    {
        value: "GTB Standard Time",
        abbr: "GDT",
        offset: 3,
        isdst: true,
        text: "(UTC+02:00) Athens, Bucharest",
        utc: [
            "Asia/Nicosia",
            "Europe/Athens",
            "Europe/Bucharest",
            "Europe/Chisinau"
        ]
    },
    {
        value: "Middle East Standard Time",
        abbr: "MEDT",
        offset: 3,
        isdst: true,
        text: "(UTC+02:00) Beirut",
        utc: [
            "Asia/Beirut"
        ]
    },
    {
        value: "Egypt Standard Time",
        abbr: "EST",
        offset: 2,
        isdst: false,
        text: "(UTC+02:00) Cairo",
        utc: [
            "Africa/Cairo"
        ]
    },
    {
        value: "Syria Standard Time",
        abbr: "SDT",
        offset: 3,
        isdst: true,
        text: "(UTC+02:00) Damascus",
        utc: [
            "Asia/Damascus"
        ]
    },
    {
        value: "E. Europe Standard Time",
        abbr: "EEDT",
        offset: 3,
        isdst: true,
        text: "(UTC+02:00) E. Europe",
        utc: [
            "Asia/Nicosia",
            "Europe/Athens",
            "Europe/Bucharest",
            "Europe/Chisinau",
            "Europe/Helsinki",
            "Europe/Kyiv",
            "Europe/Mariehamn",
            "Europe/Nicosia",
            "Europe/Riga",
            "Europe/Sofia",
            "Europe/Tallinn",
            "Europe/Uzhhorod",
            "Europe/Vilnius",
            "Europe/Zaporizhzhia"
        ]
    },
    {
        value: "South Africa Standard Time",
        abbr: "SAST",
        offset: 2,
        isdst: false,
        text: "(UTC+02:00) Harare, Pretoria",
        utc: [
            "Africa/Blantyre",
            "Africa/Bujumbura",
            "Africa/Gaborone",
            "Africa/Harare",
            "Africa/Johannesburg",
            "Africa/Kigali",
            "Africa/Lubumbashi",
            "Africa/Lusaka",
            "Africa/Maputo",
            "Africa/Maseru",
            "Africa/Mbabane",
            "Etc/GMT-2"
        ]
    },
    {
        value: "FLE Standard Time",
        abbr: "FDT",
        offset: 3,
        isdst: true,
        text: "(UTC+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius",
        utc: [
            "Europe/Helsinki",
            "Europe/Kyiv",
            "Europe/Mariehamn",
            "Europe/Riga",
            "Europe/Sofia",
            "Europe/Tallinn",
            "Europe/Uzhhorod",
            "Europe/Vilnius",
            "Europe/Zaporizhzhia"
        ]
    },
    {
        value: "Turkey Standard Time",
        abbr: "TDT",
        offset: 3,
        isdst: false,
        text: "(UTC+03:00) Istanbul",
        utc: [
            "Europe/Istanbul"
        ]
    },
    {
        value: "Israel Standard Time",
        abbr: "JDT",
        offset: 3,
        isdst: true,
        text: "(UTC+02:00) Jerusalem",
        utc: [
            "Asia/Jerusalem"
        ]
    },
    {
        value: "Libya Standard Time",
        abbr: "LST",
        offset: 2,
        isdst: false,
        text: "(UTC+02:00) Tripoli",
        utc: [
            "Africa/Tripoli"
        ]
    },
    {
        value: "Jordan Standard Time",
        abbr: "JST",
        offset: 3,
        isdst: false,
        text: "(UTC+03:00) Amman",
        utc: [
            "Asia/Amman"
        ]
    },
    {
        value: "Arabic Standard Time",
        abbr: "AST",
        offset: 3,
        isdst: false,
        text: "(UTC+03:00) Baghdad",
        utc: [
            "Asia/Baghdad"
        ]
    },
    {
        value: "Kaliningrad Standard Time",
        abbr: "KST",
        offset: 3,
        isdst: false,
        text: "(UTC+02:00) Kaliningrad",
        utc: [
            "Europe/Kaliningrad"
        ]
    },
    {
        value: "Arab Standard Time",
        abbr: "AST",
        offset: 3,
        isdst: false,
        text: "(UTC+03:00) Kuwait, Riyadh",
        utc: [
            "Asia/Aden",
            "Asia/Bahrain",
            "Asia/Kuwait",
            "Asia/Qatar",
            "Asia/Riyadh"
        ]
    },
    {
        value: "E. Africa Standard Time",
        abbr: "EAST",
        offset: 3,
        isdst: false,
        text: "(UTC+03:00) Nairobi",
        utc: [
            "Africa/Addis_Ababa",
            "Africa/Asmera",
            "Africa/Dar_es_Salaam",
            "Africa/Djibouti",
            "Africa/Juba",
            "Africa/Kampala",
            "Africa/Khartoum",
            "Africa/Mogadishu",
            "Africa/Nairobi",
            "Antarctica/Syowa",
            "Etc/GMT-3",
            "Indian/Antananarivo",
            "Indian/Comoro",
            "Indian/Mayotte"
        ]
    },
    {
        value: "Moscow Standard Time",
        abbr: "MSK",
        offset: 3,
        isdst: false,
        text: "(UTC+03:00) Moscow, St. Petersburg, Volgograd, Minsk",
        utc: [
            "Europe/Kirov",
            "Europe/Moscow",
            "Europe/Simferopol",
            "Europe/Volgograd",
            "Europe/Minsk"
        ]
    },
    {
        value: "Samara Time",
        abbr: "SAMT",
        offset: 4,
        isdst: false,
        text: "(UTC+04:00) Samara, Ulyanovsk, Saratov",
        utc: [
            "Europe/Astrakhan",
            "Europe/Samara",
            "Europe/Ulyanovsk"
        ]
    },
    {
        value: "Iran Standard Time",
        abbr: "IDT",
        offset: 4.5,
        isdst: true,
        text: "(UTC+03:30) Tehran",
        utc: [
            "Asia/Tehran"
        ]
    },
    {
        value: "Arabian Standard Time",
        abbr: "AST",
        offset: 4,
        isdst: false,
        text: "(UTC+04:00) Abu Dhabi, Muscat",
        utc: [
            "Asia/Dubai",
            "Asia/Muscat",
            "Etc/GMT-4"
        ]
    },
    {
        value: "Azerbaijan Standard Time",
        abbr: "ADT",
        offset: 5,
        isdst: true,
        text: "(UTC+04:00) Baku",
        utc: [
            "Asia/Baku"
        ]
    },
    {
        value: "Mauritius Standard Time",
        abbr: "MST",
        offset: 4,
        isdst: false,
        text: "(UTC+04:00) Port Louis",
        utc: [
            "Indian/Mahe",
            "Indian/Mauritius",
            "Indian/Reunion"
        ]
    },
    {
        value: "Georgian Standard Time",
        abbr: "GET",
        offset: 4,
        isdst: false,
        text: "(UTC+04:00) Tbilisi",
        utc: [
            "Asia/Tbilisi"
        ]
    },
    {
        value: "Caucasus Standard Time",
        abbr: "CST",
        offset: 4,
        isdst: false,
        text: "(UTC+04:00) Yerevan",
        utc: [
            "Asia/Yerevan"
        ]
    },
    {
        value: "Afghanistan Standard Time",
        abbr: "AST",
        offset: 4.5,
        isdst: false,
        text: "(UTC+04:30) Kabul",
        utc: [
            "Asia/Kabul"
        ]
    },
    {
        value: "West Asia Standard Time",
        abbr: "WAST",
        offset: 5,
        isdst: false,
        text: "(UTC+05:00) Ashgabat, Tashkent",
        utc: [
            "Antarctica/Mawson",
            "Asia/Aqtau",
            "Asia/Aqtobe",
            "Asia/Ashgabat",
            "Asia/Dushanbe",
            "Asia/Oral",
            "Asia/Samarkand",
            "Asia/Tashkent",
            "Etc/GMT-5",
            "Indian/Kerguelen",
            "Indian/Maldives"
        ]
    },
    {
        value: "Yekaterinburg Time",
        abbr: "YEKT",
        offset: 5,
        isdst: false,
        text: "(UTC+05:00) Yekaterinburg",
        utc: [
            "Asia/Yekaterinburg"
        ]
    },
    {
        value: "Pakistan Standard Time",
        abbr: "PKT",
        offset: 5,
        isdst: false,
        text: "(UTC+05:00) Islamabad, Karachi",
        utc: [
            "Asia/Karachi"
        ]
    },
    {
        value: "India Standard Time",
        abbr: "IST",
        offset: 5.5,
        isdst: false,
        text: "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi",
        utc: [
            "Asia/Kolkata",
            "Asia/Calcutta"
        ]
    },
    {
        value: "Sri Lanka Standard Time",
        abbr: "SLST",
        offset: 5.5,
        isdst: false,
        text: "(UTC+05:30) Sri Jayawardenepura",
        utc: [
            "Asia/Colombo"
        ]
    },
    {
        value: "Nepal Standard Time",
        abbr: "NST",
        offset: 5.75,
        isdst: false,
        text: "(UTC+05:45) Kathmandu",
        utc: [
            "Asia/Kathmandu"
        ]
    },
    {
        value: "Central Asia Standard Time",
        abbr: "CAST",
        offset: 6,
        isdst: false,
        text: "(UTC+06:00) Nur-Sultan (Astana)",
        utc: [
            "Antarctica/Vostok",
            "Asia/Almaty",
            "Asia/Bishkek",
            "Asia/Qyzylorda",
            "Asia/Urumqi",
            "Etc/GMT-6",
            "Indian/Chagos"
        ]
    },
    {
        value: "Bangladesh Standard Time",
        abbr: "BST",
        offset: 6,
        isdst: false,
        text: "(UTC+06:00) Dhaka",
        utc: [
            "Asia/Dhaka",
            "Asia/Thimphu"
        ]
    },
    {
        value: "Myanmar Standard Time",
        abbr: "MST",
        offset: 6.5,
        isdst: false,
        text: "(UTC+06:30) Yangon (Rangoon)",
        utc: [
            "Asia/Rangoon",
            "Indian/Cocos"
        ]
    },
    {
        value: "SE Asia Standard Time",
        abbr: "SAST",
        offset: 7,
        isdst: false,
        text: "(UTC+07:00) Bangkok, Hanoi, Jakarta",
        utc: [
            "Antarctica/Davis",
            "Asia/Bangkok",
            "Asia/Hovd",
            "Asia/Jakarta",
            "Asia/Phnom_Penh",
            "Asia/Pontianak",
            "Asia/Saigon",
            "Asia/Vientiane",
            "Etc/GMT-7",
            "Indian/Christmas"
        ]
    },
    {
        value: "N. Central Asia Standard Time",
        abbr: "NCAST",
        offset: 7,
        isdst: false,
        text: "(UTC+07:00) Novosibirsk",
        utc: [
            "Asia/Novokuznetsk",
            "Asia/Novosibirsk",
            "Asia/Omsk"
        ]
    },
    {
        value: "China Standard Time",
        abbr: "CST",
        offset: 8,
        isdst: false,
        text: "(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi",
        utc: [
            "Asia/Hong_Kong",
            "Asia/Macau",
            "Asia/Shanghai"
        ]
    },
    {
        value: "North Asia Standard Time",
        abbr: "NAST",
        offset: 8,
        isdst: false,
        text: "(UTC+08:00) Krasnoyarsk",
        utc: [
            "Asia/Krasnoyarsk"
        ]
    },
    {
        value: "Singapore Standard Time",
        abbr: "MPST",
        offset: 8,
        isdst: false,
        text: "(UTC+08:00) Kuala Lumpur, Singapore",
        utc: [
            "Asia/Brunei",
            "Asia/Kuala_Lumpur",
            "Asia/Kuching",
            "Asia/Makassar",
            "Asia/Manila",
            "Asia/Singapore",
            "Etc/GMT-8"
        ]
    },
    {
        value: "W. Australia Standard Time",
        abbr: "WAST",
        offset: 8,
        isdst: false,
        text: "(UTC+08:00) Perth",
        utc: [
            "Antarctica/Casey",
            "Australia/Perth"
        ]
    },
    {
        value: "Taipei Standard Time",
        abbr: "TST",
        offset: 8,
        isdst: false,
        text: "(UTC+08:00) Taipei",
        utc: [
            "Asia/Taipei"
        ]
    },
    {
        value: "Ulaanbaatar Standard Time",
        abbr: "UST",
        offset: 8,
        isdst: false,
        text: "(UTC+08:00) Ulaanbaatar",
        utc: [
            "Asia/Choibalsan",
            "Asia/Ulaanbaatar"
        ]
    },
    {
        value: "North Asia East Standard Time",
        abbr: "NAEST",
        offset: 8,
        isdst: false,
        text: "(UTC+08:00) Irkutsk",
        utc: [
            "Asia/Irkutsk"
        ]
    },
    {
        value: "Japan Standard Time",
        abbr: "JST",
        offset: 9,
        isdst: false,
        text: "(UTC+09:00) Osaka, Sapporo, Tokyo",
        utc: [
            "Asia/Dili",
            "Asia/Jayapura",
            "Asia/Tokyo",
            "Etc/GMT-9",
            "Pacific/Palau"
        ]
    },
    {
        value: "Korea Standard Time",
        abbr: "KST",
        offset: 9,
        isdst: false,
        text: "(UTC+09:00) Seoul",
        utc: [
            "Asia/Pyongyang",
            "Asia/Seoul"
        ]
    },
    {
        value: "Cen. Australia Standard Time",
        abbr: "CAST",
        offset: 9.5,
        isdst: false,
        text: "(UTC+09:30) Adelaide",
        utc: [
            "Australia/Adelaide",
            "Australia/Broken_Hill"
        ]
    },
    {
        value: "AUS Central Standard Time",
        abbr: "ACST",
        offset: 9.5,
        isdst: false,
        text: "(UTC+09:30) Darwin",
        utc: [
            "Australia/Darwin"
        ]
    },
    {
        value: "E. Australia Standard Time",
        abbr: "EAST",
        offset: 10,
        isdst: false,
        text: "(UTC+10:00) Brisbane",
        utc: [
            "Australia/Brisbane",
            "Australia/Lindeman"
        ]
    },
    {
        value: "AUS Eastern Standard Time",
        abbr: "AEST",
        offset: 10,
        isdst: false,
        text: "(UTC+10:00) Canberra, Melbourne, Sydney",
        utc: [
            "Australia/Melbourne",
            "Australia/Sydney"
        ]
    },
    {
        value: "West Pacific Standard Time",
        abbr: "WPST",
        offset: 10,
        isdst: false,
        text: "(UTC+10:00) Guam, Port Moresby",
        utc: [
            "Antarctica/DumontDUrville",
            "Etc/GMT-10",
            "Pacific/Guam",
            "Pacific/Port_Moresby",
            "Pacific/Saipan",
            "Pacific/Truk"
        ]
    },
    {
        value: "Tasmania Standard Time",
        abbr: "TST",
        offset: 10,
        isdst: false,
        text: "(UTC+10:00) Hobart",
        utc: [
            "Australia/Currie",
            "Australia/Hobart"
        ]
    },
    {
        value: "Yakutsk Standard Time",
        abbr: "YST",
        offset: 9,
        isdst: false,
        text: "(UTC+09:00) Yakutsk",
        utc: [
            "Asia/Chita",
            "Asia/Khandyga",
            "Asia/Yakutsk"
        ]
    },
    {
        value: "Central Pacific Standard Time",
        abbr: "CPST",
        offset: 11,
        isdst: false,
        text: "(UTC+11:00) Solomon Is., New Caledonia",
        utc: [
            "Antarctica/Macquarie",
            "Etc/GMT-11",
            "Pacific/Efate",
            "Pacific/Guadalcanal",
            "Pacific/Kosrae",
            "Pacific/Noumea",
            "Pacific/Ponape"
        ]
    },
    {
        value: "Vladivostok Standard Time",
        abbr: "VST",
        offset: 11,
        isdst: false,
        text: "(UTC+11:00) Vladivostok",
        utc: [
            "Asia/Sakhalin",
            "Asia/Ust-Nera",
            "Asia/Vladivostok"
        ]
    },
    {
        value: "New Zealand Standard Time",
        abbr: "NZST",
        offset: 12,
        isdst: false,
        text: "(UTC+12:00) Auckland, Wellington",
        utc: [
            "Antarctica/McMurdo",
            "Pacific/Auckland"
        ]
    },
    {
        value: "UTC+12",
        abbr: "U",
        offset: 12,
        isdst: false,
        text: "(UTC+12:00) Coordinated Universal Time+12",
        utc: [
            "Etc/GMT-12",
            "Pacific/Funafuti",
            "Pacific/Kwajalein",
            "Pacific/Majuro",
            "Pacific/Nauru",
            "Pacific/Tarawa",
            "Pacific/Wake",
            "Pacific/Wallis"
        ]
    },
    {
        value: "Fiji Standard Time",
        abbr: "FST",
        offset: 12,
        isdst: false,
        text: "(UTC+12:00) Fiji",
        utc: [
            "Pacific/Fiji"
        ]
    },
    {
        value: "Magadan Standard Time",
        abbr: "MST",
        offset: 12,
        isdst: false,
        text: "(UTC+12:00) Magadan",
        utc: [
            "Asia/Anadyr",
            "Asia/Kamchatka",
            "Asia/Magadan",
            "Asia/Srednekolymsk"
        ]
    },
    {
        value: "Kamchatka Standard Time",
        abbr: "KDT",
        offset: 13,
        isdst: true,
        text: "(UTC+12:00) Petropavlovsk-Kamchatsky - Old",
        utc: [
            "Asia/Kamchatka"
        ]
    },
    {
        value: "Tonga Standard Time",
        abbr: "TST",
        offset: 13,
        isdst: false,
        text: "(UTC+13:00) Nuku'alofa",
        utc: [
            "Etc/GMT-13",
            "Pacific/Enderbury",
            "Pacific/Fakaofo",
            "Pacific/Tongatapu"
        ]
    },
    {
        value: "Samoa Standard Time",
        abbr: "SST",
        offset: 13,
        isdst: false,
        text: "(UTC+13:00) Samoa",
        utc: [
            "Pacific/Apia"
        ]
    }
]