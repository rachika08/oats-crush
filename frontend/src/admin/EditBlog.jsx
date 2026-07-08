import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from '../api/axios.js';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    author: "",
    category: "",
    tags: "",
  });

  const [sections, setSections] = useState([{ heading: "", content: "" }]);
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchBlog = async () => {
    try {
      const res = await api.get(`/blog/${id}`);

      const blog = res.data.blog;

      setFormData({
        title: blog.title || "",
        shortDescription: blog.shortDescription || "",
        author: blog.author || "",
        category: blog.category || "",
        tags: blog.tags?.join(",") || "",
      });

      // Old blogs only have a plain `content` string with no sections yet —
      // drop it into a single section so it's editable here instead of lost.
      if (blog.sections?.length > 0) {
        setSections(blog.sections);
      } else if (blog.content) {
        setSections([{ heading: "", content: blog.content }]);
      }

      setPreviewImage(blog.coverImage || "");
    } catch (error) {
      console.log(error);
      alert("Failed to fetch blog");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
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

      if (image) {
        data.append("image", image);
      }

      await api.put(`/blog/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Blog updated successfully");

      navigate("/admin/blogs");
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
          "Failed to update blog"
      );
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-8">
        Edit Blog
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <input
          type="text"
          name="title"
          placeholder="Blog Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <textarea
          name="shortDescription"
          placeholder="Short Description"
          value={formData.shortDescription}
          onChange={handleChange}
          rows={3}
          className="w-full border p-3 rounded"
        />

<h3 className="text-xl font-bold mt-2">Sections</h3>

        {sections.map((section, index) => (
          <div key={index} className="border rounded p-4 space-y-2 bg-gray-50">
            <input
              type="text"
              placeholder="Section Heading"
              value={section.heading}
              onChange={(e) => updateSection(index, "heading", e.target.value)}
              className="w-full border p-3 rounded"
            />

            <textarea
              placeholder="Section Content"
              rows="6"
              value={section.content}
              onChange={(e) => updateSection(index, "content", e.target.value)}
              className="w-full border p-3 rounded"
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
          value={formData.author}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="tags"
          placeholder="health,oats,fitness"
          value={formData.tags}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <div>
          <label className="block mb-2 font-medium">
            Cover Image
          </label>

          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="w-48 h-48 object-cover rounded mb-4"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <button
          type="submit"
          className="bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600"
        >
          Update Blog
        </button>
      </form>
    </div>
  );
};

export default EditBlog;