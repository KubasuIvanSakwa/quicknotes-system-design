const API_URL = 'https://jsonplaceholder.typicode.com/posts';

const loadBtn = document.getElementById('load-btn');
const statusMsg = document.getElementById('status');
const noteForm = document.getElementById('note-form');
const titleInput = document.getElementById('title-input');
const bodyInput = document.getElementById('body-input');
const submitBtn = document.getElementById('submit-btn');
const notesList = document.getElementById('notes-list');

function showStatus(message, type) {
    statusMsg.textContent = message;
    statusMsg.className = `status-${type}`; // 'loading', 'success', 'error'
}

async function request(url, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
    }
    // Handle 204 No Content for DELETE
    if (response.status === 204) return null;
    return await response.json();
}

async function loadNotes() {
    loadBtn.disabled = true;
    showStatus('Loading notes...', 'loading');
    notesList.innerHTML = '';

    try {
        const notes = await request(`${API_URL}?_limit=10`);
        
        if (notes.length === 0) {
            showStatus('Loaded successfully. No notes found.', 'success');
            const emptyLi = document.createElement('li');
            emptyLi.textContent = "It's empty here.";
            notesList.appendChild(emptyLi);
        } else {
            notes.forEach(note => addNoteToDOM(note, false));
            showStatus('Loaded 10 notes from the server.', 'success');
        }
    } catch (error) {
        showStatus(`Error loading notes: ${error.message}`, 'error');
    } finally {
        loadBtn.disabled = false;
    }
}

async function createNote(e) {
    e.preventDefault();
    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    if (!title) {
        showStatus('Error: Title is required.', 'error');
        return;
    }
    if (title.length > 100) {
        showStatus('Error: Title cannot exceed 100 characters.', 'error');
        return;
    }

    submitBtn.disabled = true;
    showStatus('Creating note...', 'loading');

    try {
        const newNote = await request(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, body, userId: 1 })
        });
        
        addNoteToDOM(newNote, true);
        showStatus(`Note created (status 201, id ${newNote.id}).`, 'success');
        noteForm.reset();
    } catch (error) {
        showStatus(`Error creating note: ${error.message}`, 'error');
    } finally {
        submitBtn.disabled = false;
    }
}

async function deleteNote(id, liElement, delBtn) {
    delBtn.disabled = true;
    showStatus(`Deleting note ${id}...`, 'loading');

    try {
        /*
         * Note on JSONPlaceholder:
         * JSONPlaceholder mocks POST requests (returning ID 101) but doesn't save them.
         * If we attempt to DELETE ID 101, it may return a 404 because it doesn't exist on their server.
         * We catch the 404 for mock items to gracefully handle this limitation.
         */
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        
        if (!response.ok) {
            if (response.status === 404 && id > 100) {
                console.warn("Ignoring 404 for mocked JSONPlaceholder ID");
            } else {
                throw new Error(`HTTP error: ${response.status}`);
            }
        }
        
        liElement.remove();
        showStatus(`Note ${id} deleted successfully.`, 'success');
    } catch (error) {
        showStatus(`Failed to delete note: ${error.message}`, 'error');
        delBtn.disabled = false;
    }
}

function addNoteToDOM(note, prepend = false) {
    const li = document.createElement('li');
    
    const titleEl = document.createElement('h3');
    titleEl.textContent = note.title;
    
    const bodyEl = document.createElement('p');
    bodyEl.textContent = note.body;
    
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.className = 'delete-btn';
    delBtn.addEventListener('click', () => deleteNote(note.id, li, delBtn));

    li.appendChild(titleEl);
    li.appendChild(bodyEl);
    li.appendChild(delBtn);

    if (prepend) {
        notesList.prepend(li);
    } else {
        notesList.appendChild(li);
    }
}

loadBtn.addEventListener('click', loadNotes);
noteForm.addEventListener('submit', createNote);