import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || '/api';

const GRADIENT = "linear-gradient(120deg, #8b5cf6, #d946ef, #22d3ee)";

function Field({ label, type = "text", value, onChange, error, icon }) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  return (
    <div style={{ position: "relative", marginBottom: 18 }}>
      <div style={{
        display: "flex", alignItems: "center",
        borderRadius: 14,
        background: "rgba(255,255,255,0.05)",
        border: `1.5px solid ${error ? "#fb7185" : focused ? "#a78bfa" : "rgba(255,255,255,0.1)"}`,
        boxShadow: focused ? "0 0 0 4px rgba(167,139,250,0.14), 0 0 24px rgba(139,92,246,0.18)" : "none",
        transition: "all .2s",
        backdropFilter: "blur(10px)",
      }}>
        <span style={{ padding: "0 0 0 16px", color: focused ? "#c4b5fd" : "#6d6b8f", fontSize: 16 }}>{icon}</span>
        <div style={{ flex: 1, position: "relative", height: 54 }}>
          <label style={{
            position: "absolute", left: 12,
            top: active ? 8 : "50%",
            transform: active ? "none" : "translateY(-50%)",
            fontSize: active ? 10 : 14,
            color: focused ? "#c4b5fd" : "#6d6b8f",
            transition: "all .18s", pointerEvents: "none",
            letterSpacing: active ? 1 : 0,
            textTransform: active ? "uppercase" : "none",
            fontWeight: active ? 600 : 400,
          }}>{label}</label>
          <input
            type={type} value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              position: "absolute", bottom: 0, left: 12, right: 0, height: 32,
              background: "transparent", border: "none", outline: "none",
              color: "#f4f2ff", fontSize: 15, width: "calc(100% - 12px)",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          />
        </div>
      </div>
      {error && <p style={{ color: "#fb7185", fontSize: 11, margin: "5px 0 0 4px" }}>{error}</p>}
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
    <div style={{
      minHeight: "100vh", background: "#06050d",
      backgroundImage:
        "radial-gradient(1100px 600px at 85% -10%, rgba(139,92,246,0.18), transparent 60%)," +
        "radial-gradient(800px 500px at -10% 40%, rgba(217,70,239,0.12), transparent 60%)," +
        "radial-gradient(900px 700px at 50% 120%, rgba(34,211,238,0.10), transparent 60%)",
      display: "flex", fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>

      {/* ── Left branding panel ── */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "60px 80px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)", filter: "blur(60px)", top: -120, left: -100, pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,211,238,0.28) 0%, transparent 70%)", filter: "blur(60px)", bottom: -80, right: 40, pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 72 }}>
            <div style={{ width: 40, height: 40, background: GRADIENT, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, color: "#fff", fontWeight: 700, boxShadow: "0 8px 24px rgba(139,92,246,0.5)" }}>₹</div>
            <span style={{ fontSize: 21, fontWeight: 800, color: "#f4f2ff", fontFamily: "'Sora', sans-serif" }}>
              Spend<span style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Wise</span>
            </span>
          </div>

          <h1 style={{ fontSize: 52, fontWeight: 800, color: "#f4f2ff", lineHeight: 1.12, margin: "0 0 22px", letterSpacing: -1.5, fontFamily: "'Sora', sans-serif" }}>
            Every rupee,
            <br />
            <span style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              accounted for.
            </span>
          </h1>

          <p style={{ color: "#a8a6c9", fontSize: 15, lineHeight: 1.8, maxWidth: 400, margin: "0 0 44px" }}>
            Track spending across categories, set budgets, and understand your financial patterns — all in one place.
          </p>

          {[
            ["📊", "Visual analytics by category and month"],
            ["🔔", "Budget alerts before you overspend"],
            ["🔒", "JWT-secured, your data stays private"],
          ].map(([icon, text]) => (
            <div key={text} style={{
              display: "flex", alignItems: "center", gap: 14, marginBottom: 12,
              padding: "13px 18px", borderRadius: 14,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(10px)", maxWidth: 420,
              transition: "transform .2s", cursor: "default",
            }} onMouseEnter={e => e.currentTarget.style.transform = "translateX(6px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "none"}>
              <span style={{ fontSize: 18, filter: "drop-shadow(0 4px 10px rgba(139,92,246,0.4))" }}>{icon}</span>
              <span style={{ color: "#b9b7d8", fontSize: 14 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div style={{
        width: 500, minWidth: 360, display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "60px 52px",
      }}>
        <div style={{
          position: "relative", overflow: "hidden",
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 24, padding: "40px 38px",
          backdropFilter: "blur(16px)", boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 44px rgba(139,92,246,0.15)",
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: GRADIENT }} />

          <h2 style={{ fontSize: 30, fontWeight: 700, color: "#f4f2ff", margin: "0 0 8px", letterSpacing: -0.6, fontFamily: "'Sora', sans-serif" }}>
            {mode === "login" ? "Welcome back" : "Create account"}
          </h2>
          <p style={{ color: "#a8a6c9", margin: "0 0 30px", fontSize: 14 }}>
            {mode === "login" ? "Sign in to your account." : "Start tracking in under a minute."}
          </p>

          {mode === "register" && (
            <Field label="Full name" value={name} onChange={setName} error={errors.name} icon="👤" />
          )}
          <Field label="Email address" type="email" value={email} onChange={setEmail} error={errors.email} icon="✉️" />
          <Field label="Password" type="password" value={password} onChange={setPassword} error={errors.password} icon="🔑" />

          {serverError && (
            <div style={{
              background: "rgba(251,113,133,0.1)", border: "1px solid rgba(251,113,133,0.28)",
              borderRadius: 12, padding: "10px 14px", marginBottom: 16, color: "#fb7185", fontSize: 13,
            }}>
              ⚠️ {serverError}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%", padding: "14px 0", borderRadius: 14, border: "none",
              background: loading ? "#3a2a5a" : GRADIENT,
              backgroundSize: loading ? undefined : "180% 180%",
              color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif",
              cursor: loading ? "not-allowed" : "pointer",
              marginBottom: 20, opacity: loading ? 0.7 : 1,
              boxShadow: "0 10px 28px rgba(139,92,246,0.4)",
              transition: "transform .2s, box-shadow .2s",
              position: "relative", overflow: "hidden",
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 14px 34px rgba(217,70,239,0.5)"; } }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(139,92,246,0.4)"; }}
          >
            {loading ? "Please wait…" : mode === "login" ? "Sign in →" : "Create account →"}
          </button>

          <p style={{ textAlign: "center", color: "#a8a6c9", fontSize: 13, margin: 0 }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button onClick={switchMode} style={{
              background: "none", border: "none",
              backgroundImage: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              cursor: "pointer", fontSize: 13, fontWeight: 700, padding: 0,
            }}>
              {mode === "login" ? "Sign up free" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
