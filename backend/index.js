const express = require('express');
const ytdl = require('ytdl-core');
const ytpl = require('ytpl');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const app = express();
const port = 4000;

ffmpeg.setFfmpegPath(ffmpegPath);

app.get('/download', async (req, res) => {
    try {
        const url = req.query.url;
        const videoDir = path.join(__dirname, '/videos');
        const isPlaylist = ytpl.validateID(url);

        if (!isPlaylist && !ytdl.validateURL(url)) {
            return res.sendStatus(400);
        }

        if (!fs.existsSync(videoDir)) {
            fs.mkdirSync(videoDir);
        }

        let videos = [];

        let downloadTitle = 'title';
        if (isPlaylist) {
            const playlist = await ytpl(url);
            downloadTitle = playlist.title;
            videos = playlist.items;
        } else {
            const info = await ytdl.getInfo(url);
            downloadTitle = info.player_response.videoDetails.title;
            videos = [info.videoDetails];
        }

        const downloadVideo = (video) => new Promise((resolve, reject) => {
            let title = video.title.replace(/[^a-zA-Z ]/g, "");
            const writeStream = fs.createWriteStream(path.join(videoDir, `${title}.mp3`));
            const videoReadStream = ytdl(video.url || url, { quality: 'highestaudio' });

            ffmpeg(videoReadStream)
                .audioBitrate(128)
                .format('mp3')
                .pipe(writeStream)
                .on('finish', resolve)
                .on('error', reject);
        });

        for (const video of videos) {
            await downloadVideo(video);
        }
        const archive = archiver('zip');
        const output = fs.createWriteStream(path.join(__dirname, `${downloadTitle}.zip`));

        archive.pipe(output);
        archive.directory(videoDir, false);
        archive.finalize();

        output.on('close', () => {
            res.download(path.join(__dirname, `${downloadTitle}.zip`), (err) => {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                } else {
                    fs.readdir(videoDir, (err, files) => {
                        if (err) throw err;
                        for (const file of files) {
                            fs.unlink(path.join(videoDir, file), err => {
                                if (err) throw err;
                            });
                        }
                        fs.unlink(path.join(__dirname, `${downloadTitle}.zip`), err => {
                            if (err) throw err;
                        });
                    });
                }
            });
        });

    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
