CREATE TABLE IF NOT EXISTS design_store (
  workspace TEXT PRIMARY KEY,
  payload TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
