let burgerBtn = document.querySelector('.burger');
let menu = document.querySelector('.menu-list');

burgerBtn.addEventListener('click', () => {
  burgerBtn.classList.toggle('active');
  menu.classList.toggle('active');
});
