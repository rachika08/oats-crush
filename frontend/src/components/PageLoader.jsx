export const LoaderSpinner = () => {
  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <span className="dual-ring-loader" />
      <img
        src="/images/oats-crush.webp"
        alt="Loading"
        className="w-11 h-11 object-contain absolute"
      />
    </div>
  );
};

const PageLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <LoaderSpinner />
    </div>
  );
};

export default PageLoader;