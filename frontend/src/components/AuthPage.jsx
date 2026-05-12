import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api/auth";

const API = "http://localhost:8000";

function Field({ label, type = "text", value, onChange, error, icon }) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  return (
    <div style={{ position: "relative", marginBottom: 18 }}>
      <div style={{
        display: "flex", alignItems: "center",
        border: `1.5px solid ${error ? "#e74c3c" : focused ? "#c084fc" : "#2d2d3a"}`,
        borderRadius: 10, background: "#16162a", transition: "border-color .2s",
      }}>
        <span style={{ padding: "0 0 0 14px", color: "#6b6b8a", fontSize: 16 }}>{icon}</span>
        <div style={{ flex: 1, position: "relative", height: 52 }}>
          <label style={{
            position: "absolute", left: 10,
            top: active ? 7 : "50%",
            transform: active ? "none" : "translateY(-50%)",
            fontSize: active ? 10 : 14,
            color: focused ? "#c084fc" : "#6b6b8a",
            transition: "all .18s", pointerEvents: "none",
            letterSpacing: active ? 1 : 0,
            textTransform: active ? "uppercase" : "none",
          }}>{label}</label>
          <input
            type={type} value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              position: "absolute", bottom: 0, left: 10, right: 0, height: 30,
              background: "transparent", border: "none", outline: "none",
              color: "#f0f0ff", fontSize: 15, width: "calc(100% - 10px)",
            }}
          />
        </div>
      </div>
      {error && <p style={{ color: "#e74c3c", fontSize: 11, margin: "4px 0 0 4px" }}>{error}</p>}
    </div>
  );
}

export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/", { replace: true });
  }, []);

  const validate = () => {
    const e = {};
    if (mode === "register" && name.trim().length < 2)
      e.name = "Name must be at least 2 characters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Enter a valid email address";
    if (password.length < 8)
      e.password = "Password must be at least 8 characters";
    return e;
  };

  const handleSubmit = async () => {
    setServerError("");
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);

    const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
    const body = mode === "login"
      ? { email, password }
      : { email, password, name };

    try {
      const r = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.detail || "Something went wrong");
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/", { replace: true });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(m => m === "login" ? "register" : "login");
    setErrors({}); setServerError("");
    setName(""); setEmail(""); setPassword("");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0b0b14", display: "flex", fontFamily: "system-ui, sans-serif" }}>

      {/* ── Left branding panel ── */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "60px 80px", background: "#0f0f1e", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(192,132,252,0.12) 0%, transparent 70%)", top: -100, left: -100, pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(129,140,248,0.1) 0%, transparent 70%)", bottom: 0, right: 0, pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 64 }}>
            <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #c084fc, #818cf8)", borderRadius: 8 }} />
            <span style={{ fontSize: 20, fontWeight: 800, color: "#f0f0ff" }}>SpendWise</span>
          </div>

          <h1 style={{ fontSize: 48, fontWeight: 800, color: "#f0f0ff", lineHeight: 1.15, margin: "0 0 20px", letterSpacing: -1 }}>
            Every rupee,<br />
            <span style={{ background: "linear-gradient(90deg, #c084fc, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              accounted for.
            </span>
          </h1>

          <p style={{ color: "#6b6b8a", fontSize: 15, lineHeight: 1.75, maxWidth: 360, margin: "0 0 48px" }}>
            Track spending across categories, set budgets, and understand your financial patterns — all in one place.
          </p>

          {[
            ["📊", "Visual analytics by category and month"],
            ["🔔", "Budget alerts before you overspend"],
            ["🔒", "JWT-secured, your data stays private"],
          ].map(([icon, text]) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 18 }}>{icon}</span>
              <span style={{ color: "#a0a0c0", fontSize: 14 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div style={{ width: 480, minWidth: 340, display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 56px", background: "#0e0e1c" }}>

        <h2 style={{ fontSize: 30, fontWeight: 800, color: "#f0f0ff", margin: "0 0 6px", letterSpacing: -0.5 }}>
          {mode === "login" ? "Welcome back" : "Create account"}
        </h2>
        <p style={{ color: "#6b6b8a", margin: "0 0 32px", fontSize: 14 }}>
          {mode === "login" ? "Sign in to your account." : "Start tracking in under a minute."}
        </p>

        {mode === "register" && (
          <Field label="Full name" value={name} onChange={setName} error={errors.name} icon="👤" />
        )}
        <Field label="Email address" type="email" value={email} onChange={setEmail} error={errors.email} icon="✉️" />
        <Field label="Password" type="password" value={password} onChange={setPassword} error={errors.password} icon="🔑" />

        {serverError && (
          <div style={{ background: "rgba(231,76,60,0.1)", border: "1px solid rgba(231,76,60,0.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, color: "#e74c3c", fontSize: 13 }}>
            ⚠️ {serverError}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%", padding: "14px 0", borderRadius: 50, border: "none",
            background: loading ? "#3a2a5a" : "linear-gradient(90deg, #c084fc, #818cf8)",
            color: "#fff", fontSize: 15, fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: 20, opacity: loading ? 0.7 : 1, transition: "opacity .2s",
          }}
        >
          {loading ? "Please wait…" : mode === "login" ? "Sign in →" : "Create account →"}
        </button>

        <p style={{ textAlign: "center", color: "#6b6b8a", fontSize: 13, margin: 0 }}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button onClick={switchMode} style={{
            background: "none", border: "none", color: "#c084fc",
            cursor: "pointer", fontSize: 13, fontWeight: 700, padding: 0,
          }}>
            {mode === "login" ? "Sign up free" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}