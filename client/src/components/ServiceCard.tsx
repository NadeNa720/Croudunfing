import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import type { ServiceOption } from "@shared/schema";

interface ServiceCardProps {
  service: ServiceOption;
  selectedService: string | null;
  onSelect: (service: ServiceOption) => void;

  // для управления одним открытым блоком
  openDetailsId: string | null;
  setOpenDetailsId: (id: string | null) => void;
}

export default function ServiceCard({
  service,
  selectedService,
  onSelect,
  openDetailsId,
  setOpenDetailsId,
}: ServiceCardProps) {

  const isSelected = selectedService === service.id;
  const areaKeys = useMemo(() => Object.keys(service.areas), [service.areas]);
  const firstArea = areaKeys[0];
  const firstAreaData = firstArea ? service.areas[firstArea] : undefined;
  const isCustomPricing = !firstAreaData || firstAreaData.price === 0;
  const [showDetails, setShowDetails] = useState(false);
  const isOpen = openDetailsId === service.id;

  return (
    <Card
      className={`relative transition-all duration-200 hover-elevate cursor-pointer ${
        isSelected ? "ring-2 ring-primary border-primary" : ""
      }`}
      onClick={() => onSelect(service)}
      data-testid={`card-service-${service.id}`}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg leading-tight">{service.name}</CardTitle>

          {service.badge ? (
            <Badge variant="secondary" className="text-xs">{service.badge}</Badge>
          ) : service.id === "comprehensive" ? (
            <Badge variant="secondary" className="text-xs">Platynowy</Badge>
          ) : service.id === "basic" ? (
            <Badge variant="outline" className="text-xs">Srebrny</Badge>
          ) : null}
        </div>

        <CardDescription className="text-sm leading-relaxed">
          {service.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {firstAreaData && (
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
          )}

          <div className="text-xs text-muted-foreground">
            Dostępne dla mieszkań: {areaKeys.join(", ")}
          </div>

          <Button
            className="w-full font-semibold"
            variant={isSelected ? "default" : "outline"}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(service);
            }}
            data-testid={`button-select-${service.id}`}
          >
            {isSelected ? "WYBRANO" : "ZAREZERWUJ"}
          </Button>

          {service.details && (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDetailsId(isOpen ? null : service.id);
                }}
                className="mt-2 h-8 px-3 text-sm border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100 hover:text-blue-800"
              >
                {isOpen ? "Ukryj szczegóły" : "Zobacz zakres usług"}
              </Button>

              {isOpen && (
                <div
                  className="mt-2 text-sm text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: service.details }}
                />
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
