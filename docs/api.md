# Michelin Reservation Platform API 문서

## 사용자 API

### 예약 목록 조회
- **URL**: `/api/users/reservations`
- **Method**: `GET`
- **인증**: JWT 토큰 필요
- **응답**:
  ```json
  [
    {
      "reservation_id": 1,
      "reservation_time": "2024-03-20T19:00:00.000Z",
      "guest_count": 2,
      "status": "확정",
      "restaurant": {
        "restaurant_id": 1,
        "name": "미쉐린 레스토랑",
        "location": "서울시 강남구",
        "stars": 3
      }
    }
  ]
  ```

### 리뷰 목록 조회
- **URL**: `/api/users/reviews`
- **Method**: `GET`
- **인증**: JWT 토큰 필요
- **응답**:
  ```json
  [
    {
      "id": 1,
      "rating": 5,
      "content": "최고의 경험이었습니다!",
      "created_at": "2024-03-19T15:30:00.000Z",
      "restaurant": {
        "restaurant_id": 1,
        "name": "미쉐린 레스토랑",
        "location": "서울시 강남구",
        "stars": 3
      }
    }
  ]
  ```

### 관심목록 조회
- **URL**: `/api/users/favorites`
- **Method**: `GET`
- **인증**: JWT 토큰 필요
- **응답**:
  ```json
  [
    {
      "id": 1,
      "created_at": "2024-03-18T10:00:00.000Z",
      "restaurant": {
        "restaurant_id": 1,
        "name": "미쉐린 레스토랑",
        "location": "서울시 강남구",
        "stars": 3,
        "menu": {
          "main": ["스테이크", "파스타"],
          "dessert": ["티라미수", "크레페"]
        },
        "tags": "프렌치,스테이크,로맨틱"
      }
    }
  ]
  ```

### 회원 정보 수정
- **URL**: `/api/users/profile`
- **Method**: `PUT`
- **인증**: JWT 토큰 필요
- **요청 본문**:
  ```json
  {
    "name": "홍길동",
    "email": "user@example.com",
    "phone": "010-1234-5678",
    "currentPassword": "현재비밀번호",
    "newPassword": "새비밀번호"
  }
  ```
- **응답**:
  ```json
  {
    "user_id": 1,
    "name": "홍길동",
    "email": "user@example.com",
    "phone": "010-1234-5678",
    "user_type": "일반",
    "created_at": "2024-03-01T00:00:00.000Z"
  }
  ```

## 에러 응답
모든 API는 에러 발생 시 다음과 같은 형식으로 응답합니다:
```json
{
  "message": "에러 메시지"
}
```

### 주요 에러 코드
- `400`: 잘못된 요청
- `401`: 인증 실패
- `404`: 리소스를 찾을 수 없음
- `500`: 서버 오류

# 📘 미슐랭 예약 플랫폼 API 명세서 (1~6)

---

## ✅ [1] 사용자 인증 및 정보 관련

### 1.1 회원가입
- **POST** `/api/users/signup`
- 이메일, 비밀번호, 이름, 사용자 유형(VIP/일반)

### 1.2 로그인
- **POST** `/api/users/login`
- 로그인 성공 시 JWT 토큰 반환

### 1.3 마이페이지 정보 조회
- **GET** `/api/users/me`
- 사용자 정보 반환 (JWT 필요)

---

## ✅ [2] 식당 목록 및 상세 조회

### 2.1 식당 목록 조회
- **GET** `/api/restaurants`
- 쿼리 파라미터: 위치(lat/lng), 태그, 미슐랭 등급 등

### 2.2 식당 상세 조회
- **GET** `/api/restaurants/:restaurant_id`
- 메뉴, 콜키지, 주차, 영업시간 등 반환

### 2.3 태그 목록 조회
- **GET** `/api/restaurants/tags`

---

## ✅ [3] 리뷰 기능

### 3.1 리뷰 등록
- **POST** `/api/reviews`
- 별점, 리뷰내용, restaurant_id 필요 (JWT 필요)

### 3.2 식당별 리뷰 목록
- **GET** `/api/restaurants/:restaurant_id/reviews`

### 3.3 사용자 리뷰 목록
- **GET** `/api/users/:user_id/reviews`

### 3.4 리뷰 삭제
- **DELETE** `/api/reviews/:review_id`

---

## ✅ [4] 예약 기능

### 4.1 예약 요청
- **POST** `/api/reservations`
- 시간, 인원, 요청사항 포함 (JWT 필요)

### 4.2 내 예약 목록 조회
- **GET** `/api/users/:user_id/reservations`

### 4.3 예약 상세
- **GET** `/api/reservations/:reservation_id`

### 4.4 예약 취소
- **DELETE** `/api/reservations/:reservation_id`

---

## ✅ [5] VIP 요청 및 일정 관리

### 5.1 VIP 요청 등록
- **POST** `/api/vip-requests`
- 일정표 입력, 회사명, 요청사항 등 (JWT 필요)

### 5.2 VIP 요청 목록
- **GET** `/api/users/:user_id/vip-requests`

### 5.3 VIP 요청 상세
- **GET** `/api/vip-requests/:request_id`

### 5.4 담당자 배정 (관리자용)
- **PUT** `/api/vip-requests/:request_id/assign`

---

## ✅ [6] 관리자 기능

### 6.1 예약 승인 / 거절
- **PUT** `/api/admin/reservations/:reservation_id`

### 6.2 전체 예약 목록 조회
- **GET** `/api/admin/reservations`

### 6.3 리뷰 삭제 (관리자)
- **DELETE** `/api/admin/reviews/:review_id`

### 6.4 VIP 요청 목록
- **GET** `/api/admin/vip-requests`

### 6.5 관리자 로그인
- **POST** `/api/admin/login`

---

✅ 모든 API는 JWT 또는 관리자 토큰 기반 인증 체계를 사용하며, 역할에 따라 접근이 제한됩니다.

## 인증
- 모든 보호된 API는 `Authorization: Bearer <JWT>` 헤더 필요

---

## 회원가입/로그인
### POST /api/auth/register
- 회원가입
- body: { email, password, name }
- response: { success, user }

### POST /api/auth/login
- 로그인
- body: { email, password }
- response: { success, token, user }

### GET /api/auth/naver
- 네이버 소셜 로그인(리다이렉트)

---

## 사용자
### GET /api/users/me
- 내 정보 조회 (JWT 필요)
- response: { user }

### PATCH /api/users/me
- 내 정보 수정 (JWT 필요)
- body: { name, ... }

---

## 식당
### GET /api/restaurants
- 식당 목록 조회
- query: { district, cuisine, ... }
- response: [ { ...restaurant } ]

### GET /api/restaurants/:id
- 식당 상세 조회

---

## 예약
### POST /api/reservations
- 예약 생성 (JWT 필요)
- body: { restaurantId, date, time, ... }

### GET /api/reservations/my
- 내 예약 목록 (JWT 필요)

---

## 리뷰
### POST /api/reviews
- 리뷰 작성 (JWT 필요)
- body: { restaurantId, rating, content }

---

## 기타
- 모든 응답은 JSON
- 상세 파라미터/응답 예시는 Swagger 등으로 확장 가능 

## 로컬 실행 및 테스트 절차

1. **.env 파일 점검**
   - DB_HOST, DB_USER, DB_PASS, DB_NAME이 모두 로컬 DB(MySQL/MariaDB)로 되어 있는지 확인
   - 예시:
     ```
     DB_HOST=localhost
     DB_PORT=3306
     DB_USER=your_local_user
     DB_PASS=your_local_password
     DB_NAME=your_local_db
     ``` 

2. **로컬 DB(MySQL/MariaDB) 실행**
   - DB가 정상적으로 실행 중인지 확인 (ex: `mysql -u root -p` 접속 테스트)

3. **의존성 설치**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

4. **DB 마이그레이션/시드**
   - (필요시) `npx sequelize db:migrate`
   - (필요시) `npx sequelize db:seed:all`

5. **서버 실행**
   ```bash
   cd backend
   npm run dev
   # 또는
   npm start
   ```

6. **프론트엔드 실행**
   ```bash
   cd frontend
   npm run dev
   ```

7. **테스트**
   - Postman, 브라우저 등으로 API, 프론트엔드 정상 동작 확인

---

## 🚩 만약 에러가 발생한다면?
- DB 연결 에러: .env의 DB 정보, DB 실행 상태, 포트 충돌 등 점검
- 의존성 에러: `npm install` 재실행
- 마이그레이션 에러: 모델/마이그레이션 파일 점검

---

**로컬에서 실행 중 문제가 발생하면,  
에러 메시지나 로그를 공유해주시면 바로 원인 분석 및 해결 도와드릴 수 있습니다!**

바로 실행해보시고, 궁금한 점이나 에러가 있으면 말씀해 주세요! 