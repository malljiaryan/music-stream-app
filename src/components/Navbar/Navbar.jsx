import "./Navbar.css";

function Navbar({
  searchQuery,
  onSearchChange,
  languageFilter,
  onLanguageChange,
  user,
  onLoginClick,
  onLogout,
}) {
  const primaryLanguages = ["hi", "en", "bhojpuri", "haryanvi"];
  const primaryLanguageValue = primaryLanguages.includes(languageFilter)
    ? languageFilter
    : "other";

  return (
    <header className="navbar">
      <div className="navbar-logo">
        <span>🎵</span>
        <h2>Music Stream</h2>
      </div>

      <div className="navbar-search">
        <input
          type="text"
          placeholder="Search for songs, artists..."
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        {searchQuery && (
          <button
            type="button"
            className="navbar-search-clear"
            aria-label="Clear search"
            onClick={() => onSearchChange("")}
          >
            x
          </button>
        )}
      </div>

      <div className="navbar-filter">
        <select
          value={primaryLanguageValue}
          aria-label="Filter songs by language"
          onChange={(event) => {
            if (event.target.value === "other") {
              onLanguageChange("bn");
              return;
            }

            onLanguageChange(event.target.value);
          }}
        >
          <option value="hi">Hindi</option>
          <option value="en">English</option>
          <option value="bhojpuri">Bhojpuri</option>
          <option value="haryanvi">Haryanvi</option>
          <option value="other">Other</option>
        </select>

        {primaryLanguageValue === "other" && (
          <select
            value={languageFilter}
            aria-label="Choose other language"
            onChange={(event) => onLanguageChange(event.target.value)}
          >
          <optgroup label="Other Indian languages">
            <option value="bn">Bengali</option>
            <option value="ta">Tamil</option>
            <option value="te">Telugu</option>
            <option value="mr">Marathi</option>
            <option value="gu">Gujarati</option>
            <option value="pa">Punjabi</option>
            <option value="ml">Malayalam</option>
            <option value="kn">Kannada</option>
            <option value="ur">Urdu</option>
          </optgroup>
          <optgroup label="Foreign languages">
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
            <option value="pt">Portuguese</option>
            <option value="ar">Arabic</option>
            <option value="ja">Japanese</option>
            <option value="ko">Korean</option>
          </optgroup>
          </select>
        )}
      </div>

      <div className="navbar-user">
        {user ? (
          <>
            <span>{user.name}</span>
            <button type="button" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <button type="button" onClick={onLoginClick}>Login</button>
        )}
      </div>
    </header>
  );
}

export default Navbar;
