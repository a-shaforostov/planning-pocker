import { errorDelay } from './constants';

export const formatTime = time => `
  ${String(time.getUTCHours()).padStart(2, '0')}:
  ${String(time.getMinutes()).padStart(2, '0')}:
  ${String(time.getSeconds()).padStart(2, '0')}
`;

let delayId;
export const setError = ({ state, props }) => {
  if (delayId) clearTimeout(delayId);
  state.set('data.error', props.error);
  delayId = setTimeout(() => state.set('data.error', ''), errorDelay);
};

export const hideError = ({ state }) => {
  if (delayId) clearTimeout(delayId);
  delayId = setTimeout(() => state.set('data.error', ''), errorDelay);
};

export const clearError = ({ state }) => {
  if (delayId) clearTimeout(delayId);
  state.set('data.error', '');
};
