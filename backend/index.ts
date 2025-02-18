import express, { type Express, type Request, type Response } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import http from "http";
import { initPassport } from "./app/common/services/passport-jwt.service";
import { loadConfig } from "./app/common/helper/config.hepler";
import { type IUser } from "./app/user/user.dto";
import errorHandler from "./app/common/middleware/error-handler.middleware";
import routes from "./app/routes";
import cookieParser from 'cookie-parser';
import { setupSwagger } from './app/common/config/swagger.config';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
loadConfig();

declare global {
  namespace Express {
    interface User extends Omit<IUser, "password"> { }
    interface Request {
      user?: User;
    }
  }
}

const port = Number(process.env.PORT) ?? 5000;

const app: Express = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser())
app.use(cors({
  origin: process.env.FE_BASE_URL, //  Your frontend URL
  credentials: true, // Allow cookies
}));

const initApp = async (): Promise<void> => {

  // passport init
  initPassport();

  // set base path to /api
  app.use("/api", routes);

  // Swagger Setup (API Documentation)
  setupSwagger(app); // Integrate Swagger UI

  app.get("/", (req: Request, res: Response) => {
    res.send({ status: "ok" });
  });



  // error handler
  app.use(errorHandler);

  const server = http.createServer(app);


  server.listen(port, () => {
    console.log("Server is runnuing on port", port);
  });
};
void initApp();
