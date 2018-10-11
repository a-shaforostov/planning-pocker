// import { resetForm } from '@cerebral/forms/operators';
import { props, state } from 'cerebral/tags';
import * as factories from "./factories";
import * as actions from "./actions";
import { set } from 'cerebral/factories'

export const rootRouted = [
  set(state`data.page`, 'main'),
  set(state`data.isObserver`, false),
  set(state`data.login`, ''),
  set(state`data.sessionId`, null),
  set(state`data.token`, null),
];

export const playerRouted = [
  set(state`data.page`, 'session'),
  set(state`data.isObserver`, false),
  set(state`data.login`, ''),
  set(state`data.sessionId`, props`params.id`),
  set(state`data.token`, null),
];

export const createSession = [
  actions.createSession,
];

export const joinSession = [
  actions.joinSession,
];

export const updateField = set(state`${props`path`}`, props`value`);

export const updateMark = set(state`data.marks.editor`, props`value`);
export const addMark = actions.addMark;
export const removeMark = actions.removeMark;

export const serverMessage = [
  actions.serverMessage,
];

export const createStory = actions.createStory;
export const createStoryFromJira = actions.createStoryFromJira;
export const setTime = set(state`time`, props`time`);
export const giveMark = actions.giveMark;
export const finishStory = actions.finishStory;
export const newStory = actions.newStory;
export const switchStory = actions.switchStory;

export const updateIsConnected = set(state`data.isConnected`, props`value`);


// /* Routes */
// export const rootRouted = factories.openRoute('root');
// export const gameRouted = factories.openRoute('game');
// export const resultsRouted = factories.openRoute('results');
//
// /* Marks application as loaded */
// export const applicationLoaded = [
//   set(state`isApplicationLoaded`, true),
//   wait(pageTransitionDelay),
//   when(state`initialPage`),
//   {
//     true: set(state`currentPage`, state`initialPage`),
//     false: [],
//   },
// ];
//
// /* Form processing */
// export const showModal = set(state`env.${props`name`}.edit`, props`show`);
// export const updateName = actions.updateName;
// export const resetEditForm = resetForm(state`${props`form`}`);
//
// /* Game navigation */
// export const newGame = actions.newGame;
// export const newTurn = actions.newTurn;
// export const start = actions.start;
