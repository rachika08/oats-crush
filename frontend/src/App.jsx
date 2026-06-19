import { useState } from 'react'
// import reactLogo from './assets/react.svg'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css'
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
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import Addresses from './pages/Addresses';
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';
import AdminDashboard from './admin/AdminDashboard';
import AdminOrders from './admin/AdminOrder';
import AdminOrderDetails from './admin/AdminOrderDetails';
import ReturnPolicy from './pages/RefundPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ShippingPolicy from './pages/ShippingPolicy';
import TermsOfService from './pages/TermsOfService';
import Contact from './pages/Contact';
const router = createBrowserRouter([
  {path:"/", element:<Home/>},
  {path:"/login", element:<Login/>},
  {path:"/signup", element:<SignUp/>},
  {path:"/category",element:<Categories/>},
  {path:"/category/:id" ,element:<CategoryProducts />},
  {path:'/product/:id', element:<ProductDetails/>},
  {path:"/cart" , element:<CartPage/>},
  {path:"/checkout", element:<Checkout/>},
  {path:"/addresses", element:<Addresses/>},
  {path:"/order", element:<MyOrders/>},
  {path:"/order/:id", element:<OrderDetails/>},
  {path: "/verify-email/:token",element: <VerifyEmail />},
  {path: "/products",element: <AllProducts />},
  {path:"/returnpolicy",element:<ReturnPolicy/>},
  {path:"/privacypolicy",element:<PrivacyPolicy/>},
  {path:"/shippingpolicy",element:<ShippingPolicy/>},
  {path:"/terms",element:<TermsOfService/>},
  {path:"/contact",element:<Contact/>},
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
    }
  

]);
export default function App() {
  return <RouterProvider router={router} />;
}
