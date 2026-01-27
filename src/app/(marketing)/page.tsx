import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <h1 className="text-5xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Ojala
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Banking for startups
        </p>
        <Link
          href="/home"
          className="mt-8 inline-block rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
