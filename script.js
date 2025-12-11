// Simple interactivity to toggle parcel size selection
const sizeButtons = document.querySelectorAll('.size-btn');
sizeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    sizeButtons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
});

// Tabbed navigation for functional sections
const tabButtons = document.querySelectorAll('.tab-btn');
const devices = document.querySelectorAll('.device');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const target = button.dataset.target;

    tabButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    devices.forEach(device => {
      device.classList.toggle('active', device.dataset.tab === target);
    });
  });
});
