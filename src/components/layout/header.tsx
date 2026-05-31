"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { Bell, LogOut } from "lucide-react";

import { supabase } from "@/lib/supabase";

type Notification = {
  id: string;
  message: string;
  created_at: string;
  read_at: string | null;
};

export function Header() {
  const router = useRouter();

  const [userName, setUserName] =
    useState("");

  const [
    notifications,
    setNotifications,
  ] = useState<Notification[]>([]);

  const [
    notificationsOpen,
    setNotificationsOpen,
  ] = useState(false);

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

        loadNotifications(data.name);
      }
    }

    loadUser();
  }, []);

  async function loadNotifications(
    name: string
  ) {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("recipient", name)
      .order("created_at", {
        ascending: false,
      });

    setNotifications(data || []);
  }

  async function openNotifications() {
    setNotificationsOpen(
      !notificationsOpen
    );

    if (
      notifications.length > 0 &&
      userName
    ) {
      await supabase
        .from("notifications")
        .update({
          read_at:
            new Date().toISOString(),
        })
        .eq("recipient", userName)
        .is("read_at", null);

      loadNotifications(userName);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();

    router.push("/login");
  }

  const unreadCount =
    notifications.filter(
      (n) => !n.read_at
    ).length;

  return (
    <header className="flex h-16 items-center justify-between border-b border-[#1e293b] bg-[#0b1120] px-6">
      <h1 className="text-lg font-semibold text-slate-200">
        Panel principal
      </h1>

      <div className="relative flex items-center gap-4">
        <button
          onClick={openNotifications}
          className="relative rounded-xl border border-[#1e293b] bg-[#111827] p-2 text-slate-300 transition hover:bg-[#1e293b]"
        >
          <Bell size={20} />

          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>

        {notificationsOpen && (
          <div className="absolute right-0 top-14 z-50 w-96 rounded-2xl border border-[#1e293b] bg-[#111827] shadow-xl">
            <div className="border-b border-[#1e293b] p-4">
              <h3 className="font-semibold text-slate-100">
                Notificaciones
              </h3>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length ===
              0 ? (
                <div className="p-4 text-sm text-slate-400">
                  No hay
                  notificaciones.
                </div>
              ) : (
                notifications.map(
                  (notification) => (
                    <div
                      key={
                        notification.id
                      }
                      className="border-b border-[#1e293b] p-4"
                    >
                      <p className="text-sm text-slate-200">
                        {
                          notification.message
                        }
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {new Date(
                          notification.created_at
                        ).toLocaleString(
                          "es-AR"
                        )}
                      </p>
                    </div>
                  )
                )
              )}
            </div>
          </div>
        )}

        <span className="text-sm font-medium text-slate-300">
          {userName}
        </span>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl border border-[#1e293b] bg-[#111827] px-4 py-2 text-sm text-slate-300 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={18} />

          <span>
            Cerrar sesión
          </span>
        </button>
      </div>
    </header>
  );
}