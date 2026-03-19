import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";
import express from "express";
import mysql from "mysql2/promise";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, "../../../../");
const jejuWebDir = path.join(workspaceRoot, "jeju-web");

for (const candidate of [
  path.join(jejuWebDir, ".env"),
  path.join(workspaceRoot, ".env"),
]) {
  if (fs.existsSync(candidate)) {
    dotenv.config({ path: candidate });
    break;
  }
}

const defaultJdbcUrl =
  "jdbc:mysql://127.0.0.1:3306/jejudb?useSSL=false&serverTimezone=Asia/Seoul&characterEncoding=UTF-8";
const jdbcUrl = process.env.DB_URL || defaultJdbcUrl;
const dbUser = process.env.DB_USER || "root";
const dbPassword = process.env.DB_PASSWORD || "";
const port = Number(process.env.CS_API_PORT || 3001);

const parseJdbcUrl = (value) => {
  const normalized = value.replace(/^jdbc:mysql:\/\//, "http://");
  const url = new URL(normalized);

  return {
    host: url.hostname,
    port: Number(url.port || 3306),
    database: url.pathname.replace(/^\/+/, ""),
    charset: url.searchParams.get("characterEncoding") || "utf8mb4",
  };
};

const db = parseJdbcUrl(jdbcUrl);

if (!dbPassword) {
  throw new Error(
    "DB_PASSWORD is not set. Add jeju-web/.env with DB_URL, DB_USER, and DB_PASSWORD before starting the CS dev API.",
  );
}

const pool = mysql.createPool({
  host: db.host,
  port: db.port,
  user: dbUser,
  password: dbPassword,
  database: db.database,
  charset: db.charset,
  timezone: "local",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const app = express();
app.use(express.json({ limit: "1mb" }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "http://localhost:3000");
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
});

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const formatInquiryDate = (value) => {
  if (!value) {
    return dateFormatter.format(new Date()).replace(/\.\s/g, ".").replace(/\.$/, "");
  }

  return dateFormatter
    .format(new Date(value))
    .replace(/\.\s/g, ".")
    .replace(/\.$/, "");
};

const normalizeString = (value) => (typeof value === "string" ? value.trim() : "");

const requireValue = (value, fieldName) => {
  const normalized = normalizeString(value);
  if (!normalized) {
    const error = new Error(`${fieldName} is required.`);
    error.statusCode = 400;
    throw error;
  }
  return normalized;
};

const parseInquiryId = (value) => {
  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    const error = new Error("id must be numeric.");
    error.statusCode = 400;
    throw error;
  }
  return parsed;
};

const ensureColumn = async (connection, columnName, definition) => {
  const [rows] = await connection.query("SHOW COLUMNS FROM inquiry LIKE ?", [columnName]);
  if (rows.length === 0) {
    await connection.query(`ALTER TABLE inquiry ADD COLUMN ${definition}`);
  }
};

const ensureInquirySchema = async () => {
  const connection = await pool.getConnection();

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS inquiry (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        content TEXT,
        service VARCHAR(100),
        status VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await ensureColumn(connection, "status", "status VARCHAR(50) AFTER service");
    await ensureColumn(connection, "created_at", "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER status");
  } finally {
    connection.release();
  }
};

const toInquiryPayload = (row) => ({
  id: Number(row.id),
  title: row.title,
  content: row.content,
  service: row.service,
  status: row.status || "pending",
  date: row.date || formatInquiryDate(row.created_at),
});

const selectInquiryColumns = `
  SELECT
    id,
    title,
    content,
    service,
    status,
    created_at,
    DATE_FORMAT(created_at, '%Y.%m.%d') AS date
  FROM inquiry
`;

const findInquiryById = async (inquiryId) => {
  const [rows] = await pool.query(`${selectInquiryColumns} WHERE id = ?`, [inquiryId]);
  return rows.length > 0 ? toInquiryPayload(rows[0]) : null;
};

app.get("/health", (_req, res) => {
  res.json({ success: true });
});

app.get("/inquiry/list", async (_req, res) => {
  try {
    await ensureInquirySchema();

    const [rows] = await pool.query(`${selectInquiryColumns} ORDER BY id DESC`);

    res.json({
      success: true,
      inquiries: rows.map(toInquiryPayload),
    });
  } catch (error) {
    console.error("[CS API] Failed to load inquiries:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load inquiries.",
    });
  }
});

app.get("/inquiry/detail", async (req, res) => {
  try {
    await ensureInquirySchema();

    const inquiryId = parseInquiryId(req.query.id);
    const inquiry = await findInquiryById(inquiryId);

    if (!inquiry) {
      res.status(404).json({
        success: false,
        message: "Inquiry not found.",
      });
      return;
    }

    res.json({
      success: true,
      inquiry,
    });
  } catch (error) {
    const statusCode = error?.statusCode || 500;
    console.error("[CS API] Failed to load inquiry detail:", error);
    res.status(statusCode).json({
      success: false,
      message: statusCode === 400 ? error.message : "Failed to load inquiry.",
    });
  }
});

app.post("/inquiry/write", async (req, res) => {
  try {
    await ensureInquirySchema();

    const title = requireValue(req.body?.title, "title");
    const content = requireValue(req.body?.content, "content");
    const service = requireValue(req.body?.service, "service");

    const [result] = await pool.query(
      `
        INSERT INTO inquiry (
          title,
          content,
          service,
          status
        )
        VALUES (?, ?, ?, 'pending')
      `,
      [title, content, service],
    );

    const inquiry = await findInquiryById(result.insertId);

    res.status(201).json({
      success: true,
      inquiry,
    });
  } catch (error) {
    const statusCode = error?.statusCode || 500;
    console.error("[CS API] Failed to create inquiry:", error);
    res.status(statusCode).json({
      success: false,
      message: statusCode === 400 ? error.message : "Failed to create inquiry.",
    });
  }
});

app.post("/inquiry/update", async (req, res) => {
  try {
    await ensureInquirySchema();

    const inquiryId = parseInquiryId(req.body?.id);
    const title = requireValue(req.body?.title, "title");
    const content = requireValue(req.body?.content, "content");
    const service = requireValue(req.body?.service, "service");

    const [result] = await pool.query(
      `
        UPDATE inquiry
        SET title = ?, content = ?, service = ?
        WHERE id = ?
      `,
      [title, content, service, inquiryId],
    );

    if (result.affectedRows === 0) {
      res.status(404).json({
        success: false,
        message: "Inquiry not found.",
      });
      return;
    }

    const inquiry = await findInquiryById(inquiryId);
    res.json({
      success: true,
      inquiry,
    });
  } catch (error) {
    const statusCode = error?.statusCode || 500;
    console.error("[CS API] Failed to update inquiry:", error);
    res.status(statusCode).json({
      success: false,
      message: statusCode === 400 ? error.message : "Failed to update inquiry.",
    });
  }
});

app.post("/inquiry/delete", async (req, res) => {
  try {
    await ensureInquirySchema();

    const inquiryId = parseInquiryId(req.body?.id);
    const [result] = await pool.query("DELETE FROM inquiry WHERE id = ?", [inquiryId]);

    if (result.affectedRows === 0) {
      res.status(404).json({
        success: false,
        message: "Inquiry not found.",
      });
      return;
    }

    res.json({
      success: true,
    });
  } catch (error) {
    const statusCode = error?.statusCode || 500;
    console.error("[CS API] Failed to delete inquiry:", error);
    res.status(statusCode).json({
      success: false,
      message: statusCode === 400 ? error.message : "Failed to delete inquiry.",
    });
  }
});

const start = async () => {
  await ensureInquirySchema();

  app.listen(port, () => {
    console.log(`[CS API] Running on http://127.0.0.1:${port}`);
    console.log(`[CS API] Using database ${db.database} on ${db.host}:${db.port}`);
  });
};

start().catch((error) => {
  console.error("[CS API] Startup failed:", error);
  process.exit(1);
});

process.on("SIGINT", async () => {
  await pool.end();
  process.exit(0);
});
