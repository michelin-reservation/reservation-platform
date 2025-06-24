# ⚙️ 미쉐린 예약 플랫폼 운영 스크립트 가이드

## 📋 목차
1. [운영 스크립트 개요](#운영-스크립트-개요)
2. [개발 환경 스크립트](#개발-환경-스크립트)
3. [배포 스크립트](#배포-스크립트)
4. [모니터링 스크립트](#모니터링-스크립트)
5. [데이터 관리 스크립트](#데이터-관리-스크립트)
6. [CI/CD 파이프라인](#cicd-파이프라인)

---

## 🎯 운영 스크립트 개요

### 스크립트 구조
```
backend/scripts/
├── dev.sh              # 개발 환경 실행
├── deploy.sh           # 운영 배포
├── test.sh             # 테스트 실행
├── env.sh              # 환경 변수 관리
├── validate-env.js     # 환경 변수 검증
├── monitoring/         # 모니터링 스크립트
│   └── monitor.sh
├── scenario/           # 시나리오 테스트
│   └── reservation.sh
└── utils/              # 유틸리티 함수
    └── env.sh
```

### 주요 특징
- **자동화**: 단일 명령어로 전체 환경 구축
- **환경 분리**: 개발/테스트/운영 환경 독립적 관리
- **에러 처리**: 상세한 로깅 및 에러 복구
- **확장성**: 새로운 스크립트 쉽게 추가 가능

---

## 🛠️ 개발 환경 스크립트

### 1. 개발 서버 실행 (`dev.sh`)
```bash
#!/bin/bash
# 개발 환경 자동 세팅 및 서버 실행

source scripts/env.sh

log_info "🚀 개발 환경 시작..."

# 1. 환경 변수 설정
check_env "development"

# 2. 의존성 설치
log_info "📦 의존성 설치 중..."
npm install

# 3. 데이터베이스 연결 확인
log_info "🗄️ 데이터베이스 연결 확인 중..."
check_database_connection

# 4. 마이그레이션 실행
log_info "🔄 데이터베이스 마이그레이션 실행 중..."
run_migrations

# 5. 시드 데이터 삽입 (개발용)
if [ "$NODE_ENV" = "development" ]; then
    log_info "🌱 시드 데이터 삽입 중..."
    npm run db:seed
fi

# 6. 개발 서버 실행
log_info "🔥 개발 서버 시작 중..."
npm run dev
```

**사용법:**
```bash
cd backend
bash scripts/dev.sh
```

### 2. 환경 변수 검증 (`validate-env.js`)
```javascript
// scripts/validate-env.js
const requiredEnvVars = [
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASS',
  'JWT_SECRET',
  'PORT'
];

function validateEnv() {
  const missing = [];

  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  if (missing.length > 0) {
    console.error('❌ 필수 환경 변수가 누락되었습니다:');
    missing.forEach(varName => console.error(`  - ${varName}`));
    process.exit(1);
  }

  console.log('✅ 모든 환경 변수가 올바르게 설정되었습니다.');
}

validateEnv();
```

---

## 🚀 배포 스크립트

### 1. 운영 배포 (`deploy.sh`)
```bash
#!/bin/bash
# 운영 환경 배포 자동화

source scripts/env.sh

log_info "🚀 운영 배포 시작..."

# 1. 환경 변수 설정
check_env "production"

# 2. 백업 생성
log_info "💾 데이터베이스 백업 생성 중..."
create_backup

# 3. 의존성 설치
log_info "📦 의존성 설치 중..."
npm ci --only=production

# 4. 빌드
log_info "🔨 애플리케이션 빌드 중..."
npm run build

# 5. 마이그레이션 실행
log_info "🔄 데이터베이스 마이그레이션 실행 중..."
run_migrations

# 6. PM2로 서버 실행
log_info "🔥 PM2로 서버 시작 중..."
pm2 start ecosystem.config.js --env production

# 7. 헬스 체크
log_info "🏥 헬스 체크 중..."
check_health

log_info "✅ 배포 완료!"
```

**사용법:**
```bash
cd backend
bash scripts/deploy.sh
```

### 2. PM2 설정 (`ecosystem.config.js`)
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'michelin-backend',
    script: './server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 8000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 8000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

---

## 📊 모니터링 스크립트

### 1. 시스템 모니터링 (`monitoring/monitor.sh`)
```bash
#!/bin/bash
# 시스템 및 서비스 상태 모니터링

source scripts/utils/env.sh

log_info "📊 시스템 모니터링 시작..."

# 1. 시스템 리소스 체크
check_system_resources() {
  log_info "💻 시스템 리소스 확인 중..."

  # CPU 사용률
  cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
  if [ "$cpu_usage" -gt 80 ]; then
    log_warning "⚠️ CPU 사용률이 높습니다: ${cpu_usage}%"
  fi

  # 메모리 사용률
  memory_usage=$(free | grep Mem | awk '{printf("%.2f", $3/$2 * 100.0)}')
  if [ "$memory_usage" -gt 80 ]; then
    log_warning "⚠️ 메모리 사용률이 높습니다: ${memory_usage}%"
  fi

  # 디스크 사용률
  disk_usage=$(df / | tail -1 | awk '{print $5}' | cut -d'%' -f1)
  if [ "$disk_usage" -gt 80 ]; then
    log_warning "⚠️ 디스크 사용률이 높습니다: ${disk_usage}%"
  fi
}

# 2. 서비스 상태 체크
check_service_status() {
  log_info "🔍 서비스 상태 확인 중..."

  # PM2 프로세스 상태
  if ! pm2 list | grep -q "online"; then
    log_error "❌ PM2 프로세스가 정상 실행되지 않습니다."
    pm2 restart michelin-backend
  fi

  # 데이터베이스 연결
  if ! check_database_connection; then
    log_error "❌ 데이터베이스 연결에 실패했습니다."
  fi

  # API 헬스 체크
  if ! curl -f http://localhost:8000/health > /dev/null 2>&1; then
    log_error "❌ API 서버가 응답하지 않습니다."
  fi
}

# 3. 로그 모니터링
check_logs() {
  log_info "📝 로그 확인 중..."

  # 에러 로그 확인
  error_count=$(tail -n 100 logs/err.log | grep -c "ERROR")
  if [ "$error_count" -gt 10 ]; then
    log_warning "⚠️ 최근 100줄에서 ${error_count}개의 에러가 발생했습니다."
  fi
}

# 4. 알림 발송
send_notification() {
  if [ "$1" = "error" ]; then
    # Slack 또는 이메일로 알림 발송
    log_info "📢 에러 알림 발송 중..."
  fi
}

# 메인 실행
check_system_resources
check_service_status
check_logs

log_info "✅ 모니터링 완료!"
```

**사용법:**
```bash
cd backend
bash scripts/monitoring/monitor.sh
```

---

## 🗄️ 데이터 관리 스크립트

### 1. 데이터 백업 (`backup.sh`)
```bash
#!/bin/bash
# 데이터베이스 백업 스크립트

source scripts/env.sh

BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/michelin_backup_${DATE}.sql"

log_info "💾 데이터베이스 백업 시작..."

# 백업 디렉토리 생성
mkdir -p "$BACKUP_DIR"

# MariaDB 백업
mysqldump -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" \
  "$DB_NAME" > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
  log_info "✅ 백업 완료: $BACKUP_FILE"

  # 압축
  gzip "$BACKUP_FILE"
  log_info "📦 백업 파일 압축 완료"

  # 오래된 백업 파일 정리 (30일 이상)
  find "$BACKUP_DIR" -name "*.sql.gz" -mtime +30 -delete
  log_info "🧹 오래된 백업 파일 정리 완료"
else
  log_error "❌ 백업 실패"
  exit 1
fi
```

### 2. 데이터 시드 (`seedRestaurants.js`)
```javascript
// scripts/seedRestaurants.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const restaurants = [
  {
    name: 'Le Gourmet',
    location: '강남구',
    latitude: 37.5665,
    longitude: 126.9780,
    stars: 3,
    tags: '프렌치,스테이크,로맨틱',
    menu: {
      tasting: [{ name: '시즌 테이스팅', price: 180000 }]
    }
  },
  {
    name: 'Sakura Sushi',
    location: '마포구',
    latitude: 37.5519,
    longitude: 126.9251,
    stars: 2,
    tags: '일식,스시,신선',
    menu: {
      omakase: [{ name: '오마카세', price: 150000 }]
    }
  }
];

async function seedRestaurants() {
  console.log('🌱 레스토랑 시드 데이터 삽입 시작...');

  for (const restaurant of restaurants) {
    await prisma.restaurant.create({
      data: restaurant
    });
    console.log(`✅ ${restaurant.name} 추가 완료`);
  }

  console.log('🎉 모든 시드 데이터 삽입 완료!');
}

seedRestaurants()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

---

## 🔄 CI/CD 파이프라인

### 1. GitHub Actions (`/.github/workflows/ci.yml`)
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: test_db
        ports:
          - 3306:3306
        options: --health-cmd="mysqladmin ping" --health-interval=10s --health-timeout=5s --health-retries=3

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run tests
      run: npm test
      env:
        DB_HOST: localhost
        DB_PORT: 3306
        DB_NAME: test_db
        DB_USER: root
        DB_PASS: root
        JWT_SECRET: test_secret

    - name: Run linting
      run: npm run lint

    - name: Build application
      run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
    - uses: actions/checkout@v3

    - name: Deploy to production
      run: |
        echo "🚀 운영 환경 배포 시작..."
        # 실제 배포 스크립트 실행
```

### 2. Docker 배포 (`docker-compose.yml`)
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=production
      - DB_HOST=db
      - DB_PORT=3306
      - DB_NAME=michelin_db
      - DB_USER=michelin_user
      - DB_PASS=${DB_PASSWORD}
    depends_on:
      - db
      - redis
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

  db:
    image: mariadb:10.6
    environment:
      - MYSQL_ROOT_PASSWORD=${DB_ROOT_PASSWORD}
      - MYSQL_DATABASE=michelin_db
      - MYSQL_USER=michelin_user
      - MYSQL_PASSWORD=${DB_PASSWORD}
    volumes:
      - db_data:/var/lib/mysql
      - ./helm/db/scripts:/docker-entrypoint-initdb.d
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    restart: unless-stopped

  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    restart: unless-stopped

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
    volumes:
      - grafana_data:/var/lib/grafana
    restart: unless-stopped

volumes:
  db_data:
  grafana_data:
```

---

## 📋 스크립트 사용 가이드

### 개발자용 명령어
```bash
# 개발 환경 시작
bash scripts/dev.sh

# 테스트 실행
bash scripts/test.sh

# 환경 변수 검증
node scripts/validate-env.js

# 데이터 시드
node scripts/seedRestaurants.js
```

### 운영자용 명령어
```bash
# 운영 배포
bash scripts/deploy.sh

# 모니터링
bash scripts/monitoring/monitor.sh

# 백업
bash scripts/backup.sh

# PM2 관리
pm2 list
pm2 logs
pm2 monit
```

### 관리자용 명령어
```bash
# 전체 서비스 재시작
pm2 restart all

# 로그 확인
tail -f logs/combined.log

# 데이터베이스 연결 확인
mysql -h localhost -u michelin_user -p michelin_db
```

---

## 🔧 스크립트 커스터마이징

### 새로운 스크립트 추가
1. `scripts/` 디렉토리에 새 파일 생성
2. `source scripts/env.sh`로 공통 함수 로드
3. `log_info`, `log_error` 함수로 로깅
4. 에러 처리 및 종료 코드 추가

### 환경별 설정
- **개발**: `NODE_ENV=development`
- **테스트**: `NODE_ENV=test`
- **운영**: `NODE_ENV=production`

---

*이 운영 스크립트 가이드는 개발부터 배포까지 전체 라이프사이클을 자동화하여 운영 효율성을 극대화합니다.*