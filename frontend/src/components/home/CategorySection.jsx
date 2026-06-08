import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios"; // adjust path if needed

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/category");
      setCategories(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="py-12 px-6">
      <div className="max-w-7xl mx-auto">

        <h2 className="text-3xl font-bold mb-8 text-center">
          Shop By Category
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {categories.map((category) => (
            <div
              key={category._id}
              onClick={() => navigate(`/category/${category._id}`)}
              className="border rounded-lg p-6 text-center cursor-pointer hover:shadow-md"
            >
              <h3 className="text-lg font-semibold">
                {category.name}
              </h3>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default CategorySection;