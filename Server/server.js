const express = require("express");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/wordList", require("./routes/wordListRoute"));
app.use("/api/rank", require("./routes/rankRoute"));

// this will override the default error handler of express
app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on port ${port}`));
