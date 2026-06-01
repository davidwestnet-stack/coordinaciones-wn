"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  CalendarDays,
  Settings,
  Users,
  CalendarRange,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type Role =
  | "coordinador"
  | "supervisor"
  | "encargado";

type MenuItem = {
  title: string;
  href: string;
  icon: any;
  roles: Role[];
};

const menuItems: MenuItem[] = [
  {
    title: "Inicio",
    href: "/",
    icon: CalendarDays,
    roles: [
      "coordinador",
      "supervisor",
      "encargado",
    ],
  },
  {
    title: "Configuraciones",
    href: "/configuraciones",
    icon: Settings,
    roles: [
      "supervisor",
      "encargado",
    ],
  },
  {
    title: "Usuarios",
    href: "/usuarios",
    icon: Users,
    roles: ["encargado"],
  },
  {
    title: "Días fijos",
    href: "/dias-fijos",
    icon: CalendarRange,
    roles: [
      "supervisor",
      "encargado",
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const router = useRouter();

  const [role, setRole] =
    useState<Role | null>(null);

  useEffect(() => {
    async function loadRole() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (data?.role) {
        setRole(data.role);
      }
    }

    loadRole();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();

    router.push("/login");
  }

  return (
    <aside className="hidden w-64 flex-col border-r border-[#1e293b] bg-[#0f172a] md:flex">
      <div className="border-b border-[#1e293b] p-6">
        <h2 className="text-xl font-bold text-[#7dd3fc]">
          Coordinaciones WN
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Plataforma ISP
        </p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems
            .filter((item) =>
              role
                ? item.roles.includes(role)
                : false
            )
            .map((item) => {
              const Icon = item.icon;

              const isActive =
                pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                      isActive
                        ? "bg-[#1e293b] text-slate-100"
                        : "text-slate-300 hover:bg-[#1e293b]"
                    }`}
                  >
                    <Icon size={20} />

                    <span>
                      {item.title}
                    </span>
                  </Link>
                </li>
              );
            })}
        </ul>
      </nav>
    </aside>
  );
}