import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Star, ChevronDown } from "lucide-react";
import api from "../../api/axios";
import Navbar from "../Navbar";
import Footer from "./Footer";
import { Reveal, RevealGroup, RevealItem } from "../Reveal";

const RATING_OPTIONS = [5, 4, 3, 2, 1];

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [rating, setRating] = useState(5);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginNotice, setLoginNotice] = useState(false);
  const [addedToCartId, setAddedToCartId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBlog();
    fetchComments();
    fetchRelatedProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchBlog = async () => {
    try {
      const res = await api.get(`/blog/${id}`);
      setBlog(res.data.blog);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await api.get(`/blog/${id}/comments`);
      setComments(res.data.comments || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const res = await api.get("/product");
      const all = res.data.products || res.data || [];
      setRelatedProducts(all.filter((p) => p.stock > 0).slice(0, 4));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitComment = async () => {
    if (!token) {
      setLoginNotice(true);
      return;
    }
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await api.post(
        `/blog/${id}/comments`,
        { name: user?.name, comment, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComment("");
      setRating(5);
      setLoginNotice(false);
      fetchComments();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAddToCart = async (product) => {
    if (!token) {
      navigate("/login");
      return;
    }

    const pack =
      product.packSizes?.find((p) => p.units === 1) || product.packSizes?.[0];
    if (!pack) return;

    try {
      const res = await api.post(
        "/cart/add",
        {
          productId: product._id,
          quantity: 1,
          pack: { label: pack.label, units: pack.units, price: pack.price },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedItems = res.data.items || [];
      localStorage.setItem("cartItems", JSON.stringify(updatedItems));
      localStorage.setItem("cartCount", updatedItems.length);
      window.dispatchEvent(new Event("cartUpdated"));

      setAddedToCartId(product._id);
      setTimeout(() => setAddedToCartId(null), 1500);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  if (!blog) {
    return (
      <>
        <Navbar />
        <div className="pt-40 pb-20 text-center font-body text-gray-500">
          Loading...
        </div>
        <Footer />
      </>
    );
  }

  const paragraphs = blog.content
    ? blog.content.split(/\n\s*\n/).filter((p) => p.trim().length > 0)
    : [];

  const formattedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      })
    : "";

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-16 sm:pb-20">
{/* Cover image */}
        <Reveal variant="subtle">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-64 sm:h-80 md:h-[420px] object-cover rounded-2xl sm:rounded-3xl"
        />
        </Reveal>

        {/* ---------------- CONTENT + STICKY SIDEBAR ---------------- */}
        {/* This grid's height = title + tags + content only. The aside's
            sticky range is bounded by this container, so it naturally stops
            being sticky once we reach the comments block below (which sits
            outside the grid, full width). */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 lg:gap-14 mt-10 sm:mt-12 items-start">
          {/* ---------------- LEFT: BLOG CONTENT ---------------- */}
<div>
            <Reveal variant="noticeable">
            <h1 className="font-heading text-3xl md:text-4xl leading-tight mb-4 uppercase">
              {blog.title}
            </h1>
            </Reveal>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4">
              <span className="font-body text-sm font-semibold text-brand-orange">
                {blog.author}
              </span>
              {formattedDate && (
                <>
                  <span className="text-brand-orange">•</span>
                  <span className="flex items-center gap-1.5 font-body text-sm text-brand-orange">
                    <Calendar size={14} />
                    {formattedDate}
                  </span>
                </>
              )}
            </div>

            {blog.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-body text-xs px-4 py-1.5 rounded-full border border-brand-orange bg-brand-orange/5 text-black"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}

<Reveal variant="subtle" delay={0.15} className="font-body text-sm sm:text-base text-gray-700 leading-relaxed space-y-6">
              {paragraphs.length > 0 ? (
                paragraphs.map((para, i) => <p key={i}>{para.trim()}</p>)
) : (
                <p>{blog.content}</p>
              )}
            </Reveal>
          </div>

          {/* ---------------- RIGHT: RELATED PRODUCTS (STICKY) ---------------- */}
          <aside className="lg:sticky lg:top-6">
            <h2 className="font-heading text-2xl sm:text-3xl mb-5">
              RELATED <span className="text-brand-orange">PRODUCTS</span>
            </h2>

<div className="space-y-5">
              {relatedProducts.length === 0 ? (
                <p className="font-body text-sm text-gray-500">
                  No products in stock right now.
                </p>
              ) : (
relatedProducts.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center gap-4 pb-5 border-b border-gray-100 last:border-0"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      onClick={() => navigate(`/product/${product._id}`)}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0 cursor-pointer bg-gray-50"
                    />

                    <div className="min-w-0 flex-1">
                      <h3
                        onClick={() => navigate(`/product/${product._id}`)}
                        className="font-heading text-sm uppercase mb-2 cursor-pointer line-clamp-2"
                      >
                        {product.name}
                      </h3>

                      <button
                        onClick={() => handleQuickAddToCart(product)}
                        className="bg-brand-orange text-white font-heading text-xs px-4 py-1.5 rounded-full hover:bg-orange-600 transition cursor-pointer"
                      >
                        {addedToCartId === product._id ? "ADDED ✓" : "ADD TO CART"}
</button>
</div>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>

        {/* ---------------- COMMENTS (FULL WIDTH, OUTSIDE THE GRID) ---------------- */}
<div className="mt-16 pt-10 border-t border-gray-200">
          <Reveal variant="subtle">
          <h2 className="font-heading text-2xl sm:text-3xl mb-1">
            YOUR <span className="text-brand-orange">COMMENTS</span>
          </h2>
          </Reveal>
          <p className="font-body text-sm text-gray-500 mb-6">
            {comments.length} comment{comments.length !== 1 ? "s" : ""}
          </p>

          {comments.length === 0 && (
            <p className="font-body text-sm text-gray-500 mb-6">
              No comments yet — be the first to share your thoughts.
            </p>
          )}

          <div className="space-y-4 mb-10">
            {comments.map((c) => (
              <div
                key={c._id}
                className="border border-gray-200 rounded-2xl p-5 sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="font-body text-sm text-gray-700 leading-relaxed">
                    {c.comment}
                  </p>

                  <div className="flex-shrink-0 text-right">
                    <div className="flex items-center gap-0.5 justify-end text-brand-orange">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          fill={i < c.rating ? "currentColor" : "none"}
                          className={i < c.rating ? "" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <p className="font-body text-xs text-gray-500 mt-1 whitespace-nowrap">
                      {c.name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ---------------- LEAVE A COMMENT ---------------- */}
          <h3 className="font-heading text-2xl sm:text-3xl mb-4">
            LEAVE A <span className="text-brand-orange">COMMENT</span>
          </h3>

          {loginNotice && (
            <p className="font-body text-sm text-red-500 mb-4">
              Please log in to leave a comment.
            </p>
          )}

          <div className="relative w-fit mb-4">
            <button
              type="button"
              onClick={() => setIsRatingOpen((prev) => !prev)}
              className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 cursor-pointer"
            >
              <Star size={16} className="text-brand-orange" fill="currentColor" />
              <span className="font-body text-sm">{rating}</span>
              <ChevronDown size={14} className="text-gray-400" />
            </button>

            {isRatingOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden z-10">
                {RATING_OPTIONS.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setRating(value);
                      setIsRatingOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-50 font-body text-sm cursor-pointer"
                  >
                    <Star size={14} className="text-brand-orange" fill="currentColor" />
                    {value}
                  </button>
                ))}
              </div>
            )}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment here"
            rows={4}
            className="w-full border border-gray-200 rounded-2xl p-4 font-body text-sm mb-4 focus:outline-none focus:border-brand-orange resize-none"
          />

          <button
            onClick={handleSubmitComment}
            disabled={isSubmitting}
            className="w-fit bg-brand-orange text-white font-heading text-l sm:text-lg px-10 py-3.5 rounded-full hover:bg-orange-600 transition disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? "POSTING..." : "POST COMMENT"}
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}