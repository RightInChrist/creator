import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AccountProvider } from "@/contexts/AccountContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Product Requirements Chat",
  description: "Chat with our Product Manager to define your project requirements",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AccountProvider>
          {children}
        </AccountProvider>
      </body>
    </html>
  );
}
