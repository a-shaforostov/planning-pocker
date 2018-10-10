import * as wsHandlers from './wsHandlers';
import {set} from "cerebral/factories";

export const ws = {
  comp: null,
};

export function createSession({ props }) {
  ws.comp.send(JSON.stringify({
    action: 'createSession',
    payload: {
      login: props.login,
      marks: props.marks || [0, 1, 2, 3, 5, 8, '?'],
    },
  }));
}

export function joinSession({ state, props }) {
  ws.comp.send(JSON.stringify({
    action: 'joinSession',
    payload: {
      sessionId: state.get(`data.sessionId`),
      login: props.login,
    },
  }));
}

export function addMark({ state, props }) {
  const items = state.get(`data.marks.items`);
  if (items.includes(props.value)) return;

  items.push(props.value);
  items.sort((a, b) => {
    if (a === '?') return 1;
    if (b === '?') return -1;
    return a - b;
  });
  state.set(`data.marks.items`, items);
}

export function removeMark({ state, props }) {
  const items = state.get(`data.marks.items`);
  items.splice(props.index, 1);
  state.set(`data.marks.items`, items);
}

export function serverMessage(context) {
  const { action, payload } = context.props;
  wsHandlers[action](context, payload);
}

export function createStory({ state, props }) {
  ws.comp.send(JSON.stringify({
    action: 'createStory',
    payload: {
      sessionId: state.get(`data.sessionId`),
      token: state.get(`data.token`),
      story: props.story,
    },
  }));
  state.set(`data.playground.state`, 'sendingStory');
}


//////////////////////////////////////////////////////
export function updateName({ state, props }) {
  const users = state.get(`data.users`);
  users[props.index].name = props.value;
  state.set(`data.users`, users);
}

// Новий хід
export function newTurn(context) {
  const { state } = context;

  let currentTurn = state.get(`data.game.currentTurn`);
  let currentTeam = state.get(`data.game.currentTeam`);

  if (currentTurn === 16) {

    closeEnd(context);

  } else {

    const teams = state.get(`data.game.teams`);
    teams[currentTeam].currentTurn++;
    state.set(`data.game.teams`, teams);

    // Створити новий камінь
    const newBall = {
      team: currentTeam,
      x: 250,
      y: 512 + 640,
      angle: 0,
      speed: 0,
    };
    state.push('data.game.balls', newBall);
    state.set(`data.game.currentBall`, newBall);

    currentTeam = currentTeam === 0 ? 1 : 0;
    state.set(`data.game.currentTeam`, currentTeam);
    state.set(`data.game.currentTurn`, currentTurn + 1);
  }

}

// Новий енд
export function newEnd({ state }) {
  const currentEnd = state.get(`data.game.currentEnd`);
  state.set(`data.game.currentEnd`, currentEnd+1);

  state.set(`data.game.currentTurn`, 1);

  //TODO: Команда залежить від попереднього результату
  state.set(`data.game.currentTeam`, 0);

  const teams = state.get(`data.game.teams`);
  [0,1].forEach(team => {
    teams[team].currentTurn = 1;
    teams[team].turns = Array(8).fill(null);
  });
  state.set(`data.game.teams`, teams);

  state.set(`data.game.balls`, []);
  state.set(`data.game.currentBall`, null);

}

// Нова гра
export function newGame(context) {
  const { state, router } = context;
  state.set(`data.game.inGame`, true);
  state.set(`data.game.gameOver`, false);
  state.set(`data.game.gameResult`, []);
  state.set(`data.game.gameWinner`, null);
  state.set(`data.game.currentEnd`, 0);

  newEnd(context);

  // Очистити результати ендів
  const teams = state.get(`data.game.teams`);
  [0,1].forEach(team => {
    teams[team].ends = Array(10).fill(null);
  });
  state.set(`data.game.teams`, teams);

  router.goTo('/game');
}

// Завершити енд
export function closeEnd(context) {
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const { state } = context;

  // TODO: Вираховувати результати енда
  const num = getRandomInt(0, 4);
  const winner = getRandomInt(0, 1);
  const looser = winner === 0 ? 1 : 0;

  const end = state.get(`data.game.currentEnd`);

  // Встановити результати енда
  const teams = state.get(`data.game.teams`);
  teams[winner].ends[end-1] = num;
  teams[looser].ends[end-1] = 0;
  state.set(`data.game.teams`, teams);

  if (end === 10) {
    closeGame(context);
  } else {
    newEnd(context);
  }

}

// Завершити гру
export function closeGame(context) {
  const { state, router } = context;

  state.set(`data.game.inGame`, false);
  state.set(`data.game.gameOver`, true);

  const teams = state.get(`data.game.teams`);
  const result = [0,1].map(team => teams[team].ends.reduce((sum, item) => sum+item, 0));
  state.set(`data.game.gameResult`, result);
  let winner = null;
  if (result[0] > result[1]) {
    winner = 0;
  } else if (result[0] < result[1]) {
    winner = 1;
  }
  state.set(`data.game.gameWinner`, winner);

  router.goTo('/results');
}

// Почати з початку
export function start({ router }) {
  router.goTo('/');
}
