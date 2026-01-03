/**
 * Background Service Worker (MVP)
 * Minimal implementation for Task 1-3
 */

import { MESSAGE_TYPES } from '../shared/message-types.js';
import { ApiClient } from './api-client.js';
import { StorageManager } from './storage-manager.js';

const apiClient = new ApiClient();
const storageManager = new StorageManager();

console.log('[VideoNotes] Service worker active');

// Initialize storage on first install
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    console.log('[VideoNotes] First install - initializing storage...');
    
    try {
      await chrome.storage.local.set({
        usage: {
          count: 0,
          limit: 5, // Free tier daily limit
          resetDate: getNextResetDate()
        },
        notes: [],
        settings: {
          notificationsEnabled: true
        }
      });
      
      console.log('[VideoNotes] Storage initialized successfully');
      
      // Optional: Open welcome page
      // chrome.tabs.create({ url: 'https://yourdomain.com/welcome' });
      
    } catch (error) {
      console.error('[VideoNotes] Storage initialization failed:', error);
    }
  }
  
  if (details.reason === 'update') {
    console.log('[VideoNotes] Extension updated to', chrome.runtime.getManifest().version);
  }
});

// Keep service worker alive (important for MV3)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // For now, just acknowledge messages
  // Backend integration will expand this in Task 4
  console.log('[VideoNotes] Received:', message.type, 'from', sender.tab?.id || 'popup');
  
  // Always respond to keep channel alive
  sendResponse({ received: true });
  
  return true; // Required for async responses
});

// Helper: Calculate next quota reset date
function getNextResetDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.toISOString();
}

// Optional: Periodic usage quota reset check
chrome.alarms.create('checkQuotaReset', { periodInMinutes: 60 });

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'checkQuotaReset') {
    const { usage } = await chrome.storage.local.get('usage');
    
    if (usage && new Date() >= new Date(usage.resetDate)) {
      console.log('[VideoNotes] Resetting daily quota...');
      
      usage.count = 0;
      usage.resetDate = getNextResetDate();
      
      await chrome.storage.local.set({ usage });
    }
  }
});