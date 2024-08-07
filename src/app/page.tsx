import { CallToAction } from "@/components/marketing/CTA";
import { FAQs } from "@/components/marketing/FAQ";
import Hero from "@/components/marketing/Hero";
import { Integration } from "@/components/marketing/Integration";
import Layout from "@/components/layout/Layout";
import { LogoTicker } from "@/components/marketing/LogoTicker";
import { ProductShowcase } from "@/components/marketing/ProductShowcase";
import { Pricing } from "@/components/marketing/PricingComp";

export default function Home() {
  return (
    <Layout>
      <Hero />
      <LogoTicker />
      <Integration />
      <ProductShowcase />
      <FAQs />
      <Pricing />
      <CallToAction />
    </Layout>
  );
}
