import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Clock, Euro, MapPin, Phone, Mail, User, CheckCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { ServiceOption, InsertBooking } from '@shared/schema';

interface BookingFormProps {
  selectedService: ServiceOption | null;
  onSubmit: (bookingId: string) => void;
}

export default function BookingForm({ selectedService, onSubmit }: BookingFormProps) {
  const [formData, setFormData] = useState({
    service: '',
    area: '',
    windowOption: '',
    date: '',
    time: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    additionalInfo: '',
    gdprConsent: false
  });

  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);
  const [calculatedDuration, setCalculatedDuration] = useState<string>('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: InsertBooking) => {
      const response = await apiRequest('POST', '/api/bookings', bookingData);
      return response.json();
    },
    onSuccess: (data) => {
      setIsSubmitted(true);
      
      // Show appropriate message based on email status
      if (data.emailError) {
        toast({
          title: "Rezerwacja potwierdzona!",
          description: data.message || `Rezerwacja przyjęta (${data.id.slice(0, 8)}), ale wystąpił problem z e-mailem. Skontaktujemy się telefonicznie.`,
          variant: "default"
        });
      } else {
        toast({
          title: "Rezerwacja potwierdzona!",
          description: data.message || `Dziękujemy! Wysłaliśmy potwierdzenie na Twój e-mail. Numer rezerwacji: ${data.id.slice(0, 8)}`,
        });
      }
      
      onSubmit(data.id);
      // Reset form after success
      setTimeout(() => {
        setFormData({
          service: selectedService?.name || '',
          area: '',
          windowOption: '',
          date: '',
          time: '',
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          address: '',
          additionalInfo: '',
          gdprConsent: false
        });
        setIsSubmitted(false);
      }, 3000);
    },
    onError: (error: any) => {
      toast({
        title: "Błąd",
        description: error.message || "Wystąpił błąd podczas składania rezerwacji. Spróbuj ponownie.",
        variant: "destructive"
      });
    }
  });

  // Update service when selection changes
  useEffect(() => {
    if (selectedService) {
      setFormData(prev => ({
        ...prev,
        service: selectedService.name,
        area: '',
        windowOption: ''
      }));
    }
  }, [selectedService]);

  // Calculate price and duration when area or window option changes
  useEffect(() => {
    if (selectedService && formData.area) {
      const areaData = selectedService.areas[formData.area];
      if (areaData) {
        let price = areaData.price;
        let duration = areaData.duration;
        
        if (formData.windowOption && formData.windowOption !== 'none' && areaData.options) {
          if (formData.windowOption === 'standard' && areaData.options.standard) {
            price = areaData.options.standard.price;
            duration = areaData.options.standard.duration;
          } else if (formData.windowOption === 'nonStandard' && areaData.options.nonStandard) {
            price = areaData.options.nonStandard.price;
            duration = areaData.options.nonStandard.duration;
          }
        }
        
        setCalculatedPrice(price);
        setCalculatedDuration(duration);
      }
    }
  }, [selectedService, formData.area, formData.windowOption]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.service) newErrors.service = 'Wybierz usługę';
    if (!formData.area) newErrors.area = 'Wybierz metraż';
    if (!formData.date) newErrors.date = 'Wybierz datę';
    if (!formData.time) newErrors.time = 'Wybierz godzinę';
    if (!formData.firstName) newErrors.firstName = 'Podaj imię';
    if (!formData.lastName) newErrors.lastName = 'Podaj nazwisko';
    if (!formData.phone) newErrors.phone = 'Podaj numer telefonu';
    if (!formData.email) newErrors.email = 'Podaj adres e-mail';
    if (!formData.address) newErrors.address = 'Podaj adres';
    if (!formData.gdprConsent) newErrors.gdprConsent = 'Wymagana jest zgoda na przetwarzanie danych';
    
    // Email validation
    if (formData.email && !formData.email.includes('@')) {
      newErrors.email = 'Podaj prawidłowy adres e-mail';
    }
    
    // Phone validation
    if (formData.phone && !/^[+]?[0-9\s-]{9,}$/.test(formData.phone)) {
      newErrors.phone = 'Podaj prawidłowy numer telefonu';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Prepare service string that includes window option if selected
      let serviceString = selectedService?.id || formData.service;
      if (formData.windowOption && formData.windowOption !== 'none') {
        const windowText = formData.windowOption === 'standard' 
          ? 'z myciem okien standardowych'
          : 'z myciem okien niestandardowych';
        serviceString = `${serviceString} - ${windowText}`;
      }
      
      const bookingData: InsertBooking = {
        service: serviceString,
        area: formData.area,
        windowOption: formData.windowOption || null,
        date: formData.date,
        time: formData.time,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        additionalInfo: formData.additionalInfo,
        price: calculatedPrice.toString(),
        duration: calculatedDuration
      };
      
      createBookingMutation.mutate(bookingData);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!selectedService) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle>Formularz rezerwacji</CardTitle>
          <CardDescription>
            Wybierz usługę powyżej, aby rozpocząć rezerwację
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-2xl" data-testid="form-booking">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Formularz rezerwacji
        </CardTitle>
        <CardDescription>
          Wypełnij wszystkie pola, aby zarezerwować usługę
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service and Area Selection */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="service">Wybrana usługa</Label>
              <Input
                id="service"
                value={formData.service}
                readOnly
                className="bg-muted"
                data-testid="input-service"
              />
            </div>
            
            <div>
              <Label htmlFor="area">Metraż mieszkania *</Label>
              <Select value={formData.area} onValueChange={(value) => updateField('area', value)}>
                <SelectTrigger data-testid="select-area">
                  <SelectValue placeholder="Wybierz metraż" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(selectedService.areas).map((area) => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.area && <p className="text-sm text-destructive mt-1">{errors.area}</p>}
            </div>
            
            {/* Window options if available */}
            {formData.area && selectedService.areas[formData.area]?.options && (
              <div>
                <Label htmlFor="windowOption">Mycie okien (opcjonalnie)</Label>
                <Select value={formData.windowOption} onValueChange={(value) => updateField('windowOption', value)}>
                  <SelectTrigger data-testid="select-windows">
                    <SelectValue placeholder="Wybierz opcję mycia okien" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Bez mycia okien</SelectItem>
                    {selectedService.areas[formData.area]?.options?.standard && (
                      <SelectItem value="standard">+ Mycie okien standardowej wielkości (1,5m x 1,5m)</SelectItem>
                    )}
                    {selectedService.areas[formData.area]?.options?.nonStandard && (
                      <SelectItem value="nonStandard">+ Mycie okien niestandardowej wielkości (powyżej 1,5m x 1,5m)</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          {/* Price and Duration Display */}
          {formData.area && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Czas trwania: {calculatedDuration}</span>
                </div>
                <div className="flex items-center gap-2">

                  <span className="font-semibold text-lg">
                    {calculatedPrice > 0 ? `${calculatedPrice.toFixed(2)} zł` : 'Wycena indywidualna'}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Data *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => updateField('date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                data-testid="input-date"
              />
              {errors.date && <p className="text-sm text-destructive mt-1">{errors.date}</p>}
            </div>
            
            <div>
              <Label htmlFor="time">Godzina *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => updateField('time', e.target.value)}
                data-testid="input-time"
              />
              {errors.time && <p className="text-sm text-destructive mt-1">{errors.time}</p>}
            </div>
          </div>
          
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <User className="w-5 h-5" />
              Dane kontaktowe
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Imię *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  placeholder="Wprowadź imię"
                  data-testid="input-firstName"
                />
                {errors.firstName && <p className="text-sm text-destructive mt-1">{errors.firstName}</p>}
              </div>
              
              <div>
                <Label htmlFor="lastName">Nazwisko *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  placeholder="Wprowadź nazwisko"
                  data-testid="input-lastName"
                />
                {errors.lastName && <p className="text-sm text-destructive mt-1">{errors.lastName}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Telefon *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+48 512 266 221"
                  data-testid="input-phone"
                />
                {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
              </div>
              
              <div>
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="twoj@email.com"
                  data-testid="input-email"
                />
                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
              </div>
            </div>
            
            <div>
              <Label htmlFor="address">Adres (ulica, nr, miasto, kod pocztowy) *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="ul. Przykładowa 1, 00-001 Warszawa"
                data-testid="input-address"
              />
              {errors.address && <p className="text-sm text-destructive mt-1">{errors.address}</p>}
            </div>
            
            <div>
              <Label htmlFor="additionalInfo">Dodatkowe informacje</Label>
              <Textarea
                id="additionalInfo"
                value={formData.additionalInfo}
                onChange={(e) => updateField('additionalInfo', e.target.value)}
                placeholder="Uwagi dotyczące sprzątania, kody do bramy, itp."
                rows={3}
                data-testid="textarea-additional"
              />
            </div>
          </div>
          
          {/* GDPR Consent */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="gdprConsent"
              checked={formData.gdprConsent}
              onCheckedChange={(checked) => updateField('gdprConsent', checked)}
              data-testid="checkbox-gdpr"
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="gdprConsent" className="text-sm font-normal">
                Wyrażam zgodę na przetwarzanie danych osobowych w celu realizacji rezerwacji. *
              </Label>
              {errors.gdprConsent && <p className="text-sm text-destructive">{errors.gdprConsent}</p>}
            </div>
          </div>
          
          {isSubmitted ? (
            <div className="flex items-center justify-center gap-2 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-600">Rezerwacja potwierdzona!</span>
            </div>
          ) : (
            <Button
              type="submit"
              size="lg"
              className="w-full font-semibold"
              disabled={createBookingMutation.isPending}
              data-testid="button-submit-booking"
            >
              {createBookingMutation.isPending ? 'Przetwarzanie...' : 'Potwierdź rezerwację'}
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}