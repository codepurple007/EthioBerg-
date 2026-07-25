import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { AppProviders } from "@/providers/AppProviders";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EthioBerg | ESX Listing Readiness & Disclosure Intelligence",
  description:
    "AI-powered listing readiness, disclosure intelligence, and financial analysis for the Ethiopian Securities Exchange.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`h-full antialiased ${poppins.variable} ${poppins.className}`}>
      <body className="min-h-full">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
