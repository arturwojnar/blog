import fs from "fs/promises";
import path from "path";
import { type Result, error, result } from "./helpers.js";
import { htmlPath } from "./consts.js";

const pages = new Map<string, string>();

export const getPage = async (
  uri: string
): Promise<Result<"NOT_FOUND", string>> => {
  // Check cache first
  if (pages.has(uri)) {
    return result(pages.get(uri)!);
  }

  const pagePath = path.join(htmlPath, uri);
  console.log('getPage - htmlPath:', htmlPath);
  console.log('getPage - uri:', uri);
  console.log('getPage - pagePath:', pagePath);

  try {
    const page = (await fs.readFile(pagePath)).toString();
    pages.set(uri, page);
    return result(page);
  } catch (err) {
    console.error('getPage error:', err);
    return error("NOT_FOUND");
  }
};
