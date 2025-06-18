# Michelin Reservation Platform GitOps (ArgoCD) 운영 가이드

## 1. 디렉토리 구조 (실무 표준)

```
michelin-reservation-platform-2025-Q2/
  ├── helm/
  │   ├── backend/
  │   ├── frontend/
  │   └── monitoring/
  ├── apps/
  │   ├── backend-app.yaml
  │   ├── frontend-app.yaml
  │   └── monitoring-app.yaml
  └── ...
```

- **ArgoCD Application YAML은 apps/ 디렉토리에 위치**
- ArgoCD UI/CLI에서 apps/backend-app.yaml, apps/frontend-app.yaml, apps/monitoring-app.yaml을 등록

## 2. ArgoCD Application YAML (실무 표준)

(아래 파일들을 apps/ 디렉토리에서 관리)

- monitoring-app.yaml
- backend-app.yaml
- frontend-app.yaml

## 3. 운영 전략
- 모든 Helm Chart, values, 대시보드, 알림, 설정을 Git에서 관리
- ArgoCD UI/CLI로 배포 상태 모니터링 및 롤백
- PR/MR 기반 변경 승인 및 이력 관리
- 환경별 values 파일 분리(예: dev, prod)
- 보안: ArgoCD RBAC, SSO, Webhook 인증 등 적용