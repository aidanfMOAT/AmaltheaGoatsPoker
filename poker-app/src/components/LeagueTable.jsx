import { useState } from 'react';
import { calcLeagueTable } from '../utils/calculations';
import GoatLogo from './GoatLogo';

const ordinal = n => ['', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th',
  '11th', '12th', '13th', '14th', '15th', '16th'][n] || `${n}th`;

function fmt(n) {
  return n < 0 ? `-£${Math.abs(n)}` : `£${n}`;
}

function PlayerCell({ name, alias, logo, onLogoClick }) {
  return (
    <td className="player-cell">
      {logo && (
        <img
          src={logo}
          alt=""
          className="table-player-logo table-player-logo-clickable"
          onClick={() => onLogoClick({ src: logo, name })}
        />
      )}
      {alias && <span className="alias-badge">{alias}</span>}
      {name}
    </td>
  );
}

const MEDALS = { 0: 'medal-gold', 1: 'medal-silver', 2: 'medal-bronze' };

export default function LeagueTable({ players, gameNights }) {
  const [lightbox, setLightbox] = useState(null);
  const rows = calcLeagueTable(players, gameNights);

  const totalPrizeTable = [...rows].sort((a, b) => b.totalWon - a.totalWon);
  const hustlerTable = [...rows].sort((a, b) => b.net - a.net);
  const ratioTable = [...rows].filter(r => r.totalIn > 0).sort((a, b) => b.ratio - a.ratio);

  if (rows.length === 0) {
    return (
      <div className="card league-empty">
        <div className="league-empty-logo">
          <GoatLogo size={80} opacity={0.25} />
        </div>
        <h2>League Table</h2>
        <p className="empty-msg">No results recorded yet. Add a game night to get started.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <h2>Amalthea Trophy — Prize Money Standings</h2>
        <table>
          <thead>
            <tr>
              <th>Pos</th>
              <th>Player</th>
              <th>Winnings</th>
              <th>Nights</th>
              <th>Games</th>
              <th>Wins</th>
            </tr>
          </thead>
          <tbody>
            {totalPrizeTable.map((r, i) => (
              <tr key={r.id} className={i < 3 ? `row-top row-${['gold','silver','bronze'][i]}` : ''}>
                <td>
                  <span className={i < 3 ? `pos-medal ${MEDALS[i]}` : 'pos-plain'}>
                    {ordinal(i + 1)}
                  </span>
                </td>
                <PlayerCell name={r.name} alias={r.alias} logo={r.logo} onLogoClick={setLightbox} />
                <td><strong className="winnings">£{r.totalWon}</strong></td>
                <td>{r.nightsPlayed}</td>
                <td>{r.gamesPlayed}</td>
                <td>{r.wins}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>Hustler or Hustled — Net Profit / Loss</h2>
        <table>
          <thead>
            <tr>
              <th>Pos</th>
              <th>Player</th>
              <th>Money In</th>
              <th>Money Out</th>
              <th>Net</th>
            </tr>
          </thead>
          <tbody>
            {hustlerTable.map((r, i) => (
              <tr key={r.id} className={r.net > 0 ? 'row-profit' : r.net < 0 ? 'row-loss' : ''}>
                <td><span className="pos-plain">{ordinal(i + 1)}</span></td>
                <PlayerCell name={r.name} alias={r.alias} logo={r.logo} onLogoClick={setLightbox} />
                <td>£{r.totalIn}</td>
                <td>£{r.totalWon}</td>
                <td><strong>{fmt(r.net)}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>Pro Rata Splata — Return on Buy-in</h2>
        <table>
          <thead>
            <tr>
              <th>Pos</th>
              <th>Player</th>
              <th>Money In</th>
              <th>Money Out</th>
              <th>Ratio</th>
            </tr>
          </thead>
          <tbody>
            {ratioTable.map((r, i) => (
              <tr key={r.id} className={r.ratio > 1 ? 'row-profit' : r.ratio < 1 ? 'row-loss' : ''}>
                <td><span className="pos-plain">{ordinal(i + 1)}</span></td>
                <PlayerCell name={r.name} alias={r.alias} logo={r.logo} onLogoClick={setLightbox} />
                <td>£{r.totalIn}</td>
                <td>£{r.totalWon}</td>
                <td><strong>{r.ratio.toFixed(2)}x</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {lightbox && (
        <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
          <div className="lightbox-inner" onClick={e => e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.name} className="lightbox-img" />
            <p className="lightbox-name">{lightbox.name}</p>
          </div>
        </div>
      )}
    </div>
  );
}
