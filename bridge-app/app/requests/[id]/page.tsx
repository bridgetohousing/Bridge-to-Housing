
"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type HelpRequest = {
  id: string;
  client_id: string;
  service_type: string | null;
  town: string | null;
  timeframe: string | null;
  preferred_contact: string | null;
  barrier_summary: string | null;
  status: string | null;
  created_at: string;
};
export default function CaseDetailsPage() {
  return (
    <Suspense fallback={<p>Loading case details...</p>}>
      <CaseDetailsContent />
    </Suspense>
  );
}
 function CaseDetailsContent() {
  const params = useParams();
  const id = params.id as string;

  const [request, setRequest] = useState<HelpRequest | null>(null);
  const [message, setMessage] = useState("Checking access...");
const [caseNotes, setCaseNotes] = useState<string[]>([]);
const [newNote, setNewNote] = useState("");


async function addCaseNote() {
  const note = newNote.trim();

  if (!note || !request) return;

  const { data: { user }, error: authError } =
    await supabase.auth.getUser();

  if (authError || !user) {
    alert("Please sign in again.");
    return;
  }

  const { data, error } = await supabase
    .from("case_notes")
    .insert({
      request_id: request.id,
      author_id: user.id,
      note: note,
    })
    .select("id, note, created_at")
    .single();

  if (error) {
    alert("Case note could not be saved: " + error.message);
    return;
  }

  setCaseNotes((current) => [...current, data.note]);
  setNewNote("");
}


  useEffect(() => {
    let active = true;

    async function loadCase() {
      const { data: authData } = await supabase.auth.getUser();

      if (!authData.user) {
        if (active) setMessage("Please sign in.");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authData.user.id)
        .single();

      if (profileError || profile?.role !== "specialist") {
        if (active) setMessage("Access denied.");
        return;
      }

      const { data, error } = await supabase
        .from("help_requests")
        .select(
          "id, client_id, service_type, town, timeframe, preferred_contact, barrier_summary, status, created_at"
        )
        .eq("id", id)
        .single();

      if (!active) return;

      if (error || !data) {
        setMessage("Case not found or access denied.");
        return;
      }

      setRequest(data);
      setMessage("");

const { data: savedNotes, error: notesError } = await supabase
  .from("case_notes")
  .select("note")
  .eq("request_id", id)
  .order("created_at", { ascending: true });

if (!active) return;

if (notesError) {
  console.error("Could not load case notes:", notesError.message);
} else {
  setCaseNotes((savedNotes ?? []).map((item) => item.note));
}

    }

    void loadCase();

    return () => {
      active = false;
    };
  }, [id]);

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-3xl font-bold text-emerald-900">
        Bridge to Housing – Case Details
      </h1>

      {request ? (
        <section className="mt-6 rounded-xl border bg-white p-6">
          <h2 className="text-xl font-bold">Housing Assistance Request</h2>

          <div className="mt-4 space-y-3">
            <p>Request ID: {request.id}</p>
            <p>Client ID: {request.client_id}</p>
            <p>Service: {request.service_type || "Not provided"}</p>
            <p>Town: {request.town || "Not provided"}</p>
            <p>Timeframe: {request.timeframe || "Not provided"}</p>
            <p>
              Preferred Contact: {request.preferred_contact || "Not provided"}
            </p>
            <p>
              Housing Barriers: {request.barrier_summary || "Not provided"}
            </p>
            <p>Status: {request.status || "Not provided"}</p>
            <p>
              Date Submitted:{" "}
              {new Date(request.created_at).toLocaleDateString()}
            </p>
          </div>
       
<div className="mt-8 border-t pt-6">
  <h2 className="text-xl font-bold text-emerald-900">
    Case Notes
  </h2>

  <p className="mt-2 text-sm text-gray-600">
Demonstration only. Use fictional information.
Case notes are saved securely in Supabase.
  </p>

  <textarea
    value={newNote}
    onChange={(e) => setNewNote(e.target.value)}
    placeholder="Enter a fictional case note..."
    className="mt-4 w-full rounded-lg border p-3"
    rows={4}
  />

  <button
    type="button"
    onClick={addCaseNote}
    className="mt-3 rounded-lg bg-emerald-800 px-5 py-3 text-white"
  >
    Add Case Note
  </button>

  <div className="mt-6 space-y-3">
    {caseNotes.map((note, index) => (
      <div key={index} className="rounded-lg border bg-gray-50 p-4">
        <p className="text-sm font-semibold">
          Note {index + 1}
        </p>
        <p className="mt-2 whitespace-pre-wrap">{note}</p>
      </div>
    ))}
  </div>
</div>

        </section>
      ) : (
        <p className="mt-6">{message}</p>
      )}

      <Link
        href="/dashboard"
        className="mt-6 inline-block text-emerald-800 underline"
      >
        Back to Specialist Dashboard
      </Link>
    </main>
  );
}
