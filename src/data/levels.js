// src/data/levels.js
const baseShort = [
  "The quick fox jumps.",
  "Type fast to win this round.",
  "Practice daily to improve.",
  "Hello world.",
  "Small words build speed."
];

// helper to create longer text
function makeSentence(words) {
  return words.join(" ");
}

// create stage templates
function makeLevels(stageIdx) {
  const levels = [];
  const base = 5 + stageIdx * 5; // words count baseline
  for (let level = 1; level <= 10; level++) {
    const wordCount = base + level * 3;
    const words = [];
    for (let i = 0; i < wordCount; i++) {
      // vary vocabulary and punctuation
      const w = (i % 7 === 0) ? "speed," : (i % 11 === 0) ? "accuracy." : ["type","practice","keyboard","quick","press","learn","master","improve","skill","engine"][i % 10];
      // add capital occasionally
      words.push((i % 13 === 0) ? w.charAt(0).toUpperCase() + w.slice(1) : w);
    }
    // Insert occasional numbers and symbols for higher stages
    if (stageIdx >= 2) words[Math.floor(wordCount/3)] += " 123";
    if (stageIdx >= 3) words[Math.floor(wordCount/2)] += " #!";

    levels.push(makeSentence(words));
  }
  return levels;
}

const stages = [0,1,2,3].map(i => makeLevels(i));
export default stages;
