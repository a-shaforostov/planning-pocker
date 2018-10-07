import { Module } from "cerebral";
import * as sequences from "./sequences";

import router from './router';

export default Module({
  state: {

  },
  signals: {
    rootRouted: sequences.rootRouted, // Головна сторінка, створення гри
    playerRouted: sequences.gameRouted, // Підключення гравців
  },
  modules: {
    router,
  },
});
