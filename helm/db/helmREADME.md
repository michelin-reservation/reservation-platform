# DB Helm Chart

MySQL 데이터베이스를 위한 Helm Chart로, 자동 마이그레이션과 seed 데이터 주입 기능을 포함합니다.

## 주요 기능

### 1. 자동 DB 초기화
- 데이터베이스 및 테이블 자동 생성
- 초기 사용자 및 권한 설정
- Seed 데이터 자동 주입

### 2. 초기화 방식
두 가지 방식으로 초기화를 수행할 수 있습니다:

#### A. MySQL docker-entrypoint-initdb.d 방식 (권장)
- MySQL 컨테이너 시작 시 자동으로 실행
- `/docker-entrypoint-initdb.d` 디렉토리에 마운트된 SQL 스크립트들이 순서대로 실행
- postStart hook으로 초기화 상태 확인

#### B. Helm Job 방식
- Helm 설치/업그레이드 시 pre-install, pre-upgrade hook으로 실행
- 별도의 Job으로 초기화 수행
- 초기화 완료 여부를 확인하여 중복 실행 방지

### 3. 초기화 스크립트 순서
1. `01-init-database.sql` - 데이터베이스 생성 및 권한 설정
2. `02-create-tables.sql` - 테이블 스키마 생성
3. `03-seed-data.sql` - 기본 사용자 및 설정 데이터
4. `04-seed-restaurants.sql` - 식당 및 메뉴 데이터
5. `05-mark-initialized.sql` - 초기화 완료 표시

## 설치 방법

### 개발 환경
```bash
helm install db ./helm/db -f ./helm/db/values-dev.yaml
```

### 운영 환경
```bash
helm install db ./helm/db -f ./helm/db/values-prod.yaml
```

### 기본 설치
```bash
helm install db ./helm/db
```

## 설정 옵션

### initContainer 설정
```yaml
initContainer:
  enabled: true  # 초기화 기능 활성화/비활성화
  image:
    repository: mysql
    tag: "8.0"
    pullPolicy: IfNotPresent
  resources:
    limits:
      cpu: 200m
      memory: 256Mi
    requests:
      cpu: 100m
      memory: 128Mi
```

### 환경 변수
```yaml
env:
  MYSQL_DATABASE: michelin_dev  # 데이터베이스 이름
  MYSQL_USER: michelin_user     # 사용자 이름

secrets:
  MYSQL_ROOT_PASSWORD: "password"  # root 비밀번호
  MYSQL_PASSWORD: "password"       # 사용자 비밀번호
```

### 리소스 설정
```yaml
resources:
  limits:
    cpu: 500m
    memory: 1Gi
  requests:
    cpu: 200m
    memory: 512Mi
```

## 초기화 확인

### Pod 로그 확인
```bash
# MySQL Pod 로그 확인
kubectl logs -f deployment/db

# 초기화 Job 로그 확인 (Job 방식 사용 시)
kubectl logs -f job/db-init
```

### 데이터베이스 연결 확인
```bash
# Pod에 접속
kubectl exec -it deployment/db -- mysql -u root -p

# 초기화 상태 확인
USE michelin_dev;
SELECT * FROM db_initialization;
```

## 데이터베이스 스키마

### 주요 테이블
- `users` - 사용자 정보
- `restaurants` - 식당 정보
- `menu_items` - 메뉴 아이템
- `reservations` - 예약 정보
- `reviews` - 리뷰
- `favorites` - 즐겨찾기
- `payments` - 결제 정보
- `vip_requests` - VIP 요청
- `notification_settings` - 알림 설정

### 초기 데이터
- 관리자 계정: `admin@michelin.com`
- 테스트 사용자: `user@test.com`
- 비즈니스 사용자: `business@test.com`
- 5개 미쉐린 가이드 식당 데이터
- 각 식당별 메뉴 데이터

## 문제 해결

### 초기화 실패 시
1. Pod 로그 확인
2. ConfigMap이 올바르게 생성되었는지 확인
3. Secret이 올바르게 설정되었는지 확인
4. PVC 권한 확인

### 초기화 재실행
```bash
# Job 방식 사용 시
kubectl delete job db-init
helm upgrade db ./helm/db

# 또는 수동으로 초기화 테이블 삭제 후 재배포
kubectl exec -it deployment/db -- mysql -u root -p -e "DROP TABLE IF EXISTS michelin_dev.db_initialization;"
kubectl delete pod -l app=db
```

## 업그레이드

### 스키마 업그레이드
1. 새로운 마이그레이션 스크립트 추가
2. 버전 번호 업데이트
3. Helm 업그레이드

```bash
helm upgrade db ./helm/db -f ./helm/db/values-prod.yaml
```

### 데이터 백업
```bash
# 전체 데이터베이스 백업
kubectl exec deployment/db -- mysqldump -u root -p michelin_prod > backup.sql

# 특정 테이블 백업
kubectl exec deployment/db -- mysqldump -u root -p michelin_prod restaurants > restaurants_backup.sql
```

## 보안 고려사항

1. 운영 환경에서는 강력한 비밀번호 사용
2. Secret을 통한 민감 정보 관리
3. 네트워크 정책으로 접근 제한
4. 정기적인 백업 수행
5. 로그 모니터링 설정