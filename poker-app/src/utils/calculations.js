export function calcLeagueTable(players, gameNights) {
  const stats = {};

  for (const p of players) {
    stats[p.id] = {
      id: p.id,
      name: p.name,
      totalWon: 0,
      totalIn: 0,
      gamesPlayed: 0,
      nightsPlayed: 0,
      wins: 0,
    };
  }

  for (const night of gameNights) {
    const nightPlayers = new Set();

    for (const game of night.games) {
      for (const part of game.participants) {
        if (!stats[part.playerId]) continue;
        const s = stats[part.playerId];
        s.gamesPlayed += 1;
        s.totalIn += game.buyIn;
        nightPlayers.add(part.playerId);

        if (part.position !== null && part.position !== undefined) {
          const prize = game.prizes[part.position] ?? 0;
          s.totalWon += prize;
          if (part.position === 1) s.wins += 1;
        }
      }
    }

    for (const pid of nightPlayers) {
      if (stats[pid]) stats[pid].nightsPlayed += 1;
    }
  }

  return Object.values(stats)
    .filter(s => s.gamesPlayed > 0)
    .sort((a, b) => b.totalWon - a.totalWon)
    .map((s, i) => ({
      ...s,
      position: i + 1,
      net: s.totalWon - s.totalIn,
      ratio: s.totalIn > 0 ? s.totalWon / s.totalIn : 0,
    }));
}
