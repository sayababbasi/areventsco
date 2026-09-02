import { APP_BASE_URL } from "@/lib/seo";

export function LocalBusinessJsonLd({
  city = "Islamabad",
  address = "Sector F-7 / Blue Area & Bahria Town",
}: {
  city?: string;
  address?: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${APP_BASE_URL}/#localbusiness`,
    name: "AR Events Co.",
    alternateName: "AR Events Co. Birthday Decoration & Planning",
    description:
      "Premier event planning and luxury birthday decoration services in Islamabad and Rawalpindi. Custom 3D backdrops, balloon architecture, cakes, and turnkey event coordination.",
    url: APP_BASE_URL,
    logo: `${APP_BASE_URL}/brand/arevents logo.png`,
    image: `${APP_BASE_URL}/images/hero/hero_birthday_lawn.jpg`,
    telephone: "+923160513841",
    email: "info@areventsco.com",
    priceRange: "PKR 45,000 - 250,000",
    currenciesAccepted: "PKR",
    paymentAccepted: "Cash, Bank Transfer, Raast, JazzCash, EasyPaisa",
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
      addressLocality: city,
      addressRegion: "Islamabad Capital Territory / Punjab",
      postalCode: "44000",
      addressCountry: "PK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "33.7294",
      longitude: "73.0931",
    },
    areaServed: [
      { "@type": "City", name: "Islamabad" },
      { "@type": "City", name: "Rawalpindi" },
      { "@type": "AdministrativeArea", name: "Bahria Town Islamabad & Rawalpindi" },
      { "@type": "AdministrativeArea", name: "DHA Islamabad & Rawalpindi" },
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
      "https://instagram.com/areventsco",
      "https://facebook.com/areventsco",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ServiceJsonLd({
  name,
  description,
  url,
  image,
  priceMinor,
  category = "Decoration",
}: {
  name: string;
  description: string;
  url: string;
  image?: string;
  priceMinor?: number;
  category?: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "LocalBusiness",
      name: "AR Events Co.",
      url: APP_BASE_URL,
    },
    areaServed: [
      { "@type": "City", name: "Islamabad" },
      { "@type": "City", name: "Rawalpindi" },
    ],
    serviceType: category,
    url: url.startsWith("http") ? url : `${APP_BASE_URL}${url}`,
    image: image ? (image.startsWith("http") ? image : `${APP_BASE_URL}${image}`) : undefined,
    offers: priceMinor
      ? {
        "@type": "Offer",
        price: (priceMinor / 100).toString(),
        priceCurrency: "PKR",
        availability: "https://schema.org/InStock",
      }
      : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ProductJsonLd({
  name,
  description,
  priceMinor,
  image,
  url,
}: {
  name: string;
  description: string;
  priceMinor: number;
  image?: string;
  url: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: image ? (image.startsWith("http") ? image : `${APP_BASE_URL}${image}`) : undefined,
    url: url.startsWith("http") ? url : `${APP_BASE_URL}${url}`,
    brand: {
      "@type": "Brand",
      name: "AR Events Co.",
    },
    offers: {
      "@type": "Offer",
      price: (priceMinor / 100).toString(),
      priceCurrency: "PKR",
      availability: "https://schema.org/InStock",
      url: url.startsWith("http") ? url : `${APP_BASE_URL}${url}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function EventVenueJsonLd({
  name,
  address,
  city,
  capacity,
  description,
  url,
}: {
  name: string;
  address: string;
  city: string;
  capacity?: number;
  description?: string;
  url: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    name,
    description: description || `Partner Event Venue in ${city}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
      addressLocality: city,
      addressCountry: "PK",
    },
    maximumAttendeeCapacity: capacity,
    url: url.startsWith("http") ? url : `${APP_BASE_URL}${url}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${APP_BASE_URL}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function FaqPageJsonLd({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  if (!faqs || faqs.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
