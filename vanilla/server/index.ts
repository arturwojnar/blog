import express, { type Request, type Response } from "express";
import path from "path";
import { __dirname } from "./consts.ts";
import { getPage } from "./getPage.ts";
import { isError } from "./helpers.ts";

const app = express();
const PORT = process.env.PORT || 3000;

const getHtml = async (uri: string, res: Response) => {
  const html = await getPage(uri);

  if (isError(html)) {
    res.sendStatus(404);
    res.send(await getPage("/404.html"));
    return;
  }

  res.send(html.result);
};

app.use(express.static(path.join(__dirname, "../public")));

app.get(["/"], async (req: Request, res: Response) => {
  return await getHtml(`/index.html`, res);
});

app.get(["/articles"], async (req: Request, res: Response) => {
  return await getHtml(`${req.path}/index.html`, res);
});

app.get("/articles/:slug", async (req: Request, res: Response) => {
  return await getHtml(`${req.path}/index.html`, res);
});

app.get(["/talks", "/trainings"], async (req: Request, res: Response) => {
  return await getHtml(`${req.path}.html`, res);
});

app.use(async (_: Request, res: Response) => {
  res.send(await getHtml("404.html", res));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
