const path = require('path');
const fs = require('fs');
const paths = require('../config/paths.config');
const babelParser = require('@babel/parser');

// TypeScript 파일 경로
const tsFilePath = path.join(paths.FRONTEND_DATA, 'restaurants.ts');
const jsonFilePath = path.join(paths.DATA_DIR, 'restaurants.json');

// 1️⃣ TypeScript 파일 읽기
const tsData = fs.readFileSync(tsFilePath, 'utf-8');

// 2️⃣ Babel 파서로 AST 파싱
const ast = babelParser.parse(tsData, {
  sourceType: 'module',
  plugins: ['typescript']
});

// 3️⃣ restaurants 배열 추출
let restaurantsArr = null;
for (const node of ast.program.body) {
  if (
    node.type === 'ExportNamedDeclaration' &&
    node.declaration &&
    node.declaration.type === 'VariableDeclaration'
  ) {
    const decl = node.declaration.declarations[0];
    if (decl.id.name === 'restaurants') {
      // 배열 노드를 코드로 변환
      const start = decl.init.start;
      const end = decl.init.end;
      restaurantsArr = tsData.slice(start, end);
      break;
    }
  }
}

if (!restaurantsArr) {
  console.error('❌ restaurants 배열을 찾을 수 없습니다.');
  process.exit(1);
}

// 4️⃣ 배열을 JS 객체로 안전하게 파싱
let arr;
try {
  arr = eval('(' + restaurantsArr + ')');
} catch (err) {
  console.error('❌ 배열 파싱 실패:', err.message);
  process.exit(1);
}

// 5️⃣ JSON 파일로 저장
fs.writeFileSync(jsonFilePath, JSON.stringify({ restaurants: arr }, null, 2), 'utf-8');
console.log(`✅ 데이터 변환 완료: ${jsonFilePath} (${arr.length}개)`);

// 메인 실행
if (require.main === module) {
  paths.ensureDirExists(paths.DATA_DIR);
  convertTsToJson();
  console.log(`✅ 데이터 변환 완료: ${jsonFilePath}`);
}
