
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
// export default function Home(){
//     const navigate=useNavigate();
//     return(
//         <>
//         <h1>Oats Fresh</h1>
//         <div className="flex gap-4 mt-2">
            

//             <button onClick={()=>{
//                 navigate('/login')

//             }}
//             className="bg-blue-500 text-white px-2 mr-2">login</button>
            
//             <button onClick={()=>{
//                 navigate('/signup')

//             }}
//             className="bg-blue-500 text-white px-2 mr-2">Sign up</button>
            

//             <button onClick={()=>{
//                 navigate('/admin/products')

//             }}
//             className="bg-blue-500 text-white px-2 mr-2">View Products</button>
            
//             <button onClick={()=>{
//                 navigate('/category')
//             }}
//             className="bg-blue-500 text-white px-2 mr-2">
//                 View categories
//             </button>
//         </div>
//         </>
//     )
// }
// import React, { useState, useEffect } from 'react';
// import { Menu, X, ChevronDown, ShoppingBag, User } from 'lucide-react';
// import ProductCard from "../components/ProductCard";

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isCategoryOpen, setIsCategoryOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [products, setProducts] = useState([]);
//   const navigate=useNavigate();
//   // Add a subtle shadow when scrolling
//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 20) {
//         setIsScrolled(true);
//       } else {
//         setIsScrolled(false);
//       }
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   useEffect(() => {
//   const fetchCategories = async () => {
//     try {
//       const res = await api.get("/category");
//       setCategories(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   fetchCategories();
// }, []);



//     useEffect(() => {
//         fetchProducts();
//     }, []);

//     const fetchProducts = async () => {
//         try {
//             const res = await api.get("/product");

//             setProducts(res.data.products || res.data);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//   return (
//     <>
//     <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
//       isScrolled ? 'bg-[#F3EDE2]/95 backdrop-blur-md shadow-sm' : 'bg-[#FAF7F2]'
//     } border-b border-[#E6DCC8]`}>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-20">
          
//           {/* Logo Section */}
//           <div className="flex-shrink-0 flex items-center space-x-2 cursor-pointer">
//             <div className="bg-[#8C7A6B] p-2 rounded-full text-[#FAF7F2]">
//               <ShoppingBag size={20} />
//             </div>
//             <span className="text-xl font-bold tracking-wide text-[#5C4E43]">
//               Oats Crush
//             </span>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-8">
//             <a href="#" className="text-[#5C4E43] hover:text-[#8C7A6B] font-medium transition-colors">
//               Home
//             </a>

//             {/* Category Dropdown */}
//             <div className="relative">
//               <button
//                 onClick={() => setIsCategoryOpen(!isCategoryOpen)}
//                 // onBlur={() => setTimeout(() => setIsCategoryOpen(false), 200)} // smooth close
//                 className="flex items-center space-x-1 text-[#5C4E43] hover:text-[#8C7A6B] font-medium transition-colors focus:outline-none"
//               >
//                 <span>Categories</span>
//                 <ChevronDown size={16} className={`transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
//               </button>

//               {/* Dropdown Menu */}
//               {/* Dropdown Menu */}
//                 {isCategoryOpen && (
//                 <div className="absolute left-0 mt-3 w-56 rounded-xl bg-[#FAF7F2] shadow-xl border border-[#E6DCC8] py-2 z-50 animate-in fade-in slide-in-from-top-5 duration-200">
                    
//                     {
//                     categories.map((category) => (
//                     <div
//                         key={category._id}
//                         onClick={() => {
//                         console.log(category);
//                         navigate(`/category/${category._id}`);
//                         setIsCategoryOpen(false);
//                         }}
//                         className="block px-4 py-2.5 text-sm text-[#5C4E43] hover:bg-[#F3EDE2] hover:text-[#8C7A6B] transition-colors cursor-pointer"
//                     >   
                        
//                         {category.name}
//                     </div>
//                     ))}
//                 </div>
//                 )}
//             </div>
//           </div>

//           {/* Desktop Auth Buttons */}
//           <div className="hidden md:flex items-center space-x-4">
//             <button 
//              onClick={()=>{
//                 navigate('/login')
//              }}
//              className="text-[#5C4E43] hover:text-[#8C7A6B] font-medium transition-colors px-4 py-2">
//               Login
//             </button>
//             <button 
//             onClick={()=>{
//                 navigate('/signup')
//              }}
//             className="bg-[#8C7A6B] hover:bg-[#5C4E43] text-[#FAF7F2] font-medium px-5 py-2.5 rounded-full transition-all duration-200 shadow-sm hover:shadow-md">
//               Sign Up
//             </button>

//             <button 
//             onClick={()=>{
//                 navigate('/admin/products')
//              }}
//             className="bg-[#8C7A6B] hover:bg-[#5C4E43] text-[#FAF7F2] font-medium px-5 py-2.5 rounded-full transition-all duration-200 shadow-sm hover:shadow-md">
//               View Products
//             </button>
//           </div>

          

      
//         </div>
//       </div>
//     </nav>
//     <div className="max-w-7xl mx-auto px-4 py-8">
//             <h1 className="text-3xl font-bold mb-8">
//                 All Products
//             </h1>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                 {products.map((product) => (
//                     <ProductCard
//                         key={product._id}
//                         product={product}
//                     />
//                 ))}
//             </div>
//         </div>
//     </>

//   );
// };

// export default Navbar;


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