/**
 * Gmail API Service
 * Handles Gmail OAuth and email fetching
 */

// Gmail API Configuration
const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1';
const GMAIL_SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const REDIRECT_URI = window.location.origin + '/gmail-callback';

/**
 * Initialize Gmail OAuth flow
 */
export function initGmailAuth() {
  if (!CLIENT_ID) {
    console.warn('Gmail Client ID not configured. Set VITE_GOOGLE_CLIENT_ID in .env');
    return null;
  }

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `response_type=code&` +
    `scope=${encodeURIComponent(GMAIL_SCOPES)}&` +
    `access_type=offline&` +
    `prompt=consent`;

  return authUrl;
}

/**
 * Exchange authorization code for access token
 * 
 * NOTE: This requires a backend service for security.
 * See GMAIL_INTEGRATION_SETUP.md for setup instructions.
 */
export async function exchangeCodeForToken(code) {
  try {
    // Try to exchange via backend API
    const response = await fetch('/api/gmail/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, redirect_uri: REDIRECT_URI })
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          'Backend API not found. Please set up the Gmail token exchange endpoint. ' +
          'See GMAIL_INTEGRATION_SETUP.md for instructions.'
        );
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to exchange code for token');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    throw error;
  }
}

/**
 * Store Gmail access token
 */
export function storeGmailToken(tokenData) {
  localStorage.setItem('gmail_access_token', tokenData.access_token);
  if (tokenData.refresh_token) {
    localStorage.setItem('gmail_refresh_token', tokenData.refresh_token);
  }
  localStorage.setItem('gmail_token_expiry', String(Date.now() + (tokenData.expires_in * 1000)));
}

/**
 * Get stored Gmail access token
 */
export function getGmailToken() {
  return localStorage.getItem('gmail_access_token');
}

/**
 * Check if Gmail is connected
 */
export function isGmailConnected() {
  return !!getGmailToken();
}

/**
 * Disconnect Gmail
 */
export function disconnectGmail() {
  localStorage.removeItem('gmail_access_token');
  localStorage.removeItem('gmail_refresh_token');
  localStorage.removeItem('gmail_token_expiry');
  localStorage.removeItem('gmail_last_sync');
}

/**
 * Get valid access token (refresh if needed)
 */
async function getValidAccessToken() {
  const accessToken = getGmailToken();
  const expiry = localStorage.getItem('gmail_token_expiry');
  const refreshToken = localStorage.getItem('gmail_refresh_token');

  if (!accessToken) {
    throw new Error('Gmail not connected');
  }

  // Check if token is expired
  if (expiry && Date.now() > parseInt(expiry)) {
    if (!refreshToken) {
      throw new Error('Token expired and no refresh token available');
    }
    // Refresh token (should be done on backend)
    return await refreshAccessToken(refreshToken);
  }

  return accessToken;
}

/**
 * Refresh access token
 * 
 * NOTE: This requires a backend service for security.
 */
async function refreshAccessToken(refreshToken) {
  try {
    const response = await fetch('/api/gmail/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken })
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          'Backend API not found. Please set up the Gmail refresh endpoint. ' +
          'See GMAIL_INTEGRATION_SETUP.md for instructions.'
        );
      }
      throw new Error('Failed to refresh token. Please reconnect Gmail.');
    }

    const data = await response.json();
    storeGmailToken(data);
    return data.access_token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
}

/**
 * Fetch emails from Gmail API
 */
export async function fetchGmailMessages(options = {}) {
  try {
    const accessToken = await getValidAccessToken();
    const {
      maxResults = 50,
      query = '',
      pageToken = null
    } = options;

    let url = `${GMAIL_API_BASE}/users/me/messages?maxResults=${maxResults}`;
    if (query) {
      url += `&q=${encodeURIComponent(query)}`;
    }
    if (pageToken) {
      url += `&pageToken=${encodeURIComponent(pageToken)}`;
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, try to refresh
        disconnectGmail();
        throw new Error('Gmail authorization expired. Please reconnect.');
      }
      throw new Error(`Gmail API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Gmail messages:', error);
    throw error;
  }
}

/**
 * Get full message details
 */
export async function getGmailMessage(messageId) {
  try {
    const accessToken = await getValidAccessToken();

    const response = await fetch(`${GMAIL_API_BASE}/users/me/messages/${messageId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch message: ${response.statusText}`);
    }

    const message = await response.json();
    return parseGmailMessage(message);
  } catch (error) {
    console.error('Error fetching Gmail message:', error);
    throw error;
  }
}

/**
 * Parse Gmail message into structured format
 */
function parseGmailMessage(message) {
  const headers = message.payload?.headers || [];
  const getHeader = (name) => headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || '';

  // Extract email body
  let body = '';
  if (message.payload?.body?.data) {
    body = decodeBase64(message.payload.body.data);
  } else if (message.payload?.parts) {
    // Try to find text/plain or text/html part
    const textPart = message.payload.parts.find(p => 
      p.mimeType === 'text/plain' || p.mimeType === 'text/html'
    );
    if (textPart?.body?.data) {
      body = decodeBase64(textPart.body.data);
    }
  }

  // Extract participants
  const from = parseEmailAddress(getHeader('from'));
  const to = parseEmailAddresses(getHeader('to'));
  const cc = parseEmailAddresses(getHeader('cc'));
  const bcc = parseEmailAddresses(getHeader('bcc'));

  return {
    id: message.id,
    threadId: message.threadId,
    snippet: message.snippet,
    subject: getHeader('subject'),
    from: from,
    to: to,
    cc: cc,
    bcc: bcc,
    date: new Date(parseInt(message.internalDate)),
    body: body,
    labels: message.labelIds || [],
    isRead: !message.labelIds?.includes('UNREAD'),
    isSent: message.labelIds?.includes('SENT')
  };
}

/**
 * Parse single email address
 */
function parseEmailAddress(addressStr) {
  if (!addressStr) return null;
  
  // Format: "Name <email@domain.com>" or "email@domain.com"
  const match = addressStr.match(/(.+?)\s*<(.+?)>/);
  if (match) {
    return {
      name: match[1].trim().replace(/"/g, ''),
      email: match[2].trim()
    };
  }
  
  return {
    name: '',
    email: addressStr.trim()
  };
}

/**
 * Parse multiple email addresses
 */
function parseEmailAddresses(addressesStr) {
  if (!addressesStr) return [];
  
  return addressesStr.split(',').map(addr => parseEmailAddress(addr.trim())).filter(Boolean);
}

/**
 * Decode base64 string
 */
function decodeBase64(str) {
  try {
    // Gmail uses URL-safe base64, need to convert
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(base64);
    return decoded;
  } catch (error) {
    console.error('Error decoding base64:', error);
    return '';
  }
}

/**
 * Fetch emails since last sync
 */
export async function fetchNewEmails(sinceDate = null) {
  let query = '';
  
  if (sinceDate) {
    const timestamp = Math.floor(sinceDate.getTime() / 1000);
    query = `after:${timestamp}`;
  } else {
    // Default: last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const timestamp = Math.floor(thirtyDaysAgo.getTime() / 1000);
    query = `after:${timestamp}`;
  }

  const messages = await fetchGmailMessages({ query, maxResults: 500 });
  
  // Fetch full message details for each
  const messagePromises = (messages.messages || []).map(msg => 
    getGmailMessage(msg.id)
  );
  
  const fullMessages = await Promise.all(messagePromises);
  return fullMessages;
}

/**
 * Get last sync timestamp
 */
export function getLastSyncTimestamp() {
  const lastSync = localStorage.getItem('gmail_last_sync');
  return lastSync ? new Date(parseInt(lastSync)) : null;
}

/**
 * Update last sync timestamp
 */
export function updateLastSyncTimestamp() {
  localStorage.setItem('gmail_last_sync', String(Date.now()));
}

