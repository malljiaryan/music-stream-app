import "./Home.css";

import MusicCard from "../../components/MusicCard/MusicCard";
import SongRow from "../../components/SongRow/SongRow";
import AlbumCard from "../../components/AlbumCard/AlbumCard";
import { useEffect, useState } from "react";
import {
  getFeaturedTracks,
  getAlbumTracks,
  getNewTracks,
  getPopularTracks,
  getTrendingAlbums,
  searchMusic,
} from "../../services/musicService";

function Home({
  searchMode,
  searchQuery,
  languageFilter,
  onPlaySong,
  onToggleFavorite,
  onAddToPlaylist,
  playlists,
  isFavorite,
}) {
  const [featuredTracks, setFeaturedTracks] = useState([]);
  const [newTracks, setNewTracks] = useState([]);
  const [popularSongs, setPopularSongs] = useState([]);
  const [trendingAlbums, setTrendingAlbums] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    featured: false,
    new: false,
    popular: false,
    albums: false,
  });
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedAlbumTracks, setSelectedAlbumTracks] = useState([]);
  const [albumStatus, setAlbumStatus] = useState("idle");
  const [homeStatus, setHomeStatus] = useState("loading");
  const [searchStatus, setSearchStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadHomeMusic() {
      try {
        setHomeStatus("loading");
        setError("");

        const [featured, latest, popular, albums] = await Promise.all([
          getFeaturedTracks(12, languageFilter),
          getNewTracks(20, languageFilter),
          getPopularTracks(20, languageFilter),
          getTrendingAlbums(20),
        ]);

        if (!isActive) {
          return;
        }

        setFeaturedTracks(featured);
        setNewTracks(latest);
        setPopularSongs(popular);
        setTrendingAlbums(albums);
        setHomeStatus("ready");
      } catch (homeError) {
        if (!isActive) {
          return;
        }

        setError(homeError.message);
        setHomeStatus("error");
      }
    }

    loadHomeMusic();

    return () => {
      isActive = false;
    };
  }, [languageFilter]);

  useEffect(() => {
    const cleanQuery = searchQuery.trim();
    let isActive = true;

    if (!cleanQuery) {
      setSearchResults([]);
      setSearchStatus("idle");
      return undefined;
    }

    setSearchStatus("loading");

    const searchTimer = setTimeout(async () => {
      try {
        const results = await searchMusic(cleanQuery, 20, languageFilter);

        if (!isActive) {
          return;
        }

        setSearchResults(results);
        setSearchStatus("ready");
      } catch {
        if (!isActive) {
          return;
        }

        setSearchResults([]);
        setSearchStatus("error");
      }
    }, 350);

    return () => {
      isActive = false;
      clearTimeout(searchTimer);
    };
  }, [searchQuery, languageFilter]);

  const isSearching = searchMode || searchQuery.trim().length > 0;
  const visibleFeaturedTracks = expandedSections.featured
    ? featuredTracks
    : featuredTracks.slice(0, 4);
  const visibleNewTracks = expandedSections.new
    ? newTracks
    : newTracks.slice(0, 5);
  const visiblePopularSongs = expandedSections.popular
    ? popularSongs
    : popularSongs.slice(0, 5);
  const visibleTrendingAlbums = expandedSections.albums
    ? trendingAlbums
    : trendingAlbums.slice(0, 4);

  function toggleSection(section) {
    setExpandedSections((currentSections) => ({
      ...currentSections,
      [section]: !currentSections[section],
    }));
  }

  async function openAlbum(album) {
    setSelectedAlbum(album);
    setSelectedAlbumTracks([]);
    setAlbumStatus("loading");

    try {
      const tracks = await getAlbumTracks(album.id);
      setSelectedAlbumTracks(tracks);
      setAlbumStatus("ready");
    } catch {
      setAlbumStatus("error");
    }
  }

  return (
    <div className="home-page">

      {/* Welcome */}

      <section className="home-welcome">
        <h1>{isSearching ? "Search" : "Welcome back 👋"}</h1>
        <p>
          {isSearching
            ? "Results from Jamendo's independent music catalog."
            : "Discover music you'll love."}
        </p>
      </section>

      {homeStatus === "error" && (
        <div className="api-message api-message-error">
          {error || "Could not load music. Please try again later."}
        </div>
      )}

      {homeStatus === "loading" && (
        <div className="api-message">
          Loading music from Jamendo...
        </div>
      )}

      {isSearching && (
        <section className="popular-section">
          <div className="section-header">
            <h2>Search Results</h2>
          </div>

          {!searchQuery.trim() && (
            <div className="api-message">
              Type a song, artist, or album name in the search box.
            </div>
          )}

          {searchStatus === "loading" && (
            <div className="api-message">
              Searching Jamendo...
            </div>
          )}

          {searchStatus === "error" && (
            <div className="api-message api-message-error">
              Search is unavailable right now.
            </div>
          )}

          {searchStatus === "ready" && searchResults.length === 0 && (
            <div className="api-message">
              No results found.
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="song-list">
              {searchResults.map((song, index) => (
                <SongRow
                  key={song.id}
                  song={song}
                  index={index}
                  isFavorite={isFavorite(song.id)}
                  playlists={playlists}
                  onPlay={() => onPlaySong(song, searchResults)}
                  onToggleFavorite={() => onToggleFavorite(song)}
                  onAddToPlaylist={onAddToPlaylist}
                />
              ))}
            </div>
          )}
        </section>
      )}


      {/* Recently Played */}

      {!isSearching && homeStatus === "ready" && (
        <>
          <section className="music-section">
            <div className="section-header">
              <h2>Featured Tracks</h2>
              <button type="button" onClick={() => toggleSection("featured")}>
                {expandedSections.featured ? "Show Less" : "See All"}
              </button>
            </div>

            <div className="music-grid">
              {visibleFeaturedTracks.map((song) => (
                <MusicCard
                  key={song.id}
                  song={song}
                  isFavorite={isFavorite(song.id)}
                  onPlay={() => onPlaySong(song, featuredTracks)}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          </section>


          {/* New Releases */}

          <section className="popular-section">
            <div className="section-header">
              <h2>New Releases</h2>
              <button type="button" onClick={() => toggleSection("new")}>
                {expandedSections.new ? "Show Less" : "See All"}
              </button>
            </div>

            <div className="song-list">
              {visibleNewTracks.map((song, index) => (
                <SongRow
                  key={song.id}
                  song={song}
                  index={index}
                  isFavorite={isFavorite(song.id)}
                  playlists={playlists}
                  onPlay={() => onPlaySong(song, newTracks)}
                  onToggleFavorite={() => onToggleFavorite(song)}
                  onAddToPlaylist={onAddToPlaylist}
                />
              ))}
            </div>
          </section>


          {/* Popular Songs */}

          <section className="popular-section">
            <div className="section-header">
              <h2>Popular Songs</h2>
              <button type="button" onClick={() => toggleSection("popular")}>
                {expandedSections.popular ? "Show Less" : "See All"}
              </button>
            </div>

            <div className="song-list">
              {visiblePopularSongs.map((song, index) => (
                <SongRow
                  key={song.id}
                  song={song}
                  index={index}
                  isFavorite={isFavorite(song.id)}
                  playlists={playlists}
                  onPlay={() => onPlaySong(song, popularSongs)}
                  onToggleFavorite={() => onToggleFavorite(song)}
                  onAddToPlaylist={onAddToPlaylist}
                />
              ))}
            </div>
          </section>

          <section className="music-section trending-albums-section">
            <div className="section-header">
              <h2>Trending Albums</h2>
              <button type="button" onClick={() => toggleSection("albums")}>
                {expandedSections.albums ? "Show Less" : "See All"}
              </button>
            </div>

            <div className="music-grid">
              {visibleTrendingAlbums.map((album) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  onOpen={() => openAlbum(album)}
                />
              ))}
            </div>
          </section>

          {selectedAlbum && (
            <section className="popular-section">
              <div className="section-header">
                <h2>{selectedAlbum.title}</h2>
                <button type="button" onClick={() => setSelectedAlbum(null)}>
                  Close
                </button>
              </div>

              {albumStatus === "loading" && (
                <div className="api-message">Loading album tracks...</div>
              )}

              {albumStatus === "error" && (
                <div className="api-message api-message-error">
                  Could not load this album.
                </div>
              )}

              {albumStatus === "ready" && selectedAlbumTracks.length === 0 && (
                <div className="api-message">No tracks found for this album.</div>
              )}

              {selectedAlbumTracks.length > 0 && (
                <div className="song-list">
                  {selectedAlbumTracks.map((song, index) => (
                    <SongRow
                      key={song.id}
                      song={song}
                      index={index}
                      isFavorite={isFavorite(song.id)}
                      playlists={playlists}
                      onPlay={() => onPlaySong(song, selectedAlbumTracks)}
                      onToggleFavorite={() => onToggleFavorite(song)}
                      onAddToPlaylist={onAddToPlaylist}
                    />
                  ))}
                </div>
              )}
            </section>
          )}
        </>
      )}

    </div>
  );
}

export default Home;
