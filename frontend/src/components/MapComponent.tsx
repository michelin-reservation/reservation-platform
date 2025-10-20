import React, { useEffect, useRef, useState } from 'react';
import { Restaurant } from '../types';
import ReservationModal from '../components/ReservationModal';

interface MapComponentProps {
  restaurants: Restaurant[];
  selectedId?: string;
  height?: string;
}

declare namespace naver.maps {
  class Map {
    constructor(container: HTMLElement, options: MapOptions);
    panTo(latlng: LatLng): void;
  }

  interface MapOptions {
    center: LatLng;
    zoom: number;
  }

  class LatLng {
    constructor(lat: number, lng: number);
  }

  class Marker {
    constructor(options: MarkerOptions);
    setMap(map: Map | null): void;
  }

  interface MarkerOptions {
    position: LatLng;
    map: Map;
    title?: string;
    icon?: MarkerIcon;
  }

  interface MarkerIcon {
    url: string;
    size: Size;
    scaledSize: Size;
    origin: Point;
    anchor: Point;
  }

  class InfoWindow {
    constructor(options: InfoWindowOptions);
    open(map: Map, marker: Marker): void;
  }

  interface InfoWindowOptions {
    content: string;
  }

  class Size {
    constructor(width: number, height: number);
  }

  class Point {
    constructor(x: number, y: number);
  }

  namespace Event {
    function addListener(
      instance: any,
      eventName: string,
      handler: (...args: any[]) => void
    ): void;
  }
}

const MapComponent: React.FC<MapComponentProps> = ({
  restaurants,
  selectedId,
  height = '300px'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<naver.maps.Map | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalRestaurantName, setModalRestaurantName] = useState('');

  const openReservationModal = (restaurantName: string) => {
    setModalRestaurantName(restaurantName);
    setModalOpen(true);
  };

  const initMap = () => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = new naver.maps.Map(mapContainerRef.current, {
        center: new naver.maps.LatLng(37.5665, 126.9780),
        zoom: 10,
      });
    }
  };

  const loadRestaurants = () => {
    if (!mapRef.current) {
      initMap();
    }

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    restaurants.forEach((restaurant) => {
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(restaurant.lat, restaurant.lng),
        map: mapRef.current!,
        title: restaurant.nameKorean,
        icon: {
          url: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2_hdpi.png',
          size: new naver.maps.Size(27, 43),
          scaledSize: new naver.maps.Size(20, 32),
          origin: new naver.maps.Point(0, 0),
          anchor: new naver.maps.Point(10, 32),
        },
      });

      const infoWindowContent = `
        <div style="
          padding:16px;
          font-size:16px;
          border-radius:12px;
          background:#fff;
          box-shadow:0 2px 8px rgba(0,0,0,0.12);
          min-width:180px;
          text-align:left;
          line-height:1.5;
        ">
          <strong style="font-size:18px;">${restaurant.nameKorean}</strong><br>
          <span style="font-size:15px; color:#555;">${restaurant.address}</span><br>
          <button id="reserve-btn-${restaurant.id}"
            style="margin-top:10px; padding:7px 16px; background:	#4B5563; color:white; border:none; border-radius:6px; cursor:pointer; font-size:15px;">
            예약하기
          </button>
        </div>
      `;

      const infoWindow = new naver.maps.InfoWindow({
        content: infoWindowContent,
      });

      naver.maps.Event.addListener(marker, 'click', () => {
        infoWindow.open(mapRef.current!, marker);

        setTimeout(() => {
          const btn = document.getElementById(`reserve-btn-${restaurant.id}`);
          if (btn) {
            btn.onclick = () => openReservationModal(restaurant.nameKorean);
          }
        }, 0);
      });

      markersRef.current.push(marker);
    });
  };

  useEffect(() => {
    if ((window as any).naver && (window as any).naver.maps) {
      initMap();
      loadRestaurants();
    } else {
      // 스크립트가 아직 로드되지 않은 경우를 위한 fallback
      const checkNaverMaps = () => {
        if ((window as any).naver && (window as any).naver.maps) {
          initMap();
          loadRestaurants();
        } else {
          setTimeout(checkNaverMaps, 100);
        }
      };
      checkNaverMaps();
    }
    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
    };
  }, [restaurants]);

  return (
    <>
      <div ref={mapContainerRef} style={{ width: '100%', height: '500px' }} />
      <ReservationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        restaurantName={modalRestaurantName}
      />
    </>
  );
};

export default MapComponent;
