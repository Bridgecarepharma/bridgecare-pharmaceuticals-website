import type { Product } from './products';

export type HealthTopic = {
  id: string;
  label: string;
  shortLabel: string;
  icon: 'heart' | 'sparkles' | 'droplets' | 'stethoscope' | 'brain';
  title: string;
  description: string;
  tips: string[];
  productSlug?: Product['slug'];
  articleTitle: string;
};

export const healthTopics: HealthTopic[] = [
  {
    id: 'daily',
    label: 'Heart & Daily Wellness',
    shortLabel: 'Daily wellness',
    icon: 'heart',
    title: 'Build a stronger everyday wellness routine',
    description: 'Explore general nutrition, movement, rest and everyday wellness support for an active lifestyle.',
    tips: ['Eat a varied, balanced diet', 'Stay physically active as advised', 'Prioritise sleep and regular check-ups'],
    productSlug: 'aspivit',
    articleTitle: 'Everyday habits for heart and general wellness',
  },
  {
    id: 'women',
    label: "Women's Wellness",
    shortLabel: "Women's wellness",
    icon: 'sparkles',
    title: "Explore nutritional support for women’s wellness",
    description: 'Learn about healthy routines and nutritional support relevant to hormonal and reproductive wellbeing.',
    tips: ['Track changes and discuss concerns early', 'Choose balanced meals and regular activity', 'Seek professional guidance when trying to conceive'],
    productSlug: 'asfenositol',
    articleTitle: "Nutrition and lifestyle foundations for women’s wellness",
  },
  {
    id: 'sugar',
    label: 'Blood Sugar Support',
    shortLabel: 'Blood sugar',
    icon: 'droplets',
    title: 'Support responsible blood sugar wellness',
    description: 'Explore general lifestyle education for blood sugar wellness alongside proper monitoring and professional care.',
    tips: ['Continue prescribed treatment and monitoring', 'Choose balanced meals with appropriate portions', 'Discuss herbal products with your healthcare professional'],
    productSlug: 'herbal-tea',
    articleTitle: 'Everyday foundations for healthy blood sugar management',
  },
  {
    id: 'sickle',
    label: 'Nutritional Support for Sickle Cell',
    shortLabel: 'Sickle-cell wellness',
    icon: 'stethoscope',
    title: 'Explore supportive nutrition alongside continuity of care',
    description: 'Access general education on hydration, nutrition and maintaining regular medical care for people living with sickle cell disease.',
    tips: ['Maintain regular medical appointments', 'Follow your care plan and stay well hydrated', 'Seek urgent care for severe or unusual symptoms'],
    productSlug: 'globivida',
    articleTitle: 'Nutrition, hydration and continuity of care in sickle cell wellness',
  },
  {
    id: 'nerve',
    label: 'Brain & Nerve Health',
    shortLabel: 'Brain & nerve health',
    icon: 'brain',
    title: 'Learn about everyday brain and nerve wellness',
    description: 'Explore general education on nutrition, movement, rest and when to seek professional assessment for nerve-related symptoms.',
    tips: ['Do not ignore persistent numbness or weakness', 'Support health with balanced nutrition and movement', 'Speak with a clinician about recurring symptoms'],
    articleTitle: 'Everyday foundations for brain and nerve wellness',
  },
];
