import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ParallaxSection from "@/components/ParallaxSection";
import HorizontalScroll from "@/components/HorizontalScroll";
import TextRevealSection from "@/components/TextRevealSection";
import SmoothScrollWrapper from "@/components/SmoothScrollWrapper";
import ScrollProgressIndicator from "@/components/ScrollProgressIndicator";

const Index = () => {
  return (
    <SmoothScrollWrapper>
      <ScrollProgressIndicator />
      <main className="min-h-screen overflow-x-hidden">
        <Navbar />
        <Hero />
        <ParallaxSection />
        <Services />
        <HorizontalScroll />
        <TextRevealSection />
        <Pricing />
        <Testimonials />
        <Contact />
        <Footer />
      </main>
    </SmoothScrollWrapper>
  );
};

export default Index;