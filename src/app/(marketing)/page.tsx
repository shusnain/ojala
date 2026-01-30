import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Practices } from "@/components/landing/Practices";


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-stone-50 font-(family-name:--font-outfit)">
      {/* Nav */}
      <div className="sticky top-0 z-50 bg-stone-50">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <span className="text-xl font-semibold text-heading">
            Ojala
          </span>
          <Link
            href="/home"
            className="rounded-lg bg-heading px-4 py-2 text-sm font-medium text-stone-50 transition-colors hover:bg-heading-hover"
          >
            Talk to Founders
          </Link>
        </nav>
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pt-24 pb-20 text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-medium leading-tight tracking-tight text-heading font-(family-name:--font-newsreader) sm:text-5xl md:text-6xl">
          Your vendors are charging you more than your contract
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-stone-600">
          Ojala helps healthcare providers stop overpaying vendors
          by automatically auditing every supply invoice against your
          contracted rates.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/home"
            className="inline-flex items-center gap-2 rounded-lg bg-heading px-6 py-3 text-sm font-medium text-stone-50 transition-colors hover:bg-heading-hover"
          >
            Talk to Founders
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* The problem */}
      <section className="border-t border-stone-200 bg-stone-100">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-stone-400">
            The current state
          </p>
          <h2 className="mt-4 text-3xl font-medium tracking-tight text-heading font-(family-name:--font-newsreader)">
            Hours per dispute. Most errors just slip through.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-stone-600">
            Notice the total seems high. Pull the PO. Cross-reference line
            items. Dig up the contract. Write the email. Wait. Follow up. Get
            the credit memo. Reconcile. This takes hours. And that&apos;s when
            someone catches it at all.
          </p>
        </div>
      </section>

      <HowItWorks />
      <Practices />

      {/* Trust */}
      <section className="border-t border-stone-200">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-stone-200 bg-stone-50">
            <ShieldCheck className="h-5 w-5 text-stone-600" />
          </div>
          <h2 className="mt-6 text-3xl font-medium tracking-tight text-heading font-(family-name:--font-newsreader)">
            Built to earn trust
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-stone-600">
            Start in review mode. Approve every action. As confidence grows,
            open up autonomy per vendor, per dollar threshold. Full audit trail
            on everything.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-stone-200 bg-stone-100">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h2 className="text-3xl font-medium tracking-tight text-heading font-(family-name:--font-newsreader)">
            Stop leaving money on the table
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg leading-relaxed text-stone-600">
            Every invoice error that slips through is money lost. Ojala closes
            the loop, from detection to recovery.
          </p>
          <Link
            href="/home"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-heading px-6 py-3 text-sm font-medium text-stone-50 transition-colors hover:bg-heading-hover"
          >
            Talk to Founders
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <p className="text-sm text-stone-500">
            Ojala
          </p>
        </div>
      </footer>
    </div>
  );
}
