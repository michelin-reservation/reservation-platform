# 🔐 GitHub Personal Access Token 생성 가이드

## 📋 개요

GitHub Actions CI/CD 파이프라인에서 GitHub Container Registry에 이미지를 푸시하기 위해 Personal Access Token이 필요합니다.

## 🚀 단계별 생성 방법

### 1. GitHub 로그인
- https://github.com 에 로그인

### 2. Settings 접근
- 우측 상단 프로필 아이콘 클릭
- **Settings** 선택

### 3. Developer settings 접근
- 좌측 메뉴에서 **Developer settings** 클릭

### 4. Personal access tokens 접근
- **Personal access tokens** 클릭
- **Tokens (classic)** 선택

### 5. 새 토큰 생성
- **Generate new token (classic)** 클릭
- **Generate new token** 선택

### 6. 토큰 설정
- **Note**: `michelin-reservation-platform-ci-cd` (설명)
- **Expiration**: `90 days` (권장)
- **Scopes** (권한) 선택:
  - ✅ `repo` (전체 선택)
  - ✅ `write:packages` (GitHub Container Registry 쓰기)
  - ✅ `read:packages` (GitHub Container Registry 읽기)

### 7. 토큰 생성
- **Generate token** 클릭

### 8. 토큰 복사
- 생성된 토큰을 복사 (예: `ghp_xxxxxxxxxxxxxxxxxxxx`)
- **중요**: 이 페이지를 벗어나면 토큰을 다시 볼 수 없습니다!

## 🔧 GitHub Secrets에 등록

### 1. 저장소 Settings 접근
- https://github.com/michelin-reservation/reservation-platform
- **Settings** 탭 클릭

### 2. Secrets and variables 접근
- 좌측 메뉴에서 **Secrets and variables** 클릭
- **Actions** 선택

### 3. 새 Secret 추가
- **New repository secret** 클릭
- **Name**: `DOCKER_PASSWORD`
- **Value**: 위에서 생성한 Personal Access Token
- **Add secret** 클릭

### 4. 추가 Secrets 설정
- `DOCKER_USER`: GitHub 사용자명
- `KUBECONFIG_DATA`: 위에서 제공한 base64 값
- `DOCKERHUB_USERNAME`: Docker Hub 사용자명
- `DOCKERHUB_TOKEN`: Docker Hub Access Token
- `SLACK_WEBHOOK_URL`: Slack Webhook URL

## ✅ 확인 방법

### 1. 토큰 권한 확인
```bash
# GitHub CLI로 확인
gh auth status
```

### 2. Container Registry 접근 테스트
```bash
# Docker 로그인 테스트
echo $GITHUB_TOKEN | docker login ghcr.io -u $GITHUB_USERNAME --password-stdin
```

## 🔒 보안 주의사항

1. **토큰 보안**: 생성된 토큰을 안전한 곳에 백업
2. **정기 갱신**: 90일마다 토큰 갱신
3. **최소 권한**: 필요한 권한만 부여
4. **로그 모니터링**: GitHub Actions 로그 정기 확인

## 🆘 문제 해결

### 토큰이 작동하지 않는 경우
1. 토큰 만료 확인
2. 권한 범위 확인
3. 저장소 접근 권한 확인
4. GitHub Actions 권한 확인

### Container Registry 접근 오류
1. `write:packages` 권한 확인
2. 저장소 가시성 설정 확인
3. 토큰 재생성 고려

---

**마지막 업데이트**: 2025-06-19
**버전**: 1.0.0