import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServiceCard from "@/components/ServiceCard";
import BookingForm from "@/components/BookingForm";
import BookingSummaryModal from "@/components/BookingSummaryModal";
import WhyUsSection from "@/components/WhyUsSection";
import VideoSection from "@/components/VideoSection";
import FAQ from "@/components/FAQ";
import GiftSection from "@/components/GiftSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import RealizacjeSection from "@/components/RealizacjeSection";
import { CLEANING_SERVICES, type ServiceOption } from "@shared/schema";

export default function Home() {
  const [selectedService, setSelectedService] = useState<ServiceOption | null>(null);
  const [bookingData, setBookingData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const bookingRef = useRef<HTMLDivElement>(null);

  const handleServiceSelect = (service: ServiceOption) => {
    setSelectedService(service);
    // после выбора услуги — пролистываем к форме
    setTimeout(() => {
      bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleBookingSubmit = (bookingId: string) => {
    setBookingData({ id: bookingId });
    setIsModalOpen(true);
  };

  const handleScrollToBooking = () => {
    if (!selectedService) {
      document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
    } else {
      bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Плавный скролл при переходе с /#hash
  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.replace("#", "");
      if (!id) return;
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    };
    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  return (
    <div className="min-h-screen bg-background" data-testid="page-home">
      <Header onScrollToBooking={handleScrollToBooking} />
      <HeroSection onScrollToBooking={handleScrollToBooking} />

      {/* Services Section */}
      <section id="services" className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nasze usługi</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Wybierz spośród naszych profesjonalnych usług sprzątania dostosowanych do Twoich potrzeb
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CLEANING_SERVICES.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                selectedService={selectedService?.id || null}
                onSelect={handleServiceSelect}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section id="booking" ref={bookingRef} className="py-16 bg-muted/50">
        <div className="max-w-6xl mx-auto px-4">
          <BookingForm selectedService={selectedService} onSubmit={handleBookingSubmit} />
        </div>
      </section>

      <WhyUsSection />
      <section id="video"><VideoSection /></section>
      <section id="faq"><FAQ /></section>
      <section id="gift"><GiftSection /></section>
      <section id="kontakt"><ContactSection /></section>

      {/* Примеры (галерея) в самом низу главной */}
      <RealizacjeSection />

      <Footer />

      <BookingSummaryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bookingData={bookingData}
      />
    </div>
  );
}
