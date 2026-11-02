const API_BASE_URL = "https://api.jamendo.com/v3.0";

const clientId = import.meta.env.VITE_JAMENDO_CLIENT_ID;

const languageSearchTerms = {
  bhojpuri: "bhojpuri",
  haryanvi: "haryanvi",
};

function withLanguage(params, language) {
  if (!language || language === "all") {
    return params;
  }

  const searchTerm = languageSearchTerms[language];

  if (searchTerm) {
    return {
      ...params,
      search: [params.search, searchTerm].filter(Boolean).join(" "),
    };
  }

  return {
    ...params,
    lang: language,
  };
}

function buildUrl(endpoint, params = {}) {
  const url = new URL(`${API_BASE_URL}/${endpoint}/`);

  url.searchParams.set("client_id", clientId);
  url.searchParams.set("format", "json");

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  return url;
}

async function request(endpoint, params) {
  if (!clientId) {
    throw new Error("Add VITE_JAMENDO_CLIENT_ID to .env to connect Jamendo.");
  }

  const response = await fetch(buildUrl(endpoint, params));

  if (!response.ok) {
    throw new Error("Unable to connect to Jamendo right now.");
  }

  const data = await response.json();

  if (data.headers?.status !== "success") {
    throw new Error(data.headers?.error_message || "Jamendo returned an error.");
  }

  return data.results || [];
}

function formatDuration(totalSeconds) {
  const seconds = Number(totalSeconds);

  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "--:--";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function mapTrack(track) {
  return {
    id: track.id,
    title: track.name,
    artist: track.artist_name,
    album: track.album_name,
    duration: formatDuration(track.duration),
    imageUrl: track.image || track.album_image,
    audioUrl: track.audio,
    shareUrl: track.shareurl,
  };
}

function mapAlbum(album) {
  return {
    id: album.id,
    title: album.name,
    artist: album.artist_name,
    imageUrl: album.image,
    releaseDate: album.releasedate,
  };
}

function mapArtist(artist) {
  return {
    id: artist.id,
    name: artist.name,
    imageUrl: artist.image,
    shareUrl: artist.shareurl,
  };
}

function mapAlbumTrack(album, track) {
  return mapTrack({
    ...track,
    album_name: album.name,
    artist_name: album.artist_name,
    image: track.image || album.image,
    album_image: album.image,
  });
}

function mapArtistTrack(artist, track) {
  return mapTrack({
    ...track,
    name: track.name || track.track_name,
    artist_name: artist.name,
    image: track.image || track.album_image || artist.image,
  });
}

export async function getFeaturedTracks(limit = 4, language = "all") {
  const tracks = await request(
    "tracks",
    withLanguage(
      {
        limit,
        order: "popularity_month",
        groupby: "artist_id",
        imagesize: "300",
        audioformat: "mp32",
        type: "single albumtrack",
      },
      language,
    ),
  );

  return tracks.map(mapTrack);
}

export async function getNewTracks(limit = 20, language = "all") {
  const tracks = await request(
    "tracks",
    withLanguage(
      {
        limit,
        order: "releasedate_desc",
        groupby: "artist_id",
        imagesize: "300",
        audioformat: "mp32",
        type: "single albumtrack",
      },
      language,
    ),
  );

  return tracks.map(mapTrack);
}

export async function getPopularTracks(limit = 5, language = "all") {
  const tracks = await request(
    "tracks",
    withLanguage(
      {
        limit,
        order: "popularity_month",
        groupby: "artist_id",
        imagesize: "300",
        audioformat: "mp32",
        type: "single albumtrack",
      },
      language,
    ),
  );

  return tracks.map(mapTrack);
}

export async function getTrendingAlbums(limit = 4) {
  const albums = await request("albums", {
    limit,
    order: "popularity_week",
    imagesize: "300",
    type: "album",
  });

  return albums.map(mapAlbum);
}

export async function getTopAlbums(limit = 24) {
  const albums = await request("albums", {
    limit,
    order: "popularity_month",
    imagesize: "300",
    type: "single album",
  });

  return albums.map(mapAlbum);
}

export async function getTopArtists(limit = 32) {
  const artists = await request("artists", {
    limit,
    order: "popularity_month",
    hasimage: "1",
  });

  return artists.map(mapArtist);
}

export async function getNewArtists(limit = 24) {
  const artists = await request("artists", {
    limit,
    order: "joindate_desc",
    hasimage: "1",
  });

  return artists.map(mapArtist);
}

export async function getAlbumTracks(albumId) {
  const albums = await request("albums/tracks", {
    id: albumId,
    limit: "1",
    imagesize: "300",
    audioformat: "mp32",
    type: "album",
  });

  const album = albums[0];

  if (!album) {
    return [];
  }

  return (album.tracks || []).map((track) => mapAlbumTrack(album, track));
}

export async function getArtistTracks(artistId) {
  const artists = await request("artists/tracks", {
    id: artistId,
    limit: "1",
    track_type: "single albumtrack",
    imagesize: "300",
    audioformat: "mp32",
  });

  const artist = artists[0];

  if (!artist) {
    return [];
  }

  return (artist.tracks || []).map((track) => mapArtistTrack(artist, track));
}

export async function searchMusic(query, limit = 8, language = "all") {
  const cleanQuery = query.trim();

  if (!cleanQuery) {
    return [];
  }

  const tracks = await request(
    "tracks",
    withLanguage(
      {
        limit,
        search: cleanQuery,
        boost: "popularity_month",
        imagesize: "300",
        audioformat: "mp32",
        type: "single albumtrack",
      },
      language,
    ),
  );

  return tracks.map(mapTrack);
}

export async function testJamendoConnection() {
  const tracks = await request("tracks", {
    limit: "1",
    imagesize: "100",
    audioformat: "mp32",
    type: "single albumtrack",
  });

  return tracks.length > 0;
}