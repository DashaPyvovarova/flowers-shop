const quotes = [
  '🌷 Квіти – найкращий спосіб сказати те, чого не скажеш словами.',
  '💐 Твори добро – надсилай букети!',
  '🌼 Один букет може зробити день кращим.',
  '🌹 Не забувай тішити себе та інших дрібницями.',
  '🌻 Кожна квітка – як усмішка в кольорі.',
];

export default function AppFooter() {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  return (
    <div className="my-4 text-sm italic text-gray-600 text-center">
      { quote }
    </div>
  );
}
