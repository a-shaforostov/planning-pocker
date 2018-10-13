import { props, state } from 'cerebral/tags';
import * as factories from "./factories";
import * as actions from "./actions";
import { set } from 'cerebral/factories'

/* Routes */
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

/* Загальні послідовності */
export const updateIsConnected = set(state`data.isConnected`, props`value`);
export const updateField = set(state`${props`path`}`, props`value`);
export const updateMark = set(state`data.marks.editor`, props`value`);
export const addMark = actions.addMark;
export const removeMark = actions.removeMark;
export const switchStory = actions.switchStory;
export const downloadFile = actions.downloadFile;
export const loadFile = actions.loadFile;
export const showStats = set(state`data.statsVisible`, props`visible`);

/* Отримання повідомлень з сервера */
export const serverMessage = actions.serverMessage;

/* Відправлення повідомлень на сервер */
export const createSession = factories.messageHandlerFactory([actions.createSession]);
export const joinSession = factories.messageHandlerFactory([actions.joinSession]);
export const stopSession = factories.messageHandlerFactory([actions.stopSession]);
export const createStory = factories.messageHandlerFactory([actions.createStory]);
export const createStoryFromJira = factories.messageHandlerFactory([actions.createStoryFromJira]);
export const setTime = factories.messageHandlerFactory([set(state`time`, props`time`)]);
export const giveMark = factories.messageHandlerFactory([actions.giveMark]);
export const finishStory = factories.messageHandlerFactory([actions.finishStory]);
export const newStory = factories.messageHandlerFactory([actions.newStory]);
export const revoteStory = factories.messageHandlerFactory([actions.revoteStory]);
