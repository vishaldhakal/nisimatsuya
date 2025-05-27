import { SectionHeading , ValueCard } from "../components";

export function ValuesSection({ values }) {
  return (
    <div className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          badge="What We Stand For"
          title="Our Core Values"
          description="These principles guide everything we do, from product selection to customer service and beyond."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <ValueCard key={index} value={value} />
          ))}
        </div>
      </div>
    </div>
  );
}