import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import { useLocation } from "wouter";

/* Автоподбор всех изображений из src/assets/realizacje */
const modules = import.meta.glob("../assets/realizacje/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,WEBP}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

type Photo = { url: string; name: string; order: number };

/* Преобразование имени файла → порядок сортировки */
function parseMeta(path: string): Photo {
  const url = modules[path];
  const file = path.split("/").pop() || "";
  const base = file.replace(/\.[^/.]+$/, "");
  const matchNum = base.match(/(\d+)\s*$/);
  const order = matchNum ? parseInt(matchNum[1], 10) : 0;
  return { url, name: base, order };
}

/* Отсортированная лента */
const PHOTOS: Photo[] = Object.keys(modules)
  .map(parseMeta)
  .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));

export default function Realizacje() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [location, setLocation] = useLocation();

  const hasLightbox = lightboxIndex !== null;
  const lightboxPhoto = useMemo(
    () => (lightboxIndex !== null ? PHOTOS[lightboxIndex] : null),
    [lightboxIndex]
  );

  // запрет скролла страницы при открытом лайтбоксе
  useEffect(() => {
    if (!hasLightbox) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [hasLightbox]);

  // управление клавиатурой
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

  // свайпы для мобильных
  useEffect(() => {
    if (lightboxIndex === null) return;
    let startX = 0;
    const onStart = (e: TouchEvent) => (startX = e.touches[0].clientX);
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (dx > 60) {
        // влево
        setLightboxIndex((i) =>
          i === null ? null : (i - 1 + PHOTOS.length) % PHOTOS.length
        );
      } else if (dx < -60) {
        // вправо
        setLightboxIndex((i) => (i === null ? null : (i + 1) % PHOTOS.length));
      }
    };
    window.addEventListener("touchstart", onStart);
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [lightboxIndex]);

  return (
    <div className="min-h-screen bg-background">
      {/* 1) Header присутствует и здесь */}
      <Header onScrollToBooking={() => setLocation("/")} />

      {/* Заголовок страницы */}
      <section className="max-w-6xl mx-auto px-4 pt-10 pb-6">
        <h1 className="text-3xl md:text-5xl font-bold leading-tight">
          Nasze <span className="text-blue-600">realizacje</span>
        </h1>
        <p className="mt-3 text-slate-600 max-w-2xl">
          Album zdjęć wykonanych zleceń. Kliknij zdjęcie, aby powiększyć i
          przeglądać kolejne.
        </p>
      </section>

      {/* 2) Альбом без подписей; Masonry-сетка */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
          {PHOTOS.map((p, i) => (
            <img
              key={p.url}
              src={p.url}
              alt={`realizacja ${i + 1}`}
              loading="lazy"
              className="mb-4 break-inside-avoid rounded-2xl shadow border bg-white w-full h-auto block hover:opacity-95 cursor-pointer"
              onClick={() => setLightboxIndex(i)}
            />
          ))}
        </div>
      </section>

      {/* 3) Лайтбокс со слайд-шоу */}
      {hasLightbox && lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <img
            src={lightboxPhoto.url}
            alt=""
            className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl"
          />

          {/* навигация стрелками */}
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

          {/* индикатор / счётчик */}
          <div className="absolute bottom-6 right-6 text-xs md:text-sm text-white/80">
            {lightboxIndex! + 1} / {PHOTOS.length}
          </div>
        </div>
      )}
    </div>
  );
}
