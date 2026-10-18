export default function Home() {

  return (

    <main className="min-h-screen bg-white text-gray-900">

      <header className="bg-emerald-900 p-8 text-white">

        <h1 className="text-4xl font-bold">

          Bridge to Housing

        </h1>

        <p className="mt-3">

          Connecting People. Removing Barriers.

          Building Stability.

        </p>

      </header>

      <section className="p-8">

        <h2 className="text-3xl font-bold">

          Your Bridge to the Next Step

        </h2>

        <p className="mt-4">

          We help individuals and families overcome

          housing barriers and connect with resources

          that support housing stability.

        </p>

        <h2 className="mt-10 text-2xl font-bold">

          Our Services

        </h2>

        <div className="mt-5 space-y-4">

          {[

            "Housing Search Assistance",

            "Document Readiness",

            "Homelessness Support & Referrals",

            "Relocation Assistance",

            "Community Resource Connections",

          ].map((service) => (

            <div

              key={service}

              className="rounded-xl border p-5 shadow-sm"

            >

              <p className="font-semibold">{service}</p>

            </div>

          ))}

        </div>

      </section>

      <footer className="bg-emerald-900 p-6 text-center text-white">

        Bridge to Housing © 2026

      </footer>

    </main>

  );

}
