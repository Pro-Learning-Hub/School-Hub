require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { PassThrough } = require("stream");
const downloadRouter = require("./src/routes/download");
const infoRouter = require("./src/routes/info");
const { Readable } = require("stream");


const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3010;

app.use("/download", downloadRouter);
app.use("/info", infoRouter);

app.get('/proxy', async (req, res) => {
  const { url, isAudioOnly } = req.query;
  const controller = new AbortController();
  const { signal } = controller;



  try {

    const downloadResponse = await fetch(
      `http://localhost:${PORT}/download?url=${encodeURIComponent(url)}&isAudioOnly=${isAudioOnly}`,
      { signal }
    );
    res.setHeader('Content-Type', downloadResponse.headers.get('Content-Type'));
    res.setHeader('Content-Disposition', downloadResponse.headers.get('Content-Disposition'));

    req.setTimeout(1000 * 60 * 10);
    const stream = Readable.fromWeb(downloadResponse.body);

    // Handle stream errors to avoid process crash
    stream.on('error', (err) => {
      if (err.name === 'AbortError') {
        console.log("Stream aborted");
      } else {
        console.error("Stream error:", err);
      }
      res.destroy(err); // end the client response too
    });

    // Pipe data to client
    stream.pipe(res);

    req.on("aborted", () => {
      console.log("/proxy =>  Request aborted");
      controller.abort();
    });
  } catch (err) {
    console.error('Error in proxy:', err);
    res.status(500).json('Error proxying that thing 🙂')
  }
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
