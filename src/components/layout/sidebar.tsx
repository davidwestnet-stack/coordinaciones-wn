"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  CalendarDays,
  Settings,
  Users,
  CalendarRange,
} from "lucide-react";

const menuItems = [
  {
    title: "Inicio",
    href: "/",
    icon: CalendarDays,
  },
  {
    title: "Configuraciones",
    href: "/configuraciones",
    icon: Settings,
  },
  {
    title: "Usuarios",
    href: "/usuarios",
    icon: Users,
  },
  {
    title: "Días fijos",
    href: "/dias-fijos",
    icon: CalendarRange,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-[#1e293b] bg-[#0f172a]">
      <div className="border-b border-[#1e293b] p-6">
        <h2 className="text-xl font-bold text-[#7dd3fc]">
          Coordinaciones WN
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Plataforma ISP
        </p>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive = pathname === item.href;

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

                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}