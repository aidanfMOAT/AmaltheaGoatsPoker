import { useState, useEffect } from 'react';
import { db, ref, set, onValue } from './utils/firebase';
import { loadData, generateId } from './utils/storage';
import PlayerManager from './components/PlayerManager';
import LeagueTable from './components/LeagueTable';
import GameNightList from './components/GameNightList';
import GameNightForm from './components/GameNightForm';
import GameNightBlog from './components/GameNightBlog';
import BlogList from './components/BlogList';
import goldenGoatLogo from './assets/GoldenGoatGrey.png';
import './App.css';

const DB_REF = 'appData';

export default function App() {
  const [data, setData] = useState({ players: [], gameNights: [] });
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState('table');

  useEffect(() => {
    const dataRef = ref(db, DB_REF);
    let firstCall = true;
    const unsub = onValue(dataRef, snapshot => {
      const val = snapshot.val();
      if (val) {
        setData(JSON.parse(val));
      } else if (firstCall) {
        // Firebase is empty — migrate any existing localStorage data
        const local = loadData();
        if (local.players.length > 0 || local.gameNights.length > 0) {
          set(dataRef, JSON.stringify(local));
          setData(local);
        }
      }
      firstCall = false;
      setLoaded(true);
    });
    return () => unsub();
  }, []);

  function update(newData) {
    setData(newData);
    set(ref(db, DB_REF), JSON.stringify(newData));
  }

  function addPlayer(name, alias, logo) {
    update({ ...data, players: [...data.players, { id: generateId(), name, alias: alias || '', logo: logo || '' }] });
  }

  function removePlayer(id) {
    update({ ...data, players: data.players.filter(p => p.id !== id) });
  }

  function updatePlayerAlias(id, alias) {
    update({ ...data, players: data.players.map(p => p.id === id ? { ...p, alias } : p) });
  }

  function updatePlayerLogo(id, logo) {
    update({ ...data, players: data.players.map(p => p.id === id ? { ...p, logo } : p) });
  }

  const [editingNightId, setEditingNightId] = useState(null);
  const [blogNightId, setBlogNightId] = useState(null);
  const [blogBackView, setBlogBackView] = useState('nights');

  function saveGameNight(night) {
    update({ ...data, gameNights: [...data.gameNights, night] });
    setView('nights');
  }

  function editGameNight(updatedNight) {
    update({ ...data, gameNights: data.gameNights.map(n => n.id === updatedNight.id ? updatedNight : n) });
    setEditingNightId(null);
    setView('nights');
  }

  function startEditNight(id) {
    setEditingNightId(id);
    setView('edit-night');
  }

  function deleteGameNight(id) {
    if (!confirm('Delete this game night?')) return;
    update({ ...data, gameNights: data.gameNights.filter(n => n.id !== id) });
  }

  function viewNightBlog(nightId, fromView) {
    setBlogNightId(nightId);
    setBlogBackView(fromView);
    setView('night-blog');
  }

  function saveBlogPost(nightId, post) {
    update({ ...data, gameNights: data.gameNights.map(n => n.id === nightId ? { ...n, blogPost: post } : n) });
  }

  const blogActive = view === 'blog' || view === 'night-blog';

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <img src={goldenGoatLogo} alt="Golden Goat" className="site-logo-img" />
            <div>
              <div className="logo-title">Amalthea Trophy</div>
              <div className="logo-sub">Golden Goats Poker League</div>
            </div>
          </div>
          <nav className="nav">
            <button className={view === 'table' ? 'nav-btn active' : 'nav-btn'} onClick={() => setView('table')}>League Table</button>
            <button className={view === 'nights' ? 'nav-btn active' : 'nav-btn'} onClick={() => setView('nights')}>Game Nights</button>
            <button className={blogActive ? 'nav-btn active' : 'nav-btn'} onClick={() => setView('blog')}>Blog</button>
            <button className={view === 'players' ? 'nav-btn active' : 'nav-btn'} onClick={() => setView('players')}>Players</button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        {!loaded ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Loading…</p>
          </div>
        ) : (
          <>
            {view === 'table' && (
              <LeagueTable players={data.players} gameNights={data.gameNights} />
            )}
            {view === 'nights' && (
              <GameNightList
                gameNights={data.gameNights}
                players={data.players}
                onAdd={() => setView('new-night')}
                onDelete={deleteGameNight}
                onEdit={startEditNight}
                onViewBlog={id => viewNightBlog(id, 'nights')}
              />
            )}
            {view === 'edit-night' && editingNightId && (
              <GameNightForm
                players={data.players}
                onSave={editGameNight}
                onCancel={() => { setEditingNightId(null); setView('nights'); }}
                initialNight={data.gameNights.find(n => n.id === editingNightId)}
              />
            )}
            {view === 'players' && (
              <PlayerManager
                players={data.players}
                onAdd={addPlayer}
                onRemove={removePlayer}
                onUpdateAlias={updatePlayerAlias}
                onUpdateLogo={updatePlayerLogo}
              />
            )}
            {view === 'new-night' && (
              <GameNightForm
                players={data.players}
                onSave={saveGameNight}
                onCancel={() => setView('nights')}
              />
            )}
            {view === 'blog' && (
              <BlogList
                gameNights={data.gameNights}
                onViewPost={id => viewNightBlog(id, 'blog')}
              />
            )}
            {view === 'night-blog' && blogNightId && (
              <GameNightBlog
                night={data.gameNights.find(n => n.id === blogNightId)}
                players={data.players}
                onSave={saveBlogPost}
                onBack={() => setView(blogBackView)}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
