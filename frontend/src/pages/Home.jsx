import Navbar from "../components/Navbar";
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
import ComparisonSection from "../components/home/ComparisonSection";

const Home = () => {
const faqs = [
    {
      id: 1,
      question: "How to crush it?",
      answer:
        "Mix with 240ml milk or alternative, shake or blend, and you're ready in seconds. No bowls, no spoons, no mess.",
    },
    {
      id: 2,
      question: "How much protein does one serving contain?",
      answer:
        "Each serving packs 30g of protein — more than two whole eggs, in a single pouch.",
    },
    {
      id: 3,
      question: "Does it contain artificial sweeteners?",
      answer:
        "No. We use natural sweetness from oats and monk fruit — zero refined sugar, zero artificial sweeteners.",
    },
    {
      id: 4,
      question: "Is Oats Crush vegan and lactose-free?",
      answer:
        "Yes — every flavour is 100% plant-based, dairy-free, and lactose-free, without compromising on taste or protein.",
    },
    {
      id: 5,
      question: "What's the shelf life and how should I store it?",
      answer:
        "Unopened, it stays fresh for up to 9 months in a cool, dry place. No refrigeration needed until opened.",
    },
  ];
  return (
    <>
      <Navbar />
      <HeroSection />
      <InfoBar />
      <FeaturedProducts />
      <FlavoursSection />
      <ComparisonSection />
      <BenefitsSection />
      <ReviewsCarousel />
      <PromoBanner />
      <ConsumerReviews />
      <FAQSection faqs={faqs} image="/images/coffee.webp" />
      <HowToCrushSection />
      <BlogSection />
      <Footer />
    </>
  );
};

export default Home;