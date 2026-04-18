import { useState } from 'react';
import { generateId } from '../utils/storage';

function defaultGame(index) {
  return {
    id: generateId(),
    name: `Game ${index + 1}`,
    buyIn: 10,
    prizes: { 1: '', 2: '', 3: '' },
    participants: [],
  };
}

export default function GameNightForm({ players, onSave, onCancel, initialNight }) {
  const [date, setDate] = useState(initialNight ? initialNight.date : new Date().toISOString().slice(0, 10));
  const [games, setGames] = useState(initialNight ? initialNight.games.map(g => ({
    ...g,
    prizes: { 1: g.prizes[1] ?? '', 2: g.prizes[2] ?? '', 3: g.prizes[3] ?? '' },
  })) : [defaultGame(0)]);

  function addGame() {
    setGames(g => [...g, defaultGame(g.length)]);
  }

  function removeGame(idx) {
    setGames(g => g.filter((_, i) => i !== idx));
  }

  function updateGame(idx, field, value) {
    setGames(g => g.map((game, i) => i === idx ? { ...game, [field]: value } : game));
  }

  function updatePrize(idx, position, value) {
    setGames(g => g.map((game, i) =>
      i === idx ? { ...game, prizes: { ...game.prizes, [position]: value } } : game
    ));
  }

  function togglePlayer(gameIdx, playerId) {
    setGames(g => g.map((game, i) => {
      if (i !== gameIdx) return game;
      const exists = game.participants.find(p => p.playerId === playerId);
      if (exists) {
        return { ...game, participants: game.participants.filter(p => p.playerId !== playerId) };
      }
      return { ...game, participants: [...game.participants, { playerId, position: null }] };
    }));
  }

  function setPosition(gameIdx, playerId, position) {
    setGames(g => g.map((game, i) => {
      if (i !== gameIdx) return game;
      return {
        ...game,
        participants: game.participants.map(p =>
          p.playerId === playerId ? { ...p, position } : p
        ),
      };
    }));
  }

  function handleSave() {
    const cleanGames = games
      .filter(g => g.participants.length > 0)
      .map(g => ({
        ...g,
        buyIn: Number(g.buyIn) || 10,
        prizes: {
          1: Number(g.prizes[1]) || 0,
          2: Number(g.prizes[2]) || 0,
          3: Number(g.prizes[3]) || 0,
        },
      }));

    if (!date || cleanGames.length === 0) {
      alert('Please set a date and add at least one game with players.');
      return;
    }

    onSave({ id: initialNight ? initialNight.id : generateId(), date, games: cleanGames });
  }

  const positionLabel = { 1: '1st', 2: '2nd', 3: '3rd' };

  return (
    <div className="card">
      <h2>{initialNight ? 'Edit Game Night' : 'New Game Night'}</h2>
      <div className="field-row">
        <label>Date</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </div>

      {games.map((game, gi) => {
        const activePlayers = players.filter(p => game.participants.some(part => part.playerId === p.id));
        const prizePositions = [1, 2, 3].filter(pos => Number(game.prizes[pos]) > 0);

        return (
          <div key={game.id} className="game-block">
            <div className="game-block-header">
              <input
                className="game-name-input"
                value={game.name}
                onChange={e => updateGame(gi, 'name', e.target.value)}
              />
              <button className="btn-danger-sm" onClick={() => removeGame(gi)}>Remove</button>
            </div>

            <div className="prize-row">
              <label>Buy-in £</label>
              <input
                type="number"
                min="0"
                value={game.buyIn}
                onChange={e => updateGame(gi, 'buyIn', e.target.value)}
                className="small-num"
              />
              <label>1st £</label>
              <input
                type="number"
                min="0"
                value={game.prizes[1]}
                onChange={e => updatePrize(gi, 1, e.target.value)}
                className="small-num"
              />
              <label>2nd £</label>
              <input
                type="number"
                min="0"
                value={game.prizes[2]}
                onChange={e => updatePrize(gi, 2, e.target.value)}
                className="small-num"
              />
              <label>3rd £</label>
              <input
                type="number"
                min="0"
                value={game.prizes[3]}
                onChange={e => updatePrize(gi, 3, e.target.value)}
                className="small-num"
              />
            </div>

            <div className="player-grid">
              {players.map(p => {
                const part = game.participants.find(x => x.playerId === p.id);
                const playing = !!part;
                return (
                  <div key={p.id} className={`player-card ${playing ? 'playing' : ''}`}>
                    <label className="player-toggle">
                      <input
                        type="checkbox"
                        checked={playing}
                        onChange={() => togglePlayer(gi, p.id)}
                      />
                      {p.name}
                    </label>
                    {playing && prizePositions.length > 0 && (
                      <select
                        value={part.position ?? ''}
                        onChange={e => setPosition(gi, p.id, e.target.value ? Number(e.target.value) : null)}
                      >
                        <option value="">No prize</option>
                        {prizePositions.map(pos => (
                          <option key={pos} value={pos}>{positionLabel[pos]} £{game.prizes[pos]}</option>
                        ))}
                      </select>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <button className="btn-secondary" onClick={addGame}>+ Add Another Game</button>

      <div className="form-actions">
        <button className="btn-primary" onClick={handleSave}>Save Game Night</button>
        <button className="btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
