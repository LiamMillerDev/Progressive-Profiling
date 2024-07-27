const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

// Configure CORS to allow requests from your Webflow site
app.use(
  cors({
    origin: "https://liams-five-star-site-be68de.webflow.io/", // Replace with your Webflow site URL
    credentials: true,
  })
);

// Serve JavaScript files from the 'src' directory
app.use("/src", express.static("src"));

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
