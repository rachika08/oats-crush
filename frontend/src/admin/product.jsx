import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router";

export default function Products() {
    const [products, setProducts] = useState([]);
    const navigate=useNavigate();
    const fetchProducts = async () => {
        const res = await api.get("/product");
        setProducts(res.data);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const deleteProduct = async (id) => {
        await api.delete(`/product/${id}`);
        fetchProducts(); // refresh list
    };

    return (
        <div>
            <h1 className="text-2xl font-bold">Admin Products</h1>

            <button onClick={()=>{
                navigate('/admin/add-product')
            }} className="bg-green-500 text-white px-4 py-2 my-3">
                + Add Product
            </button>

            <table className="w-full border">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Category</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map((p) => (
                        <tr key={p._id} className="border-t">
                            <td>{p.name}</td>
                            <td>{p.price}</td>
                            <td>{p.stock}</td>
                            <td>{p.category?.name}</td>

                            <td>
                                <button
                                    className="bg-blue-500 text-white px-2"
                                    onClick={() => navigate(`/admin/edit/${p._id}`)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="bg-red-500 text-white px-2 ml-2"
                                    onClick={() => deleteProduct(p._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


