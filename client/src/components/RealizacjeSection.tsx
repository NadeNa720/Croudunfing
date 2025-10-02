import { useEffect, useMemo, useState } from "react";

const modules = import.meta.glob("../assets/realizacje/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,WEBP}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

type Photo = { url: string; name: string; order: number };
function parseMeta(path: string): Photo {
  const url = modules[path];
  const file = path.split("/").pop() || "";
  const base = file.replace(/\.[^/.]+$/, "");
  const m = base.match(/(\d+)\s*$/);
  const order = m ? parseInt(m[1], 10) : 0;
  return { url, name: base, order };
}
const PHOTOS: Photo[] = Object.keys(modules)
  .map(parseMeta)
  .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));

const VISIBLE_COUNT = 3;

export default function RealizacjeSection() {
  const [index, setIndex] = useState<number | null>(null);
  const opened = index !== null;
  const photo = useMemo(() => (index !== null ? PHOTOS[index] : null), [index]);

  useEffect(() => {
    if (!opened) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [opened]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") setIndex(i => (i === null ? null : (i + 1) % PHOTOS.length));
      if (e.key === "ArrowLeft")  setIndex(i => (i === null ? null : (i - 1 + PHOTOS.length) % PHOTOS.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index]);

  return (
    <section id="realizacje" className="max-w-6xl mx-auto px-4 pt-12 pb-12">
      <h2 className="text-3xl font-bold text-blue-600 text-center mb-6">Nasze realizacje</h2>
      <p className="text-center text-muted-foreground mb-8">
        Kliknij zdjęcie, aby uruchomić galerię ({PHOTOS.length}).
      </p>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
        {PHOTOS.slice(0, VISIBLE_COUNT).map((p, i) => (
          <img
            key={p.url}
            src={p.url}
            alt={`realizacja ${i + 1}`}
            loading="lazy"
            className="mb-4 break-inside-avoid rounded-2xl shadow border bg-white w-full h-auto block hover:opacity-95 cursor-pointer"
            onClick={() => setIndex(i)}
          />
        ))}
      </div>

      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setIndex(0)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
        >
          Zobacz całą galerię
        </button>
      </div>

      {opened && photo && (
        <div
          className="fixed inset-0 z-[10000] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setIndex(null)}
        >
          <img src={photo.url} alt="" className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl" />
          <button
            aria-label="Prev"
            className="absolute left-4 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg bg-white/10 text-white"
            onClick={(e) => { e.stopPropagation(); setIndex(i => (i === null ? null : (i - 1 + PHOTOS.length) % PHOTOS.length)); }}
          >
            ←
          </button>
          <button
            aria-label="Next"
            className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg bg-white/10 text-white"
            onClick={(e) => { e.stopPropagation(); setIndex(i => (i === null ? null : (i + 1) % PHOTOS.length)); }}
          >
            →
          </button>
          <div className="absolute bottom-6 right-6 text-xs md:text-sm text-white/80">
            {index! + 1} / {PHOTOS.length}
          </div>
        </div>
      )}
    </section>
  );
}
