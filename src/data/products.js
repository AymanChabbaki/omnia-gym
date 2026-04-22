export const CATEGORIES = [
  { 
    id: 'offers', 
    name: 'Special Offers', 
    nameAr: 'عروض', 
    nameFr: 'Offres Spéciales',
    icon: 'local_fire_department', 
    count: 2,
    accent: 'text-primary'
  },
  { 
    id: 'weight-gainers', 
    name: 'Mass Gainer', 
    nameAr: 'مكملات زيادة الوزن', 
    nameFr: 'Gainer de Masse',
    icon: 'fitness_center', 
    count: 3 
  },
  { 
    id: 'whey-protein', 
    name: 'Whey Protein', 
    nameAr: 'واي بروتين', 
    nameFr: 'Protéine Whey',
    icon: 'science', 
    count: 4 
  },
  { 
    id: 'creatine', 
    name: 'Creatine', 
    nameAr: 'الكرياتين', 
    nameFr: 'Créatine',
    icon: 'shutter_speed', 
    count: 3 
  },
  { 
    id: 'amino-acids', 
    name: 'Amino Acids', 
    nameAr: 'الأحماض الأمينية', 
    nameFr: 'Acides Aminés',
    icon: 'pill', 
    count: 2 
  },
  { 
    id: 'pre-workout', 
    name: 'Energy & Endurance', 
    nameAr: 'الطاقة و التحمل', 
    nameFr: 'Énergie & Endurance',
    icon: 'energy_savings_leaf', 
    count: 3 
  },
  { 
    id: 'vitamins', 
    name: 'Vitamins', 
    nameAr: 'الفيتامينات', 
    nameFr: 'Vitamines',
    icon: 'medical_services', 
    count: 2 
  },
  { 
    id: 'fat-burners', 
    name: 'Fat Burners', 
    nameAr: 'حوارق الدهون', 
    nameFr: 'Brûleurs de Graisse',
    icon: 'local_fire_department', 
    count: 2 
  },
  { 
    id: 'accessories', 
    name: 'Gym Accessories', 
    nameAr: 'لوازم رياضية', 
    nameFr: 'Loisirs & Accessoires',
    icon: 'sports_gymnastics', 
    count: 2 
  },
  { 
    id: 'creatine-offers', 
    name: 'Creatine Bundles', 
    nameAr: 'عروض الكرياتين', 
    nameFr: 'Packs Créatine',
    icon: 'inventory_2', 
    count: 1 
  }
];

export const PRODUCTS = [
  {
    id: 'gold-standard-whey',
    name: 'Gold Standard Whey',
    nameAr: 'قولد ستاندرد واي',
    nameFr: 'Gold Standard Whey',
    category: 'whey-protein',
    brand: 'Omnia Elite',
    price: 74.99,
    rating: 4.8,
    reviews: 2480,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6uCKv3Rtj5208GYsBiXqAxr_tRsXFmdNGaklztG_edgSE_rxERMEfgC4xckhg84Si-Nag_g-jLQFM-KKGWch8H5X5OgUQ7TCpk3mP4ebwQgeKxyg0N98pPjYUyy5NTCmidpoR5VhaeR9FMFQL_1_cEH0BUKlUdVuXv62wolRlOpi2TMK8ZCw6xCU_0bgKsEDIpLISTnzZri5iigpQatN2cI2I3gJvTpXZZqYNZYRnGMXyrEJ6IuRpUinGUP02fn3WmZ_rPbz4ccU',
    description: 'Pure isolate performance for accelerated muscle recovery and growth.',
    descriptionAr: 'أداء نقي لتعزيز تعافي العضلات ونموها بشكل أسرع.',
    descriptionFr: 'Performance pure d\'isolat pour une récupération musculaire accélérée.',
    longDescription: 'Engineered for ultimate recovery. 24g of pure whey protein isolates per serving to help build lean muscle mass.',
    tags: ['Top Rated', 'High Protein'],
    specs: [
      { label: 'Protein', labelAr: 'بروتين', labelFr: 'Protéine', value: '24g' },
      { label: 'Calories', labelAr: 'سعرات', labelFr: 'Calories', value: '120' }
    ],
    flavors: ['Chocolate', 'Vanilla', 'Strawberry'],
    sizes: ['2LB', '5LB']
  },
  {
    id: 'serious-mass',
    name: 'Serious Mass',
    nameAr: 'سيريوس ماس',
    nameFr: 'Serious Mass',
    category: 'weight-gainers',
    brand: 'Mass Series',
    price: 59.99,
    rating: 4.5,
    reviews: 128,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAngmC3nFHtWhEP_kFdbRWHzoGhW7OfT_t0XAF7yR4_GvrkkOrfSw1CLeuDXENEFiIoJ9OkL7SxyhWwv815zzbM2gaNCZoS3BBR05l20KaU9uqC8gU1AL7DgB48mEf2csZ_PAbu5HaboCyz07QL9D82yJ04KFIula2WvB6UPm4gRSTm_LvaT9tvXtYYIcYESpT36r85VsCr7Zvs3TOTv9kO34mZVMeY85SD5dypAPeVo945pPltenFAI_NRsSa2UeEHoo4AVUMIUh8',
    description: 'Hyper-caloric weight gainer designed for athletes who struggle to gain size.',
    descriptionAr: 'رابح وزن عالي السعرات مصمم للرياضيين الذين يجدون صعوبة في زيادة الوزن.',
    descriptionFr: 'Gainer de poids hyper-calorique conçu pour les athlètes.',
    tags: ['Best Value', 'Bulk'],
    specs: [
      { label: 'Calories', labelAr: 'سعرات', labelFr: 'Calories', value: '1250' },
      { label: 'Protein', labelAr: 'بروتين', labelFr: 'Protéine', value: '50g' }
    ]
  },
  {
    id: 'ignition-preworkout',
    name: 'Ignition Pre-Workout',
    nameAr: 'إقنيشن بري وورك آوت',
    nameFr: 'Ignition Pre-Workout',
    category: 'pre-workout',
    brand: 'Adrenaline',
    price: 44.99,
    rating: 4.9,
    reviews: 342,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCE_VnGvFN1lFZz_ZYc4cpVf3XzrkD8y72IwsQg8CQF79SDR1NrlurhjguTdhbC_lWm3Hs77G__njlLzOPwh0rCcvqFYbo2IPc2SlO74HbkJ76Umj0NJQ7cNTBbNvTbvTtD_d--TzGpkqaYDpzF6pTFaOcQVccOOSG4aD_fKW4Z1h1lrcwFjiLLo92S-NQ1_rYpRdM_3Ou4RuQXtN-HgyeABVzJLHSbTMyamBTRbj8pH3oHewm4bOciP032h5dRT4WbIjE3GAexmJM',
    description: 'Maximum pump and focus matrix to shatter your personal records.',
    descriptionAr: 'مصفوفة طاقة وتركيز قصوى لتحطيم أرقامك القياسية.',
    descriptionFr: 'Matrice d\'énergie et de concentration maximale.',
    tags: ['Intense', 'Sugar Free'],
    specs: [
      { label: 'Caffeine', labelAr: 'كافيين', labelFr: 'Caféine', value: '300mg' },
      { label: 'Beta-Alanine', labelAr: 'بيتا ألانين', labelFr: 'Bêta-Alanine', value: '3.2g' }
    ]
  },
  {
    id: 'micronized-creatine',
    name: 'Micronized Creatine',
    nameAr: 'ميكرونيزد كرياتين',
    nameFr: 'Micronized Creatine',
    category: 'creatine',
    brand: 'Performance',
    price: 29.99,
    rating: 4.7,
    reviews: 215,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbKQhCdGWM9YDaRXT1PSVy4k8Ahm5FO8970CgToWHJFsiaQJNrm5ZxIjrZMQY9PFzXesdWVm8i9ZBHg44nlaujUq2dySGqEO63LDhNKxsBXbunBPir0fG6WUD93lDKOwGk0EjNUKw6RqoapzA-R7Mp5yRCPcwsTvxvun68rGEeEWv6UP1w0DPi_JkpQkE3MMJlijo4nWLMTwE9rLePSTXbBUjtyoEcO6KlHhbKM5gHLr4iWEXrfG-4MQ4w9ZmnREUFKUGqg9YEu0A',
    description: 'Micronized creatine monohydrate for peak strength and power output.',
    descriptionAr: 'كرياتين مونوهيدرات ميكروني لقوة وأداء مثاليين.',
    descriptionFr: 'Créatine monohydrate micronisée pour une force maximale.',
    tags: ['Pure Potency', 'Lab Tested'],
    specs: [
      { label: 'Serving', labelAr: 'حصة', labelFr: 'Portion', value: '5g' }
    ]
  },
  {
    id: 'bcaa-matrix',
    name: 'BCAA Recovery Matrix',
    nameAr: 'بي سي ايه ايه ريكفري',
    nameFr: 'BCAA Récupération',
    category: 'amino-acids',
    brand: 'Performance',
    price: 34.99,
    rating: 4.6,
    reviews: 156,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9L_-8P-Qf8e7Uv9R_g-R0-x8k6Y1U9-X8k-G6U8k6Y1U9-X8k-G6U8k6Y1U9-X8k-G6U8k6Y1U9-X8k-G6U8k6Y1U9-X8k-G6U8k6Y1U9-X',
    description: 'Essential amino acids for accelerated muscle repair.',
    descriptionAr: 'الأحماض الأمينية الأساسية لإصلاح العضلات المتسارع.',
    descriptionFr: 'Acides aminés essentiels pour la réparation musculaire.',
    tags: ['Recovery', 'Vegan'],
    specs: [{ label: 'BCAA', value: '5g' }]
  },
  {
    id: 'multivitamin-elite',
    name: 'Multivitamin Elite',
    nameAr: 'ملتي فيتامين إيليت',
    nameFr: 'Multivitamines Élite',
    category: 'vitamins',
    brand: 'Performance',
    price: 19.99,
    rating: 4.9,
    reviews: 89,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2L_-8P-Qf8e7Uv9R_g-R0-x8k6Y1U9-X8k-G6U8k6Y1U9-X8k-G6U8k6Y1U9-X8k-G6U8k6Y1U9-X8k-G6U8k6Y1U9-X8k-G6U8k6Y1U9-X',
    description: 'Complete daily vitamin spectrum for active athletes.',
    descriptionAr: 'طيف كامل من الفيتامينات اليومية للرياضيين النشطين.',
    descriptionFr: 'Spectre complet de vitamines pour les athlètes actifs.',
    tags: ['Essential', 'Daily'],
    specs: [{ label: 'Vitamins', value: '24+' }]
  }
];
