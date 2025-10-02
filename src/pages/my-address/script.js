
document.querySelectorAll('.bi-pencil').forEach(el => {
  el.addEventListener('click', () => alert('Editar endereço'));
});

document.querySelectorAll('.bi-trash').forEach(el => {
  el.addEventListener('click', () => alert('Excluir endereço'));
});
