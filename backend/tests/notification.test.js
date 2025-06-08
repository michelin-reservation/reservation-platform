const request = require('supertest');
const { app } = require('../app');
const { User, NotificationSetting } = require('../models');

describe('Notification API', () => {
  let token, userId;

  beforeAll(async () => {
    // 테스트용 유저 생성
    const user = await User.create({ email: 'notiuser@example.com', password: 'pw1234', name: '알림테스트' });
    userId = user.user_id;
    // 로그인 후 토큰 발급
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'notiuser@example.com', password: 'pw1234' });
    token = res.body.token;
  });

  afterAll(async () => {
    await NotificationSetting.destroy({ where: { user_id: userId } });
    await User.destroy({ where: { user_id: userId } });
  });

  it('알림 설정 기본값 조회', async () => {
    const res = await request(app)
      .get('/api/users/notifications')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.reservation_confirmation).toBe(true);
    expect(res.body.marketing_info).toBe(false);
  });

  it('알림 설정 수정', async () => {
    const res = await request(app)
      .put('/api/users/notifications')
      .set('Authorization', `Bearer ${token}`)
      .send({ reservation_confirmation: false, marketing_info: true });
    expect(res.status).toBe(200);
    expect(res.body.settings.reservation_confirmation).toBe(false);
    expect(res.body.settings.marketing_info).toBe(true);
  });

  it('인증 없이 알림 설정 조회 시 실패', async () => {
    const res = await request(app)
      .get('/api/users/notifications');
    expect(res.status).toBe(401);
  });
}); 