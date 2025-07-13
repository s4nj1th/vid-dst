import type { Metadata } from "next";
import { Atkinson_Hyperlegible } from "next/font/google";
import "./globals.css";

const atkSans = Atkinson_Hyperlegible({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-atkhyper',
});

export const metadata: Metadata = {
  title: "VidDst",
  description: "A Web App for Video Distribution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${atkSans.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
