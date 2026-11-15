"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type HelpRequest = {
  id: string;
  client_id: string;
  service_type: string;
  town: string | null;
  timeframe: string | null;
  preferred_contact: string | null;
  barrier_summary: string | null;
  status: string;
  created_at: string;
};

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

  const [access, setAccess] = useState<"checking" | "allowed" | "denied">("checking");
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
const [statusFilter, setStatusFilter] = useState("all");
const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    let active = true;

    async function checkAccess() {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        if (active) setAccess("denied");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const isSpecialist = !profileError && profile?.role === "specialist";
        if (active) {
setAccess(isSpecialist ? "allowed" : "denied");
      }

  if (isSpecialist && active) {
    const { data, error } = await supabase
    .from("help_requests")
    .select(
      "id, client_id, service_type, town, timeframe, preferred_contact, barrier_summary, status, created_at"
    )
    .order("created_at", { ascending: false });

  if (active && !error) {
    setHelpRequests(data ?? []);
  }
}
}


    void checkAccess();

    return () => {
      active = false;
    };
  }, []);

  if (access === "checking") {
    return <main className="p-8">Checking access...</main>;
  }

  if (access === "denied") {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">Access Restricted</h1>
        <p>This dashboard is for authorized housing specialists only.</p>
        <a href="/" className="text-emerald-800 underline">
          Back to Home
        </a>
      </main>
    );
  }


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
            ["Total Requests", helpRequests.length],
            ["New Requests", helpRequests.filter((request) => request.status === "new").length],
["In Progress", helpRequests.filter((request) => request.status === "in_progress").length],
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
  
<div className="mt-4">
  <label htmlFor="status-filter" className="mr-3 font-medium">
    Filter by Status:
  </label>
  <select
    id="status-filter"
    value={statusFilter}
    onChange={(event) => setStatusFilter(event.target.value)}
    className="rounded-lg border p-2"
  >
    <option value="all">All Requests</option>
    <option value="new">New</option>
    <option value="in_progress">In Progress</option>
    <option value="completed">Completed</option>
  </select>
</div>
{/* Search housing assistance requests */}
<div className="mt-4">
  <label htmlFor="request-search" className="mr-3 font-medium">
    Search Requests:
  </label>
  <input
    id="request-search"
    type="text"
    value={searchTerm}
    onChange={(event) => setSearchTerm(event.target.value)}
    placeholder="Search by request ID, client ID, service, or town"
    className="w-full max-w-md rounded-lg border p-2"
  />
</div>
          <p className="mt-2 text-sm text-slate-600">
Housing assistance requests submitted by clients.          </p>

         <div className="mt-5 space-y-4">
         
{helpRequests
   .filter((request) => {
    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;

    const search = searchTerm.trim().toLowerCase();

    const matchesSearch = [
      request.id,
      request.client_id,
      request.service_type,
      request.town ?? "",
    ].some((value) => value.toLowerCase().includes(search));

    return matchesStatus && matchesSearch;
  })
  .map((request) => (

              <div
                key={request.id}
                className="rounded-lg border p-4"
              >
                <p className="font-semibold">{request.client_id}</p>
                <p className="text-sm">Request: {request.id}</p>
                <p className="text-sm">Service: {request.service_type}</p>
                <p className="text-sm">Town: {request.town || "Not provided"}</p>
                <p className="text-sm">Timeframe: {request.timeframe || "Not provided"}</p>

<p className="text-sm">Preferred Contact: {request.preferred_contact || "Not provided"}</p>

<p className="text-sm">Housing Barriers: {request.barrier_summary || "Not provided"}</p>
<p className="text-sm">
  Date Submitted: {new Date(request.created_at).toLocaleDateString()}
</p>


                <p className="mt-2 text-sm font-semibold text-emerald-800">
                  Status: {request.status}
                </p>
           <select
  defaultValue={request.status}
onChange={async (event) => {
  const newStatus = event.target.value;
  const { error } = await supabase
    .from("help_requests")
    .update({ status: newStatus })
    .eq("id", request.id);

  if (error) {
    alert("Status could not be saved: " + error.message);
  } else {
    setHelpRequests((current) =>
      current.map((item) =>
        item.id === request.id ? { ...item, status: newStatus } : item
      )
    );
  }
}}  className="mt-2 rounded border p-2"
>
  <option value="new">New</option>
  <option value="in_progress">In Progress</option>
  <option value="completed">Completed</option>
</select>
<a
  href={`/requests/${request.id}`}
  className="mt-2 inline-block text-emerald-800 underline"
>
  View Case Details
</a>
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
  "Housing Choice Voucher (HCV) – Housing Quality Standards (HQS) Inspection Request",
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
