import Link from "next/link";
import { ArrowLeft, Download, CreditCard, MoreHorizontal } from "lucide-react";

// Mock data - in a real app this would come from a database
const invoices = [
  {
    id: "INV-001",
    vendor: "Office Supplies Co",
    email: "billing@officesupplies.com",
    amount: 1250.0,
    status: "paid",
    date: "2024-01-15",
    dueDate: "2024-02-15",
    address: "123 Business Ave, Suite 100, San Francisco, CA 94102",
    items: [
      { description: "Printer Paper (Case)", quantity: 10, rate: 45.0 },
      { description: "Ink Cartridges", quantity: 5, rate: 80.0 },
      { description: "Office Chairs", quantity: 2, rate: 175.0 },
    ],
  },
  {
    id: "INV-002",
    vendor: "Cloud Services Inc",
    email: "invoices@cloudservices.com",
    amount: 3420.0,
    status: "pending",
    date: "2024-01-18",
    dueDate: "2024-02-18",
    address: "456 Tech Park, New York, NY 10001",
    items: [
      { description: "AWS Hosting (Monthly)", quantity: 1, rate: 2500.0 },
      { description: "CDN Services", quantity: 1, rate: 420.0 },
      { description: "SSL Certificates", quantity: 5, rate: 100.0 },
    ],
  },
  {
    id: "INV-003",
    vendor: "Tech Hardware Ltd",
    email: "accounts@techhardware.com",
    amount: 8900.0,
    status: "paid",
    date: "2024-01-20",
    dueDate: "2024-02-20",
    address: "789 Innovation Way, Los Angeles, CA 90001",
    items: [
      { description: "MacBook Pro 14\"", quantity: 2, rate: 2499.0 },
      { description: "Dell Monitor 27\"", quantity: 4, rate: 450.0 },
      { description: "Keyboard & Mouse Combo", quantity: 4, rate: 150.5 },
    ],
  },
  {
    id: "INV-004",
    vendor: "Marketing Agency Pro",
    email: "finance@marketingpro.com",
    amount: 2100.0,
    status: "overdue",
    date: "2024-01-10",
    dueDate: "2024-01-25",
    address: "1 Madison Ave, New York, NY 10010",
    items: [
      { description: "Social Media Campaign", quantity: 1, rate: 1200.0 },
      { description: "Content Creation", quantity: 6, rate: 150.0 },
    ],
  },
  {
    id: "INV-005",
    vendor: "Software Solutions LLC",
    email: "billing@softsolutions.com",
    amount: 5670.0,
    status: "pending",
    date: "2024-01-22",
    dueDate: "2024-02-22",
    address: "500 Software Blvd, Austin, TX 78701",
    items: [
      { description: "Enterprise License (Annual)", quantity: 1, rate: 4500.0 },
      { description: "Support Package", quantity: 1, rate: 870.0 },
      { description: "Training Sessions", quantity: 2, rate: 150.0 },
    ],
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

export default async function InvoiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = invoices.find((inv) => inv.id === id);

  if (!invoice) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Invoice not found
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            The invoice you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/invoices"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Invoices
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = invoice.items.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/invoices"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {invoice.id}
              </h1>
              <span
                className={`inline-flex rounded-full px-2 py-1 text-xs font-medium capitalize ${getStatusStyles(invoice.status)}`}
              >
                {invoice.status}
              </span>
            </div>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Received on {formatDate(invoice.date)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800">
            <Download className="h-4 w-4" />
            Download
          </button>
          {invoice.status !== "paid" && (
            <button className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100">
              <CreditCard className="h-4 w-4" />
              Pay Now
            </button>
          )}
          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Invoice Details */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
            {/* Vendor Info */}
            <div className="border-b border-gray-200 p-6 dark:border-gray-800">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                From Vendor
              </h2>
              <p className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                {invoice.vendor}
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {invoice.email}
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {invoice.address}
              </p>
            </div>

            {/* Line Items */}
            <div className="p-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Description
                    </th>
                    <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Qty
                    </th>
                    <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Rate
                    </th>
                    <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {invoice.items.map((item, index) => (
                    <tr key={index}>
                      <td className="py-4 text-sm text-gray-900 dark:text-white">
                        {item.description}
                      </td>
                      <td className="py-4 text-right text-sm text-gray-600 dark:text-gray-400">
                        {item.quantity}
                      </td>
                      <td className="py-4 text-right text-sm text-gray-600 dark:text-gray-400">
                        {formatCurrency(item.rate)}
                      </td>
                      <td className="py-4 text-right text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(item.quantity * item.rate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-800">
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Subtotal
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Tax (0%)
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {formatCurrency(0)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-medium dark:border-gray-800">
                      <span className="text-gray-900 dark:text-white">
                        Total
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {formatCurrency(invoice.amount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Info */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
            <h2 className="text-sm font-medium text-gray-900 dark:text-white">
              Payment Details
            </h2>
            <dl className="mt-4 space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600 dark:text-gray-400">
                  Amount Due
                </dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white">
                  {invoice.status === "paid"
                    ? formatCurrency(0)
                    : formatCurrency(invoice.amount)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600 dark:text-gray-400">
                  Due Date
                </dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDate(invoice.dueDate)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600 dark:text-gray-400">
                  Invoice Date
                </dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDate(invoice.date)}
                </dd>
              </div>
            </dl>
          </div>

          {/* Vendor Info Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
            <h2 className="text-sm font-medium text-gray-900 dark:text-white">
              Vendor
            </h2>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {invoice.vendor}
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {invoice.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
