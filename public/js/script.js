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

function addInput(divPai, divFilho) {
  const divPrincipal = document.querySelector(`${divPai}`);
  const fieldContainer = document.querySelectorAll(`${divFilho}`);
  
  // Realiza um clone do último ingrediente adicionado
  const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);
  
  // Não adiciona um novo input se o último tem um valor vazio
  if (newField.children[1].value == "") {
    return false;
  };

  // Deixa o valor do input vazio
  console.log(newField.children[1].value);
  newField.children[1].value = '';
  divPrincipal.appendChild(newField);
};

function removeInput(line) { 
  //Verificar se tem apenas um ingredient
  const divPai = line.parentNode.parentNode;    
  if (divPai.children.length==1) {
    return alert('Mínimo permitido!!');
  };

  if (confirm('Deseja remover essa Linha?')) {  
    line.parentNode.remove();
  };
};

document
  .querySelector('.addNewIngredient')
  .addEventListener('click',() => {
    addInput('#ingredients','.ingredient');
  });

document
  .querySelector('.addNewPreparation')
  .addEventListener('click', () => {
    addInput('#preparations','.preparation');
  });