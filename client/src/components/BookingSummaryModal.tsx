import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, Calendar, MapPin, User, Phone, Mail, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Booking } from "@shared/schema";

interface BookingSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: { id: string } | null;
}

export default function BookingSummaryModal({ isOpen, onClose, bookingData }: BookingSummaryModalProps) {
  const { data: booking, isLoading, error } = useQuery<Booking>({
    queryKey: ['/api/bookings', bookingData?.id],
    enabled: !!bookingData?.id && isOpen,
  });

  if (!bookingData) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl" data-testid="modal-booking-summary">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="ml-2">Ładowanie szczegółów rezerwacji...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !booking) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl" data-testid="modal-booking-summary">
          <div className="text-center py-8">
            <p className="text-destructive">Wystąpił błąd podczas ładowania rezerwacji.</p>
            <Button onClick={onClose} className="mt-4">Zamknij</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto" data-testid="modal-booking-summary">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-green-700 dark:text-green-400">
                Rezerwacja potwierdzona!
              </DialogTitle>
              <DialogDescription>
                Dziękujemy za wybór naszych usług. Oto podsumowanie Twojej rezerwacji.
                <br />
                <span className="font-medium">Numer rezerwacji: {booking.id.slice(0, 8)}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          {/* Service Details */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Szczegóły usługi
              </h3>
              
              <div className="space-y-3">
                <div>
                  <p className="font-medium">{booking.service}</p>
                  <p className="text-sm text-muted-foreground">Metraż: {booking.area}</p>
                  {booking.service.includes('z myciem okien') && (
                    <p className="text-sm text-muted-foreground">
                      + Mycie okien w cenie
                    </p>
                  )}
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Czas trwania: {booking.duration}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-primary">
                      {parseFloat(booking.price) > 0 ? `${parseFloat(booking.price).toFixed(2)} zł` : 'Wycena indywidualna'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Date and Time */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Termin
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Data</p>
                  <p className="font-medium">{formatDate(booking.date)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Godzina</p>
                  <p className="font-medium">{formatTime(booking.time)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Contact Information */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Dane kontaktowe
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Imię i nazwisko</p>
                  <p className="font-medium">{booking.firstName} {booking.lastName}</p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Telefon</p>
                      <p className="font-medium">{booking.phone}</p>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">E-mail</p>
                      <p className="font-medium">{booking.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Adres</p>
                      <p className="font-medium">{booking.address}</p>
                    </div>
                  </div>
                </div>
                
                {booking.additionalInfo && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Dodatkowe informacje</p>
                    <p className="font-medium">{booking.additionalInfo}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Next Steps */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-3">Co dalej?</h3>
              <div className="space-y-2 text-sm">
                <p>• Otrzymasz potwierdzenie rezerwacji na podany adres e-mail</p>
                <p>• Nasz zespół skontaktuje się z Tobą przed wizytą</p>
                <p>• W dniu wizyty nasi specjaliści przyjedą punktualnie</p>
                <p>• W przypadku pytań, skontaktuj się z nami: +48 123 456 789</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex gap-3 mt-6">
          <Button 
            onClick={onClose} 
            className="flex-1" 
            size="lg"
            data-testid="button-close-summary"
          >
            Zamknij
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}