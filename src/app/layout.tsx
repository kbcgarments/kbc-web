import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/Providers";
import GlobalUI from "@/components/common/layout/GlobalUI";
import FixThirdPartyIframes from "@/components/common/layout/FixThirdPartyIframes";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kbcuniverse.org"),
  title: {
    default: "KBC Universe | Modern Clothing Store",
    template: "%s | KBC Universe",
  },
  description:
    "Discover the latest fashion trends with KBC - Your premium online fashion destination for men and women",
  keywords: [
    "fashion",
    "clothing",
    "online store",
    "apparel",
    "style",
    "trends",
    "modern fashion",
  ],
  authors: [{ name: "KBC Universe" }],
  creator: "KBC Universe",
  publisher: "KBC Universe",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kbcuniverse.org",
    siteName: "KBC Universe",
    title: "KBC Universe | Modern Clothing Store",
    description: "Discover the latest fashion trends with KBC",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "KBC Universe | Modern Clothing Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KBC Universe | Modern Clothing Store",
    description: "Discover the latest fashion trends with KBC",
    images: ["/images/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#c5a572" />
      </head>
      <body suppressHydrationWarning={true}>
        <FixThirdPartyIframes />
        <Providers>
          {children}
          <GlobalUI />
        </Providers>
      </body>
    </html>
  );
}
