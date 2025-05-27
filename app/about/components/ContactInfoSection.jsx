import {ContactCard} from './ContactCard';
export function ContactInfoSection({ contactInfo }) {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contactInfo.map((info, index) => (
            <ContactCard key={index} info={info} />
          ))}
        </div>
      </div>
    </div>
  );
}