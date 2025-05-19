import Image from "next/image";
import LoginForm from "../../components/form/LoginForm.jsx";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-yellow-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Decorative header */}
        <div className="bg-gradient-to-r from-pink-100 to-yellow-100 p-8 text-center relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <Image
              src="/cats/5.webp"
              alt="Background pattern"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back!</h2>
            <p className="text-pink-600 mt-2">Login to your account</p>
          </div>
        </div>

        {/* Form container */}
        <div className="p-8">
          <LoginForm  />
        </div>
      </div>
    </div>
  );
}