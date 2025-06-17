#!/bin/bash

# SaaS 공통 환경 변수
export APP_NAME="michelin-reservation"
export APP_PORT=8000
export METRICS_PORT=9100
export LOG_DIR="./logs"
export DEPLOY_DIR="./dist"

# 색상 코드 (로그 레벨)
export RED='\033[0;31m'
export GREEN='\033[0;32m'
export YELLOW='\033[1;33m'
export NC='\033[0m'

# 로깅 유틸리티
log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# 환경 체크 유틸리티
check_env() {
    ENV_FILE=".env.$1"
    if [ ! -f "$ENV_FILE" ]; then
        log_warn "Missing $ENV_FILE"
        cp .env.example "$ENV_FILE"
        log_info "Created $ENV_FILE from example"
        log_warn "Please configure $ENV_FILE before proceeding"
        exit 1
    fi
}

# 의존성 체크 유틸리티
check_dependencies() {
    if [ ! -d "node_modules" ]; then
        log_info "Installing dependencies..."
        npm install
        if [ $? -ne 0 ]; then
            log_error "Failed to install dependencies"
            exit 1
        fi
    fi
}

# 포트 체크 유틸리티
check_port() {
    if lsof -Pi :"$1" -sTCP:LISTEN -t >/dev/null ; then
        log_error "Port $1 is already in use"
        exit 1
    fi
}

# 로그 디렉토리 설정
setup_logs() {
    mkdir -p "$LOG_DIR"
    if [ ! -f "$LOG_DIR/$1.log" ]; then
        touch "$LOG_DIR/$1.log"
    fi
}

# DB 마이그레이션 유틸리티
run_migrations() {
    log_info "Running database migrations for $1 environment"
    NODE_ENV=$1 npx prisma migrate deploy
    if [ $? -ne 0 ]; then
        log_error "Migration failed"
        exit 1
    fi
}

# PM2 프로세스 관리
manage_pm2() {
    case $1 in
        "start")
            pm2 start ecosystem.config.js --env "$2"
            ;;
        "reload")
            pm2 reload ecosystem.config.js --env "$2"
            ;;
        "stop")
            pm2 stop ecosystem.config.js
            ;;
        "delete")
            pm2 delete ecosystem.config.js
            ;;
    esac
}

# 빌드 유틸리티
build_app() {
    log_info "Building application..."
    npm run build
    if [ $? -ne 0 ]; then
        log_error "Build failed"
        exit 1
    fi
}

# 헬스 체크 유틸리티
health_check() {
    local retries=5
    local wait=2
    local endpoint="http://localhost:$APP_PORT/health"

    log_info "Running health check on $endpoint"

    for i in $(seq 1 $retries); do
        if curl -s "$endpoint" > /dev/null; then
            log_info "Health check passed"
            return 0
        fi
        log_warn "Health check attempt $i failed, retrying in ${wait}s..."
        sleep $wait
    done

    log_error "Health check failed after $retries attempts"
    return 1
}