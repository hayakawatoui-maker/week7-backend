import express from "express";
import pkg from "pg";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

// GET: 全メモ取得
app.get("/memos", async (req, res) => {
  const result = await pool.query("SELECT * FROM memos ORDER BY id DESC");
  res.json(result.rows);
});

// POST: メモ追加
app.post("/memos", async (req, res) => {
  const { content } = req.body;
  const result = await pool.query(
    "INSERT INTO memos (content) VALUES ($1) RETURNING *",
    [content]
  );
  res.json(result.rows[0]);
});

// DELETE: メモ削除
app.delete("/memos/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM memos WHERE id = $1", [id]);
  res.json({ message: "deleted" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
