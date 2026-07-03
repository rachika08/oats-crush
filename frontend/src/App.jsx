import { useState } from 'react'
import ScrollToTop from './components/ScrollToTop';
import {Outlet, createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css'
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/CartDrawer';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import VerifyEmail from './pages/VerifyEmail';
import Home from './pages/Home';
import AllProducts from "./pages/AllProducts";
import Categories from './admin/categories';
import AddProduct from './admin/AddProduct';
import EditProduct from './admin/EditProduct';
import Products from './admin/product';
import AdminRoute from './components/AdminRoute';
import CategoryPage from './user/Categorypage';
import Navbar from './components/Navbar';
import CategoryProducts from "./pages/CategoryProducts";
import ProductDetails from './components/home/ProductDetails';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import OrderDetails from './pages/OrderDetails';
import AdminDashboard from './admin/AdminDashboard';
import AdminOrders from './admin/AdminOrder';
import AdminOrderDetails from './admin/AdminOrderDetails';
import AdminBlogs from './admin/AdminBlogs';
import AddBlog from './admin/AddBlog';
import EditBlog from './admin/EditBlog';
import ReturnPolicy from './pages/RefundPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ShippingPolicy from './pages/ShippingPolicy';
import TermsOfService from './pages/TermsOfService';
import Contact from './pages/Contact';
import CustomizeBox from './pages/CustomizeBox';
import BlogDetails from './components/home/BlogDetails';
import Blogs from './components/home/Blogs';
import WhatsAppButton from './components/WhatsAppButton';
import FAQPage from './pages/FAQPage';
import NotFound from './pages/NotFound';


function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <CartDrawer />
      <WhatsAppButton />
      <Outlet />
      
    </>
  );
}

const router = createBrowserRouter([
  { 
    element: <RootLayout />,
  children: [{path:"/", element:<Home/>},
  {path:"/login", element:<Login/>},
  {path:"/signup", element:<SignUp/>},
  {path:"/category",element:<Categories/>},
  {path:"/category/:id" ,element:<CategoryProducts />},
  {path:'/product/:id', element:<ProductDetails/>},
  {path:"/checkout", element:<Checkout/>},
{path:"/profile", element:<Profile/>},
  {path:"/order/:id", element:<OrderDetails/>},
  {path: "/verify-email/:token",element: <VerifyEmail />},
  {path: "/products",element: <AllProducts />},
  {path:"/returnpolicy",element:<ReturnPolicy/>},
  {path:"/privacypolicy",element:<PrivacyPolicy/>},
  {path:"/shippingpolicy",element:<ShippingPolicy/>},
  {path:"/terms",element:<TermsOfService/>},
  {path:"/contact",element:<Contact/>},
  {path:"/customize-box", element:<CustomizeBox/>},
  {path:"/blogs/:id",element:<BlogDetails/>},
  {path:"/blog",element:<Blogs/>},
  {path:"/faq",element:<FAQPage/>},
  {path:"*", element:<NotFound/>},
  // ADMIN ROUTES
  {path:"/admin",element:<AdminRoute><AdminDashboard/></AdminRoute>},
  {
    path: "/admin/products",
    element: (
      <AdminRoute>
        <Products />
      </AdminRoute>
    )
  },
  {
    path: "/admin/add-product",
    element: <AddProduct />
  },
  {
    path: "/admin/edit/:id",
    element: <EditProduct />
  },
  {
  path:"/admin/orders",element : <AdminRoute>
    <AdminOrders/>
    </AdminRoute>},
  
  {path:"/admin/orders/:id",
    element:
        <AdminRoute>
            <AdminOrderDetails />
        </AdminRoute>

    },
  {
     path:"/admin/blogs", element:<AdminBlogs />
  },
  {
     path:"/admin/blogs/add", element:<AddBlog />
  },
  {
     path:"/admin/blogs/edit/:id", element:<EditBlog />
  },
  ]
}

]);
export default function App() {
  return (
<CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  );
}
