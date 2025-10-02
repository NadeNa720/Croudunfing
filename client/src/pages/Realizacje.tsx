import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import { useLocation } from "wouter";

const VISIBLE_COUNT = 3;

/** Автоподбор фото из src/assets/realizacje */
const modules = import.meta.glob(
  "../assets/realizacje/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,WEBP}",
  { eager: true, query: "?url", import: "default" }
) as Record<string, string>;

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

export default function Realizacje() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [location, setLocation] = useLocation();

  const opened = lightboxIndex !== null;
  const photo = useMemo(
    () => (lightboxIndex !== null ? PHOTOS[lightboxIndex] : null),
    [lightboxIndex]
  );

  // Блокируем скролл фона при открытом лайтбоксе
  useEffect(() => {
    if (!opened) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [opened]);

  // Клавиши
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

  // Свайпы
  useEffect(() => {
    if (lightboxIndex === null) return;
    let startX = 0;
    const onStart = (e: TouchEvent) => (startX = e.touches[0].clientX);
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (dx > 60) {
        setLightboxIndex((i) =>
          i === null ? null : (i - 1 + PHOTOS.length) % PHOTOS.length
        );
      } else if (dx < -60) {
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
      {/* Header (прячем при открытом лайтбоксе) */}
      <div
        aria-hidden={opened}
        className={
          "transition-opacity duration-200 " +
          (opened ? "opacity-0 pointer-events-none" : "opacity-100")
        }
      >
        <Header onScrollToBooking={() => setLocation("/")} />
      </div>

      {/* Hero */}
      <section className="text-center py-16 bg-muted/40">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Porady i <span className="text-blue-600">Realizacje</span>
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Przykłady naszej pracy + praktyczne wskazówki do sprzątania. Wszystko w jednym miejscu!
          </p>
        </div>
      </section>

      {/* Realizacje — только 3 фото */}
      <section className="max-w-6xl mx-auto px-4 pt-12 pb-8">
        <h2 className="text-3xl font-bold text-blue-600 text-center mb-6">Nasze Realizacje</h2>
        <p className="text-center text-muted-foreground mb-8">
          Zobacz efekty naszej pracy – kliknij zdjęcie, aby uruchomić galerię i przeglądać kolejne.
        </p>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
          {PHOTOS.slice(0, VISIBLE_COUNT).map((p, i) => (
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

        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setLightboxIndex(0)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
          >
            Zobacz całą galerię ({PHOTOS.length})
          </button>
        </div>
      </section>

      {/* ТОЛЬКО 8 карточек под фотками */}
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

      {/* Лайтбокс */}
      {opened && photo && (
        <div
          className="fixed inset-0 z-[10000] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <img
            src={photo.url}
            alt=""
            className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl"
          />
          <button
            aria-label="Prev"
            className="absolute left-4 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg bg-white/10 text-white"
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
            className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg bg-white/10 text-white"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((i) =>
                i === null ? null : (i + 1) % PHOTOS.length
              );
            }}
          >
            →
          </button>
          <div className="absolute bottom-6 right-6 text-xs text-white/80">
            {lightboxIndex! + 1} / {PHOTOS.length}
          </div>
        </div>
      )}

      {/* Синий футер */}
      <section className="bg-[#4773c1] text-white py-12 mt-8">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-3">SprzątanieMieszkań.com</h3>
            <p>
              Profesjonalne usługi sprzątania mieszkań w całej Polsce. Zarezerwuj online w 60 sekund.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">Kontakt</h4>
            <ul className="space-y-2 text-white/90">
              <li>+48 123 456 789</li>
              <li>kontakt@sprzatanieniemieszkan.com</li>
              <li>Baśniowa 3/lok 63, 02-349 Warszawa</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">Informacje</h4>
            <ul className="space-y-2 text-white/90">
              <li>Polityka prywatności</li>
              <li>Regulamin usług</li>
              <li>Często zadawane pytania</li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 mt-8 border-t border-white/20 pt-4 text-center text-white/80">
          © 2025 SprzątanieMieszkań.com. Wszystkie prawa zastrzeżone.
        </div>
      </section>
    </div>
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
