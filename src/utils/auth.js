import { api } from '../server';

const API_URL = `${api}/v1/api/user`;

/** Returns true if the session cookie is valid (refreshes access token if needed). */
export async function checkSession() {
  try {
    let res = await fetch(`${API_URL}/get-user`, {
      method: 'GET',
      credentials: 'include',
    });

    if (res.ok) return true;

    if (res.status !== 401) return false;

    const refreshRes = await fetch(`${API_URL}/refresh-token`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!refreshRes.ok) return false;

    res = await fetch(`${API_URL}/get-user`, {
      method: 'GET',
      credentials: 'include',
    });

    return res.ok;
  } catch {
    return false;
  }
}
