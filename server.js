const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

app.get("/fetch-image", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing URL" });

  try {
    const response = await axios.get(url, { headers: { Accept: "text/html" } });

    const match = response.data.match(
      /<meta property="og:image" content="(.*?)"/
    );
    const ogImage = match ? match[1] : null;

    if (ogImage) {
      res.json({ imageUrl: ogImage });
    } else {
      res.status(404).json({ error: "No image found" });
    }
  } catch (error) {
    console.error("Error fetching page:", error.message);
    res.status(500).json({ error: "Failed to fetch page" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
