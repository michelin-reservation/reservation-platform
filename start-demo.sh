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

# pm2 상태 및 로그 모니터링 안내
if command -v pm2 >/dev/null 2>&1; then
    echo ""
    echo "🖥️  [PM2 모니터링 안내]"
    echo "----------------------------------"
    echo "백엔드 상태 확인: pm2 list"
    echo "백엔드 실시간 로그: pm2 logs michelin-backend"
    echo "백엔드 재시작: pm2 restart michelin-backend"
    echo "----------------------------------"
    pm2 list
    echo ""
    echo "최근 백엔드 로그 10줄:"
    pm2 logs michelin-backend --lines 10
    echo "----------------------------------"
else
    echo "⚠️  pm2가 설치되어 있지 않습니다. 백엔드 프로세스 모니터링을 원하면 'npm install -g pm2'로 설치하세요."
fi

# --- 통합 모니터링 안내 (Sentry, Prometheus, Grafana) ---
echo ""
echo "🛡️  [통합 모니터링 안내]"
echo "----------------------------------"
echo "- Sentry: 코드/서버 에러 발생 시 자동 전송 (대시보드는 Sentry 웹에서 확인)"
echo "- Prometheus: http://localhost:9090 (메트릭 실시간 조회)"
echo "- Grafana:    http://localhost:3000 (대시보드 시각화)"
echo "    로그인: admin / shitshti123@"
echo "- Backend 메트릭: http://localhost:8001/metrics"
echo "- Frontend 메트릭: http://localhost:8080/metrics (구현 시)"
echo "----------------------------------"
echo "Prometheus, Grafana는 docker-compose 또는 helm으로 별도 기동 필요."
echo "Kubernetes 환경에서는 포트포워딩 또는 Ingress로 접근하세요."
echo "----------------------------------"