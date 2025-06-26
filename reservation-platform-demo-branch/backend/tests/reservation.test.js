const request = require('supertest');
const { app } = require('../app');
const { User, Restaurant, Reservation } = require('../models');

describe('Reservation API', () => {
  let token, userId, restaurantId, reservationId;

  beforeAll(async () => {
    // 테스트용 유저/식당 생성
    const user = await User.create({ email: 'resuser@example.com', password: 'pw1234', name: '예약테스트' });
    userId = user.user_id;
    const restaurant = await Restaurant.create({ name: '테스트식당', location: '서울' });
    restaurantId = restaurant.restaurant_id;
    // 로그인 후 토큰 발급
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'resuser@example.com', password: 'pw1234' });
    token = res.body.token;
  });

  afterAll(async () => {
    await Reservation.destroy({ where: { user_id: userId } });
    await Restaurant.destroy({ where: { restaurant_id: restaurantId } });
    await User.destroy({ where: { user_id: userId } });
  });

  it('예약 생성', async () => {
    const res = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${token}`)
      .send({ restaurant_id: restaurantId, reservation_time: new Date(), guest_count: 2, name: '테스트예약' });
    expect(res.status).toBe(201);
    expect(res.body.data).toBeDefined();
    reservationId = res.body.data.reservation_id;
  });

  it('내 예약 목록 조회', async () => {
    const res = await request(app)
      .get('/api/users/' + userId + '/reservations')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('예약 생성 실패(인증 없음)', async () => {
    const res = await request(app)
      .post('/api/reservations')
      .send({ restaurant_id: restaurantId, reservation_time: new Date(), guest_count: 2, name: '테스트예약' });
    expect(res.status).toBe(401);
  });
}); 