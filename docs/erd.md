# ERD (Entity Relationship Diagram) - Michelin Reservation Platform

---

## 1. Table 및 Entity 정의

### Users
- UserID (PK)
- UserName
- Password
- Email
- UserType (일반, VIP, 사업자)
- CreatedAt
- Phone
- VipCardRegistered
- VipCardNumber

### Restaurants
- RestaurantID (PK)
- RestaurantName
- Location
- Latitude / Longitude
- Stars
- Menu
- Corkage
- Parking
- NumberOfSeats
- RegistrationDate
- CommissionFee

### Reservations
- ReservationID (PK)
- UserID (FK)
- RestaurantID (FK)
- ReservationTime
- GuestCount
- SpecialRequest
- Status

### VipRequests
- RequestID (PK)
- UserID (FK)
- CompanyName
- Itinerary
- Status
- AssignedStaff

### Reviews
- ReviewID (PK)
- UserID (FK)
- RestaurantID (FK)
- Rating
- Content
- CreatedAt

### Payments
- PaymentID (PK)
- ReservationID (FK)
- ServicePackage
- AdditionalServices
- ReservationFee
- PaymentStatus
- PaymentMethod

### Services
- ServiceID (PK)
- ServiceName
- Contractor
- Price
- ReservationFee

---

## 2. ERD 다이어그램

![ERD 다이어그램](./erd-entity.png)
![ERD 관계도](./erd-relationship.png)

---

## 3. 주요 관계 설명

- Users 1:N Reservations, Reviews, VipRequests
- Restaurants 1:N Reservations, Reviews
- Reservations 1:1 Payments
- Reservations N:M Services (중간테이블 ReservationServices로 확장 가능)
- 각 테이블의 상세 컬럼/관계는 위 표와 이미지 참고

---

## 4. 플로우차트

![예약/회원 플로우차트](./flowchart.png)

---

> 실제 DB/모델/마이그레이션은 이 ERD와 100% 동기화하여 관리합니다.

PORT=8001
DB_HOST=localhost
DB_PORT=3306
DB_NAME=michelin_db
DB_USER=michelin_user
DB_PASS=yourpassword
JWT_SECRET=your_super_secret 

# Michelin Reservation Platform - 개발/운영 전략 (최종)

---

## 전체 구성 전략 개요 

## 1. 주요 구성요소 및 플랫폼

| 역할         | 사용 기술/서비스                | 설명                                      |
| ------------ | ------------------------------ | ----------------------------------------- |
| 개발환경     | 로컬 (Mac/Win)                 | 전체 코드 개발 (React + Express + MariaDB)|
| 코드저장소   | GitHub                         | CI/CD 트리거, 형상 관리                   |
| DB 서버      | Synology DS223j (MariaDB)      | 24시간 가동 DB (로컬/외부 포트포워딩)     |
| 웹서버/API   | NCP Ubuntu VM                  | 프론트+백엔드 Docker로 구동               |
| 정적파일     | NAS/NCP Object Storage         | 이미지, 첨부파일 등 저장소                |

---

## 2. 도메인/네트워크 전략

| 항목             | 설명                                         | 비고                        |
| ---------------- | -------------------------------------------- | --------------------------- |
| 도메인 구매 여부 | 선택 사항                                    | 실 서비스 시 구매           |
| 서브도메인 구성  | api.도메인.com, www.도메인.com               | nginx 리버스 프록시         |
| 공인 IP          | NCP 서버에서 제공                             | 도메인 연결/포트포워딩      |
| NAS 접속         | 내부: 로컬IP / 외부: DDNS/공인IP+포트         | 예: jun.synology.me:3307    |

---

## 3. 디렉토리 및 구성 구조

```
project-root/
├── frontend/        # React 프로젝트
├── backend/         # Express API 서버
├── database/        # Sequelize 모델 + 마이그레이션
├── deploy/          # Docker, nginx, CI/CD 관련 파일
└── docs/            # ERD, API 명세, 회의록, 전략 정리
```

---

## 4. 단계별 구현 순서

1. **로컬 개발**: 프론트(5173), 백엔드(8001), MariaDB(로컬/NAS)
2. **NAS DB 구성**: MariaDB 설치, 포트포워딩, DDNS 등
3. **.env 설정**: 환경별 분리 관리
4. **NCP 서버 준비**: Ubuntu VM, Docker/nginx, GitHub Actions
5. **CI/CD 구성**: 자동 빌드/배포, NAS DB 연결

---

## 5. 보안 및 운영 전략

| 항목         | 설명                                         |
| ------------ | -------------------------------------------- |
| NCP 서버     | SSH만 허용, root 제한                        |
| NAS          | DB 포트 외부 제한/IP 화이트리스트            |
| .env         | git 미포함, 서버에 수동 배치/Secrets 사용    |
| SSL(선택)    | Let's Encrypt + nginx 무료 HTTPS             |

---

## 6. 비용/운영 전략

| 항목           | 고려 포인트                                 |
| -------------- | ------------------------------------------- |
| DB             | NAS 운영 시 무료, NCP DB는 과금             |
| 서버           | 무료 크레딧 후 트래픽 기준 과금             |
| Object Storage | 업/다운로드 트래픽 기준 과금                |
| 도메인         | 연 1~2만원(선택)                            |

---

## 7. 기타

- 모든 전략/구성/운영 내역은 docs/에 최신화하여 관리
- BEP 분석, 확장/마이그레이션 전략 등도 추가 예정 