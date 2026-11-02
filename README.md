# Music Stream App

A React + Vite music streaming app using the Jamendo API.

The app supports:

- Real music data from Jamendo
- Song search
- Language filtering
- Real audio playback
- Albums and artists
- Favorites
- Playlists
- Recently played songs
- Local login/signup using browser localStorage

## Requirements

Install these before running the project on another computer:

- Node.js
- npm
- A Jamendo API client id

Check Node and npm:

```bash
node -v
npm -v
```

## Setup After Extracting ZIP

1. Extract the ZIP file.

2. Open the project folder in terminal:

```bash
cd "Music stream app"
```

3. Install dependencies:

```bash
npm install
```

4. Create a `.env.local` file in the project root.

5. Add your Jamendo API key:

```env
VITE_JAMENDO_CLIENT_ID=your_jamendo_client_id
```

You can also copy `.env.example` and rename the copy to `.env.local`.

## Run The App

Start the development server:

```bash
npm run dev
```

Then open the local URL shown in the terminal, usually:

```txt
http://localhost:5173/
```

If port `5173` is busy, Vite will show another port such as `5174`.

## Useful Commands

Run app locally:

```bash
npm run dev
```

Build production files:

```bash
npm run build
```

Check code quality:

```bash
npm run lint
```

Preview production build:

```bash
npm run preview
```

## Important Notes

User data is saved in the browser using `localStorage`.

This means:

- login data is only saved on the same browser
- favorites are only saved on the same browser
- playlists are only saved on the same browser
- recently played songs are only saved on the same browser
- clearing browser data will remove saved app data

For real production use, connect the app to a backend and database.

## Jamendo Language Filter Note

Jamendo accepts only 2-letter language codes for the `lang` API parameter.

Hindi and English use Jamendo language filtering directly.

Bhojpuri and Haryanvi are handled through search terms because Jamendo does not accept their longer language codes in `lang`.

## Main Project Structure

```txt
src/
  App.jsx
  main.jsx
  components/
    Navbar/
    Sidebar/
    Player/
    MusicCard/
    SongRow/
    AlbumCard/
    ArtistCard/
    AuthModal/
  pages/
    Home/
    Collection/
  services/
    musicService.js
    appDataService.js
```

## Troubleshooting

If songs do not load:

- check `.env.local`
- check your Jamendo client id
- restart the dev server after changing `.env.local`

If dependencies are missing:

```bash
npm install
```

If the browser shows old data:

- refresh the page
- restart `npm run dev`
- clear browser localStorage only if you want to remove saved users/playlists
