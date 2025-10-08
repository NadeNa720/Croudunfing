import { Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">SprzątanieMieszkań.com</h3>
            <p className="text-primary-foreground/80 mb-4">
              Profesjonalne usługi sprzątania mieszkań w całej Polsce. 
              Zarezerwuj online w 60 sekund.
            </p>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Kontakt</h4>
            <div className="space-y-3 text-primary-foreground/80">
              <div className="flex items-center gap-2" data-testid="footer-phone">
                <Phone className="w-4 h-4" />
                <span>+48 512 266 221</span>
              </div>
              <div className="flex items-center gap-2" data-testid="footer-email">
                <Mail className="w-4 h-4" />
                <span>kontakt@sprzątaniemieszkań.com</span>
              </div>
              <div className="flex items-start gap-2" data-testid="footer-address">
                <MapPin className="w-4 h-4 mt-1" />
                <span>Baśniowa 3/lok 63<br />02-349 Warszawa</span>
              </div>
            </div>
          </div>
          

        
        <hr className="my-8 border-primary-foreground/20" />
        
        <div className="text-center text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} SprzątanieMieszkań.com. Wszystkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  );
}