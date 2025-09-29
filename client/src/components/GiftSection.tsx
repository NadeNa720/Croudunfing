import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Heart, Sparkles } from "lucide-react";

export default function GiftSection() {
  return (
    <section id="gift" className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
            <Gift className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary" data-testid="text-gift-title">
            Wyjątkowy Prezent Po Każdym Zleceniu!
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed" data-testid="text-gift-description">
            Dziękujemy, że nam zaufałeś! W podziękowaniu za wybór naszych usług, 
            po każdym zrealizowanym zleceniu otrzymasz od nas wyjątkowy prezent.
          </p>
        </div>
        
        <Card className="text-center overflow-hidden border-2 border-primary/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-6">
            <div className="flex justify-center items-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl md:text-3xl text-primary" data-testid="text-gift-item">
                Świeczka zapachowa
              </CardTitle>
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Wierzymy, że chwila relaksu po dobrze wykonanej pracy jest bezcenna. 
                Nasze świeczki zapachowe to mały gest, który ma na celu umilić Ci czas 
                i stworzyć przytulną atmosferę w Twoim domu.
              </p>
              
              <div className="flex items-center justify-center gap-2 text-primary font-semibold">
                <Heart className="w-5 h-5" />
                <span>To nasze podziękowanie za to, że jesteś z nami!</span>
                <Heart className="w-5 h-5" />
              </div>
              
              <div className="bg-muted/50 rounded-lg p-6 mt-6">
                <h3 className="font-semibold text-lg mb-3" data-testid="text-gift-how-title">Jak to działa?</h3>
                <p className="text-muted-foreground" data-testid="text-gift-how-desc">
                  Po prostu skorzystaj z naszych usług, a po ich zakończeniu, 
                  wraz z finalizacją zlecenia, otrzymasz swoją świeczkę. 
                  <span className="font-semibold text-primary"> To takie proste!</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}