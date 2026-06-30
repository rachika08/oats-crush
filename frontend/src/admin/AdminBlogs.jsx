import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api/axios.js';

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await api.get("/blog");
      setBlogs(res.data.blogs);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/blog/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchBlogs();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-6">

      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">
          Blog Management
        </h1>

        <button
          onClick={() => navigate("/admin/blogs/add")}
          className="bg-orange-500 text-white px-4 py-2 rounded"
        >
          Add Blog
        </button>
      </div>

      <div className="overflow-x-auto">

        <table className="w-full border">

          <thead>
            <tr className="bg-gray-100">
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Author</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {blogs.map((blog) => (
              <tr key={blog._id} className="text-center border-b">

                <td>
                  <img
                    src={blog.coverImage}
                    alt=""
                    className="w-20 h-20 object-cover mx-auto"
                  />
                </td>

                <td>{blog.title}</td>

                <td>{blog.category}</td>

                <td>{blog.author}</td>

                <td>

                  <button
                    onClick={() =>
                      navigate(`/admin/blogs/edit/${blog._id}`)
                    }
                    className="mr-3 text-blue-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default AdminBlogs;