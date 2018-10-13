function getPlayers(session) {
  // Зібрати всі заміри часу та оцінки по гравцям
  const players = {};
  if (!session) return players;

  session.stories.forEach((story) => {
    story.players.forEach(player => {
      const playerStart = story.start;
      const playerFinish = player.time;
      const time = playerFinish - playerStart;
      const mark = player.mark;
      players[player.login]
        ? players[player.login].push({ time, mark })
        : players[player.login] = [{ time, mark }];
    })
  });
  return players;
}

function getAvgTimes(players) {
  if (!players) return {};

  const playersTime = Object.entries(players).reduce((times, [login, player]) => ({
    ...times,
    [login]: Math.round(player.reduce((sum, player) => sum + player.time, 0) / player.length),
  }), {});

  return playersTime;
}

// Найбільша різниця в оцінках
function mostDifferent(players) {
  if (!players) return {};

  const playersMarks = {};
  Object.entries(players).forEach(([login, player]) => {
    if (player.mark === '?') return;

    // Знайти мінімальну та максимальну оцінку гравця
    const ext = player.reduce((ext, player) => ({
      min: !ext.min || player.mark < ext.min ? player.mark : ext.min,
      max: !ext.max || player.mark > ext.max ? player.mark : ext.max,
    }), {});

    // Знайти різницю екстремумів
    playersMarks[login] = ext.max - ext.min;
  });

  // Максимальне значення
  const max = Object.entries(playersMarks).reduce((max, [login, mark]) => mark > max ? mark : max, 0);

  // Список гравців з максимальною різницею
  const logins = Object.entries(playersMarks).reduce((arr, [login, mark]) => mark === max ? [ ...arr, login ] : arr, []);
  return {
    logins,
    max,
  }
}

// Топ 3 історії з найрізноманітнішими оцінками
function varStories(session) {
  if (!session || !session.stories) return [];

  // Для кожної історії побудувати список унікальних оцінок
  const uniqueMarks = session.stories.map(story => {

    // Відібрати унікальні оцінки для кожної історії
    const unique = story.players
      .reduce((obj, player) => ({ ...obj, [player.mark]: true }), {});

    return {
      story,
      unique: Object.keys(unique).length,
    };
  });

  // Відсотрувати історії та повернути перші 3
  return uniqueMarks
    .sort((a, b) => b.unique - a.unique)
    .slice(0, 3);
}

module.exports = {
  getPlayers,
  getAvgTimes,
  mostDifferent,
  varStories,
};
