
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkRecovery() {
      const params = new URLSearchParams(window.location.search);
      const tokenHash = params.get("token_hash");
      const type = params.get("type");

      if (tokenHash && type === "recovery") {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "recovery",
        });

        window.history.replaceState({}, "", "/reset-password");

        if (!active) return;

        if (error) {
          setMessage("This recovery link is invalid or expired.");
          return;
        }

        setReady(true);
        return;
      }

      const hash = new URLSearchParams(
        window.location.hash.slice(1)
      );

      if (hash.get("error")) {
        setMessage("This recovery link is invalid or expired.");
        return;
      }

      const { data } = await supabase.auth.getSession();

      if (!active) return;

      if (data.session) {
        setReady(true);
      } else {
        setMessage(
          "Open a valid password recovery link from your email."
        );
      }
    }

    checkRecovery();

    return () => {
      active = false;
    };
  }, []);

  async function handleReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    if (password.length < 12) {
      setMessage("Use a password with at least 12 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("The passwords do not match.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setSuccess(true);
    setPassword("");
    setConfirmPassword("");
    await supabase.auth.signOut();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-emerald-900 px-6 py-8 text-white">
        <h1 className="text-3xl font-bold">Bridge to Housing</h1>
        <p className="mt-2">
          Connecting People. Removing Barriers. Building Stability.
        </p>
      </header>

      <section className="mx-auto mt-12 max-w-md rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold">
          Reset Your Password
        </h2>

        {success ? (
          <div>
            <p className="text-emerald-800">
              Your password has been updated successfully.
            </p>
            <a
              href="/login"
              className="mt-4 inline-block font-semibold text-emerald-800 underline"
            >
              Return to Log In
            </a>
          </div>
        ) : ready ? (
          <form onSubmit={handleReset} className="space-y-4">
            <label className="block">
              <span className="font-medium">New password</span>
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={12}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded border p-3"
              />
            </label>

            <label className="block">
              <span className="font-medium">Confirm new password</span>
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={12}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full rounded border p-3"
              />
            </label>

            <button
              type="submit"
              className="w-full rounded bg-emerald-800 p-3 font-semibold text-white"
            >
              Update Password
            </button>
          </form>
        ) : (
          <p className="text-gray-600">
            Checking your password recovery link...
          </p>
        )}

        {message && (
          <p role="alert" className="mt-4 text-red-700">
            {message}
          </p>
        )}
      </section>
    </main>
  );
}
