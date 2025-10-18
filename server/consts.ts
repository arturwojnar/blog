import path from "path";
import { fileURLToPath } from "url";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
export const PORT = process.env.PORT || 3000;
export const htmlDir = "_site";
export const htmlPath = path.join(__dirname, `../${htmlDir}`);
export const articlesDir = path.join(__dirname, "../articles");
