# 미쉐린 예약 플랫폼 2025 Q2 (B2C+B2B)

## 프로젝트 개요
- 미쉐린 레스토랑 예약, VIP/비즈니스 컨시어지, 리뷰, 관리자 기능 등을 제공하는 통합 예약 플랫폼입니다. 프론트엔드와 백엔드가 분리되어 있으며, 실전 운영을 위한 NAS DB, NCP 서버, CI/CD, Docker 등 현대적 인프라 전략을 적용합니다.

## 폴더 구조
```
시스템 아키텍처 다이어그램

사용자 (일반 / 기업 VIP)
        │
 ┌──────┴──────┐
 │  웹/앱 프론트엔드  │   ← React (Vite, TypeScript)
 └──────┬──────┘
        │ REST API (JWT 인증)
 ┌──────┴──────┐
 │   백엔드 서버 (API) │   ← Node.js + Express + Sequelize
 │   (Docker 컨테이너) │
 └──────┬──────┘
        │ DB 쿼리 / 인증 / 비즈니스 로직
 ┌──────┴───────────────┬───────────────┐
 │      데이터베이스         │      외부 연동 API      │
 │ (MariaDB, NAS/로컬) │ ┌───────────────┐
 │   (Docker or NAS)   │ │  네이버 지도 API      │
 └──────────────┬──────┘ │  네이버 소셜 로그인   │
                │        │  미슐랭 DB 크롤링/수기 │
                │        │  (확장) 예약 플랫폼 연동│
                │        └───────────────┘
                │
        ┌───────┴────────┐
        │  CI/CD & 배포 자동화 │
        │ (GitHub Actions)   │
        └───────┬────────┘
                │
        ┌───────┴────────┐
        │  NCP Ubuntu VM │
        │ (Docker, Nginx)│
        └───────────────┘

디렉토리 구조

michelin-reservation-platform-2025-Q2/
├── frontend/           # React (Vite, TypeScript, TailwindCSS)
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── data/
│       ├── types/
│       └── ...
├── backend/            # Express API 서버 (Node.js, Sequelize)
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── scripts/
│   ├── common/
│   ├── app.js
│   ├── Dockerfile
│   └── .env
├── docs/               # ERD, API 명세, 전략, 회의록 등
│   ├── ERD.md
│   ├── API.md
│   └── 배포.md
├── .github/            # CI/CD 워크플로우 (GitHub Actions)
│   └── workflows/
│       └── ci.yml
├── docker-compose.yml  # 전체 서비스 통합 관리
├── README.md           # 프로젝트 설명 및 실행 가이드
└── 기타 설정 파일들 ...
```

## 실무 환경 즉시 구축 가이드 (운영자용)
- `npm install`만 하면 모든 의존성 자동 설치
- `.env` 파일(backend, frontend 각각) docs/env.example 참고해 복사/수정
- `pm2 start ecosystem.config.js`로 서버 무중단 자동 실행
- `pm2 logs/monit/list`로 실시간 모니터링 및 관리
- 운영/개발 환경, Sentry, Prometheus, Grafana, Slack 등 모두 README/docs에 가이드 반영
- 운영자는 위 사용법만 따르면 실무 환경을 바로 구축 가능

## 주요 운영/개발 스크립트 매핑 표 (실무 표준)

| 명령어                       | 실제 동작/설명                                                                                 | 용도/비고                       |
|------------------------------|-----------------------------------------------------------------------------------------------|---------------------------------|
| **npm start**                | `NODE_ENV=production node app.js`                                                             | 운영 환경 서버 실행(기본)        |
| **npm run start:pm2**        | `NODE_ENV=production pm2 start app.js --name michelin-backend`                                | 운영 환경 무중단(PM2) 실행       |
| **npm run dev**              | `NODE_ENV=development nodemon app.js`                                                         | 개발 환경 서버 실행(핫리로드)    |
| **npm test**                 | `NODE_ENV=test jest --detectOpenHandles`                                                      | 테스트 코드 실행                |
| **npm run test:watch**       | `jest --watch`                                                                                | 테스트 코드 변경 감지 자동 실행  |
| **npm run lint**             | `eslint .`                                                                                    | 코드 린트(문법/스타일 검사)      |
| **npm run lint:fix**         | `eslint . --fix`                                                                              | 코드 린트 자동 수정             |
| **npm run prettier**         | `prettier --check .`                                                                          | 코드 포맷 검사                  |
| **npm run prettier:fix**     | `prettier --write .`                                                                          | 코드 포맷 자동 정리             |
| **npm run db:migrate**       | `sequelize-cli db:migrate`                                                                    | DB 마이그레이션(스키마 적용)     |
| **npm run db:seed**          | `sequelize-cli db:seed:all`                                                                   | DB 시드 데이터 삽입             |
| **npm run db:reset**         | `sequelize-cli db:migrate:undo:all && sequelize-cli db:migrate && sequelize-cli db:seed:all`  | DB 전체 리셋 및 시드            |
| **npm run db:status**        | `sequelize-cli db:migrate:status`                                                             | DB 마이그레이션 상태 확인        |
| **npm run validate:env**     | `node scripts/validate-env.js`                                                                | 필수 환경변수 체크              |
| **npm run security:check**   | `npm audit`                                                                                   | 보안 취약점 검사                |
| **npm run security:fix**     | `npm audit fix`                                                                               | 보안 취약점 자동 수정           |
| **npm run seed**             | `node seeders/restaurantSeeder.js`                                                            | 레스토랑 시드 데이터 삽입        |

> 위 명령어들은 운영/개발/테스트/품질/DB/보안 등 실무에 필요한 모든 작업을 명확하게 분리하여 관리할 수 있도록 설계되어 있습니다.
> 운영자는 이 표를 참고하여 환경에 맞는 명령어만 실행하면 됩니다.

## 실무 표준 8단계 업그레이드 로드맵
1. 관리자 인증 미들웨어 도입 (isAdmin, /api/admin 보호)
2. 에러 핸들러 및 에러 표준화 (errorHandler, 일관된 에러 응답)
3. Swagger 문서 자동화 (swagger.yaml, Swagger UI 연동)
4. Controller-Service 분리 (user, 알림, 예약, 리뷰 등)
5. 테스트 커버리지 확장 (user/notification/reservation/review 등, 정상/실패 케이스)
6. 보안 미들웨어 추가 (helmet, express-rate-limit)
7. RESTful 라우팅 개선 (상세/수정/삭제까지 반영)
8. 운영/모니터링 도구 연동 (winston, morgan, Sentry, Prometheus, pm2, README 가이드)

## 실행 방법
### 1. 환경변수 설정
- `.env` 파일을 backend, frontend 각각에 생성 (예시는 docs/env.example 참고)
- 운영환경은 `.env.production` 등 별도 파일로 분리, 민감정보는 Git에 커밋 금지

### 2. 의존성 설치
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. 서버 실행 (개발/운영)
```bash
# 개발
cd backend && npm run dev
cd ../frontend && npm run dev

# 운영 (pm2)
pm2 start ecosystem.config.js
pm2 logs
pm2 monit
```

### 4. 접속
- 프론트: http://localhost:5173
- 백엔드: http://localhost:8000

## 기술스택
- 프론트: Vite, React, TypeScript, Tailwind CSS, Naver Map API
- 백엔드: Node.js, Express, Sequelize, MySQL, JWT, dotenv
- 기타: Docker, CI/CD, Github Actions(예정)

## 배포
- Docker, CI/CD, 클라우드 환경 지원 예정

## 기여 방법
1. 이슈/PR 등록 후 브랜치 생성
2. 커밋 메시지: feat/fix/docs/chore 등 prefix 사용
3. 코드 리뷰 및 병합

## 문의
- 담당자: juns
- 이메일: junexi0828@gmail.com

### 개발자 참고사항.
## 문서/명세
- [ERD/DB 구조](./docs/erd.md)
- [API 명세서](./docs/api.md)
- [플로우차트](./docs/flowchart1.png)
- [환경변수 예시](./docs/env.example)

## 운영/모니터링 자동화 가이드 (실무 표준)

### 1. Prometheus (서버/지표 모니터링)
- Prometheus 서버 설치(운영팀/인프라팀)
- `scrape_configs`에 `/metrics` 엔드포인트 등록
  예시:
  ```yaml
  scrape_configs:
    - job_name: 'michelin-api'
      static_configs:
        - targets: ['your-api-server:3000']
  ```
- `/metrics` 엔드포인트는 코드에 이미 구현되어 있음

### 2. pm2 (Node.js 프로세스 관리/모니터링)
- 운영 서버에서 pm2 설치: `npm install pm2 -g`
- 앱 실행: `pm2 start backend/app.js --name michelin-api`
- (권장) `ecosystem.config.js`로 자동화:
  ```js
  module.exports = {
    apps: [{
      name: 'michelin-api',
      script: './backend/app.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: { NODE_ENV: 'production' }
    }]
  }
  ```
  실행: `pm2 start ecosystem.config.js`
- 실시간 모니터링: `pm2 monit`
- 로그 확인: `pm2 logs`

### 3. Sentry (에러 추적/알림)
- [Sentry 가입 및 프로젝트 생성](https://sentry.io/)
- 운영/개발 환경별로 Sentry 프로젝트를 분리하여 DSN을 각각 발급받아 .env에 등록
  - 예시:
    - SENTRY_DSN_PROD=운영용_DSN
    - SENTRY_DSN_DEV=개발용_DSN
- 코드에서 NODE_ENV 값에 따라 자동으로 DSN이 분기 적용됨
- 에러 발생 시 환경별 Sentry 대시보드에 각각 저장
- Sentry 대시보드에서 Slack 워크스페이스/채널 연동 가능
- Sentry에서 에러 발생 시 Slack 채널로 실시간 알림 전송
- 운영/개발 환경 모두 실시간 장애 감지 및 대응 가능

### 4. 로그 (winston + morgan)
- 모든 로그는 `logs/error.log`, `logs/combined.log`에 저장
- 운영환경에서는 파일, 개발환경에서는 콘솔 컬러 출력
- 로그 파일은 주기적으로 확인/백업/모니터링

### 5. Prometheus & Grafana 설치/실행 자동화 가이드
- macOS/Homebrew 기준:
```bash
brew install prometheus
grafana
```
- prometheus.yml 예시:
```yaml
global:
  scrape_interval: 15s
scrape_configs:
  - job_name: 'michelin-backend'
    static_configs:
      - targets: ['localhost:8000']
```
- Prometheus 실행: `prometheus --config.file=./prometheus.yml`
- Grafana 실행: `brew services start grafana`
- Grafana에서 Prometheus 데이터소스 등록, 대시보드 생성

---
## 실무 운영 배포 체크리스트
- 운영/개발 환경변수 분리: `.env`, `.env.production`
- CORS: 운영 프론트 도메인만 허용
- HTTPS: 운영 서버는 반드시 HTTPS 적용
- 보안: .env, .env.production 등은 Git에 커밋하지 않기
- 빌드/배포: 프론트는 정적 파일, 백엔드는 pm2/Docker로 배포
- 자동화: GitHub Actions 등으로 CI/CD 구축
- 모니터링/로깅: winston, Sentry, Prometheus 등으로 관리

---

## 데이터 변환 및 시드 실행

### 1. 프론트엔드 TS → 백엔드 JSON 변환

운영 데이터(레스토랑 전체 정보)는 `frontend/src/data/restaurants.ts`에 TypeScript 배열로 관리됩니다. 이 데이터를 백엔드에서 사용할 수 있도록 JSON으로 변환하는 실무 표준 스크립트가 제공됩니다.

#### Babel 파서 기반 변환 스크립트
- TypeScript/JS 문법을 안전하게 파싱하여, export/주석/타입 등 불필요 요소를 자동 제거
- Babel 공식 파서(@babel/parser) 사용
- 내부 데이터 변환용으로 안전하게 설계

**의존성 설치(최초 1회):**
```bash
cd backend
npm install @babel/parser
```

**변환 실행:**
```bash
cd backend
node scripts/convertRestaurants.js
```
- 변환 성공 시 `backend/data/restaurants.json` 파일이 생성됩니다.
- 변환 스크립트는 TypeScript 파일 내 export/주석/트레일링 콤마 등도 자동 처리합니다.

### 2. 시드 스크립트 실행 (환경별 데이터 파일 지정 가능)

```bash
# 개발 환경 예시
DATA_FILE=../data/restaurants.json node seeders/restaurantSeeder.js

# 운영 환경 예시 (예: prod 데이터 파일이 따로 있을 경우)
DATA_FILE=../data/restaurants.prod.json node seeders/restaurantSeeder.js
```
- Prisma upsert로 중복 없이 안전하게 데이터 삽입/갱신
- 메뉴도 자동 upsert 처리

### 3. 전체 실무 표준 흐름
1. 프론트엔드 데이터 최신화 → 변환 스크립트 실행
2. 시드 스크립트로 DB 최신화
3. API/프론트엔드 연동

> 데이터 구조/스키마가 변경될 경우, 변환 스크립트와 시드 스크립트도 함께 점검/수정 필요

## 프론트엔드 필수 의존성 설치 안내

### recharts (통계/비즈니스 대시보드 시각화)

통계 및 비즈니스 대시보드 페이지에서 recharts가 필수로 사용됩니다. 아래 명령어로 반드시 설치해 주세요.

```bash
cd frontend
npm install recharts
```

(recharts는 타입스크립트 내장 타입을 제공합니다. 별도 @types 패키지 필요 없음)