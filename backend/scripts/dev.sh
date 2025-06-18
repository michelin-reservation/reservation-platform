#!/bin/bash

# 공통 유틸리티 로드
source "$(dirname "$0")/utils/env.sh"

# 개발 환경 변수 설정
export NODE_ENV=development
export PORT=3000
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=michelin_dev
export DB_USER=postgres

# 메인 함수
main() {
    log_info "Starting development environment setup..."

    # 초기화
    validate_env || exit 1
    check_system_resources || {
        log_warn "System resources check failed but continuing..."
    }

    # 의존성 설치
    install_dependencies || exit 1

    # 데이터베이스 연결 체크
    check_db_connection || {
        log_error "Database connection failed"
        exit 1
    }

    # Redis 연결 체크
    check_redis_connection || {
        log_warn "Redis connection failed but continuing..."
    }

    # 마이그레이션 실행
    run_migrations || {
        log_error "Migration failed"
        exit 1
    }

    # 개발 서버 시작
    log_info "Starting development server..."
    if [[ -f "nodemon.json" ]]; then
        npx nodemon src/index.ts
    else
        log_warn "nodemon.json not found, falling back to ts-node"
        npx ts-node src/index.ts
    fi
}

# 스크립트 실행
main "$@"