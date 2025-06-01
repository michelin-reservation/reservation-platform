# 미쉐린 예약 플랫폼 2025 Q2 (B2C+B2B)

## 프로젝트 개요
- 미쉐린 가이드 레스토랑을 위한 예약 플랫폼
- 네이버 소셜 로그인, JWT 인증, MySQL, 네이버 지도, 예약/리뷰 등 B2C+B2B 예약 플랫폼
- 프론트엔드(Vite+React+TS), 백엔드(Node.js+Express+Sequelize+MySQL) 분리 구조

## 폴더 구조
```
시스템 아키텍처 다이어그램

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

디렉토리 구조

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

## 실행 방법
### 1. 환경변수 설정
- `.env` 파일을 backend, frontend 각각에 생성 (예시는 docs/env.example 참고)

### 2. 의존성 설치
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. 서버 실행
```bash
# 백엔드
cd backend && npm run dev
# 프론트엔드
cd ../frontend && npm run dev
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
- 담당자: ...
- 이메일: ... 

## 문서/명세
- [ERD/DB 구조](./docs/erd.md)
- [API 명세서](./docs/api.md)
- [플로우차트](./docs/flowchart1.png)
- [환경변수 예시](./docs/env.example) 