
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import Navbar from "../components/Navbar";
import HeroSection from "../components/home/HeroSection";
import CategorySection from "../components/home/CategorySection";
import FeaturedProducts from "../components/home/FeaturedProducts";
import BenefitsSection from "../components/home/BenefitsSection";
import SubscriptionSection from "../components/home/SubscriptionSection";
import Footer from "../components/home/Footer";


const Home = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <CategorySection/>
      <FeaturedProducts/>
      <BenefitsSection/>
      <SubscriptionSection/>
      <Footer/>
    </>
  );
};

export default Home;