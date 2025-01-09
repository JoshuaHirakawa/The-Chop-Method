import React, { useState } from 'react'; // React hook to manage state for importing audio
import Waveform from './components/Waveform'; // component that displays the waveform on dom
import Controls from './components/Controls'; // component which displays all controls for users
import { bpmDivisions } from './utils/bpmDivisions'; // util function used for calculating the time of bar divisions in ms

// > Main App Component
const App = () => {
  // start by creating a couple useState hooks for audio file and bpm management
  const [audioFile, setAudioFile] = useState(null);
  const [bpm, setBPM] = useState(120);

  // handler function for file Upload
  const handleFileUpload = (e) => {
    setAudioFile(URL.createObjectURL(e.target.files[0]));
  };

  //handler function for shuffling audio chops
  const handleShuffle = () => {
    const divisions = bpmDivisions(bpm);
    console.log('Shuffling based on: ', divisions);
  };

  //return header and all necessary components
  return (
    <div>
      <h1>The Chop Method</h1>
      <input type='file' accept='audio/*' onChange={handleFileUpload} />
      <input
        type='number'
        value={bpm}
        onChange={(e) => setBPM(e.target.value)}
        placeholder='Enter BPM'
      />
      <Waveform audioFile={audioFile} />
      <Controls onShuffle={handleShuffle} />
    </div>
  );
};

export default App;
