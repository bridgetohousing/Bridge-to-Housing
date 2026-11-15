 "use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function IntakePage() {
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

const [checkingAuth, setCheckingAuth] = useState(true);


useEffect(() => {
  async function checkAuth() {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      window.location.replace("/login");
      return;
    }
  
setCheckingAuth(false);

  }

  checkAuth();
}, []);

async function handleSignOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    setError("Unable to sign out. Please try again.");
    return;
  }

  window.location.replace("/login");
}

async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  setError("");
  setSaving(true);

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Please sign in before submitting a request.");
    }


    const serviceType = String(formData.get("service_type") || "");
    const housingSituation = String(formData.get("housing_situation") || "");
    const details = String(formData.get("details") || "");
    const timeframe = String(formData.get("timeframe") || "");
    const preferredContact = String(formData.get("preferred_contact") || "");

    if (!serviceType || !housingSituation || !timeframe || !preferredContact) {
      throw new Error("Please complete all required fields.");
    }

    const { error: insertError } = await supabase
      .from("help_requests")
      .insert({
        client_id: user.id,
        service_type: serviceType,
        town: null,
        timeframe,
        preferred_contact: preferredContact,
        barrier_summary: [
          `Housing situation: ${housingSituation}`,
          details,
        ].filter(Boolean).join("\n\n"),
      });

    if (insertError) {
      throw insertError;
    }

    setSubmitted(true);
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Something went wrong. Please try again."
    );
  } finally {
    setSaving(false);
  }
}



if (checkingAuth) {
  return <main className="p-8">Checking your sign-in...</main>;
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
          TESTING MODE ONLY: Do not enter real names,
phone numbers, addresses, or personal information.
This form is being tested with fictional information.
        </div>

        {submitted ? (
          <div className="mt-8 rounded-xl border bg-white p-6">
            <h3 className="text-2xl font-bold text-emerald-900">
              Test Request Saved Successfully!
            </h3>
            <p className="mt-3">
            Your fictional housing assistance request was saved
successfully to the Bridge to Housing test database.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-5 rounded-lg bg-emerald-900 px-5 py-3 text-white"
            >
              Try Again
            </button>
          </div>
        ) : (
<>
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
              name="service_type"
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
<option>
  Housing Choice Voucher (HCV) – Housing Quality Standards (HQS) Inspection Request
</option>
<option>Other Housing Support</option>

              </select>
            </label>

            <label className="block">
              <span className="font-semibold">Current Housing Situation</span>
              <select
                name="housing_situation"
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
name="details"                placeholder="Describe a fictional housing need..."
                className="mt-2 w-full rounded-lg border bg-white p-3"
              />
            </label>

<label className="block">
  <span className="font-semibold">
    How Soon Do You Need Assistance?
  </span>
  <select
    name="timeframe"
    required
    defaultValue=""
    className="mt-2 w-full rounded-lg border bg-white p-3"
  >
    <option value="" disabled>
      Select a timeframe
    </option>
    <option value="Immediately">Immediately</option>
    <option value="Within 7 days">Within 7 days</option>
    <option value="Within 30 days">Within 30 days</option>
    <option value="Planning ahead">Planning ahead</option>
  </select>
</label>

<label className="block">
  <span className="font-semibold">
    Preferred Contact Method
  </span>
  <select
    name="preferred_contact"
    required
    defaultValue=""
    className="mt-2 w-full rounded-lg border bg-white p-3"
  >
    <option value="" disabled>
      Select a contact method
    </option>
    <option value="Phone">Phone Call</option>
    <option value="Text">Text Message</option>
    <option value="Email">Email</option>
  </select>
</label>

{error && (
  <div
    role="alert"
    className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800"
  >
    {error}
  </div>
)}

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-emerald-900 p-4 font-semibold text-white"
            >
              {saving ? "Saving Request..." : "Test Intake Form"}
            </button>
          </form>
    
<button
  type="button"
  onClick={handleSignOut}
  className="mt-6 w-full rounded-lg border border-emerald-900 p-3 font-semibold text-emerald-900"
>
  Sign Out
</button>
 </>     
        )}
      </section>
    </main>
  );
}

