const uuidv1 = require('uuid/v1');
const sha1 = require('sha1');
const salt = '72rt81btcv723vx111b73rvc871bx36';

class Sessions {
  constructor() {
    this.pool = [];
    this.connections = {};
  }

  createSession(connectionId, opt) {
    const id = uuidv1();
    const token = sha1(salt + id);
    this.pool.push({
      observer: {
        name: opt.login,
        connectionId,
        token,
      },
      players: [],
      id,
    });
    return {
      id,
      token,
    };

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
  }

  getConnectionsSize() {
    return Object.keys(this.connections).length;
  }
}

module.exports =  new Sessions();
