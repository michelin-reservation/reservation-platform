import React, { useEffect, useRef } from 'react';

const NaverMap = ({ latitude = 37.5666805, longitude = 126.9784147, zoom = 15 }) => {
  const mapElement = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const initializeMap = () => {
      if (!window.naver) return;

      // 지도 생성
      const location = new window.naver.maps.LatLng(latitude, longitude);
      const mapOptions = {
        center: location,
        zoom: zoom,
        zoomControl: true,
        zoomControlOptions: {
          position: window.naver.maps.Position.TOP_RIGHT
        }
      };

      // 지도 인스턴스 생성
      mapRef.current = new window.naver.maps.Map(mapElement.current, mapOptions);

      // 마커 생성
      markerRef.current = new window.naver.maps.Marker({
        position: location,
        map: mapRef.current
      });
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
  }, [latitude, longitude, zoom]);

  // 위치나 줌 레벨이 변경될 때 지도 업데이트
  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      const location = new window.naver.maps.LatLng(latitude, longitude);
      mapRef.current.setCenter(location);
      mapRef.current.setZoom(zoom);
      markerRef.current.setPosition(location);
    }
  }, [latitude, longitude, zoom]);

  return (
    <div 
      ref={mapElement} 
      style={{ 
        width: '100%', 
        height: '400px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    />
  );
};

export default NaverMap; 