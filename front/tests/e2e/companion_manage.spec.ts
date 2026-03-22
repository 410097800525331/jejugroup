import { test, expect } from '@playwright/test';

test.describe('동행자 연동/관리 팝업 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 마이페이지나 여정 섹션이 있는 라우트로 접근 (여기서는 기본 인덱스나 마이페이지 경로 사용 가정)
    // 루트 페이지든 마이페이지든 쉘이 통합되어 있으므로 적절한 경로 변경
    await page.goto('/mypage'); 
  });

  test('동행자 팝업 오픈 및 제주그룹 ID 검색 후 연동/해제', async ({ page }) => {
    // 1. 모달 띄우기
    const linkActionBtn = page.locator('.link-action-btn.pill-shape').first();
    await linkActionBtn.click();

    // 모달이 떴는지 확인
    const modal = page.locator('.companion-modal-content');
    await expect(modal).toBeVisible();

    // 2. 제주그룹 ID 검색
    const searchInput = page.locator('.companion-search-input');
    await searchInput.fill('tester_id');
    
    const searchBtn = page.locator('.companion-search-submit');
    await searchBtn.click();

    // 검색 결과 확인
    const searchResultItems = page.locator('.companion-result-item');
    await expect(searchResultItems).toHaveCount(1);
    await expect(searchResultItems.first()).toContainText('tester_id');

    // 3. 동행자 추가 (연동)
    const addBtn = searchResultItems.first().locator('.companion-add-btn');
    await addBtn.click();

    // 연동된 동행자 리스트(Linked List)에 들어갔는지 확인
    const linkedListItems = page.locator('.companion-linked-list .companion-linked-item');
    await expect(linkedListItems).toHaveCount(1);

    // 4. 동행자 연동 해제
    const removeBtn = linkedListItems.first().locator('.companion-remove-btn');
    await removeBtn.click();

    // 연동 해제 후 빈 상태인지 확인
    await expect(page.locator('.companion-linked-list .companion-linked-item')).toHaveCount(0);

    // 5. 창 닫기 (취소 버튼 클릭)
    const cancelBtn = page.locator('.cancel-btn.pill-shape');
    await cancelBtn.click();
    await expect(modal).toBeHidden();
  });
});
