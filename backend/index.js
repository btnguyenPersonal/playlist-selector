const express = require('express');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');

const app = express();
const port = 4000;

ffmpeg.setFfmpegPath(ffmpegPath);

app.get('/download', async (req, res) => {
  try {
    const url = req.query.url;
    if (!ytdl.validateURL(url)) {
      return res.sendStatus(400);
    }
    let title = 'audio';

    await ytdl.getInfo(url).then(info => {
      title = info.videoDetails.title.replace(/[^a-zA-Z ]/g, "");
    });

    res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
    const videoReadStream = ytdl(url, { quality: 'highestaudio' });

    ffmpeg(videoReadStream)
      .audioBitrate(128)
      .format('mp3')
      .pipe(res);

  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
