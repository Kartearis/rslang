let burgerBtn = document.querySelector('.burger');
let menu = document.querySelector('.menu-list');
let coverLayer = document.querySelector('.cover-layer');

burgerBtn.addEventListener('click', () => {
    burgerBtn.classList.toggle('active');
    menu.classList.toggle('active');
    coverLayer.classList.toggle('active');
});

coverLayer.addEventListener('click', () => {
    burgerBtn.classList.remove('active');
    menu.classList.remove('active');
    coverLayer.classList.remove('active');
});
