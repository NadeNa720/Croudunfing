// Simple interactivity to toggle parcel size selection
const sizeButtons = document.querySelectorAll('.size-btn');
sizeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    sizeButtons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
});

// Tabbed navigation for functional sections + guided flow
const tabButtons = document.querySelectorAll('.tab-btn');
const devices = document.querySelectorAll('.device');
const sequence = ['book', 'send', 'track', 'search'];
let currentIndex = 0;

const activateTab = (target) => {
  currentIndex = sequence.indexOf(target);
  tabButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.target === target);
  });

  devices.forEach(device => {
    const isMatch = device.dataset.tab === target;
    device.classList.toggle('active', isMatch);
  });
};

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    activateTab(button.dataset.target);
  });
});

const nextActions = document.querySelectorAll('.next-action');
nextActions.forEach(btn => {
  btn.addEventListener('click', () => {
    const parentTab = btn.closest('.device')?.dataset.tab;
    const current = sequence.indexOf(parentTab);
    const nextIndex = (current + 1) % sequence.length;

    // brief pause for perceived completion then slide forward
    setTimeout(() => activateTab(sequence[nextIndex]), 160);
  });
});

// Report issue interaction on tracking screen
const reportBtn = document.getElementById('reportBtn');
const reportStatus = document.getElementById('reportStatus');

reportBtn?.addEventListener('click', () => {
  reportBtn.disabled = true;
  reportBtn.textContent = 'Report submitted';
  if (reportStatus) {
    reportStatus.textContent = 'Thanks for flagging this parcel. Support will reach out shortly.';
  }
});

// Profile popover for avatar clicks
const profileOverlay = document.getElementById('profileOverlay');
const profilePanel = document.getElementById('profilePanel');
const closeProfile = document.querySelector('.close-profile');
const avatars = document.querySelectorAll('.user-avatar');

const setProfileVisibility = (isVisible) => {
  profileOverlay.classList.toggle('active', isVisible);
  profilePanel.classList.toggle('active', isVisible);
  profilePanel.setAttribute('aria-hidden', (!isVisible).toString());
};

avatars.forEach(avatar => {
  avatar.addEventListener('click', () => setProfileVisibility(true));
});

profileOverlay.addEventListener('click', () => setProfileVisibility(false));
closeProfile?.addEventListener('click', () => setProfileVisibility(false));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setProfileVisibility(false);
});
