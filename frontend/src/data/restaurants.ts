import { Restaurant } from '../types';

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Seogyonamnyeongbang',
    nameKorean: '서교난면방',
    category: 'Michelin Recommended',
    address: '서울특별시 마포구 동교로 12길 16',
    image: 'https://images.pexels.com/photos/2290070/pexels-photo-2290070.jpeg',
    lat: 37.563,
    lng: 126.927,
    michelin: true,
    description: '이탈리안과 한식 전통 레스토랑. 세프로서 건정한 지진한 뛰어난 컨념의 셰프의 개성 있는 또 모히 레스토랑 서교난면방. 파스타와 라자니아 전문적으로 다루며 세프의 손에서 나온 다양한 그의 정형화 아이디어가 녹아든 한국적인맛도 이곳의 매력의 강점과 되다가 가까운 독창적인 맛의 출거움을 준다. 세프는 이 독특한 결과 사람들에게 전물을 유지하면서 식 넘보의 매력을 제대로 전달하고 있다. 구황한 난면, 그리고 돼 육육의 반주 속으로 허어 만든 시금 나만의 돼 매력적인 국물 맛과 난면의 식감을 즐길 수 있는 면 요리가 대표 메뉴다. 이 외에도 계절에 따라 달라지는 싱 보이는 있습니다 방문해 새테는 색다 즐기에 하다.',
    menuItems: [
      { name: '매콤 서교난면방난면', price: 15000 },
      { name: '한우 설렁탕 난면', price: 12000 },
      { name: '한우난면', price: 13000 },
      { name: '구황난면 (한식 only)', price: 10000 },
      { name: '서코난면', price: 12000 },
      { name: '물기둥 난면과 모로미팔때 웹', price: 13000 },
      { name: '가지튀김과 라구소스', price: 10000 },
      { name: '구황된 피킬 (4pcs)', price: 8000 },
      { name: '한우 볼찜 (4pcs)', price: 8000 }
    ],
    openingHours: {
      regular: '11:00 ~ 21:00 (연중무휴)',
      breakTime: '브레이크 타임 15:00 ~ 17:30',
      lastOrder: '라스트 오더 20:30'
    },
    services: ['대단 가능', '예약금 0원'],
    phone: '0507-1487-0943',
    social: { instagram: '' },
    ranking: 12,
    galleryImages: [
      'https://images.pexels.com/photos/2113556/pexels-photo-2113556.jpeg',
      'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg',
      'https://images.pexels.com/photos/3220617/pexels-photo-3220617.jpeg',
      'https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg'
    ],
    reviews: 20
  },
  {
    id: '2',
    name: 'Usadon',
    nameKorean: '우에록',
    category: 'Michelin Recommended',
    address: '서울특별시 중구 청결로솔 65-29',
    image: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg',
    lat: 37.565,
    lng: 126.982,
    michelin: true,
    description: '동경의 미슐랭 가이드에 게제된 일본 정통 에도마에 스시야의 한국 지점. 쇼군마에 입구가 전통적인 일본스타일로 입구부터 일본의 정서를 느낄수 있다.',
    menuItems: [
      { name: '런치 스시 코스', price: 150000 },
      { name: '디너 스시 코스', price: 230000 }
    ],
    openingHours: {
      regular: '12:00 ~ 22:00 (월요일 휴무)',
      lastOrder: '라스트 오더 21:00'
    },
    services: ['예약 필수'],
    phone: '02-777-5558'
  },
  {
    id: '3',
    name: 'Boongeobigjib',
    nameKorean: '부촌육회',
    category: 'Michelin Recommended',
    address: '서울특별시 중심구 중로 200-12',
    image: 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg',
    lat: 37.572,
    lng: 126.992,
    michelin: true,
    description: '50년 육회의 역사를 자랑하는 곳. 신선한 한우와 갖은양념이 푸짐하게 올려진 육회비빔밥이 대표메뉴.',
    menuItems: [
      { name: '육회비빔밥', price: 18000 },
      { name: '육회', price: 28000 },
      { name: '육회국수', price: 18000 }
    ],
    openingHours: {
      regular: '11:30 ~ 21:30 (월요일 휴무)'
    }
  },
  {
    id: '4',
    name: 'Pyeongtongyeok',
    nameKorean: '평통면옥',
    category: 'Michelin Recommended',
    address: '서울특별시 종구 새창로 26',
    image: 'https://images.pexels.com/photos/2313686/pexels-photo-2313686.jpeg',
    lat: 37.573,
    lng: 126.975,
    michelin: true,
    description: '30년 전통의 평양냉면 전문점. 직접 뽑은 면발과 깊고 시원한 육수가 일품.'
  },
  {
    id: '5',
    name: 'Pyeongyanmyeonok',
    nameKorean: '평양면옥',
    category: 'Michelin Experienced',
    address: '서울특별시 중구 통일로 207',
    image: 'https://images.pexels.com/photos/2983098/pexels-photo-2983098.jpeg',
    lat: 37.568,
    lng: 126.973
  },
  {
    id: '6',
    name: 'Homin',
    nameKorean: '호민',
    category: 'Michelin 1 Star',
    address: '서울특별시 수구 두얼로 287, 2층(서리풀 서울 플라자 2층)',
    image: 'https://images.pexels.com/photos/3535383/pexels-photo-3535383.jpeg',
    lat: 37.485,
    lng: 127.016
  },
  {
    id: '7',
    name: 'Myeongdong Gyoja',
    nameKorean: '명동 교자',
    category: 'Michelin Recommended',
    address: '서울특별시 중구 명동 10길 29',
    image: 'https://images.pexels.com/photos/3054690/pexels-photo-3054690.jpeg',
    lat: 37.564,
    lng: 126.986,
    michelin: true
  },
  {
    id: '8',
    name: 'Gaeseongmandu Gung',
    nameKorean: '개성만두 궁',
    category: 'Michelin Recommended',
    address: '서울특별시 종로구 인사동 10길 11-3',
    image: 'https://images.pexels.com/photos/6270541/pexels-photo-6270541.jpeg',
    lat: 37.575,
    lng: 126.985,
    michelin: true
  },
  {
    id: '9',
    name: 'Ilmungjeongwang',
    nameKorean: '이문설렁탕',
    category: 'Michelin Experienced',
    address: '서울특별시 중호구 동호제 38-13',
    image: 'https://images.pexels.com/photos/2313682/pexels-photo-2313682.jpeg',
    lat: 37.567,
    lng: 127.001
  }
];