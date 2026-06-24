import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import DonateBanner from "@/components/DonateBanner";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="max-sm:pb-32">{children}</main>
      <Footer />
      <ScrollToTop />
      <DonateBanner />
    </>
  );
}
