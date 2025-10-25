import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "darsot.ca",
  description: "Interactive terminal portfolio showcasing machine learning and data science expertise",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect x='10' y='20' width='80' height='60' rx='5' fill='%2300ff00' stroke='%2300aa00' stroke-width='2'/><rect x='20' y='35' width='60' height='30' fill='%23000000'/><text x='50' y='55' text-anchor='middle' font-family='monospace' font-size='12' fill='%2300ff00'>$</text><circle cx='75' cy='25' r='3' fill='%23ff0000'/><circle cx='85' cy='25' r='3' fill='%23ffff00'/><circle cx='95' cy='25' r='3' fill='%2300ff00'/></svg>",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect x='10' y='20' width='80' height='60' rx='5' fill='%2300ff00' stroke='%2300aa00' stroke-width='2'/><rect x='20' y='35' width='60' height='30' fill='%23000000'/><text x='50' y='55' text-anchor='middle' font-family='monospace' font-size='12' fill='%2300ff00'>$</text><circle cx='75' cy='25' r='3' fill='%23ff0000'/><circle cx='85' cy='25' r='3' fill='%23ffff00'/><circle cx='95' cy='25' r='3' fill='%2300ff00'/></svg>",
        sizes: "180x180",
        type: "image/svg+xml",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
