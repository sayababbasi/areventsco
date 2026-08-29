export function LocalBusinessJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "AR Events Co.",
    alternateName: "AR Events Co. Islamabad & Rawalpindi",
    description:
      "Premier event planning and luxury birthday decoration services in Islamabad and Rawalpindi. Custom 3D backdrops, balloon architecture, cakes, and turnkey event coordination.",
    url: "https://areventsco.com",
    logo: "https://areventsco.com/brand/website%20logo.png",
    image: "https://areventsco.com/brand/social%20logo.png",
    telephone: "+923008555123",
    email: "info@areventsco.com",
    priceRange: "PKR 45,000 - 250,000",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Sector F-7 / Blue Area & Bahria Town",
      addressLocality: "Islamabad",
      addressRegion: "Federal Capital",
      addressCountry: "PK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "33.7294",
      longitude: "73.0931",
    },
    areaServed: [
      {
        "@type": "City",
        name: "Islamabad",
      },
      {
        "@type": "City",
        name: "Rawalpindi",
      },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "10:00",
        closes: "22:00",
      },
    ],
    sameAs: [
      "https://facebook.com",
      "https://instagram.com",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
