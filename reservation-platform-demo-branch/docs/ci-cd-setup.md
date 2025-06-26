# 🚀 GitHub Actions CI/CD 설정 가이드

## 📋 개요

이 문서는 Michelin Reservation Platform의 GitHub Actions CI/CD 파이프라인 설정 방법을 설명합니다.

## 🔐 GitHub Secrets 설정

### 1. GitHub 저장소에서 Secrets 설정

**Settings → Secrets and variables → Actions** 메뉴로 이동하여 다음 Secrets를 설정하세요:

#### 🐳 Docker 관련 Secrets

| Secret 이름 | 설명 | 예시 값 |
|------------|------|---------|
| `DOCKER_USER` | GitHub Container Registry 사용자명 | `your-github-username` |
| `DOCKER_PASSWORD` | GitHub Personal Access Token | `ghp_xxxxxxxxxxxxxxxxxxxx` |
| `DOCKERHUB_USERNAME` | Docker Hub 사용자명 | `your-dockerhub-username` |
| `DOCKERHUB_TOKEN` | Docker Hub Access Token | `dckr_pat_xxxxxxxxxxxxxxxxxxxx` |

#### ☸️ Kubernetes 관련 Secrets

| Secret 이름 | 설명 | 예시 값 |
|------------|------|---------|
| `KUBECONFIG_DATA` | Base64로 인코딩된 kubeconfig | `YXBpVmVyc2lvbjogdjEKa2luZDogQ29uZmlnCmN1cnJlbnQtY29udGV4dDoga2luZC1taWNoZWxpbi1kZXYtY29udHJvbC1wbGFuZQo...` |

#### 📱 알림 관련 Secrets

| Secret 이름 | 설명 | 예시 값 |
|------------|------|---------|
| `SLACK_WEBHOOK_URL` | Slack Webhook URL | `https://hooks.slack.com/services/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` |

## 🔧 Secrets 생성 방법

### 1. GitHub Personal Access Token 생성

1. **GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)**
2. **Generate new token (classic)** 클릭
3. 다음 권한 선택:
   - `repo` (전체)
   - `write:packages` (GitHub Container Registry)
   - `read:packages` (GitHub Container Registry)
4. 토큰 생성 후 `DOCKER_PASSWORD`로 저장

### 2. Docker Hub Access Token 생성

1. **Docker Hub → Account Settings → Security → New Access Token**
2. 토큰 이름 입력 (예: `github-actions`)
3. 토큰 생성 후 `DOCKERHUB_TOKEN`으로 저장

### 3. Kubernetes kubeconfig 생성

```bash
# 현재 kubeconfig를 base64로 인코딩
cat ~/.kube/config | base64 -w 0
```

결과값을 `KUBECONFIG_DATA`로 저장

### 4. Slack Webhook URL 생성

1. **Slack App → Incoming Webhooks → Add New Webhook to Workspace**
2. 채널 선택 (예: `#michelin-reservation-platform-2025-q2`)
3. Webhook URL을 `SLACK_WEBHOOK_URL`로 저장

## 🚀 CI/CD 파이프라인 동작

### 1. 트리거 조건

- **main 브랜치 푸시**: 전체 배포 (프로덕션)
- **develop 브랜치 푸시**: 코드 품질 검사만
- **Pull Request**: 코드 품질 검사만

### 2. 파이프라인 단계

#### 🔍 코드 품질 검사 (code-quality)
- Node.js 18 설정
- 의존성 설치 (`npm ci`)
- 린팅 실행 (`npm run lint`)
- 테스트 실행 (`npm test`)

#### 🐳 Docker 이미지 빌드 (build-and-push)
- GitHub Container Registry 로그인
- Docker Hub 로그인
- Backend/Frontend 이미지 빌드 및 푸시
- 캐시 최적화

#### 🚀 Kubernetes 배포 (deploy)
- kubectl 및 Helm 설정
- 데이터베이스 배포
- Redis 배포
- Backend 배포
- Frontend 배포
- 모니터링 스택 배포
- Nginx 배포
- 배포 상태 확인

#### 📊 알림 (notify)
- Slack으로 배포 결과 알림

## 🔍 문제 해결

### 1. 권한 오류

```bash
# GitHub Container Registry 권한 확인
gh auth status

# Docker Hub 로그인 테스트
docker login -u $DOCKERHUB_USERNAME -p $DOCKERHUB_TOKEN
```

### 2. Kubernetes 연결 오류

```bash
# kubeconfig 테스트
kubectl cluster-info

# 네임스페이스 확인
kubectl get namespaces
```

### 3. Helm 배포 오류

```bash
# Helm 차트 검증
helm lint ./helm/backend
helm lint ./helm/frontend
helm lint ./helm/monitoring

# 배포 상태 확인
helm list -A
kubectl get pods -A
```

## 📊 모니터링

### 1. GitHub Actions 대시보드

- **Actions** 탭에서 워크플로우 실행 상태 확인
- 실시간 로그 및 오류 추적

### 2. Slack 알림

- 배포 성공/실패 알림
- 커밋 정보 및 실행 시간 표시

### 3. Kubernetes 모니터링

```bash
# Pod 상태 확인
kubectl get pods -A

# 서비스 상태 확인
kubectl get services

# Ingress 상태 확인
kubectl get ingress
```

## 🔒 보안 고려사항

1. **Secrets 관리**: 민감한 정보는 항상 GitHub Secrets 사용
2. **토큰 권한**: 최소 권한 원칙 적용
3. **정기 갱신**: 토큰 정기적 갱신 (90일)
4. **액세스 로그**: GitHub Actions 로그 모니터링

## 📞 지원

문제가 발생하면 다음을 확인하세요:

1. **GitHub Actions 로그**: 실시간 오류 메시지
2. **Secrets 설정**: 모든 필수 Secrets가 올바르게 설정되었는지
3. **권한 확인**: 토큰에 필요한 권한이 부여되었는지
4. **네트워크 연결**: Kubernetes 클러스터 연결 상태

## 🛡️ 워크플로우 보호 규칙

- main 브랜치에 직접 push 금지, PR만 허용
- PR merge 전 워크플로우(lint/test/build/deploy) 모두 통과 필수
- Settings > Branches > Add rule에서 보호 규칙 설정

---

**마지막 업데이트**: 2025-06-19
**버전**: 1.0.0