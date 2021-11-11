import express from "express";
import session from "express-session";
import morgan from "morgan";
import { localsMiddleware } from "./middlewares";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const app = express();
const logger = morgan("dev");

// view engine 설정
app.set("view engine", "pug");
//view 디렉토리 설정
app.set("views", process.cwd() + "/src/views");

app.use(logger);

//form value 값을 이해 할 수 있도록 해주는 middleware
app.use(express.urlencoded({ extended: true }));

//미들웨어로 session 추가해주기
app.use(
    session({
        secret: "Hello",
        resave: true,
        saveUninitialized: true,
    })
);

app.use(localsMiddleware);

app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
