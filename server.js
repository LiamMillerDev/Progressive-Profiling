const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

// Configure CORS to allow requests from any origin
app.use(
  cors({
    origin: "*", // This allows any website to make requests to your server
    credentials: true,
  })
);

// Serve JavaScript files from the 'src' directory
app.use("/src", express.static("src"));

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
