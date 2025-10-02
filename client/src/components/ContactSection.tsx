import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ContactSection() {
  return (
    <section id="kontakt" className="py-16 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="heading-contact-main">
            Skontaktuj się z nami
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Jesteśmy dostępni 7 dni w tygodniu. Skontaktuj się z nami w dogodny dla Ciebie sposób
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Phone Contact */}
          <Card className="text-center hover-elevate" data-testid="card-contact-phone">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Telefon</h3>
              <p className="text-muted-foreground mb-3">Zadzwoń do nas</p>
              <Button variant="outline" size="sm" asChild data-testid="button-call-phone">
                <a href="tel:+48123456789">+48 123 456 789</a>
              </Button>
            </CardContent>
          </Card>

          {/* Email Contact */}
          <Card className="text-center hover-elevate" data-testid="card-contact-email">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">E-mail</h3>
              <p className="text-muted-foreground mb-3">Napisz do nas</p>
              <Button variant="outline" size="sm" asChild data-testid="button-send-email">
                <a href="mailto:kontakt@sprzataniemieszkań.pl">Wyślij wiadomość</a>
              </Button>
            </CardContent>
          </Card>

          {/* WhatsApp Contact */}
          <Card className="text-center hover-elevate" data-testid="card-contact-whatsapp">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">WhatsApp</h3>
              <p className="text-muted-foreground mb-3">Szybki kontakt</p>
              <Button variant="outline" size="sm" asChild data-testid="button-whatsapp">
                <a href="https://wa.me/48123456789" target="_blank" rel="noopener noreferrer">
                  Czat
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="text-center hover-elevate" data-testid="card-contact-location">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Obszar działania</h3>
              <p className="text-muted-foreground mb-3">Warszawa i okolice</p>
              <Button variant="outline" size="sm" asChild data-testid="button-view-areas">
                <a
                  href="https://www.google.com/maps/place/Baśniowa+3,+02-349+Warszawa,+Poland"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Zobacz obszary
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Business Hours & Additional Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Business Hours */}
          <Card data-testid="card-business-hours">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Clock className="h-6 w-6 text-primary mr-3" />
                <h3 className="text-xl font-semibold">Godziny pracy</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Poniedziałek - Piątek</span>
                  <span className="font-medium">8:00 - 20:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sobota</span>
                  <span className="font-medium">8:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Niedziela</span>
                  <span className="font-medium">9:00 - 17:00</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground" data-testid="notice-weekend-surcharge">
                  <strong>Uwaga:</strong> Świadczymy usługi 7 dni w tygodniu. W weekendy możliwa dopłata za usługę w wysokości 20%.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Service Areas */}
          <Card data-testid="card-service-areas" id="obszar-dzialania">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <MapPin className="h-6 w-6 text-primary mr-3" />
                <h3 className="text-xl font-semibold">Obszar działania</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2">Warszawa - wszystkie dzielnice</h4>
                  <p className="text-sm text-muted-foreground">
                    Śródmieście, Mokotów, Wilanów, Ursynów, Ochota, Wola, Żoliborz, Bielany, Targówek,
                    Praga-Południe, Praga-Północ, Bemowo
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Okolice Warszawy</h4>
                  <p className="text-sm text-muted-foreground">
                    Piaseczno, Konstancin-Jeziorna, Wilanów, Michałowice, Józefosław, Skolimów
                    (dojazd bezpłatny do 15 km)
                  </p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground" data-testid="notice-travel-fees">
                  <strong>Dojazd:</strong> Bezpłatny w obrębie Warszawy i do 15 km poza miasto. Powyżej 15 km - 2 zł/km.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* <-- CTA-блок удалён --> */}
      </div>
    </section>
  );
}
