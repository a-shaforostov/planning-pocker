export const formatTime = time => `
  ${String(time.getUTCHours()).padStart(2, '0')}:
  ${String(time.getMinutes()).padStart(2, '0')}:
  ${String(time.getSeconds()).padStart(2, '0')}
`;
