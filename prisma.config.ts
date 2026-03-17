import "dotenv/config";
import { defineConfig } from "prisma/config";
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

// 1. Ambil URL dari .env
const connString = process.env["DATABASE_URL"];

// 2. Bersihkan URL (Perbaikan nomor 2 & 3)
let finalUrl = connString;
if (finalUrl) {
  // Hapus typo ':ase.com' jika ada
  finalUrl = finalUrl.replace(':ase.com:5432', ':5432');
  
  // Tambahkan sslmode=require dan uselibpqcompat=true jika belum ada
  if (!finalUrl.includes('sslmode=')) {
    finalUrl += finalUrl.includes('?') ? '&sslmode=require' : '?sslmode=require';
  }
  if (!finalUrl.includes('uselibpqcompat=')) {
    finalUrl += finalUrl.includes('?') ? '&uselibpqcompat=true' : '?uselibpqcompat=true';
  }
}

const pool = new pg.Pool({ connectionString: finalUrl })
const adapter = new PrismaPg(pool as any)

const config = defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed.js",
  },
  datasource: {
    url: finalUrl, // Gunakan URL yang sudah dibersihkan
  },
  adapter,
} as any);

export default config;
