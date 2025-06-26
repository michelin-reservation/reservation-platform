const fs = require('fs');
const path = require('path');

// restaurants.json 파일 읽기
const restaurantsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../backend/data/restaurants.json'), 'utf8'));

// SQL 파일 생성
let sqlContent = `-- 전체 식당 데이터 삽입 스크립트
-- 생성일: ${new Date().toISOString()}
-- 총 식당 수: ${restaurantsData.restaurants.length}개

USE michelin_dev;

-- 식당 데이터 삽입
INSERT IGNORE INTO restaurants (id, name, nameKorean, address, phone, category, description, lat, lng, image, tags, openingHours, services, social, michelinGuide) VALUES
`;

// 식당 데이터 변환
const restaurantValues = restaurantsData.restaurants.map(restaurant => {
    const tags = JSON.stringify(restaurant.tags || []);
    const openingHours = JSON.stringify(restaurant.openingHours || {});
    const services = JSON.stringify(restaurant.services || []);
    const social = JSON.stringify(restaurant.social || {});

    return `('${restaurant.id}', '${restaurant.name.replace(/'/g, "\\'")}', '${restaurant.nameKorean.replace(/'/g, "\\'")}', '${restaurant.address.replace(/'/g, "\\'")}', '${restaurant.phone || ''}', '${restaurant.category || ''}', '${restaurant.description.replace(/'/g, "\\'")}', ${restaurant.lat || 0}, ${restaurant.lng || 0}, '${restaurant.image || ''}', '${tags}', '${openingHours}', '${services}', '${social}', '${restaurant.michelinGuide || ''}')`;
});

sqlContent += restaurantValues.join(',\n') + ';\n\n';

// 메뉴 데이터 삽입
sqlContent += `-- 메뉴 아이템 데이터 삽입
INSERT IGNORE INTO menu_items (id, restaurantId, name, price, description) VALUES
`;

let menuCount = 0;
const menuValues = [];

restaurantsData.restaurants.forEach(restaurant => {
    if (restaurant.menuItems && restaurant.menuItems.length > 0) {
        restaurant.menuItems.forEach((menuItem, index) => {
            menuCount++;
            const menuId = `menu-${restaurant.id}-${index + 1}`;
            const price = menuItem.price ? parseFloat(menuItem.price) : 0;
            const description = menuItem.description || '';

            menuValues.push(`('${menuId}', '${restaurant.id}', '${menuItem.name.replace(/'/g, "\\'")}', ${price}, '${description.replace(/'/g, "\\'")}')`);
        });
    }
});

sqlContent += menuValues.join(',\n') + ';\n\n';

// 통계 정보 추가
sqlContent += `-- 데이터 삽입 완료
-- 총 식당 수: ${restaurantsData.restaurants.length}개
-- 총 메뉴 수: ${menuCount}개
-- 생성 완료 시간: ${new Date().toISOString()}
`;

// SQL 파일 저장
const outputPath = path.join(__dirname, '04-seed-restaurants-full.sql');
fs.writeFileSync(outputPath, sqlContent);

console.log(`✅ SQL 파일 생성 완료: ${outputPath}`);
console.log(`📊 총 식당 수: ${restaurantsData.restaurants.length}개`);
console.log(`🍽️ 총 메뉴 수: ${menuCount}개`);
console.log(`📁 파일 크기: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);