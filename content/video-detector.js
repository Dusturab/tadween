export class VideoDetector {
  constructor() {
    this.videoElement = null;
    this.platform = null;
  }

  init() {
    this.detectPlatform();
    this.findVideoElement();
  }

  detectPlatform() {
    const url = window.location.href;
    
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      this.platform = 'youtube';
    } else if (url.includes('ted.com')) {
      this.platform = 'ted';
    } else if (url.includes('coursera.org')) {
      this.platform = 'coursera';
    } else if (url.includes('udemy.com')) {
      this.platform = 'udemy';
    } else {
      this.platform = 'unknown';
    }
    
    return this.platform;
  }

  findVideoElement() {
    const selectors = {
      youtube: 'video.html5-main-video',
      ted: 'video',
      coursera: 'video',
      udemy: 'video',
      unknown: 'video'
    };

    const selector = selectors[this.platform] || 'video';
    this.videoElement = document.querySelector(selector);
    
    return this.videoElement;
  }

  getVideoInfo() {
    const info = {
      platform: this.platform,
      title: this.getVideoTitle(),
      url: window.location.href,
      duration: this.getDuration()
    };
    
    return info;
  }

  getVideoTitle() {
    const titleSelectors = {
      youtube: 'h1.ytd-video-primary-info-renderer, h1.title',
      ted: 'h1[data-testid="talk-title"]',
      coursera: '.video-name',
      udemy: '[data-purpose="video-title"]'
    };

    const selector = titleSelectors[this.platform];
    if (selector) {
      const titleEl = document.querySelector(selector);
      if (titleEl) return titleEl.textContent.trim();
    }

    return document.title || 'Unknown Video';
  }

  getCurrentTime() {
    if (this.videoElement) {
      return this.videoElement.currentTime;
    }
    return 0;
  }

  getDuration() {
    if (this.videoElement) {
      return this.videoElement.duration;
    }
    return 0;
  }

  isPlaying() {
    if (this.videoElement) {
      return !this.videoElement.paused;
    }
    return false;
  }
}
