import React, { useState, useEffect } from "react";
import Landing from "./components/Landing";
import Stages from "./components/Stages";
import Levels from "./components/Levels";
import TypingTest from "./components/TypingTest";
import Dashboard from "./components/Dashboard";
import Auth from "./components/Auth";
import levelsData from "./data/levels";

export default function App() {
  const [route, setRoute] = useState("landing"); // landing | stages | levels | test | dashboard | auth
  const [stageIndex, setStageIndex] = useState(0);
  const [levelIndex, setLevelIndex] = useState(0);
  const [user, setUser] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem("tm_user");
    if (u) setUser(JSON.parse(u));
  }, []);

  function startLevel(sIdx, lIdx) {
    setStageIndex(sIdx);
    setLevelIndex(lIdx);
    setRoute("test");
  }

  function onFinish(result) {
    setLastResult(result);
    // save performance to server
    if (user?.userId) {
      fetch("/.netlify/functions/savePerformance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.userId,
          stage: s(stageIndex),
          level: levelIndex + 1,
          wpm: result.wpm,
          accuracy: result.accuracy,
          timeLimit: result.timeLimit
        })
      }).catch(console.error);
    }
    setRoute("levels");
  }

  function s(idx) { return ["Beginner","Intermediate","Advanced","Pro"][idx] || "Stage"; }

  return (
    <div className="app">
      <header className="topbar">
        <h1 onClick={() => setRoute("landing")}>TypeMaster Pro</h1>
        <nav>
          <button onClick={() => setRoute("landing")}>Home</button>
          <button onClick={() => setRoute("stages")}>Stages</button>
          <button onClick={() => setRoute("dashboard")}>Dashboard</button>
          <button onClick={() => setRoute("auth")}>{user ? user.name : "Login"}</button>
        </nav>
      </header>

      <main>
        {route === "landing" && <Landing onStart={() => setRoute("stages")} />}
        {route === "stages" && <Stages onChoose={(i)=>{ setStageIndex(i); setRoute("levels"); }} />}
        {route === "levels" && <Levels stageIndex={stageIndex} onStart={(l)=>startLevel(stageIndex,l)} levels={levelsData[stageIndex]} />}
        {route === "test" && <TypingTest text={levelsData[stageIndex][levelIndex]} timeLimit={60} onFinish={onFinish} />}
        {route === "dashboard" && <Dashboard user={user} />}
        {route === "auth" && <Auth onLogin={(u)=>{ setUser(u); localStorage.setItem('tm_user', JSON.stringify(u)); setRoute("stages"); }} />}
      </main>

      <footer className="footer">TypeMaster Pro — Improve your typing, level by level.</footer>
    </div>
  );
}
