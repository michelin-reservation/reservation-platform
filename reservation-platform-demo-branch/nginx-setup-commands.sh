#!/bin/bash

echo "🔧 eieconcierge.com Nginx 설정 적용 스크립트"
echo "=========================================="

# 1. 설정 파일을 sites-available에 복사
echo "1️⃣ 설정 파일을 sites-available에 복사..."
sudo cp ~/eieconcierge-nginx.conf /etc/nginx/sites-available/eieconcierge

# 2. sites-enabled에 심볼릭 링크 생성
echo "2️⃣ sites-enabled에 심볼릭 링크 생성..."
sudo ln -sf /etc/nginx/sites-available/eieconcierge /etc/nginx/sites-enabled/

# 3. Nginx 설정 테스트
echo "3️⃣ Nginx 설정 테스트..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx 설정이 유효합니다!"

    # 4. Nginx 재시작
    echo "4️⃣ Nginx 재시작..."
    sudo systemctl restart nginx

    # 5. Nginx 상태 확인
    echo "5️⃣ Nginx 상태 확인..."
    sudo systemctl status nginx --no-pager

    echo ""
    echo "🎉 설정 완료!"
    echo "📝 다음 사항을 확인하세요:"
    echo "   - React 앱이 포트 8000에서 실행 중인지 확인"
    echo "   - Express 백엔드가 포트 8001에서 실행 중인지 확인"
    echo "   - 도메인 DNS가 223.130.152.6으로 설정되었는지 확인"
    echo "   - http://eieconcierge.com 접속 테스트"

else
    echo "❌ Nginx 설정에 오류가 있습니다. 설정을 확인하세요."
    exit 1
fi

echo ""
echo "📋 추가 명령어:"
echo "   - Nginx 로그 확인: sudo tail -f /var/log/nginx/eieconcierge.access.log"
echo "   - 에러 로그 확인: sudo tail -f /var/log/nginx/eieconcierge.error.log"
echo "   - Nginx 상태 확인: sudo systemctl status nginx"
echo "   - 설정 파일 편집: sudo nano /etc/nginx/sites-available/eieconcierge"