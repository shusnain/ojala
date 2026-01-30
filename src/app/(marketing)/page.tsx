import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Practices } from "@/components/landing/Practices";


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg font-(family-name:--font-outfit)">
      {/* Nav */}
      <div className="sticky top-0 z-50 border-b border-black bg-bg">
        <nav className="flex items-center justify-between px-6 py-4">
          <span className="border-r border-black pr-6 text-xl font-semibold text-heading">
            Ojala
          </span>
          <Link
            href="/home"
            className="rounded-none bg-heading px-4 py-2 text-sm font-medium tracking-wide text-stone-50 transition-colors hover:bg-heading/85"
          >
            Get Started
          </Link>
        </nav>
      </div>

      {/* Hero */}
      <section className="border-b border-stone-200">
        <div className="grid lg:grid-cols-2">
          {/* Left: copy */}
          <div className="flex flex-col justify-center px-6 py-14 lg:py-28 lg:pl-10 lg:pr-16">
            <p className="text-sm font-medium uppercase tracking-widest text-stone-400 font-mono">
              <span className="mr-2">&#9670;</span>AI-powered invoice auditing
            </p>
            <h1 className="mt-3 text-3xl font-medium leading-tight tracking-tight text-heading font-(family-name:--font-newsreader) sm:text-4xl lg:text-5xl">
              Your vendors are charging you more than your contract
            </h1>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-stone-600">
              Ojala helps healthcare providers stop overpaying vendors
              by automatically auditing every supply invoice against your
              contracted rates.
            </p>
            <div className="mt-8">
              <Link
                href="/home"
                className="inline-flex items-center gap-2 rounded-none border border-heading px-8 py-4 text-base font-medium text-heading transition-colors hover:bg-heading hover:text-stone-50"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right: dark panel with invoice card */}
          <div className="hidden bg-bg-dark lg:flex lg:items-center lg:justify-center lg:p-12">
            <div className="-rotate-3 bg-bg px-8 py-8 shadow-2xl font-mono text-xs w-80">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-heading">INVOICE #4847</span>
              </div>
              <div className="mt-5 border-t border-dashed border-stone-300 pt-5">
                <div className="flex justify-between">
                  <span className="text-stone-500">Vendor</span>
                  <span className="text-heading">Medline Industries</span>
                </div>
                <div className="mt-3 flex justify-between">
                  <span className="text-stone-500">Invoice Total</span>
                  <span className="text-heading">$8,432.00</span>
                </div>
                <div className="mt-3 flex justify-between">
                  <span className="text-stone-500">Contract Price</span>
                  <span className="text-heading">$7,185.00</span>
                </div>
                <div className="-mx-2 mt-4 flex justify-between bg-red-700 px-2 py-1.5">
                  <span className="font-medium text-white">Overcharge</span>
                  <span className="font-semibold text-white">+$1,247.00</span>
                </div>
              </div>
              <div className="mt-5 text-center text-xs font-semibold tracking-widest text-stone-400">
                DISPUTE DRAFTED
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The problem */}
      <section className="border-t border-stone-200 bg-bg-alt">
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
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-stone-200 bg-bg">
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
      <section className="border-t border-stone-200 bg-bg-alt">
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
            className="mt-8 inline-flex items-center gap-2 rounded-none bg-heading px-6 py-3 text-sm font-medium text-stone-50 transition-colors hover:bg-heading/85"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bg-dark">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <p className="text-sm text-stone-400">
            Ojala
          </p>
        </div>
      </footer>
    </div>
  );
}
