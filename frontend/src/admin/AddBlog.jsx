import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api/axios.js';

const AddBlog = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    content: "",
    author: "",
    category: "",
    tags: "",
  });

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      data.append("image", image);

      await api.post("/blog", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("blog added");
      navigate("/admin/blogs");

    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to create blog");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Add Blog
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <input
          type="text"
          name="title"
          placeholder="Title"
          onChange={handleChange}
          className="w-full border p-3"
        />

        <textarea
          name="shortDescription"
          placeholder="Short Description"
          onChange={handleChange}
          className="w-full border p-3"
        />

        <textarea
          name="content"
          placeholder="Blog Content"
          rows="10"
          onChange={handleChange}
          className="w-full border p-3"
        />

        <input
          type="text"
          name="author"
          placeholder="Author"
          onChange={handleChange}
          className="w-full border p-3"
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          onChange={handleChange}
          className="w-full border p-3"
        />

        <input
          type="text"
          name="tags"
          placeholder="oats,health,fitness"
          onChange={handleChange}
          className="w-full border p-3"
        />

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button
          className="bg-orange-500 text-white px-6 py-3 rounded"
        >
          Create Blog
        </button>

      </form>

    </div>
  );
};

export default AddBlog;