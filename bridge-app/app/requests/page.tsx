
"use client";

import { useState } from "react";

type Status = "New" | "In Progress" | "Completed";

type Request = {
  id: number;
  client: string;
  service: string;
  status: Status;
  notes: string;
};

const initialRequests: Request[] = [
  {
    id: 1001,
    client: "Demo Client A",
    service: "Housing Search",
    status: "New",
    notes: "Needs help locating affordable housing.",
  },
  {
    id: 1002,
    client: "Demo Client B",
    service: "Document Readiness",
    status: "In Progress",
    notes: "Needs assistance obtaining identification.",
  },
  {
    id: 1003,
    client: "Demo Client C",
    service: "Housing Resources",
    status: "Completed",
    notes: "Provided demonstration resource referrals.",
  },
];

export default function RequestsPage() {
  const [requests, setRequests] = useState(initialRequests);
  const [filter, setFilter] = useState("All");

  const visibleRequests = requests.filter(
    (request) =>
      filter === "All" || request.status === filter
  );

  function updateStatus(id: number, status: Status) {
    setRequests((previous) =>
      previous.map((request) =>
        request.id === id
          ? { ...request, status }
          : request
      )
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-slate-900">
      <header className="bg-emerald-900 p-8 text-white">
        <h1 className="text-3xl font-bold">
          Bridge to Housing
        </h1>
        <p className="mt-2">Client Request Management</p>
        <p className="mt-2 text-sm">
          Connecting People. Removing Barriers.
          Building Stability.
        </p>
      </header>

      <section className="mx-auto max-w-5xl p-6">
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm">
          DEMONSTRATION ONLY: All client records are fictional.
          Do not enter real personal information.
          Changes are temporary and will reset on refresh.
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          <a href="/" className="text-emerald-800 underline">
            Home
          </a>
          <a
            href="/dashboard"
            className="text-emerald-800 underline"
          >
            Specialist Dashboard
          </a>
        </div>

        <h2 className="mt-8 text-2xl font-bold">
          Assistance Requests
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {(["New", "In Progress", "Completed"] as Status[]).map(
            (status) => (
              <div
                key={status}
                className="rounded-xl border bg-white p-5"
              >
                <p>{status}</p>
                <p className="mt-2 text-3xl font-bold">
                  {
                    requests.filter(
                      (request) => request.status === status
                    ).length
                  }
                </p>
              </div>
            )
          )}
        </div>

        <div className="mt-8">
          <label htmlFor="status-filter" className="font-semibold">
            Filter requests
          </label>
          <select
            id="status-filter"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="ml-3 rounded-lg border bg-white p-3"
          >
            <option value="All">All Requests</option>
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="mt-6 space-y-4">
          {visibleRequests.map((request) => (
            <article
              key={request.id}
              className="rounded-xl border bg-white p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold">
                {request.client}
              </h3>
              <p className="mt-2">
                <strong>Request:</strong> {request.service}
              </p>
              <p className="mt-2">
                <strong>Notes:</strong> {request.notes}
              </p>

              <div className="mt-4">
                <label
                  htmlFor={`status-${request.id}`}
                  className="font-semibold"
                >
                  Status
                </label>
                <select
                  id={`status-${request.id}`}
                  value={request.status}
                  onChange={(event) =>
                    updateStatus(
                      request.id,
                      event.target.value as Status
                    )
                  }
                  className="ml-3 rounded-lg border bg-white p-3"
                >
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </article>
          ))}

          {visibleRequests.length === 0 && (
            <p className="rounded-lg border bg-white p-5">
              No requests match this filter.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
