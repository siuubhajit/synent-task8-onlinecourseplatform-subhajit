import React, { useRef, useState, useEffect } from 'react';

export const VideoPlayer = ({ src, title, onEnded }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [src]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e) => {
    const time = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.parentElement.requestFullscreen();
      }
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      backgroundColor: '#000',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-lg)'
    }}>
      <video
        ref={videoRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => { setIsPlaying(false); if (onEnded) onEnded(); }}
        onClick={togglePlay}
        style={{ width: '100%', display: 'block', maxHeight: '540px', cursor: 'pointer' }}
      />

      {/* Control Bar Overlay */}
      <div style={{
        padding: '12px 18px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {/* Scrubber */}
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          style={{ width: '100%', cursor: 'pointer', accentColor: '#2563eb' }}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff', fontSize: '13px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button onClick={togglePlay} style={{ color: '#fff', fontSize: '16px' }}>
              {isPlaying ? '⏸' : '▶'}
            </button>

            <span>{formatTime(currentTime)} / {formatTime(duration)}</span>

            <button 
              onClick={() => {
                const nextMuted = !isMuted;
                setIsMuted(nextMuted);
                if (videoRef.current) videoRef.current.muted = nextMuted;
              }}
              style={{ color: '#fff' }}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Speed Selector */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {[0.75, 1, 1.25, 1.5, 2].map(speed => (
                <button
                  key={speed}
                  onClick={() => handleSpeedChange(speed)}
                  style={{
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: playbackSpeed === speed ? '700' : '400',
                    backgroundColor: playbackSpeed === speed ? '#2563eb' : 'rgba(255,255,255,0.15)',
                    color: '#fff'
                  }}
                >
                  {speed}x
                </button>
              ))}
            </div>

            <button onClick={toggleFullscreen} style={{ color: '#fff', fontSize: '15px' }} title="Toggle Fullscreen">
              ⛶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
