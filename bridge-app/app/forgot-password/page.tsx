
"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const redirectTo = `${window.location.origin}/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    setLoading(false);

    if (error) {
      setMessage("Unable to send recovery email. Please try again.");
    } else {
      setMessage(
        "If an account exists for this email, you will receive a password-reset link."
      );
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <section className="mx-auto mt-12 max-w-md rounded-lg border bg-white p-6">
        <h1 className="mb-4 text-2xl font-bold">
          Forgot Password?
        </h1>

        <p className="mb-6 text-gray-600">
          Enter your email address to request a password-reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="font-medium">Email Address</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded border p-3"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-emerald-800 p-3 text-white disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <p role="status" className="mt-4 text-sm">
            {message}
          </p>
        )}

        <a
          href="/login"
          className="mt-6 inline-block text-emerald-800 underline"
        >
          Back to Sign In
        </a>
      </section>
    </main>
  );
}
