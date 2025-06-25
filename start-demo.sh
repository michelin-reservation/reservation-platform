#!/bin/bash

echo "🍽️  미슐랭 예약 플랫폼 시연 시작!"
echo "=================================="

# 기존 프로세스 정리
echo "🧹 기존 프로세스 정리 중..."
pkill -f "node.*8001" 2>/dev/null || true
pkill -f "vite.*5173" 2>/dev/null || true

# Docker 컨테이너 정리
echo "🐳 Docker 컨테이너 정리 중..."
docker-compose down -v 2>/dev/null || true
docker system prune -f 2>/dev/null || true

# 포트 사용 확인
echo "🔍 포트 사용 확인 중..."
if lsof -Pi :8001 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ 포트 8001이 이미 사용 중입니다. 프로세스를 종료합니다."
    lsof -ti:8001 | xargs kill -9 2>/dev/null || true
fi

if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ 포트 5173이 이미 사용 중입니다. 프로세스를 종료합니다."
    lsof -ti:5173 | xargs kill -9 2>/dev/null || true
fi

if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ 포트 8080이 이미 사용 중입니다. 프로세스를 종료합니다."
    lsof -ti:8080 | xargs kill -9 2>/dev/null || true
fi

# Docker 이미지 빌드
echo "🔨 Docker 이미지 빌드 중..."
docker-compose build --no-cache

# 컨테이너 시작
echo "🚀 Docker 컨테이너 시작 중..."
docker-compose up -d

# 서비스 상태 확인
echo "⏳ 서비스 시작 대기 중..."
sleep 10

# 헬스체크
echo "🏥 서비스 상태 확인 중..."
for i in {1..30}; do
    if curl -s http://localhost:8080/health > /dev/null; then
        echo "✅ 모든 서비스가 정상 동작 중입니다!"
        break
    fi
    echo "⏳ 서비스 시작 대기 중... ($i/30)"
    sleep 2
done

# 최종 상태 확인
echo ""
echo "🎉 미슐랭 예약 플랫폼 시연 준비 완료!"
echo "=================================="
echo "📱 프론트엔드: http://localhost:8080"
echo "🔧 백엔드 API: http://localhost:8001"
echo "📊 헬스체크: http://localhost:8080/health"
echo ""
echo "🛑 종료하려면: ./stop-demo.sh"
echo "=================================="

# 브라우저 자동 열기 (macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🌐 브라우저를 자동으로 열어드립니다..."
    open http://localhost:8080
fi