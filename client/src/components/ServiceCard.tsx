import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Euro } from "lucide-react";
import type { ServiceOption } from "@shared/schema";

interface ServiceCardProps {
  service: ServiceOption;
  selectedService: string | null;
  onSelect: (service: ServiceOption) => void;
}

export default function ServiceCard({ service, selectedService, onSelect }: ServiceCardProps) {
  const isSelected = selectedService === service.id;
  const firstArea = Object.keys(service.areas)[0];
  const firstAreaData = service.areas[firstArea];
  const isCustomPricing = firstAreaData.price === 0;

  return (
    <Card 
      className={`relative transition-all duration-200 hover-elevate cursor-pointer ${
        isSelected ? 'ring-2 ring-primary border-primary' : ''
      }`}
      onClick={() => onSelect(service)}
      data-testid={`card-service-${service.id}`}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg leading-tight">{service.name}</CardTitle>
          {service.id === 'comprehensive' && (
            <Badge variant="secondary" className="text-xs">Platynowy</Badge>
          )}
          {service.id === 'basic' && (
            <Badge variant="outline" className="text-xs">Srebrny</Badge>
          )}
        </div>
        <CardDescription className="text-sm leading-relaxed">
          {service.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Price and duration for first area */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{firstAreaData.duration}</span>
            </div>
            
            <div className="flex items-center gap-1 font-semibold text-lg">
              {isCustomPricing ? (
                <span className="text-primary">Wycena indywidualna</span>
              ) : (
                <>
                  <span>{firstAreaData.price.toFixed(2)} zł</span>
                  <span className="text-xs text-muted-foreground">od</span>
                </>
              )}
            </div>
          </div>
          
          {/* Area range */}
          <div className="text-xs text-muted-foreground">
            Dostępne dla mieszkań: {Object.keys(service.areas).join(', ')}
          </div>
          
          <Button 
            className="w-full font-semibold"
            variant={isSelected ? 'default' : 'outline'}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(service);
            }}
            data-testid={`button-select-${service.id}`}
          >
            {isSelected ? 'WYBRANO' : 'ZAREZERWUJ'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}