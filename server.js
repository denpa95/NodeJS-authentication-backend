require("dotenv").config();
const express = require("express");
const connectToDB = require("./database/db");
const authRouter = require("./route/route");
const homeRouter = require("./route/homeRoutes");
const adminRouter = require("./route/adminRoutes");
const imageRouter = require("./route/imageRoutes");

connectToDB();

const app = express();
const port = process.env.PORT || 3000;

//JSON parser middleware
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/home", homeRouter);
app.use("/api/admin", adminRouter);
app.use("/api/image", imageRouter);

app.listen(port, () =>
  console.log(`App is now listening to request at port ${port}`)
);
