export default function ReviewsSection() {
  return (
    <section id="opinie" className="py-16 bg-muted/40">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Opinie naszych klientów</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Zobacz, co mówią o nas klienci na Google Maps
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-6">
          <a
            href="https://maps.app.goo.gl/ioMQBQqnTBWs6gFX8"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow font-medium"
          >
            ⭐ Zobacz opinie na Google Maps
          </a>
          <a
            href="https://maps.app.goo.gl/ioMQBQqnTBWs6gFX8"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-white border shadow hover:bg-muted"
          >
            📝 Dodaj swoją opinię
          </a>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Źródło: Google Maps
        </p>
      </div>
    </section>
  );
}
