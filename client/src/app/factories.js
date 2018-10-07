/**
 * Factories for creating sequences
 * @module factories
 */

import { set, when, wait } from "cerebral/operators";
import { state } from 'cerebral/tags';
import { pageTransitionDelay } from './constants';

/**
 * Process transition between routes
 * @param route - text name of route to go on
 * @returns sequence
 */
export const openRoute = route => {
  return [
    // В залежності від стану додатку
    when(state`isApplicationLoaded`),
    {
      true: [
        // Відпрацювати тільки якщо перехід на інший роут
        when(state`currentPage`, currentPage => currentPage !== route),
        {
          true: [
            set(state`currentPage`, null),
            wait(pageTransitionDelay),
            set(state`currentPage`, route),
          ],
          false: [],
        },
      ],
      false: [
        set(state`initialPage`, route),
      ],
    },
  ];
};
