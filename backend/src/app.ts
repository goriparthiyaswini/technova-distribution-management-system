import express from "express";
import cors from "cors";
import { env } from "./config/env";
import routes from "./routes";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

const app = express();

app.use(cors({ origin: env.CLIENT_ORIGIN }));
app.use(express.json());

app.use("/", routes); // exposes /health, /auth, /users, /customers, /products, /inventory, /challans, /dashboard

app.use(notFoundHandler);
app.use(errorHandler);

export default app;