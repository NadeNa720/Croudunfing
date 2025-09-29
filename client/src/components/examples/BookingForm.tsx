import BookingForm from '../BookingForm';
import { CLEANING_SERVICES } from '@shared/schema';
import { useState } from 'react';

export default function BookingFormExample() {
  const [selectedService] = useState(CLEANING_SERVICES[0]); // Basic service

  const handleSubmit = (formData: any) => {
    console.log('Booking submitted:', formData);
    alert(`Rezerwacja złożona! Usługa: ${formData.service}, Cena: ${formData.price} zł`);
  };

  return (
    <div className="p-6">
      <BookingForm 
        selectedService={selectedService}
        onSubmit={handleSubmit}
      />
    </div>
  );
}