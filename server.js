const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const { exec } = require('child_process');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

let ffmpegProcess; // Declare the variable outside the exec call
const treeKill = require('tree-kill');

app.post('/start-streaming', (req, res) => {
  const { audioInputDevice } = req.body;

  console.log(`Chosen audio input device: `, audioInputDevice);

  // Use FFmpeg to convert and stream the audio to the RTMP server
  const ffmpegCommand = `ffmpeg -f dshow -i audio="${audioInputDevice.replace(/"/g, '\\"')}" -c:a aac -f flv rtmp://localhost/live/stream`;

  ffmpegProcess = exec(ffmpegCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`FFmpeg stderr: ${stderr}`);
      return;
    }
    console.log(`FFmpeg stdout: ${stdout}`);
  });

  res.sendStatus(200);
});

app.post('/terminate-streaming', (req, res) => {
    if (ffmpegProcess) {
        treeKill(ffmpegProcess.pid, 'SIGTERM', (err) => {
          if (err) {
            console.error('Error terminating FFmpeg process:', err);
          } else {
            console.log('FFmpeg process terminated.');
          }
        });
      } else {
        console.error('No FFmpeg process to terminate.');
      }
  });

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
