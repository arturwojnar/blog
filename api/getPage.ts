import fs from "fs/promises";
import path from "path";
import { type Result, error, result } from "./helpers.ts";
import { htmlPath } from "./consts.ts";

const pages = new Map<string, string>();

export const getPage = async (
  uri: string
): Promise<Result<"NOT_FOUND", string>> => {
  // Check cache first
  if (pages.has(uri)) {
    return result(pages.get(uri)!);
  }

  const pagePath = path.join(htmlPath, uri);

  try {
    const page = (await fs.readFile(pagePath)).toString();
    pages.set(uri, page);
    return result(page);
  } catch (err) {
    return error("NOT_FOUND");
  }
};
