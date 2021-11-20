import express, { Application, NextFunction, Request, Response } from "express";

const app: Application = express();

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Yo Man, you're there keep it up and always remember NOTHING LASTS FOREVER");
});

app.listen(5000, () => console.log("server running"));
