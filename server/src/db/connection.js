import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { JsonDatabase } from "./jsonDb.js";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "..", "data");
export const UPLOADS_DIR = path.join(DATA_DIR, "uploads");
export const SERVICE_UPLOADS_DIR = path.join(UPLOADS_DIR, "services");

export function getUploadsDir() {
  return path.join(path.dirname(getActiveJsonPath()), "uploads");
}

export function getServiceUploadsDir() {
  return path.join(getUploadsDir(), "services");
}

const SCHEMA_SQL = `
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
      image_data TEXT,
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
`;

let db;
let dbEngine = "none";
let activeDbPath;
let activeJsonPath;

function getDbPath() {
  return process.env.DATABASE_PATH || path.join(DATA_DIR, "globalstore.db");
}

export function getDataDir() {
  return DATA_DIR;
}

export function getActiveDbPath() {
  return activeDbPath || getDbPath();
}

export function getActiveJsonPath() {
  if (activeJsonPath) return activeJsonPath;
  return (
    process.env.JSON_DATABASE_PATH ||
    path.join(path.dirname(getActiveDbPath()), "globalstore.json")
  );
}

export function getDbEngine() {
  return dbEngine;
}

export function getDb() {
  if (!db) {
    throw new Error("Database not initialized. Call initDatabase() first.");
  }
  return db;
}

function openSqlite(dbPath) {
  const Database = require("better-sqlite3");
  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("synchronous = FULL");
  sqlite.pragma("foreign_keys = ON");
  sqlite.exec(SCHEMA_SQL);
  migrateSqlite(sqlite);
  return sqlite;
}

function migrateSqlite(sqlite) {
  const cols = sqlite.prepare("PRAGMA table_info(services)").all();
  if (!cols.some((col) => col.name === "image_data")) {
    sqlite.exec("ALTER TABLE services ADD COLUMN image_data TEXT");
  }
}

export function initDatabase(dbPath = getDbPath(), options = {}) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(SERVICE_UPLOADS_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  if (db) {
    try {
      db.close();
    } catch {
      /* ignore */
    }
    db = undefined;
  }

  activeDbPath = dbPath;
  const jsonPath =
    options.jsonPath ||
    process.env.JSON_DATABASE_PATH ||
    path.join(path.dirname(dbPath), "globalstore.json");
  activeJsonPath = jsonPath;
  fs.mkdirSync(getServiceUploadsDir(), { recursive: true });

  const engine = options.engine || process.env.DATABASE_ENGINE;
  const forceJson = engine === "json";
  if (!forceJson) {
    try {
      db = openSqlite(dbPath);
      dbEngine = "sqlite";
      return db;
    } catch (err) {
      console.error(
        "SQLite native module failed; using JSON file store instead.",
        err?.message || err,
      );
    }
  }

  fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
  db = new JsonDatabase(jsonPath);
  dbEngine = "json";
  return db;
}

export function closeDatabase() {
  if (db) {
    try {
      db.close();
    } catch {
      /* ignore */
    }
    db = undefined;
  }
  dbEngine = "none";
  activeDbPath = undefined;
  activeJsonPath = undefined;
}
