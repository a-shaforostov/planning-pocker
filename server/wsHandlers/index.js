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

  function stopSession(ws, payload) {
    const s = sessions.stopSession(ws.id, payload);
    sendSessionState(payload.sessionId);
  }

  function createStory(ws, payload) {
    try {
      const s = sessions.createStory(ws.id, payload);
    } catch (err) {
      return ws.send(JSON.stringify({
        action: 'errorMessage',
        payload: {
          message: 'Не вдалося опублікувати історію. ',
          reason: err.message,
        },
      }));
    }
    sendSessionState(payload.sessionId);
  }

  function revoteStory(ws, payload) {
    try {
      const s = sessions.revoteStory(ws.id, payload);
    } catch (err) {
      return ws.send(JSON.stringify({
        action: 'errorMessage',
        payload: {
          message: 'Не вдалося опублікувати історію. ',
          reason: err.message,
        },
      }));
    }
    sendSessionState(payload.sessionId);
  }

  function createStoryFromJira(ws, payload) {
    return sessions.createStoryFromJira(ws.id, payload)
      .then(() => {
        sendSessionState(payload.sessionId);
      })
      .catch((err) => {
        ws.send(JSON.stringify({
          action: 'errorMessage',
          payload: {
            message: 'Не вдалося створити історію з Jira. ',
            reason: err.message,
          },
        }));
      });
  }

  function giveMark(ws, payload) {
    return sessions.giveMark(ws.id, payload)
      .catch(err => {
        const s = sessions.getSession(payload.sessionId);
        sessions.connections[s.observer.connectionId].send(JSON.stringify({
          action: 'errorMessage',
          payload: {
            message: 'Не вдалося оновити оцінку в Jira. ',
            reason: err.message,
          },
        }));
      })
      .then(() => sendSessionState(payload.sessionId));
  }

  function finishStory(ws, payload) {
    let story;
    try {
      story = sessions.finishStory(ws.id, payload)
    } catch (err) {
      return ws.send(JSON.stringify({
        action: 'errorMessage',
        payload: {
          message: 'Не вдалося оцінити історію',
          reason: err.message,
        },
      }));
    }
    sendSessionState(payload.sessionId);

    // Відіслати результат в Jira
    if (story.issue) {
      return sessions.updateIssue(payload.sessionId, story)
        .catch(err => {
          return ws.send(JSON.stringify({
            action: 'errorMessage',
            payload: {
              message: 'Не вдалося оновити issue в Jira',
              reason: err.message,
            },
          }));
        });
    }
  }

  function newStory(ws, payload) {
    try {
      const s = sessions.newStory(ws.id, payload);
    } catch (err) {
      return ws.send(JSON.stringify({
        action: 'errorMessage',
        payload: {
          message: 'Не вдалося перейти до нової історії',
          reason: err.message,
        },
      }));
    }
    sendSessionState(payload.sessionId);
  }

  function sendSessionState(sessionId) {
    const s = sessions.getSession(sessionId);
    const ps = sessions.getPublicSession(sessionId);
    [s.observer, ...s.players].forEach(user => {
      const ws = sessions.connections[user.connectionId];
      ws.send(JSON.stringify({
        action: 'sendSessionState',
        payload: ps,
      }));
    })
  }

  function sendSessionClosed(sessionId) {
    const s = sessions.getSession(sessionId);
    const response = {
      message: 'Сесію закрито. Перейдіть в іншу сесію або знайдіть іншу забавку.',
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
    createStoryFromJira,
    giveMark,
    finishStory,
    newStory,
    revoteStory,
    stopSession,
  }
};
