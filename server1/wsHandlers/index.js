const sessions = require('../sessions');

module.exports = wss => {

  function createSession(ws, payload) {
    const s = sessions.createSession(ws.id, payload);
    const ps = sessions.getPublicSession(s.id);
    ws.send(JSON.stringify({
      action: 'newSession',
      payload: {
        ...ps,
        token: s.observer.token,
      },
    }));
  }

  function joinSession(ws, payload) {
    let response;
    try {
      const s = sessions.joinSession(ws.id, payload);
      const ps = sessions.getPublicSession(s.id);
      response = {
        success: true,
        payload: ps,
      }
    } catch (error) {
      response = {
        success: false,
        error: error.message,
      }
    }

    ws.send(JSON.stringify({
      action: 'joinSessionResponse',
      payload: response,
    }));

    if (response.success) {
      sendSessionState(payload.sessionId);
    }
  }

  function createStory(ws, payload) {
    const s = sessions.createStory(ws.id, payload);
    sendSessionState(payload.sessionId);
  }

  function sendSessionState(sessionId) {
    const s = sessions.getSession(sessionId);
    const ps = sessions.getPublicSession(sessionId);
    [s.observer, ...s.players].forEach(user => {
      const ws = sessions.connections[user.connectionId];
      // if (!ws) {
      //   delete sessions.connections[user.connectionId];
      //   return;
      // }
      ws.send(JSON.stringify({
        action: 'sendSessionState',
        payload: ps,
      }));
    })
  }

  function sendSessionClosed(sessionId) {
    const s = sessions.getSession(sessionId);
    const response = {
      message: 'Сесію закрито',
    };
    [s.observer, ...s.players].forEach(user => {
      const ws = sessions.connections[user.connectionId];
      if (!ws || ws.readyState !== 1) return;

      ws.send(JSON.stringify({
        action: 'sendSessionClosed',
        payload: response,
      }));
    })
  }

  sessions.addListener('sessionDeleted', ({ sessionId }) => {
    sendSessionClosed(sessionId);
  });

  sessions.addListener('connectionsUpdated', ({ sessionId }) => {
    sendSessionState(sessionId);
  });

  return {
    createSession,
    joinSession,
    sendSessionState,
    createStory,
  }
};
