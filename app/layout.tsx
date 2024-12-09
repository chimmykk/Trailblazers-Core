import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar2 from "@/components/navbar";
import Image from "next/image";
import Eclipse from "@/components/graphics/eclipse";
import TopLeft from "@/components/graphics/topLeft-grad";
import Planets from "@/components/graphics/planet-icons";
import Footer from "@/components/sections/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mintpad Mintquest Campaign",
  description: "MintQuest Campaign by Mintpad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <div className="background-container">
          <Eclipse />
          <Planets />
          <TopLeft />
          <div className="content">
            <Navbar2 />
            {children}
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
