const { PrismaClient } = require('@prisma/client');
const fs = require('fs').promises;
const path = require('path');

const prisma = new PrismaClient();

async function loadRestaurantData() {
  try {
    const dataFile = process.env.DATA_FILE || '../data/restaurants.json';
    const dataPath = path.isAbsolute(dataFile) ? dataFile : path.join(__dirname, dataFile);
    const data = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(data).restaurants;
  } catch (error) {
    console.error('데이터 파일을 읽는 중 오류 발생:', error);
    throw error;
  }
}

async function main() {
  console.log('시드 데이터 upsert 시작...');

  try {
    const restaurants = await loadRestaurantData();
    console.log(`총 ${restaurants.length}개의 식당 데이터를 불러왔습니다.`);

    for (const restaurantData of restaurants) {
      const { menuItems, id, ...restaurantInfo } = restaurantData;
      // upsert: id 기준으로 있으면 update, 없으면 create
      const restaurant = await prisma.restaurant.upsert({
        where: { id },
        update: {
          ...restaurantInfo,
          menuItems: {
            deleteMany: {}, // 기존 메뉴 모두 삭제 후
            create: menuItems || [] // 새로 생성
          }
        },
        create: {
          id,
          ...restaurantInfo,
          menuItems: {
            create: menuItems || []
          }
        }
      });
      console.log(`식당 upsert 완료: ${restaurant.nameKorean}`);
    }

    console.log('시드 데이터 upsert 완료!');
  } catch (error) {
    console.error('시드 데이터 upsert 중 오류 발생:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 