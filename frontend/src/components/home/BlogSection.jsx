// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation } from "swiper/modules";

// import "swiper/css";
// import "swiper/css/navigation";

// // Placeholder data — swap with real blog posts once available.
// const blogs = [
//   {
//     id: 1,
//     title: "BLOG #1",
//     info: "blog info",
//     image: "/images/banner1.png",
//   },
//   {
//     id: 2,
//     title: "BLOG #2",
//     info: "blog info",
//     image: "/images/banner2.png",
//   },
//   {
//     id: 3,
//     title: "BLOG #3",
//     info: "blog info",
//     image: "/images/banner3.png",
//   },
//   {
//     id: 4,
//     title: "BLOG #4",
//     info: "blog info",
//     image: "/images/banner4.jpg",
//   },
// ];

// const BlogSection = () => {
//   return (
//     <section className="py-16 sm:py-20 px-4 sm:px-6">
//       <div className="max-w-7xl mx-auto">
//         <h2 className="font-heading text-3xl sm:text-4xl md:text-[56px] text-center mb-10 sm:mb-12">
//           READ OUR LATEST BLOGS
//         </h2>

//         <div className="relative">
//           {/* Custom nav arrows, large circular orange */}
//           <button
//             className="blog-prev text-white text-4xl hidden sm:flex absolute -left-5 top-[38%] z-10 w-12 h-12 rounded-full bg-brand-orange text-white items-center justify-center shadow-md hover:-translate-x-1 transition cursor-pointer"
//             aria-label="Previous"
//           >
//             ‹
//           </button>
//           <button
//             className="blog-next  text-white text-4xl hidden sm:flex absolute -right-5 top-[38%] z-10 w-12 h-12 rounded-full bg-brand-orange text-white items-center justify-center shadow-md hover:-translate-x-1 transition cursor-pointer"
//             aria-label="Next"
//           >
//             ›
//           </button>

//           <Swiper
//             modules={[Navigation]}
//             navigation={{
//               prevEl: ".blog-prev",
//               nextEl: ".blog-next",
//             }}
//             spaceBetween={24}
//             breakpoints={{
//               320: { slidesPerView: 1.1 },
//               640: { slidesPerView: 2.1 },
//               1024: { slidesPerView: 3 },
//             }}
//           >
//             {blogs.map((blog) => (
//               <SwiperSlide key={blog.id}>
//                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition">
//                   <div className="aspect-[4/3] m-3 rounded-xl overflow-hidden">
//                     <img
//                       src={blog.image}
//                       alt={blog.title}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>

//                   <div className="px-4 pb-4">
//                     <h3 className="font-heading text-base sm:text-lg mb-1">
//                       {blog.title}
//                     </h3>
//                     <p className="font-body text-sm text-gray-500">
//                       {blog.info}
//                     </p>
//                   </div>
//                 </div>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default BlogSection;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import api from "../../api/axios";

import "swiper/css";
import "swiper/css/navigation";

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await api.get("/blog");
      setBlogs(res.data.blogs.slice(0, 4)); // latest 4
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="py-16 px-4">
      <h2 className="text-center text-3xl font-bold mb-10">
        READ OUR LATEST BLOGS
      </h2>

      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={20}
        breakpoints={{
          320: { slidesPerView: 1.1 },
          640: { slidesPerView: 2.1 },
          1024: { slidesPerView: 3 },
        }}
      >
        {blogs.map((blog) => (
          <SwiperSlide key={blog._id}>
            <div
              onClick={() => navigate(`/blogs/${blog._id}`)}
              className="cursor-pointer bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={blog.coverImage}
                className="h-48 w-full object-cover"
                alt={blog.title}
              />

              <div className="p-4">
                <h3 className="font-semibold text-lg">
                  {blog.title}
                </h3>

                <p className="text-gray-500 text-sm">
                  {blog.shortDescription}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default BlogSection;