import { useState } from 'react';

export default function PlayerManager({ players, onAdd, onRemove }) {
  const [name, setName] = useState('');

  function handleAdd(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    if (players.some(p => p.name.toLowerCase() === trimmed.toLowerCase())) return;
    onAdd(trimmed);
    setName('');
  }

  return (
    <div className="card">
      <h2>Players</h2>
      <form className="inline-form" onSubmit={handleAdd}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Player name"
        />
        <button type="submit" className="btn-primary">Add Player</button>
      </form>
      {players.length === 0 && <p className="empty-msg">No players yet. Add some above.</p>}
      <ul className="player-list">
        {players.map(p => (
          <li key={p.id}>
            <span>{p.name}</span>
            <button className="btn-danger-sm" onClick={() => onRemove(p.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
