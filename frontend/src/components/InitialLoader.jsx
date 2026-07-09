import { useEffect, useState } from "react";
import { LoaderSpinner } from "./PageLoader";

const InitialLoader = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-white flex items-center justify-center">
      <LoaderSpinner />
    </div>
  );
};

export default InitialLoader;