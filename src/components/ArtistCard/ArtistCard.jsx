import "./ArtistCard.css";

function ArtistCard({ artist, onOpen }) {
  return (
    <button type="button" className="artist-card" onClick={() => onOpen(artist)}>
      <div className="artist-image">
        {artist.imageUrl ? (
          <img src={artist.imageUrl} alt={artist.name} />
        ) : (
          "🎤"
        )}
      </div>

      <div className="artist-card-info">
        <h3>{artist.name}</h3>
        <p>Artist</p>
      </div>
    </button>
  );
}

export default ArtistCard;
