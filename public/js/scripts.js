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

const AvatarUpload = {
  preview: document.querySelector('#avatar-preview img'),
  handleFileInput(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      AvatarUpload.preview.src = reader.result;
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      AvatarUpload.preview.src='';
    }
  },
};

const PhotosUpload = {
  input: '',
  preview: document.querySelector('#photos-preview'),
  uploadLimit: 5,
  files: [],
  handleFileInput(event) {
    const { files: fileList} = event.target;

    PhotosUpload.input = event.target;

    if (PhotosUpload.hasLimit(event)) return

    Array.from(fileList).forEach(file => {

      PhotosUpload.files.push(file);

      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image() //<img> no HTML
        image.src = String(reader.result);

        const div = PhotosUpload.getContainer(image);
        PhotosUpload.preview.appendChild(div);
      };

      reader.readAsDataURL(file);
    });

    PhotosUpload.input.files = PhotosUpload.getAllFiles();
  },
  hasLimit(event) {
    const { uploadLimit, input, preview } = PhotosUpload;
    const { files: fileList } = input;

    if (fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} fotos`);
      event.preventDefault();
      return true;
    };

    const photosDiv = [];
    preview.childNodes.forEach(item => {
      if (item.classList && item.classList.value == 'photo') 
        photosDiv.push(item);
    });

    const totalPhotos = fileList.length + photosDiv.length;
    if (totalPhotos > uploadLimit) {
      alert('Você atingiu o limite máximo de fotos!');
      event.preventDefault();
      return true;
    };

    return false;
  },
  getAllFiles () {
    const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer(); //Firefox ou Chrome

    PhotosUpload.files.forEach(file => dataTransfer.items.add(file));

    return dataTransfer.files;
  },
  getContainer(image) {
    const div = document.createElement('div');
    div.classList.add('photo');

    div.onclick = PhotosUpload.removePhoto;

    div.appendChild(image);

    div.appendChild(PhotosUpload.getRemoveButton());

    return div;
  },
  getRemoveButton() {
    const button = document.createElement('i');
    button.classList.add('material-icons');
    button.innerHTML = 'close';
    return button;
  },
  removePhoto(event) {
    const photoDiv = event.target.parentNode; //<div class="photo"
    const photosArray = Array.from(PhotosUpload.preview.children);
    const index = photosArray.indexOf(photoDiv);

    PhotosUpload.files.splice(index, 1);
    PhotosUpload.input.files = PhotosUpload.getAllFiles();

    photoDiv.remove();
  },
  removeOldPhoto(event) {
    const photoDiv = event.target.parentNode;

    alert('removi');
    alert(photoDiv.id);
    
    if (photoDiv.id) {
      const removed_files = document.querySelector('input[name="removed_files"]');
      if (removed_files) {
        removed_files.value += `${photoDiv.id},`
      };
    };

    photoDiv.remove();
  },
};

const ImageGallery = {
  highlight: document.querySelector('.gallery .highlight > img'),
  previews: document.querySelectorAll('.gallery-preview img'),
  setImage(e) {
    const { target } = e;

    ImageGallery.previews.forEach(preview => preview.classList.remove('active'));
    target.classList.add('active');

    ImageGallery.highlight.src = target.src;
    LightBox.image.src = target.src;
  }
};

const LightBox = {
  target: document.querySelector('.lightbox-target'),
  image: document.querySelector('.lightbox-target img'),
  closeButton: document.querySelector('.lightbox-target a.lightbox-close'),
  open() {
    LightBox.target.style.opacity = 1;
    LightBox.target.style.top = 0;
    LightBox.target.style.bottom = 0;
    LightBox.closeButton.style.top = 0;
  },
  close() {
    LightBox.target.style.opacity = 0;
    LightBox.target.style.top = '-100%';
    LightBox.target.style.bottom = 'initial';
    LightBox.closeButton.style.top = '-80px';
  },
};