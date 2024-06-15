import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import globalErrorHandeller from "./app/middleware/globalErrorHandeller";
import noRouteFound from "./app/middleware/noRouteFound";
const app: Application = express();

app.use(express.json());
app.use("/api", router);
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Hello World</h1>");
});
app.use(globalErrorHandeller);
app.use(noRouteFound);

export default app;
