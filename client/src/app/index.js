import page from 'page';
import * as sequences from "./sequences";

export default ({ app }) => {
  app.on('initialized', () => page.start());

  // We create a route factory which takes the route url and
  // the sequences that should run when it triggers. It does two things
  //
  //  1. It register the route to page.js which runs the sequence using the
  //     path as the name of the execution, the sequence and passes in any
  //     params
  //
  //  2. It returns an action that you can run from your views, mapping
  //     the "props.params" passed in into the related url. Then triggers
  //     the url
  function route(url, sequence) {
    page(url, ({ path, params }) => app.runSequence(path, sequence, { params }));

    return ({ props }) => {
      const urlWithReplacedParams = Object.keys(props.params || {}).reduce((currentUrl, param) => {
        return currentUrl.replace(`:${param}`, props.params[param])
      }, url);

      page.show(urlWithReplacedParams)
    }
  }

  return {
    state: {
      data: {
        login: '',
        isObserver: false,
        sessionId: null,
        token: null,
        isConnected: false,
        auth: false,
        issueedit: '',
        storyedit: '',
        marks: {
          items: [0, 1, 2, 3, 5, 8, '?'],
          editor: '',
        },
        jira: {},
        playground: null,
        statsVisible: false,
      },
    },
    signals: {
      rootRouted: route('/', sequences.rootRouted), // Головна сторінка, створення гри
      playerRouted: route('/:id', sequences.playerRouted), // Підключення гравців

      createSession: sequences.createSession,
      joinSession: sequences.joinSession,
      stopSession: sequences.stopSession,
      updateField: sequences.updateField,
      serverMessage: sequences.serverMessage,
      updateIsConnected: sequences.updateIsConnected,
      updateMark: sequences.updateMark,
      addMark: sequences.addMark,
      removeMark: sequences.removeMark,
      createStory: sequences.createStory,
      createStoryFromJira: sequences.createStoryFromJira,
      setTime: sequences.setTime,
      giveMark: sequences.giveMark,
      finishStory: sequences.finishStory,
      newStory: sequences.newStory,
      revoteStory: sequences.revoteStory,
      switchStory: sequences.switchStory,
      downloadFile: sequences.downloadFile,
      loadFile: sequences.loadFile,
      showStats: sequences.showStats,
    },
  }
};
