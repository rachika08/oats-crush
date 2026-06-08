const SubscriptionSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto text-center">

        <h2 className="text-4xl font-bold mb-4">
          Never Run Out Of Your Favorites
        </h2>

        <p className="text-gray-600 mb-8">
          Subscribe and receive your products automatically every month.
          Enjoy exclusive discounts and priority delivery.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">

          <div className="border rounded-lg p-6 w-64">
            <h3 className="text-xl font-semibold mb-2">
              Monthly Plan
            </h3>

            <p className="text-gray-600 mb-4">
              Save 10% on every order
            </p>

            <button className="px-5 py-2 bg-black text-white rounded">
              Subscribe
            </button>
          </div>

          <div className="border rounded-lg p-6 w-64">
            <h3 className="text-xl font-semibold mb-2">
              Quarterly Plan
            </h3>

            <p className="text-gray-600 mb-4">
              Save 15% on every order
            </p>

            <button className="px-5 py-2 bg-black text-white rounded">
              Subscribe
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};

export default SubscriptionSection;