"use client";

import { useEffect, useState } from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

import { supabase } from "@/lib/supabase";

type Role =
  | "coordinador"
  | "supervisor"
  | "encargado";

const routePermissions: Record<
  string,
  Role[]
> = {
  "/": [
    "coordinador",
    "supervisor",
    "encargado",
  ],

  "/configuraciones": [
    "supervisor",
    "encargado",
  ],

  "/dias-fijos": [
    "supervisor",
    "encargado",
  ],

  "/usuarios": ["encargado"],
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const pathname = usePathname();

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function validateAccess() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");

        return;
      }

      const { data: profile } =
        await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

      const userRole =
        profile?.role as Role;

      const allowedRoles =
        routePermissions[pathname];

      if (
        allowedRoles &&
        !allowedRoles.includes(userRole)
      ) {
        router.push("/");

        return;
      }

      setLoading(false);
    }

    validateAccess();
  }, [pathname, router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#071120] text-slate-400">
        Verificando sesión...
      </main>
    );
  }

  return (
    <main className="flex min-h-screen bg-[#0b1120]">
      <Sidebar />

      <div className="min-w-0 flex-1 overflow-hidden">
        <Header />

        <section className="overflow-x-auto p-6">
          {children}
        </section>
      </div>
    </main>
  );
}