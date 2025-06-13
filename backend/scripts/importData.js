const fs = require('fs').promises;
const path = require('path');

async function importData() {
  try {
    // 실제 데이터 파일 경로
    const sourcePath = path.join(__dirname, '../../frontend/src/data/restaurants.ts');
    const targetPath = path.join(__dirname, '../data/restaurants.json');

    // TypeScript 파일 읽기
    const data = await fs.readFile(sourcePath, 'utf8');

    // TypeScript 데이터를 JSON으로 변환
    const jsonData = {
      restaurants: eval(`(${data.replace('export const restaurants = ', '')})`)
    };

    // JSON 파일로 저장
    await fs.writeFile(targetPath, JSON.stringify(jsonData, null, 2));
    console.log('데이터 변환 완료!');
  } catch (error) {
    console.error('데이터 변환 중 오류 발생:', error);
    process.exit(1);
  }
}

importData(); 