import express from "express";
import router from "./routes/route";
import errorMiddleware from "./middleware/errorMiddleware";
const app = express();
app.use(router);
app.use(errorMiddleware);
app.listen(process.env.PORT || 3000);
