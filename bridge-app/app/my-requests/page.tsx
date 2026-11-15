
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type HelpRequest = {
  id: string;
  service_type: string | null;
  town: string | null;
  timeframe: string | null;
  status: string | null;
  created_at: string;
};

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadRequests() {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError || !authData.user) {
        if (active) {
          setMessage("Please sign in to view your requests.");
          setLoading(false);
        }
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authData.user.id)
        .single();

      if (profileError || profile?.role !== "client") {
        if (active) {
          setMessage("This page is for client accounts only.");
          setLoading(false);
        }
        return;
      }

      const { data, error } = await supabase
        .from("help_requests")
        .select(
          "id, service_type, town, timeframe, status, created_at"
        )
        .eq("client_id", authData.user.id)
        .order("created_at", { ascending: false });

      if (!active) return;

      if (error) {
        setMessage("Unable to load requests: " + error.message);
      } else {
        setRequests(data ?? []);
      }

      setLoading(false);
    }

    void loadRequests();

    return () => {
      active = false;
    };
  }, []);

  function displayStatus(status: string | null) {
    switch (status) {
      case "new":
        return "New";
      case "in_progress":
        return "In Progress";
      case "completed":
        return "Completed";
      default:
        return status || "Not Available";
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-emerald-900">
          My Housing Assistance Requests
        </h1>

        <p className="mt-2 text-slate-600">
          Track the progress of your housing assistance requests.
        </p>

        <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm">
          DEMONSTRATION ONLY — Use fictional client information.
          Do not enter real client records.
        </div>

        {loading ? (
          <p className="mt-6">Loading your requests...</p>
        ) : message ? (
          <div className="mt-6 rounded-lg border bg-white p-5">
            <p>{message}</p>
            <Link
              href="/login"
              className="mt-3 inline-block text-emerald-800 underline"
            >
              Go to Sign In
            </Link>
          </div>
        ) : requests.length === 0 ? (
          <p className="mt-6">
            You have not submitted any housing assistance requests yet.
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {requests.map((request) => (
              <section
                key={request.id}
                className="rounded-xl border bg-white p-5 shadow-sm"
              >
                <h2 className="text-lg font-semibold">
                  {request.service_type || "Housing Assistance"}
                </h2>

                <p className="mt-2 text-sm">
                  Status:{" "}
                  <span className="font-semibold text-emerald-800">
                    {displayStatus(request.status)}
                  </span>
                </p>

                <p className="mt-2 text-sm">
                  Town: {request.town || "Not provided"}
                </p>

                <p className="mt-2 text-sm">
                  Timeframe: {request.timeframe || "Not provided"}
                </p>

                <p className="mt-2 text-sm">
                  Submitted:{" "}
                  {new Date(request.created_at).toLocaleDateString()}
                </p>
              </section>
            ))}
          </div>
        )}

        <div className="mt-8 flex gap-5">
          <Link href="/intake" className="text-emerald-800 underline">
            Request Assistance
          </Link>
          <Link href="/" className="text-emerald-800 underline">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
