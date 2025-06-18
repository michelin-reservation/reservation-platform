#!/bin/bash

# DB 초기화 테스트 스크립트

set -e

echo "=== DB 초기화 테스트 시작 ==="

# 1. Helm Chart 설치
echo "1. Helm Chart 설치 중..."
helm install db-test ./helm/db -f ./helm/db/values-dev.yaml --wait --timeout=10m

# 2. Pod 상태 확인
echo "2. Pod 상태 확인 중..."
kubectl wait --for=condition=ready pod -l app=db-test --timeout=300s

# 3. 초기화 Job 상태 확인
echo "3. 초기화 Job 상태 확인 중..."
kubectl wait --for=condition=complete job/db-test-init --timeout=300s

# 4. 데이터베이스 연결 테스트
echo "4. 데이터베이스 연결 테스트 중..."
kubectl exec deployment/db-test -- mysql -u root -p0426 -e "SELECT 1;" michelin_dev

# 5. 초기화 상태 확인
echo "5. 초기화 상태 확인 중..."
kubectl exec deployment/db-test -- mysql -u root -p0426 -e "SELECT * FROM db_initialization;" michelin_dev

# 6. 테이블 존재 확인
echo "6. 테이블 존재 확인 중..."
TABLES=$(kubectl exec deployment/db-test -- mysql -u root -p0426 -s -N -e "SHOW TABLES;" michelin_dev)
echo "생성된 테이블: $TABLES"

# 7. 사용자 데이터 확인
echo "7. 사용자 데이터 확인 중..."
kubectl exec deployment/db-test -- mysql -u root -p0426 -e "SELECT id, email, name, role FROM users;" michelin_dev

# 8. 식당 데이터 확인
echo "8. 식당 데이터 확인 중..."
kubectl exec deployment/db-test -- mysql -u root -p0426 -e "SELECT id, nameKorean, category FROM restaurants LIMIT 3;" michelin_dev

# 9. 메뉴 데이터 확인
echo "9. 메뉴 데이터 확인 중..."
kubectl exec deployment/db-test -- mysql -u root -p0426 -e "SELECT COUNT(*) as menu_count FROM menu_items;" michelin_dev

echo "=== DB 초기화 테스트 완료 ==="

# 10. 정리 (선택사항)
read -p "테스트 완료. Helm Chart를 삭제하시겠습니까? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Helm Chart 삭제 중..."
    helm uninstall db-test
    echo "삭제 완료"
fi