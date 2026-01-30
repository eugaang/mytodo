export interface CalendarConnection {
  id: string;
  google_email: string;
  access_token: string;
  refresh_token: string;
  token_expiry: number | null;
  created_at: string;
  updated_at: string;
}

export interface CalendarConnectionStatus {
  connected: boolean;
  email: string | null;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
}

export interface SyncResult {
  success: boolean;
  imported: number;
  skipped: number;
  total: number;
  message: string;
}

export interface CalendarError {
  error: string;
  message: string;
}
