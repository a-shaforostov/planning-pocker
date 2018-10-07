/**
 * Routes of application
 * @module Router
 */

import Router from '@cerebral/router';

export default Router({
  routes: [
    {
      path: '/',
      signal: 'rootRouted',
    },
    {
      path: '/:id',
      signal: 'playerRouted',
    },
  ],
});
