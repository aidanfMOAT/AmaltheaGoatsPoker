function fmtDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default function GameNightList({ gameNights, players, onAdd, onDelete }) {
  const playerMap = Object.fromEntries(players.map(p => [p.id, p.name]));

  return (
    <div>
      <div className="list-header">
        <h2>Game Nights</h2>
        <button className="btn-primary" onClick={onAdd}>+ New Game Night</button>
      </div>

      {gameNights.length === 0 && (
        <div className="card">
          <p className="empty-msg">No game nights recorded yet.</p>
        </div>
      )}

      {[...gameNights].sort((a, b) => b.date.localeCompare(a.date)).map(night => (
        <div key={night.id} className="card night-card">
          <div className="night-header">
            <h3>{fmtDate(night.date)}</h3>
            <button className="btn-danger-sm" onClick={() => onDelete(night.id)}>Delete</button>
          </div>
          {night.games.map(game => {
            const winners = game.participants
              .filter(p => p.position)
              .sort((a, b) => a.position - b.position);
            const pos = { 1: '1st', 2: '2nd', 3: '3rd' };
            return (
              <div key={game.id} className="game-summary">
                <strong>{game.name}</strong>
                <span className="muted">— {game.participants.length} players · £{game.buyIn} buy-in</span>
                {winners.length > 0 && (
                  <ul className="winners-list">
                    {winners.map(w => (
                      <li key={w.playerId}>
                        {pos[w.position]} — {playerMap[w.playerId] ?? 'Unknown'} (£{game.prizes[w.position]})
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
