"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

type Item = {
  id: string;
  name: string;
};

type DeleteModal = {
  table: string;
  item: Item;
} | null;

export default function ConfiguracionesPage() {
  const [crews, setCrews] = useState<Item[]>([]);
  const [zones, setZones] = useState<Item[]>([]);
  const [statuses, setStatuses] = useState<Item[]>(
    []
  );
  const [schedules, setSchedules] =
    useState<Item[]>([]);
  const [technologies, setTechnologies] =
    useState<Item[]>([]);
  const [categories, setCategories] =
    useState<Item[]>([]);
  const [contactMethods, setContactMethods] =
    useState<Item[]>([]);

  const [newCrew, setNewCrew] =
    useState("");
  const [newZone, setNewZone] =
    useState("");
  const [newStatus, setNewStatus] =
    useState("");
  const [newSchedule, setNewSchedule] =
    useState("");
  const [newTechnology, setNewTechnology] =
    useState("");
  const [newCategory, setNewCategory] =
    useState("");
  const [newContactMethod, setNewContactMethod] =
    useState("");

  const [deleteModal, setDeleteModal] =
    useState<DeleteModal>(null);

  async function fetchData(
    table: string,
    setter: (data: Item[]) => void
  ) {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order("name");

    if (error) {
      console.error(error);

      return;
    }

    setter(data || []);
  }

  async function createItem(
    table: string,
    value: string,
    reset: () => void,
    refresh: () => void
  ) {
    if (!value.trim()) return;

    const { error } = await supabase
      .from(table)
      .insert({
        name: value,
      });

    if (error) {
      console.error(error);

      return;
    }

    reset();

    refresh();
  }

  async function deleteItem() {
    if (!deleteModal) return;

    const { error } = await supabase
      .from(deleteModal.table)
      .delete()
      .eq("id", deleteModal.item.id);

    if (error) {
      console.error(error);

      return;
    }

    setDeleteModal(null);

    loadAll();
  }

  function loadAll() {
    fetchData("crews", setCrews);

    fetchData("zones", setZones);

    fetchData("statuses", setStatuses);

    fetchData("schedules", setSchedules);

    fetchData(
      "technologies",
      setTechnologies
    );

    fetchData(
      "categories",
      setCategories
    );

    fetchData(
      "contact_methods",
      setContactMethods
    );
  }

  useEffect(() => {
    loadAll();
  }, []);

  function renderCard({
    title,
    description,
    items,
    newValue,
    setNewValue,
    table,
    placeholder,
  }: {
    title: string;
    description: string;
    items: Item[];
    newValue: string;
    setNewValue: (
      value: string
    ) => void;
    table: string;
    placeholder: string;
  }) {
    return (
      <div className="rounded-2xl border border-[#1e293b] bg-[#0f172a] p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              {title}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {description}
            </p>
          </div>

          <span className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-400">
            {items.length}
          </span>
        </div>

        <div className="mt-6 flex gap-2">
          <input
            value={newValue}
            onChange={(e) =>
              setNewValue(e.target.value)
            }
            placeholder={placeholder}
            className="flex-1 rounded-xl border border-[#1e293b] bg-[#111827] px-4 py-3 text-sm outline-none"
          />

          <button
            onClick={() =>
              createItem(
                table,
                newValue,
                () => setNewValue(""),
                loadAll
              )
            }
            className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium transition hover:bg-blue-500"
          >
            Agregar
          </button>
        </div>

        <div className="mt-6 space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-[#1e293b] bg-[#111827] px-4 py-3 text-sm"
            >
              <span>{item.name}</span>

              <button
                onClick={() =>
                  setDeleteModal({
                    table,
                    item,
                  })
                }
                className="rounded-lg bg-red-500/20 px-3 py-1 text-xs text-red-400 transition hover:bg-red-500/30"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
          {renderCard({
            title: "Cuadrillas",
            description:
              "Gestión de cuadrillas",
            items: crews,
            newValue: newCrew,
            setNewValue: setNewCrew,
            table: "crews",
            placeholder:
              "Nueva cuadrilla",
          })}

          {renderCard({
            title: "Zonas",
            description:
              "Gestión de zonas",
            items: zones,
            newValue: newZone,
            setNewValue: setNewZone,
            table: "zones",
            placeholder: "Nueva zona",
          })}

          {renderCard({
            title: "Estados",
            description:
              "Gestión de estados",
            items: statuses,
            newValue: newStatus,
            setNewValue: setNewStatus,
            table: "statuses",
            placeholder:
              "Nuevo estado",
          })}

          {renderCard({
            title: "Horarios",
            description:
              "Gestión de horarios",
            items: schedules,
            newValue: newSchedule,
            setNewValue: setNewSchedule,
            table: "schedules",
            placeholder:
              "Nuevo horario",
          })}

          {renderCard({
            title: "Tecnologías",
            description:
              "Gestión de tecnologías",
            items: technologies,
            newValue: newTechnology,
            setNewValue:
              setNewTechnology,
            table: "technologies",
            placeholder:
              "Nueva tecnología",
          })}

          {renderCard({
            title: "Categorías",
            description:
              "Gestión de categorías",
            items: categories,
            newValue: newCategory,
            setNewValue:
              setNewCategory,
            table: "categories",
            placeholder:
              "Nueva categoría",
          })}

          {renderCard({
            title: "Medios",
            description:
              "Gestión de medios",
            items: contactMethods,
            newValue: newContactMethod,
            setNewValue:
              setNewContactMethod,
            table: "contact_methods",
            placeholder:
              "Nuevo medio",
          })}
        </div>
      </div>

      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-[#1e293b] bg-[#111827] p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-white">
              Eliminar registro
            </h2>

            <p className="mt-3 text-sm text-slate-400">
              ¿Seguro que querés eliminar:
            </p>

            <p className="mt-2 rounded-xl bg-[#0f172a] px-4 py-3 text-sm text-slate-200">
              {deleteModal.item.name}
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() =>
                  setDeleteModal(null)
                }
                className="rounded-xl border border-[#334155] px-4 py-2 text-sm text-slate-300 transition hover:bg-[#1e293b]"
              >
                Cancelar
              </button>

              <button
                onClick={deleteItem}
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