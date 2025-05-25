export default function SectionHeader({ title, subtitle, center = true }) {
  return (
    <div className={center ? "text-center mb-5" : "mb-5"}>
      <h2 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
        {title}
      </h2>
      <div className={center ? "flex justify-center" : "flex"}>
        <span className="block w-24 h-1 rounded-full bg-gradient-to-r from-pink-400 via-pink-500 to-pink-300 mb-4"></span>
      </div>
      {subtitle && (
        <p className="text-lg text-gray-700 max-w-2xl mx-auto font-medium mb-2">
          {subtitle}
        </p>
      )}
    </div>
  );
}
