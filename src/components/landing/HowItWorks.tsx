import { ScanSearch, MessageSquareText, DollarSign } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Detect",
    description:
      "Invoices arrive via email, EDI, or portal. Within seconds, Ojala parses every line item, matches to the PO, cross-references contracted pricing, and flags discrepancies.",
    detail:
      "\"Invoice #4847 from Medline has 3 issues totaling $1,247\"",
    icon: ScanSearch,
  },
  {
    number: "02",
    title: "Dispute",
    description:
      "Ojala assembles the evidence, drafts a calibrated dispute, and sends it. Or queues it for your review. You choose the autonomy level.",
    detail:
      "Full auto, review queue, or high-touch. Per vendor, per threshold.",
    icon: MessageSquareText,
  },
  {
    number: "03",
    title: "Recover",
    description:
      "Follow-ups are automatic. Credit memos are matched to disputes, amounts verified, and accounting flagged for reconciliation.",
    detail: "\"Recovered $1,247 from Medline. $14,820 recovered YTD.\"",
    icon: DollarSign,
  },
];

export function HowItWorks() {
  return (
    <section className="border-t border-stone-200">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-stone-400">
            How it works
          </p>
          <h2 className="mt-4 text-3xl font-medium tracking-tight text-heading font-(family-name:--font-newsreader)">
            The full loop, automated
          </h2>
        </div>

        <ul className="mt-10">
          {steps.map((step, index) => (
            <li
              key={step.number}
              className={index < steps.length - 1 ? "border-b border-stone-200 pb-10 mb-10" : ""}
            >
              <step.icon className="h-8 w-8 text-stone-400" />
              <h3 className="mt-4 text-lg font-medium text-heading font-(family-name:--font-newsreader)">
                {step.title}
              </h3>
              <p className="mt-2 leading-relaxed text-stone-600">
                {step.description}
              </p>
              <p className="mt-3 text-sm italic text-stone-500">
                {step.detail}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
