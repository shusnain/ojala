export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Welcome back
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Here&apos;s an overview of your accounts.
      </p>

      {/* Placeholder cards */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Balance
          </p>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            $0.00
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Income
          </p>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            $0.00
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Expenses
          </p>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            $0.00
          </p>
        </div>
      </div>

      {/* Recent transactions placeholder */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Transactions
        </h2>
        <div className="mt-4 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            No transactions yet
          </div>
        </div>
      </div>
    </div>
  );
}
