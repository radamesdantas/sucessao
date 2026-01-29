const API_URL = typeof window !== 'undefined'
  ? process.env.NEXT_PUBLIC_SHEETS_API_URL || ''
  : '';

export function isSheetsEnabled(): boolean {
  return !!API_URL;
}

export async function sheetsGet(key: string): Promise<unknown | null> {
  if (!API_URL) return null;
  try {
    const res = await fetch(`${API_URL}?key=${encodeURIComponent(key)}`, {
      redirect: 'follow',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function sheetsSet(key: string, value: unknown): Promise<void> {
  if (!API_URL) return;
  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ key, value }),
      redirect: 'follow',
    });
  } catch {
    // Silent fail — localStorage is the fallback
  }
}

export async function sheetsDelete(key: string): Promise<void> {
  if (!API_URL) return;
  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'delete', key }),
      redirect: 'follow',
    });
  } catch {
    // Silent fail
  }
}
