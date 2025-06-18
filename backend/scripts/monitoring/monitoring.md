# monitoring/monitor.sh 사용 설명서

## 목적
- 시스템 및 서비스(애플리케이션, DB, Redis 등) 상태를 실시간으로 점검하고, 이상 징후를 조기에 감지하기 위한 자동화 모니터링 스크립트입니다.

## 사용법
```bash
bash scripts/monitoring/monitor.sh
```

## 주요 기능
- CPU/메모리/디스크 사용률 수집 및 임계치 초과 시 경고
- PM2 프로세스 및 서비스 헬스체크
- DB/Redis 연결 상태 점검
- 로그 파일 내 에러/경고 카운트
- SSL 인증서, 파일 권한, 포트 등 보안 체크
- 결과를 컬러 로그로 출력

## 실행 예시
```bash
bash scripts/monitoring/monitor.sh
```

## 확장 포인트
- Slack/Discord 등 외부 알림 연동 (curl로 웹훅 호출)
- 모니터링 주기적 실행 (crontab 등록)
- 모니터링 결과를 파일/DB에 저장

## 참고
- scripts/utils/env.sh의 공통 함수(log_info, check_db_connection 등)를 사용합니다.
- 임계치, 경로 등은 필요에 따라 스크립트 상단에서 조정 가능합니다.