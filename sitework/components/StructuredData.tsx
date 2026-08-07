export function StructuredData() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bridgecarepharmang.com";
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Bridgecare Pharmaceuticals Limited",
      url: siteUrl,
      logo: `${siteUrl}/icon.png`,
      email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@bridgecarepharmang.com",
      contactPoint: [{ "@type": "ContactPoint", telephone: "+2348077733373", contactType: "customer service", areaServed: "NG", availableLanguage: ["English"] }],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Bridgecare Pharmaceuticals Limited",
      url: siteUrl,
      potentialAction: { "@type": "SearchAction", target: `${siteUrl}/search?q={search_term_string}`, "query-input": "required name=search_term_string" },
    },
  ];
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
