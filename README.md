# 자취 가이드 (개선판)

루온이랑 하루 5분, 자취력 키우기 — 세탁 · 공과금 · 쓰레기 배출 · 수리 요청 · 집 관리 퀴즈 웹앱.

## 실행
- 이 컴퓨터에서: `실행하기.bat` 더블클릭 (또는 `index.html`을 브라우저로 열기)
- 시작 화면은 처음 열 때와 **새로고침할 때마다** 나옵니다. 앱 안에서 홈으로 돌아올 때는 건너뜁니다.
- PC에서는 휴대폰 크기 화면으로 고정되고, 내용은 화면 안에서만 스크롤됩니다.

## 폴더 구조
```
index.html          스플래시 + 홈
loading.html        페이지 이동 로딩
quiz-*.html         분야별 퀴즈 (문제 데이터만 들어 있음)
sticker-room.html   스티커 방
css/app.css         공통 스타일 (앱 프레임, 탭바, 버튼, 진행바, 애니메이션)
css/quiz.css        퀴즈 화면 스타일
js/app.js           공통 스크립트 (저장 키, 분야 목록, 이동, 효과)
js/quiz.js          퀴즈 엔진 (5개 분야 공통)
assets/characters/  기존 캐릭터 PNG (파일명 그대로)
assets/brand/       새 이미지: 앱 아이콘, 스플래시, UI 키트 원본, 스티커 시트 원본
assets/stickers/    스티커 시트에서 잘라낸 개별 스티커 8개
assets/ui/          UI 키트에서 잘라낸 시작하기/계속하기 버튼
manifest.webmanifest  홈 화면 추가용 (GitHub Pages 배포 후 동작)
```

## 새 이미지 이름 정리
| 원래 파일명 | 새 파일명 |
|---|---|
| ChatGPT 이미지 2026년 10월 9일 오후 12_57_43-1.png | assets/brand/app-icon.png (+ 192/512/180/64 크기) |
| ChatGPT 이미지 2026년 10월 9일 오후 12_57_44-2.png | assets/brand/splash-hero.jpg |
| ChatGPT 이미지 2026년 10월 9일 오후 12_57_44-3.png | assets/brand/ui-kit-reference.png → assets/ui/btn-start.png, btn-continue.png |
| ChatGPT 이미지 2026년 10월 9일 오후 12_57_46-4.png | assets/brand/sticker-sheet.png → assets/stickers/sticker-*.png |

## GitHub에 올릴 때
폴더 전체를 저장소에 올리고 Settings → Pages 에서 `main` 브랜치 루트를 지정하면 됩니다. 경로는 모두 상대 경로라 그대로 동작합니다.
