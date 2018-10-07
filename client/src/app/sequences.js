import { set, when, wait } from "cerebral/operators";
// import { resetForm } from '@cerebral/forms/operators';
import { props, state } from "cerebral/tags";
import * as factories from "./factories";
import * as actions from "./actions";









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
// export const updateField = set(state`${props`path`}`, props`value`);
// export const updateName = actions.updateName;
// export const resetEditForm = resetForm(state`${props`form`}`);
//
// /* Game navigation */
// export const newGame = actions.newGame;
// export const newTurn = actions.newTurn;
// export const start = actions.start;
