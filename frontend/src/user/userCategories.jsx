import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function UserCategories() {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await api.get("/category");
            setCategories(res.data);
        };

        fetchCategories();
    }, []);

    const handleClick = (id) => {
        navigate(`/category/${id}`);
    };

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Categories</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((cat) => (
                    <div
                        key={cat._id}
                        onClick={() => handleClick(cat._id)}
                        className="border p-4 cursor-pointer hover:bg-gray-100 rounded"
                    >
                        {cat.name}
                    </div>
                ))}
            </div>
        </div>
    );
}