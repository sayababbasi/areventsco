import type { Metadata } from "next";
import "./globals.css";
import { LocalBusinessJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://areventsco.com"),
  title: {
    default: "AR Events Co. | Premium Birthday & Event Planning Islamabad & Rawalpindi",
    template: "%s | AR Events Co.",
  },
  description:
    "Your Celebration, Our Passion. AR Events Co. is Islamabad and Rawalpindi's premier event planning and luxury birthday decoration service. Book custom themes, balloon decor, backdrops, and complete party packages online.",
  keywords: [
    "Birthday Event Planner Islamabad",
    "Birthday Decoration Islamabad",
    "Birthday Event Planner Rawalpindi",
    "Birthday Decoration Rawalpindi",
    "Event Planner Islamabad",
    "Party Decorator Islamabad",
    "AR Events Co",
  ],
  authors: [{ name: "AR Events Co." }],
  creator: "AR Events Co.",
  publisher: "AR Events Co.",
  icons: {
    icon: "/brand/favicon.png",
    shortcut: "/brand/favicon.png",
    apple: "/brand/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: "https://areventsco.com",
    title: "AR Events Co. | Your Celebration, Our Passion",
    description:
      "Premier event planning and luxury birthday decoration services across Islamabad and Rawalpindi.",
    siteName: "AR Events Co.",
    images: [
      {
        url: "/brand/social logo.png",
        width: 1200,
        height: 630,
        alt: "AR Events Co. Logo & Branding",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AR Events Co. | Event Planning & Birthday Decoration",
    description:
      "Islamabad and Rawalpindi's premier birthday planning and decoration platform.",
    images: ["/brand/social logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-white text-brand-navy-950 antialiased selection:bg-brand-gold-200 selection:text-brand-navy-950">
        <LocalBusinessJsonLd />
        {children}
      </body>
    </html>
  );
}
