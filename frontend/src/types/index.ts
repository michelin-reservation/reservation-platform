export interface Restaurant {
  id: string;
  name: string;
  nameKorean: string;
  category: string;
  address: string;
  image: string;
  lat: number;
  lng: number;
  michelin?: boolean;
  description?: string;
  menuItems?: MenuItem[];
  openingHours?: OpeningHours;
  services?: string[];
  phone?: string;
  social?: { instagram?: string };
  ranking?: number;
  galleryImages?: string[];
  reviews?: number;
}

export interface MenuItem {
  name: string;
  nameKorean?: string;
  price: number;
  description?: string;
}

export interface OpeningHours {
  regular: string;
  breakTime?: string;
  lastOrder?: string;
}