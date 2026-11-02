import "./Collection.css";

import AlbumCard from "../../components/AlbumCard/AlbumCard";
import ArtistCard from "../../components/ArtistCard/ArtistCard";
import SongRow from "../../components/SongRow/SongRow";
import { useEffect, useState } from "react";
import {
  getAlbumTracks,
  getNewArtists,
  getTopAlbums,
  getTopArtists,
  getArtistTracks,
} from "../../services/musicService";

function Collection({
  view,
  favorites,
  recentlyPlayed,
  playlists,
  onPlaySong,
  onToggleFavorite,
  onAddToPlaylist,
  onCreatePlaylist,
  isFavorite,
}) {
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [newArtists, setNewArtists] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("idle");
  const [status, setStatus] = useState("loading");
  const [playlistName, setPlaylistName] = useState("");

  useEffect(() => {
    let isActive = true;

    if (view !== "library") {
      return undefined;
    }

    async function loadLibrary() {
      try {
        setStatus("loading");
        setSelectedTitle("");
        setSelectedTracks([]);
        setSelectedStatus("idle");

        const [nextAlbums, nextArtists, latestArtists] = await Promise.all([
          getTopAlbums(24),
          getTopArtists(32),
          getNewArtists(24),
        ]);

        if (!isActive) {
          return;
        }

        setAlbums(nextAlbums);
        setArtists(nextArtists);
        setNewArtists(latestArtists);
        setStatus("ready");
      } catch (error) {
        if (!isActive) {
          return;
        }

        setStatus(error.message);
      }
    }

    loadLibrary();

    return () => {
      isActive = false;
    };
  }, [view]);

  async function openAlbum(album) {
    setSelectedTitle(album.title);
    setSelectedTracks([]);
    setSelectedStatus("loading");

    try {
      const tracks = await getAlbumTracks(album.id);
      setSelectedTracks(tracks);
      setSelectedStatus("ready");
    } catch {
      setSelectedTracks([]);
      setSelectedStatus("error");
    }
  }

  async function openArtist(artist) {
    setSelectedTitle(artist.name);
    setSelectedTracks([]);
    setSelectedStatus("loading");

    try {
      const tracks = await getArtistTracks(artist.id);
      setSelectedTracks(tracks);
      setSelectedStatus("ready");
    } catch {
      setSelectedTracks([]);
      setSelectedStatus("error");
    }
  }

  function submitPlaylist(event) {
    event.preventDefault();

    if (!playlistName.trim()) {
      return;
    }

    onCreatePlaylist(playlistName);
    setPlaylistName("");
  }

  function renderSongs(title, songs, emptyText) {
    return (
      <section className="collection-section">
        <div className="section-header">
          <h2>{title}</h2>
        </div>

        {songs.length === 0 ? (
          <div className="api-message">{emptyText}</div>
        ) : (
          <div className="song-list">
            {songs.map((song, index) => (
              <SongRow
                key={song.id}
                song={song}
                index={index}
                isFavorite={isFavorite(song.id)}
                playlists={playlists}
                onPlay={() => onPlaySong(song, songs)}
                onToggleFavorite={() => onToggleFavorite(song)}
                onAddToPlaylist={onAddToPlaylist}
              />
            ))}
          </div>
        )}
      </section>
    );
  }

  if (view === "favorites") {
    return renderSongs("Favorites", favorites, "Favorite songs will appear here.");
  }

  if (view === "recent") {
    return renderSongs(
      "Recently Played",
      recentlyPlayed,
      "Songs you play will appear here.",
    );
  }

  if (view === "playlists") {
    return (
      <div className="collection-page">
        <section className="collection-section">
          <div className="section-header">
            <h2>Playlists</h2>
          </div>

          <form className="playlist-form" onSubmit={submitPlaylist}>
            <input
              type="text"
              placeholder="New playlist name"
              value={playlistName}
              onChange={(event) => setPlaylistName(event.target.value)}
            />
            <button type="submit">Create</button>
          </form>

          {playlists.length === 0 ? (
            <div className="api-message">Create your first playlist.</div>
          ) : (
            <div className="playlist-grid">
              {playlists.map((playlist) => (
                <div className="playlist-panel" key={playlist.id}>
                  <div className="playlist-panel-header">
                    <h3>{playlist.name}</h3>
                    <span>{playlist.tracks.length} songs</span>
                  </div>

                  {playlist.tracks.length === 0 ? (
                    <p className="playlist-empty">Add songs from any track row.</p>
                  ) : (
                    <div className="song-list">
                      {playlist.tracks.map((song, index) => (
                        <SongRow
                          key={song.id}
                          song={song}
                          index={index}
                          isFavorite={isFavorite(song.id)}
                          playlists={playlists}
                          onPlay={() => onPlaySong(song, playlist.tracks)}
                          onToggleFavorite={() => onToggleFavorite(song)}
                          onAddToPlaylist={onAddToPlaylist}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="collection-page">
      <section className="collection-section">
        <div className="section-header">
          <h2>Albums</h2>
        </div>

        {status === "loading" ? (
          <div className="api-message">Loading albums and artists...</div>
        ) : status !== "ready" ? (
          <div className="api-message api-message-error">{status}</div>
        ) : (
          <div className="music-grid">
            {albums.map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                onOpen={() => openAlbum(album)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="collection-section">
        <div className="section-header">
          <h2>Popular Artists</h2>
        </div>

        {status === "ready" && (
          <div className="music-grid">
            {artists.map((artist) => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                onOpen={openArtist}
              />
            ))}
          </div>
        )}
      </section>

      <section className="collection-section">
        <div className="section-header">
          <h2>New Artists</h2>
        </div>

        {status === "ready" && (
          <div className="music-grid">
            {newArtists.map((artist) => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                onOpen={openArtist}
              />
            ))}
          </div>
        )}
      </section>

      {selectedTitle && (
        <section className="collection-section">
          <div className="section-header">
            <h2>{selectedTitle}</h2>
          </div>

          {selectedStatus === "loading" && (
            <div className="api-message">Loading tracks...</div>
          )}

          {selectedStatus === "error" && (
            <div className="api-message api-message-error">
              Could not load tracks.
            </div>
          )}

          {selectedStatus === "ready" && selectedTracks.length === 0 && (
            <div className="api-message">No tracks found.</div>
          )}

          {selectedTracks.length > 0 && (
            <div className="song-list">
              {selectedTracks.map((song, index) => (
                <SongRow
                  key={song.id}
                  song={song}
                  index={index}
                  isFavorite={isFavorite(song.id)}
                  playlists={playlists}
                  onPlay={() => onPlaySong(song, selectedTracks)}
                  onToggleFavorite={() => onToggleFavorite(song)}
                  onAddToPlaylist={onAddToPlaylist}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default Collection;
