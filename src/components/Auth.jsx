import React, { useState } from "react";

export default function Auth({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState("login"); // login | signup
  const [msg, setMsg] = useState("");

  async function signup() {
    const res = await fetch("/.netlify/functions/signup", {
      method: "POST", headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ email, password: pass, name })
    });
    const data = await res.json();
    if (res.ok) {
      setMsg("Signup success — you can login now.");
      setMode("login");
    } else setMsg(data.error || "Error");
  }

  async function login() {
    const res = await fetch("/.netlify/functions/login", {
      method: "POST", headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ email, password: pass })
    });
    const data = await res.json();
    if (res.ok) {
      onLogin({ email: data.email, name: data.name, userId: data.userId || ("u_"+Date.now()) });
    } else setMsg(data.error || "Login failed");
  }

  return (
    <section className="card">
      <h2>{mode==="login"?"Login":"Sign up"}</h2>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      {mode==="signup" && <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />}
      <input placeholder="Password" type="password" value={pass} onChange={e=>setPass(e.target.value)} />
      <div className="auth-actions">
        {mode==="login" ? <button onClick={login}>Login</button> : <button onClick={signup}>Sign up</button>}
        <button onClick={()=>setMode(mode==="login"?"signup":"login")}>{mode==="login"?"Switch to signup":"Switch to login"}</button>
      </div>
      {msg && <p className="msg">{msg}</p>}
    </section>
  );
}
