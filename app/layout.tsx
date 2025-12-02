import type { Metadata } from "next";
import "./globals.css";
import CartProvider from "@/components/CartProvider";
import Header from "@/components/Header";
import "@fontsource/doto/200.css";
import "@fontsource/doto/500.css";


export const metadata: Metadata = {
  title: "HotWheels Garage",
  description: "E-commerce website selling Hot Wheels cars."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-doto">
        <CartProvider>
          <Header />
          <main className="container">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
