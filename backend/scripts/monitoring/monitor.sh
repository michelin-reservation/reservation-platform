#!/bin/bash

# 공통 유틸리티 로드
source ../utils/env.sh

# 모니터링 설정
METRICS_PORT=9090
ALERT_THRESHOLD_CPU=80
ALERT_THRESHOLD_MEMORY=80
ALERT_THRESHOLD_DISK=90

# 메트릭 수집 함수
collect_metrics() {
    log_info "Collecting system metrics..."

    # CPU 사용량
    cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d. -f1)
    log_info "CPU Usage: $cpu_usage%"

    if [[ $cpu_usage -gt $ALERT_THRESHOLD_CPU ]]; then
        log_error "High CPU usage detected: $cpu_usage%"
    fi

    # 메모리 사용량
    memory_usage=$(free | grep Mem | awk '{print int($3/$2 * 100)}')
    log_info "Memory Usage: $memory_usage%"

    if [[ $memory_usage -gt $ALERT_THRESHOLD_MEMORY ]]; then
        log_error "High memory usage detected: $memory_usage%"
    fi

    # 디스크 사용량
    disk_usage=$(df -h / | awk 'NR==2 {print int($5)}')
    log_info "Disk Usage: $disk_usage%"

    if [[ $disk_usage -gt $ALERT_THRESHOLD_DISK ]]; then
        log_error "High disk usage detected: $disk_usage%"
    fi

    return 0
}

# 애플리케이션 상태 체크
check_application_status() {
    log_info "Checking application status..."

    # PM2 프로세스 상태
    if ! pm2 describe michelin-app > /dev/null; then
        log_error "Application process not found in PM2"
        return 1
    fi

    # 애플리케이션 헬스 체크
    if ! check_service_health "http://localhost:$PORT"; then
        log_error "Application health check failed"
        return 1
    fi

    # Redis 연결 상태
    if ! check_redis_connection; then
        log_error "Redis connection failed"
        return 1
    }

    # 데이터베이스 연결 상태
    if ! check_db_connection; then
        log_error "Database connection failed"
        return 1
    fi

    return 0
}

# 로그 분석
analyze_logs() {
    log_info "Analyzing application logs..."

    # 에러 로그 카운트
    error_count=$(grep -c "ERROR" /var/log/michelin/error.log)
    if [[ $error_count -gt 0 ]]; then
        log_warn "Found $error_count errors in logs"
    fi

    # 경고 로그 카운트
    warn_count=$(grep -c "WARN" /var/log/michelin/error.log)
    if [[ $warn_count -gt 0 ]]; then
        log_info "Found $warn_count warnings in logs"
    fi

    return 0
}

# 보안 체크
security_check() {
    log_info "Performing security checks..."

    # SSL 인증서 상태
    check_ssl_cert "your-domain.com" || {
        log_error "SSL certificate check failed"
        return 1
    }

    # 파일 권한 체크
    if [[ -w "/etc/michelin/config.json" ]]; then
        log_error "Config file has wrong permissions"
        return 1
    fi

    # 중요 포트 체크
    if netstat -tuln | grep -q ":$PORT "; then
        log_info "Application port $PORT is open"
    else
        log_error "Application port $PORT is not open"
        return 1
    fi

    return 0
}

# 메인 함수
main() {
    log_info "Starting monitoring checks..."

    # 시스템 메트릭 수집
    collect_metrics || log_error "Failed to collect metrics"

    # 애플리케이션 상태 체크
    check_application_status || log_error "Application status check failed"

    # 로그 분석
    analyze_logs || log_warn "Log analysis failed"

    # 보안 체크
    security_check || log_error "Security check failed"

    # 모니터링 결과 요약
    log_info "Monitoring checks completed"
}

# 스크립트 실행
main "$@"