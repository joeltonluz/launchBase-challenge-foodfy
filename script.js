const modalOverlay = document.querySelector('.modal-overlay');
const foods = document.querySelectorAll('.food');

for (let food of foods) {
  food.addEventListener('click', () => {
    const foodImg = food.querySelector('.food__image').querySelector('img').src;
    const foodText = food.querySelector('.food__text').querySelector('h1').innerHTML;
    const foodChief = food.querySelector('.food__chef').querySelector('h4').innerHTML;

    modalOverlay.classList.add('active');

    modalOverlay.querySelector('.modal-content').children[0].src=foodImg;
    modalOverlay.querySelector('.modal-content').children[1].innerHTML=foodText;
    modalOverlay.querySelector('.modal-content').children[2].innerHTML=foodChief;
  });
};

document.querySelector('.close-modal').addEventListener('click', () => {
  modalOverlay.classList.remove('active');
  
});