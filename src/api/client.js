const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const url = path.startsWith('http') ? path : `${BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const text = await res.text();
  if (!res.ok) {
    let body;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = { message: text };
    }
    const err = new Error(body?.error?.message || body?.message || res.statusText);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return text ? JSON.parse(text) : null;
}

export function get(path) {
  return request(path, { method: 'GET' });
}

export function post(path, body) {
  return request(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined });
}

export function put(path, body) {
  return request(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined });
}

export function del(path) {
  return request(path, { method: 'DELETE' });
}

export { BASE_URL };
