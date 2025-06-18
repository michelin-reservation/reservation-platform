# scripts/ 사용 설명서

## 개요
이 디렉토리는 개발, 테스트, 배포, 모니터링, 데이터 변환 등 실무 SaaS 운영에 필요한 자동화 스크립트 모음입니다. Node.js 기반 단일 명령어 스크립트와 Bash 기반 환경 자동화 스크립트로 구성되어 있습니다.

---

## 1. 주요 스크립트별 상세 설명

### dev.sh
- **목적:** 개발 환경 자동 세팅 및 서버 실행
- **사용법:**
  ```bash
  bash scripts/dev.sh
  ```
- **주요 기능:**
  - 개발용 환경 변수 자동 설정
  - 의존성 설치, DB/Redis 연결 체크
  - 마이그레이션 자동 실행
  - nodemon/ts-node로 서버 실행

---

### deploy.sh
- **목적:** 운영 배포 자동화
- **사용법:**
  ```bash
  bash scripts/deploy.sh
  ```
- **주요 기능:**
  - 운영 환경 변수 설정
  - 백업, 의존성 설치, 빌드, 마이그레이션
  - PM2로 서버 실행, 헬스체크, 롤백

---

### test.sh
- **목적:** 테스트 환경 자동화 및 커버리지 체크
- **사용법:**
  ```bash
  bash scripts/test.sh
  ```
- **주요 기능:**
  - 테스트 DB 준비, 마이그레이션
  - 린트, 유닛/통합/E2E 테스트, 커버리지

---

### env.sh
- **목적:** SaaS 공통 환경 변수 및 유틸리티 함수 정의
- **주요 기능:**
  - log_info, check_env, check_dependencies, run_migrations 등
  - 모든 .sh 스크립트에서 source로 불러 사용

---

### validate-env.js
- **목적:** .env 환경변수 필수값 검증
- **사용법:**
  ```bash
  node scripts/validate-env.js
  ```
- **주요 기능:**
  - 필수 환경변수 누락 시 에러 출력 및 종료

---

### convertRestaurants.js
- **목적:** 프론트엔드 TypeScript 데이터 → 백엔드 JSON 변환
- **사용법:**
  ```bash
  node scripts/convertRestaurants.js
  ```
- **주요 기능:**
  - Babel 파서로 TS 파일 파싱, restaurants 배열 추출 및 JSON 변환

---

### importData.js
- **목적:** 프론트엔드 데이터 구조를 백엔드 JSON으로 이관
- **사용법:**
  ```bash
  node scripts/importData.js
  ```
- **주요 기능:**
  - TS 데이터 파싱 후 JSON 파일로 저장

---

### seedRestaurants.js
- **목적:** 샘플 레스토랑 데이터베이스 시드
- **사용법:**
  ```bash
  node scripts/seedRestaurants.js
  ```
- **주요 기능:**
  - Sequelize 모델로 샘플 데이터 삽입

---

## 2. 하위 디렉토리 스크립트

### monitoring/monitor.sh
- **목적:** 시스템/서비스 상태 모니터링 자동화
- **사용법:**
  ```bash
  bash scripts/monitoring/monitor.sh
  ```
- **주요 기능:**
  - CPU/메모리/디스크/로그/보안/서비스 상태 점검 및 알림

---

### scenario/reservation.sh
- **목적:** 예약 플로우 E2E API 시나리오 자동화 테스트
- **사용법:**
  ```bash
  bash scripts/scenario/reservation.sh
  ```
- **주요 기능:**
  - 테스트 사용자 생성, 로그인, 예약/수정/취소, 리뷰 작성, 데이터 정리

---

### utils/env.sh
- **목적:** Bash 스크립트용 공통 유틸리티 함수 집합
- **주요 기능:**
  - 컬러 로깅, DB/Redis/시스템 체크, 백업, PM2 관리 등
  - 모든 bash 스크립트에서 source로 불러 사용

---

## 3. 사용 예시

- 개발 환경 실행: `bash scripts/dev.sh`
- 테스트 환경 실행: `bash scripts/test.sh`
- 운영 배포: `bash scripts/deploy.sh`
- 모니터링: `bash scripts/monitoring/monitor.sh`
- 데이터 변환: `node scripts/convertRestaurants.js`
- 시나리오 테스트: `bash scripts/scenario/reservation.sh`

---

## 4. 참고
- 각 스크립트는 실행 전 환경변수(.env), DB, 의존성 등이 올바르게 세팅되어 있어야 합니다.
- 상세 옵션/에러 발생 시 각 스크립트 내 주석 및 로그를 참고하세요.