import Image from "next/image";
import Link from "next/link";
export function TeamMemberCard({ member }) {
  return (
    <div className="overflow-hidden transition-all duration-300 bg-white shadow-lg rounded-xl hover:shadow-xl hover:-translate-y-2">
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
        <h3 className="mb-1 text-2xl font-bold text-gray-900">{member.name}</h3>
        <p className="mb-4 font-medium text-pink-600">{member.role}</p>
        <p className="mb-5 text-gray-600">{member.bio}</p>
        <div className="flex justify-center space-x-4">
          {member.socials.map((social, index) => (
            <Link key={index} href={social.link} className="text-gray-500 transition-colors duration-300 hover:text-pink-600">
              {social.icon}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}