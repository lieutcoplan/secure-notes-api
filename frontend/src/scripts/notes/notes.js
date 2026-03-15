import {apiFetch} from "../shared/api.js"

let editingNoteId = null

const noteForm = document.querySelector('#noteForm')
const noteDialog = document.querySelector('#noteDialog');
const noteTitleInput = document.querySelector('#noteTitle');
const noteContentInput = document.querySelector('#noteContent');
const notesContainer = document.querySelector('#notesContainer')
const dialogTitle = document.querySelector('#dialogTitle')

function openNoteDialog() {
  editingNoteId = null

  document.querySelector('#dialogTitle').textContent = 'Add New Note'
  noteTitleInput.value = ''
  noteContentInput.value = ''

  noteDialog.showModal()
  noteTitleInput.focus()
}

function editNoteDialog(noteId) {

  editingNoteId = noteId
  
  const noteCard = document.querySelector(`.note-card[data-id="${noteId}"]`)
  dialogTitle.textContent = 'Edit Note'
  noteTitleInput.value = noteCard.querySelector('.note-title').textContent
  noteContentInput.value = noteCard.querySelector('.note-content').textContent

  noteDialog.showModal()
  noteTitleInput.focus()
}

function closeNoteDialog() {
  editingNoteId = null
  noteDialog.close()
}

async function renderNotes() {
  try {
    const {data} = await apiFetch('/api/notes/', {
      method: 'GET'
    })

    if (data.length === 0) {
      notesContainer.innerHTML = `
        <div class="empty-state">
          <h2>No notes yet</h2>
          <p>Create your first note to get started</p>
          <button id="js-new-add-note-btn" class="add-note-btn">+ Add Your First Note</button>
        </div>
      `
      return
    }

    notesContainer.innerHTML = data.map(note => `
      <div class="note-card" data-id="${note.id}">
        <h3 class="note-title">${note.title}</h3>
        <p class="note-content">${note.content}</p>
        <div class="note-actions">
          <button class="edit-btn" title="Edit Note">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
          </button>
          <button class="delete-btn" title="Delete Note">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.88c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>
            </svg>
          </button>
        </div>
      </div>
      `).join('')
  } catch (error) {
    console.error('Render notes error:', error)
  }
}

async function deleteNote(noteId) {
  const {response, data} = await apiFetch(`/api/notes/${noteId}`, {
    method: 'DELETE'
  })

  if (!response.ok) {
    console.log(data?.error || 'Deleting failed')
    return
  }
  renderNotes();
}

async function saveNote(e) {
  e.preventDefault()

  const title = document.querySelector('#noteTitle').value.trim();
  const content = document.querySelector('#noteContent').value.trim();
  const payload = JSON.stringify({title, content})

  // Editing Note
  if(editingNoteId) {
    const {response, data} = await apiFetch(`/api/notes/${editingNoteId}`, {
      method: 'PUT',
      body: payload
    })
    if (!response.ok) {
      console.log(data?.error || 'Updating failed')
      return
    }
  // Saving note
  } else {
    const {response, data} = await apiFetch('/api/notes/', {
    method: 'POST',
    body: payload
  });

    if (!response.ok) {
      console.log(data?.error || 'Saving failed')
      return
    }
  };

  
  noteForm.reset()
  closeNoteDialog();
  renderNotes();
}

document.querySelector('#js-add-note-btn').addEventListener('click', openNoteDialog)

document.querySelector('#js-cancel-btn').addEventListener('click', closeNoteDialog)

document.querySelector('#js-close-btn').addEventListener('click', closeNoteDialog)

document.querySelector('#noteForm').addEventListener('submit', saveNote)

document.querySelector('#notesContainer').addEventListener('click', async (event) => {
  const noteCard = event.target.closest('.note-card')
  if (!noteCard) return;

  const noteId = noteCard.dataset.id;

  if (event.target.closest('.delete-btn')) {
    await deleteNote(noteId)
    return
  }

  if (event.target.closest('.edit-btn')) {
    editNoteDialog(noteId)
  }
})

renderNotes()