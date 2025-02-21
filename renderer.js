
(async () => {
  const secretKey = "senha_forte"; // Você pode obter isso do usuário
  const keys = await window.electronAPI.getKeys(secretKey);
  console.log(keys);
  document.getElementById('keysOutput').textContent = JSON.stringify(keys, null, 2);
})();

