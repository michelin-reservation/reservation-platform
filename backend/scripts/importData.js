const fs = require('fs');
const path = require('path');
const paths = require('../config/paths.config');

// 데이터 파일 경로
const sourcePath = path.join(paths.FRONTEND_DATA, 'restaurants.ts');
const targetPath = path.join(paths.DATA_DIR, 'restaurants.json');

// 데이터 임포트 함수
async function importData() {
  try {
    paths.ensureDirExists(paths.DATA_DIR);

    // TypeScript 파일 읽기
    const tsContent = fs.readFileSync(sourcePath, 'utf-8');

    // TypeScript 데이터를 JSON으로 변환
    const jsonData = {
      restaurants: eval(`(${tsContent.replace('export const restaurants = ', '')})`)
    };

    // JSON 파일로 저장
    fs.writeFileSync(targetPath, JSON.stringify(jsonData, null, 2));
    console.log(`✅ 데이터 임포트 완료: ${targetPath}`);
  } catch (error) {
    console.error('❌ 데이터 임포트 실패:', error);
    process.exit(1);
  }
}

// 메인 실행
if (require.main === module) {
  importData();
}