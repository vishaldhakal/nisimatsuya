import Image from "next/image";

export function TeamMemberCard({ member }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
      <div className="relative h-80">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
      </div>
      <div className="p-6 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{member.name}</h3>
        <p className="text-pink-600 font-medium mb-4">{member.role}</p>
        <p className="text-gray-600 mb-5">{member.bio}</p>
        <div className="flex justify-center space-x-4">
          {member.socials.map((social, index) => (
            <a key={index} href={social.link} className="text-gray-500 hover:text-pink-600 transition-colors duration-300">
              {social.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}