import React, { useEffect, useRef, useState } from 'react';
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
    fitBounds(bounds: LatLngBounds): void;
  }

  interface MapOptions {
    center: LatLng;
    zoom: number;
  }

  class LatLng {
    constructor(lat: number, lng: number);
  }

  class LatLngBounds {
    constructor(sw: LatLng, ne: LatLng);
    extend(latlng: LatLng): void;
    isEmpty(): boolean;
  }

  class Marker {
    constructor(options: MarkerOptions);
    setMap(map: Map | null): void;
    getPosition(): LatLng;
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
  height = '500px'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<naver.maps.Map | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);

  const loadRestaurantsOnMap = (currentMap: naver.maps.Map, restaurantsToLoad: Restaurant[]) => {
    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // 새 마커 추가
    restaurantsToLoad.forEach((restaurant) => {
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(restaurant.lat, restaurant.lng),
        map: currentMap,
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
        infoWindow.open(currentMap, marker);
      });

      markersRef.current.push(marker);
    });

    // 모든 마커가 보이도록 지도 범위 조정
    if (restaurantsToLoad.length > 0) {
      const bounds = new naver.maps.LatLngBounds(
        markersRef.current[0].getPosition(),
        markersRef.current[0].getPosition()
      );
      markersRef.current.forEach(marker => bounds.extend(marker.getPosition()));
      currentMap.fitBounds(bounds);
    }
  };

  // 1. 지도 스크립트 로드 및 지도 객체 초기화 (한 번만 실행)
  useEffect(() => {
    const naverMapClientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID;

    // ================= [ DEBUG POINT ] =================
    console.log('🕵️‍♂️ [NAVER MAP DEBUG] .env에서 읽어온 Client ID:', naverMapClientId);
    // =================================================

    if (!naverMapClientId) {
      console.error('❌ [NAVER MAP] 클라이언트 ID가 설정되지 않았습니다. .env 파일을 확인하세요.');
      return;
    }

    const scriptId = 'naver-map-script';
    if (document.getElementById(scriptId)) {
      if (mapContainerRef.current && !map) {
        const initializedMap = new naver.maps.Map(mapContainerRef.current, {
          center: new naver.maps.LatLng(37.5665, 126.9780),
          zoom: 10,
        });
        setMap(initializedMap);
        console.info('[NAVER MAP] 지도 API가 이미 로드되어 있어, 지도를 즉시 초기화합니다.');
      }
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${naverMapClientId}`;
    script.async = true;
    script.onerror = () => {
      console.error('❌ [NAVER MAP] 지도 API 스크립트를 로드하는데 실패했습니다. 스크립트 URL이나 네트워크를 확인하세요.');
    };
    script.onload = () => {
      if (mapContainerRef.current) {
        const initializedMap = new naver.maps.Map(mapContainerRef.current, {
          center: new naver.maps.LatLng(37.5665, 126.9780),
          zoom: 10,
        });
        setMap(initializedMap);
        console.info('[NAVER MAP] 지도 API 초기화 완료. 새로고침 후 확인하세요.');
      }
    };
    document.head.appendChild(script);
  }, []);

  // 2. `map` 객체나 `restaurants` 데이터가 변경될 때 마커 렌더링
  useEffect(() => {
    if (!map || restaurants.length === 0) {
      if (map) { // 레스토랑 데이터가 없는 경우, 기존 마커들만 제거
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];
      }
      return;
    }
    loadRestaurantsOnMap(map, restaurants);
  }, [map, restaurants]);

  return <div ref={mapContainerRef} style={{ width: '100%', height }} />;
};

export default MapComponent;