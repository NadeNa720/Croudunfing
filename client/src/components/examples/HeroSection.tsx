import HeroSection from '../HeroSection';

export default function HeroSectionExample() {
  return (
    <HeroSection onScrollToBooking={() => console.log('Scroll to booking')} />
  );
}