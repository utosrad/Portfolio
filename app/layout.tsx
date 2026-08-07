import type { Metadata, Viewport } from "next"
import { JetBrains_Mono, Inter } from "next/font/google"
import "./globals.css"
import { profile } from "./data/profile"

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const description =
  "Umar Darsot — software engineer and Waterloo math co-op student. Most recently Dapital, previously Interac and Purolator."

export const metadata: Metadata = {
  metadataBase: new URL(profile.website),
  title: {
    default: `${profile.name} — ${profile.title}`,
    template: `%s — ${profile.name}`,
  },
  description,
  keywords: [
    "Umar Darsot",
    "software engineer",
    "University of Waterloo",
    "Dapital",
    "Interac",
    "iOS",
    "Swift",
    "TypeScript",
    "machine learning",
    "portfolio",
  ],
  authors: [{ name: profile.name, url: profile.website }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: profile.website,
    siteName: "darsot.ca",
    title: `${profile.name} — ${profile.title}`,
    description,
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.title}`,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [
      {
        url:
          "data:image/svg+xml," +
          encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#07090b"/><text x="10" y="42" font-family="ui-monospace,monospace" font-size="30" font-weight="700" fill="#46e58a">&gt;_</text></svg>`,
          ),
        type: "image/svg+xml",
      },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07090b" },
    { media: "(prefers-color-scheme: light)", color: "#07090b" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

/** Structured data so search engines resolve the site to a person, not a blob of ASCII. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: profile.website,
  email: `mailto:${profile.email}`,
  jobTitle: profile.title,
  worksFor: { "@type": "Organization", name: "Dapital" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "University of Waterloo" },
  address: { "@type": "PostalAddress", addressLocality: "Waterloo", addressRegion: "ON", addressCountry: "CA" },
  sameAs: [profile.github, profile.linkedin],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="phosphor" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${mono.variable} ${sans.variable} font-mono antialiased`}>{children}</body>
    </html>
  )
}
