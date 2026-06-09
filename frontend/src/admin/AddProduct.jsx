// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api/axios";

// export default function AddProduct() {
//     const [form, setForm] = useState({
//         name: "",
//         price: "",
//         stock: "",
//         description: "",
//         image: "",
//         category: "",
//         featured:false
//     });
//     const [file, setFile] = useState(null);
//     const navigate= useNavigate();
//     const handleChange = (e) => {
//         setForm({
//             ...form,
//             [e.target.name]: e.target.value
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const formData = new FormData();

//         formData.append("name", form.name);
//         formData.append("price", form.price);
//         formData.append("stock", form.stock);
//          formData.append("description", form.description);
//          formData.append("image", file);
//         formData.append("category", form.category);
//        formData.append("featured", form.featured);

        

//         await api.post("/product", formData);

//         navigate("/admin/products");
//     };

//     return (
//         <div>
//             <form onSubmit={handleSubmit}>
//                 <input name="name" placeholder="Name" onChange={handleChange} />
               
//                 <input name="price" placeholder="Price" onChange={handleChange} />
//                 <input name="stock" placeholder="Stock" onChange={handleChange} />
//                  <input name="description" placeholder="Description" onChange={handleChange} />
//                 {/* <input name="image" placeholder="Image URL" onChange={handleChange} /> */}
//                 <input
//                 type="file"
//                 onChange={(e) => setFile(e.target.files[0])}
//                 />
//                 <input name="category" placeholder="Category ID" onChange={handleChange} />
//                  <div>
//                 <label>Featured Product</label>

//                 <input
//                     type="checkbox"
//                     checked={form.featured}
//                     onChange={(e) =>
//                     setForm({
//                         ...form,
//                         featured: e.target.checked,
//                     })
//                     }
//                 />
//                 </div>
//                 <button type="submit">Create Product</button>
//             </form>
//         </div>
//     )
// }


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function AddProduct() {
    const [form, setForm] = useState({
        name: "",
        price: "",
        stock: "",
        description: "",
        category: "",
        featured: false,
        benefits: "",
        ingredients: ""
    });

    const [mainImage, setMainImage] = useState(null);
    const [additionalImages, setAdditionalImages] = useState([]);

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

        formData.append("name", form.name);
        formData.append("price", form.price);
        formData.append("stock", form.stock);
        formData.append("description", form.description);
        formData.append("category", form.category);
        formData.append("featured", form.featured);

        // Convert comma-separated text into arrays
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

        // Main image
        formData.append("image", mainImage);

        // Additional images
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

    return (
        <div>
            <form onSubmit={handleSubmit}>

                <input
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                />

                <input
                    name="price"
                    placeholder="Price"
                    value={form.price}
                    onChange={handleChange}
                />

                <input
                    name="stock"
                    placeholder="Stock"
                    value={form.stock}
                    onChange={handleChange}
                />

                <input
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                />

                <input
                    name="category"
                    placeholder="Category ID"
                    value={form.category}
                    onChange={handleChange}
                />

                <input
                    name="benefits"
                    placeholder="Benefits (comma separated)"
                    value={form.benefits}
                    onChange={handleChange}
                />

                <input
                    name="ingredients"
                    placeholder="Ingredients (comma separated)"
                    value={form.ingredients}
                    onChange={handleChange}
                />

                <div>
                    <label>Main Image</label>
                    <input
                        type="file"
                        onChange={(e) =>
                            setMainImage(e.target.files[0])
                        }
                    />
                </div>

                <div>
                    <label>Additional Images</label>
                    <input
                        type="file"
                        multiple
                        onChange={(e) =>
                            setAdditionalImages(
                                Array.from(e.target.files)
                            )
                        }
                    />
                </div>

                <div>
                    <label>Featured Product</label>

                    <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                featured: e.target.checked
                            })
                        }
                    />
                </div>

                <button type="submit">
                    Create Product
                </button>

            </form>
        </div>
    );
}