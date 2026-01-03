import { API_ENDPOINTS, DEFAULT_HEADERS } from '../shared/constants.js';

export class ApiClient {
  constructor() {
    this.baseUrl = '';
    this.apiKey = '';
  }

  setConfig(config) {
    if (config.baseUrl) this.baseUrl = config.baseUrl;
    if (config.apiKey) this.apiKey = config.apiKey;
  }

  async request(options) {
    const { endpoint, method = 'GET', body = null, headers = {} } = options;
    
    const url = this.baseUrl + endpoint;
    
    const requestHeaders = {
      ...DEFAULT_HEADERS,
      ...headers
    };
    
    if (this.apiKey) {
      requestHeaders['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const requestOptions = {
      method,
      headers: requestHeaders
    };

    if (body && method !== 'GET') {
      requestOptions.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, requestOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('API request failed:', error);
      return { success: false, error: error.message };
    }
  }

  async get(endpoint, headers = {}) {
    return this.request({ endpoint, method: 'GET', headers });
  }

  async post(endpoint, body, headers = {}) {
    return this.request({ endpoint, method: 'POST', body, headers });
  }

  async put(endpoint, body, headers = {}) {
    return this.request({ endpoint, method: 'PUT', body, headers });
  }

  async delete(endpoint, headers = {}) {
    return this.request({ endpoint, method: 'DELETE', headers });
  }
}
