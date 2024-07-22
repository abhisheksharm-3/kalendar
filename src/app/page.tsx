import Hero from "@/components/Hero";
import { Integration } from "@/components/Integration";
import Layout from "@/components/Layout";
import Image from "next/image";

export default function Home() {
  return (
    <Layout><Hero /><Integration /></Layout>
  );
}
