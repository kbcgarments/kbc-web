import Header from "@/components/storefront/header/Header";
import Footer from "@/components/storefront/footer/Footer";
import ScrollToTop from "@/components/ui/layout/ScrollToTop";
import { MobileBottomNav } from "@/components/storefront/header/navigation/MobileBottomNav";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-primary flex flex-col justify-between">
      <Header />
      <main>{children}</main>
      <Footer />
      <MobileBottomNav />
      <ScrollToTop />
    </div>
  );
}
