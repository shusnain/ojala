import Link from "next/link";
import { Upload } from "lucide-react";

// Mock data for vendor invoices
const invoices = [
  {
    id: "INV-001",
    vendor: "Office Supplies Co",
    email: "billing@officesupplies.com",
    amount: 1250.0,
    status: "paid",
    date: "2024-01-15",
  },
  {
    id: "INV-002",
    vendor: "Cloud Services Inc",
    email: "invoices@cloudservices.com",
    amount: 3420.0,
    status: "pending",
    date: "2024-01-18",
  },
  {
    id: "INV-003",
    vendor: "Tech Hardware Ltd",
    email: "accounts@techhardware.com",
    amount: 8900.0,
    status: "paid",
    date: "2024-01-20",
  },
  {
    id: "INV-004",
    vendor: "Marketing Agency Pro",
    email: "finance@marketingpro.com",
    amount: 2100.0,
    status: "overdue",
    date: "2024-01-10",
  },
  {
    id: "INV-005",
    vendor: "Software Solutions LLC",
    email: "billing@softsolutions.com",
    amount: 5670.0,
    status: "pending",
    date: "2024-01-22",
  },
];

function getStatusStyles(status: string) {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "pending":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "overdue":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function InvoicesPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Invoices
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Manage and track vendor invoices
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100">
          <Upload className="h-4 w-4" />
          Upload Invoice
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Vendor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {invoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                  <Link href={`/invoices/${invoice.id}`} className="block">
                    {formatDate(invoice.date)}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                  <Link href={`/invoices/${invoice.id}`} className="block">
                    {invoice.vendor}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                  <Link href={`/invoices/${invoice.id}`} className="block">
                    {formatCurrency(invoice.amount)}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <Link href={`/invoices/${invoice.id}`} className="block">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium capitalize ${getStatusStyles(invoice.status)}`}
                    >
                      {invoice.status}
                    </span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
