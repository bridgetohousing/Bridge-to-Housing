
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError) {
        setError(loginError.message);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();

if (!user) {
  setError("Unable to verify your account.");
  return;
}

const { data: profile, error: profileError } = await supabase
  .from("profiles")
  .select("role")
  .eq("id", user.id)
  .single();

if (profileError || !profile) {
  setError("Unable to verify your account role.");
  return;
}
router.push(profile.role === "specialist" ? "/dashboard" : "/intake");
router.refresh();
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-emerald-900 p-8 text-white">
        <h1 className="text-3xl font-bold">Bridge to Housing</h1>
        <p className="mt-2">Your Bridge to the Next Step</p>
      </header>

      <section className="mx-auto max-w-md p-8">
        <h2 className="mb-3 text-3xl font-bold text-slate-900">
          Client Sign In
        </h2>
        <p className="mb-6 text-slate-700">
          Sign in to request housing assistance.
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block font-semibold">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block font-semibold">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border p-3"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-900 p-4 font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6">
          Need an account?{" "}
          <a href="/signup" className="text-emerald-800 underline">
            Create Account
          </a>
        </p>

        
<a href="/forgot-password" className="block mt-4 text-emerald-800 underline">
  Forgot Password?
</a>

        <a href="/" className="mt-6 inline-block text-emerald-800 underline">
          Back to Home
        </a>
      </section>
    </main>
  );
}
