// Safe local storage wrapper with QuotaExceededError protection

export function safeLocalStorageSet(key: string, value: any): boolean {
  try {
    const stringified = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, stringified);
    return true;
  } catch (error) {
    console.warn(`[Storage] Failed to save key "${key}" to localStorage:`, error);
    
    // If it's a QuotaExceededError and involves items or managed assets,
    // we can attempt to store a lightweight version without massive base64 payloads
    if (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.code === 22)) {
      try {
        if (Array.isArray(value)) {
          // Strip large base64 dataUrls to preserve metadata
          const lightweight = value.map((item) => {
            if (item && typeof item === 'object') {
              const copy = { ...item };
              if (typeof copy.dataUrl === 'string' && copy.dataUrl.length > 500000) {
                copy.dataUrl = undefined; // Don't crash storage with giant video base64
              }
              if (typeof copy.imageUrl === 'string' && copy.imageUrl.length > 500000) {
                // Keep reference but strip giant data url from storage
                copy.imageUrl = undefined;
              }
              if (typeof copy.videoUrl === 'string' && copy.videoUrl.length > 500000) {
                copy.videoUrl = undefined;
              }
              return copy;
            }
            return item;
          });
          localStorage.setItem(key, JSON.stringify(lightweight));
          console.info(`[Storage] Saved lightweight metadata for "${key}" after quota warning.`);
          return true;
        }
      } catch (innerError) {
        console.warn(`[Storage] Fallback storage also failed for "${key}":`, innerError);
      }
    }
    return false;
  }
}

export function safeLocalStorageGet<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item);
  } catch (error) {
    console.warn(`[Storage] Failed to read key "${key}" from localStorage:`, error);
    return defaultValue;
  }
}
