"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

type Crew = {
  id: string;
  name: string;
};

export default function ConfiguracionesPage() {
  const [crews, setCrews] = useState<Crew[]>(
    []
  );

  const [newCrew, setNewCrew] =
    useState("");

  const [crewToDelete, setCrewToDelete] =
    useState<Crew | null>(null);

  async function fetchCrews() {
    const { data, error } = await supabase
      .from("crews")
      .select("*")
      .order("name");

    if (error) {
      console.error(error);

      return;
    }

    setCrews(data || []);
  }

  async function createCrew() {
    if (!newCrew.trim()) return;

    const { error } = await supabase
      .from("crews")
      .insert({
        name: newCrew,
      });

    if (error) {
      console.error(error);

      return;
    }

    setNewCrew("");

    fetchCrews();
  }

  async function deleteCrew() {
    if (!crewToDelete) return;

    const { error } = await supabase
      .from("crews")
      .delete()
      .eq("id", crewToDelete.id);

    if (error) {
      console.error(error);

      return;
    }

    setCrewToDelete(null);

    fetchCrews();
  }

  useEffect(() => {
    fetchCrews();
  }, []);

  return (
    <main className="min-h-screen bg-[#0b1220] p-6 text-slate-100">
      <div className="mx-auto rounded-3xl border border-[#1e293b] bg-[#111827] p-10 shadow-2xl">
        <h1 className="text-4xl font-bold">
          Configuraciones
        </h1>

        <p className="mt-2 text-slate-400">
          Administración del sistema
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border border-[#1e293b] bg-[#0f172a] p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Cuadrillas
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Gestión de cuadrillas
                </p>
              </div>

              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-400">
                {crews.length}
              </span>
            </div>

            <div className="mt-6 flex gap-2">
              <input
                value={newCrew}
                onChange={(e) =>
                  setNewCrew(e.target.value)
                }
                placeholder="Nueva cuadrilla"
                className="flex-1 rounded-xl border border-[#1e293b] bg-[#111827] px-4 py-3 text-sm outline-none"
              />

              <button
                onClick={createCrew}
                className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium transition hover:bg-blue-500"
              >
                Agregar
              </button>
            </div>

            <div className="mt-6 space-y-2">
              {crews.map((crew) => (
                <div
                  key={crew.id}
                  className="flex items-center justify-between rounded-xl border border-[#1e293b] bg-[#111827] px-4 py-3 text-sm"
                >
                  <span>{crew.name}</span>

                  <button
                    onClick={() =>
                      setCrewToDelete(crew)
                    }
                    className="rounded-lg bg-red-500/20 px-3 py-1 text-xs text-red-400 transition hover:bg-red-500/30"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {crewToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-[#1e293b] bg-[#111827] p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-white">
              Eliminar cuadrilla
            </h2>

            <p className="mt-3 text-sm text-slate-400">
              ¿Seguro que querés eliminar:
            </p>

            <p className="mt-2 rounded-xl bg-[#0f172a] px-4 py-3 text-sm text-slate-200">
              {crewToDelete.name}
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() =>
                  setCrewToDelete(null)
                }
                className="rounded-xl border border-[#334155] px-4 py-2 text-sm text-slate-300 transition hover:bg-[#1e293b]"
              >
                Cancelar
              </button>

              <button
                onClick={deleteCrew}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}