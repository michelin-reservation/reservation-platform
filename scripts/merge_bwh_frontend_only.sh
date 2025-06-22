#!/bin/bash
set -e

# 1. 현재 브랜치명 저장
git_branch=$(git rev-parse --abbrev-ref HEAD)
echo "현재 브랜치: $git_branch"

# 2. main 브랜치에서만 동작하도록 체크
git checkout main

# 3. main 브랜치 백업 생성
git branch backup-main-$(date +%Y%m%d-%H%M%S)
echo "main 브랜치 백업 생성 완료"

# 4. bwh 브랜치 fetch (푸터 페이지 추가)
git fetch origin bwh

echo "bwh 브랜치 fetch 완료"

# 5. 병합용 임시 브랜치 생성
git checkout -b merge-bwh-frontend-$(date +%Y%m%d-%H%M%S)
echo "병합용 임시 브랜치 생성 완료"

# 6. 프론트엔드 새 파일 및 수정 파일만 checkout
# 새 파일
FRONTEND_NEW_FILES=(
  "frontend/src/components/Footer.tsx"
  "frontend/src/components/ScrollToTop.tsx"
  "frontend/src/pages/footer/AboutEIE.tsx"
  "frontend/src/pages/footer/BrandStory.tsx"
  "frontend/src/pages/footer/CookiePolicy.tsx"
  "frontend/src/pages/footer/FAQPage.tsx"
  "frontend/src/pages/footer/MembershipPage.tsx"
  "frontend/src/pages/footer/Notice.tsx"
  "frontend/src/pages/footer/Partnership.tsx"
  "frontend/src/pages/footer/PrivacyPolicy.tsx"
  "frontend/src/pages/footer/ServiceGuide.tsx"
  "frontend/src/pages/footer/TermsOfPayment.tsx"
  "frontend/src/pages/footer/TermsOfUse.tsx"
  "frontend/src/pages/footer/VIPServices.tsx"
)

git checkout origin/bwh -- "${FRONTEND_NEW_FILES[@]}"

# 수정 파일
FRONTEND_MODIFIED_FILES=(
  "frontend/index.html"
  "frontend/src/App.tsx"
  "frontend/src/components/Header.tsx"
  "frontend/src/components/MapComponent.tsx"
  "frontend/src/pages/ConciergeServices.tsx"
  "frontend/src/pages/HomePage.tsx"
  "frontend/src/pages/RestaurantPage.tsx"
  "frontend/src/pages/RestaurantsPage.tsx"
)

git checkout origin/bwh -- "${FRONTEND_MODIFIED_FILES[@]}"

echo "프론트엔드 변경점만 checkout 완료"

git status

echo "\n문제 없으면 커밋합니다."
git add .
git commit -m "bwh 브랜치 프론트엔드 변경점만 안전 병합"

echo "\n작업 완료! 병합 브랜치에서 테스트 후 main에 병합하세요."