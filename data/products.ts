export type Ingredient = { name: string; strength: string; summary: string; symbol: string };
export type ProductFaq = { question: string; answer: string };
export type Product = {
  slug: string; name: string; category: string; summary: string; indication: string;
  image: string; priceKobo: number; packSize: string; theme: string;
  overview: string; reasons: { title: string; text: string; symbol: string }[];
  ingredients: Ingredient[]; benefits: { title: string; text: string; symbol: string }[];
  directions: { label: string; value: string; text: string }[];
  storage: { title: string; text: string; symbol: string }[];
  warnings: string[]; faqs: ProductFaq[]; nafdac?: string; detailImage?: string;
};

export const PRODUCTS: Product[] = [
  {
    slug: "asfenositol", name: "AsFenositol®", category: "Women’s wellness",
    summary: "A once-daily nutritional formulation for women’s wellness.",
    indication: "Supports ovarian and immune function, egg quality and fertility.",
    image: "/images/products/asfenositol.png", priceKobo: 600000, packSize: "10 tablets", theme: "teal",
    overview: "AsFenositol combines four labelled nutrients in a convenient tablet. This page presents the approved pack information in a clear, customer-friendly format and does not replace advice from a healthcare professional.",
    reasons: [
      {symbol:"4", title:"Four labelled nutrients", text:"Myo-Inositol, active folate, active vitamin B6 and Vitamin D₃ in one formulation."},
      {symbol:"1×", title:"Simple daily routine", text:"The approved pack direction is one tablet daily, or as directed by a healthcare practitioner."},
      {symbol:"✓", title:"Clear product information", text:"Ingredients, directions, storage and warnings are presented from the approved packaging supplied by Bridgecare."}
    ],
    ingredients: [
      {symbol:"M", name:"Myo-Inositol", strength:"1000 mg per tablet", summary:"A naturally occurring inositol included as the principal ingredient in the labelled formulation."},
      {symbol:"F", name:"L-Methyl Folate", strength:"0.5 mg per tablet", summary:"The active form of folate listed on the approved product pack."},
      {symbol:"B6", name:"Pyridoxal-5-Phosphate", strength:"0.5 mg per tablet", summary:"The active coenzyme form of vitamin B6 included in the formulation."},
      {symbol:"D3", name:"Vitamin D₃", strength:"1000 IU per tablet", summary:"Vitamin D₃ at the labelled strength of 1000 IU per tablet."}
    ],
    benefits: [
      {symbol:"O", title:"Ovarian function", text:"Formulated to support ovarian function."},
      {symbol:"I", title:"Immune function", text:"Formulated to support immune function."},
      {symbol:"E", title:"Egg quality and fertility", text:"The approved indication includes support for egg quality and fertility."}
    ],
    directions: [
      {label:"Daily dose", value:"1 tablet", text:"Take one tablet daily, or use as directed by a healthcare practitioner."},
      {label:"Pack size", value:"10 tablets", text:"One blister pack containing ten tablets."},
      {label:"Responsible use", value:"Follow the label", text:"Do not alter the labelled direction without professional guidance."}
    ],
    storage: [
      {symbol:"30°", title:"Cool storage", text:"Store below 30°C."},
      {symbol:"☀", title:"Protect from sunlight", text:"Keep the pack away from direct sunlight."},
      {symbol:"⌂", title:"Dry place", text:"Store in a cool, dry place."}
    ],
    warnings: ["Keep out of reach of children.", "Use according to the approved pack direction or a healthcare practitioner’s advice.", "Speak with a healthcare professional about suitability, other medicines, pregnancy, breastfeeding or an existing medical condition."],
    faqs: [
      {question:"What is AsFenositol used for?", answer:"Its approved pack indication is support for ovarian and immune function, egg quality and fertility."},
      {question:"How do I take AsFenositol?", answer:"The pack direction states one tablet daily, or as directed by a healthcare practitioner."},
      {question:"How many tablets are in one pack?", answer:"Each pack contains 10 tablets."},
      {question:"Where should I store it?", answer:"Store below 30°C in a cool, dry place, protected from sunlight and out of reach of children."},
      {question:"Can I use it with other medicines or supplements?", answer:"Ask a healthcare professional to review your medicine and supplement routine before combining products."}
    ], nafdac:"A7-102870"
  },
  {
    slug: "aspivit", name: "Aspivit Tablet", category: "Daily nutrition",
    summary: "A comprehensive nutritional supplement formulated with Omega-3 fatty acids, essential vitamins, and trace minerals to support overall health and wellbeing.",
    indication: "Complete daily nutrition with Omega-3 fatty acids, vitamins and minerals.",
    image: "/images/products/aspivit-pack.jpg", detailImage: "/images/product-details/aspivit-flyer.jpg",
    priceKobo: 800000, packSize: "Bottle", theme: "gold",
    overview: "Aspivit Tablet is an advanced daily multivitamin and Omega-3 supplement designed to provide essential nutrients required for optimal health.",
    reasons: [], ingredients: [], benefits: [], directions: [], storage: [],
    warnings: [], faqs: []
  },
  ...[
    ["globivida","Globivida®","Specialized support","A blend of botanical extracts, amino acids, vitamins and minerals.","/images/products/globivida.png",1500000,"red"],
    ["herbal-bitter-tea","Bridgecare Herbal Bitter Tea®","Herbal wellness","Herbal tea prepared from 100% Hunteria umbellata.","/images/products/herbal-bitter-tea.png",550000,"green"]
  ].map(([slug,name,category,summary,image,priceKobo,theme]) => ({
    slug: slug as string, name: name as string, category: category as string, summary: summary as string,
    indication: summary as string, image: image as string, priceKobo: priceKobo as number, packSize:"See pack", theme:theme as string,
    overview:"Detailed approved product information is being structured from the supplied pack artwork.", reasons:[], ingredients:[], benefits:[], directions:[], storage:[], warnings:["Read the physical pack before use and consult a healthcare professional where appropriate."], faqs:[]
  }))
];

export const PRODUCT_BY_SLUG = Object.fromEntries(PRODUCTS.map(product => [product.slug, product]));
