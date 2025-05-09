// pages/404.js

import Link from "next/link";

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <p className="mt-4 text-xl text-gray-700">Oops! Page not found.</p>
      <p className="mb-6 text-gray-500">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/" className="text-blue-500 hover:underline">
        Go back home →
      </Link>
    </div>
  );
}
