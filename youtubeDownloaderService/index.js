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


app.use("/download", downloadRouter);
app.use("/info", infoRouter);

// Testing something
// app.get('/proxy', async (req, res) => {
//   const { url, isAudioOnly } = req.query;
//   // Validate and sanitize input
//   try {

//     const downloadResponse = await fetch(`http://localhost:3001/download?url=${encodeURIComponent(url)}&isAudioOnly=${isAudioOnly}`);
//     res.setHeader('Content-Type', downloadResponse.headers.get('Content-Type'));
//     res.setHeader('Content-Disposition', downloadResponse.headers.get('Content-Disposition'));

//     Readable.fromWeb(downloadResponse.body).pipe(res);
//   } catch (err) {
//     console.error('Error in proxy:', err);
//     res.status(500).json('Error proxying that thing 🙂')
//   }
// });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
