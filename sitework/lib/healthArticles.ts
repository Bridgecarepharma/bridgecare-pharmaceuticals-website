export type HealthArticle = {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  publishedAt: string;
  updatedAt: string;
  sections: Array<{ heading: string; paragraphs: string[] }>;
};

export const healthArticles: HealthArticle[] = [
  {
    slug: "balanced-nutrition-everyday-wellness",
    title: "Balanced Nutrition for Everyday Wellness",
    description: "A practical guide to building varied meals and sustainable nutrition habits.",
    category: "Nutrition",
    readTime: "5 min read",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    sections: [
      { heading: "Build meals around variety", paragraphs: ["A balanced eating pattern usually includes vegetables and fruits, protein foods, whole grains or other fibre-rich staples, and suitable sources of healthy fats.", "No single food supplies every nutrient. Variety across meals and across the week is more useful than aiming for perfection at every sitting."] },
      { heading: "Keep portions practical", paragraphs: ["Energy needs differ by age, activity level and health status. Eating slowly and paying attention to fullness can help people choose portions that suit them."] },
      { heading: "Make habits sustainable", paragraphs: ["Simple routines—planning meals, drinking water regularly and limiting highly processed foods—are often easier to maintain than restrictive diets."] },
    ],
  },
  {
    slug: "understanding-peripheral-nerve-wellness",
    title: "Understanding Peripheral Nerve Wellness",
    description: "General information about nerve health, common sensations and when to seek medical care.",
    category: "Nerve Health",
    readTime: "6 min read",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    sections: [
      { heading: "What peripheral nerves do", paragraphs: ["Peripheral nerves carry messages between the brain and spinal cord and the rest of the body. They help support sensation, movement and automatic body functions."] },
      { heading: "Do not ignore persistent symptoms", paragraphs: ["Persistent tingling, numbness, burning discomfort or weakness deserves assessment by a qualified healthcare professional. Sudden weakness, loss of coordination or other severe symptoms may require urgent care."] },
      { heading: "Support overall wellness", paragraphs: ["Regular physical activity as medically appropriate, balanced nutrition, good sleep and management of underlying conditions can support overall wellbeing."] },
    ],
  },
  {
    slug: "womens-nutrition-through-life-stages",
    title: "Women’s Nutrition Through Different Life Stages",
    description: "An overview of changing nutrition priorities from adulthood through later life.",
    category: "Women’s Health",
    readTime: "5 min read",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    sections: [
      { heading: "Needs change over time", paragraphs: ["Nutrition priorities can change with menstruation, pregnancy planning, pregnancy, breastfeeding, menopause and ageing. Individual needs should be discussed with a qualified professional."] },
      { heading: "Focus on food first", paragraphs: ["A varied diet can provide protein, fibre, vitamins and minerals. Supplements should complement—not replace—a healthy eating pattern when they are appropriate."] },
      { heading: "Seek personalised guidance", paragraphs: ["People with health conditions, those who are pregnant or breastfeeding, and anyone taking medicines should obtain professional advice before starting a supplement."] },
    ],
  },
  {
    slug: "responsible-use-of-herbal-products",
    title: "Responsible Use of Herbal Wellness Products",
    description: "Important questions to ask before adding herbal products to a wellness routine.",
    category: "Herbal Wellness",
    readTime: "5 min read",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    sections: [
      { heading: "Natural does not always mean risk-free", paragraphs: ["Herbal ingredients can have biological effects and may interact with medicines or existing health conditions."] },
      { heading: "Check the label", paragraphs: ["Review the ingredients, directions, warnings, manufacturer details and applicable regulatory information. Avoid products with unclear composition or exaggerated claims."] },
      { heading: "Ask before combining products", paragraphs: ["Consult a pharmacist or doctor before using herbal products alongside prescription medicines, during pregnancy or breastfeeding, before surgery, or for children."] },
    ],
  },
  {
    slug: "healthy-habits-for-blood-sugar-wellness",
    title: "Healthy Habits for Blood Sugar Wellness",
    description: "General lifestyle practices that support metabolic health alongside professional care.",
    category: "Metabolic Wellness",
    readTime: "6 min read",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    sections: [
      { heading: "Choose consistent routines", paragraphs: ["Regular meals, balanced portions and physical activity suited to a person’s medical condition can support metabolic wellbeing."] },
      { heading: "Monitor as advised", paragraphs: ["People diagnosed with diabetes or another blood-sugar disorder should follow their clinician’s monitoring and treatment plan. Supplements should never replace prescribed treatment."] },
      { heading: "Know when to seek help", paragraphs: ["Symptoms such as confusion, fainting, severe weakness or breathing difficulty require urgent medical attention."] },
    ],
  },
];

export function getHealthArticle(slug: string) {
  return healthArticles.find((article) => article.slug === slug);
}
