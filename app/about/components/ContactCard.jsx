export function ContactCard({ info }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
      <div className="bg-pink-100 p-3 rounded-full mb-4">
        {info.icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{info.title}</h3>
      <p className="text-gray-600">
        {info.details.map((detail, i) => (
          <span key={i}>
            {detail}
            {i < info.details.length - 1 && <br />}
          </span>
        ))}
      </p>
    </div>
  );
}