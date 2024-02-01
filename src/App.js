import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [audioInputDevices, setAudioInputDevices] = useState([]);
  const [selectedAudioInput, setSelectedAudioInput] = useState('');

  useEffect(() => {
    // Fetch the list of audio input devices when the component mounts
    navigator.mediaDevices.enumerateDevices().then(devices => {
      const audioDevices = devices.filter(device => device.kind === 'audioinput');
      setAudioInputDevices(audioDevices);
      if (audioDevices.length > 0) {
        setSelectedAudioInput(audioDevices[0].deviceId);
      }
    });
  }, []);

  const handleStartStreaming = () => {
    const selectedAudioDevice = audioInputDevices.find(device => device.deviceId === selectedAudioInput);
    
    // Check if a device is selected
    if (selectedAudioDevice) {
      // Send the label (name) of the selected audio input device to the server
      axios.post('http://localhost:3001/start-streaming', {
        audioInputDevice: selectedAudioDevice.label,
      })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error starting streaming:', error);
      });
    } else {
      console.error('No audio input device selected.');
    }
  };

  const handleTerminateStreaming = () => {
    // Send a request to terminate the streaming
    axios.post('http://localhost:3001/terminate-streaming')
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error terminating streaming:', error);
      });
  };

  return (
    <div>
      <h1>Tech At Play - RTMP Commentary Feature </h1><h4>(Draft 1.0.0)</h4>
      <label htmlFor="audioInput">Select Audio Input Device:</label>
      <select
        id="audioInput"
        onChange={(e) => setSelectedAudioInput(e.target.value)}
        value={selectedAudioInput}
      >
        {audioInputDevices.map(device => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || ` ${device.deviceId}`}
          </option>
        ))}
      </select>
      <button onClick={handleStartStreaming}>Start Streaming</button>
      <button onClick={handleTerminateStreaming}>Pause Streaming</button>
    </div>
  );
}

export default App;
