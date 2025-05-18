import HeroSection from "../components/HeroSection";
import BestSellers from "../components/BestSellers";
import CategorySection from "../components/CategorySection";
import Testimonials from "../components/Testimonials";
import Newsletter from "../components/Newsletter";
import ProductsList from "../components/ProductsList";
import ContactSection from "../components/ContactSection";

export default function Home() {
  return (
    <div className="flex flex-col gap-0">
      <HeroSection />
      <BestSellers />
      <CategorySection />
      <ProductsList />
      <Testimonials />
      <ContactSection />
    </div>
  );
}
