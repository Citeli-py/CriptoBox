function createSidebarItem(item) {
  // Cria o elemento <li>
  const li = document.createElement("li");

  // Cria o elemento <a>
  const a = document.createElement("a");
  a.textContent = item; // Define o texto do link
  a.className = "sidebar-item"; // Define a classe do link
  a.id = item; // Define o ID do link
  //a.href = "#"; // Define um href válido (pode ser "#" ou outro valor)

  // Adiciona o evento de clique
  a.addEventListener("click", async function (event) {
    event.preventDefault(); // Impede o comportamento padrão do link
    await getFile(item);
  });

  // Adiciona o link ao <li>
  li.appendChild(a);

  // Obtém a lista <ul> e adiciona o <li>
  const ul = document.getElementById("sidebar-ul");
  if (ul) {
    ul.appendChild(li);
  } else {
    console.error("Elemento <ul> com ID 'sidebar-ul' não encontrado.");
  }
}

/**
 * 
 * @param {Uint8Array} secretKey 
 */
function storeSecretKey(secretKey){
  // Converte o Uint8Array para uma string binária
  let binaryString = "";
  secretKey.forEach(byte => {
    binaryString += String.fromCharCode(byte);
  });

  localStorage.setItem("secretKey", btoa(binaryString));
}


/**
 * 
 * @param {string} base64 
 * @returns 
 */
function loadSecretKey() {
  // Decodifica a string Base64 para uma string binária
  const binaryString = atob(localStorage.getItem("secretKey"));

  // Converte a string binária para Uint8Array
  const uint8Array = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }

  return uint8Array;
}

async function saveFile() {
  const file = document.getElementById("doc-title").value;
  if(!file) {
    alert("Informe um título para o arquivo.");
    return;
  }

  const text = JSON.stringify(quill.getContents().ops);

  const secretKey = loadSecretKey();
  await window.electronAPI.saveFile(secretKey, file, text)

  createSidebarItem(file);
}

async function getFile(file) {
  const titulo_input = document.getElementById('doc-title');
  titulo_input.value = file;
  //titulo_input.setAttribute('readonly', true);

  const fileInfo = await window.electronAPI.getFile(loadSecretKey(), file);

  if (fileInfo.text)
    quill.setContents(JSON.parse(fileInfo.text));
  
}

async function renameFile(file, novoTitulo) {
  const secretKey = loadSecretKey();
  await window.electronAPI.renameFile(secretKey, file, novoTitulo);
}


async function deleteFile() {

  const titulo_input = document.getElementById('doc-title');
  const file = titulo_input.value;

  if(!file) 
    return;

  if(!confirm(`Tem certeza que deseja deletar o arquivo ${file}?`)) 
    return;
  

  const secretKey = loadSecretKey();
  await window.electronAPI.deleteFile(secretKey, file);

  createNewFile();
  const sidebarItem = document.getElementById(file);
  sidebarItem.remove();
}

/**
 * Abre um novo arquivo para editar
 */
function createNewFile() {
  const titulo_input = document.getElementById('doc-title');
  titulo_input.value = '';

  quill.setContents([{ insert: '\n' }]);
}


// let tituloAnterior = ''; // Armazena o título anterior
// const docTitleInput = document.getElementById('doc-title');
// // Event listener para o input do título (evento blur)
// docTitleInput.addEventListener('blur', async () => {
//   const novoTitulo = docTitleInput.value;

//   // Verifica se o título foi alterado
//   if (novoTitulo && novoTitulo !== tituloAnterior) {
//     console.log(`Título alterado de "${tituloAnterior}" para "${novoTitulo}"`);
//     await renameFile(tituloAnterior, novoTitulo)
//     tituloAnterior = novoTitulo; // Atualiza o título anterior
//   }
// });

// // Atualiza o título anterior quando o input ganha foco
// docTitleInput.addEventListener('focus', () => {
//   tituloAnterior = docTitleInput.value;
// });

async function putItemsOnSidebar() {
  const secretKey = loadSecretKey();
  const keys = await window.electronAPI.getKeys(secretKey);
  
  for(const arquivo in keys){
    createSidebarItem(arquivo);
  }
}

(async () => {
  const password = "senha_forte"; // Você pode obter isso do usuário
  const secretKey = await window.electronAPI.getSecretKey(password);
  storeSecretKey(secretKey)

  await putItemsOnSidebar();
})();

