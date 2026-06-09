import { useState } from 'react'
// import reactLogo from './assets/react.svg'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css'
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Categories from './admin/categories';
import AddProduct from './admin/AddProduct';
import EditProduct from './admin/EditProduct';
import Products from './admin/product';
import AdminRoute from './components/AdminRoute';
import CategoryPage from './user/Categorypage';
import Navbar from './components/Navbar';
import CategoryProducts from "./pages/CategoryProducts";
import ProductDetails from './components/home/ProductDetails';
const router = createBrowserRouter([
  {path:"/", element:<Home/>},
  {path:"/login", element:<Login/>},
  {path:"/signup", element:<SignUp/>},
  {path:"/category",element:<Categories/>},
  {path:"/category/:id" ,element:<CategoryProducts />},
  {path:'/product/:id', element:<ProductDetails/>},

  // {path:"/nav",element:<Navbar/>},
  // {path:"/hero",element:<HeroSection/>},
  // ADMIN ROUTES
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
  }
  

]);
export default function App() {
  return <RouterProvider router={router} />;
}
