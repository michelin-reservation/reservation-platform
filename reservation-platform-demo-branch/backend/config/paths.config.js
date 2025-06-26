const path = require('path');

// 프로젝트 루트 경로 설정
const PROJECT_ROOT = process.env.PROJECT_ROOT || path.resolve(__dirname, '../');
const WORKSPACE_ROOT = path.resolve(PROJECT_ROOT, '../');

// 주요 디렉토리 경로
const paths = {
    PROJECT_ROOT,
    WORKSPACE_ROOT,

    // 백엔드 관련 경로
    BACKEND_ROOT: PROJECT_ROOT,
    DATA_DIR: path.join(PROJECT_ROOT, 'data'),
    SEEDER_DIR: path.join(PROJECT_ROOT, 'seeders'),
    LOG_DIR: path.join(PROJECT_ROOT, 'logs'),
    CONFIG_DIR: path.join(PROJECT_ROOT, 'config'),

    // 프론트엔드 관련 경로
    FRONTEND_ROOT: path.join(WORKSPACE_ROOT, 'frontend'),
    FRONTEND_SRC: path.join(WORKSPACE_ROOT, 'frontend', 'src'),
    FRONTEND_DATA: path.join(WORKSPACE_ROOT, 'frontend', 'src', 'data'),

    // 공유 리소스 경로
    SHARED_DATA: path.join(WORKSPACE_ROOT, 'data'),

    // 빌드 출력 경로
    DIST_DIR: path.join(PROJECT_ROOT, 'dist'),
    BUILD_DIR: path.join(PROJECT_ROOT, 'build'),
};

// 경로 존재 여부 확인 함수
paths.ensureDirExists = (dirPath) => {
    const fs = require('fs');
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

// 주요 디렉토리 생성
Object.values(paths)
    .filter(path => typeof path === 'string' && !path.includes('.'))
    .forEach(dirPath => {
        paths.ensureDirExists(dirPath);
    });

module.exports = paths;