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
    const secretKey = loadSecretKey();
    const fileText = await window.electronAPI.getFile(secretKey, item);
    console.log(fileText);
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

(async () => {
  const password = "senha_forte"; // Você pode obter isso do usuário
  const secretKey = await window.electronAPI.getSecretKey(password);
  storeSecretKey(secretKey)

  const keys = await window.electronAPI.getKeys(secretKey);
  
  for(const arquivo in keys){
    createSidebarItem(arquivo);
  }
})();

