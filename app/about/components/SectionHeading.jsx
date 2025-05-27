export function SectionHeading({ badge, title, description }) {
  return (
    <div className="text-center mb-16">
      <span className="px-4 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium inline-block">
        {badge}
      </span>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{description}</p>
      )}
    </div>
  );
}