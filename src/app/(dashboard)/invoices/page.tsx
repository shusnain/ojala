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
      return "bg-green-100 text-green-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "overdue":
      return "bg-red-100 text-red-700";
    default:
      return "bg-stone-100 text-stone-700";
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
          <h1 className="text-2xl font-semibold text-heading">
            Invoices
          </h1>
          <p className="mt-1 text-stone-600">
            Manage and track vendor invoices
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-heading px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-heading/90">
          <Upload className="h-4 w-4" />
          Upload Invoice
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-stone-200 bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-200">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500">
                Vendor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {invoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="cursor-pointer transition-colors hover:bg-stone-50"
              >
                <td className="whitespace-nowrap px-6 py-4 text-sm text-text">
                  <Link href={`/invoices/${invoice.id}`} className="block">
                    {formatDate(invoice.date)}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-text">
                  <Link href={`/invoices/${invoice.id}`} className="block">
                    {invoice.vendor}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-text">
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
