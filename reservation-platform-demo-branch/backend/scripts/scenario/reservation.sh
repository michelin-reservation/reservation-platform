#!/bin/bash

# 공통 유틸리티 로드
source ../utils/env.sh

# 테스트 데이터
TEST_USER='{"email": "test@example.com", "password": "Test123!"}'
TEST_RESTAURANT='{"id": 1, "name": "Test Restaurant"}'
TEST_RESERVATION='{"date": "2024-12-25", "time": "19:00", "guests": 2}'

# API 엔드포인트
API_URL="http://localhost:3000/api"

# 사용자 생성 및 로그인
create_test_user() {
    log_info "Creating test user..."
    response=$(curl -s -X POST "$API_URL/auth/register" \
        -H "Content-Type: application/json" \
        -d "$TEST_USER")

    if [[ $(echo "$response" | jq -r '.success') != "true" ]]; then
        log_error "Failed to create test user"
        return 1
    fi
}

# 로그인 및 토큰 획득
login_user() {
    log_info "Logging in test user..."
    response=$(curl -s -X POST "$API_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d "$TEST_USER")

    TOKEN=$(echo "$response" | jq -r '.token')
    if [[ -z "$TOKEN" ]]; then
        log_error "Failed to get authentication token"
        return 1
    fi
}

# 레스토랑 검색
search_restaurant() {
    log_info "Searching for restaurant..."
    response=$(curl -s -X GET "$API_URL/restaurants/search?query=Test" \
        -H "Authorization: Bearer $TOKEN")

    if [[ $(echo "$response" | jq -r '.restaurants | length') -eq 0 ]]; then
        log_error "No restaurants found"
        return 1
    fi
}

# 예약 생성
create_reservation() {
    log_info "Creating reservation..."
    response=$(curl -s -X POST "$API_URL/reservations" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "$TEST_RESERVATION")

    RESERVATION_ID=$(echo "$response" | jq -r '.id')
    if [[ -z "$RESERVATION_ID" ]]; then
        log_error "Failed to create reservation"
        return 1
    fi
}

# 예약 수정
modify_reservation() {
    log_info "Modifying reservation..."
    modified_reservation=$(echo "$TEST_RESERVATION" | jq '.guests = 4')

    response=$(curl -s -X PUT "$API_URL/reservations/$RESERVATION_ID" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "$modified_reservation")

    if [[ $(echo "$response" | jq -r '.success') != "true" ]]; then
        log_error "Failed to modify reservation"
        return 1
    fi
}

# 예약 취소
cancel_reservation() {
    log_info "Cancelling reservation..."
    response=$(curl -s -X DELETE "$API_URL/reservations/$RESERVATION_ID" \
        -H "Authorization: Bearer $TOKEN")

    if [[ $(echo "$response" | jq -r '.success') != "true" ]]; then
        log_error "Failed to cancel reservation"
        return 1
    fi
}

# 리뷰 작성
create_review() {
    log_info "Creating review..."
    review_data='{"rating": 5, "comment": "Great experience!"}'

    response=$(curl -s -X POST "$API_URL/reviews" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "$review_data")

    if [[ $(echo "$response" | jq -r '.success') != "true" ]]; then
        log_error "Failed to create review"
        return 1
    fi
}

# 테스트 데이터 정리
cleanup() {
    log_info "Cleaning up test data..."
    curl -s -X DELETE "$API_URL/auth/user" \
        -H "Authorization: Bearer $TOKEN"
}

# 메인 시나리오 실행
main() {
    log_info "Starting reservation flow scenario..."

    # 사용자 생성 및 로그인
    create_test_user || exit 1
    login_user || exit 1

    # 레스토랑 검색
    search_restaurant || exit 1

    # 예약 프로세스
    create_reservation || exit 1
    modify_reservation || exit 1
    cancel_reservation || exit 1

    # 리뷰 작성
    create_review || exit 1

    # 정리
    cleanup

    log_info "Reservation flow scenario completed successfully"
}

# 스크립트 실행
main "$@"