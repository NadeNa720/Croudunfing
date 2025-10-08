import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import type { ServiceOption } from "@shared/schema";

interface ServiceCardProps {
  service: ServiceOption;
  selectedService: string | null;
  onSelect: (service: ServiceOption) => void;
}

export default function ServiceCard({ service, selectedService, onSelect }: ServiceCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const isSelected = selectedService === service.id;
  const areaKeys = Object.keys(service.areas);
  const firstArea = areaKeys[0];
  const firstAreaData = firstArea ? service.areas[firstArea] : undefined;
  const isCustomPricing = !firstAreaData || firstAreaData.price === 0;

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

          {/* Значок пакета — берём из service.badge, если есть; иначе показываем по id */}
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
          {/* Цена и длительность для первого диапазона метража */}
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

          {/* Доступные метражи */}
          <div className="text-xs text-muted-foreground">
            Dostępne dla mieszkań: {areaKeys.join(", ")}
          </div>

          {/* Кнопка выбора */}
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

          {/* Переключатель и блок „Zakres usług” */}
          {service.details && (
            <>
              <Button
                type="button"
                variant="link"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails((v) => !v);
                }}
                className="mt-1 p-0 h-auto text-sm"
              >
                {showDetails ? "Ukryj szczegóły" : "Zobacz zakres usług"}
              </Button>

              {showDetails && (
                <div
                  className="mt-1 text-sm text-muted-foreground"
                  // details приходит как безопасный HTML-список из схемы
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
