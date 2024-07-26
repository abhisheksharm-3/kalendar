import { CallToAction } from "@/components/CTA";
import { FAQs } from "@/components/FAQ";
import Hero from "@/components/Hero";
import { Integration } from "@/components/Integration";
import Layout from "@/components/Layout";
import { LogoTicker } from "@/components/LogoTicker";
import { ProductShowcase } from "@/components/ProductShowcase";
import { Pricing } from "@/components/PricingComp";

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
