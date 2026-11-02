import "./Sidebar.css";

const navItems = [
  { id: "home", label: "🏠 Home" },
  { id: "search", label: "🔍 Search" },
  { id: "favorites", label: "❤️ Favorites" },
  { id: "library", label: "📚 Library" },
  { id: "playlists", label: "🎵 Playlists" },
  { id: "recent", label: "⏱ Recent" },
];

function Sidebar({ activeView, onViewChange }) {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={activeView === item.id ? "active" : ""}
                onClick={() => onViewChange(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
