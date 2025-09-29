import BookingSummaryModal from '../BookingSummaryModal';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function BookingSummaryModalExample() {
  const [isOpen, setIsOpen] = useState(false);
  
  const mockBookingData = {
    service: 'Sprzątanie podstawowe (pakiet srebrny)',
    area: 'do 60 m²',
    windowOption: 'standard',
    date: '2024-01-15',
    time: '10:00',
    firstName: 'Anna',
    lastName: 'Kowalska',
    phone: '+48 123 456 789',
    email: 'anna.kowalska@email.com',
    address: 'ul. Przykładowa 15, 00-001 Warszawa',
    additionalInfo: 'Kod do bramy: 1234',
    price: 699.99,
    duration: '5 godz. 30 min'
  };

  return (
    <div className="p-6">
      <Button onClick={() => setIsOpen(true)} data-testid="button-open-modal">
        Pokaż podsumowanie rezerwacji
      </Button>
      
      <BookingSummaryModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        bookingData={mockBookingData}
      />
    </div>
  );
}