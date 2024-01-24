import express, { Request, Response } from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import helmet from "helmet";

import db from "./models/index";
import memberRouter from "./routes/member.route";
// * 초기 데이터 삽입
import memberData from "./data/insertMemberData";
import geoData from "./data/insertGeoData";

const app = express();
const port = 3005;

// Swagger
const swaggerYaml = YAML.load(path.join(__dirname, "./swagger/swagger.yaml"));

// Middleware
app.use(morgan("dev"));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());

// Routes
app.use("/v1/members", memberRouter);
app.get("/test", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message:
      "You are on node-typescript-boilerplate. You should not have further access from here.",
  });
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerYaml));
app.all("*", (_, res: Response) => {
  res.status(404).send("Not Found");
});

// Database 연결 및 초기 데이터 삽입
const initializeDatabase = async () => {
  try {
    await db.initialize();
    console.log("데이터베이스가 연결되었습니다.");

    // * 초기 데이터 삽입
    // await memberData();
    // await geoData();
  } catch (error) {
    console.log(error);
  }
};

// Start Server
const startServer = () => {
  app.listen(port, () => {
    console.log(`CONNECTED TO DB AND SERVER STARTED ON PORT ${port}`);
  });
};

// Initialize Database and Start Server
initializeDatabase().then(startServer);
