import * as tf from "@tensorflow/tfjs";
import Graph from "./Graph.jsx";
import "./App.scss";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { useState } from "react";

function createSampleData(num = 100, a = 2, b = 3, random = 0) {
  return new Array(num).fill(0).map((_, i) => {
    return {
      x: i,
      y: a * i + b + Math.random() * random * 2 - random,
    };
  });
}

function convertToTensor(data) {
  return tf.tidy(() => {
    tf.util.shuffle(data);

    const inputs = data.map(d => d.x);
    const labels = data.map(d => d.y);

    const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
    const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

    const inputMax = inputTensor.max();
    const inputMin = inputTensor.min();
    const labelMax = labelTensor.max();
    const labelMin = labelTensor.min();

    const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
    const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));
    return {
      inputs: normalizedInputs,
      labels: normalizedLabels,
      inputMax,
      inputMin,
      labelMax,
      labelMin,
    }
  })
}

async function trainModel(model, inputs, labels) {
  model.compile({
    optimizer: tf.train.adam(),
    loss: tf.losses.meanSquaredError,
    metrics: ["mse"],
  })
  const batchSize = 32;
  const epochs = 50;

  return await model.fit(inputs, labels, {
    batchSize,
    epochs,
    shuffle: true,
  })
}

async function training(dataSet, model) {
  const tensorData = convertToTensor(dataSet);
  const { inputs, labels } = tensorData;
  await trainModel(model, inputs, labels);
}


function App() {
  const [dataSet] = useState(createSampleData(100, 2, 3, 0));
  // シーケンシャルモデルを作成
  const model = tf.sequential();
  // 入力層を追加
  model.add(tf.layers.dense({ units: 1, inputShape: [1], useBias: true }));
  // 出力層を追加
  model.add(tf.layers.dense({ units: 1, useBias: true }));


  return (
    <Container fluid>
      <Graph dataSet={dataSet} />
      <Button
        onClick={() => { training(dataSet, model) }}
      >学習開始</Button>
    </Container>
  );
}

export default App;
