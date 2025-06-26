const request = require('supertest');
const { app } = require('../app');
const { User, Reservation, Review, Favorite, Restaurant } = require('../models/sequelize');
const jwt = require('jsonwebtoken');

describe('User API Tests', () => {
  let testUser;
  let testToken;
  let testRestaurant;

  beforeAll(async () => {
    // 테스트용 사용자 생성
    testUser = await User.create({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      phone: '010-1234-5678'
    });

    // 테스트용 레스토랑 생성
    testRestaurant = await Restaurant.create({
      name: 'Test Restaurant',
      location: 'Test Location',
      owner_id: testUser.user_id
    });

    // JWT 토큰 생성
    testToken = jwt.sign(
      { user_id: testUser.user_id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    // 테스트 데이터 정리
    await Favorite.destroy({ where: { user_id: testUser.user_id } });
    await Review.destroy({ where: { user_id: testUser.user_id } });
    await Reservation.destroy({ where: { user_id: testUser.user_id } });
    await Restaurant.destroy({ where: { restaurant_id: testRestaurant.restaurant_id } });
    await User.destroy({ where: { user_id: testUser.user_id } });
  });

  describe('GET /api/users/reservations', () => {
    it('should return user reservations', async () => {
      // 테스트용 예약 생성
      await Reservation.create({
        user_id: testUser.user_id,
        restaurant_id: testRestaurant.restaurant_id,
        reservation_time: new Date(),
        guest_count: 2,
        name: 'Test Reservation'
      });

      const response = await request(app)
        .get('/api/users/reservations')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('restaurant');
    });
  });

  describe('GET /api/users/reviews', () => {
    it('should return user reviews', async () => {
      // 테스트용 리뷰 생성
      await Review.create({
        user_id: testUser.user_id,
        restaurant_id: testRestaurant.restaurant_id,
        rating: 5,
        content: 'Great experience!'
      });

      const response = await request(app)
        .get('/api/users/reviews')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('restaurant');
    });
  });

  describe('GET /api/users/favorites', () => {
    it('should return user favorites', async () => {
      // 테스트용 관심목록 생성
      await Favorite.create({
        user_id: testUser.user_id,
        restaurant_id: testRestaurant.restaurant_id
      });

      const response = await request(app)
        .get('/api/users/favorites')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('restaurant');
    });
  });

  describe('PUT /api/users/profile', () => {
    it('should update user profile', async () => {
      const updateData = {
        name: 'Updated Name',
        phone: '010-9876-5432'
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${testToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.phone).toBe(updateData.phone);
    });

    it('should validate current password when changing password', async () => {
      const updateData = {
        currentPassword: 'wrongpassword',
        newPassword: 'newpassword123'
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${testToken}`)
        .send(updateData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('현재 비밀번호가 일치하지 않습니다.');
    });

    it('should fail when trying to update email to an already used email', async () => {
      // 중복 이메일 유저 생성
      await User.create({ email: 'dup@example.com', password: 'pw1234', name: '중복' });
      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ email: 'dup@example.com' });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/이미 사용 중인 이메일/);
    });
  });

  it('should return user information', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${testToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe('test@example.com');
  });
}); 