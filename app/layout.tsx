import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "PayPerEquals — Pay Per Calculation",
    template: "%s | PayPerEquals",
  },
  description:
    "Why calculate for free when you can pay for every result? The world's first pay-per-equals SaaS calculator.",
  keywords: ["calculator", "pay per use", "saas", "parody", "math"],
  openGraph: {
    title: "PayPerEquals — Pay Per Calculation",
    description: "Why calculate for free when you can pay for every result?",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
