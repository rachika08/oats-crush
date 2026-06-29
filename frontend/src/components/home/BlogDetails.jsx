import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

const BlogDetails = () => {
    const { id } = useParams();

    const [blog, setBlog] = useState(null);
    const [comments, setComments] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    useEffect(() => {
        fetchBlog();
        fetchComments();
    }, []);

    const fetchBlog = async () => {
        const res = await api.get(`/blog/${id}`);
        setBlog(res.data.blog);
    };
    const fetchComments = async () => {
        const res = await api.get(`/blog/${id}/comments`);
        setComments(res.data.comments);
    };
    if (!blog) return <div className="p-10">Loading...</div>;
    const handleSubmitComment = async () => {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    await api.post(
      `/blog/${id}/comments`,
      {
        name: user?.name,
        comment,
        rating,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setComment("");
    setRating(5);

    fetchComments(); // refresh comments

  } catch (err) {
    console.log(err);
  }
};
    return (
        <div className="max-w-4xl mx-auto px-4 py-10">

            <img
                src={blog.coverImage}
                className="w-full h-80 object-cover rounded-xl"
            />

            <h1 className="text-4xl font-bold mt-6">
                {blog.title}
            </h1>

            <p className="text-gray-500 mt-2">
                By {blog.author} • {blog.category}
            </p>

            <p className="mt-6 text-lg leading-7">
                {blog.content}
            </p>
            <div className="mt-10">

                <h2 className="text-2xl font-bold mb-4">
                    Comments
                </h2>

                {comments.length === 0 && (
                    <p className="text-gray-500">No comments yet</p>
                )}

                {comments.map((c) => (
                    <div
                        key={c._id}
                        className="border p-4 rounded mb-3"
                    >

                        <div className="flex justify-between">
                            <h4 className="font-semibold">
                                {c.name}
                            </h4>

                            <span>
                                {"⭐".repeat(c.rating)}
                            </span>
                        </div>

                        <p className="text-gray-600 mt-2">
                            {c.comment}
                        </p>

                    </div>
                ))}

            </div>
            <div className="mt-8 border-t pt-6">

  <h3 className="text-xl font-bold mb-3">
    Add Comment
  </h3>

  {/* Rating */}
  <select
    value={rating}
    onChange={(e) => setRating(e.target.value)}
    className="border p-2 mb-3"
  >
    <option value="5">5 ⭐</option>
    <option value="4">4 ⭐</option>
    <option value="3">3 ⭐</option>
    <option value="2">2 ⭐</option>
    <option value="1">1 ⭐</option>
  </select>

  {/* Comment box */}
  <textarea
    value={comment}
    onChange={(e) => setComment(e.target.value)}
    placeholder="Write your comment..."
    className="w-full border p-3 mb-3"
  />

  <button
    onClick={handleSubmitComment}
    className="bg-orange-500 text-white px-4 py-2 rounded"
  >
    Submit Comment
  </button>

</div>
        </div>
    );
};

export default BlogDetails;