export type Ingredient = { name: string; strength: string; summary: string; symbol: string };
export type ProductFaq = { question: string; answer: string };
export type ProductSpec = { label: string; value: string };
export type Product = {
  slug: string; name: string; category: string; summary: string; indication: string;
  image: string; detailImage?: string; priceKobo: number; packSize: string; theme: string;
  overview: string; description: string[]; specifications: ProductSpec[];
  reasons: { title: string; text: string; symbol: string }[];
  ingredients: Ingredient[]; benefits: { title: string; text: string; symbol: string }[];
  whoCanBenefit?: string[];
  directions: { label: string; value: string; text: string }[];
  storage: { title: string; text: string; symbol: string }[];
  highlights?: string[];
  warnings: string[]; faqs: ProductFaq[]; nafdac?: string;
};

export const PRODUCTS: Product[] = [
  {
    slug: "aspivit", name: "ASPIVIT TABLET", category: "Daily nutrition",
    summary: "A comprehensive nutritional supplement formulated with Omega-3 fatty acids, essential vitamins, and trace minerals to support overall health and wellbeing.",
    indication: "Comprehensive Omega-3, vitamin, and mineral support for overall health and wellbeing.",
    image: "/images/products/aspivit.jpg", detailImage: "/images/product-details/aspivit.jpg", priceKobo: 800000, packSize: "Bottle", theme: "gold",
    overview: "Aspivit Tablet is a comprehensive nutritional supplement formulated with Omega-3 fatty acids, essential vitamins, and trace minerals to support overall health and wellbeing.",
    description: [
      "Aspivit Tablet is an advanced daily multivitamin and Omega-3 supplement designed to provide essential nutrients required for optimal health. Each film-coated tablet combines EPA, DHA, vitamins, and essential minerals to help bridge nutritional gaps and promote overall wellness.",
      "Manufactured in India under stringent pharmaceutical quality standards, Aspivit Tablet delivers high-quality nutrients with excellent stability and bioavailability, making it suitable for daily nutritional supplementation."
    ],
    specifications: [
      {label:"Product Name", value:"Aspivit Tablet"},
      {label:"Dosage Form", value:"Film-Coated Tablet"},
      {label:"Packaging", value:"Bottle"},
      {label:"Shelf Life", value:"2 Years"},
      {label:"Country of Origin", value:"India"},
      {label:"Manufacturer", value:"Manufactured in India under GMP-certified pharmaceutical standards."}
    ],
    reasons: [],
    ingredients: [
      {symbol:"EPA", name:"EPA", strength:"90 mg", summary:""},
      {symbol:"DHA", name:"DHA", strength:"60 mg", summary:""},
      {symbol:"A", name:"Vitamin A", strength:"900 mcg", summary:""},
      {symbol:"B6", name:"Vitamin B6", strength:"1 mg", summary:""},
      {symbol:"C", name:"Vitamin C", strength:"40 mg", summary:""},
      {symbol:"D3", name:"Vitamin D3", strength:"400 IU", summary:""},
      {symbol:"E", name:"Vitamin E", strength:"15 mg", summary:""},
      {symbol:"F", name:"Folic Acid", strength:"400 mcg", summary:""},
      {symbol:"Se", name:"Selenium", strength:"40 mcg", summary:""},
      {symbol:"Mg", name:"Magnesium", strength:"2 mg", summary:""},
      {symbol:"Cr", name:"Chromium", strength:"35 mcg", summary:""},
      {symbol:"Cu", name:"Copper", strength:"1 mg", summary:""},
      {symbol:"Zn", name:"Zinc Sulphate", strength:"7.5 mg", summary:""}
    ],
    benefits: [
      {symbol:"🧠", title:"Healthy brain function", text:"Supports healthy brain function and cognitive performance."},
      {symbol:"👁", title:"Vision and eye health", text:"Promotes normal vision and helps maintain eye health."},
      {symbol:"🛡", title:"Immune system", text:"Strengthens the immune system."},
      {symbol:"AO", title:"Antioxidant protection", text:"Provides antioxidant protection against free radical damage."},
      {symbol:"♥", title:"Cardiovascular health", text:"Supports cardiovascular health."},
      {symbol:"SK", title:"Skin and hair", text:"Helps maintain healthy skin and hair."},
      {symbol:"BM", title:"Bones and muscles", text:"Promotes healthy bones and muscles."},
      {symbol:"⚡", title:"Energy metabolism", text:"Supports normal energy metabolism and reduces nutritional deficiencies."},
      {symbol:"N", title:"Nerve function", text:"Helps maintain healthy nerve function."},
      {symbol:"RBC", title:"Red blood cell formation", text:"Supports red blood cell formation and overall vitality."}
    ],
    directions: [
      {label:"Adults", value:"One (1) tablet daily after meals", text:"Take one (1) tablet daily after meals, or as directed by your healthcare professional."}
    ],
    storage: [
      {symbol:"30°", title:"Cool, dry place", text:"Store in a cool, dry place below 30°C."},
      {symbol:"☀", title:"Protect from sunlight and moisture", text:"Protect from direct sunlight and moisture."},
      {symbol:"🔒", title:"Keep tightly closed", text:"Keep the bottle tightly closed after use."}
    ],
    highlights: [
      "Premium Omega-3 (EPA & DHA) formulation.",
      "Comprehensive multivitamin and multimineral supplement.",
      "Manufactured in India under GMP-certified facilities.",
      "Film-coated tablet for easy swallowing.",
      "High-quality ingredients for maximum nutritional support.",
      "Suitable for everyday wellness and nutritional maintenance."
    ],
    warnings: [
      "Do not exceed the recommended daily dose.",
      "Food supplements should not be used as a substitute for a varied and balanced diet.",
      "Keep out of reach of children.",
      "Consult your physician before use if you are pregnant, nursing, taking medication, or have any medical condition.",
      "Do not use if the seal is broken or missing."
    ],
    faqs: []
  },
  {
    slug: "asfenositol", name: "AsFenositol Tablet", category: "Fertility and women’s reproductive wellness",
    summary: "A premium fertility-support formulation with Myo-Inositol, active folate, active Vitamin B6 and Vitamin D3.",
    indication: "Scientifically formulated nutritional support for female reproductive wellness.",
    image: "/images/products/asfenositol.png", priceKobo: 600000, packSize: "1 × 10 tablets", theme: "teal",
    overview: "AsFenositol Tablet is a scientifically formulated fertility support supplement containing Myo-Inositol, L-Methylfolate, Pyridoxal-5-Phosphate and Vitamin D3 to support female reproductive health and ovulatory function.",
    description: [
      "AsFenositol Tablet is a premium fertility-support formulation developed to provide essential reproductive nutrients for women trying to conceive. The combination of Myo-Inositol, L-Methylfolate, Pyridoxal-5-Phosphate and Vitamin D3 works together to support ovarian function, menstrual regularity, hormonal balance and overall reproductive wellness.",
      "The active folate helps provide bioavailable folate without requiring metabolic conversion, while Myo-Inositol supports insulin sensitivity and ovarian health. Vitamin D3 and active Vitamin B6 further contribute to reproductive nutritional support.",
      "Manufactured in India using high pharmaceutical quality standards, AsFenositol is suitable for women planning pregnancy or receiving fertility support under medical supervision."
    ],
    specifications: [
      {label:"Product name", value:"AsFenositol Tablet"},
      {label:"Category", value:"Fertility and women’s reproductive health supplement"},
      {label:"Dosage form", value:"Film-coated tablet"},
      {label:"Pack size", value:"1 × 10 tablets"},
      {label:"Shelf life", value:"24 months"},
      {label:"Country of origin", value:"India"},
      {label:"Manufacturer", value:"Manufactured in India under WHO-GMP certified pharmaceutical standards"}
    ],
    reasons: [
      {symbol:"1000", title:"High-strength Myo-Inositol", text:"Provides 1000 mg of Myo-Inositol per tablet."},
      {symbol:"F", title:"Active folate formula", text:"Contains L-Methylfolate, a bioavailable form of folate."},
      {symbol:"GMP", title:"Premium quality", text:"Manufactured under WHO-GMP certified pharmaceutical standards."}
    ],
    ingredients: [
      {symbol:"M", name:"Myo-Inositol", strength:"1000 mg", summary:"Supports ovarian function, insulin sensitivity and reproductive wellness."},
      {symbol:"F", name:"L-Methylfolate", strength:"0.5 mg", summary:"A bioavailable active folate that supports folate status and healthy fetal development."},
      {symbol:"B6", name:"Pyridoxal-5-Phosphate (Vitamin B6)", strength:"0.5 mg", summary:"An active form of Vitamin B6 that supports normal hormonal and homocysteine metabolism."},
      {symbol:"D3", name:"Vitamin D3", strength:"1000 IU", summary:"Supports Vitamin D status and contributes to overall reproductive wellness."}
    ],
    benefits: [
      {symbol:"O", title:"Ovarian function", text:"Supports healthy ovarian function and ovulation."},
      {symbol:"C", title:"Cycle support", text:"Helps support menstrual-cycle regularity and hormonal balance."},
      {symbol:"E", title:"Reproductive wellness", text:"Supports egg quality, fertility potential and endometrial health."},
      {symbol:"F", title:"Active folate", text:"Provides L-Methylfolate for improved folate availability."},
      {symbol:"D3", title:"Vitamin D support", text:"Helps improve Vitamin D status as part of reproductive nutritional care."}
    ],
    whoCanBenefit: ["Women planning for pregnancy","Women diagnosed with PCOS","Women experiencing irregular menstrual cycles","Women receiving fertility treatment","Women undergoing assisted reproductive techniques such as IVF under physician supervision","Women seeking nutritional support for reproductive wellness"],
    directions: [
      {label:"Suggested use", value:"1 tablet daily", text:"Take one tablet daily after meals, or as directed by your physician."},
      {label:"Pack size", value:"10 tablets", text:"One blister pack containing ten tablets."},
      {label:"Professional guidance", value:"Recommended", text:"Use under the supervision of a healthcare professional."}
    ],
    storage: [
      {symbol:"30°", title:"Store below 30°C", text:"Keep in a cool, dry place below 30°C."},
      {symbol:"☀", title:"Protect from sunlight", text:"Protect from moisture and direct sunlight."},
      {symbol:"📦", title:"Keep in original pack", text:"Keep in the original blister pack until use."}
    ],
    highlights: ["Supports ovulation","Supports women with PCOS","Hormonal-balance support","Active folate formula","Fertility cofactors included","Reproductive-wellness support","WHO-GMP quality","Daily fertility nutritional support"],
    warnings: ["Use under the supervision of a healthcare professional.","Do not exceed the recommended daily dose.","If pregnant, breastfeeding or taking medication, consult your physician before use.","Do not use if the blister pack is damaged or opened.","Food supplements should not be used as a substitute for a balanced diet and healthy lifestyle.","Keep out of reach of children."],
    faqs: [
      {question:"Who may benefit from AsFenositol?", answer:"It is intended for women seeking nutritional support for ovarian function, hormonal balance and reproductive wellness, including women with PCOS or those receiving fertility care under professional supervision."},
      {question:"How should I take it?", answer:"Take one tablet daily after meals, or as directed by your physician."},
      {question:"Does it contain active folate?", answer:"Yes. Each tablet contains 0.5 mg of L-Methylfolate."},
      {question:"How many tablets are in one pack?", answer:"Each pack contains 10 tablets."}
    ], nafdac:"A7-102870"
  },
  {
    slug: "globivida", name: "Globivida Capsules", category: "Advanced sickle cell wellness formula",
    summary: "A premium nutritional formulation for antioxidant, blood-health, immune and daily wellness support.",
    indication: "Supporting wellness in individuals living with sickle cell disease.",
    image: "/images/products/globivida.png", priceKobo: 1500000, packSize: "30 capsules", theme: "red",
    overview: "Globivida Capsules is an advanced nutritional formulation developed to support individuals living with sickle cell disorder. Its selected ingredients support healthy red blood cell function, antioxidant defence, immune function and overall wellbeing.",
    description: [
      "Globivida Capsules is a premium nutritional supplement specially formulated to support individuals living with sickle cell disorder. The advanced formula combines botanical extracts, amino acids, vitamins, minerals and antioxidants that work together to support healthy red blood cells, immune health and cellular protection from oxidative stress.",
      "Designed for daily nutritional support, Globivida promotes vitality, healthy blood function and general wellbeing while complementing a healthy lifestyle and physician-directed care.",
      "Manufactured in India under strict WHO-GMP pharmaceutical quality standards, Globivida Capsules provide a carefully balanced formulation for reliable daily supplementation."
    ],
    specifications: [
      {label:"Product name", value:"Globivida Capsules"},
      {label:"Category", value:"Advanced sickle cell wellness formula"},
      {label:"Dosage form", value:"Capsules"},
      {label:"Packaging", value:"Bottle"},
      {label:"Pack size", value:"30 capsules"},
      {label:"Shelf life", value:"24 months"},
      {label:"Country of origin", value:"India"},
      {label:"Manufacturer", value:"Manufactured in India under WHO-GMP certified pharmaceutical standards"}
    ],
    reasons: [
      {symbol:"RBC", title:"Red blood cell support", text:"Contains selected botanicals and nutrients to support red blood cell integrity and normal formation."},
      {symbol:"NO", title:"Circulation support", text:"Includes L-Arginine as a precursor of nitric oxide for healthy circulation and vascular function."},
      {symbol:"AO", title:"Antioxidant defence", text:"Combines antioxidant botanicals, vitamins and minerals to support cellular protection."}
    ],
    ingredients: [
      {symbol:"Cc", name:"Cajanus cajan Extract", strength:"150 mg", summary:"A traditionally used botanical included for nutritional support."},
      {symbol:"Po", name:"Pterocarpus osun / Pterocarpus marsupium Extract", strength:"100 mg", summary:"A botanical extract traditionally associated with blood-health support."},
      {symbol:"Pm", name:"Parquetina nigrescens Extract", strength:"50 mg", summary:"A botanical extract included in the product’s wellness-support blend."},
      {symbol:"Sb", name:"Sorghum bicolor Extract", strength:"50 mg", summary:"A botanical source included for antioxidant and blood-health support."},
      {symbol:"Arg", name:"L-Arginine", strength:"100 mg", summary:"An amino acid that supports nitric oxide production and healthy circulation."},
      {symbol:"Gly", name:"Glycine", strength:"50 mg", summary:"An amino acid involved in normal protein and metabolic functions."},
      {symbol:"Cur", name:"Curcuma longa Extract (standardized)", strength:"50 mg", summary:"A standardized botanical extract used for antioxidant support."},
      {symbol:"Cl", name:"Syzygium aromaticum (Clove) Extract", strength:"25 mg", summary:"A botanical extract with antioxidant properties."},
      {symbol:"Pip", name:"Piper nigrum Extract", strength:"5 mg", summary:"A botanical extract included in the formulation."},
      {symbol:"F", name:"Folic Acid", strength:"1 mg", summary:"Supports normal red blood cell formation."},
      {symbol:"B6", name:"Vitamin B6 (Pyridoxine)", strength:"10 mg", summary:"Supports normal energy metabolism and red blood cell formation."},
      {symbol:"B12", name:"Vitamin B12 (Methylcobalamin)", strength:"500 mcg", summary:"Supports normal red blood cell formation and nervous-system function."},
      {symbol:"Zn", name:"Zinc (as Zinc Gluconate)", strength:"15 mg", summary:"Supports normal immune function and antioxidant protection."},
      {symbol:"E", name:"Vitamin E (d-alpha Tocopherol)", strength:"15 IU", summary:"Provides antioxidant protection against oxidative stress."}
    ],
    benefits: [
      {symbol:"🩸", title:"Healthy red blood cells", text:"Supports healthy red blood cell function and normal formation."},
      {symbol:"🛡", title:"Antioxidant defence", text:"Helps protect cells from oxidative stress and free radical damage."},
      {symbol:"♥", title:"Blood health and circulation", text:"Supports healthy circulation, tissue oxygenation and vascular function."},
      {symbol:"⚡", title:"Energy and vitality", text:"Supports healthy energy metabolism and helps address nutritional demands."},
      {symbol:"✚", title:"Immune support", text:"Provides nutrients that support normal immune-system function."}
    ],
    whoCanBenefit: ["Individuals living with sickle cell anaemia (HbSS)","Individuals living with sickle cell disease","Teenagers and adults requiring nutritional support for sickle cell wellness","People seeking antioxidant support","Individuals experiencing recurrent fatigue associated with sickle cell disorder","People seeking support for healthy blood function and general wellbeing"],
    directions: [
      {label:"Suggested use", value:"1 capsule once or twice daily", text:"Take one capsule once or twice daily after meals, or as directed by your healthcare professional."},
      {label:"Pack size", value:"30 capsules", text:"Each bottle contains 30 capsules."},
      {label:"Professional care", value:"Complementary support", text:"Use as part of comprehensive healthcare and under professional guidance."}
    ],
    storage: [
      {symbol:"15–32°", title:"Cool, dry storage", text:"Store in a cool, dry place at approximately 15°C–32°C."},
      {symbol:"☀", title:"Protect from sunlight", text:"Protect from direct sunlight and moisture."},
      {symbol:"🔒", title:"Keep tightly closed", text:"Keep the container tightly closed after use."}
    ],
    highlights: ["Advanced sickle cell wellness formula","Supports healthy red blood cells","Antioxidant and immune support","Promotes healthy circulation","Supports daily energy and vitality","Premium pharmaceutical quality","WHO-GMP manufacturing"],
    warnings: ["Use under the supervision of a healthcare professional.","Do not exceed the recommended daily dose.","If pregnant, breastfeeding or taking medication, consult your physician before use.","Do not use if the seal is broken or missing.","Food supplements should not be used as a substitute for a varied, balanced diet and healthy lifestyle.","Keep out of reach of children.","This product is not intended to diagnose, treat, cure or prevent any disease."],
    faqs: [
      {question:"What is Globivida Capsules?", answer:"Globivida is a nutritional supplement formulated with botanical extracts, amino acids, vitamins and minerals to support antioxidant defence, blood health, immune function and overall wellness in individuals living with sickle cell disorder."},
      {question:"How should it be taken?", answer:"Take one capsule once or twice daily after meals, or as directed by your healthcare professional."},
      {question:"Does Globivida replace prescribed treatment?", answer:"No. It is a nutritional supplement and should complement, not replace, physician-directed care."},
      {question:"How many capsules are in one bottle?", answer:"Each bottle contains 30 capsules."}
    ]
  },
  {
    slug: "herbal-bitter-tea", name: "Bridgecare Herbal Bitter Tea", category: "100% natural herbal wellness tea",
    summary: "A herbal infusion made from 100% Hunteria umbellata (Abere seed) for metabolic and general wellness support.",
    indication: "Naturally supporting healthy blood sugar metabolism and everyday wellness.",
    image: "/images/products/herbal-bitter-tea.png", priceKobo: 550000, packSize: "25 tea bags", theme: "green",
    overview: "Bridgecare Herbal Bitter Tea is a carefully formulated herbal infusion made from 100% Hunteria umbellata (Abere seed), traditionally recognized for supporting healthy blood sugar metabolism and overall wellness.",
    description: [
      "Bridgecare Herbal Bitter Tea provides a convenient and natural way to enjoy the traditional wellness-supporting properties of Hunteria umbellata. Each tea bag delivers premium-quality herbal material for use as part of a healthy lifestyle.",
      "When combined with an appropriate diet, regular exercise and professional medical care where required, the tea can form part of a daily metabolic-wellness routine."
    ],
    specifications: [
      {label:"Product name", value:"Bridgecare Herbal Bitter Tea"},
      {label:"Ingredient", value:"Hunteria umbellata (100%)"},
      {label:"Tea bags", value:"25 tea bags"},
      {label:"Net weight", value:"50 g (2 g × 25 tea bags)"},
      {label:"Dosage form", value:"Herbal tea bags"},
      {label:"Shelf life", value:"2 years"},
      {label:"Storage", value:"Store below 30°C in a cool, dry place away from direct sunlight"}
    ],
    reasons: [
      {symbol:"100%", title:"Single natural ingredient", text:"Made from 100% Hunteria umbellata (Abere seed)."},
      {symbol:"25", title:"Convenient tea bags", text:"Each pack contains 25 individually portioned tea bags."},
      {symbol:"✓", title:"Clean formulation", text:"No artificial colours, flavours or preservatives; caffeine free."}
    ],
    ingredients: [
      {symbol:"H", name:"Hunteria umbellata (Abere seed)", strength:"100%", summary:"A medicinal plant traditionally used in West Africa for metabolic, antioxidant, immune and general wellness support."}
    ],
    benefits: [
      {symbol:"💧", title:"Blood sugar metabolism", text:"Supports healthy blood sugar metabolism and glucose levels already within a healthy range."},
      {symbol:"🛡", title:"Antioxidant support", text:"Provides natural phytochemicals that support antioxidant defence."},
      {symbol:"♥", title:"Cardiovascular wellness", text:"Supports healthy circulation and cardiovascular wellness."},
      {symbol:"🌿", title:"Liver, kidney and digestion support", text:"Traditionally used to support healthy organ function and digestion."},
      {symbol:"✚", title:"Immune and general wellness", text:"Supports natural immune function, metabolism, vitality and general wellbeing."}
    ],
    whoCanBenefit: ["Adults seeking support for healthy blood sugar management","Adults focused on metabolic wellness","People seeking cardiovascular and antioxidant support","Adults interested in healthy lifestyle maintenance","People seeking general wellness and vitality support"],
    directions: [
      {label:"Step 1", value:"Place one tea bag in a cup", text:"Use one tea bag for each serving."},
      {label:"Step 2", value:"Add 240 ml hot water", text:"Pour hot water over the tea bag."},
      {label:"Step 3", value:"Steep for 30 minutes", text:"Allow the tea to infuse fully before drinking."},
      {label:"Suggested frequency", value:"Twice daily", text:"Drink twice daily, preferably 30 minutes before meals. Monitor blood sugar regularly if diabetic and consult your healthcare professional for individualized advice."}
    ],
    storage: [
      {symbol:"30°", title:"Cool, dry storage", text:"Store below 30°C in a cool, dry place."},
      {symbol:"☀", title:"Protect from sunlight", text:"Keep away from direct sunlight and moisture."},
      {symbol:"👶", title:"Keep away from children", text:"Store securely out of reach of children."}
    ],
    highlights: ["100% natural herbal tea","Premium-quality herbs","No artificial colours","No artificial flavours","No preservatives","Caffeine free","Easy-to-use tea bags"],
    warnings: ["Use only as directed.","Not recommended for pregnant or breastfeeding women unless advised by a healthcare professional.","Keep out of reach of children.","Do not exceed the recommended intake.","If you are taking medication for diabetes or any chronic illness, consult your healthcare provider before use.","Discontinue use if any adverse reaction occurs."],
    faqs: [
      {question:"What is the main ingredient?", answer:"The tea is made from 100% Hunteria umbellata, commonly known as Abere seed."},
      {question:"How do I prepare it?", answer:"Place one tea bag in a cup, add 240 ml of hot water, steep for 30 minutes and drink as directed."},
      {question:"Is it caffeine free?", answer:"Yes. The product is caffeine free and contains no artificial colours, flavours or preservatives."},
      {question:"Can I use it with diabetes medication?", answer:"Consult your healthcare provider before use because blood sugar should be monitored and medication may require professional review."}
    ], nafdac:"Approved"
  }
];

export const PRODUCT_BY_SLUG = Object.fromEntries(PRODUCTS.map(product => [product.slug, product]));
