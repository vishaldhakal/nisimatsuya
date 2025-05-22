import { User, Lock, Mail, Baby } from "lucide-react";

export default function SignupForm() {
  return (
    <form className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="first-name" className="text-sm font-medium text-gray-700">
            First Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="first-name"
              name="first-name"
              type="text"
              autoComplete="given-name"
              required
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
              placeholder="First"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="last-name" className="text-sm font-medium text-gray-700">
            Last Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="last-name"
              name="last-name"
              type="text"
              autoComplete="family-name"
              required
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
              placeholder="Last"
            />
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
            placeholder="••••••••"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          At least 8 characters with a number and symbol
        </p>
      </div>

      <div className="space-y-1">
        <label htmlFor="baby-dob" className="text-sm font-medium text-gray-700">
          Baby's Date of Birth (Optional)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Baby className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="baby-dob"
            name="baby-dob"
            type="date"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          required
          className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
          I agree to the <a href="#" className="text-pink-600 hover:text-pink-500">Terms</a> and <a href="#" className="text-pink-600 hover:text-pink-500">Privacy Policy</a>
        </label>
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
        >
          Create Account
        </button>
      </div>

      <div className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <button
          type="button"
          className="font-medium text-pink-600 hover:text-pink-500"
        >
          Sign in
        </button>
      </div>
    </form>
  );
}