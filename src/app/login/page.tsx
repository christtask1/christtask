import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full mx-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Login
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
          Login functionality coming soon. For now, please use the pricing page to create an account.
        </p>
        <Link 
          href="/pricing"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-center block"
        >
          Go to Pricing
        </Link>
      </div>
    </div>
  );
}
