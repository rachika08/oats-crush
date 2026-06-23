import Navbar from "../components/Navbar";
import PromoBar from "../components/home/PromoBar";
import HeroSection from "../components/home/HeroSection";
import FlavoursSection from "../components/home/FlavoursSection";
import InfoBar from "../components/home/InfoBar";
import FeaturedProducts from "../components/home/FeaturedProducts";
import BenefitsSection from "../components/home/BenefitsSection";
import PromoBanner from "../components/home/PromoBanner";
import ConsumerReviews from "../components/home/ConsumerReviews";
import Footer from "../components/home/Footer";

const Home = () => {
  return (
    <>
      <PromoBar />
      <Navbar />
      <HeroSection />
      <FlavoursSection />
      <InfoBar />
      <FeaturedProducts />
      <BenefitsSection />
      <PromoBanner />
      <ConsumerReviews />
      <Footer />
    </>
  );
};

export default Home;