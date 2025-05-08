require('dotenv').config();
const { sequelize, Restaurant } = require('../models');

const sampleRestaurants = [
  {
    name: '서교난면방',
    address: '서울특별시 마포구 동교로 12길, 16',
    district: '합정',
    latitude: 37.5485,
    longitude: 126.9198,
    cuisine: '국수',
    michelinStatus: '빕구르망',
    openTime: '11:00',
    closeTime: '21:00',
    breakStart: '15:00',
    breakEnd: '17:30',
    lastOrder: '20:30',
    closedDays: '',
    phone: '0507-1487-0943',
    facilities: '대관 가능,예약금 0원 결제',
    description: '이탈리안 퀴진 전문 셰프로서 견실한 시간을 보내온 김낙영 셰프의 개성 있는 면 요리 레스토랑 서교난면방. 파스타와 라자냐를 전문적으로 다루던 셰프의 손에서 나온 난면은 그의 경험과 아이디어가 녹아든 한국적이면서도 이탤리언 퀴진의 감성과 터치가 가미된 독창적인 맛의 즐거움을 준다.',
    menu: JSON.stringify([
      { name: '구엄닭 난면', isSignature: true },
      { name: '서교 난면', isSignature: true }
    ])
  }
];

async function seedDatabase() {
  try {
    await sequelize.authenticate();
    console.log('MySQL 연결 성공');

    // 기존 데이터 삭제
    await Restaurant.destroy({ where: {} });
    console.log('기존 레스토랑 데이터 삭제 완료');

    // 새 데이터 추가
    const result = await Restaurant.bulkCreate(sampleRestaurants);
    console.log(`${result.length}개의 레스토랑 데이터 추가 완료`);

    await sequelize.close();
    console.log('MySQL 연결 종료');
  } catch (error) {
    console.error('데이터베이스 시드 오류:', error);
    process.exit(1);
  }
}

seedDatabase(); 