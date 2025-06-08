const request = require('supertest');
const { app } = require('../app');
const { User, Restaurant, Review } = require('../models');

describe('Review API', () => {
  let token, userId, restaurantId, reviewId;

  beforeAll(async () => {
    // 테스트용 유저/식당 생성
    const user = await User.create({ email: 'revuser@example.com', password: 'pw1234', name: '리뷰테스트' });
    userId = user.user_id;
    const restaurant = await Restaurant.create({ name: '리뷰식당', location: '서울' });
    restaurantId = restaurant.restaurant_id;
    // 로그인 후 토큰 발급
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'revuser@example.com', password: 'pw1234' });
    token = res.body.token;
  });

  afterAll(async () => {
    await Review.destroy({ where: { user_id: userId } });
    await Restaurant.destroy({ where: { restaurant_id: restaurantId } });
    await User.destroy({ where: { user_id: userId } });
  });

  it('리뷰 등록', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({ restaurant_id: restaurantId, rating: 5, content: '맛있어요!' });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    reviewId = res.body.id;
  });

  it('식당별 리뷰 목록 조회', async () => {
    const res = await request(app)
      .get('/api/restaurants/' + restaurantId + '/reviews');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('리뷰 등록 실패(인증 없음)', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .send({ restaurant_id: restaurantId, rating: 5, content: '맛없어요!' });
    expect(res.status).toBe(401);
  });

  it('리뷰 상세 조회', async () => {
    const res = await request(app)
      .get(`/api/restaurants/${restaurantId}/reviews/${reviewId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(reviewId);
  });

  it('리뷰 수정', async () => {
    const res = await request(app)
      .put(`/api/restaurants/${restaurantId}/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ rating: 4, content: '수정된 리뷰' });
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/수정/);
  });

  it('리뷰 삭제', async () => {
    const res = await request(app)
      .delete(`/api/restaurants/${restaurantId}/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/삭제/);
  });
}); 