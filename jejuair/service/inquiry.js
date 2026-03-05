'use strict';

const INQ_STORAGE_KEY = 'jejuair_integrated_inquiries_v1';
const INQ_ITEMS_PER_PAGE = 10;

const inqState = {
  page: 1,
  posts: [],
  selectedPostId: null
};

document.addEventListener('DOMContentLoaded', () => {
  inqState.posts = loadInquiries();
  bindInquiryForm();
  renderInquiryTable();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeInquiryDetail();
  }
});

function loadInquiries() {
  const raw = localStorage.getItem(INQ_STORAGE_KEY);
  if (!raw) {
    const seed = getSeedInquiries();
    saveInquiries(seed);
    return seed;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error('Stored value is not an array.');
    }

    return parsed
      .filter((post) => post && typeof post === 'object')
      .map((post) => ({
        id: String(post.id || createPostId()),
        brand: String(post.brand || '제주항공'),
        writer: String(post.writer || '익명'),
        title: String(post.title || '제목 없음'),
        content: String(post.content || ''),
        createdAt: String(post.createdAt || new Date().toISOString())
      }));
  } catch (error) {
    const seed = getSeedInquiries();
    saveInquiries(seed);
    return seed;
  }
}

function saveInquiries(posts) {
  localStorage.setItem(INQ_STORAGE_KEY, JSON.stringify(posts));
}

function getSeedInquiries() {
  return [
    {
      id: 'seed-1',
      brand: '제주항공',
      writer: '김하늘',
      title: '모바일 체크인 후 좌석 변경 문의',
      content: '모바일 체크인 이후에도 좌석 변경이 가능한지 확인 부탁드립니다.',
      createdAt: '2026-03-04T09:20:00+09:00'
    },
    {
      id: 'seed-2',
      brand: '제주스테이',
      writer: '박서준',
      title: '조식 포함 객실 체크인 시간 문의',
      content: '조식 포함 객실인데 얼리 체크인이 가능한지 궁금합니다.',
      createdAt: '2026-03-03T16:05:00+09:00'
    },
    {
      id: 'seed-3',
      brand: '제주렌터카',
      writer: '이민지',
      title: '차량 인수 시 신분증 서류 확인',
      content: '운전면허증 외에 추가로 필요한 서류가 있는지 확인하고 싶습니다.',
      createdAt: '2026-03-02T11:40:00+09:00'
    }
  ];
}

function bindInquiryForm() {
  const form = document.getElementById('inq-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const brand = document.getElementById('inq-brand').value.trim();
    const writer = document.getElementById('inq-writer').value.trim();
    const title = document.getElementById('inq-title').value.trim();
    const content = document.getElementById('inq-content').value.trim();

    if (!brand || !writer || !title || !content) {
      alert('브랜드, 작성자, 제목, 문의 내용을 모두 입력해 주세요.');
      return;
    }

    const newPost = {
      id: createPostId(),
      brand,
      writer,
      title,
      content,
      createdAt: new Date().toISOString()
    };

    inqState.posts.push(newPost);
    saveInquiries(inqState.posts);
    inqState.page = 1;
    renderInquiryTable();
    closeInquiryForm();

    alert('1:1 문의가 등록되었습니다.');
  });
}

function createPostId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function getSortedPosts() {
  return [...inqState.posts].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

function renderInquiryTable() {
  const tbody = document.getElementById('inq-table-body');
  const pagination = document.getElementById('inq-pagination');
  const sortedPosts = getSortedPosts();
  const totalPages = Math.max(1, Math.ceil(sortedPosts.length / INQ_ITEMS_PER_PAGE));

  if (inqState.page > totalPages) {
    inqState.page = totalPages;
  }

  const start = (inqState.page - 1) * INQ_ITEMS_PER_PAGE;
  const pageItems = sortedPosts.slice(start, start + INQ_ITEMS_PER_PAGE);

  if (pageItems.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5"><div class="inq-empty">등록된 문의가 없습니다.</div></td></tr>';
  } else {
    tbody.innerHTML = pageItems.map((post, idx) => {
      return `
        <tr>
          <td>${sortedPosts.length - start - idx}</td>
          <td>${escapeHtml(post.brand)}</td>
          <td class="hc-board-td--title">
            <button type="button" class="inq-link-btn" onclick="openInquiryDetail('${escapeAttr(post.id)}')">${escapeHtml(post.title)}</button>
          </td>
          <td>${escapeHtml(post.writer)}</td>
          <td>${formatDate(post.createdAt)}</td>
        </tr>
      `;
    }).join('');
  }

  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }

  let pagingHtml = '';
  const prevPage = inqState.page - 1;
  const nextPage = inqState.page + 1;

  pagingHtml += `<button class="hc-page-btn" onclick="changeInquiryPage(${prevPage})" ${inqState.page === 1 ? 'disabled' : ''} aria-label="이전 페이지">‹</button>`;

  for (let page = 1; page <= totalPages; page += 1) {
    pagingHtml += `<button class="hc-page-btn ${page === inqState.page ? 'active' : ''}" onclick="changeInquiryPage(${page})" aria-label="${page}페이지" aria-current="${page === inqState.page ? 'page' : 'false'}">${page}</button>`;
  }

  pagingHtml += `<button class="hc-page-btn" onclick="changeInquiryPage(${nextPage})" ${inqState.page === totalPages ? 'disabled' : ''} aria-label="다음 페이지">›</button>`;
  pagination.innerHTML = pagingHtml;
}

function changeInquiryPage(page) {
  const totalPages = Math.max(1, Math.ceil(inqState.posts.length / INQ_ITEMS_PER_PAGE));
  if (page < 1 || page > totalPages) {
    return;
  }

  inqState.page = page;
  renderInquiryTable();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openInquiryForm() {
  const formCard = document.getElementById('inq-form-card');
  const form = document.getElementById('inq-form');

  formCard.hidden = false;
  form.reset();
  formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeInquiryForm() {
  const formCard = document.getElementById('inq-form-card');
  formCard.hidden = true;
}

function openInquiryDetail(postId) {
  const post = inqState.posts.find((item) => item.id === postId);
  if (!post) {
    return;
  }

  inqState.selectedPostId = postId;

  document.getElementById('inq-detail-brand').textContent = post.brand;
  document.getElementById('inq-detail-title').textContent = post.title;
  document.getElementById('inq-detail-writer').textContent = `작성자: ${post.writer}`;
  document.getElementById('inq-detail-date').textContent = `등록일: ${formatDate(post.createdAt)}`;
  document.getElementById('inq-detail-content').textContent = post.content;

  const modal = document.getElementById('inq-detail-modal');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeInquiryDetail() {
  const modal = document.getElementById('inq-detail-modal');
  if (!modal || modal.style.display !== 'flex') {
    return;
  }

  modal.style.display = 'none';
  document.body.style.overflow = '';
  inqState.selectedPostId = null;
}

function deleteInquiry() {
  if (!inqState.selectedPostId) {
    return;
  }

  const post = inqState.posts.find((item) => item.id === inqState.selectedPostId);
  if (!post) {
    closeInquiryDetail();
    return;
  }

  const confirmed = confirm(`[${post.title}] 문의를 삭제하시겠습니까?`);
  if (!confirmed) {
    return;
  }

  inqState.posts = inqState.posts.filter((item) => item.id !== inqState.selectedPostId);
  saveInquiries(inqState.posts);
  closeInquiryDetail();
  renderInquiryTable();
}

function formatDate(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll('`', '&#96;');
}
