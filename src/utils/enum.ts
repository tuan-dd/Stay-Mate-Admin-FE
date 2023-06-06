export enum EPricePackage {
  FREE = 0,
  WEEK = 7,
  MONTH = 30,
  YEAR = 365,
}

export enum EPropertyType {
  HOTEL = 'hotel',
  HOLIDAY_PARKS = 'holiday_parks',
}

export enum EStatusIBooking {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  STAY = 'STAY',
  DECLINE = 'DECLINE',
  CANCEL = 'CANCEL',
}
export enum EStatusRedux {
  idle = 'idle',
  pending = 'pending',
  succeeded = 'succeeded',
  error = 'error',
}

export enum EPackage {
  FREE = 'FREE',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
}

export enum ERole {
  HOTELIER = 'HOTELIER',
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export const roomAmenities = [
  'Additional bathroom',
  'Additional toilet',
  'Air conditioning',
  'Air purifier',
  'Alarm clock',
  'Bathrobes',
  'Bathroom phone',
  'Blackout curtains',
  'Carbon monoxide detector',
  'Carpeting',
  'Cleaning products',
  'Closet',
  'Clothes dryer',
  'Clothes rack',
  'Coffee/tea maker',
  'Complimentary tea',
  'DVD/CD player',
  'Daily housekeeping',
  'Daily newspaper',
  'Dart board',
  'Desk',
  'Dishwasher',
  'Dressing room',
  'Electric blanket',
  'Extra long bed',
  'Fan',
  'Fire extinguisher',
  'Fireplace',
  'First aid kit',
  'Free Wi-Fi in all rooms!',
  'Free bottled water',
  'Free instant coffee',
  'Free welcome drink',
  'Full kitchen',
  'Hair dryer',
  'Heating',
  'High chair',
  'High floor',
  'Hot tub',
  'Humidifier',
  'In-room safe box',
  'In-room tablet',
  'Interconnecting room(s) available',
  'Internet access – wireless',
  'Ironing facilities',
  'Kitchen',
  'Kitchenware',
  'Laptop safe box',
  'Laptop workspace',
  'Linens',
  'Locker',
  'Microwave',
  'Mini bar',
  'Mirror',
  'Mosquito net',
  'On-demand movies',
  'Pets allowed in room',
  'Private entrance',
  'Refrigerator',
  'Satellite/cable channels',
  'Scale',
  'Seating area',
  'Separate dining area',
  'Separate living room',
  'Sewing kit',
  'Shoeshine kit',
  'Shower',
  'Slippers',
  'Smoke detector',
  'Sofa',
  'Soundproofing',
  'TV',
  'TV [flat screen]',
  'TV [in bathroom]',
  'Telephone',
  'Toiletries',
  'Towels',
  'Trouser press',
  'Umbrella',
  'Vending machine',
  'Video game console',
  'Wake-up service',
  'Washing machine',
  'Whirlpool bathtub',
  'Wi-Fi [charges apply]',
  'Wi-Fi [free]',
  'Wi-Fi in public areas',
  'Wooden/parqueted flooring',
  'iPod docking station',
] as const;

// export type TRoomAmenities = (typeof roomAmenities)[number];

export enum EKeyHeader {
  USER_ID = 'x-client-id',
  REFRESH_TOKEN = 'x-rtoken-id',
  ACCESS_TOKEN = 'x-atoken-id',
}

export const cites = [
  'Amsterdam',
  'Andorra',
  'Aranda De Duero',
  'Arisaig',
  'Athens',
  'Auxerre',
  'Aviemore',
  'Bad Schlema',
  'Bad Wilsnack',
  'Bagnes',
  'Balatonlelle',
  'Ballantrae',
  'Bansko',
  'Barcelona',
  'Berlin',
  'Bishop Auckland',
  'Bois-Colombes',
  'Boncelles',
  'Borough Green',
  'Bradford',
  'Braila',
  'Bratislava',
  'Brecon',
  'Bridgend',
  'Bridport',
  'Brive-la-Gaillarde',
  'Bronderslev',
  'Brussels',
  'Cadiz',
  'Campello sul Clitunno',
  'Campulung Moldovenesc',
  'Cangey',
  'Canterbury',
  'Cardiff',
  'Cardigan',
  'Carrickfergus',
  'Cesenatico',
  'Chester',
  'Ciudad Real',
  'Clowne',
  'Cologne',
  'Cornebarrieu',
  'Cornil',
  'Corund',
  'Crete Island',
  'Cromford',
  'Dodington',
  'Downpatrick',
  'Dunfermline',
  'Dungannon',
  'Elfvik',
  'Eptalofos',
  'Essomes Sur Marne',
  'Evian-les-Bains',
  'Fafe',
  'Ferrieres-les-Verreries (Languedoc-Roussillon)',
  'Florence',
  'Flysta',
  'Forfar',
  'Frankfurt am Main',
  'Giardini Naxos',
  'Girvan',
  'Glasgow',
  'Glossop',
  'Gloucester',
  'Gothenburg',
  'Grachen',
  'Granada',
  'Gravina in Puglia',
  'Great Yeldham',
  'Guidonia Montecelio',
  'Halifax',
  'Halkidona',
  'Harrogate',
  'Harwich',
  'Haverfordwest',
  'Herzlake',
  'Hildesheim',
  'Hitchin',
  'Ho Chi Minh City',
  'Horselberg-Hainich Ot Behringen',
  'Hradec Kralove',
  'Inverness',
  'Kaminia',
  'Kastoria',
  'Kedainiai',
  'Kendal',
  'Kilkis',
  'Kings Lynn',
  'Kirkby Lonsdale',
  'Kirkcudbright',
  'Kirkovo',
  'Kufstein',
  'La Seyne-sur-Mer',
  'Lancaster',
  'Layos',
  'Linkoping',
  'Linz',
  'London',
  'Lucenec',
  'Lugano',
  'Luxembourg',
  'Lynton',
  'Macon',
  'Madonna di Campiglio',
  'Mako',
  'Malaga',
  'Malham',
  'Mali Losinj',
  'Manchester',
  'Mansfield',
  'Marsala',
  'Menai Bridge',
  'Milan',
  'Milton Keynes',
  'Molinos De Duero',
  'Monte Da Torrinha',
  'Montpellier',
  'Morano Calabro',
  'Muhldorf am Inn',
  'Munich',
  'Mykonos',
  'Nantes',
  'Naousa Imathias',
  'Newcastle-upon-Tyne',
  'Nice',
  'Norderstedt',
  'Northallerton',
  'Northampton',
  'Nuremberg',
  'Obermaiselstein',
  'Orebro',
  'Ostrava',
  'Padstow',
  'Paphos',
  'Paris',
  'Pattensen',
  'Perpignan',
  'Pertuis',
  'Pescasseroli',
  'Pickering',
  'Pinneberg',
  'Plymouth',
  'Poissy',
  'Poitiers',
  'Pontypridd',
  'Poros',
  'Portoferraio',
  'Pozzuoli',
  'Prague',
  'Praia Da Rocha',
  'Presicce',
  'Primorsko',
  'Ramnicu Valcea',
  'Randers',
  'Razlog',
  'Rhodes',
  'Rhosneigr',
  'Riedenburg',
  'Rome',
  'Rosersberg',
  'Saint Clears',
  'San Mauro Di Saline',
  'Sanary-sur-Mer',
  'Santorini',
  'Schonberg (Holstein)',
  'Sedan',
  'Seefeld in Tirol',
  'Sefton',
  'Seville',
  'Shiplake',
  'Siddington',
  'Sinaia',
  'Sliema',
  'Soltau',
  'Sorrento',
  'South Milford',
  'Spindleruv Mlyn',
  'St Helens',
  "St. Julian's",
  'Stockholm',
  'Stokenham',
  'Stresa',
  'Stretton',
  'Sveti Filip i Jakov',
  'Tankersley',
  'Taunton',
  'Tenerife',
  'Tewkesbury',
  'Thame',
  'Thornhill (Stirling)',
  'Timisoara',
  'Toledo',
  'Torquay',
  'Toulouse',
  'Tours',
  'Trearddur',
  'Truro',
  'Turin',
  'Verdello',
  'Vichy',
  'Vidin',
  'Villapiana',
  'Viseu',
  'Vrsar',
  'Wadhurst',
  'Warsaw',
  'Welwyn Garden City',
  'Wetzlar',
  'Wimereux',
  'Windermere',
  'Wiveliscombe',
  'Wolverhampton',
  'Wrightington',
  'Zakynthos Island',
  'Zaragoza',
  'Zell Am See',
  'Zofingen',
  'ha noi',
];