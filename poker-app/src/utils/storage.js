const STORAGE_KEY = 'amalthea_poker';

const defaultState = {
  players: [],
  gameNights: [],
};

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultState;
  } catch {
    return defaultState;
  }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
