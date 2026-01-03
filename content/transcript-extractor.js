export class TranscriptExtractor {
  constructor() {
    this.platform = null;
  }

  async extract() {
    this.detectPlatform();
    
    switch (this.platform) {
      case 'youtube':
        return await this.extractYouTubeTranscript();
      case 'ted':
        return await this.extractTedTranscript();
      default:
        return await this.extractGenericTranscript();
    }
  }

  detectPlatform() {
    const url = window.location.href;
    
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      this.platform = 'youtube';
    } else if (url.includes('ted.com')) {
      this.platform = 'ted';
    } else {
      this.platform = 'unknown';
    }
  }

  async extractYouTubeTranscript() {
    try {
      // Try to open transcript panel
      const moreActionsBtn = document.querySelector('button[aria-label="More actions"]');
      if (moreActionsBtn) {
        moreActionsBtn.click();
        await this.delay(500);
        
        const transcriptBtn = Array.from(document.querySelectorAll('tp-yt-paper-listbox yt-formatted-string'))
          .find(el => el.textContent.includes('transcript') || el.textContent.includes('Transcript'));
        
        if (transcriptBtn) {
          transcriptBtn.click();
          await this.delay(1000);
        }
      }

      // Extract transcript text
      const transcriptSegments = document.querySelectorAll('ytd-transcript-segment-renderer');
      if (transcriptSegments.length > 0) {
        const transcript = Array.from(transcriptSegments)
          .map(segment => {
            const timestamp = segment.querySelector('.segment-timestamp')?.textContent?.trim() || '';
            const text = segment.querySelector('.segment-text')?.textContent?.trim() || '';
            return `[${timestamp}] ${text}`;
          })
          .join('\n');
        
        return transcript;
      }

      // Fallback: try captions
      return await this.extractFromCaptions();
    } catch (error) {
      console.error('Error extracting YouTube transcript:', error);
      return null;
    }
  }

  async extractFromCaptions() {
    const video = document.querySelector('video');
    if (!video) return null;

    const tracks = video.textTracks;
    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      if (track.kind === 'captions' || track.kind === 'subtitles') {
        track.mode = 'showing';
        await this.delay(500);
        
        if (track.cues) {
          const transcript = Array.from(track.cues)
            .map(cue => `[${this.formatTime(cue.startTime)}] ${cue.text}`)
            .join('\n');
          return transcript;
        }
      }
    }
    return null;
  }

  async extractTedTranscript() {
    try {
      const transcriptContainer = document.querySelector('[data-testid="transcript"]');
      if (transcriptContainer) {
        return transcriptContainer.textContent.trim();
      }
      return null;
    } catch (error) {
      console.error('Error extracting TED transcript:', error);
      return null;
    }
  }

  async extractGenericTranscript() {
    return await this.extractFromCaptions();
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
