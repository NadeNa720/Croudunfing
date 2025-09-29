import Header from '../Header';

export default function HeaderExample() {
  const handleScrollToBooking = () => {
    console.log('Scroll to booking triggered');
  };

  return <Header onScrollToBooking={handleScrollToBooking} />;
}