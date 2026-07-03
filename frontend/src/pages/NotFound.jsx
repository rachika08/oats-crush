import { useNavigate } from "react-router-dom";
import { PackageOpen, Sparkles, Wheat, Star } from "lucide-react";
import Navbar from "../components/Navbar";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden bg-white">
        {/* Giant faded background text */}
        <h1 className="absolute font-heading text-brand-orange/10 text-[42vw] sm:text-[28vw] md:text-[380px] leading-none select-none tracking-wide">
          404
        </h1>

        {/* Foreground content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Doodle cluster */}
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 mb-6">


            <PackageOpen
              size={110}
              strokeWidth={1.5}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 text-black"
            />
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl text-black mb-3">
            OOPS... WRONG SHAKE!
          </h2>

          <p className="font-body text-sm sm:text-base text-gray-500 max-w-xs sm:max-w-sm mb-8">
            You were aiming for a page, but ended up with an empty pouch instead. Let's get you back on track.
          </p>

          <button
            onClick={() => navigate("/")}
            className="bg-black text-white rounded-full px-8 py-3 font-heading text-sm font-medium hover:bg-brand-orange transition-all duration-200 hover:-translate-y-1 shadow-md cursor-pointer"
          >
            GO HOME
          </button>
        </div>
      </section>
    </>
  );
};

export default NotFound;