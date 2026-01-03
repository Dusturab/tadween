export const EXTENSION_NAME = 'Video Notes Extension';
export const EXTENSION_VERSION = '1.0.0';

export const SUPPORTED_PLATFORMS = {
  YOUTUBE: 'youtube',
  TED: 'ted',
  COURSERA: 'coursera',
  UDEMY: 'udemy',
  EDX: 'edx'
};

export const STORAGE_KEYS = {
  NOTES: 'video_notes',
  TRANSCRIPTS: 'video_transcripts',
  SETTINGS: 'extension_settings'
};

export const API_ENDPOINTS = {
  TRANSCRIPTS: '/api/transcripts',
  NOTES: '/api/notes',
  SYNC: '/api/sync'
};

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

export const MAX_NOTES_DISPLAY = 50;
export const MAX_TRANSCRIPT_LENGTH = 100000;
