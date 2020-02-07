const foods = document.querySelectorAll('.food');

for (let food of foods) {
  food.addEventListener('click', () => {
    const titleFood = food.querySelector('.food__text').children[0].innerHTML;    
    window.location.href = `/recipes/${food.id}`;
  });
};

const linkHideShow = document.querySelectorAll('.link__hide-show');

for(let link of linkHideShow) {
  link.addEventListener('click', () => {
    const nameLink = link.innerHTML;
    const detail = link.classList[0].replace("hide","detail");

    if (nameLink=='esconder') {
      document.querySelector(`.${detail}`).classList.add('hide_detail');
      link.innerHTML='mostrar';
    } else {
      document.querySelector(`.${detail}`).classList.remove('hide_detail');
      link.innerHTML='esconder';
    };
  });
};
