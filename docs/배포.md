# 배포/운영 가이드

## 실무 환경 즉시 구축/운영 자동화 요약
- `npm install`로 모든 의존성 자동 설치
- `.env`(개발), `.env.production`(운영) 환경변수 분리, docs/env.example 참고
- `pm2 start ecosystem.config.js`로 서버 무중단 자동 실행, `pm2 logs/monit/list`로 실시간 모니터링
- Sentry, Prometheus, Grafana, winston, morgan 등 운영/모니터링 도구 연동
- 운영자는 위 사용법만 따르면 실무 환경을 바로 구축/운영 가능
- 실무 표준 8단계, 운영 배포 체크리스트, 모니터링/자동화 가이드는 README.md와 docs에 최신화

## 실무 표준 8단계 업그레이드 로드맵
1. 관리자 인증 미들웨어 도입 (isAdmin, /api/admin 보호)
2. 에러 핸들러 및 에러 표준화 (errorHandler, 일관된 에러 응답)
3. Swagger 문서 자동화 (swagger.yaml, Swagger UI 연동)
4. Controller-Service 분리 (user, 알림, 예약, 리뷰 등)
5. 테스트 커버리지 확장 (user/notification/reservation/review 등, 정상/실패 케이스)
6. 보안 미들웨어 추가 (helmet, express-rate-limit)
7. RESTful 라우팅 개선 (상세/수정/삭제까지 반영)
8. 운영/모니터링 도구 연동 (winston, morgan, Sentry, Prometheus, pm2, README 가이드)

## 🌐 Michelin SaaS형 예약 플랫폼: 배포자 & 사용자 운영 절차

### 🧑‍💻 배포자(운영 관리자)의 전체 절차

| 단계 | 작업 내용 | 명령어/도구 | 파일/설정 |
|------|-----------|-------------|-----------|
| **1-1** | NCP 서버(Ubuntu) 생성, SSH 포트 변경 | NCP 콘솔 접속 | 서버 인스턴스 생성 |
| **1-2** | 방화벽(UFW) 설정, 포트 개방 | `sudo ufw allow 8000,8001,22` | `/etc/ufw/ufw.conf` |
| **1-3** | 서버에 도커, 쿠버네티스(k3s/k8s), 헬름 설치 | `curl -sfL https://get.k3s.io \| sh` | k3s 설치 스크립트 |
| **1-4** | SSL 인증서 발급 및 Ingress 적용 | `kubectl apply -f cert-manager.yaml` | `ClusterIssuer` |
| **1-5** | SSH 공개키 인증 설정 | `ssh-copy-id -i ~/.ssh/id_rsa.pub user@server` | `~/.ssh/authorized_keys` |
| **2-1** | Docker Hub 계정 생성 및 Personal Access Token 발급 | Docker Hub 웹사이트 | Personal Access Token |
| **2-2** | GitHub Secrets 등록 | GitHub Settings → Secrets | `DOCKER_USERNAME`, `DOCKER_PASSWORD` |
| **2-3** | 도메인 구매 및 A레코드 설정 | DNS 관리 콘솔 | A레코드: `@` → NCP IP |
| **2-4** | Ingress에 TLS 적용 및 https 서비스 확인 | `kubectl get ingress` | `cert-manager`, `nginx-ingress` |
| **3-1** | .github/workflows/ci-cd.yaml 설정 | GitHub Actions 설정 | `.github/workflows/ci-cd.yaml` |
| **3-2** | CI 단계: Lint, Test, Build | `npm run lint && npm test && npm run build` | `ESLint`, `Jest` |
| **3-3** | CD 단계: Docker 이미지 빌드/푸시 → Helm 배포 | `docker build -t image:tag .` | `docker`, `helm` |
| **3-4** | Slack 알림 설정 | GitHub Secrets 설정 | `SLACK_WEBHOOK_URL` |
| **4-1** | Dockerfile, docker-compose.yml 로컬 실행 테스트 | `docker-compose up -d --build` | `backend/`, `frontend/` |
| **4-2** | Helm Chart 구성 | `helm package ./helm/backend` | `values.yaml`, `templates/` |
| **4-3** | 이미지 태그 자동 반영 | CI 환경변수 설정 | `image.tag: latest` 또는 `SHA` |
| **5-1** | git push 후 GitHub Actions 전체 실행 확인 | `git push origin main` | GitHub Actions |
| **5-2** | kubectl get pods로 배포된 컨테이너 상태 확인 | `kubectl get pods -A` | `kubectl` |
| **5-3** | 프론트 URL 접속 후 기능 점검 | 브라우저 접속 | `https://your-domain.com` |
| **5-4** | Prometheus/Grafana로 모니터링 설정 점검 | `helm install monitoring ./helm/monitoring` | `helm/monitoring` |

### 🙋 사용자(배포 받는 사람)의 전체 절차

| 단계 | 작업 내용 | 명령어/도구 | 파일/설정 |
|------|-----------|-------------|-----------|
| **1-1** | Helm 설치 | `curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 \| bash` | Helm 설치 스크립트 |
| **1-2** | kubectl 설치 및 클러스터 연결 | `kubectl config use-context your-cluster` | `kubeconfig.yaml` |
| **1-3** | NCP 등에서 인프라 생성 (필요 시) | 클라우드 콘솔 | 서버, DNS 등 |
| **2-1** | .env 템플릿을 복사해서 backend/.env, frontend/.env 생성 | `cp docs/env.example backend/.env` | 샘플 템플릿 |
| **2-2** | Helm 배포 전 values.yaml에서 환경변수 및 이미지 태그 설정 | `vi helm/backend/values.yaml` | `helm/backend/values.yaml` |
| **2-3** | 인증 키, API Key, DB URL 등 설정 반영 | GitHub Secrets 또는 수동 적용 | 환경변수 설정 |
| **3-1** | Helm Chart 받아서 values 수정 | `git clone <repo> && cd helm/backend` | `git clone`, `vi values.yaml` |
| **3-2** | Helm 배포 | `helm upgrade --install backend ./helm/backend -f values.yaml` | Helm 명령어 |
| **3-3** | 서비스 확인 | `kubectl get svc && kubectl get ingress` | `kubectl` |
| **4-1** | 브라우저로 도메인 접속 테스트 | 브라우저 접속 | `https://your-domain.com` |
| **4-2** | 주요 기능 사용 (회원가입, 예약, 리뷰 등) | 웹 UI 테스트 | 웹 애플리케이션 |
| **4-3** | 에러 발생 시 로그 확인 | `kubectl logs <pod-name>` | `kubectl logs`, 브라우저 콘솔 |
| **5-1** | 배포 재시도 | `helm upgrade` 또는 CI/CD 트리거 | Helm 명령어 |
| **5-2** | 이미지 태그 변경 | `values.yaml`의 `image.tag` 수정 | `values.yaml` |
| **5-3** | 환경 변수 변경 | Helm `values.yaml` 수정 후 재배포 | `values.yaml` |
| **5-4** | 백업/장애 대응 | DB 및 로그 백업 스크립트 활용 | 백업 스크립트 |

### 📌 핵심 요약

| 역할 | 핵심 책임 | 주요 도구 |
|------|-----------|-----------|
| **배포자(DevOps)** | 전체 인프라, 인증, 자동화 파이프라인, 도메인 구성 및 Helm 설계 | GitHub Actions, Docker, Helm, kubectl |
| **사용자(배포 받는 측)** | Helm Chart 기반 배포 실행, 환경 변수 설정, 기능 점검 | Helm, kubectl, 브라우저 |

## 1. Docker 빌드 및 실행

### 백엔드
```bash
cd backend
docker build -t michelin-backend .
docker run -d -p 8000:8000 --env-file .env michelin-backend
```

### 프론트엔드
```bash
cd frontend
docker build -t michelin-frontend .
docker run -d -p 5173:5173 michelin-frontend
```

## 2. docker-compose 통합 실행
```bash
docker-compose up -d --build
```

## 3. Github Actions(CI/CD)
- `.github/workflows/ci.yml` 자동화: main 브랜치 push 시 빌드/배포
- Docker Hub에 이미지 push → NCP 서버에 SSH로 배포
- secrets: DOCKERHUB_USERNAME, DOCKERHUB_TOKEN, NCP_HOST, NCP_USERNAME, NCP_SSH_KEY 등 필요

### Helm Chart 배포 명령어
```bash
helm upgrade --install backend ./helm/backend -f helm/backend/values.yaml
helm upgrade --install frontend ./helm/frontend -f helm/frontend/values.yaml
```

## 4. NCP 서버 운영
- 서버에 docker, docker-compose, node, mysql 설치 필요
- 환경변수(.env) 및 DB 백업/복구 주기적 관리
- 장애/오류 발생 시 docker logs, docker-compose logs 등으로 진단

## 5. 기타
- 배포/롤백/운영 자동화는 infra/ 폴더 및 docs/ 참고
- 실서비스 운영 전 staging/dev 환경에서 충분히 테스트 권장

## 6. 실무 운영 배포 체크리스트

### 환경변수 분리
- 개발: `.env`
- 운영: `.env.production` (운영용 값)

### CORS
- 운영 프론트 도메인만 허용 (`CORS_ORIGIN=https://yourdomain.com`)

### HTTPS
- 운영 서버는 반드시 HTTPS 적용 (Nginx/Cloudflare 등 프록시 활용)
- API 주소도 `https://`로 환경변수에 입력

### 보안
- .env, .env.production 등은 절대 Git에 커밋하지 않기
- .env.example만 커밋

### 빌드/배포
- 프론트: `npm run build` 후 정적 파일 배포 (Nginx, S3, Vercel 등)
- 백엔드: PM2, Docker, 클라우드 서비스 등으로 배포

### 자동화
- GitHub Actions, Jenkins 등으로 CI/CD 파이프라인 구축 권장

### 모니터링/로깅
- 운영 환경에서는 winston, Sentry, Datadog 등으로 에러/로그 관리