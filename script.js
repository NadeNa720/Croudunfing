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
