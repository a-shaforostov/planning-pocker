export function newSession({ state }, payload) {
  state.set(`data.isObserver`, true);
  state.set(`data.token`, payload.token);
  state.set(`data.sessionId`, payload.id);
  state.set(`data.auth`, true);
  state.set(`data.sessionStarts`, payload.sessionStarts);
}

export function joinSessionResponse({ state }, data) {
  if (data.success) {
    state.set(`data.auth`, true);
    state.set(`data.isObserver`, false);
    state.set(`data.sessionStarts`, data.payload.sessionStarts);
    state.set(`data.marks.items`, data.payload.marks);
  } else {
    state.set(`data.auth`, false);
    state.set(`data.isObserver`, false);
    state.set(`data.error`, data.error);
  }
}

export function sendSessionState({ state }, payload) {
  state.set(`data.playground`, payload);
}

export function sendSessionClosed({ state }, payload) {
  state.set(`data.error`, payload.message);
}
