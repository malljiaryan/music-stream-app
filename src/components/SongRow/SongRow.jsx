import "./SongRow.css";

function SongRow({
  song,
  index,
  isFavorite,
  playlists = [],
  onPlay,
  onToggleFavorite,
  onAddToPlaylist,
}) {
  return (
    <div className="song-row">

      <div className="song-number">
        {index + 1}
      </div>

      <div className="song-info">
        <div className="song-thumbnail">
          {song.imageUrl ? (
            <img src={song.imageUrl} alt={song.title} />
          ) : (
            "🎵"
          )}
        </div>

        <div className="song-details">
          <h3>{song.title}</h3>
          <p>{song.artist}</p>
        </div>
      </div>

      <div className="song-duration">
        {song.duration}
      </div>

      <button
        type="button"
        className="song-play-button"
        aria-label={`Play ${song.title}`}
        onClick={onPlay}
      >
        ▶
      </button>

      <div className="song-actions">
        <button
          type="button"
          className={isFavorite ? "song-action active" : "song-action"}
          onClick={onToggleFavorite}
          aria-label={isFavorite ? `Remove ${song.title} from favorites` : `Save ${song.title}`}
        >
          {isFavorite ? "♥" : "♡"}
        </button>

        {playlists.length > 0 && (
          <select
            className="song-playlist-select"
            value=""
            aria-label={`Add ${song.title} to playlist`}
            onChange={(event) => onAddToPlaylist(event.target.value, song)}
          >
            <option value="" disabled>
              +
            </option>
            {playlists.map((playlist) => (
              <option key={playlist.id} value={playlist.id}>
                {playlist.name}
              </option>
            ))}
          </select>
        )}
      </div>

    </div>
  );
}

export default SongRow;