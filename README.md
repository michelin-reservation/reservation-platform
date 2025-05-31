# Michelin Reservation Platform 2025 Q2

## 프로젝트 개요

미쉐린 레스토랑 예약, VIP/비즈니스 컨시어지, 리뷰, 관리자 기능 등을 제공하는 통합 예약 플랫폼입니다. 프론트엔드와 백엔드가 분리되어 있으며, 실전 운영을 위한 NAS DB, NCP 서버, CI/CD, Docker 등 현대적 인프라 전략을 적용합니다.

---

## 주요 폴더 구조

```
project-root/
├── frontend/        # React (Vite, TypeScript, TailwindCSS)
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── data/
│       ├── types/
│       └── ...
├── backend/         # Express API 서버 (Node.js, TypeScript)
├── docs/            # ERD, API 명세, 전략, 회의록 등
├── .github/         # CI/CD 워크플로우
├── docker-compose.yml
└── README.md
```

---

## 실행 방법

### 1. 프론트엔드 (React)
```bash
cd frontend
npm install
npm run dev
```
- 개발 서버: http://localhost:5173

### 2. 백엔드 (Express)
```bash
cd backend
npm install
npm run dev
```
- API 서버: http://localhost:8001 (또는 .env의 PORT)

### 3. 환경 변수 예시 (.env)
- frontend/.env, backend/.env 별도 관리

#### backend/.env 예시
```
# Local Development
NODE_ENV=development
PORT=3000

# Local Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=michelin
DB_USER=root
DB_PASSWORD=

# NAS Database (for production)
# DB_HOST=192.168.1.39
# DB_PORT=30262
# DB_NAME=michelin
# DB_USER=root
# DB_PASSWORD=your_password_here

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=24h
```

#### frontend/.env 예시
```
```

### 4. 로컬 DB 설정
```bash
# MariaDB 접속
mysql -u root

# DB 생성
CREATE DATABASE michelin;
```

### 5. .env 파일 수동 생성
backend 폴더에 `.env` 파일을 생성하고 다음 내용을 입력:
```env
# Local Development
NODE_ENV=development
PORT=3000

# Local Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=michelin
DB_USER=root
DB_PASSWORD=

# NAS Database (for production)
# DB_HOST=192.168.1.39
# DB_PORT=30262
# DB_NAME=michelin
# DB_USER=root
# DB_PASSWORD=your_password_here

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=24h
```

### 6. config/config.json 수정
```json
{
  "development": {
    "username": "root",
    "password": null,
    "database": "michelin",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "michelin_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": "your_password_here",
    "database": "michelin",
    "host": "192.168.1.39",
    "port": 30262,
    "dialect": "mysql"
  }
}
```

### 7. 모델 생성
```bash
# User 모델 예시
npx sequelize-cli model:generate --name User --attributes email:string,password:string,name:string,role:string

# Restaurant 모델 예시
npx sequelize-cli model:generate --name Restaurant --attributes name:string,address:string,phone:string,description:text

# Reservation 모델 예시
npx sequelize-cli model:generate --name Reservation --attributes userId:integer,restaurantId:integer,date:date,time:string,partySize:integer,status:string
```

### 8. 마이그레이션 실행
```bash
# 로컬 DB에 마이그레이션
npx sequelize db:migrate
```