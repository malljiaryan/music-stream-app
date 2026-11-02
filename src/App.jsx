import "./App.css";

import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Player from "./components/Player/Player";
import AuthModal from "./components/AuthModal/AuthModal";
import Home from "./pages/Home/Home";
import Collection from "./pages/Collection/Collection";
import { useCallback, useEffect, useState } from "react";
import {
  getCurrentUser,
  loadUserLibrary,
  saveFavorites,
  savePlaylists,
  saveRecentlyPlayed,
  signInUser,
  signOutUser,
  signUpUser,
} from "./services/appDataService";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState("hi");
  const [activeView, setActiveView] = useState("home");
  const [user, setUser] = useState(() => getCurrentUser());
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);

  const userId = user?.id || null;

  useEffect(() => {
    const library = loadUserLibrary(userId);

    setFavorites(library.favorites);
    setRecentlyPlayed(library.recentlyPlayed);
    setPlaylists(library.playlists);
  }, [userId]);

  const rememberRecentlyPlayed = useCallback(
    (song) => {
      const nextRecentlyPlayed = [
        song,
        ...recentlyPlayed.filter((recentSong) => recentSong.id !== song.id),
      ].slice(0, 20);

      setRecentlyPlayed(nextRecentlyPlayed);
      saveRecentlyPlayed(userId, nextRecentlyPlayed);
    },
    [recentlyPlayed, userId],
  );

  const playSong = useCallback(
    (song, songs = [song]) => {
      const playableSongs = songs.filter((nextSong) => nextSong.audioUrl);
      const nextQueue = playableSongs.length > 0 ? playableSongs : [song];
      const nextIndex = Math.max(
        nextQueue.findIndex((nextSong) => nextSong.id === song.id),
        0,
      );

      setQueue(nextQueue);
      setQueueIndex(nextIndex);
      setCurrentSong(song);
      setIsPlaying(Boolean(song.audioUrl));
      rememberRecentlyPlayed(song);
    },
    [rememberRecentlyPlayed],
  );

  function requireUser() {
    if (user) {
      return true;
    }

    setShowAuthModal(true);
    return false;
  }

  function toggleFavorite(song) {
    if (!requireUser()) {
      return;
    }

    const isAlreadyFavorite = favorites.some(
      (favoriteSong) => favoriteSong.id === song.id,
    );
    const nextFavorites = isAlreadyFavorite
      ? favorites.filter((favoriteSong) => favoriteSong.id !== song.id)
      : [song, ...favorites];

    setFavorites(nextFavorites);
    saveFavorites(userId, nextFavorites);
  }

  function createPlaylist(name) {
    if (!requireUser()) {
      return;
    }

    const nextPlaylists = [
      {
        id: crypto.randomUUID(),
        name: name.trim(),
        tracks: [],
      },
      ...playlists,
    ];

    setPlaylists(nextPlaylists);
    savePlaylists(userId, nextPlaylists);
  }

  function addToPlaylist(playlistId, song) {
    if (!requireUser()) {
      return;
    }

    const nextPlaylists = playlists.map((playlist) => {
      if (playlist.id !== playlistId) {
        return playlist;
      }

      const hasSong = playlist.tracks.some((track) => track.id === song.id);

      return {
        ...playlist,
        tracks: hasSong ? playlist.tracks : [...playlist.tracks, song],
      };
    });

    setPlaylists(nextPlaylists);
    savePlaylists(userId, nextPlaylists);
  }

  function isFavorite(songId) {
    return favorites.some((song) => song.id === songId);
  }

  function handleNext() {
    if (queue.length === 0) {
      return;
    }

    const nextIndex = (queueIndex + 1) % queue.length;
    const nextSong = queue[nextIndex];

    setQueueIndex(nextIndex);
    setCurrentSong(nextSong);
    setIsPlaying(true);
    rememberRecentlyPlayed(nextSong);
  }

  function handlePrevious() {
    if (queue.length === 0) {
      return;
    }

    const nextIndex = queueIndex === 0 ? queue.length - 1 : queueIndex - 1;
    const nextSong = queue[nextIndex];

    setQueueIndex(nextIndex);
    setCurrentSong(nextSong);
    setIsPlaying(true);
    rememberRecentlyPlayed(nextSong);
  }

  const setAudioPlaying = useCallback((playing) => {
    setIsPlaying(playing);
  }, []);

  function handleSearchChange(query) {
    setSearchQuery(query);

    if (query.trim()) {
      setActiveView("search");
    }
  }

  function handleViewChange(view) {
    setActiveView(view);

    if (view !== "search") {
      setSearchQuery("");
    }
  }

  function handleSignIn(credentials) {
    const signedInUser = signInUser(credentials);
    setUser(signedInUser);
    setShowAuthModal(false);
  }

  function handleSignUp(details) {
    const signedUpUser = signUpUser(details);
    setUser(signedUpUser);
    setShowAuthModal(false);
  }

  function handleLogout() {
    signOutUser();
    setUser(null);
    setActiveView("home");
  }

  function renderContent() {
    if (activeView === "home" || activeView === "search") {
      return (
        <Home
          searchMode={activeView === "search"}
          searchQuery={searchQuery}
          languageFilter={languageFilter}
          playlists={playlists}
          isFavorite={isFavorite}
          onPlaySong={playSong}
          onToggleFavorite={toggleFavorite}
          onAddToPlaylist={addToPlaylist}
        />
      );
    }

    return (
      <Collection
        view={activeView}
        favorites={favorites}
        recentlyPlayed={recentlyPlayed}
        playlists={playlists}
        isFavorite={isFavorite}
        onPlaySong={playSong}
        onToggleFavorite={toggleFavorite}
        onAddToPlaylist={addToPlaylist}
        onCreatePlaylist={createPlaylist}
      />
    );
  }

  return (
    <div className="app">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        languageFilter={languageFilter}
        onLanguageChange={setLanguageFilter}
        user={user}
        onLoginClick={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />

      <div className="app-body">
        <Sidebar activeView={activeView} onViewChange={handleViewChange} />

        <main className="main-content">
          {renderContent()}
        </main>
      </div>

      <Player
        currentSong={currentSong}
        isPlaying={isPlaying}
        volume={volume}
        onPlayPause={() => setIsPlaying((playing) => !playing)}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onEnded={handleNext}
        onVolumeChange={setVolume}
        onAudioPlayingChange={setAudioPlaying}
      />

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
        />
      )}
    </div>
  );
}

export default App;