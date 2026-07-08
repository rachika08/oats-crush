import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api/axios.js';

const AddBlog = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    author: "",
    category: "",
    tags: "",
  });

  const [sections, setSections] = useState([{ heading: "", content: "" }]);
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addSection = () => {
    setSections([...sections, { heading: "", content: "" }]);
  };

  const updateSection = (index, field, value) => {
    const updated = [...sections];
    updated[index][field] = value;
    setSections(updated);
  };

  const removeSection = (index) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      data.append("sections", JSON.stringify(sections));
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

        <h3 className="text-xl font-bold mt-6">Sections</h3>

        {sections.map((section, index) => (
          <div key={index} className="border rounded p-4 space-y-2 bg-gray-50">
            <input
              type="text"
              placeholder="Section Heading"
              value={section.heading}
              onChange={(e) => updateSection(index, "heading", e.target.value)}
              className="w-full border p-3"
            />

            <textarea
              placeholder="Section Content"
              rows="6"
              value={section.content}
              onChange={(e) => updateSection(index, "content", e.target.value)}
              className="w-full border p-3"
            />

            {sections.length > 1 && (
              <button
                type="button"
                onClick={() => removeSection(index)}
                className="text-red-500"
              >
                Remove Section
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addSection}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Add Section
        </button>

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