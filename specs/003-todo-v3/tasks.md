# TODO App 3.0 Tasks

## Phase 1: Database & API (Backend)

### T01: Supabase 스키마 업데이트
- [ ] todos 테이블에 time 컬럼 추가 (TEXT, nullable)
```sql
ALTER TABLE todos ADD COLUMN time TEXT;
```

### T02: API - time 필드 지원
- [ ] api/todos/index.ts: POST 요청에서 time 필드 처리
- [ ] api/todos/[id].ts: PUT 요청에서 time 필드 업데이트 지원

### T03: 프론트엔드 타입 업데이트
- [ ] frontend/src/types/todo.ts: Todo 인터페이스에 time 필드 추가

### T04: API 서비스 업데이트
- [ ] frontend/src/services/api.ts: createTodo에 time 파라미터 추가

---

## Phase 2: Calendar Popup (F1)

### T05: CalendarPopup 컴포넌트 생성
- [ ] 월 그리드 렌더링 (7열 x 5-6행)
- [ ] 이전/다음 월 이동 버튼
- [ ] 날짜 클릭 핸들러
- [ ] 오늘 날짜 하이라이트
- [ ] 선택된 날짜 하이라이트
- [ ] Props: selectedDate, onSelect, onClose

### T06: CalendarPopup 스타일링
- [ ] 팝업 오버레이
- [ ] 달력 그리드 스타일
- [ ] 날짜 셀 hover 효과
- [ ] 오늘/선택 날짜 구분 스타일

### T07: DatePicker 수정
- [ ] 날짜 텍스트 클릭 가능하게 변경
- [ ] CalendarPopup 상태 관리 (open/close)
- [ ] 외부 클릭 시 팝업 닫기
- [ ] 날짜 선택 시 onDateChange 호출

---

## Phase 3: Category Sections (F2, F3)

### T08: TodoSection 컴포넌트 생성
- [ ] 섹션 헤더 렌더링 (회사/개인)
- [ ] 해당 카테고리 할일 목록 렌더링
- [ ] Props: category, todos, onToggle, onDelete

### T09: TodoSection 스타일링
- [ ] 섹션 헤더 스타일
- [ ] 섹션 구분선
- [ ] 빈 섹션 숨김 처리

### T10: TodoList 수정
- [ ] 카테고리별 할일 필터링
- [ ] TodoSection으로 렌더링 변경
- [ ] 회사 → 개인 순서 유지

---

## Phase 4: Time Feature (F4)

### T11: TodoInput 시간 입력 추가
- [ ] time input 필드 추가 (type="time")
- [ ] 시간 상태 관리
- [ ] onAdd 콜백에 time 전달
- [ ] 입력 후 시간 초기화

### T12: TodoInput 시간 스타일링
- [ ] 시간 입력 필드 레이아웃
- [ ] 반응형 배치

### T13: TodoItem 시간 표시
- [ ] 시간이 있는 경우 시간 배지 표시
- [ ] 배지 위치 (content 앞)
- [ ] 배지 스타일

### T14: App.tsx 정렬 로직 구현
- [ ] sortTodos 함수 구현
  - 완료 항목 우선
  - 시간 있는 항목 우선
  - 시간순 정렬
  - 생성 순서 정렬
- [ ] 카테고리별로 정렬 적용

---

## Phase 5: Integration & Polish

### T15: App.tsx 통합
- [ ] TodoInput에서 time 처리
- [ ] 정렬된 데이터를 TodoList에 전달
- [ ] 카테고리별 분리 로직

### T16: 스타일 정리
- [ ] App.css 업데이트
- [ ] 반응형 레이아웃 확인
- [ ] 다크 테마 일관성

### T17: 테스트 및 배포
- [ ] 로컬 테스트
- [ ] Vercel 배포
- [ ] 프로덕션 테스트

---

## Task Dependencies

```
T01 ─┬─→ T02 ─→ T03 ─→ T04
     │
     └─→ T05 ─→ T06 ─→ T07
     │
     └─→ T08 ─→ T09 ─→ T10
     │
     └─→ T11 ─→ T12 ─→ T13 ─→ T14
                              │
                              ↓
                            T15 ─→ T16 ─→ T17
```

## Summary

| Phase | Tasks | 설명 |
|-------|-------|------|
| 1 | T01-T04 | 백엔드 API 및 타입 |
| 2 | T05-T07 | 달력 팝업 |
| 3 | T08-T10 | 카테고리 섹션 |
| 4 | T11-T14 | 시간 기능 |
| 5 | T15-T17 | 통합 및 배포 |

**총 17개 태스크**
