const STORAGE_KEY = "music-stream-app-data";

const defaultData = {
  users: [],
  currentUserId: null,
  libraries: {},
};

function readData() {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    return storedData
      ? { ...defaultData, ...JSON.parse(storedData) }
      : structuredClone(defaultData);
  } catch {
    return structuredClone(defaultData);
  }
}

function toPublicUser(user) {
  return user ? { id: user.id, name: user.name, email: user.email } : null;
}

function writeData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getLibrary(data, userId) {
  const libraryKey = userId || "guest";

  return data.libraries[libraryKey] || {
    favorites: [],
    recentlyPlayed: [],
    playlists: [],
  };
}

function saveLibrary(userId, nextLibrary) {
  const data = readData();
  const libraryKey = userId || "guest";

  data.libraries[libraryKey] = nextLibrary;
  writeData(data);

  return nextLibrary;
}

export function getCurrentUser() {
  const data = readData();
  return toPublicUser(data.users.find((user) => user.id === data.currentUserId));
}

export function signUpUser({ name, email, password }) {
  const data = readData();
  const normalizedEmail = email.trim().toLowerCase();

  if (!name.trim() || !normalizedEmail || !password) {
    throw new Error("Name, email, and password are required.");
  }

  if (data.users.some((user) => user.email === normalizedEmail)) {
    throw new Error("An account with this email already exists.");
  }

  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    password,
  };

  data.users.push(user);
  data.currentUserId = user.id;
  data.libraries[user.id] = getLibrary(data, user.id);
  writeData(data);

  return toPublicUser(user);
}

export function signInUser({ email, password }) {
  const data = readData();
  const normalizedEmail = email.trim().toLowerCase();
  const user = data.users.find(
    (storedUser) =>
      storedUser.email === normalizedEmail && storedUser.password === password,
  );

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  data.currentUserId = user.id;
  writeData(data);

  return toPublicUser(user);
}

export function signOutUser() {
  const data = readData();
  data.currentUserId = null;
  writeData(data);
}

export function loadUserLibrary(userId) {
  return getLibrary(readData(), userId);
}

export function saveFavorites(userId, favorites) {
  const library = loadUserLibrary(userId);
  return saveLibrary(userId, {
    ...library,
    favorites,
  });
}

export function saveRecentlyPlayed(userId, recentlyPlayed) {
  const library = loadUserLibrary(userId);
  return saveLibrary(userId, {
    ...library,
    recentlyPlayed,
  });
}

export function savePlaylists(userId, playlists) {
  const library = loadUserLibrary(userId);
  return saveLibrary(userId, {
    ...library,
    playlists,
  });
}
