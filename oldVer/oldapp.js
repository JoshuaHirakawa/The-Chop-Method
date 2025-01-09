import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js';
import { bpmDivisions } from '../src/utils/bpmDivisions.js';
import * as Tone from 'tone';
let wavesurfer;
// let sensitivity = 0.6; // Lower sensitivity for more peaks
// let windowSize = 2048; // Smaller window size for better detection
// ? disable knobs by default until buffers are loaded
// document.getElementById('sensitivityKnob').disabled = true;
// document.getElementById('windowSizeKnob').disabled = true;

// document
//   .getElementById('sensitivityKnob')
//   .addEventListener('input', (event) => {
//     sensitivity = parseFloat(event.target.value);
//     document.getElementById('sensitivityValue').textContent =
//       sensitivity.toFixed(2);
//     console.log('Sensitivity updated:', sensitivity);
//   });

// document.getElementById('windowSizeKnob').addEventListener('input', (event) => {
//   windowSize = parseInt(event.target.value, 10);
//   document.getElementById('windowSizeValue').textContent = windowSize;
//   console.log('Window Size updated:', windowSize);
// });

// > 1. INITIALIZE WAVEFORM UPON STARTING APP
document.getElementById('startApp').addEventListener('click', () => {
  initializeWaveform();
  document.getElementById('startApp').style.display = 'none'; // Hide the button after initialization
});

// > 2.  Import Audio File AND INVOKE HANDLEFILEINPUT
document.getElementById('sample').addEventListener('change', handleFileInput);

// > PLAY/PAUSE
document.getElementById('playPause').addEventListener('click', async () => {
  if (wavesurfer) {
    // await Tone.start();
    wavesurfer.playPause();
  }
});

// > INITIALIZE WAVEFORM AND REQUIRED PLUGINS
function initializeWaveform() {
  wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#ddd',
    progressColor: '#007bff',
    responsive: true,
    backend: 'WebAudio',
    scrollParent: true,
    plugins: [
      RegionsPlugin.create({
        dragSelection: false,
      }),
    ],
  });

  console.log('Backend after WaveSurfer creation:', wavesurfer.backend);
}

// > DETECT TRANSIENTS AND ADD REGIONS
// function detectTransients(wavesurfer) {
//   if (!wavesurfer.decodedData) {
//     console.error('No audio loaded');
//     return;
//   }

//   wavesurfer.plugins[0].clearRegions();
//   console.log('regions cleared!');

//   const buffer = wavesurfer.decodedData.getChannelData(0);
//   const sampleRate = wavesurfer.decodedData.sampleRate;

//   let lastPeak = 0;

//   console.log('Detecting transients...');
//   console.log('Buffer length:', buffer.length);
//   console.log('Sample rate:', sampleRate);

//   for (let i = 0; i < buffer.length; i += windowSize) {
//     const slice = buffer.slice(i, i + windowSize);
//     const peak = Math.max(...slice.map(Math.abs));

//     if (peak > sensitivity && i / sampleRate - lastPeak > 0.1) {
//       const time = i / sampleRate;
//       lastPeak = time;

//       wavesurfer.plugins[0].addRegion({
//         start: time,
//         end: time + 0.5,
//         color: 'rgba(0, 123, 255, 0.1)',
//         attributes: {
//           class: 'wavesurfer-region',
//         },
//       });
//     }
//   }
// }

// > HANDLE FILE INPUT
function handleFileInput(event) {
  const file = event.target.files[0];
  if (file) {
    console.log('File selected:', file.name, 'Type:', file.type);

    // ? Ensure supported file types
    if (!['audio/wav', 'audio/mpeg'].includes(file.type)) {
      console.error('Unsupported file type:', file.type);
      alert('Please upload a .wav or .mp3 file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      console.log('e.target.result: ', e.target.result);
      const arrayBuffer = e.target.result;
      const blob = new Blob([arrayBuffer], { type: file.type });
      console.log('blob: ', blob);
      console.log('Loading blob into WaveSurfer...');

      wavesurfer
        .loadBlob(blob)
        .then(() => {
          console.log('wavesurfer: ', wavesurfer);
          console.log('Blob loaded successfully.');
        })
        .catch((err) => {
          console.error('Error loading blob:', err);
        });

      // Attach the 'ready' listener here BEFORE loading the blob
      wavesurfer.on('ready', () => {
        console.log('Waveform is ready.');
        console.log('Wavesurfer:', wavesurfer);
        console.log('Buffer:', wavesurfer.decodedData);

        // if (wavesurfer.decodedData) {
        //   document.getElementById('sensitivityKnob').disabled = false;
        //   document.getElementById('windowSizeKnob').disabled = false;
        //   console.log('Knobs enabled');
        //   //   detectTransients(wavesurfer);
        // } else {
        //   console.error('Buffer is still undefined after ready event.');
        // }
      });
    };

    reader.onerror = (err) => {
      console.error('Error reading file:', err);
    };

    reader.readAsArrayBuffer(file);
  } else {
    console.error('No file selected.');
  }
}

// > LISTEN FOR KNOB CHANGES
// function debounce(func, delay) {
//   let timer;
//   return (...args) => {
//     clearTimeout(timer);
//     timer = setTimeout(() => func(...args), delay);
//   };
// }

// document.getElementById('sensitivityKnob').addEventListener(
//   'change',
//   debounce(() => {
//     if (wavesurfer.decodedData) {
//       console.log('Reapplying transient detection...');
//       detectTransients(wavesurfer);
//     }
//   }, 100) // 300ms debounce
// );

document.getElementById('windowSizeKnob').addEventListener(
  'change',
  debounce(() => {
    if (wavesurfer.decodedData) {
      console.log('Reapplying transient detection...');
      detectTransients(wavesurfer);
    }
  }, 100) // 300ms debounce
);

// > ZOOM LEVEL
document.getElementById('zoomLevel').addEventListener('input', (event) => {
  const zoomLevel = parseInt(event.target.value, 10);
  console.log('Zoom Level:', zoomLevel);
  if (wavesurfer) {
    wavesurfer.zoom(zoomLevel); // Apply the zoom level to the waveform
  }
});

// ! DEBUG LOGS
// ? Container Log
// const container = document.querySelector('#waveform');
// console.log('Waveform container:', container);
// console.log(
//   'Container dimensions:',
//   container.offsetWidth,
//   container.offsetHeight
// );

// ? Test if WebAudio is supported on current browser
// console.log(
//   'WebAudio support:',
// / !!window.AudioContext || !!window.webkitAudioContext
// );
