import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || '/api';

const GRADIENT = "linear-gradient(120deg, #6366f1, #8b5cf6, #d946ef)";

function Field({ label, type = "text", value, onChange, error, icon }) {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (show ? "text" : "password") : type;
  const active = focused || value.length > 0;
  return (
    <div style={{ position: "relative", marginBottom: 18 }}>
      <div style={{
        display: "flex", alignItems: "center",
        borderRadius: 14,
        background: focused ? "#ffffff" : "#f3f4fb",
        border: `1.5px solid ${error ? "#ef4444" : focused ? "#6366f1" : "#e3e5f2"}`,
        boxShadow: focused ? "0 0 0 4px rgba(99,102,241,0.12), 0 4px 18px rgba(99,102,241,0.12)" : "none",
        transition: "all .2s",
      }}>
        <span style={{ padding: "0 0 0 16px", color: focused ? "#6366f1" : "#9396b2", fontSize: 16 }}>{icon}</span>
        <div style={{ flex: 1, position: "relative", height: 54 }}>
          <label style={{
            position: "absolute", left: 12,
            top: active ? 8 : "50%",
            transform: active ? "none" : "translateY(-50%)",
            fontSize: active ? 10 : 14,
            color: error ? "#ef4444" : focused ? "#6366f1" : "#9396b2",
            transition: "all .18s", pointerEvents: "none",
            letterSpacing: active ? 1 : 0,
            textTransform: active ? "uppercase" : "none",
            fontWeight: active ? 600 : 400,
          }}>{label}</label>
          <input
            type={inputType} value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              position: "absolute", bottom: 0, left: 12, right: isPassword ? 40 : 0, height: 32,
              background: "transparent", border: "none", outline: "none",
              color: "#191a2f", fontSize: 15, width: isPassword ? "calc(100% - 52px)" : "calc(100% - 12px)",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          />
        </div>
        {isPassword && (
          <button
            type="button"
            tabIndex="-1"
            onClick={() => setShow(s => !s)}
            style={{
              width: 44, height: 44, border: "none", background: "transparent",
              cursor: "pointer", fontSize: 16, color: focused ? "#6366f1" : "#9396b2",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
            title={show ? "Hide password" : "Show password"}
          >
            {show ? "🙈" : "👁️"}
          </button>
        )}
      </div>
      {error && <p style={{ color: "#ef4444", fontSize: 11, margin: "5px 0 0 4px" }}>{error}</p>}
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
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 15000)
      const r = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      })
      clearTimeout(timer)
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

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSubmit(); };

  return (
    <div style={{
      minHeight: "100vh", background: "#f4f5fb",
      backgroundImage:
        "radial-gradient(1000px 560px at 85% -5%, rgba(129,140,248,0.22), transparent 60%)," +
        "radial-gradient(800px 500px at -5% 35%, rgba(232,121,249,0.14), transparent 60%)," +
        "radial-gradient(900px 650px at 50% 118%, rgba(34,211,238,0.16), transparent 60%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, position: "relative", overflow: "hidden",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>

      {/* Floating decorative orbs */}
      <div style={{ position: "absolute", width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle, rgba(129,140,248,0.3) 0%, transparent 70%)", filter: "blur(60px)", top: -80, left: -60, pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,211,238,0.28) 0%, transparent 70%)", filter: "blur(60px)", bottom: -60, right: -40, pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,121,249,0.24) 0%, transparent 70%)", filter: "blur(60px)", top: "50%", left: "8%", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}>
        <div style={{
          position: "relative", overflow: "hidden",
          background: "rgba(255,255,255,0.92)", border: "1px solid rgba(99,102,241,0.16)",
          borderRadius: 24, padding: "40px 38px 32px",
          backdropFilter: "blur(16px)",
          boxShadow: "0 30px 80px rgba(40,44,96,0.18), 0 0 44px rgba(99,102,241,0.08)",
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: GRADIENT }} />

          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 28 }}>
            <div style={{ width: 38, height: 38, background: GRADIENT, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#fff", fontWeight: 700, boxShadow: "0 8px 22px rgba(99,102,241,0.4)" }}>₹</div>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#191a2f", fontFamily: "'Sora', sans-serif" }}>
              Spend<span style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Wise</span>
            </span>
          </div>

          <h2 style={{ fontSize: 26, fontWeight: 700, color: "#191a2f", margin: "0 0 6px", letterSpacing: -0.5, fontFamily: "'Sora', sans-serif", textAlign: "center" }}>
            {mode === "login" ? "Welcome back 👋" : "Create your account 🚀"}
          </h2>
          <p style={{ color: "#5c5e7a", margin: "0 0 28px", fontSize: 14, textAlign: "center" }}>
            {mode === "login" ? "Sign in to continue to SpendWise." : "Start tracking in under a minute."}
          </p>

          {mode === "register" && (
            <Field label="Full name" value={name} onChange={setName} error={errors.name} icon="👤" />
          )}
          <Field label="Email address" type="email" value={email} onChange={setEmail} error={errors.email} icon="✉️" />
          <Field label="Password" type="password" value={password} onChange={setPassword} error={errors.password} icon="🔑" />

          {serverError && (
            <div style={{
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.24)",
              borderRadius: 12, padding: "10px 14px", marginBottom: 16, color: "#ef4444", fontSize: 13,
            }}>
              ⚠️ {serverError}
            </div>
          )}

          <button
            onClick={handleSubmit}
            onKeyDown={handleKeyDown}
            disabled={loading}
            style={{
              width: "100%", padding: "14px 0", borderRadius: 14, border: "none",
              background: loading ? "#a5a9c8" : GRADIENT,
              backgroundSize: loading ? undefined : "180% 180%",
              color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif",
              cursor: loading ? "not-allowed" : "pointer",
              marginBottom: 20, opacity: loading ? 0.75 : 1,
              boxShadow: "0 10px 26px rgba(99,102,241,0.4)",
              transition: "transform .2s, box-shadow .2s",
              position: "relative", overflow: "hidden",
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 14px 34px rgba(139,92,246,0.45)"; } }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 10px 26px rgba(99,102,241,0.4)"; }}
          >
            {loading ? "Please wait…" : mode === "login" ? "Sign in →" : "Create account →"}
          </button>

          <p style={{ textAlign: "center", color: "#5c5e7a", fontSize: 13, margin: 0 }}>
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

        <p style={{ textAlign: "center", color: "#9396b2", fontSize: 12, marginTop: 18, letterSpacing: 0.02 }}>
          💸 Track every rupee · Secured with JWT
        </p>
      </div>
    </div>
  );
}
