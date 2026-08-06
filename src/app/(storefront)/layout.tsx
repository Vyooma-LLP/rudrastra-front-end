import { Ticker } from "@/components/layout/Ticker";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Ticker />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
