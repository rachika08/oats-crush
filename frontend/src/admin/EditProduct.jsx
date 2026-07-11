import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, X, Trash2 } from "lucide-react";
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

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [removeMainImage, setRemoveMainImage] = useState(false);
  const [existingAdditionalImages, setExistingAdditionalImages] = useState([]);

  const [form, setForm] = useState({
    name: "",
    stock: "",
    description: "",
    category: "",
    image: "", // existing Cloudinary URL
    additionalImages: [],
    faqs: [],
    isLaunched: true,
    benefits: "",
    nutrition: {
      servingSize: "",
      servingsPerPack: "",
      note: "",
      nutrients: []
    }
  });

  const [packSizes, setPackSizes] = useState([]);
  const [howToEnjoy, setHowToEnjoy] = useState([]);

  // NEW: image states
  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [existingIngredients, setExistingIngredients] = useState([]);
  const [newIngredients, setNewIngredients] = useState([]);

  // -----------------------------
  // LOAD CATEGORIES
  // -----------------------------
  useEffect(() => {
    api
      .get("/category")
      .then((res) => setCategories(res.data))
      .catch(console.log);
  }, []);

  // -----------------------------
  // LOAD PRODUCT
  // -----------------------------
  useEffect(() => {
    api.get(`/product/${id}`).then((res) => {
      const data = res.data;

      setForm({
        name: data.name || "",
        stock: data.stock || "",
        description: data.description || "",
        category: data.category?._id || data.category || "",
        image: data.image || "",
        additionalImages: data.additionalImages || [],
        faqs: data.faqs || [],
        isLaunched: data.isLaunched ?? true,
        benefits: data.benefits?.join(", ") || "",
        nutrition: data.nutrition || {
          servingSize: "",
          servingsPerPack: "",
          note: "",
          nutrients: []
        }
      });

      setExistingIngredients(data.ingredientGallery || []);
      setExistingAdditionalImages(data.additionalImages || []); // ✅ track separately
      setPackSizes(
        data.packSizes || [
          { label: "Pack of 1", units: 1, price: "" }
        ]
      );

      setHowToEnjoy(data.howToEnjoy || []);
    });
  }, [id]);

  // -----------------------------
  // BASIC HANDLER
  // -----------------------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // -----------------------------
  // PACK SIZE HANDLERS
  // -----------------------------
  const addPack = () => {
    setPackSizes([
      ...packSizes,
      { label: "", units: "", price: "" }
    ]);
  };

  const updatePack = (index, field, value) => {
    const updated = [...packSizes];
    updated[index][field] = value;
    setPackSizes(updated);
  };

  const removePack = (index) => {
    setPackSizes(packSizes.filter((_, i) => i !== index));
  };

  // -----------------------------
  // NUTRITION HANDLERS
  // -----------------------------
  const handleNutritionChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      nutrition: {
        ...prev.nutrition,
        [field]: value
      }
    }));
  };

  const addNutrient = () => {
    setForm((prev) => ({
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
    setForm((prev) => {
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
    setForm((prev) => ({
      ...prev,
      nutrition: {
        ...prev.nutrition,
        nutrients: prev.nutrition.nutrients.filter(
          (_, i) => i !== index
        )
      }
    }));
  };

  const removeExistingImage = (index) => {
    setExistingAdditionalImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingIngredient = (index) => {
    setExistingIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const addNewIngredient = () => {
    setNewIngredients([...newIngredients, { file: null, name: "", preview: null }]);
  };

  const updateNewIngredientName = (index, value) => {
    const updated = [...newIngredients];
    updated[index].name = value;
    setNewIngredients(updated);
  };

  const updateNewIngredientImage = (index, file) => {
    const updated = [...newIngredients];
    updated[index].file = file;
    updated[index].preview = file ? URL.createObjectURL(file) : null;
    setNewIngredients(updated);
  };

  const removeNewIngredient = (index) => {
    setNewIngredients(newIngredients.filter((_, i) => i !== index));
  };

  // -----------------------------
  // SUBMIT (IMPORTANT CHANGE → FORM DATA)
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("stock", form.stock);
    formData.append("description", form.description);
    formData.append("isLaunched", form.isLaunched);

    const benefitsArray = form.benefits
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);

    formData.append("benefits", JSON.stringify(benefitsArray));

    if (form.category) {
      formData.append("category", form.category);
    }

    // structured fields
    formData.append("packSizes", JSON.stringify(packSizes));
    formData.append("howToEnjoy", JSON.stringify(howToEnjoy));
    formData.append("faqs", JSON.stringify(form.faqs));
    formData.append("nutrition", JSON.stringify(form.nutrition));

    // images (ONLY if new ones selected)
    if (mainImage) {
      formData.append("image", mainImage);
    } else if (removeMainImage) {
      formData.append("removeMainImage", "true");
    }

    formData.append(
      "existingAdditionalImages",
      JSON.stringify(existingAdditionalImages)
    );

    additionalImages.forEach((file) => {
      formData.append("additionalImages", file);
    });

    formData.append(
      "existingIngredients",
      JSON.stringify(existingIngredients)
    );

    const validNewIngredients = newIngredients.filter(
      (item) => item.file && item.name.trim()
    );

    validNewIngredients.forEach((item) => {
      formData.append("ingredientImages", item.file);
    });

    formData.append(
      "newIngredientNames",
      JSON.stringify(validNewIngredients.map((item) => item.name))
    );
    try {
      await api.put(`/product/${id}`, formData);

      alert("Product updated successfully");
      navigate("/admin/products");
    } catch (err) {
      console.log(err);
      alert(
        err.response?.data?.message ||
        "Failed to update product"
      );
    }
  };

  return (
    <AdminLayout>
      <h1 className="font-heading text-3xl sm:text-4xl text-brand-orange mb-6">
        Edit Product
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
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
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
              value={form.stock}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* ---------------- LAUNCH STATUS ---------------- */}
          <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl bg-gray-50">
            <input
              type="checkbox"
              checked={form.isLaunched}
              onChange={(e) =>
                setForm({
                  ...form,
                  isLaunched: e.target.checked
                })
              }
              className="w-4 h-4 accent-brand-orange"
            />
            <label className="font-body text-sm font-medium">
              Product is launched
            </label>
          </div>

          {/* ---------------- DESCRIPTION ---------------- */}
          <div>
            <label className="block mb-2 font-body text-sm font-medium">
              Description
            </label>
            <input
              name="description"
              value={form.description}
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

          {/* ---------------- CATEGORY ---------------- */}
          <div>
            <label className="block mb-2 font-body text-sm font-medium">
              Category
            </label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* ---------------- NUTRITION ---------------- */}
          <div>
            <h3 className={sectionHeading}>Nutrition</h3>

            <div className="space-y-3 mb-5">
              <input
                placeholder="Serving Size"
                value={form.nutrition.servingSize}
                onChange={(e) =>
                  handleNutritionChange("servingSize", e.target.value)
                }
                className={inputClass}
              />

              <input
                placeholder="Servings Per Pack"
                value={form.nutrition.servingsPerPack}
                onChange={(e) =>
                  handleNutritionChange("servingsPerPack", e.target.value)
                }
                className={inputClass}
              />

              <input
                placeholder="Note"
                value={form.nutrition.note}
                onChange={(e) =>
                  handleNutritionChange("note", e.target.value)
                }
                className={inputClass}
              />
            </div>

            <h4 className="font-body text-sm font-semibold mb-3 text-gray-600">
              Nutrients
            </h4>

            <div className="space-y-3 mb-4">
              {form.nutrition.nutrients.map((n, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-2"
                >
                  <input
                    placeholder="Name"
                    value={n.name}
                    onChange={(e) =>
                      updateNutrient(index, "name", e.target.value)
                    }
                    className={inputClass}
                  />

                  <input
                    type="number"
                    placeholder="Per Serving"
                    value={n.perServing}
                    onChange={(e) =>
                      updateNutrient(index, "perServing", e.target.value)
                    }
                    className={inputClass}
                  />

                  <input
                    type="number"
                    placeholder="Per 100g"
                    value={n.per100g}
                    onChange={(e) =>
                      updateNutrient(index, "per100g", e.target.value)
                    }
                    className={inputClass}
                  />

                  <input
                    placeholder="Unit"
                    value={n.unit}
                    onChange={(e) =>
                      updateNutrient(index, "unit", e.target.value)
                    }
                    className={inputClass}
                  />

                  <input
                    type="number"
                    placeholder="Daily Value %"
                    value={n.dailyValue}
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

            {form.image && !removeMainImage && (
              <div className="relative w-32 mb-4">
                <img
                  src={form.image}
                  alt="product"
                  className="w-32 h-32 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => {
                    setRemoveMainImage(true);
                    setForm((prev) => ({ ...prev, image: "" }));
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {removeMainImage && !mainImage && (
              <p className="font-body text-sm text-gray-500 mb-3">
                Main image will be removed. Upload a new one below to replace it.
              </p>
            )}

            <input
              type="file"
              onChange={(e) => {
                setMainImage(e.target.files[0]);
                if (e.target.files[0]) setRemoveMainImage(false);
              }}
              className={inputClass}
            />
          </div>

          {/* ---------------- ADDITIONAL IMAGES ---------------- */}
          <div>
            <h3 className={sectionHeading}>Additional Images</h3>

            {existingAdditionalImages.length > 0 && (
              <div className="flex gap-3 flex-wrap mb-4">
                {existingAdditionalImages.map((img, i) => (
                  <div key={img} className="relative">
                    <img
                      src={img}
                      alt=""
                      className="w-24 h-24 object-cover rounded-xl border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(i)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <input
              type="file"
              multiple
              onChange={(e) => setAdditionalImages(Array.from(e.target.files))}
              className={inputClass}
            />
          </div>

          {/* ---------------- INGREDIENT GALLERY ---------------- */}
          <div>
            <h3 className={sectionHeading}>Ingredient Gallery</h3>

            <div className="space-y-3 mb-4">
              {existingIngredients.map((item, index) => (
                <div
                  key={`existing-${index}`}
                  className="flex items-center gap-3 border border-gray-200 rounded-xl p-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-full object-cover shrink-0"
                  />
                  <p className="flex-1 font-body text-sm">{item.name}</p>
                  <button
                    type="button"
                    onClick={() => removeExistingIngredient(index)}
                    className={`${removeButtonClass} shrink-0`}
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              ))}

              {newIngredients.map((item, index) => (
                <div
                  key={`new-${index}`}
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
                    onChange={(e) =>
                      updateNewIngredientImage(index, e.target.files[0])
                    }
                    className="font-body text-sm shrink-0"
                  />
                  <input
                    placeholder="Ingredient name"
                    value={item.name}
                    onChange={(e) =>
                      updateNewIngredientName(index, e.target.value)
                    }
                    className={`${inputClass} flex-1`}
                  />
                  <button
                    type="button"
                    onClick={() => removeNewIngredient(index)}
                    className={`${removeButtonClass} shrink-0`}
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              ))}
            </div>

            <button type="button" onClick={addNewIngredient} className={addButtonClass}>
              Add Ingredient <Plus size={15} />
            </button>
          </div>

          {/* ---------------- FAQs ---------------- */}
          <div>
            <h3 className={sectionHeading}>FAQs</h3>

            <div className="space-y-3 mb-4">
              {form.faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-2"
                >
                  <input
                    placeholder="Question"
                    value={faq.question}
                    onChange={(e) => {
                      const updated = [...form.faqs];
                      updated[index].question = e.target.value;
                      setForm({ ...form, faqs: updated });
                    }}
                    className={inputClass}
                  />

                  <input
                    placeholder="Answer"
                    value={faq.answer}
                    onChange={(e) => {
                      const updated = [...form.faqs];
                      updated[index].answer = e.target.value;
                      setForm({ ...form, faqs: updated });
                    }}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  faqs: [...form.faqs, { question: "", answer: "" }]
                })
              }
              className={addButtonClass}
            >
              Add FAQ <Plus size={15} />
            </button>
          </div>

          {/* ---------------- HOW TO ENJOY ---------------- */}
          <div>
            <h3 className={sectionHeading}>How To Enjoy</h3>

            <div className="space-y-3 mb-4">
              {howToEnjoy.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-2"
                >
                  <input
                    placeholder="Title"
                    value={item.title}
                    onChange={(e) => {
                      const updated = [...howToEnjoy];
                      updated[index].title = e.target.value;
                      setHowToEnjoy(updated);
                    }}
                    className={inputClass}
                  />

                  <textarea
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => {
                      const updated = [...howToEnjoy];
                      updated[index].description = e.target.value;
                      setHowToEnjoy(updated);
                    }}
                    className={inputClass}
                  />

                  <select
                    value={item.icon}
                    onChange={(e) => {
                      const updated = [...howToEnjoy];
                      updated[index].icon = e.target.value;
                      setHowToEnjoy(updated);
                    }}
                    className={inputClass}
                  >
                    <option value="glass">Glass</option>
                    <option value="coffee">Coffee</option>
                    <option value="moon">Moon</option>
                    <option value="snowflake">Snowflake</option>
                    <option value="blender">Blender</option>
                  </select>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                setHowToEnjoy([
                  ...howToEnjoy,
                  { title: "", description: "", icon: "glass" }
                ])
              }
              className={addButtonClass}
            >
              Add Method <Plus size={15} />
            </button>
          </div>

          {/* ---------------- SUBMIT ---------------- */}
          <button
            type="submit"
            className="w-full bg-brand-orange text-white font-heading text-lg py-3 rounded-full cursor-pointer hover:bg-brand-orange-dark transition-colors"
          >
            UPDATE PRODUCT
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}