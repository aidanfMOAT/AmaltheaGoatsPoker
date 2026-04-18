import { useState, useRef } from 'react';

function readFileAsDataURL(file, maxPx = 300) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = e => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(maxPx / img.width, maxPx / img.height, 1);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.92));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function PlayerManager({ players, onAdd, onRemove, onUpdateAlias, onUpdateLogo }) {
  const [name, setName] = useState('');
  const [alias, setAlias] = useState('');
  const [pendingLogo, setPendingLogo] = useState('');
  const addLogoRef = useRef(null);

  async function handleLogoFile(file, callback) {
    if (!file) return;
    const dataUrl = await readFileAsDataURL(file);
    callback(dataUrl);
  }

  function handleAdd(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    if (players.some(p => p.name.toLowerCase() === trimmed.toLowerCase())) return;
    onAdd(trimmed, alias.trim(), pendingLogo);
    setName('');
    setAlias('');
    setPendingLogo('');
    if (addLogoRef.current) addLogoRef.current.value = '';
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
        <label className="logo-upload-btn" title="Add logo">
          {pendingLogo
            ? <img src={pendingLogo} alt="logo preview" className="logo-upload-preview" />
            : <span className="logo-upload-placeholder">+ Logo</span>}
          <input
            ref={addLogoRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => handleLogoFile(e.target.files[0], setPendingLogo)}
          />
        </label>
        <button type="submit" className="btn-primary">Add Player</button>
      </form>
      {players.length === 0 && <p className="empty-msg">No players yet. Add some above.</p>}
      <ul className="player-list">
        {players.map(p => (
          <li key={p.id}>
            <label className="player-logo-slot" title="Click to change logo">
              {p.logo
                ? <img src={p.logo} alt="logo" className="player-logo-thumb" />
                : <span className="player-logo-empty">?</span>}
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => handleLogoFile(e.target.files[0], dataUrl => onUpdateLogo(p.id, dataUrl))}
              />
            </label>
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
