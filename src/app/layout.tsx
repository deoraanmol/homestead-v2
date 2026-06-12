import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import ColorPicker from "./color-picker/ColorPickers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Homestead — Tricity Real Estate",
  description: "Browse and manage property listings in Chandigarh, Mohali & Panchkula",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      {/* <body className={`${inter.variable} font-sans`}> */}
      <body className={`${inter.variable} font-sans bg-background text-neutral-dark antialiased`}>
        <Providers>
          {children}
          {/* <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
            <ColorPicker />
          </div> */}
        </Providers>
      </body>
    </html>
  );
}
