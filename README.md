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
PORT=8001
DB_HOST=localhost
DB_PORT=3306
DB_NAME=michelin_db
DB_USER=michelin_user
DB_PASS=yourpassword
JWT_SECRET=your_super_secret
```

#### frontend/.env 예시
```
VITE_API_URL=http://localhost:8001
```

---

## 개발/운영 전략
- **로컬 개발 → NAS(MariaDB) → NCP 서버(Docker)로 배포**
- GitHub Actions 기반 CI/CD 자동화
- .env 등 민감정보는 git에 포함하지 않음
- ERD, API 명세, 전략 문서 등 docs 폴더에 최신화

---

## 병합/마이그레이션 내역
- reservation-platform-bbk의 프론트엔드 전체 코드(components, pages, data, types) 완전 이식
- 코드/폴더/내용 100% 일치 확인
- main 브랜치 기준으로 병합 및 푸시 완료

---

## 주요 기술 스택
- **Frontend:** React, Vite, TypeScript, TailwindCSS
- **Backend:** Node.js, Express, TypeScript, MariaDB
- **Infra:** Docker, NCP, Synology NAS, GitHub Actions

---

## 기여/협업 가이드
- main 브랜치 기준으로 개발/배포
- PR, 이슈, 커밋 메시지 규칙 등은 docs/CONTRIBUTING.md 참고(추가 예정)

---

## 문의
- 담당자: [junexi0828](mailto:junexi0828@gmail.com)
- 기타 문의는 GitHub Issues 활용 