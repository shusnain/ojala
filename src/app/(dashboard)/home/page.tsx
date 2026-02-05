export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-heading">
        Welcome back
      </h1>
      <p className="mt-2 text-stone-600">
        Here&apos;s an overview of your accounts.
      </p>

      {/* Placeholder cards */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <p className="text-sm font-medium text-stone-500">
            Total Balance
          </p>
          <p className="mt-2 text-3xl font-semibold text-heading">
            $0.00
          </p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <p className="text-sm font-medium text-stone-500">
            Income
          </p>
          <p className="mt-2 text-3xl font-semibold text-heading">
            $0.00
          </p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <p className="text-sm font-medium text-stone-500">
            Expenses
          </p>
          <p className="mt-2 text-3xl font-semibold text-heading">
            $0.00
          </p>
        </div>
      </div>

      {/* Recent transactions placeholder */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-heading">
          Recent Transactions
        </h2>
        <div className="mt-4 rounded-xl border border-stone-200 bg-white">
          <div className="p-12 text-center text-stone-500">
            No transactions yet
          </div>
        </div>
      </div>
    </div>
  );
}
