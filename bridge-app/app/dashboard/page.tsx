
const requests = [
  {
    id: "BTH-001",
    client: "Demo Client A",
    service: "Housing Search",
    status: "New",
  },
  {
    id: "BTH-002",
    client: "Demo Client B",
    service: "Document Readiness",
    status: "In Progress",
  },
  {
    id: "BTH-003",
    client: "Demo Client C",
    service: "Relocation Assistance",
    status: "Follow-Up",
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-emerald-900 p-8 text-white">
        <h1 className="text-3xl font-bold">
          Bridge to Housing
        </h1>
        <p className="mt-2">Housing Specialist Dashboard</p>
        <p className="mt-2 text-sm">
          Connecting People. Removing Barriers. Building Stability.
        </p>
      </header>

      <div className="mx-auto max-w-6xl space-y-8 p-6">
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm">
          DEMONSTRATION ONLY — All clients and requests shown here
          are fictional. Do not enter real client information.
          This dashboard is not secured for client records.
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            ["Total Requests", "3"],
            ["New Requests", "1"],
            ["In Progress", "1"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border bg-white p-6 shadow-sm"
            >
              <p className="text-sm text-slate-600">{label}</p>
              <p className="mt-2 text-3xl font-bold">{value}</p>
            </div>
          ))}
        </section>

        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Client Assistance Requests</h2>
          <p className="mt-2 text-sm text-slate-600">
            Sample requests for testing your dashboard.
          </p>

          <div className="mt-5 space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="rounded-lg border p-4"
              >
                <p className="font-semibold">{request.client}</p>
                <p className="text-sm">Request: {request.id}</p>
                <p className="text-sm">Service: {request.service}</p>
                <p className="mt-2 text-sm font-semibold text-emerald-800">
                  Status: {request.status}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Housing Services</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {[
              "Housing Search & Placement",
              "Rapid Rehousing Support",
              "Document Readiness",
              "Relocation Assistance",
              "211 / CAN Referrals",
              "Community Resource Connections",
            ].map((service) => (
              <div
                key={service}
                className="rounded-lg bg-emerald-50 p-4 font-medium"
              >
                {service}
              </div>
            ))}
          </div>
        </section>

        <a
          href="/"
          className="inline-block text-emerald-800 underline"
        >
          ← Back to Home
        </a>
      </div>
    </main>
  );
}
