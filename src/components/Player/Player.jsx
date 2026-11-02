import "./Player.css";

import { useEffect, useRef, useState } from "react";

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function Player({
  currentSong,
  isPlaying,
  volume,
  onPlayPause,
  onNext,
  onPrevious,
  onEnded,
  onVolumeChange,
  onAudioPlayingChange,
}) {
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !currentSong?.audioUrl) {
      return;
    }

    audio.volume = volume;

    if (isPlaying) {
      audio.play().catch(() => onAudioPlayingChange(false));
    } else {
      audio.pause();
    }
  }, [currentSong, isPlaying, volume, onAudioPlayingChange]);

  function handleProgressChange(event) {
    const audio = audioRef.current;
    const nextProgress = Number(event.target.value);

    if (!audio || !duration) {
      return;
    }

    audio.currentTime = (nextProgress / 100) * duration;
    setProgress(nextProgress);
  }

  return (
    <footer className="player">
      <div className="player-song">
        <div className="player-cover">
          {currentSong?.imageUrl ? (
            <img src={currentSong.imageUrl} alt={currentSong.title} />
          ) : (
            "🎵"
          )}
        </div>

        <div>
          <h4>{currentSong?.title || "No song playing"}</h4>
          <p>{currentSong?.artist || "Select a song to start playing"}</p>
        </div>
      </div>

      <div className="player-center">
        <div className="player-controls">
          <button type="button" onClick={onPrevious} aria-label="Previous song">
            ⏮
          </button>
          <button type="button" onClick={onPlayPause} aria-label="Play or pause">
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button type="button" onClick={onNext} aria-label="Next song">
            ⏭
          </button>
        </div>

        <div className="player-progress">
          <span>{formatTime((progress / 100) * duration)}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="player-volume">
        🔊
        <input
          type="range"
          min="0"
          max="100"
          value={Math.round(volume * 100)}
          onChange={(event) => onVolumeChange(Number(event.target.value) / 100)}
        />
      </div>

      {currentSong?.audioUrl && (
        <audio
          ref={audioRef}
          src={currentSong.audioUrl}
          onEnded={onEnded}
          onPlay={() => onAudioPlayingChange(true)}
          onPause={() => onAudioPlayingChange(false)}
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
          onTimeUpdate={(event) => {
            const audio = event.currentTarget;
            setProgress(
              audio.duration ? (audio.currentTime / audio.duration) * 100 : 0,
            );
          }}
        />
      )}
    </footer>
  );
}

export default Player;
