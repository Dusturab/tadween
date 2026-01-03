import { MESSAGE_TYPES } from '../shared/message-types.js';
import { VideoDetector } from './video-detector.js';
import { TranscriptExtractor } from './transcript-extractor.js';

const videoDetector = new VideoDetector();
const transcriptExtractor = new TranscriptExtractor();

// Listen for messages from popup or background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender, sendResponse);
  return true; // Keep channel open for async response
});

async function handleMessage(message, sender, sendResponse) {
  switch (message.type) {
    case MESSAGE_TYPES.GET_VIDEO_INFO:
      const videoInfo = videoDetector.getVideoInfo();
      sendResponse(videoInfo);
      break;
      
    case MESSAGE_TYPES.EXTRACT_TRANSCRIPT:
      const transcript = await transcriptExtractor.extract();
      sendResponse({ transcript });
      break;
      
    case MESSAGE_TYPES.GET_CURRENT_TIME:
      const currentTime = videoDetector.getCurrentTime();
      sendResponse({ currentTime });
      break;
      
    default:
      sendResponse({ error: 'Unknown message type' });
  }
}

// Initialize on page load
function init() {
  videoDetector.init();
  console.log('Video Notes Extension: Content script loaded');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
