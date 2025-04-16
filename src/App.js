import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RestaurantForm from './pages/RestaurantForm';
import NaverLoginSuccess from './components/Auth/NaverLoginSuccess';
import { Container, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const Navigation = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          미슐랭 예약 플랫폼
        </Typography>
        {user ? (
          <Box>
            <Button color="inherit" onClick={logout}>
              로그아웃
            </Button>
          </Box>
        ) : (
          <Box>
            <Button color="inherit" href="/login">
              로그인
            </Button>
            <Button color="inherit" href="/signup">
              회원가입
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <Container>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/restaurants/new" element={<RestaurantForm />} />
            <Route path="/restaurants/edit/:id" element={<RestaurantForm />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <div>메인 페이지</div>
                </PrivateRoute>
              }
            />
            <Route path="/auth/naver/success" element={<NaverLoginSuccess />} />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
