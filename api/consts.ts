import path from "path";
import { fileURLToPath } from "url";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
export const PORT = process.env.PORT || 3000;

// In Vercel, the dist folder is at the root of the deployment
// In local dev, it's relative to the api folder
export const htmlPath = process.env.VERCEL
  ? path.join(process.cwd(), 'dist')
  : path.join(__dirname, "../dist");

export const articlesDir = process.env.VERCEL
  ? path.join(process.cwd(), 'articles')
  : path.join(__dirname, "../articles");
