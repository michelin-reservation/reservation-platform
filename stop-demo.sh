#!/bin/bash

echo "🛑 미슐랭 예약 플랫폼 시연 종료 중..."
echo "=================================="

# Docker 컨테이너 정리
echo "🐳 Docker 컨테이너 정리 중..."
docker-compose down -v

# Docker 시스템 정리
echo "🧹 Docker 시스템 정리 중..."
docker system prune -f

# 포트 사용 프로세스 정리
echo "🔍 포트 사용 프로세스 정리 중..."
pkill -f "node.*8001" 2>/dev/null || true
pkill -f "vite.*5173" 2>/dev/null || true

# 포트 강제 해제
echo "🔓 포트 강제 해제 중..."
lsof -ti:8001 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
lsof -ti:8080 | xargs kill -9 2>/dev/null || true

echo ""
echo "✅ 미슐랭 예약 플랫폼 시연이 완전히 종료되었습니다."
echo "=================================="