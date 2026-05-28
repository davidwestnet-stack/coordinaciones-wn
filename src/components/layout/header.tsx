"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { LogOut } from "lucide-react";

import { supabase } from "@/lib/supabase";

export function Header() {
  const router = useRouter();

  const [userName, setUserName] =
    useState("");

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", user.id)
        .single();

      if (data?.name) {
        setUserName(data.name);
      }
    }

    loadUser();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();

    router.push("/login");
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-[#1e293b] bg-[#0b1120] px-6">
      <h1 className="text-lg font-semibold text-slate-200">
        Panel principal
      </h1>

      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-slate-300">
          {userName}
        </span>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl border border-[#1e293b] bg-[#111827] px-4 py-2 text-sm text-slate-300 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={18} />

          <span>Cerrar sesión</span>
        </button>
      </div>
    </header>
  );
}