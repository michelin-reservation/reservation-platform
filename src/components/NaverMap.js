import React, { useEffect, useRef } from 'react';

const NaverMap = ({ restaurants, onMarkerClick }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markers = useRef([]);

  useEffect(() => {
    const initializeMap = () => {
      if (!window.naver) return;

      // 지도 생성
      const mapOptions = {
        center: new window.naver.maps.LatLng(37.5666805, 126.9784147), // 서울 시청
        zoom: 14,
        zoomControl: true,
        zoomControlOptions: {
          position: window.naver.maps.Position.TOP_RIGHT
        }
      };

      mapInstance.current = new window.naver.maps.Map(mapRef.current, mapOptions);
    };

    // 네이버 지도 스크립트 로드
    const script = document.createElement('script');
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.REACT_APP_NAVER_MAP_CLIENT_ID}`;
    script.async = true;
    script.onload = initializeMap;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // 레스토랑 마커 업데이트
  useEffect(() => {
    if (!mapInstance.current || !restaurants) return;

    // 기존 마커 제거
    markers.current.forEach(marker => marker.setMap(null));
    markers.current = [];

    // 새 마커 생성
    restaurants.forEach(restaurant => {
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(
          restaurant.location.latitude,
          restaurant.location.longitude
        ),
        map: mapInstance.current,
        title: restaurant.name
      });

      // 마커 클릭 이벤트
      if (onMarkerClick) {
        window.naver.maps.Event.addListener(marker, 'click', () => {
          onMarkerClick(restaurant);
        });
      }

      markers.current.push(marker);
    });
  }, [restaurants, onMarkerClick]);

  return (
    <div 
      ref={mapRef} 
      style={{ width: '100%', height: '500px' }}
    />
  );
};

export default NaverMap; 