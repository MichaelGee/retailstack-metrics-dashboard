// Helper function to trigger storage change events for same-tab localStorage updates
export const setLocalStorageItem = (key: string, value: string) => {
  window.localStorage.setItem(key, value);

  // Dispatch custom event for same-tab storage changes
  const event = new CustomEvent('localStorageChange', {
    detail: { key, newValue: value, oldValue: window.localStorage.getItem(key) },
  });
  window.dispatchEvent(event);
};

export const removeLocalStorageItem = (key: string) => {
  const oldValue = window.localStorage.getItem(key);
  window.localStorage.removeItem(key);

  // Dispatch custom event for same-tab storage changes
  const event = new CustomEvent('localStorageChange', {
    detail: { key, newValue: null, oldValue },
  });
  window.dispatchEvent(event);
};

export const getLocalStorageItem = (key: string): string | null => {
  return window.localStorage.getItem(key);
};
