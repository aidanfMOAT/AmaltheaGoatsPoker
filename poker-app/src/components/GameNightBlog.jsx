import { useState } from 'react';

const PASSWORD = 'bcompany';

function fmtDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default function GameNightBlog({ night, players, onSave, onBack }) {
  const playerMap = Object.fromEntries(players.map(p => [p.id, p.name]));
  const post = night.blogPost || null;

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [pwInput, setPwInput] = useState('');
  const [pwError, setPwError] = useState(false);

  function requestEdit() {
    setTitle(post?.title || '');
    setBody(post?.body || '');
    setShowPrompt(true);
    setPwError(false);
    setPwInput('');
  }

  function attemptUnlock(e) {
    e.preventDefault();
    if (pwInput === PASSWORD) {
      setShowPrompt(false);
      setPwInput('');
      setPwError(false);
      setIsEditing(true);
    } else {
      setPwError(true);
      setPwInput('');
    }
  }

  function handleSave() {
    onSave(night.id, {
      title: title.trim() || fmtDate(night.date),
      body,
      updatedAt: new Date().toISOString(),
    });
    setIsEditing(false);
  }

  function cancelEdit() {
    setIsEditing(false);
  }

  return (
    <div>
      <div className="list-header">
        <button className="btn-ghost back-btn" onClick={onBack}>← Back</button>
        {!isEditing && (
          <button className="btn-ghost lock-btn" onClick={requestEdit}>
            {post ? 'Edit Report' : '+ Write Report'}
          </button>
        )}
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

      <div className="card night-card">
        <h2 className="blog-night-date">{fmtDate(night.date)}</h2>
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

      {isEditing ? (
        <div className="card blog-editor-card">
          <h3 className="blog-editor-heading">{post ? 'Edit Report' : 'Write Report'}</h3>
          <div className="blog-field">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={fmtDate(night.date)}
              className="blog-title-input"
            />
          </div>
          <div className="blog-field">
            <label>Report</label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Write about how the night went..."
              className="blog-textarea"
              rows={12}
            />
          </div>
          <div className="form-actions">
            <button className="btn-primary" onClick={handleSave} disabled={!body.trim()}>
              Save Report
            </button>
            <button className="btn-ghost" onClick={cancelEdit}>Cancel</button>
          </div>
        </div>
      ) : post ? (
        <div className="card blog-post-card">
          <h2 className="blog-post-title">{post.title}</h2>
          {post.updatedAt && (
            <p className="blog-post-meta">
              Written {new Date(post.updatedAt).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </p>
          )}
          <div className="blog-post-body">{post.body}</div>
        </div>
      ) : (
        <div className="card">
          <p className="empty-msg">No report written yet. Click &ldquo;Write Report&rdquo; to add one.</p>
        </div>
      )}
    </div>
  );
}
