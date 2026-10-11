# Git & GitHub 필기 정리

## 1. 버전 관리 (Version Control)
- 파일·코드의 변경 이력을 기록하고 관리하는 것
- 변경 내용 추적, 실수 복구, 협업 시 충돌 해결
- **Git**: 버전 관리 도구, 로컬에서 동작
- **GitHub**: Git 저장소를 호스팅하는 웹 서비스, 코드 공유·협업 플랫폼

## 2. Git 기본 개념
- **Repository**: 파일과 변경 이력을 저장하는 저장소 (Local: 내 컴퓨터 / Remote: GitHub 등 서버)
- **Commit**: 변경 사항을 하나의 버전으로 기록
- **Branch**: 기존 코드와 분리해 독립적으로 작업하는 공간
- **HEAD**: 현재 작업 기준 위치를 가리키는 포인터
- **Working Directory**: 실제 파일을 수정하는 공간
- **Staging Area**: 다음 커밋에 포함할 변경 사항을 모아두는 공간

## 3. Git 설치 및 초기 설정
```bash
brew install git
git --version
git config --global user.name "이름"
git config --global user.email "이메일"
```
- `--global`: 모든 저장소에 적용
- 옵션 생략: 현재 저장소에만 적용

## 4. 로컬 Git 기본 작업 흐름
`Working Directory` ➡️ `git add` ➡️ `Staging Area` ➡️ `git commit` ➡️ `Local Repository` ➡️ `git push` ➡️ `GitHub`

```bash
git init          # 저장소 초기화
git status        # 현재 상태 확인
git add 파일명     # 특정 파일 스테이징
git add .         # 변경 파일 전체 스테이징
git commit -m "메시지" # 변경 사항 기록
git log --oneline # 커밋 이력 확인
```
- **커밋 메시지 규칙**: 명확하고 간결하게, 동사로 시작, 한 커밋에 한 작업
- **`.gitignore`**: 버전 관리에서 제외할 파일 지정 (예: `.env`, `_pycache_/`, `*.log`)
  - 이미 추적 중인 파일은 `git rm --cached 파일명`으로 추적 해제

## 5. 브랜치 (Branch)
- **main**: 배포 가능한 안정 버전
- **dev**: 개발 중인 기능 테스트
- **feature/\***: 기능 개발
- **hotfix/\***: 긴급 수정

```bash
git branch                 # 브랜치 목록 확인
git branch feature/login   # 브랜치 생성
git switch feature/login   # 브랜치 전환
git switch -c feature/ui   # 생성 후 바로 전환
git merge feature/ui       # 현재 브랜치에 병합
```
- **Fast-forward merge**: 브랜치가 직선으로 이어질 때 포인터만 이동
- **3-way merge**: 브랜치가 분기된 후 병합 커밋 생성
- **Merge conflict**: 같은 파일의 같은 부분을 다르게 수정해 충돌 발생 ➡️ 충돌 파일 확인 후 직접 수정하여 해결된 내용 커밋

## 6. GitHub 및 협업
```bash
git remote add origin 원격주소 # 원격 저장소 연결
git remote -v                # 원격 저장소 확인
git push -u origin main      # 로컬 커밋 업로드
git pull                     # 원격 변경 사항 반영
git clone 저장소_URL          # 원격 저장소 복사
```
- **Clone**: 원격 저장소를 로컬로 복사
- **Fork**: 다른 사람의 저장소를 내 GitHub 계정으로 복사
- **Pull Request (PR)**: 변경 사항을 원본 저장소에 반영하도록 요청
- **Code Review**: 병합 전 코드 검토 (버그 예방·코드 품질 유지)
- **Issue**: 할 일, 버그, 기능 요청 관리
- **협업 흐름**: Issue 생성 ➡️ Fork/Clone ➡️ Branch 생성 ➡️ Commit ➡️ Push ➡️ PR ➡️ Code Review ➡️ Merge

## 7. 자주 사용하는 명령어
| 명령어 | 기능 |
| :--- | :--- |
| `git show` | 특정 커밋의 변경 내용 확인 |
| `git diff` | Working Directory와 Staging Area 차이 확인 |
| `git diff --staged` | Staging Area와 HEAD 차이 확인 |
| `git blame 파일명` | 각 줄의 수정자·수정 이력 확인 |
| `git stash` | 작업 변경 사항 임시 저장 |
| `git stash list` | 저장한 stash 목록 확인 |
| `git stash pop` | 최근 stash 적용 후 목록에서 제거 |
| `git stash apply` | stash 적용, 목록은 유지 |
| `git reset --soft HEAD~1` | 최근 커밋 취소, 변경 내용 유지 |
| `git reset --mixed HEAD~1` | 커밋 및 스테이징 취소, 파일 변경 유지 |
| `git reset --hard HEAD~1` | 커밋·스테이징·파일 변경 되돌림 (주의) |
| `git revert 커밋해시` | 취소 내용을 새 커밋으로 기록 |
| `git commit --amend` | 마지막 커밋 수정 |
| `git commit --amend --no-edit` | 메시지를 유지한 채 마지막 커밋 수정 |