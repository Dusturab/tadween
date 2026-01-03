import { STORAGE_KEYS } from '../shared/constants.js';

export class StorageManager {
  constructor() {
    this.storage = chrome.storage.local;
  }

  async initialize() {
    const defaults = {
      [STORAGE_KEYS.NOTES]: [],
      [STORAGE_KEYS.TRANSCRIPTS]: [],
      [STORAGE_KEYS.SETTINGS]: {
        autoExtract: false,
        theme: 'light'
      }
    };

    const existing = await this.storage.get(Object.keys(defaults));
    const toSet = {};
    
    for (const [key, value] of Object.entries(defaults)) {
      if (!(key in existing)) {
        toSet[key] = value;
      }
    }

    if (Object.keys(toSet).length > 0) {
      await this.storage.set(toSet);
    }
  }

  async saveNote(note) {
    const notes = await this.getNotes();
    notes.unshift(note);
    await this.storage.set({ [STORAGE_KEYS.NOTES]: notes });
    return note;
  }

  async getNotes() {
    const result = await this.storage.get(STORAGE_KEYS.NOTES);
    return result[STORAGE_KEYS.NOTES] || [];
  }

  async deleteNote(noteId) {
    const notes = await this.getNotes();
    const filtered = notes.filter(note => note.id !== noteId);
    await this.storage.set({ [STORAGE_KEYS.NOTES]: filtered });
  }

  async saveTranscript(transcript) {
    const transcripts = await this.getTranscripts();
    transcripts.unshift(transcript);
    await this.storage.set({ [STORAGE_KEYS.TRANSCRIPTS]: transcripts });
    return transcript;
  }

  async getTranscripts() {
    const result = await this.storage.get(STORAGE_KEYS.TRANSCRIPTS);
    return result[STORAGE_KEYS.TRANSCRIPTS] || [];
  }

  async getSettings() {
    const result = await this.storage.get(STORAGE_KEYS.SETTINGS);
    return result[STORAGE_KEYS.SETTINGS] || {};
  }

  async updateSettings(settings) {
    const current = await this.getSettings();
    const updated = { ...current, ...settings };
    await this.storage.set({ [STORAGE_KEYS.SETTINGS]: updated });
    return updated;
  }

  async clearAll() {
    await this.storage.clear();
    await this.initialize();
  }
}
