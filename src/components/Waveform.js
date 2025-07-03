import React, { useEffect } from 'react';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions';

const Waveform = ({ audioFile, waveSurferRef, onSeek, onStop }) => {
  useEffect(() => {
    const initializeWaveSurfer = async () => {
      const WaveSurfer = (await import('wavesurfer.js')).default;

      if (!waveSurferRef.current) {
        // Use only the necessary functionality to create a WaveSurfer instance
        waveSurferRef.current = WaveSurfer.create({
          container: '#waveform',
          waveColor: '#A0A0A0',
          progressColor: '#000000',
          backend: 'WebAudio',
          responsive: true,
          height: 100,
          cursorWidth: 1,
          dragToSeek: true,
          interact: true,
          plugins: [
            RegionsPlugin.create({
              dragSelection: true,
            }),
          ],
        });

        // // ? Mute wavesurfer audio since we have audio playback configured with Tone.js
        waveSurferRef.current.setMuted(true);
        // ? maybe we need to explicitly toggle interaction?
        // waveSurferRef.current.toggleInteraction(true);
        // ? sync the visualizer interactions with tone playback
        waveSurferRef.current.on('click', (progress) => {
          console.log('WaveSurfer seeked to:', progress);
          if (onSeek) {
            // Call the parent-provided onSeek handler
            onSeek(progress);
          }
        });

        //make sure the audio is ready because allowing zoom feature
        waveSurferRef.current.on('ready', () => {
          console.log('WaveSurfer is ready');

          /// confirm a zoom level when waveform loads
          waveSurferRef.current.zoom(100);
          /// Mark as ready with custom property
          waveSurferRef.current.isReady = true;
        });

        // load audiofile into wavesurfer
        if (audioFile) {
          console.log('Loading audio file:', audioFile);
          try {
            console.log('waveSurferRef: ', waveSurferRef);
            console.log('audioFile: ', audioFile);
            waveSurferRef.current.load(audioFile);
          } catch (error) {
            console.error('WaveSurfer failed to load the audio file:', error);
          }
        }
        // Add event listeners if needed
        waveSurferRef.current.on('finish', () => {
          console.log('WaveSurfer finished playback');
          if (onStop) onStop();
        });
      }
    };
    // invoke initializeWavesurfer
    initializeWaveSurfer();
    // return a cleanup function to run on unmount
    return () => {
      if (waveSurferRef.current) {
        // Clean up WaveSurfer instance on unmount
        waveSurferRef.current.destroy();
        waveSurferRef.current = null;
      }
    };
  }, [audioFile, waveSurferRef, onSeek, onStop]); // dependency array

  return (
    <div
      id='waveform'
      className='waveform'
      style={{ width: '100%', height: '100px' }}
    />
  );
};

export default Waveform;
