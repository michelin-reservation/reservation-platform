# 📸 스크린샷 가이드

이 폴더는 미쉐린 예약 플랫폼의 데모 스크린샷을 저장하는 공간입니다.

## 📁 필요한 스크린샷 파일들

다음 파일명으로 스크린샷을 저장해주세요:

```
docs/screenshots/
├── main-page.png              # 메인 페이지 (레스토랑 검색 및 추천)
├── restaurant-detail.png      # 레스토랑 상세 페이지 (메뉴, 리뷰, 예약)
├── reservation-form.png       # 예약 시스템 (실시간 예약 및 결제)
├── user-dashboard.png         # 마이페이지 (예약 내역 및 리뷰 관리)
├── admin-dashboard.png        # 관리자 대시보드 (레스토랑 및 예약 관리)
├── mobile-view.png            # 모바일 반응형 뷰
└── README.md                  # 이 파일
```

## 📷 스크린샷 촬영 가이드

### 1. 데모 실행
```bash
# 프로젝트 루트에서
./start-demo.sh

# 브라우저에서 http://localhost:8080 접속
```

### 2. 권장 스크린샷 설정
- **해상도**: 1920x1080 또는 1440x900
- **브라우저**: Chrome 또는 Safari (개발자 도구 숨김)
- **파일 형식**: PNG (고화질)
- **파일 크기**: 각 파일 2MB 이하 권장

### 3. 각 화면별 촬영 포인트

#### 🏠 메인 페이지 (main-page.png)
- 헤더 네비게이션 포함
- 레스토랑 카드 리스트 표시
- 검색 기능 및 필터 보이기
- 푸터까지 전체 페이지

#### 🍽️ 레스토랑 상세 (restaurant-detail.png)
- 레스토랑 이미지 및 정보
- 메뉴 리스트
- 리뷰 섹션
- 예약 버튼 강조

#### 📅 예약 시스템 (reservation-form.png)
- 예약 폼 전체
- 날짜/시간 선택기
- 인원수 선택
- 결제 정보 입력 부분

#### 👤 마이페이지 (user-dashboard.png)
- 사용자 프로필 정보
- 예약 내역 리스트
- 리뷰 관리 섹션
- 즐겨찾기 레스토랑

#### 🔧 관리자 대시보드 (admin-dashboard.png)
- 통계 대시보드
- 레스토랑 관리 테이블
- 예약 현황 차트
- 사용자 관리 메뉴

#### 📱 모바일 뷰 (mobile-view.png)
- 브라우저 개발자 도구로 모바일 뷰 전환
- iPhone 12 Pro 또는 Galaxy S21 크기
- 메인 페이지의 모바일 반응형 디자인

## 🖼️ 스크린샷 촬영 방법

### macOS
```bash
# 전체 화면
Cmd + Shift + 3

# 선택 영역
Cmd + Shift + 4

# 특정 윈도우
Cmd + Shift + 4 + Space
```

### 브라우저 확장 프로그램
- **Awesome Screenshot**: 전체 페이지 스크린샷
- **Full Page Screen Capture**: 스크롤 페이지 캡처
- **Nimbus Screenshot**: 편집 기능 포함

## 📤 업로드 방법

### 1. GitHub 웹 인터페이스
1. `docs/screenshots/` 폴더로 이동
2. "Add file" → "Upload files"
3. 스크린샷 파일들을 드래그 앤 드롭
4. 커밋 메시지 작성 후 업로드

### 2. Git 명령어
```bash
# 스크린샷 파일들을 screenshots 폴더에 복사 후
git add docs/screenshots/*.png
git commit -m "feat: 데모 스크린샷 추가"
git push origin main
```

## 💡 촬영 팁

1. **일관성 유지**: 모든 스크린샷을 같은 브라우저, 같은 해상도로
2. **실제 데이터**: 의미있는 샘플 데이터 사용
3. **UI 완성도**: 로딩 상태나 에러 화면 피하기
4. **브랜딩**: 로고와 색상이 잘 보이도록
5. **접근성**: 텍스트가 선명하게 읽히도록

## 🔄 업데이트 주기

- 주요 UI 변경 시 스크린샷 업데이트
- 새로운 기능 추가 시 관련 화면 추가
- 월 1회 정기 업데이트 권장

---

**📞 문의사항**
스크린샷 관련 문의는 개발팀 [junexi0828@gmail.com]으로 연락해주세요.
