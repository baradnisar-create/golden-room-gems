export const SITE = {
  name: "The Floresta Gir",
  address: "At. Bhojde (Gir), Ta. Talala, Dist. Gir Somnath, Gujarat",
  phone: "+91 70435 07049",
  phoneRaw: "917043507049",
  email: "info@thefloresta.com",
};

export const whatsappLink = (text = "Hello, I would like to know about stay at The Floresta Gir.") =>
  `https://wa.me/${SITE.phoneRaw}?text=${encodeURIComponent(text)}`;

export const ROOMS = [
  { name: "Deluxe Cottage", price: 4500, guests: "2 Adults + 1 Child", desc: "Cosy cottage with private sit-out facing the forest." },
  { name: "Premium Villa", price: 6500, guests: "2 Adults + 2 Children", desc: "Spacious villa with garden view and royal interiors." },
  { name: "Family Suite", price: 8500, guests: "4 Adults + 2 Children", desc: "Two connected rooms, ideal for families and groups." },
  { name: "Royal Pool Villa", price: 11000, guests: "2 Adults + 2 Children", desc: "Our finest stay with plunge pool and jungle view." },
];

export const FACILITIES = [
  { icon: "Waves", title: "Swimming Pool", desc: "Relax in our pool surrounded by greenery." },
  { icon: "UtensilsCrossed", title: "Multi-cuisine Restaurant", desc: "Gujarati, Kathiyawadi, Punjabi & Continental." },
  { icon: "Binoculars", title: "Jungle Safari Help", desc: "We arrange Gir National Park safari permits." },
  { icon: "Wifi", title: "Free Wi‑Fi", desc: "Stay connected across the property." },
  { icon: "Car", title: "Free Parking", desc: "Safe and spacious parking for all guests." },
  { icon: "Flame", title: "Bonfire & Music", desc: "Evening bonfire under the stars." },
  { icon: "Baby", title: "Kids Play Area", desc: "Safe outdoor fun for little ones." },
  { icon: "PartyPopper", title: "Events & Parties", desc: "Birthdays, weddings and corporate meets." },
];

export const VIDEOS = [
  { id: "-XCISXrLkGI", short: false },
  { id: "HVoaVTCBFMQ", short: true },
  { id: "zV6LUtInjxI", short: true },
];
