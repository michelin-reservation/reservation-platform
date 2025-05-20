# ERD 및 DB 스키마

## 1. ERD 이미지
- docs/flowchart1.png, docs/flowchart2.png 등(첨부 이미지 참고)

## 2. 테이블/엔티티 설명
- Users, Restaurants, Reservations, VipRequests, Reviews, Payments, Services 등 실무 엔티티 구조
- 상세 컬럼/관계/제약조건은 michelin_db.txt 참고

## 3. DDL(SQL)
- [michelin_db.txt](./michelin_db.txt) 파일에 MySQL 테이블 생성문 전체 수록

---

### 주요 엔티티 요약
- Users: 회원(일반/B2B/VIP), 전화번호, VIP카드 등
- Restaurants: 식당, 좌석수, 미슐랭, 콜키지, 주차 등
- Reservations: 예약, 인원, 요청사항, 상태 등
- VipRequests: VIP 전용 예약/일정/담당자
- Reviews: 리뷰, 평점, 내용, 작성자 등
- Payments: 결제, 패키지, 결제상태, 결제방식 등
- Services: 서비스 패키지, 계약사, 단가 등

---

> ERD 이미지와 상세 구조는 docs/flowchart1.png, docs/flowchart2.png, docs/flowchart3.png 등 참고 

PORT=8001
DB_HOST=localhost
DB_PORT=3306
DB_NAME=michelin_db
DB_USER=michelin_user
DB_PASS=yourpassword
JWT_SECRET=your_super_secret 