import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function EditProduct() {
  const { id } = useParams();
  const navigate=useNavigate();
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    image: "",
    category: ""
  });

  // GET product
  useEffect(() => {
    api.get(`/product/${id}`).then((res) => {
      const data = res.data;

      setForm({
        name: data.name || "",
        price: data.price || "",
        stock: data.stock || "",
        description: data.description || "",
        image: data.image || "",
        category: data.category?._id || data.category || ""
      });
    });
  }, [id]);

  // handle change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // update
  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.put(`/product/${id}`, form);
    alert("Product updated successfully");
    navigate('/admin/products');

  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />

      <input name="price" value={form.price} onChange={handleChange} placeholder="Price" />

      <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" />

      <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" />

      <input name="category" value={form.category} onChange={handleChange} placeholder="Category ID" />

      <button type="submit">Update Product</button>
    </form>
  );
}