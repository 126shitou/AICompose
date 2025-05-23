import { HeroSection } from '@/components/hero-section';
import { FeatureShowcase } from '@/components/feature-showcase';
import { CreditSection } from '@/components/credit-section';

export default function Home() {
  return (
    <div className="space-y-20">
      <HeroSection />
      <FeatureShowcase />
      <CreditSection />
    </div>
  );
}