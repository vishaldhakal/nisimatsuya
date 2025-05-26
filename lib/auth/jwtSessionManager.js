
class JWTSessionManager {
  constructor() {
    this.TOKEN_KEY = 'auth_token';
    this.REFRESH_TOKEN_KEY = 'refresh_token';
    this.USER_KEY = 'auth_user';
    this.SESSION_KEY = 'auth_session';
    
    // Auto-refresh token 5 minutes before expiry
    this.REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds
    this.refreshTimer = null;
  }

  // Decode JWT token to get payload
  decodeToken(token) {
    try {
      if (!token) return null;
      
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Check if token is expired
  isTokenExpired(token) {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  }

  // Check if token expires soon (within refresh threshold)
  shouldRefreshToken(token) {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Date.now() / 1000;
    const timeUntilExp = (decoded.exp - currentTime) * 1000;
    
    return timeUntilExp <= this.REFRESH_THRESHOLD;
  }

  // Create session data with metadata
  createSession(tokenData) {
    const { access_token, refresh_token, user } = tokenData;
    
    const sessionData = {
      accessToken: access_token,
      refreshToken: refresh_token,
      user: user,
      createdAt: Date.now(),
      lastActivity: Date.now(),
      deviceId: this.generateDeviceId()
    };

    return sessionData;
  }

  // Generate a simple device identifier
  generateDeviceId() {
    if (typeof window === 'undefined') return null;
    
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = 'device_' + Math.random().toString(36).substr(2, 9) + Date.now();
      localStorage.setItem('device_id', deviceId);
    }
    return deviceId;
  }

  // Set session data
  setSession(tokenData) {
      console.log('Setting session:', { 
        token: tokenData.access_token, 
        user: tokenData.user 
      });
    if (typeof window === 'undefined') return;
    
    try {
      const sessionData = this.createSession(tokenData);
      
      // Store individual items for backward compatibility
      localStorage.setItem(this.TOKEN_KEY, sessionData.accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, sessionData.refreshToken);
      localStorage.setItem(this.USER_KEY, JSON.stringify(sessionData.user));
      
      // Store complete session data
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
      
      // Update last activity
      this.updateActivity();
      
      // Setup auto-refresh
      this.setupTokenRefresh(sessionData.accessToken);
      
      console.log('Session established successfully');
    } catch (error) {
      console.error('Error setting session:', error);
    }
  }

  // Get current session
  getSession() {
    if (typeof window === 'undefined') return null;

    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      if (!sessionData) return null;

      const session = JSON.parse(sessionData);
      
      // Check if session is valid
      if (this.isSessionValid(session)) {
        this.updateActivity();
        return session;
      } else {
        this.clearSession();
        return null;
      }
    } catch (error) {
      console.error('Error getting session:', error);
      this.clearSession();
      return null;
    }
  }

  // Validate session
  isSessionValid(session) {
    if (!session || !session.accessToken) return false;
    
    // Check if access token is expired
    if (this.isTokenExpired(session.accessToken)) {
      // If refresh token exists and is valid, session can be refreshed
      if (session.refreshToken && !this.isTokenExpired(session.refreshToken)) {
        return true; // Session can be refreshed
      }
      return false;
    }
    
    return true;
  }

  // Update last activity timestamp
  updateActivity() {
    if (typeof window === 'undefined') return;

    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      if (sessionData) {
        const session = JSON.parse(sessionData);
        session.lastActivity = Date.now();
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
      }
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  }

  // Get access token
  getAccessToken() {
    const session = this.getSession();
    return session ? session.accessToken : null;
  }

  // Get refresh token
  getRefreshToken() {
    const session = this.getSession();
    return session ? session.refreshToken : null;
  }

  // Get user data
  getUser() {
    const session = this.getSession();
    return session ? session.user : null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    const session = this.getSession();
    return session !== null;
  }

  // Setup automatic token refresh
  setupTokenRefresh(token) {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return;

    const currentTime = Date.now() / 1000;
    const timeUntilRefresh = ((decoded.exp - currentTime) * 1000) - this.REFRESH_THRESHOLD;

    if (timeUntilRefresh > 0) {
      this.refreshTimer = setTimeout(() => {
        this.handleTokenRefresh();
      }, timeUntilRefresh);
    }
  }

  // Handle token refresh
  async handleTokenRefresh() {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken || this.isTokenExpired(refreshToken)) {
        this.clearSession();
        this.redirectToLogin();
        return;
      }

      // Call your refresh token API
      const response = await this.refreshTokenAPI(refreshToken);
      
      if (response.access_token) {
        // Update session with new tokens
        const currentSession = this.getSession();
        const updatedSession = {
          ...currentSession,
          accessToken: response.access_token,
          refreshToken: response.refresh_token || refreshToken,
          lastActivity: Date.now()
        };

        localStorage.setItem(this.SESSION_KEY, JSON.stringify(updatedSession));
        localStorage.setItem(this.TOKEN_KEY, response.access_token);
        
        if (response.refresh_token) {
          localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refresh_token);
        }

        // Setup next refresh
        this.setupTokenRefresh(response.access_token);
        
        console.log('Token refreshed successfully');
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearSession();
      this.redirectToLogin();
    }
  }

  // API call to refresh token (implement based on your backend)
  async refreshTokenAPI(refreshToken) {
    // Replace with your actual refresh token endpoint
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken })
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    return response.json();
  }

  // Clear session data
  clearSession() {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.SESSION_KEY);
      
      if (this.refreshTimer) {
        clearTimeout(this.refreshTimer);
        this.refreshTimer = null;
      }
      
      console.log('Session cleared');
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  }

  // Redirect to login page
  redirectToLogin() {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  // Get session info for debugging
  getSessionInfo() {
    const session = this.getSession();
    if (!session) return null;

    const decoded = this.decodeToken(session.accessToken);
    const refreshDecoded = this.decodeToken(session.refreshToken);

    return {
      user: session.user,
      tokenExpiry: decoded ? new Date(decoded.exp * 1000) : null,
      refreshTokenExpiry: refreshDecoded ? new Date(refreshDecoded.exp * 1000) : null,
      sessionAge: Date.now() - session.createdAt,
      lastActivity: new Date(session.lastActivity),
      deviceId: session.deviceId
    };
  }

  // Initialize session manager
  initialize() {
    if (typeof window === 'undefined') return;

    // Check existing session on page load
    const session = this.getSession();
    if (session && session.accessToken) {
      // Setup token refresh for existing session
      this.setupTokenRefresh(session.accessToken);
    }

    // Setup activity tracking
    this.setupActivityTracking();
  }

  // Setup activity tracking to update last activity
  setupActivityTracking() {
    if (typeof window === 'undefined') return;

    const events = ['mousedown', 'keypress', 'scroll', 'click'];
    const updateActivity = () => this.updateActivity();

    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });
  }
}

// Create singleton instance
export const jwtSessionManager = new JWTSessionManager();

// Initialize on import (client-side only)
if (typeof window !== 'undefined') {
  jwtSessionManager.initialize();
}