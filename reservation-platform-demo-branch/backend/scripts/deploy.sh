#!/bin/bash

# 공통 유틸리티 로드
source "$(dirname "$0")/utils/env.sh"

# 운영 환경 변수 설정
export NODE_ENV=production
export PORT=8080
export APP_NAME="michelin-app"

# 배포 설정
DEPLOY_DIR="/opt/michelin"
BACKUP_DIR="$DEPLOY_DIR/backups"
LOG_DIR="/var/log/michelin"

# 메인 함수
main() {
    log_info "Starting deployment process..."

    # 초기화
    initialize || exit 1

    # 백업 디렉토리 생성
    mkdir -p "$BACKUP_DIR"
    mkdir -p "$LOG_DIR"

    # 현재 버전 백업
    if [[ -d "$DEPLOY_DIR" ]]; then
        create_backup || {
            log_error "Backup failed"
            exit 1
        }
    fi

    # 시스템 리소스 체크
    check_system_resources || {
        log_error "Insufficient system resources"
        exit 1
    }

    # SSL 인증서 체크
    check_ssl_cert "your-domain.com" || {
        log_warn "SSL certificate check failed but continuing..."
    }

    # PM2 프로세스 중지
    manage_pm2_process "stop" "$APP_NAME" || {
        log_warn "No existing PM2 process found"
    }

    # 의존성 설치
    log_info "Installing production dependencies..."
    npm ci --only=production || {
        log_error "Failed to install dependencies"
        exit 1
    }

    # TypeScript 빌드
    log_info "Building TypeScript..."
    npm run build || {
        log_error "Build failed"
        exit 1
    }

    # 데이터베이스 마이그레이션
    run_migrations || {
        log_error "Migration failed"
        manage_pm2_process "start" "$APP_NAME"  # 이전 버전 재시작
        exit 1
    }

    # PM2로 애플리케이션 시작
    log_info "Starting application with PM2..."
    manage_pm2_process "start" "ecosystem.config.js" --env production || {
        log_error "Failed to start application"
        exit 1
    }

    # 헬스 체크
    check_service_health "http://localhost:$PORT" || {
        log_error "Health check failed"
        manage_pm2_process "restart" "$APP_NAME"  # 재시작 시도
        exit 1
    }

    # 로그 로테이션 체크
    check_log_rotation || {
        log_warn "Log rotation check failed"
    }

    log_info "Deployment completed successfully"
}

# 스크립트 실행
main "$@"