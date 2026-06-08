import { Truck, ShieldCheck, RotateCcw, Star } from "lucide-react";

const benefits = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Free delivery on eligible orders.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description: "Safe and encrypted transactions.",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "Hassle-free return process.",
  },
  {
    icon: Star,
    title: "Premium Quality",
    description: "Carefully selected products.",
  },
];

const BenefitsSection = () => {
  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Shop With Us?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm text-center"
              >
                <Icon size={40} className="mx-auto mb-4" />

                <h3 className="text-lg font-semibold mb-2">
                  {benefit.title}
                </h3>

                <p className="text-gray-600 text-sm">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default BenefitsSection;