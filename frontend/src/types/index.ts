export interface Restaurant {
  id: string;
  tags: string[];
  name: string;
  nameKorean: string;
  category: string;
  address: string;
  image: string;
  lat: number;
  lng: number;
  michelinGuide?: string;
  description?: string;
  menuItems?: MenuItem[];
  openingHours?: OpeningHours;
  services?: string[];
  phone?: string;
  social?: { webpage?: string, instagram?: string };
  ranking?: number;
  galleryImages?: string[];
  reviews?: number;
}

export interface MenuItem {
  name: string;
  nameKorean?: string;
  price: string;
  description?: string;
}

export interface OpeningHours {
  regular: string;
  dayOff?: string;
  breakTime?: string;
  lastOrder?: string;
}