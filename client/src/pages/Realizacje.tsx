import { useEffect, useMemo, useState } from "react";

/** 1) Собираем все фото из папки src/assets/realizacje */
const modules = import.meta.glob("../assets/realizacje/*.{jpg,jpeg,png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

type Photo = { url: string; name: string; order: number };

/** Превращаем './.../Cleaning_Images01.jpg' -> { name: 'Cleaning Images 01', order: 1 } */
function parseMeta(path: string): Photo {
  const url = modules[path];
  const file = path.split("/").pop() || "";
  const base = file.replace(/\.[^/.]+$/, ""); // без расширения
  // humanize: '_' -> ' ', вставить пробел перед цифрами, убрать двойные пробелы
  const pretty = base
    .replace(/_/g, " ")
    .replace(/(\d+)/g, " $1")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase()); // каждое слово с заглавной
  // вытащим число в конце (если есть) для сортировки
  const matchNum = base.match(/(\d+)\s*$/);
  const order = matchNum ? parseInt(matchNum[1], 10) : 0;
  return { url, name: pretty, order };
}

const PHOTOS: Photo[] = Object.keys(modules)
  .map(parseMeta)
  .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));

export default function Realizacje() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const hasLightbox = lightboxIndex !== null;

  // обработчики клавиатуры для лайтбокса
  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight")
        setLightboxIndex((i) => (i === null ? null : (i + 1) % PHOTOS.length));
      if (e.key === "ArrowLeft")
        setLightboxIndex((i) =>
          i === null ? null : (i - 1 + PHOTOS.length) % PHOTOS.length
        );
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex]);

  const lightboxPhoto = useMemo(
    () => (lightboxIndex !== null ? PHOTOS[lightboxIndex] : null),
    [lightboxIndex]
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Заголовок */}
      <h1 className="text-3xl md:text-5xl font-bold mb-3">
        Nasze <span className="text-blue-600">realizacje</span>
      </h1>
      <p className="mb-8 text-slate-600 max-w-2xl">
        Album zdjęć wykonanych zleceń. Kliknij na zdjęcie, aby powiększyć.
      </p>

      {/* Masonry-сетка */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
        {PHOTOS.map((p, i) => (
          <figure
            key={p.url}
            className="mb-4 break-inside-avoid rounded-2xl overflow-hidden shadow border bg-white"
          >
            <img
              src={p.url}
              alt={p.name}
              loading="lazy"
              className="w-full h-auto block hover:opacity-95 cursor-pointer"
              onClick={() => setLightboxIndex(i)}
            />
            <figcaption className="px-3 py-2 text-xs text-slate-500">
              {p.name}
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Лайтбокс */}
      {hasLightbox && lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <img
            src={lightboxPhoto.url}
            alt={lightboxPhoto.name}
            className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl"
          />
          {/* Подпись снизу справа */}
          <div className="absolute bottom-6 right-6 text-xs md:text-sm text-white/80">
            {lightboxPhoto.name}
          </div>
          {/* Навигация стрелками (клики) */}
          <button
            aria-label="Prev"
            className="absolute left-4 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg bg-white/10 text-white backdrop-blur hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((i) =>
                i === null ? null : (i - 1 + PHOTOS.length) % PHOTOS.length
              );
            }}
          >
            ←
          </button>
          <button
            aria-label="Next"
            className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg bg-white/10 text-white backdrop-blur hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((i) =>
                i === null ? null : (i + 1) % PHOTOS.length
              );
            }}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
