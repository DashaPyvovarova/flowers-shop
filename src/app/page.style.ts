import { CSSProperties } from 'react';

export const wrapperStyle: CSSProperties = {
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
};

export const contentStyle: CSSProperties = {
  position: 'relative',
  flex: 3,
  width: '100%',
  height: '100%',
  boxSizing: 'border-box',
  backgroundColor: '#f3f4f6',
};
