import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    stock: "",
    description: "",
    image: "",
    category: "",
    faqs: [],
    isLaunched: true,
    nutrition: {
      servingSize: "",
      servingsPerPack: "",
      note: "",
      nutrients: []
    }
  });
  const [packSizes, setPackSizes] = useState([]);
  const [howToEnjoy, setHowToEnjoy] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/category").then((res) => setCategories(res.data)).catch(console.log);
  }, []);
  // GET product
  useEffect(() => {
    api.get(`/product/${id}`).then((res) => {
      const data = res.data;

      // setForm({
      //   name: data.name || "",
      //   price: data.price || "",
      //   stock: data.stock || "",
      //   description: data.description || "",
      //   image: data.image || "",
      //   category: data.category?._id || data.category || ""
      // });
      setForm({
        name: data.name || "",
        stock: data.stock || "",
        description: data.description || "",
        image: data.image || "",
        category: data.category?._id || data.category || "",
        faqs: data.faqs || [],
        isLaunched: data.isLaunched !== undefined ? data.isLaunched : true, // 👈 add this
        nutrition: data.nutrition || {
          servingSize: "",
          servingsPerPack: "",
          note: "",
          nutrients: []
        }
      });

      setPackSizes(
        data.packSizes || [
          {
            label: "Pack of 1",
            units: 1,
            price: ""
          }
        ]
      );
      setHowToEnjoy(data.howToEnjoy || []);
    });
  }, [id]);

  // handle change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
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

  const removeFaq = (index) => {
    const updated = form.faqs.filter((_, i) => i !== index);
    setForm({ ...form, faqs: updated });
  };
  const addMethod = () => {
    setHowToEnjoy([
      ...howToEnjoy,
      {
        title: "",
        description: "",
        icon: "glass",
      },
    ]);
  };
  // update
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   // await api.put(`/product/${id}`, form);
  //   await api.put(`/product/${id}`, {
  //       ...form,
  //       packSizes,
  //       howToEnjoy
  //   });
  //   alert("Product updated successfully");
  //   navigate('/admin/products');

  // };
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
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const payload = { ...form, packSizes, howToEnjoy };

  //   if (!payload.category) {
  //     delete payload.category; // don't send empty string — let Mongoose leave it untouched
  //   }
  //   // ensure numbers are clean
  //   payload.nutrition = {
  //     ...payload.nutrition,
  //     servingsPerPack: Number(payload.nutrition.servingsPerPack),
  //     nutrients: payload.nutrition.nutrients.map(n => ({
  //       ...n,
  //       perServing: Number(n.perServing),
  //       per100g: Number(n.per100g),
  //       dailyValue: Number(n.dailyValue),
  //     }))
  //   };
  //   try {
  //     await api.put(`/product/${id}`, payload);
  //     alert("Product updated successfully");
  //     navigate('/admin/products');
  //   } catch (error) {
  //     alert(error.response?.data?.message || "Failed to update product");
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      packSizes,
      howToEnjoy
    };

    if (!payload.category) {
      delete payload.category;
    }

    try {
      await api.put(`/product/${id}`, {
        ...payload,
        nutrition: JSON.stringify(payload.nutrition),
        faqs: JSON.stringify(payload.faqs),
        packSizes: JSON.stringify(payload.packSizes),
        howToEnjoy: JSON.stringify(payload.howToEnjoy)
      });

      alert("Product updated successfully");
      navigate("/admin/products");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to update product");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Edit Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label className="block mb-2 font-medium">
              Product Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Pack Sizes */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Pack Sizes
            </h3>

            <div className="space-y-4">
              {packSizes.map((pack, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 bg-gray-50 shadow-sm"
                >
                  <div className="grid md:grid-cols-3 gap-4">
                    <input
                      placeholder="Label"
                      value={pack.label}
                      onChange={(e) =>
                        updatePack(index, "label", e.target.value)
                      }
                      className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />

                    <input
                      type="number"
                      placeholder="Units"
                      value={pack.units}
                      onChange={(e) =>
                        updatePack(index, "units", e.target.value)
                      }
                      className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />

                    <input
                      type="number"
                      placeholder="Price"
                      value={pack.price}
                      onChange={(e) =>
                        updatePack(index, "price", e.target.value)
                      }
                      className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  {packSizes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePack(index)}
                      className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addPack}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg transition"
            >
              Add Pack
            </button>
          </div>

          {/* Stock */}
          <div>
            <label className="block mb-2 font-medium">
              Stock
            </label>
            <input
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="Stock"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          {/* Launch status */}
          <div className="flex items-center gap-3 border rounded-lg px-4 py-3 bg-gray-50">
            <input
              type="checkbox"
              id="isLaunched"
              checked={form.isLaunched}
              onChange={(e) =>
                setForm({ ...form, isLaunched: e.target.checked })
              }
              className="w-5 h-5"
            />
            <label htmlFor="isLaunched" className="font-medium cursor-pointer">
              Product is launched (visible to customers as available)
              <span className="block text-sm text-gray-500 font-normal">
                Uncheck to mark as "Coming Soon" — customers can subscribe for a launch notification.
              </span>
            </label>
          </div>
          {/* Description */}
          <div>
            <label className="block mb-2 font-medium">
              Description
            </label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block mb-2 font-medium">
              Image URL
            </label>
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="Image URL"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-2 font-medium">
              Category <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <h3 className="text-xl font-bold mt-6 mb-3">Nutrition</h3>

          <input
            placeholder="Serving Size"
            value={form.nutrition.servingSize}
            onChange={(e) =>
              handleNutritionChange("servingSize", e.target.value)
            }
            className="w-full border p-2 mb-2"
          />

          <input
            placeholder="Servings Per Pack"
            value={form.nutrition.servingsPerPack}
            onChange={(e) =>
              handleNutritionChange("servingsPerPack", e.target.value)
            }
            className="w-full border p-2 mb-2"
          />

          <input
            placeholder="Note"
            value={form.nutrition.note}
            onChange={(e) =>
              handleNutritionChange("note", e.target.value)
            }
            className="w-full border p-2 mb-3"
          />

          <h4 className="font-semibold mb-2">Nutrients</h4>

          {form.nutrition.nutrients.map((n, index) => (
            <div key={index} className="border p-3 mb-3">

              <input
                placeholder="Name"
                value={n.name}
                onChange={(e) =>
                  updateNutrient(index, "name", e.target.value)
                }
                className="w-full border p-2 mb-2"
              />

              <input
                type="number"
                placeholder="Per Serving"
                value={n.perServing}
                onChange={(e) =>
                  updateNutrient(index, "perServing", e.target.value)
                }
                className="w-full border p-2 mb-2"
              />

              <input
                type="number"
                placeholder="Per 100g"
                value={n.per100g}
                onChange={(e) =>
                  updateNutrient(index, "per100g", e.target.value)
                }
                className="w-full border p-2 mb-2"
              />

              <input
                placeholder="Unit"
                value={n.unit}
                onChange={(e) =>
                  updateNutrient(index, "unit", e.target.value)
                }
                className="w-full border p-2 mb-2"
              />

              <input
                type="number"
                placeholder="Daily Value %"
                value={n.dailyValue}
                onChange={(e) =>
                  updateNutrient(index, "dailyValue", e.target.value)
                }
                className="w-full border p-2 mb-2"
              />

              <button
                type="button"
                onClick={() => removeNutrient(index)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addNutrient}
            className="bg-blue-500 text-white px-3 py-2 rounded"
          >
            + Add Nutrient
          </button>
          <div className="mt-6">
            <h3 className="font-bold mb-2">FAQs</h3>

            {form.faqs.map((faq, index) => (
              <div key={index} className="mb-4 border p-3 rounded-lg">

                {/* Question */}
                <input
                  type="text"
                  placeholder="Question"
                  value={faq.question}
                  onChange={(e) => {
                    const updated = [...form.faqs];
                    updated[index].question = e.target.value;
                    setForm({ ...form, faqs: updated });
                  }}
                  className="border p-2 w-full mb-2"
                />

                {/* Answer */}
                <input
                  type="text"
                  placeholder="Answer"
                  value={faq.answer}
                  onChange={(e) => {
                    const updated = [...form.faqs];
                    updated[index].answer = e.target.value;
                    setForm({ ...form, faqs: updated });
                  }}
                  className="border p-2 w-full"
                />

                {/* Remove button */}
                {form.faqs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFaq(index)}
                    className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Remove FAQ
                  </button>
                )}
              </div>
            ))}

            {/* Add FAQ button */}
            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  faqs: [
                    ...form.faqs,
                    { question: "", answer: "" }
                  ],
                })
              }
              className="bg-black text-white px-3 py-2 mt-2 rounded"
            >
              + Add FAQ
            </button>
          </div>
          <h3 className="text-xl font-bold mt-6 mb-4">
            How To Enjoy
          </h3>

          {howToEnjoy.map((method, index) => (
            <div key={index} className="border p-4 rounded mb-4">

              <input
                type="text"
                placeholder="Method Title"
                value={method.title}
                onChange={(e) => {
                  const updated = [...howToEnjoy];
                  updated[index].title = e.target.value;
                  setHowToEnjoy(updated);
                }}
                className="w-full border p-2 mb-3"
              />

              <textarea
                placeholder="Instructions"
                value={method.description}
                onChange={(e) => {
                  const updated = [...howToEnjoy];
                  updated[index].description = e.target.value;
                  setHowToEnjoy(updated);
                }}
                className="w-full border p-2 mb-3"
              />

              <select
                value={method.icon}
                onChange={(e) => {
                  const updated = [...howToEnjoy];
                  updated[index].icon = e.target.value;
                  setHowToEnjoy(updated);
                }}
                className="w-full border p-2"
              >
                <option value="moon">Moon</option>
                <option value="glass">Glass</option>
                <option value="snowflake">Snowflake</option>
                <option value="coffee">Coffee</option>
                <option value="blender">Blender</option>
                <option value="bowl">Bowl</option>
                <option value="icecream">Ice Cream</option>
              </select>

            </div>
          ))}

          <button
            type="button"
            onClick={addMethod}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Add Method
          </button>
          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
}