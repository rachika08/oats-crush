import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function EditProduct() {
  const { id } = useParams();
  const navigate=useNavigate();
  const [form, setForm] = useState({
    name: "",
    stock: "",
    description: "",
    image: "",
    category: ""
  });
  const [packSizes, setPackSizes] = useState([]);
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
          category: data.category?._id || data.category || ""
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

  // update
  const handleSubmit = async (e) => {
    e.preventDefault();
    // await api.put(`/product/${id}`, form);
    await api.put(`/product/${id}`, {
        ...form,
        packSizes
    });
    alert("Product updated successfully");
    navigate('/admin/products');

  };

  // return (
  //   <form onSubmit={handleSubmit}>
  //     <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />

  //     {/* <input name="price" value={form.price} onChange={handleChange} placeholder="Price" /> */}
  //     <h3>Pack Sizes</h3>

  //     {packSizes.map((pack, index) => (
  //         <div key={index} style={{
  //             border: "1px solid gray",
  //             padding: "10px",
  //             marginBottom: "10px"
  //         }}>

  //             <input
  //                 placeholder="Label"
  //                 value={pack.label}
  //                 onChange={(e) =>
  //                     updatePack(index, "label", e.target.value)
  //                 }
  //             />

  //             <input
  //                 type="number"
  //                 placeholder="Units"
  //                 value={pack.units}
  //                 onChange={(e) =>
  //                     updatePack(index, "units", e.target.value)
  //                 }
  //             />

  //             <input
  //                 type="number"
  //                 placeholder="Price"
  //                 value={pack.price}
  //                 onChange={(e) =>
  //                     updatePack(index, "price", e.target.value)
  //                 }
  //             />

  //             {packSizes.length > 1 && (
  //                 <button
  //                     type="button"
  //                     onClick={() => removePack(index)}
  //                 >
  //                     Remove
  //                 </button>
  //             )}
  //         </div>
  //     ))}

  //     <button type="button" onClick={addPack}>
  //         Add Pack
  //     </button>

  //     <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" />

  //     <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" />

  //     <input name="category" value={form.category} onChange={handleChange} placeholder="Category ID" />

  //     <button type="submit">Update Product</button>
  //   </form>
  // );
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
            Category ID
          </label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category ID"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

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