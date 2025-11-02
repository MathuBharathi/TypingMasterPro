import React, { useEffect, useState } from "react";
import { saveUserData } from "../api/sheetApi";



export default function Dashboard({ user }) {
  const [perf, setPerf] = useState([]);
  const [performance, setPerformance] = useState({ wpm: 75, accuracy: 95 });

  useEffect(() => {
    if (!user?.userId) return;
    // Implement a function on server to read user performance if desired.
    // For demo, we won't fetch, but show placeholder
    // fetch('/.netlify/functions/getPerformance', {...})
    setPerf([]); // placeholder
  }, [user]);

  const saveProgress = async () => {
    const userData = {
      email: user.email,
      password: user.password,
      stage: 2,
      level: 10,
      wpm: performance.wpm,
      accuracy: performance.accuracy,
      avg: (performance.wpm * performance.accuracy) / 100,
    };
    await saveUserData(userData);
    alert("Progress saved successfully!");
  };

  return (
    <section className="card p-5">
      <h2>Dashboard</h2>
      {user ? (
        <>
          <p>Welcome, {user.name || user.email}</p>
          <div className="stats">
            <div className="stat">Home: Quick start</div>
            <div className="stat">Your Performance: (saved runs will appear here)</div>
            <div className="stat">Average Performance: —</div>
          </div>
          <p className="hint">Your performance is saved after each run (requires login).</p>

          <div className="mt-5">
            <p>WPM: {performance.wpm}</p>
            <p>Accuracy: {performance.accuracy}%</p>
            <button
              onClick={saveProgress}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Save Progress
            </button>
          </div>
        </>
      ) : (
        <p>Please login to save & view your performance.</p>
      )}
    </section>
  );
}
