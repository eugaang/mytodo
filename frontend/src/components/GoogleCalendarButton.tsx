import { useState } from 'react';
import type { CalendarConnectionStatus, SyncResult } from '../types/calendar';
import {
  connectGoogleCalendar,
  syncCalendar,
  disconnectCalendar,
} from '../services/googleCalendar';

interface Props {
  connectionStatus: CalendarConnectionStatus;
  onStatusChange: () => void;
  onSyncComplete: () => void;
}

export default function GoogleCalendarButton({ connectionStatus, onStatusChange, onSyncComplete }: Props) {
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);

  const handleConnect = () => {
    connectGoogleCalendar();
  };

  const handleSync = async () => {
    setSyncing(true);
    setError(null);
    setSyncResult(null);

    try {
      const result = await syncCalendar();
      setSyncResult(result);
      onSyncComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectCalendar();
      setShowDisconnectConfirm(false);
      onStatusChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Disconnect failed');
    }
  };

  const buttonStyle: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
  };

  const primaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#4285f4',
    color: 'white',
  };

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#333',
    color: 'white',
  };

  const dangerButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#dc3545',
    color: 'white',
  };

  if (!connectionStatus.connected) {
    return (
      <div style={{ marginBottom: '16px' }}>
        <button onClick={handleConnect} style={primaryButtonStyle}>
          Google 캘린더 연결
        </button>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ marginBottom: '8px', color: '#888', fontSize: '14px' }}>
        연결됨: {connectionStatus.email}
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
        <button onClick={handleSync} disabled={syncing} style={primaryButtonStyle}>
          {syncing ? '가져오는 중...' : '구글 캘린더 가져오기'}
        </button>

        <button onClick={() => setShowDisconnectConfirm(true)} style={secondaryButtonStyle}>
          연결 해제
        </button>
      </div>

      {syncResult && (
        <div style={{ color: '#4caf50', fontSize: '14px', marginBottom: '8px' }}>
          {syncResult.message}
        </div>
      )}

      {error && (
        <div style={{ color: '#f44336', fontSize: '14px', marginBottom: '8px' }}>
          {error}
        </div>
      )}

      {showDisconnectConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: '#2a2a2a',
            padding: '24px',
            borderRadius: '8px',
            maxWidth: '400px',
          }}>
            <p style={{ marginBottom: '16px' }}>Google 캘린더 연결을 해제하시겠습니까?</p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowDisconnectConfirm(false)} style={secondaryButtonStyle}>
                취소
              </button>
              <button onClick={handleDisconnect} style={dangerButtonStyle}>
                해제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
