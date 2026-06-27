
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function AddProduct() {
    const [form, setForm] = useState({
        name: "",
        stock: "",
        description: "",
        category: "",
        featured: false,
        benefits: "",
        ingredients: ""
    });

    const [mainImage, setMainImage] = useState(null);
    const [additionalImages, setAdditionalImages] = useState([]);
    const [packSizes, setPackSizes] = useState([
        {
            label: "Pack of 1",
            units: 1,
            price: ""
        }
    ]);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        const formattedPackSizes = packSizes.map(pack => ({
            label: pack.label,
            units: Number(pack.units),
            price: Number(pack.price)
        }));
        formData.append("name", form.name);
        // formData.append("price", form.price);
        formData.append(
            "packSizes",
            JSON.stringify(formattedPackSizes)
        );
        formData.append("stock", form.stock);
        formData.append("description", form.description);
        formData.append("category", form.category);
        formData.append("featured", form.featured);

        const benefitsArray = form.benefits
            .split(",")
            .map(item => item.trim())
            .filter(item => item);

        const ingredientsArray = form.ingredients
            .split(",")
            .map(item => item.trim())
            .filter(item => item);

        formData.append(
            "benefits",
            JSON.stringify(benefitsArray)
        );

        formData.append(
            "ingredients",
            JSON.stringify(ingredientsArray)
        );

        formData.append("image", mainImage);

        additionalImages.forEach((image) => {
            formData.append("additionalImages", image);
        });

        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        await api.post("/product", formData);
        alert("Product created successfully");
        navigate("/admin/products");
    };
    const addPack = () => {
        setPackSizes([
            ...packSizes,
            {
                label: "",
                units: "",
                price: ""
            }
        ]);
    };

    const updatePack = (index, field, value) => {
        const updated = [...packSizes];
        updated[index][field] = value;
        setPackSizes(updated);
    };

    const removePack = (index) => {
        setPackSizes(
            packSizes.filter((_, i) => i !== index)
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Add Product
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        name="name"
                        placeholder="Name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* <input
                        name="price"
                        placeholder="Price"
                        value={form.price}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    /> */}

                    <h3>Pack Sizes</h3>

                    {packSizes.map((pack, index) => (
                        <div key={index}
                            className="border p-4 rounded-lg mb-3 space-y-2">

                            <input
                                placeholder="Label"
                                value={pack.label}
                                onChange={(e) =>
                                    updatePack(index, "label", e.target.value)
                                }
                            />

                            <input
                                type="number"
                                placeholder="Units"
                                value={pack.units}
                                onChange={(e) =>
                                    updatePack(index, "units", e.target.value)
                                }
                            />

                            <input
                                type="number"
                                placeholder="Price"
                                value={pack.price}
                                onChange={(e) =>
                                    updatePack(index, "price", e.target.value)
                                }
                            />

                            {/* <button
                                type="button"
                                onClick={() => removePack(index)}
                            >
                                Remove
                            </button> */}
                            {packSizes.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removePack(index)}
                                    className="text-red-500"
                                >
                                    Remove
                                </button>
                            )}

                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addPack}
                    >
                        Add Pack
                    </button>

                    <input
                        name="stock"
                        placeholder="Stock"
                        value={form.stock}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        name="category"
                        placeholder="Category ID"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        name="benefits"
                        placeholder="Benefits (comma separated)"
                        value={form.benefits}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        name="ingredients"
                        placeholder="Ingredients (comma separated)"
                        value={form.ingredients}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Main Image
                        </label>
                        <input
                            type="file"
                            onChange={(e) =>
                                setMainImage(e.target.files[0])
                            }
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Additional Images
                        </label>
                        <input
                            type="file"
                            multiple
                            onChange={(e) =>
                                setAdditionalImages(
                                    Array.from(e.target.files)
                                )
                            }
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={form.featured}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    featured: e.target.checked
                                })
                            }
                            className="h-4 w-4"
                        />
                        <label className="text-sm font-medium">
                            Featured Product
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
                    >
                        Create Product
                    </button>

                </form>
            </div>
        </div>
    );
}