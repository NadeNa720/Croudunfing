import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FAQ() {
  const faqs = [
    {
      question: "Jak długo trwa sprzątanie mieszkania?",
      answer: "Czas sprzątania zależy od wybranej usługi i metrażu mieszkania. Sprzątanie podstawowe mieszkania do 60m² trwa około 4 godzin, natomiast sprzątanie kompleksowe może zająć do 6 godzin. Dokładny czas jest podawany przy każdej usłudze."
    },
    {
      question: "Czy dostarczacie własne środki czyszczące?",
      answer: "Tak, w cenie usługi są zawarte wszystkie potrzebne środki czyszczące i sprzęt. Używamy wyłącznie profesjonalnych, bezpiecznych produktów. Jeśli masz specjalne preferencje lub alergie, możesz o tym wspomnieć w dodatkowych informacjach."
    },
    {
      question: "Czy można anulować lub przenieść termin?",
      answer: "Tak, możesz anulować lub przenieść termin bez dodatkowych opłat do 24 godzin przed zaplanowanym czasem wizyty. W przypadku anulacji w krótszym czasie pobieramy opłatę w wysokości 30% wartości usługi."
    },
    {
      question: "W jakich miastach świadczycie usługi?",
      answer: "Działamy w większości dużych miast w Polsce, w tym Warszawa, Kraków, Gdańsk, Wrocław, Poznań, Łódź i wiele innych. Pełna lista dostępnych lokalizacji jest aktualizowana na bieżąco. Skontaktuj się z nami, aby sprawdzić dostępność w Twojej okolicy."
    }
  ];

  return (
    <section id="faq" className="py-16 bg-muted/50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Często zadawane pytania</h2>
          <p className="text-lg text-muted-foreground">
            Znajdź odpowiedzi na najczęściej zadawane pytania
          </p>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} data-testid={`faq-item-${index}`}>
                  <AccordionTrigger className="text-left font-semibold">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}