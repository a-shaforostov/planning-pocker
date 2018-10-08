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
    this.pool.push({
      id,
      observer: {
        login: opt.login,
        connectionId,
        connection: this.connections[connectionId],
        token,
      },
      players: [],
      stories: [],
    });
    return {
      id,
      token,
    };
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
      connection: this.connections[connectionId],
    });
  }

  deleteSession(id) {
    const s = this.pool.find(s => s.id === id);
    if (s) {
      this.pool = this.pool.filter(s => s.id !== id);
      s.observer.connection.close(1001, 'Сесію закрито');
      s.players.forEach(p => {
        p.connection.close(1001, 'Сесію закрито');
      })
    }
  }

  getSession(id) {
    return this.pool.find(item => item.id === id);
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
      this.emit('sessionDeleted', { sessionId: id })
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
