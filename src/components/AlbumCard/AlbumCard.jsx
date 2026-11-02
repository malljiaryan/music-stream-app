import "./AlbumCard.css";

function AlbumCard({ album, onOpen }) {
  return (
    <div
      className="album-card"
      onClick={onOpen}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onKeyDown={(event) => {
        if (onOpen && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onOpen();
        }
      }}
    >
      <div className="album-cover-wrapper">
        <div className="album-cover">
          {album.imageUrl ? (
            <img src={album.imageUrl} alt={album.title} />
          ) : (
            "💿"
          )}
        </div>

        <button
          type="button"
          className="album-play-button"
          aria-label={`Open ${album.title}`}
          onClick={(event) => {
            event.stopPropagation();
            onOpen?.();
          }}
        >
          ▶
        </button>
      </div>

      <div className="album-card-info">
        <h3>{album.title}</h3>
        <p>{album.artist}</p>
      </div>
    </div>
  );
}

export default AlbumCard;
