import { HeroSection , Newsletter,Testimonials  , ContactSection } from "../components/common";
import {BestSellers, CategorySection, ProductsList} from "../components/features/products";
  import { Suspense } from "react";
export default function Home() {
  return (
    <Suspense>
      <div className="flex flex-col gap-0">
      <HeroSection />
      <BestSellers />
      <CategorySection />
      <ProductsList />
      <Testimonials />
      <ContactSection />
    </div>
    </Suspense>
  );
}
