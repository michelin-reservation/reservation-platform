# Michelin 모니터링 스택 Helm Chart

이 Helm Chart는 Michelin 예약 플랫폼을 위한 완전한 모니터링 스택을 제공합니다.

## 구성 요소

- **Prometheus**: 메트릭 수집 및 저장
- **Grafana**: 대시보드 및 시각화
- **Loki**: 로그 수집 및 저장
- **Promtail**: 로그 수집 에이전트 (DaemonSet)

## 설치

### 개발 환경

```bash
helm install monitoring ./helm/monitoring -f ./helm/monitoring/values-dev.yaml
```

### 프로덕션 환경

```bash
helm install monitoring ./helm/monitoring -f ./helm/monitoring/values-prod.yaml
```

## 접근 방법

### 포트 포워딩 (개발 환경)

```bash
# Grafana 접근
kubectl port-forward svc/monitoring-grafana 3000:3000

# Prometheus 접근
kubectl port-forward svc/monitoring-prometheus 9090:9090

# Loki 접근
kubectl port-forward svc/monitoring-loki 3100:3100
```

### Ingress (프로덕션 환경)

- Grafana: https://monitoring.michelin.com
- Prometheus: https://monitoring.michelin.com/prometheus
- Loki: https://monitoring.michelin.com/loki

## 기본 로그인 정보

- **Grafana**:
  - 사용자명: `admin`
  - 비밀번호: `michelin2025` (개발) / Secret에서 주입 (프로덕션)

## 모니터링 대상

### 자동 발견
- Kubernetes Pods (annotation 기반)
- Michelin Backend (`backend:8000/metrics`)
- Michelin Frontend (`frontend:3000/metrics`)
- MySQL (`db:3306`)
- Redis (`redis:6379`)

### 로그 수집
- 모든 Kubernetes Pod 로그
- Docker 컨테이너 로그
- 시스템 로그

## 알림 규칙

### 기본 알림
- **HighCPUUsage**: CPU 사용률 > 80% (5분)
- **HighMemoryUsage**: 메모리 사용률 > 80% (5분)
- **HighErrorRate**: 에러율 > 5% (2분)

## 데이터 보존

### Prometheus
- 메트릭 데이터: 200시간 (기본)
- 스토리지: 10Gi (개발) / 50Gi (프로덕션)

### Loki
- 로그 데이터: 168시간 (7일)
- 스토리지: 10Gi (개발) / 100Gi (프로덕션)

### Grafana
- 대시보드 및 설정: 영구 저장
- 스토리지: 5Gi (개발) / 10Gi (프로덕션)

## 리소스 요구사항

### 개발 환경
- CPU: 550m (요청) / 1.1 cores (제한)
- 메모리: 1.2Gi (요청) / 2.3Gi (제한)

### 프로덕션 환경
- CPU: 1.35 cores (요청) / 2.8 cores (제한)
- 메모리: 2.5Gi (요청) / 5.5Gi (제한)

## 설정 커스터마이징

### values.yaml 수정

```yaml
# Prometheus 설정
prometheus:
  enabled: true
  config:
    global:
      scrape_interval: 15s
      evaluation_interval: 15s

# Grafana 설정
grafana:
  enabled: true
  adminPassword: "your-password"

# Loki 설정
loki:
  enabled: true
  persistence:
    size: 50Gi
```

### 환경별 설정

- `values-dev.yaml`: 개발 환경용 설정
- `values-prod.yaml`: 프로덕션 환경용 설정

## 문제 해결

### Pod 상태 확인

```bash
kubectl get pods -l app.kubernetes.io/name=monitoring
```

### 로그 확인

```bash
# Prometheus 로그
kubectl logs -l component=prometheus

# Grafana 로그
kubectl logs -l component=grafana

# Loki 로그
kubectl logs -l component=loki

# Promtail 로그
kubectl logs -l component=promtail
```

### 서비스 상태 확인

```bash
kubectl get svc -l app.kubernetes.io/name=monitoring
```

### PVC 상태 확인

```bash
kubectl get pvc -l app.kubernetes.io/name=monitoring
```

## 업그레이드

```bash
helm upgrade monitoring ./helm/monitoring -f ./helm/monitoring/values-prod.yaml
```

## 제거

```bash
helm uninstall monitoring
```

## 추가 기능

### Alertmanager (선택사항)

프로덕션 환경에서 Alertmanager를 활성화하여 Slack 알림을 설정할 수 있습니다:

```yaml
alertmanager:
  enabled: true
  config:
    global:
      slack_api_url: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK'
    route:
      group_by: ['alertname']
      group_wait: 10s
      group_interval: 10s
      repeat_interval: 1h
      receiver: 'slack-notifications'
    receivers:
      - name: 'slack-notifications'
        slack_configs:
          - channel: '#alerts'
            title: '{{ template "slack.title" . }}'
            text: '{{ template "slack.text" . }}'
```

### 커스텀 대시보드

Grafana에 커스텀 대시보드를 추가하려면 ConfigMap을 생성하여 대시보드를 자동으로 프로비저닝할 수 있습니다.

## 지원

문제가 발생하면 다음을 확인하세요:

1. Pod 상태 및 로그
2. 서비스 연결성
3. PVC 바인딩 상태
4. 리소스 사용량
5. 네트워크 정책