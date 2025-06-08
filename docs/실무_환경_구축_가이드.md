# 실무 환경 구축 및 운영 가이드

## 1. 초기 환경 구축

### 1.1 의존성 설치
```bash
# 프로젝트 루트 디렉토리에서
npm install
```
- 모든 필요한 패키지가 자동으로 설치됩니다:
  - 백엔드: Express, Sequelize, JWT, Redis 등
  - 모니터링: winston, morgan, Sentry, Prometheus
  - 프로세스 관리: pm2 (글로벌 설치 포함)

### 1.2 환경변수 설정
1. backend/.env 파일 생성:
```bash
# docs/env.example을 복사하여 사용
cp docs/env.example backend/.env
```

2. 필수 환경변수:
```env
# 데이터베이스
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_HOST=localhost

# JWT
JWT_SECRET=your_jwt_secret

# Sentry (에러 추적)
SENTRY_DSN_DEV=your_sentry_dsn_dev
SENTRY_DSN_PROD=your_sentry_dsn_prod

# CORS
CORS_ORIGIN=http://localhost:3000

# 기타 설정
NODE_ENV=development
PORT=8000
```

## 2. 모니터링 및 로깅 시스템

### 2.1 로그 시스템 (winston + morgan)
- 로그 파일 위치: `logs/`
  - `error.log`: 에러 로그
  - `combined.log`: 모든 로그
- 개발 환경: 콘솔에 컬러로 출력
- 운영 환경: 파일에 저장
- 로그 포맷:
  ```json
  {
    "timestamp": "2024-03-21T10:00:00.000Z",
    "level": "info",
    "message": "API 요청",
    "method": "GET",
    "url": "/api/users",
    "status": 200,
    "responseTime": "50ms"
  }
  ```

### 2.2 Sentry 에러 추적
1. Sentry 프로젝트 설정:
   - [Sentry.io](https://sentry.io)에서 프로젝트 생성
   - DSN 발급받아 .env에 등록
   - Slack/Email 알림 채널 연동

2. 에러 추적 기능:
   - 실시간 에러 감지
   - 스택 트레이스 자동 수집
   - 사용자 컨텍스트 정보 포함
   - 환경별(개발/운영) 에러 분리

### 2.3 Prometheus + Grafana 모니터링
1. 메트릭 수집:
   - `/metrics` 엔드포인트 자동 생성
   - 기본 메트릭:
     - HTTP 요청 시간
     - 활성 사용자 수
     - 총 예약 수
     - 서버 리소스 사용량

2. Grafana 대시보드:
   - API 응답 시간
   - 에러율
   - 사용자 활동
   - 서버 상태

## 3. 프로세스 관리 (pm2)

### 3.1 서버 실행
```bash
# 개발 환경
npm run dev

# 운영 환경
pm2 start ecosystem.config.js
```

### 3.2 모니터링 명령어
```bash
# 프로세스 상태 확인
pm2 list

# 실시간 모니터링
pm2 monit

# 로그 확인
pm2 logs

# 특정 앱 로그
pm2 logs michelin-api
```

### 3.3 자동 재시작
- 서버 충돌 시 자동 재시작
- 메모리 제한 초과 시 재시작
- 시스템 재부팅 시 자동 시작

## 4. 실무 운영 체크리스트

### 4.1 배포 전 체크리스트
- [ ] 환경변수 설정 확인
- [ ] 데이터베이스 마이그레이션
- [ ] SSL 인증서 설정
- [ ] CORS 설정 확인
- [ ] 로그 디렉토리 권한
- [ ] 백업 설정

### 4.2 모니터링 체크리스트
- [ ] Sentry 알림 설정
- [ ] Prometheus 타겟 설정
- [ ] Grafana 대시보드 구성
- [ ] 로그 로테이션 설정
- [ ] 디스크 공간 모니터링

### 4.3 보안 체크리스트
- [ ] 환경변수 보안
- [ ] API 레이트 리밋
- [ ] Helmet 설정
- [ ] JWT 토큰 관리
- [ ] CORS 정책

## 5. 문제 해결 가이드

### 5.1 로그 확인
```bash
# 에러 로그 확인
tail -f logs/error.log

# 전체 로그 확인
tail -f logs/combined.log

# pm2 로그 확인
pm2 logs
```

### 5.2 Sentry 에러 확인
1. Sentry 대시보드 접속
2. 프로젝트 선택
3. Issues 탭에서 에러 확인
4. 상세 정보 및 컨텍스트 확인

### 5.3 Prometheus 메트릭 확인
1. `/metrics` 엔드포인트 접속
2. Grafana 대시보드 확인
3. 알림 규칙 확인

## 6. 유지보수 가이드

### 6.1 로그 관리
- 일별 로그 로테이션
- 주기적인 로그 백업
- 오래된 로그 정리

### 6.2 모니터링 유지보수
- Sentry 프로젝트 정리
- Grafana 대시보드 업데이트
- 알림 규칙 조정

### 6.3 성능 최적화
- 캐시 전략 검토
- DB 쿼리 최적화
- API 응답 시간 모니터링

## 7. 연락처 및 지원

### 7.1 담당자
- 기술 지원: juns (junexi0828@gmail.com)
- 운영 지원: [운영팀 연락처]

### 7.2 문서
- [API 문서](./api.md)
- [ERD 문서](./erd.md)
- [배포 가이드](./배포.md) 