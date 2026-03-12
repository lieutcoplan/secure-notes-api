let notes = []

function openNoteDialog() {
  const dialog = document.querySelector('#noteDialog');
  const titleInput = document.querySelector('#noteTitle');
  const contentInput = document.querySelector('#noteContent');

  dialog.showModal()
  titleInput.focus()
}