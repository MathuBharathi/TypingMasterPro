import React from "react";
const labels = ["Beginner (1-10)","Intermediate (11-20)","Advanced (21-30)","Pro (31-40)"];

export default function Stages({ onChoose }) {
  return (
    <section className="card">
      <h2>Select a Stage</h2>
      <div className="grid">
        {labels.map((l,i) => (
          <div key={i} className="stage-card">
            <h3>{l}</h3>
            <p>10 levels — gradually increasing complexity.</p>
            <button onClick={() => onChoose(i)}>Enter</button>
          </div>
        ))}
      </div>
    </section>
  );
}
