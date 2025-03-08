function createSidebarItem(item) {
  // Cria o elemento <li>
  const li = document.createElement("li");

  // Cria o elemento <a>
  const a = document.createElement("a");
  a.textContent = item; // Define o texto do link
  a.href = "#"; // Define um href válido (pode ser "#" ou outro valor)

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
  const text = JSON.stringify(quill.getContents().ops);
  const secretKey = loadSecretKey();
  await window.electronAPI.saveFile(secretKey, file, text)

  createSidebarItem(file);
}

async function getFile(file) {
  const titulo_input = document.getElementById('doc-title');
  titulo_input.value = file;
  titulo_input.setAttribute('readonly', true);

  const text = await window.electronAPI.getFile(loadSecretKey(), file);
  quill.setContents(JSON.parse(text))
}

(async () => {
  const password = "senha_forte"; // Você pode obter isso do usuário
  const secretKey = await window.electronAPI.getSecretKey(password);
  storeSecretKey(secretKey)

  const keys = await window.electronAPI.getKeys(secretKey);
  
  for(const arquivo in keys){
    createSidebarItem(arquivo);
  }
})();

