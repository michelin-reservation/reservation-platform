#!/bin/bash

# 실무 DevOps: 모든 실행 중인 MySQL 컨테이너에서 michelin% DB 자동 탐색 및 상태 점검
# 사용법: chmod +x check_michelin_dbs_all_containers.sh && ./check_michelin_dbs_all_containers.sh

MYSQL_USER="root"
MYSQL_PASSWORD="0426"  # 실제 루트 비밀번호로 수정
TARGET_PREFIX="michelin"

# 색상 출력 함수
function info() { echo -e "\033[1;34m[INFO]\033[0m $1"; }
function warn() { echo -e "\033[1;33m[WARN]\033[0m $1"; }
function error() { echo -e "\033[1;31m[ERROR]\033[0m $1"; }

info "🔍 실행 중인 모든 Docker 컨테이너에서 '$TARGET_PREFIX%' DB 탐색 시작..."

# MySQL 컨테이너 후보만 가져오기 (포트 3306 포함된 컨테이너)
MYSQL_CONTAINERS=$(docker ps --format '{{.Names}}' | while read cname; do
  docker port "$cname" 2>/dev/null | grep -q '3306/tcp' && echo "$cname"
done)

if [ -z "$MYSQL_CONTAINERS" ]; then
  warn "✅ 실행 중인 MySQL 컨테이너가 없습니다."
  exit 0
fi

for CONTAINER in $MYSQL_CONTAINERS; do
  echo ""
  info "🧩 컨테이너: $CONTAINER"

  # DB 목록에서 michelin 계열만 필터링
  DB_LIST=$(docker exec -i "$CONTAINER" \
    mysql -u$MYSQL_USER -p$MYSQL_PASSWORD -e "SHOW DATABASES;" 2>/dev/null \
    | grep "^$TARGET_PREFIX")

  if [ -z "$DB_LIST" ]; then
    warn "📭 '$TARGET_PREFIX%' DB 없음"
    continue
  fi

  for DB in $DB_LIST; do
    echo ""
    info "📦 검사 중: $DB"

    TABLES=$(docker exec -i "$CONTAINER" \
      mysql -u$MYSQL_USER -p$MYSQL_PASSWORD -e "USE $DB; SHOW TABLES;" 2>/dev/null \
      | tail -n +2)

    if [ -z "$TABLES" ]; then
      warn "❌ 테이블 없음 (마이그레이션 안 됨 가능성)"
    else
      echo "$TABLES" | while read table; do
        echo "  - 📄 $table"
      done
    fi

    META=$(docker exec -i "$CONTAINER" \
      mysql -u$MYSQL_USER -p$MYSQL_PASSWORD -e "USE $DB; SELECT * FROM SequelizeMeta;" 2>/dev/null \
      | tail -n +2)

    if [ -z "$META" ]; then
      warn "⚠️  SequelizeMeta 없음 → 마이그레이션 미실행"
    else
      echo "$META" | while read migration; do
        echo "  ✅ 마이그레이션 기록: $migration"
      done
    fi
  done
done

echo ""
info "✅ 모든 컨테이너 탐색 완료"