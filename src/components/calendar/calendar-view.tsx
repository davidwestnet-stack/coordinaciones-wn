"use client";

import { useMemo, useState } from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Coordination = {
  id: number;
  ticket: string;
  cliente: string;
  estado: string;
  zona: string;
  cuadrilla: string | null;
  horario: string;
  tecnologia: string;
  categoria: string;
  medio: string;
  observaciones: string;
};

const initialForm = {
  ticket: "",
  cliente: "",
  estado: "Pendiente",
  zona: "Centro",
  cuadrilla: "",
  horario: "",
  tecnologia: "FTTH",
  categoria: "Instalación",
  medio: "WhatsApp",
  observaciones: "",
};

export function CalendarView() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [open, setOpen] = useState(false);

  const [openForm, setOpenForm] = useState(false);

  const [selectedCoordination, setSelectedCoordination] =
    useState<Coordination | null>(null);

  const [editingId, setEditingId] = useState<number | null>(
    null
  );

  const [form, setForm] = useState(initialForm);

  const [coordinations, setCoordinations] = useState<
    Coordination[]
  >([
    {
      id: 1,
      ticket: "45821",
      cliente: "Juan Pérez",
      estado: "Pendiente",
      zona: "Centro",
      cuadrilla: null,
      horario: "09:00",
      tecnologia: "FTTH",
      categoria: "Instalación",
      medio: "WhatsApp",
      observaciones:
        "Cliente solicita coordinación AM",
    },
    {
      id: 2,
      ticket: "99125",
      cliente: "María Gómez",
      estado: "Confirmado",
      zona: "Norte",
      cuadrilla: "WN Norte",
      horario: "14:00",
      tecnologia: "Wireless",
      categoria: "Service",
      medio: "Llamada",
      observaciones: "",
    },
    {
      id: 3,
      ticket: "77541",
      cliente: "Carlos Ruiz",
      estado: "Pendiente",
      zona: "Godoy Cruz",
      cuadrilla: "WN Norte",
      horario: "16:00",
      tecnologia: "FTTH",
      categoria: "Reinstalación",
      medio: "WhatsApp",
      observaciones: "",
    },
  ]);

  function handleDateClick(info: { dateStr: string }) {
    setSelectedDate(info.dateStr);
    setOpen(true);
  }

  const groupedCoordinations = useMemo(() => {
    const groups: Record<string, Coordination[]> = {};

    coordinations.forEach((coordination) => {
      const key =
        coordination.cuadrilla || "Sin cuadrilla asignada";

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(coordination);
    });

    return groups;
  }, [coordinations]);

  function openCreateModal() {
    setEditingId(null);

    setForm(initialForm);

    setOpenForm(true);
  }

  function openEditModal() {
    if (!selectedCoordination) return;

    setEditingId(selectedCoordination.id);

    setForm({
      ticket: selectedCoordination.ticket,
      cliente: selectedCoordination.cliente,
      estado: selectedCoordination.estado,
      zona: selectedCoordination.zona,
      cuadrilla:
        selectedCoordination.cuadrilla || "",
      horario: selectedCoordination.horario,
      tecnologia: selectedCoordination.tecnologia,
      categoria: selectedCoordination.categoria,
      medio: selectedCoordination.medio,
      observaciones:
        selectedCoordination.observaciones,
    });

    setOpenForm(true);
  }

  function handleSave() {
    if (!form.ticket.trim()) return;

    if (editingId) {
      setCoordinations((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...form,
                cuadrilla:
                  form.cuadrilla || null,
              }
            : item
        )
      );

      setSelectedCoordination({
        id: editingId,
        ...form,
        cuadrilla: form.cuadrilla || null,
      });
    } else {
      const newCoordination: Coordination = {
        id: Date.now(),
        ...form,
        cuadrilla: form.cuadrilla || null,
      };

      setCoordinations((prev) => [
        ...prev,
        newCoordination,
      ]);
    }

    setOpenForm(false);

    setForm(initialForm);

    setEditingId(null);
  }

  function updateField(
    field: string,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="auto"
          locale="es"
          dateClick={handleDateClick}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "",
          }}
          buttonText={{
            today: "Hoy",
          }}
          events={[]}
        />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="h-[90vh] min-w-[1400px] max-h-[90vh] overflow-hidden border border-[#1e293b] bg-[#111827] p-0 text-slate-100">
          <div className="flex h-full overflow-hidden">
            <div className="flex h-full min-h-0 flex-1 flex-col p-6">
              <DialogHeader>
                <DialogTitle className="text-3xl text-slate-100">
                  Coordinaciones del día
                </DialogTitle>
              </DialogHeader>

              <div className="mt-6">
                <p className="text-sm text-slate-400">
                  Fecha seleccionada
                </p>

                <p className="mt-1 text-lg font-semibold text-[#7dd3fc]">
                  {selectedDate}
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-200">
                  Coordinaciones
                </h3>

                <button
                  onClick={openCreateModal}
                  className="h-10 rounded-xl bg-[#1d4ed8] px-4 text-sm font-medium text-white transition hover:bg-[#2563eb]"
                >
                  Nueva coordinación
                </button>
              </div>

              <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-3 pb-[220px]">
               <Accordion
  type="multiple"
  className="space-y-4 pb-24"
>
                  {Object.entries(groupedCoordinations)
  .filter(([, items]) => items.length > 0)
  .map(
                    ([groupName, items]) => (
                  <AccordionItem
  key={`${groupName}-${items.length}`}
  value={groupName}
  className="overflow-hidden rounded-xl border border-[#1e293b] bg-[#0f172a]"
>
                        <AccordionTrigger className="px-5 py-4 hover:no-underline">
                          <div className="flex w-full items-center justify-between pr-4">
                            <span className="text-sm font-semibold uppercase tracking-wide text-[#7dd3fc]">
                              {groupName}
                            </span>

                            <div className="rounded-full bg-[#1e293b] px-3 py-1 text-xs text-slate-300">
                              {items.length} casos
                            </div>
                          </div>
                        </AccordionTrigger>

                        <AccordionContent className="border-t border-[#1e293b] p-4">
                          <div className="space-y-3">
                            {items.map((coordination) => (
                              <button
                                key={coordination.id}
                                onClick={() =>
                                  setSelectedCoordination(
                                    coordination
                                  )
                                }
                                className="flex w-full items-center justify-between rounded-xl border border-[#334155] bg-[#111827] px-4 py-4 text-left transition hover:border-[#475569]"
                              >
                                <div className="flex flex-wrap items-start gap-8">
                                  <div>
                                    <p className="text-xs text-slate-500">
                                      Ticket
                                    </p>

                                    <p className="font-semibold text-slate-100">
                                      {coordination.ticket}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-xs text-slate-500">
                                      Zona
                                    </p>

                                    <p className="text-sm text-slate-300">
                                      {coordination.zona}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-xs text-slate-500">
                                      Horario
                                    </p>

                                    <p className="text-sm text-slate-300">
                                      {coordination.horario}
                                    </p>
                                  </div>
                                </div>

                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                                    coordination.estado ===
                                    "Confirmado"
                                      ? "bg-emerald-500/20 text-emerald-400"
                                      : "bg-amber-500/20 text-amber-400"
                                  }`}
                                >
                                  {coordination.estado}
                                </span>
                              </button>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  )}
                </Accordion>
              </div>
            </div>

            {selectedCoordination && (
              <div className="w-[420px] shrink-0 overflow-y-auto border-l border-[#1e293b] bg-[#0f172a] p-6">
                <div className="flex items-start justify-between pr-6">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Ticket
                    </p>

                    <h3 className="mt-1 text-3xl font-bold text-slate-100">
                      {selectedCoordination.ticket}
                    </h3>
                  </div>

<button
  onClick={() =>
    setSelectedCoordination(null)
  }
  className="rounded-lg p-2 text-slate-500 transition hover:bg-[#1e293b] hover:text-slate-300"
>
  ✕
</button>
                </div>

                <div className="mt-8 space-y-6">
                  <Info
                    title="Cliente"
                    value={
                      selectedCoordination.cliente
                    }
                  />

                  <Info
                    title="Estado"
                    value={
                      selectedCoordination.estado
                    }
                  />

                  <Info
                    title="Zona"
                    value={selectedCoordination.zona}
                  />

                  <Info
                    title="Horario"
                    value={
                      selectedCoordination.horario
                    }
                  />

                  <Info
                    title="Cuadrilla"
                    value={
                      selectedCoordination.cuadrilla ||
                      "Sin asignar"
                    }
                  />

                  <Info
                    title="Tecnología"
                    value={
                      selectedCoordination.tecnologia
                    }
                  />

                  <Info
                    title="Categoría"
                    value={
                      selectedCoordination.categoria
                    }
                  />

                  <Info
                    title="Medio"
                    value={selectedCoordination.medio}
                  />

                  <Info
                    title="Observaciones"
                    value={
                      selectedCoordination.observaciones ||
                      "-"
                    }
                  />

                  <button
                    onClick={openEditModal}
                    className="w-full rounded-xl bg-[#1d4ed8] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#2563eb]"
                  >
                    Editar coordinación
                  </button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openForm}
        onOpenChange={setOpenForm}
      >
        <DialogContent className="max-w-5xl border border-[#1e293b] bg-[#111827] text-slate-100">
          <DialogHeader>
            <DialogTitle className="text-2xl text-slate-100">
              {editingId
                ? "Editar coordinación"
                : "Nueva coordinación"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Ticket"
              value={form.ticket}
              onChange={(v) =>
                updateField("ticket", v)
              }
            />

            <Input
              label="Cliente"
              value={form.cliente}
              onChange={(v) =>
                updateField("cliente", v)
              }
            />

            <Input
              label="Horario"
              value={form.horario}
              onChange={(v) =>
                updateField("horario", v)
              }
            />

            <Select
              label="Estado"
              value={form.estado}
              onChange={(v) =>
                updateField("estado", v)
              }
              options={[
                "Pendiente",
                "Confirmado",
              ]}
            />

            <Select
              label="Zona"
              value={form.zona}
              onChange={(v) =>
                updateField("zona", v)
              }
              options={[
                "Centro",
                "Norte",
                "Godoy Cruz",
              ]}
            />

            <Select
              label="Cuadrilla"
              value={form.cuadrilla}
              onChange={(v) =>
                updateField("cuadrilla", v)
              }
              options={[
                "",
                "WN Norte",
                "WN Sur",
              ]}
            />

            <Select
              label="Tecnología"
              value={form.tecnologia}
              onChange={(v) =>
                updateField("tecnologia", v)
              }
              options={[
                "FTTH",
                "Wireless",
              ]}
            />

            <Select
              label="Categoría"
              value={form.categoria}
              onChange={(v) =>
                updateField("categoria", v)
              }
              options={[
                "Instalación",
                "Service",
                "Reinstalación",
              ]}
            />

            <Select
              label="Medio"
              value={form.medio}
              onChange={(v) =>
                updateField("medio", v)
              }
              options={[
                "WhatsApp",
                "Llamada",
                "Email",
              ]}
            />

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-slate-300">
                Observaciones
              </label>

              <textarea
                value={form.observaciones}
                onChange={(e) =>
                  updateField(
                    "observaciones",
                    e.target.value
                  )
                }
                rows={4}
                className="w-full rounded-xl border border-[#334155] bg-[#0f172a] px-4 py-3 text-slate-100 outline-none"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() =>
                setOpenForm(false)
              }
              className="rounded-xl border border-[#334155] px-5 py-3 text-slate-300 transition hover:bg-[#1e293b]"
            >
              Cancelar
            </button>

            <button
              onClick={handleSave}
              className="rounded-xl bg-[#1d4ed8] px-5 py-3 font-medium text-white transition hover:bg-[#2563eb]"
            >
              Guardar coordinación
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Info({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-sm text-slate-200">
        {value}
      </p>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-slate-300">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-xl border border-[#334155] bg-[#0f172a] px-4 py-3 text-slate-100 outline-none transition focus:border-[#2563eb]"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-slate-300">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-xl border border-[#334155] bg-[#0f172a] px-4 py-3 text-slate-100 outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option || "Sin asignar"}
          </option>
        ))}
      </select>
    </div>
  );
}