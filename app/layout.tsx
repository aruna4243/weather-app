import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../style/globals.css";
import { Providers } from "./providers";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Weather-Forecast-App",
  description: "Developed by Arunadevi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="dark"
      love-deals="879BC0364EB9EBEE3DBE71B15E175613"
      style={{ height: "100%" }}
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
        data-gr-ext-installed=""
        data-new-gr-c-s-check-loaded="14.1235.0"
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
