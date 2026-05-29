"use client";

import { useEffect, useMemo, useState } from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Image from "next/image";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

import { supabase } from "@/lib/supabase";

type Coordination = {
    id: string;
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
    created_by?: string;
    napeado?: boolean;
    dumas?: boolean;
    captura?: boolean;
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

    const [deleteModalOpen, setDeleteModalOpen] =
        useState(false);

    const [editingId, setEditingId] =
        useState<string | null>(null);

    const [form, setForm] = useState(initialForm);

    const [coordinations, setCoordinations] =
        useState<Coordination[]>([]);

    const [zones, setZones] = useState<string[]>(
        []
    );

    const [statuses, setStatuses] = useState<
        {
            name: string;
            color: string;
        }[]
    >([]);

    const [crews, setCrews] = useState<string[]>(
        []
    );

    const [schedules, setSchedules] =
        useState<string[]>([]);

    const [categories, setCategories] =
        useState<string[]>([]);

    const [technologies, setTechnologies] =
        useState<string[]>([]);

    const [contactMethods, setContactMethods] =
        useState<string[]>([]);

    const [userName, setUserName] =
        useState("");

    function handleDateClick(info: { dateStr: string }) {
        setSelectedDate(info.dateStr);
        setOpen(true);
    }

    function getStatusColor(status: string) {
        const foundStatus = statuses.find(
            (s) =>
                s.name.toLowerCase() ===
                status.toLowerCase()
        );

        const color =
            foundStatus?.color || "slate";

        switch (color) {
            case "emerald":
                return "bg-emerald-500/20 text-emerald-400";

            case "amber":
                return "bg-amber-500/20 text-amber-400";

            case "orange":
                return "bg-orange-500/20 text-orange-400";

            case "red":
                return "bg-red-500/20 text-red-400";

            case "blue":
                return "bg-blue-500/20 text-blue-400";

            default:
                return "bg-slate-500/20 text-slate-300";
        }
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

    async function fetchCoordinations() {
        const { data, error } = await supabase
            .from("coordinations")
            .select("*")
            .eq("coordination_date", selectedDate)
            .order("created_at", {
                ascending: false,
            });

        if (error) {
            console.error(
                "Error cargando coordinaciones:",
                error
            );

            return;
        }

        const formattedData: Coordination[] =
            data.map((item) => ({
                id: item.id,
                ticket: item.ticket,
                cliente: item.client_name,
                estado: item.estado || "Pendiente",
                zona: item.zona || "Centro",
                cuadrilla:
                    item.cuadrilla || null,
                horario: item.horario || "",
                tecnologia:
                    item.tecnologia || "FTTH",
                categoria:
                    item.categoria ||
                    "Instalación",
                medio:
                    item.medio || "WhatsApp",
                observaciones:
                    item.observations || "",

                created_by:
                    item.created_by || "",

                napeado:
                    item.napeado || false,

                dumas:
                    item.dumas || false,

                captura:
                    item.captura || false,
            }));

        setCoordinations(formattedData);
    }

    async function fetchConfigurations() {
        const [
            zonesRes,
            statusesRes,
            crewsRes,
            schedulesRes,
            categoriesRes,
            technologiesRes,
            contactMethodsRes,
        ] = await Promise.all([
            supabase.from("zones").select("name"),
            supabase
                .from("statuses")
                .select("name, color"),
            supabase.from("crews").select("name"),
            supabase.from("schedules").select("name"),
            supabase.from("categories").select("name"),
            supabase
                .from("technologies")
                .select("name"),
            supabase
                .from("contact_methods")
                .select("name"),
        ]);

        setZones(
            zonesRes.data?.map((x) => x.name) || []
        );

        setStatuses(statusesRes.data || []);

        setCrews(
            crewsRes.data?.map((x) => x.name) || []
        );

        setSchedules(
            schedulesRes.data?.map((x) => x.name) ||
            []
        );

        setCategories(
            categoriesRes.data?.map((x) => x.name) ||
            []
        );

        setTechnologies(
            technologiesRes.data?.map(
                (x) => x.name
            ) || []
        );

        setContactMethods(
            contactMethodsRes.data?.map(
                (x) => x.name
            ) || []
        );

        console.log("ZONAS:", zonesRes.data);

        console.log("CUADRILLAS:", crewsRes.data);

        console.log("ESTADOS:", statusesRes.data);
    }

    useEffect(() => {
        fetchConfigurations();

        async function loadUser() {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) return;

            const { data } = await supabase
                .from("profiles")
                .select("name")
                .eq("id", session.user.id)
                .single();

            if (data?.name) {
                setUserName(data.name);
            }
        }

        loadUser();
    }, []);

    useEffect(() => {
        if (selectedDate) {
            fetchCoordinations();
        }
    }, [selectedDate]);

    async function toggleTask(
        id: string,
        field: "napeado" | "dumas" | "captura",
        value: boolean
    ) {
        const { error } = await supabase
            .from("coordinations")
            .update({
                [field]: value,
            })
            .eq("id", id);

        if (error) {
            console.error(error);
            return;
        }

        fetchCoordinations();
    }

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

    async function handleDeleteCoordination() {
        if (!selectedCoordination) return;

        const { error } = await supabase
            .from("coordinations")
            .delete()
            .eq("id", selectedCoordination.id);

        if (error) {
            console.error(
                "Error eliminando:",
                error
            );

            return;
        }

        setDeleteModalOpen(false);

        setSelectedCoordination(null);

        await fetchCoordinations();
    }

    async function handleSave() {
        if (!form.ticket.trim()) return;

        if (editingId) {
            const { error } = await supabase
                .from("coordinations")
                .update({
                    ticket: form.ticket,
                    client_name: form.cliente,
                    estado: form.estado,
                    zona: form.zona,
                    cuadrilla:
                        form.cuadrilla || null,
                    horario: form.horario,
                    tecnologia:
                        form.tecnologia,
                    categoria: form.categoria,
                    medio: form.medio,
                    observations:
                        form.observaciones,
                })
                .eq("id", editingId);

            if (error) {
                console.error(
                    "Error actualizando:",
                    error
                );

                return;
            }
        } else {
            const { error } = await supabase
                .from("coordinations")
                .insert({
                    ticket: form.ticket,
                    client_name: form.cliente,
                    estado: form.estado,
                    zona: form.zona,
                    cuadrilla:
                        form.cuadrilla || null,
                    horario: form.horario,
                    tecnologia:
                        form.tecnologia,
                    categoria: form.categoria,
                    medio: form.medio,
                    observations:
                        form.observaciones,
                    coordination_date:
                        selectedDate,
                    created_by: userName,
                });

            if (error) {
                console.error(
                    "Error guardando:",
                    error
                );

                return;
            }
        }

        await fetchCoordinations();

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
                                                            <div className="flex items-center gap-6">
                                                                <span className="text-sm font-semibold uppercase tracking-wide text-[#7dd3fc]">
                                                                    {groupName}
                                                                </span>

                                                                {items[0] && (
                                                                    <>
                                                                        <label
                                                                            className={`flex items-center gap-2 text-xs ${items[0].napeado
                                                                                ? "text-emerald-400"
                                                                                : "text-slate-300"
                                                                                }`}
                                                                        >
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={items[0].napeado || false}
                                                                                onChange={(e) =>
                                                                                    toggleTask(
                                                                                        items[0].id,
                                                                                        "napeado",
                                                                                        e.target.checked
                                                                                    )
                                                                                }
                                                                            />
                                                                            Napeado
                                                                        </label>

                                                                        <label
                                                                            className={`flex items-center gap-2 text-xs ${items[0].dumas
                                                                                ? "text-emerald-400"
                                                                                : "text-slate-300"
                                                                                }`}
                                                                        >
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={items[0].dumas || false}
                                                                                onChange={(e) =>
                                                                                    toggleTask(
                                                                                        items[0].id,
                                                                                        "dumas",
                                                                                        e.target.checked
                                                                                    )
                                                                                }
                                                                            />
                                                                            Dumas
                                                                        </label>

                                                                        <label
                                                                            className={`flex items-center gap-2 text-xs ${items[0].captura
                                                                                ? "text-emerald-400"
                                                                                : "text-slate-300"
                                                                                }`}
                                                                        >
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={items[0].captura || false}
                                                                                onChange={(e) =>
                                                                                    toggleTask(
                                                                                        items[0].id,
                                                                                        "captura",
                                                                                        e.target.checked
                                                                                    )
                                                                                }
                                                                            />
                                                                            Captura
                                                                        </label>
                                                                    </>
                                                                )}
                                                            </div>

                                                            <div className="flex items-center gap-3">
                                                                {items.some(
                                                                    (item) =>
                                                                        item.zona === "Favorita" ||
                                                                        item.zona === "Castrol"
                                                                ) && (
                                                                        <Image
                                                                            src="/icons/huawei.png"
                                                                            alt="Huawei"
                                                                            width={42}
                                                                            height={42}
                                                                            className="object-contain"
                                                                        />
                                                                    )}

                                                                <div className="rounded-full bg-[#1e293b] px-3 py-1 text-xs text-slate-300">
                                                                    {items.length} casos
                                                                </div>
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

                                                                        <div>
                                                                            <p className="text-xs text-slate-500">
                                                                                Cliente
                                                                            </p>

                                                                            <p className="text-sm text-slate-300">
                                                                                {coordination.cliente}
                                                                            </p>
                                                                        </div>

                                                                        <div>
                                                                            <p className="text-xs text-slate-500">
                                                                                Categoría
                                                                            </p>

                                                                            <p className="text-sm text-slate-300">
                                                                                {coordination.categoria}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="rounded-full bg-[#1e293b] px-3 py-1 text-xs font-medium text-slate-300">
                                                                            {coordination.created_by ||
                                                                                "Sin usuario"}
                                                                        </div>

                                                                        <span
                                                                            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                                                                                coordination.estado
                                                                            )}`}
                                                                        >
                                                                            {coordination.estado}
                                                                        </span>
                                                                    </div>
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

                                    <div className="flex gap-3">
                                        <button
                                            onClick={openEditModal}
                                            className="flex-1 rounded-xl bg-[#1d4ed8] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#2563eb]"
                                        >
                                            Editar coordinación
                                        </button>

                                        <button
                                            onClick={handleDeleteCoordination}
                                            className="rounded-xl bg-red-500/20 px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/30"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
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

                        <Select
                            label="Horario"
                            value={form.horario}
                            onChange={(v) =>
                                updateField("horario", v)
                            }
                            options={[
                                "",
                                ...schedules,
                            ]}

                        />

                        <Select
                            label="Estado"
                            value={form.estado}
                            onChange={(v) =>
                                updateField("estado", v)
                            }
                            options={statuses.map(
                                (status) => status.name
                            )}
                        />

                        <Select
                            label="Zona"
                            value={form.zona}
                            onChange={(v) =>
                                updateField("zona", v)
                            }
                            options={[
                                "",
                                ...zones,
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
                                ...crews,
                            ]}
                        />

                        <Select
                            label="Tecnología"
                            value={form.tecnologia}
                            onChange={(v) =>
                                updateField("tecnologia", v)
                            }
                            options={[
                                "",
                                ...technologies,
                            ]}
                        />

                        <Select
                            label="Categoría"
                            value={form.categoria}
                            onChange={(v) =>
                                updateField("categoria", v)
                            }
                            options={[
                                "",
                                ...categories,
                            ]}
                        />

                        <Select
                            label="Medio"
                            value={form.medio}
                            onChange={(v) =>
                                updateField("medio", v)
                            }
                            options={[
                                "",
                                ...contactMethods,
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