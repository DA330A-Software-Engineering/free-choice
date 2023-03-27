import { CSSProperties } from 'react';

export const toggleDeviceStyles: Record<string, CSSProperties> = {
  button: {
    padding: '16px',
    fontSize: '2rem',
    borderRadius: '4px',
    backgroundColor: '#1976d2',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: '5rem',
    margin: '16px',
  },
  lockIcon: {
    fontSize: '2rem',
    margin: '16px',
  },
};
