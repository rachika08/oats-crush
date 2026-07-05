import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import api from "../../api/axios";

import "swiper/css";
import "swiper/css/navigation";

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [commentCounts, setCommentCounts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await api.get("/blog");
      const latest = res.data.blogs.slice(0, 4); // latest 4
      setBlogs(latest);
      fetchCommentCounts(latest);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCommentCounts = async (blogList) => {
    try {
      const results = await Promise.all(
        blogList.map((blog) =>
          api
            .get(`/blog/${blog._id}/comments`)
            .then((res) => [blog._id, res.data.comments?.length || 0])
            .catch(() => [blog._id, 0])
        )
      );
      setCommentCounts(Object.fromEntries(results));
    } catch (err) {
      console.log(err);
    }
  };

  if (blogs.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-heading text-3xl sm:text-4xl md:text-[56px] text-center mb-10 sm:mb-12">
          READ OUR LATEST BLOGS
        </h2>

        <div className="relative">
          {/* Custom nav arrows, matching FeaturedProducts / CustomizeBox */}
          <button
            className="blog-prev hidden sm:flex absolute -left-5 top-[38%] z-10 w-12 h-12 rounded-full bg-brand-orange text-white text-4xl items-center justify-center shadow-md hover:-translate-x-1 transition cursor-pointer"
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            className="blog-next hidden sm:flex absolute -right-5 top-[38%] z-10 w-12 h-12 rounded-full bg-brand-orange text-white text-4xl items-center justify-center shadow-md hover:-translate-x-1 transition cursor-pointer"
            aria-label="Next"
          >
            ›
          </button>

          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: ".blog-prev",
              nextEl: ".blog-next",
            }}
            spaceBetween={24}
            className="blog-swiper !pb-2"
            breakpoints={{
              320: { slidesPerView: 1.3 },
              640: { slidesPerView: 2.4 },
              1024: { slidesPerView: 3.3 },
            }}
          >
            {blogs.map((blog) => {
              const count = commentCounts[blog._id] ?? 0;
              const eyebrow = blog.tags?.[0] || blog.category;

              return (
                <SwiperSlide key={blog._id}>
                  <div
                    onClick={() => navigate(`/blogs/${blog._id}`)}
                    className="h-full flex flex-col bg-white border border-brand-orange/10 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-brand-orange/30 transition-all duration-300"
                  >
                    <div className="aspect-[16/9] overflow-hidden flex-shrink-0">
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="px-4 pb-4 pt-4 flex-1 flex flex-col bg-gradient-to-b from-white to-brand-orange/5">
                      {eyebrow && (
                        <span className="inline-block w-fit font-body text-[10px] font-semibold uppercase tracking-wide px-3 py-1 rounded-full bg-brand-orange/10 text-brand-orange-dark mb-2">
                          {eyebrow}
                        </span>
                      )}

                      <h3 className="font-heading uppercase text-base sm:text-lg mb-1 leading-snug">
                        {blog.title}
                      </h3>
                      <p className="font-body text-sm text-gray-500 line-clamp-2 mb-3">
                        {blog.shortDescription}
                      </p>

                      <div className="mt-auto pt-8 border-t border-brand-orange/15">
                        <span className="font-body text-xs text-gray-500">
                          {count} comment{count !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;