import React, { useState } from 'react';
import styles from '@/styles/AdminPanel.module.css';

interface AdminPanelProps {
  onClose: () => void;
}

interface AdminSettings {
  minimumTransfer: number;
  defaultDestination: string;
  networkFee: number;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [settings, setSettings] = useState<AdminSettings>(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem('adminSettings');
    return saved ? JSON.parse(saved) : {
      minimumTransfer: 50,
      defaultDestination: '',
      networkFee: 1,
    };
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Validate inputs
      if (settings.minimumTransfer < 1) {
        throw new Error('Minimum transfer must be at least $1');
      }

      if (settings.networkFee < 0) {
        throw new Error('Network fee cannot be negative');
      }

      if (settings.defaultDestination && !settings.defaultDestination.startsWith('T')) {
        throw new Error('Invalid TRON wallet address');
      }

      // Save to localStorage
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      setSuccess('Settings saved successfully!');

      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving settings');
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all settings to defaults?')) {
      const defaults = {
        minimumTransfer: 50,
        defaultDestination: '',
        networkFee: 1,
      };
      setSettings(defaults);
      localStorage.setItem('adminSettings', JSON.stringify(defaults));
      setSuccess('Settings reset to default');
    }
  };

  return (
    <div className={styles.panelOverlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>⚙️ Admin Settings</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSave} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="minTransfer">Minimum Transfer Amount (USDT)</label>
            <input
              id="minTransfer"
              type="number"
              value={settings.minimumTransfer}
              onChange={(e) => setSettings({
                ...settings,
                minimumTransfer: parseFloat(e.target.value)
              })}
              min="1"
              step="0.01"
              className={styles.input}
            />
            <small>Users cannot send less than this amount</small>
          </div>

          <div className={styles.field}>
            <label htmlFor="networkFee">Network Fee (USDT)</label>
            <input
              id="networkFee"
              type="number"
              value={settings.networkFee}
              onChange={(e) => setSettings({
                ...settings,
                networkFee: parseFloat(e.target.value)
              })}
              min="0"
              step="0.01"
              className={styles.input}
            />
            <small>Fee deducted from transfer amount</small>
          </div>

          <div className={styles.field}>
            <label htmlFor="destination">Default Destination Wallet</label>
            <input
              id="destination"
              type="text"
              value={settings.defaultDestination}
              onChange={(e) => setSettings({
                ...settings,
                defaultDestination: e.target.value
              })}
              placeholder="Leave empty for no default (starts with T)"
              className={styles.input}
            />
            <small>Optional: Pre-fill destination wallet for users</small>
          </div>

          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.saveBtn}>
              💾 Save Settings
            </button>
            <button type="button" onClick={handleReset} className={styles.resetBtn}>
              🔄 Reset to Default
            </button>
          </div>
        </form>

        <div className={styles.info}>
          <h3>Current Configuration:</h3>
          <div className={styles.configItem}>
            <span>Minimum Transfer:</span>
            <strong>${settings.minimumTransfer.toFixed(2)}</strong>
          </div>
          <div className={styles.configItem}>
            <span>Network Fee:</span>
            <strong>${settings.networkFee.toFixed(2)}</strong>
          </div>
          <div className={styles.configItem}>
            <span>Default Destination:</span>
            <strong>{settings.defaultDestination || 'None'}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Get admin settings from localStorage
 */
export function getAdminSettings(): AdminSettings {
  const saved = localStorage.getItem('adminSettings');
  return saved ? JSON.parse(saved) : {
    minimumTransfer: 50,
    defaultDestination: '',
    networkFee: 1,
  };
}
