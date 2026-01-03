import { MESSAGE_TYPES } from '../shared/message-types.js';
import { StorageManager } from '../background/storage-manager.js';

document.addEventListener('DOMContentLoaded', init);

async function init() {
  const extractBtn = document.getElementById('extract-btn');
  const saveNotesBtn = document.getElementById('save-notes-btn');
  const notesInput = document.getElementById('notes-input');
  
  // Check if we're on a supported video page
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (tab && isVideoPage(tab.url)) {
    extractBtn.disabled = false;
    updateVideoInfo(tab);
  }
  
  extractBtn.addEventListener('click', handleExtractTranscript);
  saveNotesBtn.addEventListener('click', handleSaveNotes);
  
  loadSavedNotes();
}

function isVideoPage(url) {
  return url && (
    url.includes('youtube.com/watch') ||
    url.includes('youtu.be/')
  );
}

async function updateVideoInfo(tab) {
  const videoTitle = document.getElementById('video-title');
  
  try {
    const response = await chrome.tabs.sendMessage(tab.id, {
      type: MESSAGE_TYPES.GET_VIDEO_INFO
    });
    
    if (response && response.title) {
      videoTitle.textContent = response.title;
    }
  } catch (error) {
    videoTitle.textContent = 'Video detected';
  }
}

async function handleExtractTranscript() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const transcriptPreview = document.getElementById('transcript-preview');
  
  try {
    transcriptPreview.textContent = 'Extracting transcript...';
    
    const response = await chrome.tabs.sendMessage(tab.id, {
      type: MESSAGE_TYPES.EXTRACT_TRANSCRIPT
    });
    
    if (response && response.transcript) {
      transcriptPreview.textContent = response.transcript.substring(0, 500) + '...';
    } else {
      transcriptPreview.textContent = 'No transcript available';
    }
  } catch (error) {
    transcriptPreview.textContent = 'Error extracting transcript';
    console.error(error);
  }
}

async function handleSaveNotes() {
  const notesInput = document.getElementById('notes-input');
  const notes = notesInput.value.trim();
  
  if (!notes) return;
  
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  const noteData = {
    id: Date.now(),
    content: notes,
    url: tab.url,
    title: document.getElementById('video-title').textContent,
    timestamp: new Date().toISOString()
  };
  
  await chrome.runtime.sendMessage({
    type: MESSAGE_TYPES.SAVE_NOTE,
    data: noteData
  });
  
  notesInput.value = '';
  loadSavedNotes();
}

async function loadSavedNotes() {
  const notesList = document.getElementById('notes-list');
  
  try {
    const response = await chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.GET_NOTES
    });
    
    if (response && response.notes) {
      notesList.innerHTML = response.notes
        .slice(0, 10)
        .map(note => `<li><strong>${note.title}</strong><br>${note.content}</li>`)
        .join('');
    }
  } catch (error) {
    console.error('Error loading notes:', error);
  }
}
