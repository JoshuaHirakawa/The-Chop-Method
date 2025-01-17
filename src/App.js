import React, { useState, useRef, useEffect } from 'react'; /// React hook to manage state for importing audio
import Waveform from './components/Waveform'; /// component that displays the waveform on dom
import Controls from './components/Controls'; ///  component which displays all controls for users
import { bpmDivisions } from './utils/bpmDivisions'; ///  util function used for calculating the time of bar divisions in ms
import * as Tone from 'tone'; /// Import Tone.js

// > MAIN APP COMPONENT
const App = () => {
  /// start by creating a couple usestate hooks for audio file and bpm management
  const [audioFile, setAudioFile] = useState(null); /// manage imported audio
  const [bpm, setBPM] = useState(120); /// actual bpm applied to calculationg
  const [bpmInput, setBpmInput] = useState(120); /// bpm inputted by user
  const [selectedDivision, setSelectedDivision] = useState('1/1'); /// beat division selected by user
  const [zoomLevel, setZoomLevel] = useState(0); /// manage zoom levels

  /// create a reference to Tone.js Player
  const tonePlayer = useRef(null);
  /// create a reference to WaveSurfer visualizer
  const waveSurferRef = useRef(null);
  /// create a shuffledAudioRef
  const shuffledAudioRef = useRef(null);

  const initializeAudioContext = async () => {
    // Resume Tone.js AudioContext
    const toneAudioContext = Tone.getContext().rawContext;
    if (toneAudioContext.state === 'suspended') {
      await toneAudioContext.resume();
      console.log('Tone.js AudioContext resumed');
    }

    // resume wavesurfer.js audiocontext
    if (waveSurferRef.current) {
      console.log(waveSurferRef);
      const waveSurferAudioContext = waveSurferRef.current.media.audioContext;
      if (
        waveSurferAudioContext &&
        waveSurferAudioContext.state === 'suspended'
      ) {
        await waveSurferAudioContext.resume();
        console.log('WaveSurfer.js AudioContext resumed');
      }
    }
  };

  // ; HANDLER FUNCTION FOR ZOOMING
  const adjustZoomLevel = (newZoomLevel) => {
    if (waveSurferRef.current && waveSurferRef.current.isReady) {
      waveSurferRef.current.zoom(newZoomLevel); // Apply zoom
      setZoomLevel(newZoomLevel); // Synchronize state
      console.log(`Horizontal Zoom applied: ${newZoomLevel}`);
    } else {
      console.error('WaveSurfer is not ready.');
    }
  };

  // ; HANDLER FUNCTION FOR FILE UPLOAD
  const handleFileUpload = async (e) => {
    // console.log('e.target, files: ', e.target.files);
    // Ensure the file type is supported
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('audio/')) {
      console.error('Invalid file type. Please upload an audio file.');
      return;
    }
    const fileUrl = URL.createObjectURL(file);
    console.log('File:', file);
    console.log('File URL created:', typeof fileUrl, fileUrl);

    setAudioFile(fileUrl);

    // check if toneplayer does not have a current instance
    if (!tonePlayer.current) {
      // console.log('creating instance of tone player');
      tonePlayer.current = new Tone.Player(fileUrl).toDestination();
      console.log('created Tone player: ', tonePlayer);
    } else {
      // If the player already exists, update its URL
      tonePlayer.current
        .load(fileUrl)
        .then(() => {
          console.log('Audio file reloaded into Tone.Player');
        })
        .catch((error) => {
          console.error('Error loading audio file into Tone.Player:', error);
        });
    }
  };
  const playPauseToggle = () => {
    setIsPlaying((prevState) => !prevState);
  };
  // const playPauseToggle = () => {
  //   if (!isPlaying) {
  //     console.log('Playing audio');
  //     if (tonePlayer.current && tonePlayer.current.loaded) {
  //       tonePlayer.current.start();
  //       console.log('Tone.Player started');
  //     }
  //     if (waveSurferRef.current) {
  //       waveSurferRef.current.play();
  //       console.log('WaveSurfer started');
  //     }
  //   } else {
  //     console.log('Paused audio');
  //     if (tonePlayer.current) {
  //       tonePlayer.current.stop();
  //       console.log('Tone.Player stopped');
  //     }
  //     if (waveSurferRef.current) {
  //       waveSurferRef.current.pause(); // Use pause for visual sync
  //       console.log('WaveSurfer paused');
  //     }
  //   }
  //   setIsPlaying((prevState) => !prevState);
  // };

  // ; HANDLER FUNCTION TO PLAY AUDIO
  const handlePlay = () => {
    console.log('Playing audio');
    if (tonePlayer.current && tonePlayer.current.loaded) {
      tonePlayer.current.start();
      //start wavesurfer playback as well
      if (waveSurferRef.current) {
        waveSurferRef.current.play(); // Start the WaveSurfer visualization
      }
    } else {
      console.error('Tone.Player is not yet loaded.');
    }
  };

  // ; HANDLER FUNCTION TO PAUSE AUDIO
  const handlePause = () => {
    console.log('Paused audio');
    if (tonePlayer.current) {
      tonePlayer.current.stop();
      // stop the wavesurfer playback as well
      if (waveSurferRef.current) {
        waveSurferRef.current.stop(); // Stop the WaveSurfer visualization
      }
    }
  };

  // ; HANDLER FOR SEEK AUDIO
  const handleSeek = (progress) => {
    if (tonePlayer.current && tonePlayer.current.buffer) {
      const duration = tonePlayer.current.buffer.duration; // Total duration of the audio
      const newTime = progress * duration; // Calculate the new time based on progress (0.0 to 1.0)

      console.log('Seeking to time:', newTime);

      // Stop the current playback and start at the new position
      tonePlayer.current.stop();
      tonePlayer.current.start(0, newTime);
      waveSurferRef.current.play();
    }
  };
  // ; FUNCTION TO GET WAVESURFER REGIONS
  const getWaveSurferRegions = () => {
    if (!waveSurferRef.current) return [];
    const regionsPlugin = waveSurferRef.current.plugins[0];

    return Object.values(regionsPlugin.regions);
  };

  /// Shuffle and Update state
  const shuffleAndSetRef = async () => {
    const blobUrl = await handleShuffle();
    if (blobUrl) {
      shuffledAudioRef.current = blobUrl; // Update ref instead of state
      console.log('Shuffled audio ref updated:', blobUrl);
    }
  };

  // ; FUNCTION TO SHUFFLE ARRAY OF REGIONS
  const shuffleArray = (array) => {
    /// Separate the last element (uneven chop)
    const unevenChop = array.pop();

    ///shuffle the rest of the chops
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    /// Concatenate the uneven chop back at the end
    array.push(unevenChop);
    return array;
  };

  // ; FUNCTION TO CREATE AND APPLY REGIONS
  const handleCreateRegions = () => {
    if (tonePlayer.current && waveSurferRef.current) {
      const regionsPlugin = waveSurferRef.current.plugins[0];

      if (!regionsPlugin) {
        console.error('Regions plugin is not active.');
        return;
      }

      const audioDuration = tonePlayer.current.buffer.duration; /// Total duration of current audio
      const barDuration = bpmDivisions(bpm)[selectedDivision]; /// user selected beat division
      const regions = [];

      // Calculate regions
      let currentTime = 0;
      while (currentTime < audioDuration) {
        const nextTime = currentTime + barDuration;
        regions.push({
          start: currentTime,
          end: Math.min(nextTime, audioDuration), // Ensure regions don't exceed duration
          color: 'rgba(0, 255, 0, 0.1)', // Optional region color
        });
        currentTime = nextTime;
      }

      // Clear and add regions using the plugin instance
      regionsPlugin.clearRegions();
      regions.forEach((region) => {
        regionsPlugin.addRegion(region);
      });

      console.log('Regions created with:', selectedDivision, regions);
      console.log('waveSurferRef: ', waveSurferRef);
    }
  };

  // > HANDLER FUNCTION FOR SHUFFLING AUDIO CHOPS
  // ; BIGGEST FEATURE ********
  const handleShuffle = async () => {
    console.log('Shuffling regions...');
    const regions = getWaveSurferRegions();
    // console.log('regions: ', regions);
    if (regions.length === 0) {
      console.error('No regions to shuffle.');
      return;
    }

    // /Shuffle regions
    const shuffledRegions = shuffleArray(regions);
    // console.log('shuffled Array:', shuffledRegions);

    /// Reflect on WaveSurfer
    try {
      // reflectShuffledRegions(shuffledRegions);
      const blobUrl = await processShuffledRegionsWithWebAudio(
        audioFile,
        shuffledRegions
      );
      if (!blobUrl) {
        console.error('Failed to process shuffled regions.');
        return;
      }
      console.log('Shuffled audio Blob URL received:', blobUrl);

      // Reload WaveSurfer with the new audio
      if (waveSurferRef.current) {
        waveSurferRef.current.load(blobUrl);
      }
      // Load the shuffled audio into Tone.Player for playback
      if (tonePlayer.current) {
        tonePlayer.current
          .load(blobUrl)
          .then(() => {
            console.log('Shuffled audio loaded into Tone.Player.');
          })
          .catch((error) => {
            console.error(
              'Error loading shuffled audio into Tone.Player:',
              error
            );
          });
      } else {
        console.error('Tone.Player instance is not initialized.');
      }

      /// return blobUrl to update shuffledAudio state outside of this function
      return blobUrl;
    } catch (error) {
      console.error('Error during handleShuffle:', error);
    }
  };

  // ; PROCESS SHUFFLED REGIONS WITH Web Audio Api
  const processShuffledRegionsWithWebAudio = async (
    audioFile,
    shuffledRegions
  ) => {
    if (!audioFile) {
      console.error('No audio file available.');
      return;
    }

    try {
      // Fetch and decode the original audio file into an AudioBuffer
      const audioContext = new AudioContext();
      console.log('audioContext: ', audioContext);
      const response = await fetch(audioFile);

      const audioData = await response.arrayBuffer();
      console.log('audio Data:', audioData);

      const originalBuffer = await audioContext.decodeAudioData(audioData);
      console.log('originalBuffer:', originalBuffer);
      console.log('Original audio buffer loaded.');

      // Calculate total duration of shuffled regions
      const totalDuration = shuffledRegions.reduce(
        (sum, region) => sum + (region.end - region.start),
        0
      );

      // Create an OfflineAudioContext with the same sample rate as the original buffer
      const offlineContext = new OfflineAudioContext(
        originalBuffer.numberOfChannels,
        totalDuration * originalBuffer.sampleRate,
        originalBuffer.sampleRate
      );

      let currentTime = 0;
      /// FADE IN AND OUT SLIGHTLY TO AVOID CLICKY CHOPS
      const fadeDuration = 0.08;

      // Process each shuffled region and copy it into the offline context
      shuffledRegions.forEach((region) => {
        const { start, end } = region;
        const regionDuration = end - start;

        // Create a new buffer source for each region
        const source = offlineContext.createBufferSource();
        source.buffer = originalBuffer;

        /// CREATE GAIN NODE FOR FADE IN AND OUT
        const gainNode = offlineContext.createGain();

        /// SET FADE-IN AND FADE-OUT
        gainNode.gain.setValueAtTime(0, currentTime); // Start at 0 gain
        gainNode.gain.linearRampToValueAtTime(1, currentTime + fadeDuration); // Fade-in
        gainNode.gain.setValueAtTime(
          1,
          currentTime + regionDuration - fadeDuration
        );
        // Sustain full gain
        gainNode.gain.linearRampToValueAtTime(0, currentTime + regionDuration); // Fade-out

        source.start(currentTime, start, regionDuration);

        // Connect the source to the offline context destination
        source.connect(offlineContext.destination);

        // Increment the current time for the next region
        currentTime += regionDuration;
      });

      // Render the audio to a buffer
      const renderedBuffer = await offlineContext.startRendering();
      console.log('Offline rendering completed.');
      console.log('renderedBuffer: ', renderedBuffer);
      // Export the rendered buffer as a Blob URL
      const blobUrl = exportAudioBufferCustom(renderedBuffer);
      console.log('Shuffled audio exported as Blob URL:', blobUrl);

      // Update your application state (if necessary)
      return blobUrl;
    } catch (error) {
      console.error(
        'Error processing shuffled regions with Web Audio API:',
        error
      );
    }
  };
  // ; custom function to exportAudioBuffer
  const exportAudioBufferCustom = (audioBuffer) => {
    // Convert the AudioBuffer to a WAV Blob
    const wavBlob = audioBufferToWavBlob(audioBuffer);

    // Create a Blob URL
    const blobUrl = URL.createObjectURL(wavBlob);
    console.log('Exported audio as Blob URL:', blobUrl);

    return blobUrl;
  };

  // ; HELPER FUNCTION TO CONVERT AUDIOBUFFER TO WAV BLOB
  const audioBufferToWavBlob = (audioBuffer) => {
    const numChannels = audioBuffer.numberOfChannels;
    const length = audioBuffer.length * numChannels;
    const sampleRate = audioBuffer.sampleRate;
    const wavBuffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(wavBuffer);

    // Write WAV header
    const writeString = (offset, str) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true); // PCM format chunk size
    view.setUint16(20, 1, true); // Audio format: PCM
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2 * numChannels, true);
    view.setUint16(32, numChannels * 2, true); // Block align
    view.setUint16(34, 16, true); // Bits per sample
    writeString(36, 'data');
    view.setUint32(40, length * 2, true);

    // Write PCM samples
    let offset = 44;
    for (let i = 0; i < audioBuffer.length; i++) {
      for (let channel = 0; channel < numChannels; channel++) {
        const sample = audioBuffer.getChannelData(channel)[i];
        view.setInt16(offset, sample * 0x7fff, true); // Convert to 16-bit PCM
        offset += 2;
      }
    }

    return new Blob([view], { type: 'audio/wav' });
  };

  // ; COMBINE SHUFFLED REGIONS
  const combineShuffledRegions = (buffer, shuffledRegions) => {
    const sampleRate = buffer.sampleRate; // Get the sample rate of the audio
    const totalLength = shuffledRegions.reduce((sum, region) => {
      return sum + (region.end - region.start) * sampleRate; // Sum the length of all regions in samples
    }, 0);

    // Create a new empty buffer to hold the combined regions
    const combinedBuffer = buffer.context.createBuffer(
      buffer.numberOfChannels,
      totalLength,
      sampleRate
    );

    let offset = 0; // Keep track of where to paste each region in the combined buffer

    shuffledRegions.forEach((region) => {
      const startSample = Math.floor(region.start * sampleRate);
      const endSample = Math.floor(region.end * sampleRate);

      for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        const originalChannelData = buffer.getChannelData(channel);
        const combinedChannelData = combinedBuffer.getChannelData(channel);

        // Copy the region data to the combined buffer
        combinedChannelData.set(
          originalChannelData.slice(startSample, endSample),
          offset
        );
      }

      offset += endSample - startSample; // Update the offset for the next region
    });

    return combinedBuffer; // Return the combined buffer
  };

  // ; REFLECT SHUFFLED REGIONS
  // const reflectShuffledRegions = (shuffledRegions) => {
  //   /// defined regionsPlugin from current instance of wavesurfer
  //   const regionsPlugin = waveSurferRef.current.plugins[0];
  //   // console.log('before clearing regions: ', regionsPlugin);
  //   // /// Clear existing regions
  //   // // waveSurferRef.current.plugins[0].clearRegions();
  //   // Object.values(regionsPlugin.regions).forEach((region) => {
  //   //   region.remove();
  //   // });
  //   waveSurferRef.current.initPlugins();
  //   console.log(
  //     're initialized regions plugin: ',
  //     waveSurferRef.current.plugins
  //   );
  //   // regionsPlugin.regions = {}; // Reset regions to an empty object
  //   // console.log('Regions cleared:', regionsPlugin);

  //   /// Re-add shuffled regions
  //   shuffledRegions.forEach((region) => {
  //     regionsPlugin.addRegion({
  //       start: region.start,
  //       end: region.end,
  //       color: region.color || 'rgba(0, 255, 0, 0.1)', // Preserve color or use default
  //       drag: region.drag, // Retain other properties if needed
  //       resize: region.resize,
  //     });
  //   });

  //   console.log('Regions shuffled and reflected visually.');
  // };
  const reflectShuffledRegions = async (shuffledRegions) => {
    // if (!audioFile) {
    //   console.error('No audio file available.');
    //   return;
    // }
    // // Destroy the existing WaveSurfer instance if it exists
    // if (waveSurferRef.current) {
    //   console.log('Destroying the existing WaveSurfer instance...');
    //   waveSurferRef.current.destroy();
    // }
    // /// dynamically import wavesurfer and regions plugin
    // const WaveSurfer = (await import('wavesurfer.js')).default;
    // const RegionsPlugin = (await import('wavesurfer.js/dist/plugins/regions'))
    //   .default;
    // // Create a new WaveSurfer instance
    // console.log('Creating a new WaveSurfer instance...');
    // waveSurferRef.current = WaveSurfer.create({
    //   container: '#waveform',
    //   waveColor: '#A0A0A0',
    //   progressColor: '#000000',
    //   backend: 'WebAudio',
    //   responsive: true,
    //   height: 100,
    //   cursorWidth: 1,
    //   dragToSeek: true,
    //   interact: true,
    //   plugins: [
    //     RegionsPlugin.create({
    //       regions: [],
    //       dragSelection: true,
    //     }),
    //   ],
    // });
    // // Load the same audio file into the new instance
    // // waveSurferRef.current.load(audioFile);
    // // Once the audio is ready, add the shuffled regions
    // waveSurferRef.current.on('ready', () => {
    //   console.log('WaveSurfer instance is ready. Adding shuffled regions...');
    //   const regionsPlugin = waveSurferRef.current.plugins[0];
    //   if (!regionsPlugin) {
    //     console.error('Regions plugin is not active.');
    //     return;
    //   }
    //   console.log(
    //     'shuffledRegions after reinitialization of wavesurfer: ',
    //     shuffledRegions
    //   );
    //   // Add shuffled regions
    //   shuffledRegions.forEach((region) => {
    //     regionsPlugin.addRegion({
    //       start: region.start,
    //       end: region.end,
    //       color: region.color || 'rgba(0, 255, 0, 0.1)', // Preserve color or use default
    //       drag: region.drag, // Retain other properties if needed
    //       resize: region.resize,
    //     });
    //   });
    //   console.log('Shuffled regions added to the new WaveSurfer instance.');
    // });
  };

  // ; HANDLER FUNCTION FOR SUBMITTING BPM
  const handleSubmitBPM = (e) => {
    e.preventDefault();
    setBPM(bpmInput);
    console.log(`BPM submitted: ${bpmInput}`);
  };
  // ; HANDLE DIVISION INPUT CHANGE
  const handleDivisionChange = (e) => {
    setSelectedDivision(e.target.value);
    console.log(`Division selected: ${e.target.value}`);
  };

  // ; HANDLE EXPORT SHUFFLED AUDIO
  const handleExport = async () => {
    try {
      // Check if the shuffled audio Blob URL exists in the ref
      if (!shuffledAudioRef.current) {
        console.error('No shuffled audio available for export.');
        return;
      }

      const blobUrl = shuffledAudioRef.current;

      // Create an anchor element to download the Blob
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'vocal_chop.wav';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log('Export initiated: ', blobUrl);
    } catch (error) {
      console.error('Error exporting audio:', error);
    }
  };

  useEffect(() => {
    let interval;

    if (tonePlayer.current && waveSurferRef.current) {
      interval = setInterval(() => {
        if (
          tonePlayer.current.state === 'started' &&
          tonePlayer.current.buffer
        ) {
          const currentTime =
            tonePlayer.current.context.currentTime -
            tonePlayer.current.startTime;
          const duration = tonePlayer.current.buffer.duration;
          const progress = currentTime / duration;

          // Set WaveSurfer's progress
          waveSurferRef.current.seekTo(progress);
        }
      }, 100); // Update every 100ms
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [tonePlayer.current, waveSurferRef]);

  // ; RETURN HEADER AND ALL NECESSARY COMPONENTS
  return (
    <div className='container'>
      <h1 className='header-text'>
        <div>
          <p>The</p>
        </div>
        <div className='chop-text'>
          <p>Chop</p>
        </div>
        <div>
          <p>Method</p>
        </div>
      </h1>

      {/* Row 1: File upload and submit */}
      <div className='row'>
        <input type='file' accept='audio/*' onChange={handleFileUpload} />
        <button type='submit' onClick={initializeAudioContext}>
          Submit
        </button>
      </div>

      {/* Row 2: BPM */}
      <div className='row'>
        <form onSubmit={handleSubmitBPM} className='bpm-container'>
          <label htmlFor='bpm-input'>BPM: </label>
          <input
            id='bpm-input'
            type='number'
            value={bpmInput}
            onChange={(e) => setBpmInput(Number(e.target.value))}
            placeholder='Enter BPM'
          />
          <button type='submit'>Submit</button>
        </form>
      </div>

      {/* Row 3: beat division */}
      <div className='row'>
        <div className='division-container'>
          <label htmlFor='division-select'>Division: </label>
          <select
            id='division-select'
            value={selectedDivision}
            onChange={handleDivisionChange}
          >
            {Object.keys(bpmDivisions(bpm)).map((division) => (
              <option key={division} value={division}>
                {division}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 4: Play and pause */}
      <div>
        <Controls
          playPauseToggle={playPauseToggle}
          onChop={handleCreateRegions}
          onShuffle={shuffleAndSetRef}
          onPlay={handlePlay}
          onPause={handlePause}
        />
      </div>

      <div className='waveform'>
        <Waveform
          audioFile={audioFile}
          waveSurferRef={waveSurferRef}
          onSeek={handleSeek}
        />
      </div>

      <div className='zoom-container'>
        <button onClick={() => adjustZoomLevel(0)}>-</button>
        <button onClick={() => adjustZoomLevel(500)}>+</button>
      </div>
      <div className='export'>
        {' '}
        <button onClick={handleExport}>
          <img
            className='icons'
            src='/downloading.png'
            title='Export'
            alt='Export'
          />
        </button>
      </div>
    </div>
  );
};

export default App;
