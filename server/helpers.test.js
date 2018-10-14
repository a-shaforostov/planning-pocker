const { getPlayers, getAvgTimes, mostDifferent, varStories } = require('./helpers');

const sessionObj = {
  stories: [
    {
      start: new Date(2018, 10, 13, 10, 19, 0, 0).getTime(),
      players: [
        { login: 'login1', time: new Date(2018, 10, 13, 10, 20, 10, 0).getTime(), mark: 5 },
        { login: 'login2', time: new Date(2018, 10, 13, 10, 20, 15, 0).getTime(), mark: 3 },
        { login: 'login3', time: new Date(2018, 10, 13, 10, 20, 20, 0).getTime(), mark: 2 },
      ],
    },
    {
      start: new Date(2018, 10, 13, 10, 25, 0, 0).getTime(),
      players: [
        { login: 'login1', time: new Date(2018, 10, 13, 10, 25, 10, 0).getTime(), mark: 1 },
        { login: 'login3', time: new Date(2018, 10, 13, 10, 26, 20, 0).getTime(), mark: 3 },
      ],
    },
    {
      start: new Date(2018, 10, 13, 10, 30, 0, 0).getTime(),
      players: [
        { login: 'login1', time: new Date(2018, 10, 13, 10, 30, 12, 0).getTime(), mark: 5 },
        { login: 'login2', time: new Date(2018, 10, 13, 10, 30, 45, 0).getTime(), mark: 3 },
        { login: 'login3', time: new Date(2018, 10, 13, 10, 30, 40, 0).getTime(), mark: 8 },
      ],
    },
  ],
};

describe('getPlayers', () => {
  test('empty param', () => {
    expect(getPlayers()).toMatchObject({});
  });

  test('session', () => {
    expect(getPlayers(sessionObj)).toMatchObject({
      login1: [{ time: 70000, mark: 5 }, { time: 10000, mark: 1 }, { time: 12000, mark: 5 }],
      login2: [{ time: 75000, mark: 3 }, { time: 45000, mark: 3 }],
      login3: [{ time: 80000, mark: 2 }, { time: 80000, mark: 3 }, { time: 40000, mark: 8 }],
    });
  });
});

describe('getAvgTimes', () => {
  test('empty param', () => {
    expect(getAvgTimes()).toMatchObject({});
  });

  test('session', () => {
    const players = {
      login1: [{ time: 70000, mark: 5 }, { time: 10000, mark: 1 }, { time: 12000, mark: 5 }],
      login2: [{ time: 75000, mark: 3 }, { time: 45000, mark: 3 }],
      login3: [{ time: 80000, mark: '?' }, { time: 80000, mark: 3 }, { time: 40000, mark: 8 }],
    };

    expect(getAvgTimes(players)).toMatchObject({
      login1: 30667,
      login2: 60000,
      login3: 66667,
    });
  });
});

describe('mostDifferent', () => {
  test('empty param', () => {
    expect(mostDifferent()).toMatchObject({});
  });

  test('session1', () => {
    const players = {
      login1: [{ time: 70000, mark: 5 }, { time: 10000, mark: 1 }, { time: 12000, mark: 5 }],
      login2: [{ time: 75000, mark: 3 }, { time: 45000, mark: 3 }],
      login3: [{ time: 80000, mark: 2 }, { time: 80000, mark: '?' }, { time: 40000, mark: 8 }],
      login4: [{ time: 80000, mark: 2 }, { time: 80000, mark: 3 }, { time: 40000, mark: 8 }],
    };

    expect(mostDifferent(players)).toMatchObject({
      logins: ['login3', 'login4'],
      max: 6,
    });
  });

  test('session1', () => {
    const players = {
      login1: [{ time: 70000, mark: 5 }, { time: 10000, mark: 1 }, { time: 12000, mark: 15 }],
      login2: [{ time: 75000, mark: 3 }, { time: 45000, mark: 3 }],
      login3: [{ time: 80000, mark: 2 }, { time: 80000, mark: 3 }, { time: 40000, mark: 8 }],
      login4: [{ time: 80000, mark: 2 }, { time: 80000, mark: 3 }, { time: 40000, mark: 8 }],
    };

    expect(mostDifferent(players)).toMatchObject({
      logins: ['login1'],
      max: 14,
    });
  });
});

describe('varStories', () => {
  test('empty param', () => {
    expect(varStories()).toHaveLength(0);
  });

  test('session1', () => {
    const session = {
      stories: [
        ...sessionObj.stories,
        {
          start: new Date(2018, 10, 13, 10, 30, 0, 0).getTime(),
          players: [
            { login: 'login1', time: new Date(2018, 10, 13, 10, 30, 12, 0).getTime(), mark: 5 },
            { login: 'login2', time: new Date(2018, 10, 13, 10, 30, 45, 0).getTime(), mark: 3 },
            { login: 'login3', time: new Date(2018, 10, 13, 10, 30, 40, 0).getTime(), mark: 8 },
            { login: 'login4', time: new Date(2018, 10, 13, 10, 30, 40, 0).getTime(), mark: 8 },
            { login: 'login5', time: new Date(2018, 10, 13, 10, 30, 40, 0).getTime(), mark: 1 },
            { login: 'login6', time: new Date(2018, 10, 13, 10, 30, 40, 0).getTime(), mark: '?' },
          ],
        },
      ]
    };

    expect(varStories(session)).toMatchObject([
      {
        story: session.stories[3],
        unique: 5,
      },
      {
        story: session.stories[0],
        unique: 3,
      },
      {
        story: session.stories[2],
        unique: 3,
      }
    ]);
  });
});
