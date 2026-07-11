import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import AdminLayout from "./AdminLayout";
import api from "../api/axios";

const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange";

const sectionHeading =
    "font-heading text-lg text-brand-orange uppercase tracking-wide mb-4";

const addButtonClass =
    "flex items-center gap-1.5 border-2 border-brand-orange text-brand-orange font-body text-sm font-medium px-4 py-2 rounded-full cursor-pointer hover:bg-brand-orange hover:text-white transition-colors";

const removeButtonClass =
    "flex items-center gap-1 text-red-500 font-body text-sm cursor-pointer hover:text-red-600 transition-colors";

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
        <AdminLayout>
            <h1 className="font-heading text-3xl sm:text-4xl text-brand-orange mb-6">
                Add Product
            </h1>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* ---------------- NAME ---------------- */}
                    <div>
                        <label className="block mb-2 font-body text-sm font-medium">
                            Product Name
                        </label>
                        <input
                            name="name"
                            placeholder="Name"
                            value={form.name}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </div>

                    {/* ---------------- PACK SIZES ---------------- */}
                    <div>
                        <h3 className={sectionHeading}>Pack Sizes</h3>

                        <div className="space-y-3 mb-4">
                            {packSizes.map((pack, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 rounded-xl p-4 bg-gray-50"
                                >
                                    <div className="grid sm:grid-cols-3 gap-3">
                                        <input
                                            placeholder="Label"
                                            value={pack.label}
                                            onChange={(e) =>
                                                updatePack(index, "label", e.target.value)
                                            }
                                            className={inputClass}
                                        />

                                        <input
                                            type="number"
                                            placeholder="Units"
                                            value={pack.units}
                                            onChange={(e) =>
                                                updatePack(index, "units", e.target.value)
                                            }
                                            className={inputClass}
                                        />

                                        <input
                                            type="number"
                                            placeholder="Price"
                                            value={pack.price}
                                            onChange={(e) =>
                                                updatePack(index, "price", e.target.value)
                                            }
                                            className={inputClass}
                                        />
                                    </div>

                                    {packSizes.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removePack(index)}
                                            className={`${removeButtonClass} mt-3`}
                                        >
                                            <Trash2 size={14} /> Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button type="button" onClick={addPack} className={addButtonClass}>
                            Add Pack <Plus size={15} />
                        </button>
                    </div>

                    {/* ---------------- STOCK ---------------- */}
                    <div>
                        <label className="block mb-2 font-body text-sm font-medium">
                            Stock
                        </label>
                        <input
                            name="stock"
                            placeholder="Stock"
                            value={form.stock}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </div>

                    {/* ---------------- DESCRIPTION ---------------- */}
                    <div>
                        <label className="block mb-2 font-body text-sm font-medium">
                            Description
                        </label>
                        <input
                            name="description"
                            placeholder="Description"
                            value={form.description}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </div>

                    {/* ---------------- CATEGORY ---------------- */}
                    <div>
                        <label className="block mb-2 font-body text-sm font-medium">
                            Category ID (optional)
                        </label>
                        <input
                            name="category"
                            placeholder="Category ID (optional)"
                            value={form.category}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </div>

                    {/* ---------------- BENEFITS ---------------- */}
                    <div>
                        <label className="block mb-2 font-body text-sm font-medium">
                            Benefits
                        </label>
                        <input
                            name="benefits"
                            placeholder="Benefits (comma separated)"
                            value={form.benefits}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </div>



                    {/* ---------------- INGREDIENT GALLERY ---------------- */}
                    <div>
                        <h3 className={sectionHeading}>Ingredient Gallery</h3>

                        <div className="space-y-3 mb-4">
                            {ingredientGallery.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 border border-gray-200 rounded-xl p-3"
                                >
                                    {item.preview && (
                                        <img
                                            src={item.preview}
                                            alt=""
                                            className="w-14 h-14 rounded-full object-cover shrink-0"
                                        />
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => updateIngredientImage(index, e.target.files[0])}
                                        className="font-body text-sm shrink-0"
                                    />
                                    <input
                                        placeholder="Ingredient name (e.g. Cardamom)"
                                        value={item.name}
                                        onChange={(e) => updateIngredientName(index, e.target.value)}
                                        className={`${inputClass} flex-1`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeIngredient(index)}
                                        className={`${removeButtonClass} shrink-0`}
                                    >
                                        <Trash2 size={14} /> Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button type="button" onClick={addIngredient} className={addButtonClass}>
                            Add Ingredient <Plus size={15} />
                        </button>
                    </div>

                    {/* ---------------- NUTRITION ---------------- */}
                    <div>
                        <h3 className={sectionHeading}>Nutrition Information</h3>

                        <div className="space-y-3 mb-5">
                            <input
                                type="text"
                                placeholder="Serving Size (e.g. 75g)"
                                value={form.nutrition.servingSize}
                                onChange={(e) =>
                                    handleNutritionChange("servingSize", e.target.value)
                                }
                                className={inputClass}
                            />

                            <input
                                type="number"
                                placeholder="Servings Per Pack"
                                value={form.nutrition.servingsPerPack}
                                onChange={(e) =>
                                    handleNutritionChange("servingsPerPack", e.target.value)
                                }
                                className={inputClass}
                            />

                            <input
                                type="text"
                                placeholder="Note (optional)"
                                value={form.nutrition.note}
                                onChange={(e) =>
                                    handleNutritionChange("note", e.target.value)
                                }
                                className={inputClass}
                            />
                        </div>

                        <div className="space-y-3 mb-4">
                            {form.nutrition.nutrients.map((nutrient, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-2"
                                >
                                    <input
                                        placeholder="Nutrient Name"
                                        value={nutrient.name}
                                        onChange={(e) =>
                                            updateNutrient(index, "name", e.target.value)
                                        }
                                        className={inputClass}
                                    />

                                    <input
                                        type="number"
                                        placeholder="Per Serving"
                                        value={nutrient.perServing}
                                        onChange={(e) =>
                                            updateNutrient(index, "perServing", e.target.value)
                                        }
                                        className={inputClass}
                                    />

                                    <input
                                        type="number"
                                        placeholder="Per 100g"
                                        value={nutrient.per100g}
                                        onChange={(e) =>
                                            updateNutrient(index, "per100g", e.target.value)
                                        }
                                        className={inputClass}
                                    />

                                    <input
                                        placeholder="Unit (g, mg, kcal)"
                                        value={nutrient.unit}
                                        onChange={(e) =>
                                            updateNutrient(index, "unit", e.target.value)
                                        }
                                        className={inputClass}
                                    />

                                    <input
                                        type="number"
                                        placeholder="Daily Value %"
                                        value={nutrient.dailyValue}
                                        onChange={(e) =>
                                            updateNutrient(index, "dailyValue", e.target.value)
                                        }
                                        className={inputClass}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => removeNutrient(index)}
                                        className={removeButtonClass}
                                    >
                                        <Trash2 size={14} /> Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button type="button" onClick={addNutrient} className={addButtonClass}>
                            Add Nutrition <Plus size={15} />
                        </button>
                    </div>

                    {/* ---------------- MAIN IMAGE ---------------- */}
                    <div>
                        <h3 className={sectionHeading}>Main Image</h3>
                        <input
                            type="file"
                            onChange={(e) =>
                                setMainImage(e.target.files[0])
                            }
                            className={inputClass}
                        />
                    </div>

                    {/* ---------------- ADDITIONAL IMAGES ---------------- */}
                    <div>
                        <h3 className={sectionHeading}>Additional Images</h3>
                        <input
                            type="file"
                            multiple
                            onChange={(e) =>
                                setAdditionalImages(
                                    Array.from(e.target.files)
                                )
                            }
                            className={inputClass}
                        />
                    </div>



                    {/* ---------------- SUBMIT ---------------- */}
                    <button
                        type="submit"
                        className="w-full bg-brand-orange text-white font-heading text-lg py-3 rounded-full cursor-pointer hover:bg-brand-orange-dark transition-colors"
                    >
                        CREATE PRODUCT
                    </button>

                </form>
            </div>
        </AdminLayout>
    );
}