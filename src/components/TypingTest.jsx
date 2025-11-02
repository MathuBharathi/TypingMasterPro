import React, { useState, useEffect, useRef } from "react";

function calcAccuracy(correctChars, totalChars) {
  if (totalChars === 0) return 0;
  return Math.round((correctChars / totalChars) * 100);
}
function calcWPM(charsTyped, elapsedSeconds) {
  if (elapsedSeconds === 0) return 0;
  const words = charsTyped / 5;
  return Math.round((words / (elapsedSeconds / 60)));
}

export default function TypingTest({ text, timeLimit = 60, onFinish }) {
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [started, setStarted] = useState(false);
  const startTs = useRef(null);

  useEffect(() => {
    if (!started) return;
    const t = setInterval(() => {
      setTimeLeft(t0 => {
        if (t0 <= 1) {
          clearInterval(t);
          finish();
          return 0;
        }
        return t0 - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [started]);

  function handleInput(e) {
    if (!started) {
      setStarted(true);
      startTs.current = Date.now();
    }
    setInput(e.target.value);
  }

  function finish() {
    const elapsed = ((Date.now() - (startTs.current || Date.now())) / 1000) || (timeLimit - timeLeft);
    const totalChars = input.length;
    const correctChars = input.split("").reduce((acc, ch, i) => acc + (text[i] === ch ? 1 : 0), 0);
    const accuracy = calcAccuracy(correctChars, Math.max(1, totalChars));
    const wpm = calcWPM(totalChars, Math.max(1, elapsed));
    onFinish({ wpm, accuracy, elapsed, totalChars, timeLimit });
  }

  const highlighted = text.split("").map((ch,i) => {
    const typed = input[i];
    const cls = typed == null ? "" : (typed === ch ? "ok" : "bad");
    return <span key={i} className={cls}>{ch}</span>;
  });

  return (
    <section className="card typing">
      <h2>Typing Test</h2>
      <div className="text-box">{highlighted}</div>
      <textarea value={input} onChange={handleInput} placeholder="Start typing here..." rows={6} />
      <div className="status">
        <div>Time left: {timeLeft}s</div>
        <div>Chars: {input.length}</div>
        <div><button onClick={finish}>Finish Now</button></div>
      </div>
    </section>
  );
}
