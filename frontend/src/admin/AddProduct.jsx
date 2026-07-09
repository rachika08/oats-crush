
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
        ingredients: "",
        nutrition: {
            servingSize: "",
            servingsPerPack: "",
            note: "",
            nutrients: []
        }
    });

    const [mainImage, setMainImage] = useState(null);
    const [additionalImages, setAdditionalImages] = useState([]);
    const [ingredientGallery, setIngredientGallery] = useState([]);
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
        if (form.category) {
            formData.append("category", form.category);
        }
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
        // formData.append(
        //     "nutrition",
        //     JSON.stringify(form.nutrition)
        // );
        const formattedNutrition = {
            ...form.nutrition,
            servingsPerPack: Number(form.nutrition.servingsPerPack),
            nutrients: form.nutrition.nutrients.map(n => ({
                ...n,
                perServing: Number(n.perServing),
                per100g: Number(n.per100g),
                dailyValue: Number(n.dailyValue)
            }))
        };

        formData.append(
            "nutrition",
            JSON.stringify(formattedNutrition)
        );

        formData.append("image", mainImage);

        additionalImages.forEach((image) => {
            formData.append("additionalImages", image);
        });

        const validIngredients = ingredientGallery.filter(
            (item) => item.file && item.name.trim()
        );

        validIngredients.forEach((item) => {
            formData.append("ingredientImages", item.file);
        });

        formData.append(
            "ingredientNames",
            JSON.stringify(validIngredients.map((item) => item.name))
        );

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

    const addIngredient = () => {
    setIngredientGallery([
        ...ingredientGallery,
        { file: null, name: "", preview: null }
    ]);
};

const updateIngredientName = (index, value) => {
    const updated = [...ingredientGallery];
    updated[index].name = value;
    setIngredientGallery(updated);
};

const updateIngredientImage = (index, file) => {
    const updated = [...ingredientGallery];
    updated[index].file = file;
    updated[index].preview = file ? URL.createObjectURL(file) : null;
    setIngredientGallery(updated);
};

const removeIngredient = (index) => {
    setIngredientGallery(ingredientGallery.filter((_, i) => i !== index));
};

    const handleNutritionChange = (field, value) => {
        setForm(prev => ({
            ...prev,
            nutrition: {
                ...prev.nutrition,
                [field]: value
            }
        }));
    };

    const addNutrient = () => {
        setForm(prev => ({
            ...prev,
            nutrition: {
                ...prev.nutrition,
                nutrients: [
                    ...prev.nutrition.nutrients,
                    {
                        name: "",
                        perServing: "",
                        per100g: "",
                        unit: "",
                        dailyValue: ""
                    }
                ]
            }
        }));
    };

    const updateNutrient = (index, field, value) => {
        setForm(prev => {
            const nutrients = [...prev.nutrition.nutrients];
            nutrients[index][field] = value;

            return {
                ...prev,
                nutrition: {
                    ...prev.nutrition,
                    nutrients
                }
            };
        });
    };

    const removeNutrient = (index) => {
        setForm(prev => ({
            ...prev,
            nutrition: {
                ...prev.nutrition,
                nutrients: prev.nutrition.nutrients.filter((_, i) => i !== index)
            }
        }));
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
                        placeholder="Category ID (optional)"
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
                    <h3 className="text-lg font-semibold mt-6">Ingredient Gallery</h3>

                    {ingredientGallery.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 border rounded-lg p-3">
                            {item.preview && (
                                <img
                                    src={item.preview}
                                    alt=""
                                    className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                                />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => updateIngredientImage(index, e.target.files[0])}
                                className="text-sm flex-shrink-0"
                            />
                            <input
                                placeholder="Ingredient name (e.g. Cardamom)"
                                value={item.name}
                                onChange={(e) => updateIngredientName(index, e.target.value)}
                                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => removeIngredient(index)}
                                className="text-red-500 text-sm flex-shrink-0"
                            >
                                Remove
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addIngredient}
                        className="bg-gray-800 text-white px-4 py-2 rounded"
                    >
                        Add Ingredient
                    </button>

                    <h3 className="text-lg font-semibold mt-6">Nutrition Information</h3>

                    <input
                        type="text"
                        placeholder="Serving Size (e.g. 75g)"
                        value={form.nutrition.servingSize}
                        onChange={(e) =>
                            handleNutritionChange("servingSize", e.target.value)
                        }
                        className="w-full border rounded-lg px-4 py-2"
                    />

                    <input
                        type="number"
                        placeholder="Servings Per Pack"
                        value={form.nutrition.servingsPerPack}
                        onChange={(e) =>
                            handleNutritionChange("servingsPerPack", e.target.value)
                        }
                        className="w-full border rounded-lg px-4 py-2"
                    />

                    <input
                        type="text"
                        placeholder="Note (optional)"
                        value={form.nutrition.note}
                        onChange={(e) =>
                            handleNutritionChange("note", e.target.value)
                        }
                        className="w-full border rounded-lg px-4 py-2"
                    />

                    {form.nutrition.nutrients.map((nutrient, index) => (
                        <div
                            key={index}
                            className="border rounded-lg p-4 mt-4 space-y-2"
                        >
                            <input
                                placeholder="Nutrient Name"
                                value={nutrient.name}
                                onChange={(e) =>
                                    updateNutrient(index, "name", e.target.value)
                                }
                                className="w-full border rounded-lg px-3 py-2"
                            />

                            <input
                                type="number"
                                placeholder="Per Serving"
                                value={nutrient.perServing}
                                onChange={(e) =>
                                    updateNutrient(index, "perServing", e.target.value)
                                }
                                className="w-full border rounded-lg px-3 py-2"
                            />

                            <input
                                type="number"
                                placeholder="Per 100g"
                                value={nutrient.per100g}
                                onChange={(e) =>
                                    updateNutrient(index, "per100g", e.target.value)
                                }
                                className="w-full border rounded-lg px-3 py-2"
                            />

                            <input
                                placeholder="Unit (g, mg, kcal)"
                                value={nutrient.unit}
                                onChange={(e) =>
                                    updateNutrient(index, "unit", e.target.value)
                                }
                                className="w-full border rounded-lg px-3 py-2"
                            />

                            <input
                                type="number"
                                placeholder="Daily Value %"
                                value={nutrient.dailyValue}
                                onChange={(e) =>
                                    updateNutrient(index, "dailyValue", e.target.value)
                                }
                                className="w-full border rounded-lg px-3 py-2"
                            />

                            <button
                                type="button"
                                onClick={() => removeNutrient(index)}
                                className="text-red-500"
                            >
                                Remove Nutrient
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addNutrient}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                        Add Nutrient
                    </button>

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