import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import candleMainImage from "../assets/img.png";


interface HeroSectionProps {
  onScrollToBooking: () => void;
}

export default function HeroSection({ onScrollToBooking }: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-br from-background via-muted/20 to-primary/5 py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-6">
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              data-testid="hero-title"
            >
              Marzysz o <span className="text-primary">lśniącym</span> i{" "}
              <span className="text-primary">pachnącym</span> domu?
            </h1>
            
            <p 
              className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0"
              data-testid="hero-description"
            >
              Pomożemy Ci utrzymać czystość każdego pomieszczenia! 
              Profesjonalne sprzątanie mieszkań w Warszawie i okolicach 
              z indywidualnym podejściem do każdego zlecenia.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                onClick={onScrollToBooking}
                size="lg"
                className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                data-testid="button-hero-booking"
              >
                Zarezerwuj teraz
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6"
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                data-testid="button-hero-services"
              >
                Zobacz usługi
              </Button>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2" data-testid="hero-feature-1">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Produkty CLINEX</span>
              </div>
              <div className="flex items-center gap-2" data-testid="hero-feature-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Ubezpieczenie OC</span>
              </div>
              <div className="flex items-center gap-2" data-testid="hero-feature-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Prezent świeczka</span>
              </div>
            </div>
          </div>
          
          {/* Right Content - Candle Images */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative max-w-md w-full">
              <div className="relative">
                <AspectRatio ratio={4/3} className="overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src={candleMainImage}
                    alt="Świeczki zapachowe - prezent dla klientów SprzątanieMieszkań.com"
                    className="object-cover w-full h-full"
                    loading="lazy"
                    decoding="async"
                    data-testid="image-candles-hero"
                  />
                </AspectRatio>
                
                {/* Decorative Elements */}
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary/10 rounded-full blur-2xl"></div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-4 left-4 bg-background border border-primary/20 rounded-lg p-3 shadow-lg">
                <div className="text-center">
                  <div className="text-sm font-semibold text-primary">Prezent</div>
                  <div className="text-xs text-muted-foreground">po każdym zleceniu</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}