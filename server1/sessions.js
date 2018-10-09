const uuidv1 = require('uuid/v1');
const sha1 = require('sha1');
const EventEmitter = require('events');
const salt = '72rt81btcv723vx111b73rvc871bx36';

class Sessions extends EventEmitter {
  constructor() {
    super();
    this.pool = [];
    this.connections = {};
  }

  createSession(connectionId, opt) {
    const id = uuidv1();
    const token = sha1(salt + id);
    const s = {
      id,
      observer: {
        login: opt.login,
        connectionId,
        token,
        state: 'pending',
      },
      marks: opt.marks || [],
      players: [],
      stories: [],
      currentStory: null,
    };
    this.pool.push(s);
    return s;
  }

  startSession(sessionId, token) {
    const s = this.pool[sessionId];
    if (s.observer.token === token) {
      s.sessionStarted = new Date().getTime();
      s.state = 'running';
      this.emit('sessionStarted', { sessionId: s.id, time: s.sessionStarted });
    } else {
      throw new Error('Користувач не має права на керування до сесією')
    }
  }

  stopSession(sessionId, token) {
    const s = this.pool[sessionId];
    if (s.observer.token === token) {
      s.sessionFinished = new Date().getTime();
      s.state = 'ended';
      this.emit('sessionFinished', { sessionId: s.id, time: s.sessionFinished });
    } else {
      throw new Error('Користувач не має права на керування до сесією')
    }
  }
  
  createStory(sessionId, opt) {
    const s = this.pool[sessionId];
    if (!s) {
      throw new Error('Сесію не знайдено');
    }
    
    s.currentStory = {
      start: new Date.getTime(),
      finish: null,
      text: opt.story,
      players: s.players.map(player => ({
        ...player,
        mark: false,
        time: null,
      }))
    };
    
    s.stories.push(s.currentStory);
  }
  
  markStory(sessionId, opt) {
    const s = this.pool[sessionId];
    if (!s) {
      throw new Error('Сесію не знайдено');
    }
    
    const story = s.currentStory;
    const user = story.players.find(p => p.login === opt.login);
    if (!user) {
      throw new Error('Гравця не знайдено');
    }

    user.mark = opt.mark;
    user.time = new Date.getTime();

    if (story.players.some(p => p.mark !== false)) {
      // Ще не всі проголосували
      this.emit('storyMarked', { story });
    } else {
      this.emit('storyResolved', { story });
    }

  }

  joinSession(connectionId, opt) {
    const session = this.pool.find(s => s.id === opt.sessionId);
    if (!session) {
      throw new Error('Сесію не знайдено');
    }

    const user = session.players.find(p => p.login === opt.login);
    if (user) {
      throw new Error(`Ім'я вже використовується`);
    }

    session.players.push({
      login: opt.login,
      connectionId,
    });

    return session;
  }

  deleteSession(id) {
    const s = this.pool.find(s => s.id === id);
    if (s) {
      this.pool = this.pool.filter(s => s.id !== id);
      const connection = this.connections[s.observer.connectionId];
      if (connection) {
        connection.close(1001, 'Сесію закрито');
      }
      s.players.forEach(p => {
        const connection = this.connections[p.connectionId];
        if (connection) {
          connection.close(1001, 'Сесію закрито');
        }
      })
    }
  }

  getSession(id) {
    return this.pool.find(item => item.id === id);
  }
  
  getPublicSession(id) {
    const s = this.getSession(id);
    return {
      id: s.id,
      observer: s.observer.login,
      players: s.players.map(p => p.login),
      marks: s.marks,
      stories: s.stories,
      currentStory: s.currentStory,
      sessionStarted: s.sessionStarted,
      state: s.state,
    }
  }

  addConnection(ws) {
    ws.id = uuidv1();
    this.connections[ws.id] = ws;
  }

  removeConnection(id) {
    delete this.connections[id];

    // if observer - delete session and close all connections with players
    const s = this.pool.find(s => s.observer.connectionId === id);
    if (s) {
      const id = s.id;
      this.emit('sessionDeleted', { sessionId: id });
      this.deleteSession(id);
    }

    // if player - remove it from session
    this.pool.forEach(s => {
      const p = s.players.find(p => p.connectionId === id);
      if (p) {
        s.players = s.players.filter(p => p.connectionId !==id);
        this.emit('connectionsUpdated', { sessionId: s.id })
      }
    })
  }

  getConnectionsSize() {
    return Object.keys(this.connections).length;
  }
}

module.exports =  new Sessions();
