import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Clock, Award, Sparkles, CreditCard, User } from "lucide-react";

export default function WhyUsSection() {
  const features = [
    {
      icon: Shield,
      title: "Ubezpieczenie OC",
      description: "Nasza firma posiada pełne ubezpieczenie OC – dla Państwa i naszego bezpieczeństwa. Twoje mieszkanie jest w bezpiecznych rękach."
    },
    {
      icon: User,
      title: "Indywidualne podejście",
      description: "Każde zlecenie wykonujemy w pełni indywidualnie – zgodnie z tym, czego potrzebujesz. Doświadczony personel i najwyższej klasy sprzęt gwarantuje zadowolenie."
    },
    {
      icon: Sparkles,
      title: "Produkty CLINEX",
      description: "Na każde zlecenie przyjeżdżamy z własnymi środkami czystości marki CLINEX oraz odkurzaczem za co nie pobieramy dodatkowych opłat."
    },
    {
      icon: CreditCard,
      title: "Wygodne płatności",
      description: "Akceptujemy różne formy płatności: karta, gotówka, przelew. Wybierz sposób, który jest dla Ciebie najwygodniejszy."
    },
    {
      icon: Clock,
      title: "Punktualność gwarantowana",
      description: "Przyjeżdżamy zawsze na czas. Jeśli spóźnimy się powyżej 15 minut, otrzymasz 10% rabatu."
    },
    {
      icon: Award,
      title: "Doświadczony zespół",
      description: "Nasi specjaliści mają wieloletnie doświadczenie w sprzątaniu mieszkań, apartamentów oraz biur w Warszawie i okolicach."
    }
  ];

  return (
    <section className="py-16 bg-muted/50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Dlaczego my?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Oferujemy profesjonalne usługi sprzątania mieszkań, apartamentów oraz biur w Warszawie i okolicach. 
            Indywidualne podejście do każdego zlecenia gwarantuje zadowolenie każdego naszego Klienta.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="text-center hover-elevate transition-all duration-200" data-testid={`card-feature-${index}`}>
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}