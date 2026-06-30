import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const res = await api.get("/blog");
    setBlogs(res.data.blogs);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-8">All Blogs</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <Link to={`/blogs/${blog._id}`} key={blog._id}>
            <div className="border rounded-xl overflow-hidden hover:shadow-lg transition">
              <img
                src={blog.coverImage}
                className="h-56 w-full object-cover"
              />

              <div className="p-4">
                <h2 className="font-semibold text-xl">
                  {blog.title}
                </h2>

                <p className="text-gray-600 text-sm">
                  {blog.shortDescription}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Blogs;