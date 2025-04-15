import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import MapContainer from './components/Map/MapContainer';

const MapSearch = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(
        `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            'X-NCP-APIGW-API-KEY-ID': process.env.REACT_APP_NAVER_MAP_CLIENT_ID,
            'X-NCP-APIGW-API-KEY': process.env.REACT_APP_NAVER_MAP_CLIENT_SECRET,
          },
        }
      );

      const data = await response.json();
      
      if (data.addresses && data.addresses.length > 0) {
        const { x, y } = data.addresses[0];
        onSearch({
          latitude: parseFloat(y),
          longitude: parseFloat(x),
          address: data.addresses[0].roadAddress || data.addresses[0].jibunAddress
        });
      }
    } catch (error) {
      console.error('위치 검색 중 오류 발생:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="주소 또는 장소를 검색하세요"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
      />
      <Button
        variant="contained"
        onClick={handleSearch}
        sx={{ minWidth: '100px' }}
      >
        검색
      </Button>
    </Box>
  );
};

export default MapSearch; 