import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function AddProduct() {
    const [form, setForm] = useState({
        name: "",
        price: "",
        stock: "",
        description: "",
        image: "",
        category: ""
    });
    const navigate= useNavigate();
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("SUBMIT CLICKED");
        console.log("FORM DATA:", form);
        await api.post("/product", form);
        navigate('/admin/products');
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Name" onChange={handleChange} />
               
                <input name="price" placeholder="Price" onChange={handleChange} />
                <input name="stock" placeholder="Stock" onChange={handleChange} />
                 <input name="description" placeholder="Description" onChange={handleChange} />
                <input name="image" placeholder="Image URL" onChange={handleChange} />
                <input name="category" placeholder="Category ID" onChange={handleChange} />

                <button type="submit">Create Product</button>
            </form>
        </div>
    )
}