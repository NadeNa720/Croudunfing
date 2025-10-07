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
    return () => {
      document.body.style.overflow = prev;
    };
  }, [opened]);


  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") setIndex((i) => (i === null ? null : (i + 1) % PHOTOS.length));
      if (e.key === "ArrowLeft") setIndex((i) => (i === null ? null : (i - 1 + PHOTOS.length) % PHOTOS.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index]);

  return (
    <>
      <section id="realizacje" className="max-w-6xl mx-auto px-4 pt-12 pb-8">
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
      </section>

      
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-600 text-center mb-6">
          Porady Sprzątaniowe
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <TipCard title="Meble na wysoki połysk — Delikatność w działaniu">
            Meble o wysokim połysku są podatne na zarysowania i ślady, dlatego korzystaj z miękkich
            materiałów, aby uniknąć uszkodzeń. Wybieraj delikatne środki czyszczące, które nie zawierają
            silnych substancji ścierających.
          </TipCard>

          <TipCard title="Meble na wysoki połysk — Wilgotne, nie mokre">
            Unikaj używania zbyt wilgotnej ściereczki lub gąbki. Woda może uszkodzić powierzchnię mebli –
            używaj lekko wilgotnej mikrofibry.
          </TipCard>

          <TipCard title="Meble na wysoki połysk — Środki do połysku">
            Wybieraj specjalne środki do mebli o wysokim połysku (spreje/płyny), które czyszczą i
            jednocześnie zabezpieczają powierzchnię.
          </TipCard>

          <TipCard title="Meble na wysoki połysk — Unikaj olejów">
            Środki z olejami mogą zostawiać smugi i zmniejszać połysk. Wybieraj lekkie formuły.
          </TipCard>

          <TipCard title="Meble na wysoki połysk — Odpowiednie ściereczki">
            Mikrofibra jest delikatna, nie zostawia śladów i skutecznie zbiera kurz.
          </TipCard>

          <TipCard title="Meble na wysoki połysk — Regularne czyszczenie">
            Rutyna zapobiega nagromadzeniom i utracie blasku.
          </TipCard>

          <TipCard title="Meble na wysoki połysk — Unikaj słońca">
            Bezpośrednie promienie mogą powodować blaknięcie i mikrouszkodzenia powierzchni.
          </TipCard>

          <TipCard title="Meble na wysoki połysk — Uważaj na zanieczyszczenia">
            Kurz działa jak drobne ścierniwo — usuwaj go systematycznie.
          </TipCard>
        </div>

        <p className="text-center mt-6 italic text-sm text-muted-foreground">
          Pamiętaj, że różne rodzaje mebli mogą wymagać różnych podejść — zawsze sprawdzaj zalecenia producenta.
        </p>
      </section>


      {opened && photo && (
        <div
          className="fixed inset-0 z-[10000] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setIndex(null)}
        >
          <img src={photo.url} alt="" className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl" />
          <button
            aria-label="Prev"
            className="absolute left-4 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => (i === null ? null : (i - 1 + PHOTOS.length) % PHOTOS.length));
            }}
          >
            ←
          </button>
          <button
            aria-label="Next"
            className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => (i === null ? null : (i + 1) % PHOTOS.length));
            }}
          >
            →
          </button>
          <div className="absolute bottom-6 right-6 text-xs md:text-sm text-white/80">
            {index! + 1} / {PHOTOS.length}
          </div>
        </div>
      )}
    </>
  );
}

/** Карточка-совет */
function TipCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-muted/40 rounded-2xl p-5 shadow">
      <h3 className="font-semibold text-blue-600 mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{children}</p>
    </div>
  );
}
