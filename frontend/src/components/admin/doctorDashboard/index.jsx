"use client";

import { ImageSquare, PencilSimple, Plus, Trash } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

import { useAdminSession } from "@/components/admin/adminShell";
import DoctorFormDialog from "@/components/admin/doctorDashboard/doctorFormDialog";
import DoctorImage from "@/components/doctorImage";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { adminApiRequest } from "@/lib/adminApi";

function sortDoctors(doctors) {
  return [...doctors].sort(
    (firstDoctor, secondDoctor) =>
      firstDoctor.sortOrder - secondDoctor.sortOrder ||
      Number(firstDoctor.id) - Number(secondDoctor.id),
  );
}

function StatusBadge({ isPublished }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-[0.68rem] font-medium ${
        isPublished
          ? "bg-emerald-50 text-emerald-700"
          : "bg-black/[.045] text-black/50"
      }`}
    >
      {isPublished ? "Yayında" : "Gizli"}
    </span>
  );
}

export default function DoctorDashboard() {
  const { logout, token } = useAdminSession();
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formRevision, setFormRevision] = useState(0);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    adminApiRequest("/doctors", { token })
      .then((response) => setDoctors(sortDoctors(response.doctors || [])))
      .catch((error) => {
        if (error.status === 401) {
          logout();
          return;
        }

        toast.add({
          title: "Doktorlar yüklenemedi",
          description: error.message,
          type: "error",
        });
      })
      .finally(() => setIsLoading(false));
  }, [logout, token]);

  function openCreateForm() {
    setEditingDoctor(null);
    setFormRevision((currentRevision) => currentRevision + 1);
    setIsFormOpen(true);
  }

  function openEditForm(doctor) {
    setEditingDoctor(doctor);
    setFormRevision((currentRevision) => currentRevision + 1);
    setIsFormOpen(true);
  }

  function handleFormOpenChange(open) {
    setIsFormOpen(open);
  }

  async function saveDoctor(values) {
    const formData = new FormData();
    const image = values.image?.[0];
    formData.append("title", values.title.trim());
    formData.append("fullName", values.fullName.trim());
    formData.append("sortOrder", String(values.sortOrder));
    formData.append("isPublished", String(values.isPublished));

    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await adminApiRequest(
        editingDoctor ? `/doctors/${editingDoctor.id}` : "/doctors",
        {
          method: editingDoctor ? "PATCH" : "POST",
          token,
          body: formData,
        },
      );
      const savedDoctor = response.doctor;

      setDoctors((currentDoctors) =>
        sortDoctors([
          ...currentDoctors.filter((doctor) => doctor.id !== savedDoctor.id),
          savedDoctor,
        ]),
      );
      toast.add({
        title: editingDoctor ? "Doktor güncellendi" : "Doktor eklendi",
        description: `${savedDoctor.title} ${savedDoctor.fullName} kaydedildi.`,
        type: "success",
      });
      handleFormOpenChange(false);
    } catch (error) {
      if (error.status === 401) {
        logout();
        return;
      }

      toast.add({
        title: "Doktor kaydedilemedi",
        description: error.message,
        type: "error",
      });
    }
  }

  async function deleteDoctor() {
    if (!doctorToDelete) {
      return;
    }

    setIsDeleting(true);

    try {
      await adminApiRequest(`/doctors/${doctorToDelete.id}`, {
        method: "DELETE",
        token,
      });
      setDoctors((currentDoctors) =>
        currentDoctors.filter((doctor) => doctor.id !== doctorToDelete.id),
      );
      toast.add({
        title: "Doktor silindi",
        description: `${doctorToDelete.title} ${doctorToDelete.fullName} listeden kaldırıldı.`,
        type: "success",
      });
      setDoctorToDelete(null);
    } catch (error) {
      if (error.status === 401) {
        logout();
        return;
      }

      toast.add({
        title: "Doktor silinemedi",
        description: error.message,
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  const nextSortOrder = doctors.length
    ? Math.max(...doctors.map((doctor) => doctor.sortOrder)) + 1
    : 1;

  return (
    <main className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10">
      <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium tracking-[0.14em] text-black/42 uppercase">
            İçerik yönetimi
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Doktorlar</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-black/52">
            Doktor sayfasındaki isimleri, fotoğrafları, sıralamayı ve yayın durumunu yönetin.
          </p>
        </div>
        <button
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#1f1f1f] px-4 text-sm font-medium text-white transition-colors hover:bg-[#516fc9]"
          onClick={openCreateForm}
          type="button"
        >
          <Plus aria-hidden="true" weight="light" />
          Doktor ekle
        </button>
      </div>

      <section className="overflow-hidden rounded-xl border border-black/8 bg-white shadow-[0_1px_2px_rgba(0,0,0,.03)]">
        <div className="flex items-center justify-between border-b border-black/8 px-4 py-4 sm:px-5">
          <div>
            <h2 className="text-sm font-semibold">Doktor listesi</h2>
            <p className="mt-1 text-xs text-black/44">{doctors.length} kayıt</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid min-h-56 place-items-center px-5 text-sm text-black/45">
            Doktorlar yükleniyor…
          </div>
        ) : doctors.length ? (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-black/8 text-[0.68rem] font-medium tracking-[0.08em] text-black/42 uppercase">
                    <th className="px-5 py-3">Doktor</th>
                    <th className="px-5 py-3">Sıra</th>
                    <th className="px-5 py-3">Durum</th>
                    <th className="px-5 py-3 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doctor) => (
                    <tr
                      className="border-b border-black/[.06] transition-colors last:border-b-0 hover:bg-black/[.018]"
                      key={doctor.id}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative aspect-[4/5] w-11 shrink-0 overflow-hidden rounded-sm bg-black/[.04]">
                            <DoctorImage
                              alt={`${doctor.title} ${doctor.fullName}`}
                              className="object-cover"
                              fill
                              sizes="44px"
                              src={doctor.imageUrl}
                            />
                          </div>
                          <div>
                            <p className="text-xs text-black/45">{doctor.title}</p>
                            <p className="mt-0.5 text-sm font-medium">{doctor.fullName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-black/58">{doctor.sortOrder}</td>
                      <td className="px-5 py-4">
                        <StatusBadge isPublished={doctor.isPublished} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <button
                            aria-label={`${doctor.fullName} kaydını düzenle`}
                            className="grid size-8 place-items-center rounded-md text-black/48 transition-colors hover:bg-black/[.045] hover:text-black"
                            onClick={() => openEditForm(doctor)}
                            type="button"
                          >
                            <PencilSimple aria-hidden="true" weight="light" />
                          </button>
                          <button
                            aria-label={`${doctor.fullName} kaydını sil`}
                            className="grid size-8 place-items-center rounded-md text-black/48 transition-colors hover:bg-red-50 hover:text-red-600"
                            onClick={() => setDoctorToDelete(doctor)}
                            type="button"
                          >
                            <Trash aria-hidden="true" weight="light" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-black/[.07] md:hidden">
              {doctors.map((doctor) => (
                <article className="p-4 sm:p-5" key={doctor.id}>
                  <div className="flex gap-4">
                    <div className="relative aspect-[4/5] w-16 shrink-0 overflow-hidden rounded-sm bg-black/[.04]">
                      <DoctorImage
                        alt={`${doctor.title} ${doctor.fullName}`}
                        className="object-cover"
                        fill
                        sizes="64px"
                        src={doctor.imageUrl}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-black/45">{doctor.title}</p>
                      <h3 className="mt-0.5 truncate text-sm font-semibold">{doctor.fullName}</h3>
                      <div className="mt-3 flex items-center gap-3">
                        <StatusBadge isPublished={doctor.isPublished} />
                        <span className="text-xs text-black/42">Sıra {doctor.sortOrder}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-black/10 text-xs font-medium transition-colors hover:bg-black/[.025]"
                      onClick={() => openEditForm(doctor)}
                      type="button"
                    >
                      <PencilSimple aria-hidden="true" weight="light" />
                      Düzenle
                    </button>
                    <button
                      className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-red-100 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                      onClick={() => setDoctorToDelete(doctor)}
                      type="button"
                    >
                      <Trash aria-hidden="true" weight="light" />
                      Sil
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="grid min-h-64 place-items-center px-5 text-center">
            <div>
              <ImageSquare className="mx-auto size-7 text-black/28" weight="light" />
              <p className="mt-3 text-sm font-medium">Henüz doktor eklenmedi</p>
              <p className="mt-1 text-xs leading-5 text-black/45">
                İlk doktor kaydını oluşturmak için “Doktor ekle” düğmesini kullanın.
              </p>
            </div>
          </div>
        )}
      </section>

      <DoctorFormDialog
        doctor={editingDoctor}
        formRevision={formRevision}
        nextSortOrder={nextSortOrder}
        onOpenChange={handleFormOpenChange}
        onSubmit={saveDoctor}
        open={isFormOpen}
      />

      <Dialog onOpenChange={(open) => !open && setDoctorToDelete(null)} open={Boolean(doctorToDelete)}>
        <DialogContent className="bg-white p-5 sm:rounded-xl sm:p-6" variant="responsive">
          <DialogTitle className="text-lg font-semibold tracking-[-0.02em]">
            Doktoru silmek istiyor musunuz?
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm leading-6 text-black/52">
            {doctorToDelete
              ? `${doctorToDelete.title} ${doctorToDelete.fullName} doktorlar listesinden kalıcı olarak kaldırılacak.`
              : "Bu kayıt kalıcı olarak kaldırılacak."}
          </DialogDescription>
          <div className="mt-6 flex gap-3 sm:justify-end">
            <DialogClose className="min-h-10 flex-1 rounded-lg border border-black/10 px-4 text-sm font-medium sm:flex-none">
              Vazgeç
            </DialogClose>
            <button
              className="min-h-10 flex-1 rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50 sm:flex-none"
              disabled={isDeleting}
              onClick={deleteDoctor}
              type="button"
            >
              {isDeleting ? "Siliniyor…" : "Doktoru sil"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
