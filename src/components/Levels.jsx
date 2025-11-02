import React from "react";

export default function Levels({ stageIndex, levels, onStart }) {
  return (
    <section className="card">
      <h2>Stage {stageIndex+1} — Levels</h2>
      <div className="levels-grid">
        {levels.map((txt, i) => (
          <div className="level-card" key={i}>
            <div className="level-num">Level {i+1}</div>
            <p className="excerpt">{txt.slice(0,80)}{txt.length>80?"...":""}</p>
            <button onClick={() => onStart(i)}>Play</button>
          </div>
        ))}
      </div>
    </section>
  );
}
