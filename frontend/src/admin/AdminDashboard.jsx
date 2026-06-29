import Navbar from "../components/Navbar";
import {useNavigate} from 'react-router';
export default function AdminDashboard() {
    const navigate=useNavigate();
    return (
        <>
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-20">

                <h1 className="text-3xl font-bold">Admin Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

                    <div>
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h4 onClick={()=>{
                                navigate("/admin/products");
                            }} className="text-xl font-semibold">Products</h4>
                        </div>
                    </div>

                    <div>
                        <div onClick={()=>{
                            navigate('/category')
                        }} className="bg-white shadow-md rounded-lg p-6">
                            <h4 className="text-xl font-semibold">Categories</h4>
                        </div>
                    </div>

                    <div>
                        <div onClick={()=>{
                            navigate("/admin/orders")
                        }}className="bg-white shadow-md rounded-lg p-6">
                            <h4 className="text-xl font-semibold">Orders</h4>
                        </div>
                    </div>

                </div>

            </div>
        </>
    );
}