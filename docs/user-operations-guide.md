# 운영/실행 메뉴얼

## 🚀 Michelin 예약 플랫폼 운영/실행 가이드

### 📋 목차
1. [개발 환경 실행](#1-개발-환경-실행)
2. [운영 환경 실행](#2-운영-환경-실행)
3. [모니터링 및 로깅](#3-모니터링-및-로깅)
4. [데이터베이스 관리](#4-데이터베이스-관리)
5. [백업 및 복구](#5-백업-및-복구)
6. [장애 대응](#6-장애-대응)
7. [성능 최적화](#7-성능-최적화)
8. [보안 관리](#8-보안-관리)

---

## 1. 개발 환경 실행

### 1-1. 초기 환경 설정

| 단계 | 작업 내용 | 명령어 | 설명 |
|------|-----------|--------|------|
| **1** | 프로젝트 클론 | `git clone <repository-url>` | 프로젝트 다운로드 |
| **2** | 의존성 설치 | `npm install` | 백엔드/프론트엔드 패키지 설치 |
| **3** | 환경변수 설정 | `cp docs/env.example .env` | 환경변수 파일 생성 |
| **4** | 데이터베이스 설정 | `cp docs/env.example backend/.env` | 백엔드 환경변수 설정 |

### 1-2. 데이터베이스 실행

| 단계 | 작업 내용 | 명령어 | 설명 |
|------|-----------|--------|------|
| **1** | MySQL 컨테이너 실행 | `docker run -d --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=password mysql:8.0` | MySQL 데이터베이스 실행 |
| **2** | Redis 컨테이너 실행 | `docker run -d --name redis -p 6379:6379 redis:7-alpine` | Redis 캐시 서버 실행 |
| **3** | 데이터베이스 연결 확인 | `mysql -h localhost -P 3306 -u root -p` | MySQL 연결 테스트 |

### 1-3. 백엔드 서버 실행

| 단계 | 작업 내용 | 명령어 | 설명 |
|------|-----------|--------|------|
| **1** | 데이터베이스 마이그레이션 | `cd backend && npx prisma migrate dev` | 스키마 적용 |
| **2** | 시드 데이터 삽입 | `npm run seed` | 초기 데이터 생성 |
| **3** | 개발 서버 실행 | `npm run dev` | 개발 모드로 서버 실행 |
| **4** | 서버 상태 확인 | `curl http://localhost:8000/health` | 헬스체크 |

### 1-4. 프론트엔드 실행

| 단계 | 작업 내용 | 명령어 | 설명 |
|------|-----------|--------|------|
| **1** | 개발 서버 실행 | `cd frontend && npm run dev` | Vite 개발 서버 실행 |
| **2** | 브라우저 접속 | `http://localhost:5173` | 프론트엔드 접속 |
| **3** | 빌드 테스트 | `npm run build` | 프로덕션 빌드 테스트 |

---

## 2. 운영 환경 실행

### 2-1. Docker 기반 실행

| 단계 | 작업 내용 | 명령어 | 설명 |
|------|-----------|--------|------|
| **1** | Docker 이미지 빌드 | `docker build -t michelin-backend ./backend` | 백엔드 이미지 빌드 |
| **2** | 프론트엔드 이미지 빌드 | `docker build -t michelin-frontend ./frontend` | 프론트엔드 이미지 빌드 |
| **3** | Docker Compose 실행 | `docker-compose up -d` | 전체 서비스 실행 |
| **4** | 서비스 상태 확인 | `docker-compose ps` | 컨테이너 상태 확인 |

### 2-2. PM2 기반 실행

| 단계 | 작업 내용 | 명령어 | 설명 |
|------|-----------|--------|------|
| **1** | PM2 설치 | `npm install -g pm2` | PM2 전역 설치 |
| **2** | 환경변수 설정 | `cp .env.production .env` | 운영 환경변수 적용 |
| **3** | PM2로 서버 실행 | `pm2 start ecosystem.config.js` | PM2로 서버 실행 |
| **4** | PM2 상태 확인 | `pm2 status` | 프로세스 상태 확인 |

### 2-3. Kubernetes 기반 실행

| 단계 | 작업 내용 | 명령어 | 설명 |
|------|-----------|--------|------|
| **1** | Helm Chart 배포 | `helm upgrade --install backend ./helm/backend` | 백엔드 배포 |
| **2** | 프론트엔드 배포 | `helm upgrade --install frontend ./helm/frontend` | 프론트엔드 배포 |
| **3** | 서비스 확인 | `kubectl get pods -A` | 파드 상태 확인 |
| **4** | 로그 확인 | `kubectl logs -f deployment/backend` | 실시간 로그 확인 |

---

## 3. 모니터링 및 로깅

### 3-1. 로그 모니터링

| 단계 | 작업 내용 | 명령어 | 설명 |
|------|-----------|--------|------|
| **1** | PM2 로그 확인 | `pm2 logs` | PM2 로그 실시간 확인 |
| **2** | Docker 로그 확인 | `docker-compose logs -f backend` | Docker 컨테이너 로그 |
| **3** | Kubernetes 로그 | `kubectl logs -f deployment/backend` | K8s 파드 로그 |
| **4** | 로그 파일 확인 | `tail -f logs/app.log` | 파일 로그 확인 |

### 3-2. 시스템 모니터링

| 단계 | 작업 내용 | 명령어 | 설명 |
|------|-----------|--------|------|
| **1** | Prometheus 실행 | `helm install monitoring ./helm/monitoring` | 모니터링 스택 배포 |
| **2** | Grafana 접속 | `http://localhost:3000` | Grafana 대시보드 |
| **3** | 메트릭 확인 | `curl http://localhost:8000/metrics` | Prometheus 메트릭 |
| **4** | 알림 설정 확인 | `kubectl get alertmanager` | AlertManager 상태 |

### 3-3. 성능 모니터링

| 단계 | 작업 내용 | 명령어 | 설명 |
|------|-----------|--------|------|
| **1** | CPU/메모리 사용량 | `htop` 또는 `top` | 시스템 리소스 확인 |
| **2** | 네트워크 상태 | `netstat -tulpn` | 포트 사용량 확인 |
| **3** | 디스크 사용량 | `df -h` | 디스크 공간 확인 |
| **4** | 데이터베이스 성능 | `mysql -e "SHOW PROCESSLIST;"` | DB 쿼리 모니터링 |

---

## 4. 데이터베이스 관리

### 4-1. 데이터베이스 백업

| 단계 | 작업 내용 | 명령어 | 설명 |
|------|-----------|--------|------|
| **1** | 전체 DB 백업 | `mysqldump -u root -p michelin > backup_$(date +%Y%m%d).sql` | 전체 데이터베이스 백업 |
| **2** | 특정 테이블 백업 | `mysqldump -u root -p michelin restaurants > restaurants_backup.sql` | 특정 테이블 백업 |
| **3** | 압축 백업 | `mysqldump -u root -p michelin \| gzip > backup_$(date +%Y%m%d).sql.gz` | 압축된 백업 생성 |
| **4** | 자동 백업 스크립트 | `crontab -e` | 정기 백업 스케줄 설정 |

### 4-2. 데이터베이스 복구

| 단계 | 작업 내용 | 명령어 | 설명 |
|------|-----------|--------|------|
| **1** | 전체 DB 복구 | `mysql -u root -p michelin < backup_20241201.sql` | 전체 데이터베이스 복구 |
| **2** | 압축 백업 복구 | `gunzip < backup_20241201.sql.gz \| mysql -u root -p michelin` | 압축된 백업 복구 |
| **3** | 특정 테이블 복구 | `mysql -u root -p michelin < restaurants_backup.sql` | 특정 테이블 복구 |
| **4** | 복구 후 검증 | `mysql -u root -p -e "SELECT COUNT(*) FROM restaurants;"` | 데이터 검증 |

### 4-3. 데이터베이스 최적화

| 단계 | 작업 내용 | 명령어 | 설명 |
|------|-----------|--------|------|
| **1** | 테이블 최적화 | `mysql -u root -p -e "OPTIMIZE TABLE restaurants;"` | 테이블 최적화 |
| **2** | 인덱스 확인 | `mysql -u root -p -e "SHOW INDEX FROM restaurants;"` | 인덱스 상태 확인 |
| **3** | 느린 쿼리 로그 확인 | `tail -f /var/log/mysql/slow.log` | 느린 쿼리 모니터링 |
| **4** | 통계 업데이트 | `mysql -u root -p -e "ANALYZE TABLE restaurants;"` | 테이블 통계 업데이트 |

---

## 5. 백업 및 복구

### 5-1. 전체 시스템 백업

| 단계 | 작업 내용 | 명령어 | 설명 |
|------|-----------|--------|------|
| **1** | 애플리케이션 백업 | `tar -czf app_backup_$(date +%Y%m%d).tar.gz ./backend ./frontend` | 애플리케이션 코드 백업 |
| **2** | 환경변수 백업 | `cp .env .env.backup_$(date +%Y%m%d)` | 환경변수 백업 |
| **3** | Docker 이미지 백업 | `docker save michelin-backend > backend_image_$(date +%Y%m%d).tar` | Docker 이미지 백업 |
| **4** | 전체 백업 스크립트 | `./scripts/backup.sh` | 자동 백업 스크립트 실행 |

### 5-2. 시스템 복구

| 단계 | 작업 내용 | 명령어 | 설명 |
|------|-----------|--------|------|
| **1** | 애플리케이션 복구 | `tar -xzf app_backup_20241201.tar.gz` | 애플리케이션 코드 복구 |
| **2** | 환경변수 복구 | `cp .env.backup_20241201 .env` | 환경변수 복구 |
| **3** | Docker 이미지 복구 | `docker load < backend_image_20241201.tar` | Docker 이미지 복구 |
| **4** | 서비스 재시작 | `docker-compose up -d` 또는 `pm2 restart all` | 서비스 재시작 |

---

## 6. 장애 대응

### 6-1. 서비스 장애 진단

| 단계 | 작업 내용 | 명령어 | 설명 |
|------|-----------|--------|------|
| **1** | 서비스 상태 확인 | `curl -f http://localhost:8000/health` | 헬스체크 |
| **2** | 프로세스 확인 | `ps aux \| grep node` | Node.js 프로세스 확인 |
| **3** | 포트 확인 | `netstat -tulpn \| grep 8000` | 포트 사용량 확인 |
| **4** | 로그 확인 | `tail -n 100 logs/error.log` | 에러 로그 확인 |

### 6-2. 서비스 복구

| 단계 | 작업 내용 | 명령어 | 설명 |
|------|-----------|--------|------|
| **1** | 서비스 재시작 | `pm2 restart all` 또는 `docker-compose restart` | 서비스 재시작 |
| **2** | 데이터베이스 연결 확인 | `mysql -u root -p -e "SELECT 1;"` | DB 연결 테스트 |
| **3** | 캐시 초기화 | `redis-cli FLUSHALL` | Redis 캐시 초기화 |
| **4** | 서비스 검증 | `curl http://localhost:8000/api/restaurants` | API 응답 확인 |

### 6-3. 롤백 절차

| 단계 | 작업 내용 | 명령어 | 설명 |
|------|-----------|--------|------|
| **1** | 이전 버전 확인 | `git log --oneline -10` | 이전 커밋 확인 |
| **2** | 코드 롤백 | `git checkout <previous-commit>` | 이전 버전으로 롤백 |
| **3** | 이미지 롤백 | `docker tag michelin-backend:previous michelin-backend:latest` | 이전 이미지로 롤백 |
| **4** | 서비스 재배포 | `docker-compose up -d --force-recreate` | 강제 재배포 |

---

## 7. 성능 최적화

### 7-1. 애플리케이션 최적화

| 단계 | 작업 내용 | 명령어 | 설명 |
|------|-----------|--------|------|
| **1** | 메모리 사용량 확인 | `pm2 monit` | PM2 모니터링 |
| **2** | CPU 프로파일링 | `node --prof app.js` | CPU 프로파일링 |
| **3** | 메모리 프로파일링 | `node --inspect app.js` | 메모리 프로파일링 |
| **4** | 성능 테스트 | `npm run test:performance` | 성능 테스트 실행 |

### 7-2. 데이터베이스 최적화

| 단계 | 작업 내용 | 명령어 | 설명 |
|------|-----------|--------|------|
| **1** | 쿼리 최적화 | `EXPLAIN SELECT * FROM restaurants WHERE city = 'Seoul';` | 쿼리 실행 계획 확인 |
| **2** | 인덱스 추가 | `CREATE INDEX idx_city ON restaurants(city);` | 인덱스 생성 |
| **3** | 테이블 파티셔닝 | `ALTER TABLE reservations PARTITION BY RANGE(YEAR(date));` | 테이블 파티셔닝 |
| **4** | 캐시 설정 | `redis-cli SET restaurant:1 "data" EX 3600` | Redis 캐시 설정 |

### 7-3. 네트워크 최적화

| 단계 | 작업 내용 | 명령어 | 설명 |
|------|-----------|--------|------|
| **1** | CDN 설정 | Cloudflare 또는 AWS CloudFront 설정 | 정적 파일 CDN |
| **2** | 압축 설정 | `gzip -t static/*.js` | 파일 압축 확인 |
| **3** | 캐시 헤더 설정 | `Cache-Control: max-age=3600` | 브라우저 캐시 설정 |
| **4** | 로드 밸런싱 | `nginx -t` | Nginx 설정 확인 |

---

## 8. 보안 관리

### 8-1. 보안 점검

| 단계 | 작업 내용 | 명령어 | 설명 |
|------|-----------|--------|------|
| **1** | 취약점 스캔 | `npm audit` | NPM 패키지 취약점 확인 |
| **2** | 포트 스캔 | `nmap localhost` | 열린 포트 확인 |
| **3** | SSL 인증서 확인 | `openssl s_client -connect localhost:443` | SSL 인증서 확인 |
| **4** | 로그 분석 | `grep "ERROR\|WARN" logs/app.log` | 보안 관련 로그 확인 |

### 8-2. 보안 강화

| 단계 | 작업 내용 | 명령어 | 설명 |
|------|-----------|--------|------|
| **1** | 방화벽 설정 | `ufw enable && ufw allow 22,80,443` | 방화벽 활성화 |
| **2** | SSH 보안 강화 | `sudo nano /etc/ssh/sshd_config` | SSH 설정 강화 |
| **3** | 패스워드 정책 | `passwd -l username` | 계정 잠금 |
| **4** | 백업 암호화 | `gpg -e backup.sql` | 백업 파일 암호화 |

### 8-3. 모니터링 및 알림

| 단계 | 작업 내용 | 명령어 | 설명 |
|------|-----------|--------|------|
| **1** | 로그 모니터링 | `tail -f logs/security.log` | 보안 로그 모니터링 |
| **2** | 알림 설정 | `echo "alert" \| mail -s "Security Alert" admin@example.com` | 이메일 알림 |
| **3** | 접속 로그 확인 | `last` | 사용자 접속 기록 |
| **4** | 파일 무결성 확인 | `md5sum important_file` | 파일 해시 확인 |

---

## 📞 긴급 연락처

| 역할 | 연락처 | 담당 업무 |
|------|--------|-----------|
| **시스템 관리자** | admin@michelin.com | 전체 시스템 관리 |
| **데이터베이스 관리자** | dba@michelin.com | DB 백업/복구 |
| **개발팀 리드** | dev-lead@michelin.com | 코드 배포/롤백 |
| **보안팀** | security@michelin.com | 보안 사고 대응 |

## 🔧 유용한 스크립트

### 자동 백업 스크립트
```bash
#!/bin/bash
# scripts/backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup"

# 데이터베이스 백업
mysqldump -u root -p michelin > $BACKUP_DIR/db_$DATE.sql

# 애플리케이션 백업
tar -czf $BACKUP_DIR/app_$DATE.tar.gz ./backend ./frontend

# 로그 백업
tar -czf $BACKUP_DIR/logs_$DATE.tar.gz ./logs

echo "Backup completed: $DATE"
```

### 헬스체크 스크립트
```bash
#!/bin/bash
# scripts/healthcheck.sh
URL="http://localhost:8000/health"
MAX_RETRIES=3

for i in {1..$MAX_RETRIES}; do
    if curl -f $URL > /dev/null 2>&1; then
        echo "Service is healthy"
        exit 0
    fi
    sleep 5
done

echo "Service is unhealthy"
exit 1
```

---

## 📋 실무 운영 체크리스트

### 일일 점검 사항
- [ ] 서비스 상태 확인
- [ ] 로그 에러 확인
- [ ] 디스크 공간 확인
- [ ] 백업 완료 확인

### 주간 점검 사항
- [ ] 성능 메트릭 분석
- [ ] 보안 업데이트 확인
- [ ] 백업 복구 테스트
- [ ] 모니터링 알림 설정 확인

### 월간 점검 사항
- [ ] 전체 시스템 점검
- [ ] 성능 최적화 검토
- [ ] 보안 감사
- [ ] 문서 업데이트

### 배포 전 체크리스트
- [ ] 환경변수 설정 확인
- [ ] 데이터베이스 마이그레이션
- [ ] SSL 인증서 설정
- [ ] CORS 설정 확인
- [ ] 로그 디렉토리 권한
- [ ] 백업 설정

### 모니터링 체크리스트
- [ ] Sentry 알림 설정
- [ ] Prometheus 타겟 설정
- [ ] Grafana 대시보드 구성
- [ ] 로그 로테이션 설정
- [ ] 디스크 공간 모니터링

### 보안 체크리스트
- [ ] 환경변수 보안
- [ ] API 레이트 리밋
- [ ] Helmet 설정
- [ ] JWT 토큰 관리
- [ ] CORS 정책

---

## 📞 연락처 및 지원

### 담당자
- 기술 지원: juns (junexi0828@gmail.com)
- 운영 지원: [운영팀 연락처]
- EIE팀: EIEcontect@gmail.com

### 문서
- [API 문서](./api-specification.md)
- [ERD 문서](./erd.md)
- [배포 가이드](./deployment-guide.md)

---

*이 운영 가이드는 실무에서 바로 활용할 수 있도록 작성되었습니다.*