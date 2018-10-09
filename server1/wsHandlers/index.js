const sessions = require('../sessions');

module.exports = wss => {

  function createSession(ws, payload) {
    const s = sessions.createSession(ws.id, payload);
    ws.send(JSON.stringify({
      action: 'newSession',
      payload: s,
    }));
  }

  function joinSession(ws, payload) {
    let response;
    try {
      const s = sessions.joinSession(ws.id, payload);
      response = {
        success: true,
        payload: {
          sessionStarted: s.sessionStarted,
          marks: s.marks,
        }
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

  function sendSessionState(sessionId) {
    const s = sessions.getSession(sessionId);
    const response = {
      observer: s.observer.login,
      players: s.players.map(p => p.login),
    };
    [s.observer, ...s.players].forEach(user => {
      const ws = user.connection;
      ws.send(JSON.stringify({
        action: 'sendSessionState',
        payload: response,
      }));
    })
  }

  function sendSessionClosed(sessionId) {
    const s = sessions.getSession(sessionId);
    const response = {
      message: 'Сесію закрито',
    };
    [s.observer, ...s.players].forEach(user => {
      const ws = user.connection;
      if (ws.readyState !== 1) return;

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
  }
};
