import { useState } from 'react';

export default function PlayerManager({ players, onAdd, onRemove, onUpdateAlias }) {
  const [name, setName] = useState('');
  const [alias, setAlias] = useState('');

  function handleAdd(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    if (players.some(p => p.name.toLowerCase() === trimmed.toLowerCase())) return;
    onAdd(trimmed, alias.trim());
    setName('');
    setAlias('');
  }

  return (
    <div className="card">
      <h2>Players</h2>
      <form className="add-player-form" onSubmit={handleAdd}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Full name"
        />
        <input
          value={alias}
          onChange={e => setAlias(e.target.value)}
          placeholder="Nickname / alias (optional)"
          className="alias-input"
        />
        <button type="submit" className="btn-primary">Add Player</button>
      </form>
      {players.length === 0 && <p className="empty-msg">No players yet. Add some above.</p>}
      <ul className="player-list">
        {players.map(p => (
          <li key={p.id}>
            <div className="player-list-info">
              <span className="player-list-name">{p.name}</span>
              <input
                className="alias-edit-input"
                defaultValue={p.alias || ''}
                placeholder="Add alias..."
                onBlur={e => onUpdateAlias(p.id, e.target.value.trim())}
              />
            </div>
            <button className="btn-danger-sm" onClick={() => onRemove(p.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
