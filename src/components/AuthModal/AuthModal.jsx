import "./AuthModal.css";

import { useState } from "react";

function AuthModal({ onClose, onSignIn, onSignUp }) {
  const [mode, setMode] = useState("signin");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  function updateField(field, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    try {
      setError("");

      if (mode === "signin") {
        onSignIn({
          email: form.email,
          password: form.password,
        });
      } else {
        onSignUp(form);
      }
    } catch (authError) {
      setError(authError.message);
    }
  }

  return (
    <div className="auth-overlay">
      <div className="auth-modal" role="dialog" aria-modal="true">
        <div className="auth-header">
          <div>
            <h2>{mode === "signin" ? "Login" : "Create account"}</h2>
            <p>Save favorites, playlists, and listening history.</p>
          </div>

          <button type="button" onClick={onClose} aria-label="Close login">
            x
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <label>
              Name
              <input
                type="text"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
            />
          </label>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-submit">
            {mode === "signin" ? "Login" : "Sign up"}
          </button>
        </form>

        <button
          type="button"
          className="auth-switch"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        >
          {mode === "signin"
            ? "Need an account? Sign up"
            : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}

export default AuthModal;
