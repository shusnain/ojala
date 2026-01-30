const practices = [
  {
    name: "Dermatology",
    description: "Catch overcharges on biologics, surgical trays, and pathology processing fees.",
  },
  {
    name: "Dental",
    description: "Flag pricing errors on implant components, imaging supplies, and sterilization products.",
  },
  {
    name: "Orthopedics",
    description: "Reconcile high-cost implants, surgical kits, and DME against contracted rates.",
  },
  {
    name: "Ophthalmology",
    description: "Verify injectables pricing, surgical packs, and diagnostic equipment invoices.",
  },
  {
    name: "Primary Care",
    description: "Monitor vaccine costs, lab supplies, and office consumables across vendors.",
  },
  {
    name: "Veterinary",
    description: "Track pharmaceutical pricing, surgical supplies, and diagnostic reagent costs.",
  },
];

export function Practices() {
  return (
    <section className="border-t border-stone-200 bg-bg-alt">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-stone-400">
            Built for your practice
          </p>
          <h2 className="mt-4 text-3xl font-medium tracking-tight text-heading font-(family-name:--font-newsreader)">
            Invoice recovery for every specialty
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {practices.map((practice) => (
            <div
              key={practice.name}
              className="rounded-xl border border-stone-200 bg-bg p-6"
            >
              <h3 className="font-medium text-heading font-(family-name:--font-newsreader)">
                {practice.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {practice.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
