const hasStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage);

export function safeGet(key) {
  if (!hasStorage()) {
    return null;
  }

  const rawValue = window.localStorage.getItem(key);

  if (rawValue == null || rawValue === 'undefined') {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return null;
  }
}

export function safeSet(key, value) {
  if (!hasStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // no-op
  }
}

export function safeRemove(key) {
  if (!hasStorage()) {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch {
    // no-op
  }
}
