import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  MenuItem,
  IconButton,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const DAYS_OF_WEEK = [
  { value: 'monday', label: '월요일' },
  { value: 'tuesday', label: '화요일' },
  { value: 'wednesday', label: '수요일' },
  { value: 'thursday', label: '목요일' },
  { value: 'friday', label: '금요일' },
  { value: 'saturday', label: '토요일' },
  { value: 'sunday', label: '일요일' }
];

const PRICE_RANGES = [
  { value: '₩', label: '₩ (1만원 미만)' },
  { value: '₩₩', label: '₩₩ (1-3만원)' },
  { value: '₩₩₩', label: '₩₩₩ (3-5만원)' },
  { value: '₩₩₩₩', label: '₩₩₩₩ (5만원 이상)' }
];

const RestaurantForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    location: {
      type: 'Point',
      coordinates: [0, 0] // [경도, 위도]
    },
    phone: '',
    cuisine: '',
    priceRange: '',
    capacity: '',
    businessHours: [],
    menu: []
  });

  useEffect(() => {
    if (id) {
      // 레스토랑 정보 불러오기
      const fetchRestaurant = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/restaurants/${id}`);
          if (response.data.success) {
            setFormData(response.data.data);
          }
        } catch (error) {
          setError('레스토랑 정보를 불러오는데 실패했습니다.');
        }
      };
      fetchRestaurant();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleBusinessHoursChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      businessHours: prev.businessHours.map((hours, i) =>
        i === index ? { ...hours, [field]: value } : hours
      )
    }));
  };

  const addBusinessHours = () => {
    setFormData(prev => ({
      ...prev,
      businessHours: [
        ...prev.businessHours,
        { day: '', open: '', close: '', isClosed: false }
      ]
    }));
  };

  const removeBusinessHours = (index) => {
    setFormData(prev => ({
      ...prev,
      businessHours: prev.businessHours.filter((_, i) => i !== index)
    }));
  };

  const handleMenuChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      menu: prev.menu.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addMenuItem = () => {
    setFormData(prev => ({
      ...prev,
      menu: [
        ...prev.menu,
        { name: '', description: '', price: '', category: '' }
      ]
    }));
  };

  const removeMenuItem = (index) => {
    setFormData(prev => ({
      ...prev,
      menu: prev.menu.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = id
        ? `${process.env.REACT_APP_API_URL}/api/restaurants/${id}`
        : `${process.env.REACT_APP_API_URL}/api/restaurants`;
      const method = id ? 'put' : 'post';
      
      const response = await axios[method](url, formData);
      if (response.data) {
        navigate('/restaurants');
      }
    } catch (error) {
      setError(error.response?.data?.message || '레스토랑 저장에 실패했습니다.');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            {id ? '레스토랑 수정' : '레스토랑 등록'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              {/* 기본 정보 */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  기본 정보
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="레스토랑 이름"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="설명"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  required
                />
              </Grid>

              {/* 주소 정보 */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  주소
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="도로명 주소"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="도시"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="시/도"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="우편번호"
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleChange}
                  required
                />
              </Grid>

              {/* 연락처 및 기타 정보 */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  연락처 및 기타 정보
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="전화번호"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="음식 종류"
                  name="cuisine"
                  value={formData.cuisine}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="가격대"
                  name="priceRange"
                  value={formData.priceRange}
                  onChange={handleChange}
                  required
                >
                  {PRICE_RANGES.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="수용 가능 인원"
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                />
              </Grid>

              {/* 영업 시간 */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">영업 시간</Typography>
                  <IconButton onClick={addBusinessHours} color="primary">
                    <AddIcon />
                  </IconButton>
                </Box>
                {formData.businessHours.map((hours, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          select
                          label="요일"
                          value={hours.day}
                          onChange={(e) => handleBusinessHoursChange(index, 'day', e.target.value)}
                          required
                        >
                          {DAYS_OF_WEEK.map((day) => (
                            <MenuItem key={day.value} value={day.value}>
                              {day.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label="오픈 시간"
                          type="time"
                          value={hours.open}
                          onChange={(e) => handleBusinessHoursChange(index, 'open', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label="마감 시간"
                          type="time"
                          value={hours.close}
                          onChange={(e) => handleBusinessHoursChange(index, 'close', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <IconButton onClick={() => removeBusinessHours(index)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </Grid>

              {/* 메뉴 */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">메뉴</Typography>
                  <IconButton onClick={addMenuItem} color="primary">
                    <AddIcon />
                  </IconButton>
                </Box>
                {formData.menu.map((item, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label="메뉴 이름"
                          value={item.name}
                          onChange={(e) => handleMenuChange(index, 'name', e.target.value)}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label="설명"
                          value={item.description}
                          onChange={(e) => handleMenuChange(index, 'description', e.target.value)}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          label="가격"
                          type="number"
                          value={item.price}
                          onChange={(e) => handleMenuChange(index, 'price', e.target.value)}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          label="카테고리"
                          value={item.category}
                          onChange={(e) => handleMenuChange(index, 'category', e.target.value)}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <IconButton onClick={() => removeMenuItem(index)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </Grid>

              {/* 제출 버튼 */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ mt: 3 }}
                >
                  {id ? '레스토랑 수정' : '레스토랑 등록'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RestaurantForm; 