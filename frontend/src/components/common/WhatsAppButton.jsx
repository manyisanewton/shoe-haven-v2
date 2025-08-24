import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  // Convert the local number to the international format required by WhatsApp (without '+')
  const phoneNumber = '254799425417';
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform duration-300 ease-in-out"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp size={30} />
    </a>
  );
};

export default WhatsAppButton;