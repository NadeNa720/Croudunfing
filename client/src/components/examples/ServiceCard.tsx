import ServiceCard from '../ServiceCard';
import { CLEANING_SERVICES } from '@shared/schema';
import { useState } from 'react';

export default function ServiceCardExample() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  
  const handleSelect = (service: any) => {
    setSelectedService(service.id);
    console.log('Service selected:', service.name);
  };

  return (
    <div className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Service Cards</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CLEANING_SERVICES.slice(0, 3).map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            selectedService={selectedService}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  );
}