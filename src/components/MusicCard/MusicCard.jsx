import "./MusicCard.css";

function MusicCard({ song, isFavorite, onPlay, onToggleFavorite }) {
  return (
    <div className="music-card">
      <div className="music-cover-wrapper">
        <div className="music-cover">
          {song.imageUrl ? (
            <img src={song.imageUrl} alt={song.title} />
          ) : (
            "🎵"
          )}
        </div>

        <button
          type="button"
          className="card-play-button"
          aria-label={`Play ${song.title}`}
          onClick={() => onPlay(song)}
        >
          ▶
        </button>
      </div>

      <div className="music-card-info">
        <h3>{song.title}</h3>
        <p>{song.artist}</p>
      </div>

      <button
        type="button"
        className={isFavorite ? "card-favorite active" : "card-favorite"}
        onClick={() => onToggleFavorite(song)}
      >
        {isFavorite ? "♥ Saved" : "♡ Save"}
      </button>
    </div>
  );
}

export default MusicCard;
