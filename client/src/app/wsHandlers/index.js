export function newSession({ state }, payload) {
  state.set(`data.isObserver`, true);
  state.set(`data.token`, payload.token);
  state.set(`data.sessionId`, payload.id);
  state.set(`data.auth`, true);
}

export function joinSessionResponse({ state }, payload) {
  if (payload.success) {
    state.set(`data.auth`, true);
    state.set(`data.isObserver`, false);
  } else {
    state.set(`data.auth`, false);
    state.set(`data.isObserver`, false);
    state.set(`data.error`, payload.error);
  }
}

export function sendSessionState({ state }, payload) {
  state.set(`data.playground`, payload);
}

export function sendSessionClosed({ state }, payload) {
  state.set(`data.error`, payload.message);
}
