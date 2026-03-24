# chatbot FAB 토글 정리 메모

## 목적

- FAB 내부 챗봇 액션과 별도로 렌더되던 독립 `chatbot-toggle-btn` 제거
- 챗봇 진입점을 FAB 단일 버튼으로 정리

## 반영

- `front/components/react/widget/ChatbotPanel.tsx`
  - 독립 토글 버튼 렌더 제거
  - 패널 컨테이너만 렌더하도록 단순화
- `front/apps/shell/src/runtime/widget/chatbot.tsx`
  - 제거된 `onOpen` props 정리
- `front/components/react/widget/chatbot-style.css`
  - 미사용 `.chatbot-toggle-btn*` 스타일 제거
- `front/components/react/ui/FAB/FABContainer.tsx`
  - `CHAT` 카드 클릭 시 `window.hotelChatbot.openChatbot()` 호출 연결
  - 챗봇 열 때 FAB는 다시 접히도록 정리

## 결과

- 화면 우하단 독립 챗봇 버튼이 더 이상 나타나지 않음
- 챗봇 열기는 FAB 내부 `CHAT` 액션만 사용
