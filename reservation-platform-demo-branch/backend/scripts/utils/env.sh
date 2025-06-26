#!/bin/bash

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 로깅 유틸리티
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 프로젝트 루트 경로 설정
export PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
echo "✅ PROJECT_ROOT 설정됨: $PROJECT_ROOT"

# .env 파일만 로드 (실무 표준)
if [ -f "$PROJECT_ROOT/.env" ]; then
  set -a
  source "$PROJECT_ROOT/.env"
  set +a
  echo "✅ .env 파일 로드됨"
fi

# ENABLE_CONFIG_JSON=1 환경변수로 활성화 가능
# ---[ 혼합 구조 확장: config.json 기반 로딩 (feature flag) ]---
if [ "$ENABLE_CONFIG_JSON" = "1" ]; then
  env=${NODE_ENV:-development}
  config_file="$PROJECT_ROOT/config/config.$env.json"
  if [ -f "$config_file" ]; then
    # shellcheck disable=SC1090
    source "$config_file"
    echo "✅ config.$env.json 파일 로드됨 (혼합 구조 활성화)"
  else
    echo "⚠️  config.$env.json 파일이 없습니다. 기본 .env만 사용합니다."
  fi
else
  echo "[INFO] Using .env only (config.json not required)"
fi

# 필수 환경 변수 확인
required_vars=(
  "NODE_ENV"
  "PROJECT_ROOT"
  "DATABASE_URL"
)

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ 오류: $var 환경 변수가 설정되지 않았습니다."
    exit 1
  fi
done

echo "✅ 모든 필수 환경 변수가 설정되었습니다."

# ---[ 안내 ]---
# 기본은 .env 기반 단일화(실무 표준)
# 대규모/복잡한 정책 필요시 ENABLE_CONFIG_JSON=1로 혼합 구조 확장 가능

# 환경 변수 검증
validate_env() {
    local required_vars=("NODE_ENV" "DB_HOST" "DB_PORT" "DB_NAME" "DB_USER")
    local missing_vars=0

    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            log_error "$var is not set"
            missing_vars=$((missing_vars + 1))
        fi
    done

    if [[ $missing_vars -gt 0 ]]; then
        log_error "$missing_vars required environment variables are missing"
        return 1
    fi

    log_info "Environment validation passed"
    return 0
}

# 데이터베이스 연결 체크
check_db_connection() {
    log_info "Checking database connection..."
    if nc -z "${DB_HOST}" "${DB_PORT}"; then
        log_info "Database connection successful"
        return 0
    else
        log_error "Cannot connect to database"
        return 1
    fi
}

# 서비스 헬스 체크
check_service_health() {
    local service_url=$1
    local max_retries=${2:-3}
    local retry_count=0

    while [[ $retry_count -lt $max_retries ]]; do
        if curl -s -f "$service_url/health" > /dev/null; then
            log_info "Service health check passed"
            return 0
        fi
        retry_count=$((retry_count + 1))
        log_warn "Health check failed, attempt $retry_count of $max_retries"
        sleep 5
    done

    log_error "Service health check failed after $max_retries attempts"
    return 1
}

# 의존성 설치
install_dependencies() {
    log_info "Installing dependencies..."
    if npm install; then
        log_info "Dependencies installed successfully"
        return 0
    else
        log_error "Failed to install dependencies"
        return 1
    fi
}

# 마이그레이션 실행
run_migrations() {
    log_info "Running database migrations..."
    if npm run migrate; then
        log_info "Migrations completed successfully"
        return 0
    else
        log_error "Migration failed"
        return 1
    fi
}

# PM2 프로세스 관리
manage_pm2_process() {
    local action=$1
    local app_name=$2

    case $action in
        "start")
            pm2 start "$app_name"
            ;;
        "stop")
            pm2 stop "$app_name"
            ;;
        "restart")
            pm2 restart "$app_name"
            ;;
        "delete")
            pm2 delete "$app_name"
            ;;
        *)
            log_error "Invalid PM2 action: $action"
            return 1
            ;;
    esac
}

# 백업 생성
create_backup() {
    local backup_dir="./backups"
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="$backup_dir/backup_$timestamp.sql"

    mkdir -p "$backup_dir"
    log_info "Creating database backup..."

    if pg_dump "$DB_NAME" > "$backup_file"; then
        log_info "Backup created successfully: $backup_file"
        return 0
    else
        log_error "Backup creation failed"
        return 1
    fi
}

# SSL 인증서 체크
check_ssl_cert() {
    local domain=$1
    local cert_path="/etc/letsencrypt/live/$domain/fullchain.pem"

    if [[ -f "$cert_path" ]]; then
        local expiry_date=$(openssl x509 -enddate -noout -in "$cert_path" | cut -d= -f2)
        log_info "SSL certificate for $domain expires on: $expiry_date"
        return 0
    else
        log_error "SSL certificate not found for $domain"
        return 1
    fi
}

# 로그 로테이션 체크
check_log_rotation() {
    local log_dir="/var/log/michelin"
    local max_size_mb=100

    if [[ -d "$log_dir" ]]; then
        local size_mb=$(du -sm "$log_dir" | cut -f1)
        if [[ $size_mb -gt $max_size_mb ]]; then
            log_warn "Log directory size ($size_mb MB) exceeds maximum ($max_size_mb MB)"
            return 1
        fi
    fi
    return 0
}

# Redis 연결 체크
check_redis_connection() {
    log_info "Checking Redis connection..."
    if redis-cli ping > /dev/null; then
        log_info "Redis connection successful"
        return 0
    else
        log_error "Cannot connect to Redis"
        return 1
    fi
}

# 시스템 리소스 체크
check_system_resources() {
    local min_free_space_mb=1000
    local min_free_memory_mb=500

    # 디스크 공간 체크
    local free_space_mb=$(df -m / | awk 'NR==2 {print $4}')
    if [[ $free_space_mb -lt $min_free_space_mb ]]; then
        log_warn "Low disk space: ${free_space_mb}MB free"
        return 1
    fi

    # 메모리 체크
    local free_memory_mb=$(free -m | awk 'NR==2 {print $4}')
    if [[ $free_memory_mb -lt $min_free_memory_mb ]]; then
        log_warn "Low memory: ${free_memory_mb}MB free"
        return 1
    fi

    log_info "System resources check passed"
    return 0
}

# 환경별 설정 로드
load_environment_config() {
    local env=${NODE_ENV:-development}
    local config_file="./config/config.$env.json"

    if [[ -f "$config_file" ]]; then
        source "$config_file"
        log_info "Loaded configuration for $env environment"
        return 0
    else
        log_error "Configuration file not found: $config_file"
        return 1
    fi
}

# 메인 초기화 함수
initialize() {
    log_info "Initializing environment..."

    load_environment_config || return 1
    validate_env || return 1
    check_system_resources || return 1

    log_info "Environment initialized successfully"
    return 0
}