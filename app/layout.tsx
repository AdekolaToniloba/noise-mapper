// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Noise Map - Find Your Quiet in the City",
  description:
    "An interactive map for crowdsourced noise level reporting in urban areas. Discover quiet routes and contribute to a more peaceful city.",
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  metadataBase: new URL("https://www.noisemap.xyz"),
  openGraph: {
    title: "Noise Map - Find Your Quiet in the City",
    description:
      "Discover quiet routes through your city with community-sourced noise data.",
    url: "https://www.noisemap.xyz",
    siteName: "Noise Map",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Noise Map - Find Your Quiet in the City",
    description:
      "Discover quiet routes through your city with community-sourced noise data.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}
