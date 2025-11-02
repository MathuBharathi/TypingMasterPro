import React from "react";
export default function Landing({ onStart }) {
  return (
    <section className="card">
      <h2>Start improving your typing speed</h2>
      <p>Progress through 4 stages and 40 levels. Unlock new levels as you pass each one.</p>
      <div className="actions">
        <button onClick={onStart}>Start — Choose Stage</button>
      </div>
    </section>
  );
}
