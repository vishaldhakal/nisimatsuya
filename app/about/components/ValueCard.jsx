export function ValueCard({ value }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
      <div className="mb-6 bg-pink-50 p-3 rounded-xl inline-block">{value.icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {value.title}
      </h3>
      <p className="text-gray-600">{value.description}</p>
    </div>
  );
}