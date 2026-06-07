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
    const [file, setFile] = useState(null);
    const navigate= useNavigate();
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("name", form.name);
        formData.append("price", form.price);
        formData.append("stock", form.stock);
        formData.append("category", form.category);
        formData.append("description", form.description);

        formData.append("image", file);

        await api.post("/product", formData);

        navigate("/admin/products");
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Name" onChange={handleChange} />
               
                <input name="price" placeholder="Price" onChange={handleChange} />
                <input name="stock" placeholder="Stock" onChange={handleChange} />
                 <input name="description" placeholder="Description" onChange={handleChange} />
                {/* <input name="image" placeholder="Image URL" onChange={handleChange} /> */}
                <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                />
                <input name="category" placeholder="Category ID" onChange={handleChange} />

                <button type="submit">Create Product</button>
            </form>
        </div>
    )
}