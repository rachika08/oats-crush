import {useNavigate} from "react-router-dom";
import {useState,useEffect} from 'react';
import api from '../api/axios.js';
import Navbar from "../components/Navbar";

export default function AdminOrders() {
    const [orders,setOrders]=useState([]);
    const [loading,setLoading]=useState(true);
    const navigate=useNavigate();
    useEffect(()=>{
        fetchOrder();
    },[]);
    const fetchOrder=async()=>{
        try{
            const res=await api.get("/admin/orders");
            console.log(res);
            setOrders(res.data);
        }catch(error){
            console.log(error)
        }finally{
            setLoading(false);
        }
    }
    if (loading) 
    {
        return (
            <>
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-10">
                    <h3 className="text-xl font-semibold">
                        Loading...
                    </h3>
                </div>
                
            </>
        );
    };

    
    return(
        <>
        <Navbar/>
        <div className="max-w-7xl mx-auto px-4 py-10">
                <h2 className="text-3xl font-bold mb-6">
                    All Orders
                </h2>

                {orders.length === 0 ? (
                    <div className="bg-blue-100 text-blue-800 border border-blue-200 rounded-lg p-4">
                        No orders found.
                    </div>
                ) : (
                    orders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4"
                        >
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h5 className="text-lg font-semibold mb-1">
                                            Order #{order._id.slice(-6)}
                                        </h5>

                                        
                                    </div>

                                    <span className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full">
                                        {order.orderStatus}
                                    </span>
                                </div>

                                <div className="mb-3">
                                    <strong>
                                        Customer Name:
                                    </strong>{" "}
                                    {order.user?.name || "Deleted User"}
                                </div>

                                <div className="mb-3">
                                    <strong>
                                        Total Amount:
                                    </strong>{" "}
                                    ₹{order.totalAmount}
                                </div>
                                <div className="mb-3">
                                    <small className="text-gray-500">
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleDateString()}
                                        </small>
                                </div>
                                <button
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                                    onClick={() =>
                                        navigate(
                                            `/admin/orders/${order._id}`
                                        )
                                    }
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    )
    

}