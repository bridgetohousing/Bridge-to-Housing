
"use client";

import { useState } from "react";

export default function IntakePage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-emerald-900 px-6 py-10 text-white">
        <h1 className="text-3xl font-bold">Bridge to Housing</h1>
        <p className="mt-2">Your Bridge to the Next Step</p>
      </header>

      <section className="mx-auto max-w-2xl p-6">
        <a href="/" className="text-emerald-800 underline">
          ← Back to Home
        </a>

        <h2 className="mt-8 text-3xl font-bold">
          Client Assistance Request
        </h2>

        <p className="mt-3 text-gray-600">
          Tell us what type of housing support you need.
        </p>

        <div className="mt-5 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm">
          DEMONSTRATION ONLY: Do not enter real names,
          phone numbers, addresses, or personal information.
          This form does not send or save requests yet.
        </div>

        {submitted ? (
          <div className="mt-8 rounded-xl border bg-white p-6">
            <h3 className="text-2xl font-bold text-emerald-900">
              Demo Form Completed!
            </h3>
            <p className="mt-3">
              Your test form worked. No information was submitted
              to Bridge to Housing or saved.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-5 rounded-lg bg-emerald-900 px-5 py-3 text-white"
            >
              Try Again
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <label className="block">
              <span className="font-semibold">Name (test only)</span>
              <input
                required
                placeholder="Test Client"
                className="mt-2 w-full rounded-lg border bg-white p-3"
              />
            </label>

            <label className="block">
              <span className="font-semibold">Phone (test only)</span>
              <input
                placeholder="555-0100"
                className="mt-2 w-full rounded-lg border bg-white p-3"
              />
            </label>

            <label className="block">
              <span className="font-semibold">Service Needed</span>
              <select
                required
                defaultValue=""
                className="mt-2 w-full rounded-lg border bg-white p-3"
              >
                <option value="" disabled>
                  Select a service
                </option>
                <option>Housing Search Assistance</option>
                <option>Document Readiness</option>
                <option>Homelessness Support and Referrals</option>
                <option>Relocation Assistance</option>
                <option>Rapid Rehousing Support</option>
                <option>Other Housing Support</option>
              </select>
            </label>

            <label className="block">
              <span className="font-semibold">Current Housing Situation</span>
              <select
                required
                defaultValue=""
                className="mt-2 w-full rounded-lg border bg-white p-3"
              >
                <option value="" disabled>
                  Select a situation
                </option>
                <option>Currently Housed</option>
                <option>At Risk of Losing Housing</option>
                <option>Temporarily Staying With Others</option>
                <option>Experiencing Homelessness</option>
                <option>Facing Relocation</option>
                <option>Other</option>
              </select>
            </label>

            <label className="block">
              <span className="font-semibold">
                How Can We Help? (test information only)
              </span>
              <textarea
                rows={4}
                placeholder="Describe a fictional housing need..."
                className="mt-2 w-full rounded-lg border bg-white p-3"
              />
            </label>

            <button
              type="submit"
              className="w-full rounded-lg bg-emerald-900 p-4 font-semibold text-white"
            >
              Test Intake Form
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

