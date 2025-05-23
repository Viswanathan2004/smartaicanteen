import MainLayout from "@/components/layouts/main-layout";
import HeroSection from "@/components/hero-section";
import FeatureHighlights from "@/components/feature-highlights";
import FoodCategoryTabs from "@/components/food-category-tabs";
import AIFeatures from "@/components/ai-features";
import QRCodeSection from "@/components/qr-code-section";
import SpecialOffers from "@/components/special-offers";
import TestimonialsSection from "@/components/testimonials-section";
import CallToAction from "@/components/call-to-action";

export default function Home() {
  return (
    <MainLayout>
      <HeroSection />
      <FeatureHighlights />
      <FoodCategoryTabs />
      <AIFeatures />
      <QRCodeSection />
      <SpecialOffers />
      <TestimonialsSection />
      <CallToAction />
    </MainLayout>
  );
}