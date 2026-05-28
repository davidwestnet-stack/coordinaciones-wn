"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleLogin() {
    setLoading(true);

    setError("");

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      setError(
        "Usuario o contraseña incorrectos"
      );

      setLoading(false);

      return;
    }

    router.push("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#071120] px-6">
      <div className="w-full max-w-md rounded-3xl border border-[#1e293b] bg-[#0f172a] p-10 shadow-2xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-white">
            Coordinaciones Westnet
          </h1>

          <p className="mt-3 text-sm text-slate-400">
            Plataforma interna
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Usuario
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full rounded-2xl border border-[#1e293b] bg-[#111827] px-4 py-3 text-white outline-none transition focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full rounded-2xl border border-[#1e293b] bg-[#111827] px-4 py-3 text-white outline-none transition focus:border-blue-500"
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded-2xl bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-500 disabled:opacity-50"
          >
            {loading
              ? "Ingresando..."
              : "Ingresar"}
          </button>
        </div>
      </div>
    </main>
  );
}