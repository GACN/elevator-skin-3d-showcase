const ORIGIN = 'https://gacn.github.io';
const KEY_HASH = '7743fb0a3417a81c81aad5dcb007df2bca867482ab74a48abc37d654ddbeb856';
const WORKSPACE = 'main';

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin === ORIGIN ? ORIGIN : ORIGIN,
    'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Cloud-Key',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

function response(body, status, request) {
  const headers = new Headers(corsHeaders(request.headers.get('Origin')));
  headers.set('Content-Type', 'application/json; charset=utf-8');
  return new Response(JSON.stringify(body), { status, headers });
}

async function sha256Hex(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function authorized(request) {
  const supplied = request.headers.get('X-Cloud-Key') || '';
  if (!supplied || supplied.length > 256) return false;
  return constantTimeEqual(await sha256Hex(supplied), KEY_HASH);
}

async function readDesigns(env) {
  try {
    const rows = await env.DB.prepare(
      'SELECT payload, updated_at FROM design_items WHERE workspace = ?1 ORDER BY rowid'
    ).bind(WORKSPACE).all();
    if (rows && Array.isArray(rows.results) && rows.results.length) {
      const designs = rows.results.map(row => JSON.parse(row.payload));
      return { designs, updatedAt: rows.results[rows.results.length - 1].updated_at };
    }
  } catch {
    // First deployment or legacy database without design_items: fall back below.
  }
  const row = await env.DB.prepare(
    'SELECT payload, updated_at FROM design_store WHERE workspace = ?1'
  ).bind(WORKSPACE).first();
  if (!row) return { designs: [], updatedAt: null };
  try {
    const designs = JSON.parse(row.payload);
    return { designs: Array.isArray(designs) ? designs : [], updatedAt: row.updated_at };
  } catch {
    return { designs: [], updatedAt: row.updated_at };
  }
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(request.headers.get('Origin')) });
    }

    const url = new URL(request.url);
    if (url.pathname === '/health' && request.method === 'GET') {
      return response({ ok: true, service: 'elevator-skin-cloud' }, 200, request);
    }

    if (url.pathname !== '/api/designs') {
      return response({ error: 'not_found' }, 404, request);
    }
    if (!(await authorized(request))) {
      return response({ error: 'unauthorized' }, 401, request);
    }

    if (request.method === 'GET') {
      return response(await readDesigns(env), 200, request);
    }

    if (request.method === 'PUT') {
      let body;
      try { body = await request.json(); } catch { return response({ error: 'invalid_json' }, 400, request); }
      const designs = body && body.designs;
      if (!Array.isArray(designs) || designs.length > 200) {
        return response({ error: 'invalid_designs' }, 400, request);
      }
      const payload = JSON.stringify(designs);
      if (payload.length > 30000000) {
        return response({ error: 'payload_too_large' }, 413, request);
      }
      const updatedAt = new Date().toISOString();
      await env.DB.prepare(
        `CREATE TABLE IF NOT EXISTS design_items (
          workspace TEXT NOT NULL,
          name TEXT NOT NULL,
          payload TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          PRIMARY KEY (workspace, name)
        )`
      ).run();
      const statements = [
        env.DB.prepare('DELETE FROM design_items WHERE workspace = ?1').bind(WORKSPACE),
        ...designs.map(design => env.DB.prepare(
          'INSERT INTO design_items (workspace, name, payload, updated_at) VALUES (?1, ?2, ?3, ?4)'
        ).bind(WORKSPACE, String(design.name || ''), JSON.stringify(design), updatedAt)),
      ];
      await env.DB.batch(statements);
      return response({ ok: true, count: designs.length, updatedAt }, 200, request);
    }

    return response({ error: 'method_not_allowed' }, 405, request);
  },
};
