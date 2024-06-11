import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import "./App.css";

function createSampleData(num = 100, a = 2, b = 3, random = 5) {
  return new Array(num).fill(0).map((_, i) => {
    return {
      x: i,
      y: a * i + b + Math.random() * random * 2 - random,
    };
  });
}

function App() {
  return <div></div>;
}

export default App;
