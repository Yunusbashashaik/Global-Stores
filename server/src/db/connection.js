import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = path.join(__dirname, "..", "..", "data");
export const UPLOADS_DIR = path.join(DATA_DIR, "uploads");
export const SERVICE_UPLOADS_DIR = path.join(UPLOADS_DIR, "services");

let db;
let activeDbPath;

export function getDbPath() {
  return (
    process.env.DATABASE_PATH || path.join(DATA_DIR, "globalstore.db")
  );
}

export function getDb() {
  if (!db) {
    throw new Error("Database not initialized. Call initDatabase() first.");
  }
  return db;
}

export function initDatabase(dbPath = getDbPath()) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(SERVICE_UPLOADS_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  if (db) {
    db.close();
    db = undefined;
  }

  activeDbPath = dbPath;
  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      icon TEXT NOT NULL DEFAULT '',
      accent TEXT NOT NULL DEFAULT '#38bdf8',
      type_en TEXT NOT NULL DEFAULT 'Shared / Private',
      type_ar TEXT NOT NULL DEFAULT 'مشترك / خاص',
      name_en TEXT NOT NULL,
      name_ar TEXT NOT NULL,
      description_en TEXT NOT NULL DEFAULT '',
      description_ar TEXT NOT NULL DEFAULT '',
      price_month REAL NOT NULL DEFAULT 0,
      price_year REAL NOT NULL DEFAULT 0,
      image_url TEXT,
      out_of_stock INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS complaints (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      subject TEXT NOT NULL,
      details TEXT NOT NULL,
      screenshot_path TEXT,
      original_filename TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  return db;
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = undefined;
  }
  activeDbPath = undefined;
}

export { activeDbPath };
