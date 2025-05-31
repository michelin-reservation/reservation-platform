const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

class NotificationServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map(); // user_id -> WebSocket

    this.wss.on('connection', (ws, req) => {
      // 토큰 검증
      const token = req.url.split('token=')[1];
      if (!token) {
        ws.close(1008, '인증 토큰이 필요합니다.');
        return;
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user_id = decoded.user_id;
        
        // 클라이언트 연결 저장
        this.clients.set(user_id, ws);

        // 연결 종료 시 클라이언트 제거
        ws.on('close', () => {
          this.clients.delete(user_id);
        });

        // 에러 처리
        ws.on('error', (error) => {
          console.error('WebSocket 에러:', error);
          this.clients.delete(user_id);
        });

      } catch (err) {
        ws.close(1008, '유효하지 않은 토큰입니다.');
      }
    });
  }

  // 특정 사용자에게 알림 전송
  sendToUser(user_id, message) {
    const ws = this.clients.get(user_id);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  // 관리자에게 알림 전송
  sendToAdmins(message) {
    this.clients.forEach((ws, user_id) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    });
  }
}

module.exports = NotificationServer; 