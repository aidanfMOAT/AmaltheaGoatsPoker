import { useState } from 'react';

const PASSWORD = 'bcompany';

function fmtDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default function GameNightList({ gameNights, players, onAdd, onDelete, onEdit, onViewBlog }) {
  const playerMap = Object.fromEntries(players.map(p => [p.id, p.name]));
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [pwInput, setPwInput] = useState('');
  const [pwError, setPwError] = useState(false);

  function attemptUnlock(e) {
    e.preventDefault();
    if (pwInput === PASSWORD) {
      setIsUnlocked(true);
      setShowPrompt(false);
      setPwInput('');
      setPwError(false);
    } else {
      setPwError(true);
      setPwInput('');
    }
  }

  return (
    <div>
      <div className="list-header">
        <h2>Game Nights</h2>
        <div className="list-header-actions">
          {isUnlocked ? (
            <button className="btn-ghost lock-btn" onClick={() => setIsUnlocked(false)}>🔓 Lock</button>
          ) : (
            <button className="btn-ghost lock-btn" onClick={() => { setShowPrompt(true); setPwError(false); }}>🔒 Unlock Editing</button>
          )}
          <button className="btn-primary" onClick={onAdd}>+ New Game Night</button>
        </div>
      </div>

      {showPrompt && (
        <div className="pw-overlay" onClick={() => setShowPrompt(false)}>
          <div className="pw-modal" onClick={e => e.stopPropagation()}>
            <h3>Enter password to edit</h3>
            <form onSubmit={attemptUnlock}>
              <input
                type="password"
                value={pwInput}
                onChange={e => { setPwInput(e.target.value); setPwError(false); }}
                placeholder="Password"
                autoFocus
                className={pwError ? 'pw-input pw-input-error' : 'pw-input'}
              />
              {pwError && <p className="pw-error">Incorrect password</p>}
              <div className="pw-actions">
                <button type="submit" className="btn-primary">Unlock</button>
                <button type="button" className="btn-ghost" onClick={() => setShowPrompt(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {gameNights.length === 0 && (
        <div className="card">
          <p className="empty-msg">No game nights recorded yet.</p>
        </div>
      )}

      {[...gameNights].sort((a, b) => b.date.localeCompare(a.date)).map(night => (
        <div key={night.id} className="card night-card">
          <div className="night-header">
            <h3>{fmtDate(night.date)}</h3>
            <div className="night-actions">
              {night.blogPost && (
                <span className="blog-indicator" title="Has report">📝</span>
              )}
              <button
                className={night.blogPost ? 'btn-report-sm has-post' : 'btn-report-sm'}
                onClick={() => onViewBlog(night.id)}
              >
                {night.blogPost ? 'Read Report' : 'Write Report'}
              </button>
              {isUnlocked && (
                <>
                  <button className="btn-ghost btn-edit-sm" onClick={() => onEdit(night.id)}>Edit</button>
                  <button className="btn-danger-sm" onClick={() => onDelete(night.id)}>Delete</button>
                </>
              )}
            </div>
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
