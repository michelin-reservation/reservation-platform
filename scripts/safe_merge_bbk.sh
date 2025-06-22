#!/bin/bash
set -e

TARGET_BRANCH="bbk"
MERGE_BRANCH_NAME="merge-${TARGET_BRANCH}-safely-$(date +%Y%m%d-%H%M%S)"

echo "### ${TARGET_BRANCH} 브랜치 안전 병합 시작 ###"

# 1. 작업 전 main 브랜치로 이동
git checkout main
echo "✅ main 브랜치로 이동했습니다."

# 2. main 브랜치 백업
git branch "backup-main-before-${TARGET_BRANCH}-merge-$(date +%Y%m%d-%H%M%S)"
echo "✅ main 브랜치를 백업했습니다."

# 3. 최신 정보 fetch
git fetch origin ${TARGET_BRANCH}
echo "✅ 원격 저장소에서 ${TARGET_BRANCH} 브랜치 정보를 가져왔습니다."

# 4. 안전한 병합을 위한 임시 브랜치 생성
git checkout -b "${MERGE_BRANCH_NAME}"
echo "✅ 병합 작업을 위한 새 브랜치 '${MERGE_BRANCH_NAME}'를 생성하고 이동했습니다."

# 5. 추가(A)/수정(M)/이름변경(R)된 파일 목록만 추출 (삭제(D)는 제외)
echo "⏳ 병합할 파일 목록을 분석 중입니다..."
files_to_merge_str=$(git diff main "origin/${TARGET_BRANCH}" --name-status --find-renames | awk '/^[AMR]/ {print $NF}')

if [ -z "$files_to_merge_str" ]; then
    echo "⚠️ 병합할 파일이 없습니다. 작업을 중단합니다."
    git checkout main
    git branch -D "${MERGE_BRANCH_NAME}"
    exit 1
fi

# Convert string to array
files_to_merge=($files_to_merge_str)

echo "✅ 병합할 파일 목록:"
printf " - %s\n" "${files_to_merge[@]}"

# 6. 목록에 있는 파일들만 선택적으로 checkout
echo "⏳ 목록의 파일들을 병합 중입니다..."
git checkout "origin/${TARGET_BRANCH}" -- "${files_to_merge[@]}"
echo "✅ 선택된 파일들을 성공적으로 가져왔습니다."

# 7. 변경사항 커밋
echo "⏳ 변경 사항을 커밋하는 중..."
git add .
git commit -m "feat: Safely merge changes from ${TARGET_BRANCH}

Merged files:
$(printf -- "- %s\n" "${files_to_merge[@]}")"
echo "✅ 모든 변경점을 커밋했습니다."

echo -e "\n🎉 작업이 성공적으로 완료되었습니다!"
echo "현재 브랜치('${MERGE_BRANCH_NAME}')에서 테스트를 진행해주세요."
echo "테스트 완료 후에는 'git checkout main' -> 'git merge ${MERGE_BRANCH_NAME}' 명령으로 main 브랜치에 병합할 수 있습니다."