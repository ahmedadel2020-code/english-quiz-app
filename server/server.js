const path = require("path");
const express = require("express");
const { errorHandler } = require("./middleware/errorMiddleware");
const port = process.env.PORT || 5000;
const cors = require("cors");

// run app
const app = express();

// initialize cors
app.use(cors());

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// initialize our endpoints
app.use("/api/words", require("./routes/wordsRoute"));
app.use("/api/rank", require("./routes/rankRoute"));

// Serve frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "../", "client", "build", "index.html")
    )
  );
} else {
  app.get("/", (req, res) => res.send("Please set to production"));
}
// this will override the default error handler of express
app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on port ${port}`));
