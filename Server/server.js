const express = require("express");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const port = process.env.PORT || 5000;

// run mongoDB
connectDB();
// run app
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/wordList", require("./routes/wordListRoute"));
app.use("/api/rank", require("./routes/rankRoute"));
app.use("/api/users", require("./routes/userRoute"));

// this will override the default error handler of express
app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on port ${port}`));
