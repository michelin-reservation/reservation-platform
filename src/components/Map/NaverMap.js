import React, { useEffect, useState } from 'react';
import { NaverMap, Marker } from 'react-naver-maps';

const NaverMapComponent = ({ latitude, longitude, onLocationSelect }) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    if (map && latitude && longitude) {
      const position = new window.naver.maps.LatLng(latitude, longitude);
      map.setCenter(position);
      
      if (marker) {
        marker.setPosition(position);
      } else {
        const newMarker = new window.naver.maps.Marker({
          position,
          map,
          draggable: true
        });
        
        newMarker.addListener('dragend', (e) => {
          const position = e.latLng;
          if (onLocationSelect) {
            onLocationSelect({
              latitude: position.lat(),
              longitude: position.lng()
            });
          }
        });
        
        setMarker(newMarker);
      }
    }
  }, [map, latitude, longitude]);

  return (
    <NaverMap
      style={{ width: '100%', height: '400px' }}
      defaultCenter={{ lat: 37.5665, lng: 126.9780 }} // 서울 시청 좌표
      defaultZoom={13}
      onLoad={setMap}
    />
  );
};

export default NaverMapComponent; 