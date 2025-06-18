#!/bin/bash

# 공통 유틸리티 로드
source "$(dirname "$0")/utils/env.sh"

# 테스트 환경 변수 설정
export NODE_ENV=test
export PORT=3001
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=michelin_test
export DB_USER=postgres

# 테스트 설정
COVERAGE_DIR="./coverage"
TEST_REPORT_DIR="./test-reports"
MIN_COVERAGE=80

# 메인 함수
main() {
    log_info "Starting test environment setup..."

    # 초기화
    initialize || exit 1

    # 테스트 디렉토리 준비
    mkdir -p "$COVERAGE_DIR"
    mkdir -p "$TEST_REPORT_DIR"

    # 의존성 설치 (개발 의존성 포함)
    log_info "Installing dependencies..."
    npm install || {
        log_error "Failed to install dependencies"
        exit 1
    }

    # 테스트 데이터베이스 준비
    log_info "Preparing test database..."
    check_db_connection || {
        log_error "Database connection failed"
        exit 1
    }

    # 테스트 DB 마이그레이션
    run_migrations || {
        log_error "Test database migration failed"
        exit 1
    }

    # 린트 검사
    log_info "Running linter..."
    npm run lint || {
        log_warn "Linting failed but continuing..."
    }

    # 유닛 테스트 실행
    log_info "Running unit tests..."
    npm run test:unit || {
        log_error "Unit tests failed"
        exit 1
    }

    # 통합 테스트 실행
    log_info "Running integration tests..."
    npm run test:integration || {
        log_error "Integration tests failed"
        exit 1
    }

    # E2E 테스트 실행
    log_info "Running E2E tests..."
    npm run test:e2e || {
        log_error "E2E tests failed"
        exit 1
    }

    # 커버리지 체크
    log_info "Checking test coverage..."
    coverage=$(npm run test:coverage | grep "All files" | awk '{print $4}' | tr -d '%')
    if [[ $coverage -lt $MIN_COVERAGE ]]; then
        log_error "Test coverage ($coverage%) is below minimum required ($MIN_COVERAGE%)"
        exit 1
    fi

    # 테스트 리포트 생성
    log_info "Generating test reports..."
    npm run test:report || {
        log_warn "Failed to generate test reports"
    }

    log_info "All tests completed successfully"
    log_info "Test coverage: $coverage%"
}

# 스크립트 실행
main "$@"