import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Categories() {
   
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [editingId, setEditingId] = useState(null);

    // GET CATEGORIES
    const fetchCategories = async () => {
        const res = await api.get("/category");
        setCategories(res.data);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    //create category
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
            await api.put(`/category/${editingId}`, { name });
            } else {
            await api.post("/category", { name });
            }

            await fetchCategories(); // wait for refresh

            setName("");
            setEditingId(null);

        } catch (err) {
            console.log(err);
        }
        };

    //edit category
    const handleEdit = (cat) => {
         console.log("EDIT CLICKED:", cat);
        setName(cat.name);
        setEditingId(cat._id);
    };

    //delete category
    const handleDelete = async (id) => {
        await api.delete(`/category/${id}`);
        fetchCategories();
    };
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Category Admin</h1>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={name}
                    placeholder="Category name"
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2"
                />

                <button className="bg-green-500 text-white px-4">
                    {editingId ? "Update" : "Add"}
                </button>
            </form>

            
            <table className="w-full border">
                <thead>
                    <tr>
                        <th className="border">Name</th>
                        <th className="border">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {categories.map((cat) => (
                        <tr key={cat._id}>
                            <td className="border p-2">{cat.name}</td>

                            <td className="border p-2">
                                <button
                                    type="button"
                                    onClick={() => handleEdit(cat)}
                                    className="bg-blue-500 text-white px-2 mr-2"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => handleDelete(cat._id)}
                                    className="bg-red-500 text-white px-2"
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




