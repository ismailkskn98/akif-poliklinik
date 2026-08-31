import { cache } from "react";

export const fallbackDoctors = [
  {
    id: "yusuf-cinar",
    title: "Dr.",
    fullName: "Yusuf Çınar",
    imageUrl: "/images/doctors/dr-yusuf-cinar.jpg",
    sortOrder: 1,
  },
  {
    id: "mustafa-kantar",
    title: "Dr.",
    fullName: "Mustafa Kantar",
    imageUrl: "/images/doctors/dr-mustafa-kantar.jpg",
    sortOrder: 2,
  },
  {
    id: "ugur-ozlu",
    title: "Dr.",
    fullName: "Uğur Özlü",
    imageUrl: "/images/doctors/dr-ugur-ozlu.jpg",
    sortOrder: 3,
  },
  {
    id: "dagistan-altug",
    title: "Dr.",
    fullName: "Dağıstan Altuğ",
    imageUrl: "/images/doctors/dr-dagistan-altug.jpg",
    sortOrder: 4,
  },
  {
    id: "sati-zeynep-tekin",
    title: "Uzman Dr.",
    fullName: "Satı Zeynep Tekin",
    imageUrl: "/images/doctors/uzman-dr-sati-zeynep-tekin.jpg",
    sortOrder: 5,
  },
];

function normalizeDoctors(doctors) {
  if (!Array.isArray(doctors)) {
    return fallbackDoctors;
  }

  return doctors
    .filter(
      (doctor) =>
        doctor &&
        typeof doctor.fullName === "string" &&
        doctor.fullName.trim() &&
        typeof doctor.imageUrl === "string" &&
        doctor.imageUrl.trim(),
    )
    .map((doctor) => ({
      id: doctor.id,
      title: typeof doctor.title === "string" ? doctor.title.trim() : "",
      fullName: doctor.fullName.trim(),
      imageUrl: doctor.imageUrl.trim(),
      sortOrder: Number(doctor.sortOrder) || 0,
    }));
}

export const getPublicDoctors = cache(async (locale = "tr") => {
  const apiBaseUrl =
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:4000/api/akifclinic/v1";

  try {
    const response = await fetch(`${apiBaseUrl}/public/doctors`, {
      cache: "no-store",
      headers: { "Accept-Language": locale },
      signal: AbortSignal.timeout(2500),
    });

    if (!response.ok) {
      return fallbackDoctors;
    }

    const payload = await response.json();
    return normalizeDoctors(payload.data?.doctors);
  } catch {
    return fallbackDoctors;
  }
});
