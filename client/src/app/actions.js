import * as wsHandlers from './wsHandlers';
import { setError } from "./helpers";

export const ws = {
  comp: null,
};

export function createSession({ state, props }) {
  const url = state.get(`data.jira.url`);
  const login = state.get(`data.jira.login`);
  const pass = state.get(`data.jira.pass`);
  let jira;
  if (url && login && pass) {
    jira = {
      url,
      auth: Buffer.from(`${login}:${pass}`).toString('base64'),
    }
  } else {
    state.set(`data.jira`, {});
  }
  ws.comp.send(JSON.stringify({
    action: 'createSession',
    payload: {
      login: props.login,
      marks: props.marks || [0, 1, 2, 3, 5, 8, '?'],
      jira,
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

export function stopSession({ state, props }) {
  ws.comp.send(JSON.stringify({
    action: 'stopSession',
    payload: {
      sessionId: state.get(`data.sessionId`),
      token: state.get(`data.token`),
    },
  }));
  state.set(`data.storyedit`, '');
  state.set(`data.issueedit`, '');
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
  context.state.set(`data.playground.state`, '-stable-');
  wsHandlers[action](context, payload);
}

export function createStory({ state, props }) {
  if (!props.story) {
    setError({ state, props: { error: 'Текст історії не заповнений' } });
    return;
  }
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

export function revoteStory({ state, props }) {
  ws.comp.send(JSON.stringify({
    action: 'revoteStory',
    payload: {
      sessionId: state.get(`data.sessionId`),
      token: state.get(`data.token`),
      storyNum: state.get(`data.playground.currentStory.num`),
    },
  }));
  state.set(`data.playground.state`, 'sendingStory');
}

export function createStoryFromJira({ state, props }) {
  if (!props.issue) {
    setError({ state, props: { error: 'Поле Issue не заповнене' } });
    return;
  }
  ws.comp.send(JSON.stringify({
    action: 'createStoryFromJira',
    payload: {
      sessionId: state.get(`data.sessionId`),
      token: state.get(`data.token`),
      issue: props.issue,
    },
  }));
  state.set(`data.playground.state`, 'sendingStory');
}

export function giveMark({ state, props }) {
  ws.comp.send(JSON.stringify({
    action: 'giveMark',
    payload: {
      sessionId: state.get(`data.sessionId`),
      mark: props.mark,
    },
  }));
  state.set(`data.playground.currentStory.mark`, props.mark);
}

export function finishStory({ state, props }) {
  ws.comp.send(JSON.stringify({
    action: 'finishStory',
    payload: {
      sessionId: state.get(`data.sessionId`),
      token: state.get(`data.token`),
      result: props.result,
    },
  }));
  state.set(`data.playground.currentStory.result`, props.result);
}

export function newStory({ state, props }) {
  ws.comp.send(JSON.stringify({
    action: 'newStory',
    payload: {
      sessionId: state.get(`data.sessionId`),
      token: state.get(`data.token`),
    },
  }));
  state.set(`data.playground.currentStory`, null);
  state.set(`data.storyedit`, '');
}

export function switchStory({ state, props }) {
  const currentStory = state.get(`data.playground.stories`)[props.num - 1];
  state.set(`data.playground.currentStory`, currentStory);
  state.set(`data.storyedit`, currentStory.text);
  state.set(`data.issueedit`, '');
}

export function downloadFile({ props }) {
  const { data, filename } = props;
  const link = document.createElement("a");
  link.download = filename;
  link.href = data;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => document.body.removeChild(link), 0);
}

export async function loadFile({ state, props }) {

  function readFile(file){
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => {
        resolve(fr.result)
      };
      fr.readAsText(file);
    });
  }

  const { filename } = props;

  let data;
  try {
    data = await readFile(filename);
  } catch(e) {
    alert('Can`t read file');
    return;
  }

  let dataObj;
  try {
    dataObj = JSON.parse(data);
  } catch(e) {
    alert('wrong file format');
    return;
  }

  // В списку гравців відобразити всіх, хто оцінював історії
  const allPlayers = {};
  dataObj.playground.stories.forEach(story => {
    story.players.forEach(player => {
      allPlayers[player.login] = true;
    });
  });
  const players = Object.keys(allPlayers);

  state.set('data', {
    ...dataObj,
    playground: {
      ...dataObj.playground,
      players,
    }
  });

  state.set('isLoaded', true);
}
