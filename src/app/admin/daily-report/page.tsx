"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  Loader2,
  Plus,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type ActivityLog = {
  id: string;
  staff_member_id: string | null;
  staff_member_name: string;
  action_type: string;
  reservation_id: string | null;
  product_code: string | null;
  product_name: string | null;
  customer_name: string | null;
  note: string | null;
  created_at: string;
};

type DailyNote = {
  id: string;
  note_date: string;
  staff_member_id: string | null;
  staff_member_name: string;
  note: string;
  created_at: string;
};

const selectedStaffStorageKey = "venecija-butik_selected_staff";

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function getDayRange(date: string) {
  const start = new Date(`${date}T00:00:00`);
  const end = new Date(`${date}T23:59:59.999`);

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString("bs-BA", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getSelectedStaff() {
  if (typeof window === "undefined") {
    return null;
  }

  const savedStaff = window.localStorage.getItem(selectedStaffStorageKey);

  if (!savedStaff) {
    return null;
  }

  try {
    return JSON.parse(savedStaff) as { id: string; name: string };
  } catch {
    return null;
  }
}

export default function AdminDailyReportPage() {
  const router = useRouter();
  const supabase = createClient();

  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [dailyNotes, setDailyNotes] = useState<DailyNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [selectedStaffName, setSelectedStaffName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function checkAdmin() {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      router.push("/admin/login");
      return false;
    }

    const { data: adminData, error: adminError } = await supabase
      .from("admins")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (adminError || !adminData) {
      router.push("/admin/login");
      return false;
    }

    return true;
  }

  async function loadDailyReport(date = selectedDate) {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const isAdmin = await checkAdmin();

    if (!isAdmin) {
      return;
    }

    const selectedStaff = getSelectedStaff();
    setSelectedStaffName(selectedStaff?.name ?? "");

    const { start, end } = getDayRange(date);

    const { data: logsData, error: logsError } = await supabase
      .from("staff_activity_logs")
      .select(
        "id, staff_member_id, staff_member_name, action_type, reservation_id, product_code, product_name, customer_name, note, created_at"
      )
      .gte("created_at", start)
      .lte("created_at", end)
      .order("created_at", { ascending: false });

    if (logsError) {
      console.error("Greška pri učitavanju aktivnosti:", logsError.message);
      setErrorMessage("Aktivnosti se nisu učitale.");
      setActivityLogs([]);
    } else {
      setActivityLogs((logsData as ActivityLog[]) ?? []);
    }

    const { data: notesData, error: notesError } = await supabase
      .from("daily_staff_notes")
      .select(
        "id, note_date, staff_member_id, staff_member_name, note, created_at"
      )
      .eq("note_date", date)
      .order("created_at", { ascending: false });

    if (notesError) {
      console.error("Greška pri učitavanju napomena:", notesError.message);
      setErrorMessage("Napomene se nisu učitale.");
      setDailyNotes([]);
    } else {
      setDailyNotes((notesData as DailyNote[]) ?? []);
    }

    setIsLoading(false);
  }

  async function addDailyNote() {
    setIsSavingNote(true);
    setErrorMessage("");
    setSuccessMessage("");

    const isAdmin = await checkAdmin();

    if (!isAdmin) {
      setIsSavingNote(false);
      return;
    }

    const selectedStaff = getSelectedStaff();

    if (!selectedStaff) {
      setErrorMessage("Prvo izaberi radnicu na admin početnoj stranici.");
      setIsSavingNote(false);
      return;
    }

    const cleanNote = newNote.trim();

    if (!cleanNote) {
      setErrorMessage("Unesi napomenu.");
      setIsSavingNote(false);
      return;
    }

    const { error } = await supabase.from("daily_staff_notes").insert({
      note_date: selectedDate,
      staff_member_id: selectedStaff.id,
      staff_member_name: selectedStaff.name,
      note: cleanNote,
    });

    if (error) {
      console.error("Greška pri dodavanju napomene:", error.message);
      setErrorMessage("Napomena nije dodana.");
      setIsSavingNote(false);
      return;
    }

    setNewNote("");
    setSuccessMessage("Napomena je dodana.");
    await loadDailyReport(selectedDate);
    setIsSavingNote(false);
  }

  async function deleteDailyNote(note: DailyNote) {
    const confirmed = window.confirm("Da li sigurno želiš obrisati napomenu?");

    if (!confirmed) {
      return;
    }

    setDeletingNoteId(note.id);
    setErrorMessage("");
    setSuccessMessage("");

    const isAdmin = await checkAdmin();

    if (!isAdmin) {
      setDeletingNoteId("");
      return;
    }

    const { error } = await supabase
      .from("daily_staff_notes")
      .delete()
      .eq("id", note.id);

    if (error) {
      console.error("Greška pri brisanju napomene:", error.message);
      setErrorMessage("Napomena nije obrisana.");
      setDeletingNoteId("");
      return;
    }

    setDailyNotes((currentNotes) =>
      currentNotes.filter((item) => item.id !== note.id)
    );

    setDeletingNoteId("");
  }

  useEffect(() => {
    loadDailyReport(selectedDate);
  }, []);

  return (
    <main className="min-h-screen bg-[#fff7f4] text-[#24060b]">
      <section className="border-b border-[#7a1020]/10 bg-white/85 px-4 py-6 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Button asChild variant="ghost" className="mb-3 px-0">
              <Link href="/admin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Nazad na dashboard
              </Link>
            </Button>

            <p className="text-sm uppercase tracking-[0.3em] text-[#8b4a50]">
              Admin
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#24060b]">
              Dnevni izvještaj
            </h1>

            {selectedStaffName ? (
              <p className="mt-1 text-sm text-[#6b3b3f]">
                Trenutno izabrana radnica: {selectedStaffName}
              </p>
            ) : (
              <p className="mt-1 text-sm text-red-600">
                Radnica nije izabrana. Izaberi radnicu na admin početnoj.
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => {
                setSelectedDate(event.target.value);
                loadDailyReport(event.target.value);
              }}
              className="h-10 rounded-full border border-white/20 bg-white px-4 text-sm font-medium text-[#24060b] outline-none transition placeholder:text-[#8b4a50] [color-scheme:light] focus:border-[#7a1020] focus:bg-white"
            />

            <Button variant="outline" onClick={() => loadDailyReport()}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Osvježi
            </Button>
          </div>
        </div>
      </section>

      <section className="px-4 py-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_420px]">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="rounded-3xl">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Aktivnosti</CardTitle>
                  <CalendarDays className="h-5 w-5 text-[#8b4a50]" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold">
                    {isLoading ? "..." : activityLogs.length}
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-base">Napomene</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold">
                    {isLoading ? "..." : dailyNotes.length}
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-base">Datum</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">
                    {selectedDate}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle>Aktivnosti radnica</CardTitle>
              </CardHeader>

              <CardContent>
                {isLoading ? (
                  <div className="rounded-2xl bg-[#fff7f4] p-6 text-center text-[#6b3b3f]">
                    Učitavanje aktivnosti...
                  </div>
                ) : errorMessage ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {errorMessage}
                  </div>
                ) : activityLogs.length === 0 ? (
                  <div className="rounded-2xl bg-[#fff7f4] p-6 text-center text-[#6b3b3f]">
                    Nema aktivnosti za ovaj dan.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activityLogs.map((activity) => (
                      <div
                        key={activity.id}
                        className="rounded-3xl border border-[#7a1020]/10 bg-white/95 p-5"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-[#fff7f4] px-3 py-1 text-xs text-white">
                                {formatTime(activity.created_at)}
                              </span>

                              <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-amber-800">
                                {activity.staff_member_name}
                              </span>

                              {activity.product_code ? (
                                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-[#4f252a]">
                                  {activity.product_code}
                                </span>
                              ) : null}
                            </div>

                            <p className="mt-3 text-sm leading-6 text-[#4f252a]">
                              {activity.note}
                            </p>

                            <div className="mt-3 grid gap-1 text-sm text-[#8b4a50]">
                              {activity.product_name ? (
                                <p>Proizvod: {activity.product_name}</p>
                              ) : null}

                              {activity.customer_name ? (
                                <p>Kupac: {activity.customer_name}</p>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle>Dodaj dnevnu napomenu</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <Textarea
                  value={newNote}
                  onChange={(event) => setNewNote(event.target.value)}
                  rows={5}
                  placeholder="Npr. Sutra provjeriti veličinu M za DMU-0007..."
                />

                {successMessage ? (
                  <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                    {successMessage}
                  </div>
                ) : null}

                {errorMessage ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {errorMessage}
                  </div>
                ) : null}

                <Button
                  type="button"
                  className="w-full rounded-full"
                  disabled={isSavingNote}
                  onClick={addDailyNote}
                >
                  {isSavingNote ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Spremanje...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Dodaj napomenu
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle>Napomene za dan</CardTitle>
              </CardHeader>

              <CardContent>
                {isLoading ? (
                  <div className="rounded-2xl bg-[#fff7f4] p-6 text-center text-[#6b3b3f]">
                    Učitavanje napomena...
                  </div>
                ) : dailyNotes.length === 0 ? (
                  <div className="rounded-2xl bg-[#fff7f4] p-6 text-center text-[#6b3b3f]">
                    Nema napomena za ovaj dan.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dailyNotes.map((note) => (
                      <div
                        key={note.id}
                        className="rounded-3xl border border-[#7a1020]/10 bg-white/95 p-4"
                      >
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-[#24060b]">
                              {note.staff_member_name}
                            </p>
                            <p className="text-xs text-[#8b4a50]">
                              {formatTime(note.created_at)}
                            </p>
                          </div>

                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={deletingNoteId === note.id}
                            onClick={() => deleteDailyNote(note)}
                            className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                          >
                            {deletingNoteId === note.id ? (
                              "..."
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>

                        <p className="text-sm leading-6 text-[#4f252a]">
                          {note.note}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
