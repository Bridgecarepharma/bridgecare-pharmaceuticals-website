export type ProductCategory = 'Daily wellness' | "Women's wellness" | 'Herbal wellness' | 'Specialised support';

export type BenefitIcon = 'heart' | 'brain' | 'shield' | 'zap' | 'leaf' | 'circle' | 'baby' | 'scale' | 'activity' | 'droplets' | 'sprout' | 'blood' | 'users';

export type Product = {
  slug: string;
  name: string;
  shortName: string;
  category: ProductCategory;
  categoryLabel: string;
  price: string;
  priceValue: number;
  image: string;
  accent: string;
  summary: string;
  overview: string;
  benefits: Array<{ icon: BenefitIcon; label: string }>;
  searchTerms: string[];
  directions: string;
  whoFor: string[];
  keyInformation: string[];
  faqs: Array<{ question: string; answer: string }>;
  paystack: string;
};

export const products: Product[] = [
  {
    slug: 'aspivit',
    name: 'Aspivit Tablet',
    shortName: 'Aspivit',
    category: 'Daily wellness',
    categoryLabel: 'Daily nutrition & wellness',
    price: '₦8,000',
    priceValue: 8000,
    image: '/images/aspivit.png',
    accent: '#e9a400',
    summary: 'Omega-3 fatty acids, vitamins and minerals formulated to support everyday nutritional wellness.',
    overview: 'Aspivit is a broad daily nutritional formulation developed to support cardiovascular wellness, neurological function, immunity, energy metabolism and antioxidant protection.',
    benefits: [
      { icon: 'heart', label: 'Heart Health' },
      { icon: 'brain', label: 'Brain Support' },
      { icon: 'shield', label: 'Immunity Support' },
      { icon: 'zap', label: 'Energy Metabolism' },
      { icon: 'leaf', label: 'Antioxidant Support' },
    ],
    searchTerms: ['heart', 'brain', 'immunity', 'energy', 'omega 3', 'vitamins', 'antioxidant'],
    directions: 'Use only as directed on the product pack or by a qualified healthcare professional.',
    whoFor: ['Adults seeking broad daily nutritional support', 'People looking to complement a balanced diet', 'Customers interested in heart, brain, immune and energy support'],
    keyInformation: ['Food supplement; not a substitute for a varied diet', 'Do not exceed the recommended intake', 'Keep out of reach of children', 'Seek professional advice during pregnancy, breastfeeding or when taking medication'],
    faqs: [
      { question: 'Can Aspivit replace a balanced diet?', answer: 'No. It is intended to complement, not replace, a varied and balanced diet and healthy lifestyle.' },
      { question: 'Can I take it with other supplements?', answer: 'Speak with a doctor or pharmacist before combining supplements, particularly where ingredients may overlap.' },
    ],
    paystack: 'https://paystack.shop/pay/obsk4o4n5y',
  },
  {
    slug: 'asfenositol',
    name: 'AsFenositol',
    shortName: 'AsFenositol',
    category: "Women's wellness",
    categoryLabel: "Women's wellness",
    price: '₦6,000',
    priceValue: 6000,
    image: '/images/asfenositol.png',
    accent: '#008e9b',
    summary: 'A carefully formulated combination of myo-inositol, methyl folate, vitamin D3 and active vitamin B6.',
    overview: 'AsFenositol is designed as nutritional support for women focused on hormonal wellness, ovarian function and fertility-related wellbeing, including women living with PCOS.',
    benefits: [
      { icon: 'circle', label: 'PCOS Support' },
      { icon: 'baby', label: 'Fertility Support' },
      { icon: 'scale', label: 'Hormonal Balance' },
      { icon: 'activity', label: 'Ovulation Support' },
    ],
    searchTerms: ['pcos', 'fertility', 'women', 'hormonal balance', 'ovulation', 'pregnancy', 'inositol'],
    directions: 'Use only according to the directions printed on the pack or the advice of a qualified healthcare professional.',
    whoFor: ['Women seeking nutritional support for hormonal wellness', 'Women living with PCOS who are under appropriate professional care', 'Women preparing for pregnancy and discussing supplements with their healthcare provider'],
    keyInformation: ['This product does not diagnose, prevent or treat infertility or PCOS', 'Consult a healthcare professional before use during pregnancy or breastfeeding', 'Do not exceed the recommended intake', 'Keep out of reach of children'],
    faqs: [
      { question: 'Is AsFenositol a treatment for PCOS?', answer: 'No. It is a nutritional wellness product and does not replace professional diagnosis or treatment.' },
      { question: 'Should I speak with my doctor before use?', answer: 'Yes, especially when trying to conceive, during pregnancy, breastfeeding or while using prescribed medication.' },
    ],
    paystack: 'https://paystack.shop/pay/qz4b43usk0',
  },
  {
    slug: 'herbal-tea',
    name: 'Bridgecare Herbal Bitter Tea',
    shortName: 'Herbal Bitter Tea',
    category: 'Herbal wellness',
    categoryLabel: 'Herbal wellness',
    price: '₦5,500',
    priceValue: 5500,
    image: '/images/herbal-tea.png',
    accent: '#17643a',
    summary: 'A 100% natural herbal tea traditionally used for medicinal and therapeutic purposes.',
    overview: 'Bridgecare Herbal Bitter Tea is a convenient traditional herbal preparation positioned to support blood sugar wellness, digestion, liver health and general metabolic wellbeing.',
    benefits: [
      { icon: 'droplets', label: 'Blood Sugar Support' },
      { icon: 'leaf', label: 'Digestive Health' },
      { icon: 'sprout', label: 'Liver Support' },
      { icon: 'heart', label: 'Natural Wellness' },
    ],
    searchTerms: ['blood sugar', 'diabetes', 'digestion', 'liver', 'herbal', 'metabolic'],
    directions: 'Prepare and use according to the directions printed on the product pack. Do not alter prescribed treatment without medical supervision.',
    whoFor: ['Adults interested in traditional herbal wellness', 'Customers seeking convenient tea-bag preparation', 'People discussing complementary wellness choices with a qualified professional'],
    keyInformation: ['Not a replacement for diabetes medication or medical monitoring', 'Check with a healthcare professional if you take blood-sugar-lowering medicine', 'Stop use and seek advice if an unwanted reaction occurs', 'Keep out of reach of children'],
    faqs: [
      { question: 'Can this tea replace diabetes medication?', answer: 'No. Never stop or change prescribed diabetes treatment without direct guidance from your healthcare professional.' },
      { question: 'Can I use it while taking other medicines?', answer: 'Ask your doctor or pharmacist first, because herbal preparations may interact with medicines.' },
    ],
    paystack: 'https://paystack.shop/pay/fvx50o-um4',
  },
  {
    slug: 'globivida',
    name: 'Globivida Capsules',
    shortName: 'Globivida',
    category: 'Specialised support',
    categoryLabel: 'Specialised nutritional support',
    price: '₦12,000',
    priceValue: 12000,
    image: '/images/globivida.png',
    accent: '#bd1d1d',
    summary: 'A specialised herbal and mineral formulation presented for sickle-cell wellness support.',
    overview: 'Globivida is a botanical and mineral nutritional formulation positioned as supportive wellness care for people living with sickle cell disease, alongside appropriate medical management.',
    benefits: [
      { icon: 'droplets', label: 'Sickle Cell Support' },
      { icon: 'blood', label: 'Red Blood Cell Health' },
      { icon: 'shield', label: 'Antioxidant Support' },
      { icon: 'users', label: 'Nutritional Support' },
    ],
    searchTerms: ['sickle cell', 'red blood cell', 'blood', 'antioxidant', 'nutrition'],
    directions: 'Use strictly according to the product-pack directions and the guidance of a qualified healthcare professional familiar with your care.',
    whoFor: ['People living with sickle cell disease under ongoing medical care', 'Families seeking additional nutritional support information', 'Customers who have discussed complementary products with their healthcare team'],
    keyInformation: ['Not a cure or replacement for prescribed sickle cell care', 'Continue routine clinic visits and prescribed treatment', 'Seek urgent medical care for a crisis or severe symptoms', 'Keep out of reach of children'],
    faqs: [
      { question: 'Does Globivida cure sickle cell disease?', answer: 'No. It is presented as nutritional support and does not cure sickle cell disease or replace medical treatment.' },
      { question: 'Can it be used during a sickle cell crisis?', answer: 'A crisis requires prompt professional medical care. Do not rely on a supplement for urgent symptoms.' },
    ],
    paystack: 'https://paystack.shop/pay/wz9fl6zdw3',
  },
];

export const getProductBySlug = (slug: string) => products.find((product) => product.slug === slug);
export const combinedCheckoutUrl = 'https://paystack.shop/pay/btzq7yqk7p';
