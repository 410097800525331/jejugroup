/**
 * widgets/profile_card.js
 * 유저 프로필 및 등급 파편들을 렌더링하는 컴포넌트
 */

export const createProfileCard = (user) => {
  if (!user) return '';

  const tierBadgeColor = user.tierColor || '#333';
  const tierClass = user.tier.toLowerCase();
  
  return `
    <!-- Glassmorphism Profile Card -->
    <div class="profile-card">
      <img src="${user.avatar}" alt="${user.name} 님의 아바타" class="profile-avatar" />
      <div class="profile-info">
        <span class="tier-badge" style="background-color: ${tierBadgeColor};">
          JEJU ${user.tier}
        </span>
        <h2 class="profile-name">${user.name} <span>님</span></h2>
        
        <div class="profile-meta">
          <div class="meta-item">
            <i class="fa-solid fa-coins"></i>
            보유 포인트 <strong>${user.miles.toLocaleString()}</strong>P
          </div>
          <div class="meta-item">
            <i class="fa-regular fa-envelope"></i>
            ${user.email}
          </div>
        </div>
      </div>
    </div>
  `;
};
