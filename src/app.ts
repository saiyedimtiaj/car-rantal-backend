import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import globalErrorHandeller from "./app/middleware/globalErrorHandeller";
import noRouteFound from "./app/middleware/noRouteFound";
const app: Application = express();
import cookieParser from "cookie-parser";

// https://metroride-imtiajs-projects.vercel.app/
// http://localhost:5173
app.use(express.json());
app.use(
  cors({
    origin: ["https://metroride-imtiajs-projects.vercel.app"],
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Hello World by Saiyed Imtiaj</h1>");
});
app.use(globalErrorHandeller);
app.use(noRouteFound);

export default app;
