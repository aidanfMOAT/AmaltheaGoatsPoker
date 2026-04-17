import { useState } from 'react';
import { loadData, saveData, generateId } from './utils/storage';
import PlayerManager from './components/PlayerManager';
import LeagueTable from './components/LeagueTable';
import GameNightList from './components/GameNightList';
import GameNightForm from './components/GameNightForm';
import GoatLogo from './components/GoatLogo';
import './App.css';

export default function App() {
  const [data, setData] = useState(() => loadData());
  const [view, setView] = useState('table');

  function update(newData) {
    setData(newData);
    saveData(newData);
  }

  function addPlayer(name, alias) {
    update({ ...data, players: [...data.players, { id: generateId(), name, alias: alias || '' }] });
  }

  function removePlayer(id) {
    update({ ...data, players: data.players.filter(p => p.id !== id) });
  }

  function updatePlayerAlias(id, alias) {
    update({ ...data, players: data.players.map(p => p.id === id ? { ...p, alias } : p) });
  }

  function saveGameNight(night) {
    update({ ...data, gameNights: [...data.gameNights, night] });
    setView('nights');
  }

  function deleteGameNight(id) {
    if (!confirm('Delete this game night?')) return;
    update({ ...data, gameNights: data.gameNights.filter(n => n.id !== id) });
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <GoatLogo size={44} />
            <div>
              <div className="logo-title">Amalthea Trophy</div>
              <div className="logo-sub">Golden Goats Poker League</div>
            </div>
          </div>
          <nav className="nav">
            <button className={view === 'table' ? 'nav-btn active' : 'nav-btn'} onClick={() => setView('table')}>League Table</button>
            <button className={view === 'nights' ? 'nav-btn active' : 'nav-btn'} onClick={() => setView('nights')}>Game Nights</button>
            <button className={view === 'players' ? 'nav-btn active' : 'nav-btn'} onClick={() => setView('players')}>Players</button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        {view === 'table' && (
          <LeagueTable players={data.players} gameNights={data.gameNights} />
        )}
        {view === 'nights' && (
          <GameNightList
            gameNights={data.gameNights}
            players={data.players}
            onAdd={() => setView('new-night')}
            onDelete={deleteGameNight}
          />
        )}
        {view === 'players' && (
          <PlayerManager
            players={data.players}
            onAdd={addPlayer}
            onRemove={removePlayer}
            onUpdateAlias={updatePlayerAlias}
          />
        )}
        {view === 'new-night' && (
          <GameNightForm
            players={data.players}
            onSave={saveGameNight}
            onCancel={() => setView('nights')}
          />
        )}
      </main>
    </div>
  );
}
