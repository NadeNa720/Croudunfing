import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import { useLocation } from "wouter";

const VISIBLE_COUNT = 3;

/* Автоподбор изображений из src/assets/realizacje */
const modules = import.meta.glob(
  "../assets/realizacje/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,WEBP}",
  { eager: true, query: "?url", import: "default" }
) as Record<string, string>;

type Photo = { url: string; name: string; order: number };

function parseMeta(path: string): Photo {
  const url = modules[path];
  const file = path.split("/").pop() || "";
  const base = file.replace(/\.[^/.]+$/, "");
  const matchNum = base.match(/(\d+)\s*$/);
  const order = matchNum ? parseInt(matchNum[1], 10) : 0;
  return { url, name: base, order };
}

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

  // запрет скролла фона при открытом лайтбоксе
  useEffect(() => {
    if (!hasLightbox) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [hasLightbox]);

  // клавиши
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

  // свайпы
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
      <Header onScrollToBooking={() => setLocation("/")} />

      {/* Заголовок */}
      <section className="max-w-6xl mx-auto px-4 pt-10 pb-6">
        <h1 className="text-3xl md:text-5xl font-bold leading-tight">
          Nasze <span className="text-blue-600">realizacje</span>
        </h1>
        <p className="mt-3 text-slate-600 max-w-2xl">
          Zobacz wybrane zdjęcia naszych prac. Kliknij jedno z nich, aby
          uruchomić galerię i przeglądać kolejne.
        </p>
      </section>

      {/* Только первые 3 фото + кнопка открыть галерею */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
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

        <div className="mt-4 flex">
          <button
            onClick={() => setLightboxIndex(0)}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
          >
            Zobacz całą galerię ({PHOTOS.length})
          </button>
        </div>
      </section>

      {/* Twój tekst – оформлен и подан блоками */}
      <section className="max-w-6xl mx-auto px-4 pb-16 prose prose-slate md:prose-lg">
        <h2>Meble na wysoki połysk</h2>
        <p>
          Aby zachować wysoki połysk na meblach podczas sprzątania, istnieje
          kilka zasad i praktyk, których warto przestrzegać. Oto kilka
          wskazówek dotyczących sprzątania mebli o wysokim połysku:
        </p>
        <h3>Delikatność w działaniu</h3>
        <p>
          Meble o wysokim połysku są podatne na zarysowania i ślady, dlatego
          korzystaj z miękkich materiałów. Wybieraj delikatne środki
          czyszczące, bez silnych substancji ścierających.
        </p>
        <h3>Wilgotne, nie mokre</h3>
        <p>
          Unikaj zbyt wilgotnych ściereczek. Woda może uszkodzić powierzchnię,
          zwłaszcza jeśli zostanie pozostawiona do wyschnięcia. Używaj lekko
          wilgotnej mikrofibry do kurzu i zabrudzeń.
        </p>
        <h3>Środki do mebli o wysokim połysku</h3>
        <p>
          Używaj dedykowanych środków (spreje/płyny), które czyszczą i
          zabezpieczają powierzchnię.
        </p>
        <h3>Unikaj środków z olejami</h3>
        <p>
          Produkty z olejami mogą zostawiać smugi i zmniejszać połysk. Wybieraj
          lekkie formuły, łatwe do rozprowadzania.
        </p>
        <h3>Odpowiednie ściereczki</h3>
        <p>
          Stosuj mikrofibrę – jest delikatna, nie zostawia śladów i skutecznie
          zbiera kurz.
        </p>
        <h3>Regularne czyszczenie</h3>
        <p>
          Regularna rutyna zapobiega nagromadzeniu brudu i utracie blasku.
        </p>
        <h3>Unikaj promieni słonecznych</h3>
        <p>
          Ustaw meble z dala od bezpośredniego słońca – może powodować
          blaknięcie i mikrouszkodzenia powierzchni.
        </p>
        <h3>Uważaj na zanieczyszczenia</h3>
        <p>
          Kurz działa jak drobny ścierniwo – systematycznie go usuwaj.
        </p>
        <p>
          Pamiętaj, że różne rodzaje mebli mogą wymagać innych metod – zawsze
          sprawdzaj zalecenia producenta.
        </p>

        <h2>Czystość płytek w połysku</h2>
        <p>
          By zachować płytki w czystości, regularnie usuwaj drobne zabrudzenia
          miękką ściereczką lub mopem. Unikaj silnych detergentów i szorstkich
          narzędzi, które mogą rysować powierzchnię.
        </p>
        <p>
          Czyszczenie płytek w połysku wymaga staranności, aby uniknąć smug.
          Środki marki <strong>CLINEX</strong> świetnie się sprawdzają:
        </p>
        <ol>
          <li>
            <strong>Przygotowanie</strong>: odkurz/zmieć, by usunąć piasek i
            kurz (mniej ryzyka rys).
          </li>
          <li>
            <strong>Wybór środka</strong>: np. Clinex DEZOFast lub Clinex W3
            Multi – sprawdź dozowanie na etykiecie.
          </li>
          <li>
            <strong>Roztwór</strong>: rozcieńcz w ciepłej wodzie zgodnie z
            instrukcją.
          </li>
          <li>
            <strong>Mycie</strong>: użyj mikrofibry/mopa, nie zostawiaj nadmiaru
            wody.
          </li>
          <li>
            <strong>Spłukiwanie</strong>: przetrzyj czystą wodą, by usunąć
            resztki środka.
          </li>
          <li>
            <strong>Polerowanie</strong>: sucha, czysta mikrofibra na koniec –
            idealny połysk.
          </li>
        </ol>
        <p>
          Stosowanie się do tych wskazówek zapewni lśniący efekt bez smug.
        </p>

        <h2>Osad z mydła na szybie?</h2>
        <p>
          Przy uporczywym osadzie nałóż odrobinę żelu do naczyń, odczekaj kilka
          minut, przetrzyj i spłucz. Zawsze testuj na małym fragmencie i unikaj
          twardych narzędzi oraz agresywnych chemikaliów.
        </p>
      </section>

      {/* Лайтбокс со слайд-шоу по всем фото */}
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
          <div className="absolute bottom-6 right-6 text-xs md:text-sm text-white/80">
            {lightboxIndex! + 1} / {PHOTOS.length}
          </div>
        </div>
      )}
    </div>
  );
}
