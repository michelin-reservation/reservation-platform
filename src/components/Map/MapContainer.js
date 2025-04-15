import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import NaverMap from './NaverMap';
import MapSearch from './MapSearch';

const MapContainer = ({ onLocationSelect }) => {
  const [location, setLocation] = useState({
    latitude: 37.5665,
    longitude: 126.9780,
    address: ''
  });

  const handleSearch = (newLocation) => {
    setLocation(newLocation);
    if (onLocationSelect) {
      onLocationSelect(newLocation);
    }
  };

  const handleMarkerDrag = (newLocation) => {
    setLocation(prev => ({
      ...prev,
      ...newLocation
    }));
    if (onLocationSelect) {
      onLocationSelect({
        ...location,
        ...newLocation
      });
    }
  };

  return (
    <Box>
      <MapSearch onSearch={handleSearch} />
      <NaverMap
        latitude={location.latitude}
        longitude={location.longitude}
        onLocationSelect={handleMarkerDrag}
      />
      {location.address && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          선택된 위치: {location.address}
        </Typography>
      )}
    </Box>
  );
};

export default MapContainer; 