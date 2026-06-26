import Navbar from "../components/Navbar";
import PromoBar from "../components/home/PromoBar";
import HeroSection from "../components/home/HeroSection";
import FlavoursSection from "../components/home/FlavoursSection";
import InfoBar from "../components/home/InfoBar";
import FeaturedProducts from "../components/home/FeaturedProducts";
import BenefitsSection from "../components/home/BenefitsSection";
import ReviewsCarousel from "../components/home/ReviewsCarousel";
import PromoBanner from "../components/home/PromoBanner";
import ConsumerReviews from "../components/home/ConsumerReviews";
import FAQSection from "../components/home/FAQSection";
import HowToCrushSection from "../components/home/HowToCrushSection";
import BlogSection from "../components/home/BlogSection";
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
      <ReviewsCarousel />
      <PromoBanner />
      <ConsumerReviews />
      <FAQSection />
      <HowToCrushSection />
      <BlogSection />
      <Footer />
    </>
  );
};

export default Home;