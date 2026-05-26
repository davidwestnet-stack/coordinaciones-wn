import { CalendarView } from "@/components/calendar/calendar-view";
export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">
          Inicio
        </h1>

        <p className="mt-1 text-slate-400">
          Gestión y coordinación de instalaciones técnicas.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[#1e293b] bg-[#111827] p-6">
          <p className="text-sm text-slate-400">
            Coordinaciones hoy
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-100">
            0
          </h2>
        </div>

        <div className="rounded-2xl border border-[#1e293b] bg-[#111827] p-6">
          <p className="text-sm text-slate-400">
            Pendientes
          </p>

          <h2 className="mt-3 text-3xl font-bold text-amber-400">
            0
          </h2>
        </div>

        <div className="rounded-2xl border border-[#1e293b] bg-[#111827] p-6">
          <p className="text-sm text-slate-400">
            Confirmadas
          </p>

          <h2 className="mt-3 text-3xl font-bold text-emerald-400">
            0
          </h2>
        </div>
      </div>

      <div className="rounded-2xl border border-[#1e293b] bg-[#111827] p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-100">
              Calendario de coordinaciones
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Próximamente visualizaremos las coordinaciones por día.
            </p>
          </div>

          <button className="rounded-xl bg-[#1d4ed8] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#2563eb]">
            Nueva coordinación
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-[#1e293b] bg-[#0f172a] p-4">
          <CalendarView />
        </div>
      </div>
    </div>
  );
}