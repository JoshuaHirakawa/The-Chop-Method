import React from 'react';

// > Component for audio parameter controls
const Controls = ({ onPlay, onPause, onChop, onShuffle, isPlaying }) => {
  const handlePlayPause = () => {
    isPlaying ? onPause() : onPlay();
  };

  // pass in onShuffle handler as prop
  return (
    <div className='play-pause'>
      <div className='row'>
        <button onClick={onChop}>
          <img
            className='icons'
            src='/food-preparation.png'
            title='chop'
            alt='Chop'
          />
        </button>
        <button onClick={onShuffle}>
          <img
            className='icons'
            src='/arrows.png'
            title='shuffle'
            alt='Shuffle'
          />
        </button>
        {/* <button onClick={handlePlayPause}>
          <img
            className='icons'
            src={isPlaying ? '/pause.png' : '/play.png'}
            title={isPlaying ? 'Pause' : 'Play'}
            alt={isPlaying ? 'Pause' : 'Play'}
          />
        </button> */}
        <button onClick={onPlay}>
          <img className='icons' src='/play.png' title='Play' alt='Play' />
        </button>
        <button onClick={onPause}>
          <img className='icons' src='/pause.png' title='Pause' alt='Pause' />
        </button>
      </div>
    </div>
  );
};

export default Controls;
