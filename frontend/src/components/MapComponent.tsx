import React, { useEffect, useRef } from 'react';
import { Restaurant } from '../types';

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
        title: restaurant.name,
        icon: {
          url: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2_hdpi.png',
          size: new naver.maps.Size(27, 43),
          scaledSize: new naver.maps.Size(20, 32),
          origin: new naver.maps.Point(0, 0),
          anchor: new naver.maps.Point(10, 32),
        },
      });

      const infoWindow = new naver.maps.InfoWindow({
        content: `
          <div style="padding:10px; font-size:14px;">
            <strong>${restaurant.name}</strong><br>
            ${restaurant.address}<br>
            <button onclick="alert('예약 페이지로 이동합니다.')" 
              style="margin-top:5px; padding:5px 10px; background:#2DB400; color:white; border:none; border-radius:5px; cursor:pointer;">
              예약하기
            </button>
          </div>
        `,
      });

      naver.maps.Event.addListener(marker, 'click', () => {
        infoWindow.open(mapRef.current!, marker);
      });

      markersRef.current.push(marker);
    });
  };

  useEffect(() => {
    const naverMapClientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID;
    if (!naverMapClientId) {
      console.warn('VITE_NAVER_MAP_CLIENT_ID 환경변수가 설정되어 있지 않습니다.');
      return;
    }
    const script = document.createElement("script");
    script.src =
      `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${naverMapClientId}`;
    script.async = true;
    script.onload = () => {
      initMap();
      loadRestaurants();
    };
    document.body.appendChild(script);

    return () => {
      script.remove();
      markersRef.current.forEach((marker) => marker.setMap(null));
    };
  }, []);

  return <div ref={mapContainerRef} style={{ width: '100%', height: '500px' }} />;

    // For this example, we'll just create a placeholder
  //   if (mapRef.current) {
  //     const mapPlaceholder = document.createElement('div');
  //     mapPlaceholder.className = 'w-full h-full bg-gray-200 flex items-center justify-center';
      
  //     const mapContent = document.createElement('div');
  //     mapContent.className = 'text-center p-4';
      
  //     const mapTitle = document.createElement('h3');
  //     mapTitle.className = 'text-lg font-medium text-gray-700 mb-2';
  //     mapTitle.textContent = 'Interactive Map';
      
  //     const mapDescription = document.createElement('p');
  //     mapDescription.className = 'text-sm text-gray-500';
  //     mapDescription.textContent = `Showing ${restaurants.length} restaurants${selectedId ? ' with selected restaurant' : ''}`;
      
  //     mapContent.appendChild(mapTitle);
  //     mapContent.appendChild(mapDescription);
  //     mapPlaceholder.appendChild(mapContent);
      
  //     mapRef.current.innerHTML = '';
  //     mapRef.current.appendChild(mapPlaceholder);
  //   }
  // }, [restaurants, selectedId]);

  // return (
  //   <div 
  //     ref={mapRef} 
  //     className="w-full rounded-lg overflow-hidden shadow-md" 
  //     style={{ height }}
  //   >
  //     {/* Map will be rendered here */}
  //   </div>
  // );
};

export default MapComponent;